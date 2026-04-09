import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface DailyLog {
  id: number;
  userId: string;
  date: string;
  completedGlasses: number;
}

export function useTodayLog(enabled: boolean = true) {
  return useQuery<DailyLog>({
    queryKey: ["/api/logs/today"],
    queryFn: async () => {
      const res = await fetch("/api/logs/today", { credentials: "include" });
      if (res.status === 401) throw new Error("Unauthorized");
      if (!res.ok) throw new Error("Failed to fetch logs");
      return res.json();
    },
    enabled,
  });
}

export function useIncrementLog(targetGlasses?: number) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logs/today/increment", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to increment log");
      return res.json() as Promise<DailyLog>;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["/api/logs/today"] });
      const previousLog = queryClient.getQueryData<DailyLog>(["/api/logs/today"]);
      
      queryClient.setQueryData<DailyLog | undefined>(["/api/logs/today"], (old) => {
        if (!old) return old;
        return { ...old, completedGlasses: old.completedGlasses + 1 };
      });
      
      return { previousLog };
    },
    onError: (err, variables, context) => {
      if (context?.previousLog) {
        queryClient.setQueryData(["/api/logs/today"], context.previousLog);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs/today"] });
    },
  });
}

export function useDecrementLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/logs/today/decrement", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to decrement log");
      return res.json() as Promise<DailyLog>;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["/api/logs/today"] });
      const previousLog = queryClient.getQueryData<DailyLog>(["/api/logs/today"]);
      
      queryClient.setQueryData<DailyLog | undefined>(["/api/logs/today"], (old) => {
        if (!old) return old;
        return { ...old, completedGlasses: Math.max(0, old.completedGlasses - 1) };
      });
      
      return { previousLog };
    },
    onError: (err, variables, context) => {
      if (context?.previousLog) {
        queryClient.setQueryData(["/api/logs/today"], context.previousLog);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/logs/today"] });
    },
  });
}
