import React from "react";
import { Droplet, Activity, Clock, ShieldCheck, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden relative">
      <Navbar />
      {/* Abstract Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-[40rem] -right-[40rem] w-[80rem] h-[80rem] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10 pt-12 pb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 animate-fade-in">
          <Droplet className="w-4 h-4 fill-current" />
          <span>Stay hydrated every day 💧</span>
        </div>
        
        <h1 className="max-w-4xl text-5xl md:text-7xl font-black text-foreground font-display leading-[1.1] tracking-tight mb-8">
          Your Personal <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            Hydration Assistant
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-medium mb-10 leading-relaxed">
          Calculate your exact daily water needs based on your body, activity, and the weather. Let AquaTrack build your perfect hydration timetable.
        </p>
        
        <a 
          href="/api/login"
          className="group px-8 py-4 rounded-full font-bold text-lg bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
        >
          Get Started Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </a>

        {/* Feature Cards Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full text-left">
          <FeatureCard 
            icon={<Activity />}
            title="Smart Calculation"
            description="We calculate your ideal water intake using your weight, activity level, and local season."
          />
          <FeatureCard 
            icon={<Clock />}
            title="Auto Timetable"
            description="Get a perfectly spaced hydration schedule between your wake and sleep times."
          />
          <FeatureCard 
            icon={<ShieldCheck />}
            title="Track Progress"
            description="Log your glasses throughout the day with a beautiful, satisfying interface."
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-primary/5 border border-border/50 hover:border-primary/20 transition-colors duration-300">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
    </div>
  );
}
