"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  CSC_EXAM_SCHEDULE_URL,
  getNextCscExamDate,
} from "@/lib/csc-exam-schedule";

interface CountdownCardProps {
  title?: string;
  targetDate?: string;
  message?: string;
  subMessage?: string;
  className?: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({
  title = "CSE-PPT Exam",
  targetDate,
  message = "Don't wait, start preparing today!",
  subMessage = "Every question you practice brings you closer to success.",
  className = "",
}) => {
  const examDate = useMemo(
    () => (targetDate ? new Date(targetDate) : getNextCscExamDate()),
    [targetDate],
  );
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      if (now >= examDate) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const diff = examDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, "0"),
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    };

    calculateTimeLeft();

    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  return (
    <div className={`w-fit h-fit flex flex-col gap-6 md:gap-8 rounded-2xl bg-linear-to-r from-countdown1/50 via-countdown2/50 to-countdown3/60 border-2 border-primary/30 p-4 md:p-6 lg:p-8 text-center ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center">
        <p className="text-[8px] md:text-[10px] lg:text-xs tracking-wider uppercase text-[#BFDBFE] mb-1 md:mb-1.5 lg:mb-2">
          COUNTDOWN TO
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-3 lg:mb-4 text-white">
          {title}
        </h1>
        <p className="text-[10px] md:text-xs lg:text-sm text-primary100">
          {examDate.toLocaleDateString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" · 6:30 AM PHT"}
        </p>
        {!targetDate && (
          <a
            href={CSC_EXAM_SCHEDULE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-2 text-[10px] font-semibold text-primary200 underline decoration-primary300/60 underline-offset-4 transition-colors hover:text-white md:text-xs"
          >
            View the official CSC schedule
          </a>
        )}
      </div>

      {/* Countdown Boxes */}
      <div className="grid grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        {[
          { value: timeLeft.days, label: "DAYS" },
          { value: timeLeft.hours, label: "HOURS" },
          { value: timeLeft.minutes, label: "MINUTES" },
          { value: timeLeft.seconds, label: "SECONDS" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-linear-to-r from-primary600/80 to-primary700/80 rounded-lg gap-1 md:gap-1.5 lg:gap-2 p-4 md:p-5 lg:p-6 transition-all duration-300 justify-center items-center flex flex-col w-full h-auto"
          >
            <div className="text-2xl md:text-3xl lg:text-4xl tabular-nums text-white">
              {item.value}
            </div>
            <div className="text-[8px] md:text-[10px] lg:text-xs font-medium tracking-wider uppercase text-center text-primary100">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="bg-linear-to-r from-primary/20 to-secondary/20 rounded-lg border border-primary/50 p-4 md:p-5 lg:p-6">
        <p className="text-[10px] md:text-xs lg:text-sm font-bold text-white mb-1 md:mb-1.5 lg:mb-2">
          {message}
        </p>
        <p className="text-[10px] md:text-xs lg:text-sm text-primary100 leading-relaxed">
          {subMessage}
        </p>
      </div>
    </div>
  );
};

export default CountdownCard;
