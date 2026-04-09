import React, { useMemo } from "react";
import { parse, addMinutes, format, differenceInMinutes, isBefore } from "date-fns";
import { Droplet, CheckCircle2 } from "lucide-react";

interface TimetableProps {
  wakeTime: string;
  sleepTime: string;
  totalGlasses: number;
  completedGlasses: number;
}

export function Timetable({ wakeTime, sleepTime, totalGlasses, completedGlasses }: TimetableProps) {
  
  const schedule = useMemo(() => {
    if (totalGlasses <= 0) return [];
    
    const wake = parse(wakeTime, "HH:mm", new Date());
    let sleep = parse(sleepTime, "HH:mm", new Date());
    
    // Handle overnight sleep (e.g., wake 08:00, sleep 02:00)
    if (isBefore(sleep, wake)) {
      sleep = addMinutes(sleep, 24 * 60);
    }
    
    const totalMins = differenceInMinutes(sleep, wake);
    const interval = totalMins / totalGlasses;
    
    const times = [];
    for (let i = 0; i < totalGlasses; i++) {
      // Offset by half interval so we drink in the middle of blocks, not right when waking
      const time = addMinutes(wake, (i + 0.5) * interval);
      times.push(format(time, "h:mm a"));
    }
    
    return times;
  }, [wakeTime, sleepTime, totalGlasses]);

  if (schedule.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl shadow-primary/5 border border-border/50">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Droplet className="w-5 h-5 text-primary" />
        Hydration Schedule
      </h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-secondary rounded-full" />
        
        <div className="flex flex-col gap-6">
          {schedule.map((time, index) => {
            const isCompleted = index < completedGlasses;
            const isNext = index === completedGlasses;
            
            return (
              <div key={index} className={`flex items-center gap-4 relative z-10 transition-all duration-300 ${isNext ? 'scale-105 transform origin-left' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300
                  ${isCompleted 
                    ? 'bg-primary text-white shadow-primary/20' 
                    : isNext 
                      ? 'bg-primary/10 text-primary border-2 border-primary/20' 
                      : 'bg-secondary text-muted-foreground'}`
                }>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Droplet className={`w-6 h-6 ${isNext ? 'fill-current opacity-20' : ''}`} />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`text-lg font-semibold ${isCompleted ? 'text-muted-foreground line-through decoration-primary/30' : isNext ? 'text-primary' : 'text-foreground'}`}>
                    {time}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">
                    {isCompleted ? 'Hydrated!' : isNext ? 'Time for a glass' : 'Upcoming'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
