import React, { useState, useEffect } from 'react';

interface CountdownCardProps {
  title?: string;
  targetDate?: string;        // ISO format or "April 10, 2026"
  message?: string;
  subMessage?: string;
}

const CountdownCard: React.FC<CountdownCardProps> = ({
  title = "Sample Exam Countdown",  // Default title
  targetDate = "April 15, 2026",   // Default: April 10, 2026
  message = "Don't wait, start preparing today!",
  subMessage = "Every question you practice brings you closer to success.",
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate);
      const now = new Date();

      // If the target date has passed
      if (now >= target) {
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const diff = target.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      });
    };

    // Calculate immediately
    calculateTimeLeft();

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full mx-auto flex flex-col gap-6 md:gap-8 rounded-2xl bg-linear-to-r from-hero2 via-hero1 to-hero3 p-6 md:p-8 text-white text-center shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col items-center">
        <p className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white/80">
          COUNTDOWN TO
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1 mb-1">
          {title}
        </h1>
        <p className="text-sm md:text-base text-blue-100">
          {new Date(targetDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Countdown Boxes */}
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {[
          { value: timeLeft.days, label: "DAYS" },
          { value: timeLeft.hours, label: "HOURS" },
          { value: timeLeft.minutes, label: "MINUTES" },
          { value: timeLeft.seconds, label: "SECONDS" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-primary/70 backdrop-blur-md rounded-xl p-4 border border-secondary/20 transition-all duration-300"
          >
            <div className="text-4xl md:text-5xl font-bold tabular-nums">
              {item.value}
            </div>
            <div className="text-[10px] md:text-xs font-medium tracking-widest uppercase mt-1 text-blue-200">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="bg-secondary/10 backdrop-blur-md rounded-2xl p-6 border border-primary/70">
        <p className="text-lg md:text-xl font-semibold mb-2">
          {message}
        </p>
        <p className="text-sm md:text-base text-blue-100 leading-relaxed">
          {subMessage}
        </p>
      </div>
    </div>
  );
};

export default CountdownCard;