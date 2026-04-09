import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpsertProfile } from "@/hooks/use-profile";
import { Navbar } from "@/components/Navbar";
import { Droplet, ArrowRight, User, Activity as ActivityIcon, SunMedium, Moon, Loader2 } from "lucide-react";

// Form Schema
const profileSchema = z.object({
  age: z.coerce.number().min(1, "Age is required").max(120),
  gender: z.string().min(1, "Gender is required"),
  weight: z.coerce.number().min(20, "Weight is required").max(300),
  activity: z.string().min(1, "Activity level is required"),
  season: z.string().min(1, "Season is required"),
  wakeTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Valid time required"),
  sleepTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/, "Valid time required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSetup() {
  const { mutate: upsertProfile, isPending } = useUpsertProfile();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: 25,
      gender: "Male",
      weight: 70,
      activity: "Medium",
      season: "Normal",
      wakeTime: "07:00",
      sleepTime: "23:00",
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    upsertProfile(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-2xl w-full z-10">
          <div className="text-center mb-10">
            <div className="inline-flex bg-white p-4 rounded-full shadow-xl shadow-primary/10 mb-6">
              <Droplet className="w-10 h-10 text-primary fill-current" />
            </div>
            <h1 className="text-4xl font-black text-foreground font-display tracking-tight">Let's Personalize You</h1>
            <p className="mt-3 text-lg text-muted-foreground font-medium">We need a few details to calculate your perfect daily hydration goal.</p>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl shadow-primary/5 border border-border/50 overflow-hidden">
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-8">
              
              {/* Section 1: Body */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground border-b pb-4">
                  <User className="w-5 h-5 text-primary" /> About You
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Age</label>
                    <input
                      type="number"
                      {...form.register("age")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="25"
                    />
                    {form.formState.errors.age && <p className="text-red-500 text-xs mt-1">{form.formState.errors.age.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Gender</label>
                    <select
                      {...form.register("gender")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                    {form.formState.errors.gender && <p className="text-red-500 text-xs mt-1">{form.formState.errors.gender.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      {...form.register("weight")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="70"
                    />
                    {form.formState.errors.weight && <p className="text-red-500 text-xs mt-1">{form.formState.errors.weight.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 2: Activity & Season */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground border-b pb-4">
                  <ActivityIcon className="w-5 h-5 text-primary" /> Lifestyle
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Activity Level</label>
                    <select
                      {...form.register("activity")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    {form.formState.errors.activity && <p className="text-red-500 text-xs mt-1">{form.formState.errors.activity.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Season</label>
                    <select
                      {...form.register("season")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option>Winter</option>
                      <option>Normal</option>
                      <option>Summer</option>
                    </select>
                    {form.formState.errors.season && <p className="text-red-500 text-xs mt-1">{form.formState.errors.season.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section 3: Schedule */}
              <div className="space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground border-b pb-4">
                  <SunMedium className="w-5 h-5 text-primary" /> Daily Schedule
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Wake Time</label>
                    <input
                      type="time"
                      {...form.register("wakeTime")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {form.formState.errors.wakeTime && <p className="text-red-500 text-xs mt-1">{form.formState.errors.wakeTime.message}</p>}
                  </div>
                  
                  <div>
                    <label className="text-sm font-bold text-foreground block mb-2">Sleep Time</label>
                    <input
                      type="time"
                      {...form.register("sleepTime")}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    {form.formState.errors.sleepTime && <p className="text-red-500 text-xs mt-1">{form.formState.errors.sleepTime.message}</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t">
                <button
                  type="submit"
                  className="w-full group px-8 py-4 rounded-full font-bold text-lg bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                  disabled={isPending}
                >
                  {isPending ? (
                    <><Loader2 className="w-6 h-6 animate-spin" /> Calculating Goal...</>
                  ) : (
                    <>Create My Hydration Plan <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
