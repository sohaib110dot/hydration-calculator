import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { useTodayLog, useIncrementLog, useDecrementLog } from "@/hooks/use-logs";
import { useReminderNotification } from "@/hooks/use-notification";
import { WaterRing } from "@/components/WaterRing";
import { Timetable } from "@/components/Timetable";
import { Navbar } from "@/components/Navbar";
import { Droplet, LogOut, Plus, Minus, Info } from "lucide-react";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <DashboardContent />
    </div>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const { data: profile } = useProfile();
  const { data: log } = useTodayLog();
  
  const dailyLiters = profile ? parseFloat(profile.dailyLiters) : 0;
  const totalGlasses = Math.ceil(dailyLiters * 4); // 250ml per glass
  const completedGlasses = log?.completedGlasses || 0;
  
  // Water amounts in ML (1 glass = 250ml)
  const completedMl = completedGlasses * 250;
  const totalMl = totalGlasses * 250;
  const hydrationPercentage = totalMl > 0 ? Math.min(Math.round((completedMl / totalMl) * 100), 100) : 0;

  const { mutate: increment, isPending: incPending } = useIncrementLog(totalGlasses);
  const { mutate: decrement, isPending: decPending } = useDecrementLog();

  // Get current streak and premium status from profile
  const currentStreak = profile?.currentStreak || 0;
  const isFreeUser = !profile?.isPremium;

  // Upgrade handler - redirect to Stripe checkout
  const [isUpgrading, setIsUpgrading] = useState(false);
  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // Create Stripe checkout session
      const res = await fetch("/api/profile/checkout", { 
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        const { sessionId } = await res.json();
        // Redirect to Stripe checkout using stripe.com hosted page
        if (typeof window !== "undefined" && sessionId) {
          // Store session ID for after payment
          sessionStorage.setItem("stripe_session_id", sessionId);
          // Redirect directly to Stripe checkout hosted page
          window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
        }
      }
    } catch (err) {
      console.error("Upgrade failed:", err);
      setIsUpgrading(false);
    }
  };

  // Check for Stripe success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id") || sessionStorage.getItem("stripe_session_id");
    
    if (params.get("stripe_success") && sessionId) {
      // Confirm payment with backend
      const confirmPayment = async () => {
        try {
          await fetch("/api/profile/checkout-success", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ sessionId })
          });
          sessionStorage.removeItem("stripe_session_id");
          // Refresh to show premium status
          window.location.href = "/";
        } catch (err) {
          console.error("Payment confirmation failed:", err);
        }
      };
      confirmPayment();
    }
  }, []);

  // Format next reminder time
  const formatReminderTime = (isoString: string | null | undefined) => {
    if (!isoString) return null;
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
      return null;
    }
  };

  const nextReminderTime = formatReminderTime(log?.nextReminderTime);

  // Calculate remaining minutes for reminder
  const [remainingMinutes, setRemainingMinutes] = useState<number | null>(null);

  useEffect(() => {
    const updateRemainingTime = () => {
      if (!log?.nextReminderTime) {
        setRemainingMinutes(null);
        return;
      }

      try {
        const nextReminderDate = new Date(log.nextReminderTime);
        const now = new Date();
        const diffMs = nextReminderDate.getTime() - now.getTime();

        if (diffMs <= 0) {
          setRemainingMinutes(0);
        } else {
          const minutes = Math.ceil(diffMs / (1000 * 60));
          setRemainingMinutes(minutes);
        }
      } catch {
        setRemainingMinutes(null);
      }
    };

    // Update immediately
    updateRemainingTime();

    // Update every minute
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, [log?.nextReminderTime]);

  // Set up browser notification for reminder
  useReminderNotification(log?.nextReminderTime);

  if (!profile) return null; // Handled by App.tsx router

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Dashboard Header Wave */}
      <div className="bg-primary pt-12 pb-24 px-6 md:px-12 rounded-b-[3rem] shadow-xl shadow-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="max-w-5xl mx-auto flex justify-between items-start relative z-10">
          <div>
            <p className="text-primary-foreground/80 font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl md:text-4xl font-black text-white font-display tracking-tight">
              {user?.firstName || 'Hydrator'}!
            </h1>
          </div>
          <button 
            onClick={() => logout()}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Progress & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Main Tracker Card */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-primary/5 border border-border/50 text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold rounded-full mb-8">
                <Droplet className="w-4 h-4 fill-current" />
                Daily Goal: {dailyLiters.toFixed(2)}L ({totalMl}ml)
              </div>

              <WaterRing 
                completed={completedGlasses} 
                total={totalGlasses} 
                size={300} 
                strokeWidth={28}
              />

              {/* Water Stats Display */}
              <div className="mt-8 text-center">
                <p className="text-xl font-bold text-foreground">
                  {completedMl.toLocaleString()}ml of {totalMl.toLocaleString()}ml
                </p>
                <p className="text-lg text-primary font-semibold mt-2">
                  {hydrationPercentage === 100 ? '🎉 Goal achieved!' : `You are ${hydrationPercentage}% hydrated today 💧`}
                </p>
                {currentStreak > 0 && (
                  <p className="text-lg font-bold text-amber-500 mt-3">
                    🔥 Current streak: {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                  </p>
                )}
                {currentStreak > 0 && currentStreak < 3 && (
                  <p className="text-sm text-muted-foreground mt-1">Don't break your streak! 💪</p>
                )}
                {nextReminderTime && (
                  <div className="text-sm text-muted-foreground mt-4 space-y-1">
                    <p>Next drink at: <span className="font-semibold text-foreground">{nextReminderTime}</span></p>
                    {remainingMinutes !== null && (
                      <p>Remaining time: <span className="font-semibold text-primary">{remainingMinutes} {remainingMinutes === 1 ? 'minute' : 'minutes'}</span></p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-12 flex items-center justify-center gap-6">
                <button
                  onClick={() => decrement()}
                  disabled={completedGlasses === 0 || decPending}
                  className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                  data-testid="button-decrement"
                >
                  <Minus className="w-8 h-8" />
                </button>
                
                <button
                  onClick={() => increment()}
                  disabled={incPending}
                  className="w-24 h-24 rounded-full bg-primary text-white hover:bg-blue-600 shadow-xl shadow-primary/40 hover:shadow-2xl hover:shadow-primary/50 flex items-center justify-center transition-all active:scale-95 group"
                  data-testid="button-add-water"
                >
                  <Plus className="w-12 h-12 group-hover:scale-110 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Info Snippet */}
            <div className="bg-accent/50 rounded-2xl p-6 flex items-start gap-4">
              <div className="p-2 bg-white rounded-full text-primary shrink-0 shadow-sm">
                <Info className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed">
                Your goal is customized based on your weight ({profile.weight}kg), {profile.activity.toLowerCase()} activity level, and the {profile.season.toLowerCase()} season. One glass equals 250ml.
              </p>
            </div>

            {/* Premium Lock Message */}
            {isFreeUser && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-primary/20 flex items-start gap-4">
                <div className="p-2 bg-white rounded-full text-primary shrink-0 shadow-sm">
                  <Droplet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground mb-2">
                    Upgrade to unlock full hydration history
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    See your last 3+ days of water tracking, advanced analytics, and more.
                  </p>
                  <button 
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    data-testid="button-upgrade"
                  >
                    {isUpgrading ? "Upgrading..." : "Upgrade Now"}
                  </button>
                </div>
              </div>
            )}
            
          </div>

          {/* Right Column: Schedule */}
          <div className="lg:col-span-5">
            <Timetable 
              wakeTime={profile.wakeTime}
              sleepTime={profile.sleepTime}
              totalGlasses={totalGlasses}
              completedGlasses={completedGlasses}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
