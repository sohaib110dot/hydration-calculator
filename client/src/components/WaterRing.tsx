import React, { useEffect, useState } from "react";
import { Droplet } from "lucide-react";

interface WaterRingProps {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}

export function WaterRing({ completed, total, size = 280, strokeWidth = 24 }: WaterRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Smoothly animate the progress on load/change
  useEffect(() => {
    const targetProgress = Math.min(Math.max(completed / total, 0), 1);
    setProgress(targetProgress);
  }, [completed, total]);

  const strokeDashoffset = circumference - progress * circumference;
  const isGoalMet = completed >= total;

  return (
    <div className="relative inline-flex items-center justify-center animate-float" style={{ width: size, height: size }}>
      {/* Background Track Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-primary/10"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`text-primary transition-all duration-1000 ease-out ${progress > 0 ? 'ring-glow' : ''}`}
        />
      </svg>
      
      {/* Center Content */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <div className={`p-4 rounded-full mb-2 transition-colors duration-500 ${isGoalMet ? 'bg-primary text-white shadow-lg shadow-primary/40' : 'bg-primary/10 text-primary'}`}>
          <Droplet className={`w-8 h-8 ${isGoalMet ? 'fill-current' : ''}`} />
        </div>
        <h2 className="text-5xl font-black text-foreground font-display tracking-tight">
          {completed}
        </h2>
        <p className="text-lg text-muted-foreground font-medium mt-1">
          of {total} glasses
        </p>
      </div>
    </div>
  );
}
