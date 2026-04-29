"use client";

import { useState, useEffect, useRef } from "react";
import { StudyTime } from "@/lib/icons";

interface CountdownTimerProps {
  initialSeconds: number;         
  onTimeUp?: () => void;          
  className?: string;
  isPaused?: boolean;     
}

export default function CountDownTimer({
  initialSeconds,
  onTimeUp,
  className = "",
  isPaused = false,
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      onTimeUp?.();
      return;
    }

    if (isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secondsLeft, isPaused, onTimeUp]);

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isWarning = secondsLeft <= 60 && secondsLeft > 0;
  const isCritical = secondsLeft <= 10 && secondsLeft > 0;
  const isFinished = secondsLeft <= 0;

  let bgClass = "bg-primary/20 text-primary";
  if (isWarning) bgClass = "bg-yellow-500/20 text-yellow-700";
  if (isCritical) bgClass = "bg-red-500/30 text-red-700 animate-pulse";
  if (isFinished) bgClass = "bg-destructive/20 text-destructive animate-pulse";

  return (
    <div className={`inline-flex flex-col items-center rounded-2xl ${className}`}>
      <div
        className={`w-24 md:w-28 lg:w-30 rounded-full p-2 md:p-3 lg:p-4 flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm lg:text-base font-medium tracking-wider transition-colors ${bgClass}`}
      >
        <StudyTime className="h-auto w-4 md:w-5 lg:w-6" />
        <span>{formatTime(secondsLeft)}</span>
      </div>
    </div>
  );
}