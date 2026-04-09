import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types derived from schema
export interface Profile {
  id: number;
  userId: string;
  age: number;
  gender: string;
  weight: string;
  activity: string;
  season: string;
  wakeTime: string;
  sleepTime: string;
  dailyLiters: string;
}

export interface InsertProfile {
  age: number;
  gender: string;
  weight: number;
  activity: string;
  season: string;
  wakeTime: string;
  sleepTime: string;
}

export function useProfile(enabled: boolean = true) {
  return useQuery<Profile | null>({
    queryKey: ["/api/profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", { credentials: "include" });
      if (res.status === 404) return null; // Expected when user hasn't set up profile
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled,
    retry: false, // Don't retry on 404
  });
}

export function useUpsertProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertProfile) => {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to save profile" }));
        throw new Error(error.message || "Failed to save profile");
      }
      
      return res.json() as Promise<Profile>;
    },
    onSuccess: (newProfile) => {
      queryClient.setQueryData(["/api/profile"], newProfile);
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
  });
}
