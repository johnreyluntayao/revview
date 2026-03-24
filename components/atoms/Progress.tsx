// components/Progress.tsx
import { ProgressProps } from "@/lib/types";
import React from "react";

const Progress: React.FC<ProgressProps> = ({
  variant = "default",
  current = 0,
  total,
  percentage,
  label = "",
  subLabel = "",
  className = "",
}) => {
  // Calculate fill percentage safely
  let fillPercent = 0;

  if (variant === "default" && total && total > 0) {
    fillPercent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
  } else if (variant === "percent") {
    fillPercent = Math.min(100, Math.max(0, percentage ?? 0));
  } else if (variant === "milestone") {
    fillPercent = 100; // milestone variant usually shows full bar
  }

  return (
    <div className={`w-full p-1 md:p-1.5 lg:p-2 ${className}`}>
    {/* Label + % row */}
    <div className="flex items-center justify-between mb-1 text-sm md:text-base lg:text-lg font-medium text-foreground">
      <span>{label}</span>
      
      {variant === "default" && total ? (
        <span>{fillPercent}%</span>
      ) : variant === "percent" ? (
        <span>{fillPercent}%</span>
      ) : null}
    </div>

    {/* Progress bar */}
    <div className="h-2 md:h-2.5 lg:h-3 w-full rounded-full border border-border bg-input overflow-hidden mb-1.5">
      <div
        className="h-full rounded-full bg-linear-to-r from-primary/80 to-secondary/80 transition-all duration-500 ease-out"
        style={{ width: `${fillPercent}%` }}
      />
    </div>

    {/* Sub-label or hint row – shown for any variant if subLabel exists */}
    {(subLabel) && (
      <div className="text-xs md:text-sm lg:text-base text-foreground/60 text-left">
        {subLabel || `${current} answered`}
      </div>
    )}
  </div>
  );
};

export default Progress;