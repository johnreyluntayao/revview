// components/Progress.tsx
import React from "react";

type ProgressVariant = "default" | "percent" | "milestone";

interface ProgressProps {
  variant?: ProgressVariant;
  current?: number;
  total?: number;           // required when variant = "default"
  percentage?: number;      // used when variant = "percent"
  label?: string;
  subLabel?: string;
  className?: string;
}

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
    <div className={`w-full border border-black/20 p-1 md:p-1.5 lg:p-2 ${className} `}>
      {/* Label row */}
      <div className="flex items-center justify-between mb-1 md:mb-2 lg:mb-3 text-sm font-medium text-gray-700">
        {variant === "default" && total ? (
          <>
            <span>
              {label} {current} of {total}
            </span>
            <span>{fillPercent}%</span>
          </>
        ) : variant === "percent" ? (
          <>
            <span>{label}</span>
            <span>{fillPercent}%</span>
          </>
        ) : variant === "milestone" ? (
          <>
            <span>{label}</span>
            <span>{subLabel || `${current} completed`}</span>
          </>
        ) : null}
      </div>

      {/* Progress bar */}
      <div className="h-1 md:h-2 lg:h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      {/* Optional hint below for question variant */}
      {variant === "default" && total && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {current} answered
        </div>
      )}
    </div>
  );
};

export default Progress;