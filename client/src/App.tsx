import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";

import NotFound from "@/pages/not-found";
import { Landing } from "@/pages/Landing";
import { ProfileSetup } from "@/pages/ProfileSetup";
import { Dashboard } from "@/pages/Dashboard";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";
import { Calculator } from "@/pages/Calculator";
import { AdminReplies } from "@/pages/AdminReplies";
import { Disclaimer } from "@/pages/Disclaimer";

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();
  
  // Only try to fetch profile if user is logged in
  const { data: profile, isLoading: profileLoading } = useProfile(!!user);

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Loading your hydration data...</p>
      </div>
    );
  }

  // Routing Logic
  // 1. Not logged in -> Landing
  if (!user) {
    return <Landing />;
  }

  // 2. Logged in, but no profile -> Profile Setup
  if (!profile) {
    return <ProfileSetup />;
  }

  // 3. Logged in and has profile -> Dashboard
  return <Dashboard />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Switch>
          {/* Public pages */}
          <Route path="/" component={Home} />
          <Route path="/calculator" component={Calculator} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/admin/replies" component={AdminReplies} />
          
          {/* App routes - user auth required */}
          <Route path="/dashboard" component={AppContent} />
          
          {/* Catch-all route */}
          <Route component={NotFound} />
        </Switch>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
