import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup auth first
  await setupAuth(app);
  registerAuthRoutes(app);

  function calculateWater(weight: number, activity: string, season: string): number {
    let base = weight * 0.033;
    if (activity === "Medium") base += 0.5;
    if (activity === "High") base += 1.0;
    if (season === "Summer") base += 0.7;
    if (season === "Winter") base -= 0.2;
    return Math.round(base * 4) / 4; // Round to nearest 0.25
  }

  app.post(api.contacts.create.path, async (req: any, res) => {
    try {
      const input = api.contacts.create.input.parse(req.body);
      console.log("Contact form submitted:", { name: input.name, email: input.email });

      // 1. Save to local PostgreSQL (primary — always reliable)
      const saved = await storage.saveContact(input.name, input.email, input.subject, input.message);
      console.log("Contact saved to local DB, id:", saved.id);

      // 2. Sync to Supabase contact_messages table (secondary — best effort)
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        const payload = {
          name: input.name,
          email: input.email,
          message: `${input.subject}: ${input.message}`,
          created_at: new Date().toISOString(),
        };
        fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseAnonKey}`,
            "apikey": supabaseAnonKey,
            "Prefer": "return=minimal",
          },
          body: JSON.stringify(payload),
        })
          .then(async (r) => {
            if (!r.ok) {
              const body = await r.text();
              console.warn("Supabase sync failed (non-fatal):", r.status, body);
            } else {
              console.log("Supabase sync successful");
            }
          })
          .catch((err) => console.warn("Supabase sync error (non-fatal):", err));
      }

      res.json({ id: saved.id });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error("Validation error:", err.errors);
        return res.status(400).json({ message: err.errors[0].message });
      }
      console.error("Unexpected error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/contacts", async (_req: any, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (err) {
      console.error("Failed to load contacts:", err);
      res.status(500).json({ message: "Failed to load contacts" });
    }
  });

  app.get("/api/admin/contacts/:id/replies", async (req: any, res) => {
    try {
      const contactId = parseInt(req.params.id, 10);
      if (isNaN(contactId)) return res.status(400).json({ message: "Invalid contact id" });
      const replies = await storage.getRepliesForContact(contactId);
      res.json(replies);
    } catch (err) {
      console.error("Failed to load replies:", err);
      res.status(500).json({ message: "Failed to load replies" });
    }
  });

  app.post("/api/admin/contacts/:id/replies", async (req: any, res) => {
    try {
      const contactId = parseInt(req.params.id, 10);
      if (isNaN(contactId)) return res.status(400).json({ message: "Invalid contact id" });
      const { replyText } = req.body;
      if (!replyText || typeof replyText !== "string" || replyText.trim().length === 0) {
        return res.status(400).json({ message: "Reply text is required" });
      }
      const reply = await storage.saveReply(contactId, replyText.trim());
      res.json(reply);
    } catch (err) {
      console.error("Failed to save reply:", err);
      res.status(500).json({ message: "Failed to save reply" });
    }
  });

  app.get(api.profiles.get.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const profile = await storage.getProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  });

  app.post(api.profiles.upsert.path, isAuthenticated, async (req: any, res) => {
    try {
      // Coerce weight to string since numeric is string in Drizzle but we want to handle number inputs
      // actually zod schema might expect string or number depending on numeric definition.
      // Drizzle numeric type produces string inferred type. We can use coercion in zod if needed.
      const rawInput = { ...req.body, weight: req.body.weight?.toString() };
      const input = api.profiles.upsert.input.parse(rawInput);
      const userId = req.user.claims.sub;
      const dailyLiters = calculateWater(Number(input.weight), input.activity, input.season);
      const profile = await storage.upsertProfile(userId, input, dailyLiters);
      res.json(profile);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.profiles.checkout.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const user = req.user;

    try {
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecret) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      // Get the deployed domain for redirect URLs
      const domain = process.env.REPLIT_DOMAINS || "localhost:5000";
      const protocol = domain.includes("localhost") ? "http" : "https";
      const baseUrl = `${protocol}://${domain}`;

      // Use Stripe API directly via fetch
      const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${stripeSecret}`,
        },
        body: new URLSearchParams({
          "payment_method_types[0]": "card",
          "line_items[0][price_data][currency]": "usd",
          "line_items[0][price_data][product_data][name]": "AquaTrack Premium",
          "line_items[0][price_data][product_data][description]": "Unlimited water tracking history",
          "line_items[0][price_data][unit_amount]": "999",
          "line_items[0][quantity]": "1",
          "mode": "payment",
          "success_url": `${baseUrl}?stripe_success=true&session_id={CHECKOUT_SESSION_ID}`,
          "cancel_url": `${baseUrl}?stripe_cancelled=true`,
          "metadata[userId]": userId,
          "metadata[email]": user.email || "",
        }),
      });

      if (!stripeResponse.ok) {
        const error = await stripeResponse.text();
        console.error("Stripe API error:", error);
        return res.status(500).json({ message: "Failed to create checkout session" });
      }

      const session = await stripeResponse.json() as any;
      res.json({ sessionId: session.id });
    } catch (err) {
      console.error("Checkout error:", err);
      res.status(500).json({ message: "Failed to create checkout session" });
    }
  });

  app.post(api.profiles.checkoutSuccess.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const { sessionId } = req.body;

    try {
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      if (!stripeSecret) {
        return res.status(500).json({ message: "Stripe not configured" });
      }

      // Verify the session with Stripe API
      const stripeResponse = await fetch(
        `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
        {
          headers: {
            "Authorization": `Bearer ${stripeSecret}`,
          },
        }
      );

      if (!stripeResponse.ok) {
        const error = await stripeResponse.text();
        console.error("Stripe API error:", error);
        return res.status(500).json({ message: "Failed to verify payment" });
      }

      const session = await stripeResponse.json() as any;

      if (session.payment_status !== "paid") {
        return res.status(400).json({ message: "Payment not completed" });
      }

      // Update local database
      const profile = await storage.upgradeProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Update Supabase users table if credentials exist
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseAnonKey) {
        try {
          await fetch(
            `${supabaseUrl}/rest/v1/users?id=eq.${userId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${supabaseAnonKey}`,
                "apikey": supabaseAnonKey,
                "Prefer": "return=representation"
              },
              body: JSON.stringify({ plan: "premium" })
            }
          );
        } catch (err) {
          console.error("Failed to update Supabase:", err);
          // Continue anyway - local database is updated
        }
      }

      res.json(profile);
    } catch (err) {
      console.error("Checkout success error:", err);
      res.status(500).json({ message: "Failed to process payment confirmation" });
    }
  });

  app.post(api.profiles.upgrade.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    
    // Update local database
    const profile = await storage.upgradeProfile(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update Supabase users table if credentials exist
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      try {
        await fetch(
          `${supabaseUrl}/rest/v1/users?id=eq.${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseAnonKey}`,
              "apikey": supabaseAnonKey,
              "Prefer": "return=representation"
            },
            body: JSON.stringify({ plan: "premium" })
          }
        );
      } catch (err) {
        console.error("Failed to update Supabase:", err);
        // Continue anyway - local database is updated
      }
    }

    res.json(profile);
  });

  app.get(api.logs.getToday.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const today = new Date().toISOString().split('T')[0];
    let log = await storage.getTodayLog(userId, today);
    if (!log) {
      log = await storage.createLog(userId, today);
    }
    res.json(log);
  });

  app.post(api.logs.increment.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const today = new Date().toISOString().split('T')[0];
    
    // Get user profile to get daily liter goal
    const profile = await storage.getProfile(userId);
    const dailyLiterGoal = profile ? parseFloat(profile.dailyLiters) : 2.75;
    
    let log = await storage.getTodayLog(userId, today);
    if (!log) {
      log = await storage.createLog(userId, today);
    }
    const updated = await storage.updateLogGlasses(log.id, log.completedGlasses + 1, userId, today, dailyLiterGoal);
    res.json(updated);
  });

  app.post(api.logs.decrement.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const today = new Date().toISOString().split('T')[0];
    
    // Get user profile to get daily liter goal
    const profile = await storage.getProfile(userId);
    const dailyLiterGoal = profile ? parseFloat(profile.dailyLiters) : 2.75;
    
    let log = await storage.getTodayLog(userId, today);
    if (!log) {
      log = await storage.createLog(userId, today);
    }
    const updated = await storage.updateLogGlasses(log.id, log.completedGlasses - 1, userId, today, dailyLiterGoal);
    res.json(updated);
  });

  return httpServer;
}
