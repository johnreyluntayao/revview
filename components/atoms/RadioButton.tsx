// components/RadioButton.tsx
"use client";

import { RadioButtonProps } from "@/lib/types";
import React, { ReactNode } from "react";

export default function RadioButton({
  variant = "default",
  value,
  label,
  description,
  icon,
  boxedBG,
  hideIndicator = false,
  disabled = false,
  className = "",
  unselectedColor, 
  selectedColor,
  isSelected,
  onSelect,
}: RadioButtonProps) {
  const handleClick = () => {
    if (!disabled) onSelect(value);
  };

  // Default colors (Shadcn / your theme)
  const defaultUnselected = {
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    indicatorBorder: "border-muted-foreground/60",
    indicatorBg: "bg-card",
    hover: "hover:border-primary/50 hover:bg-muted/40",
  };

  const defaultSelected = {
    bg: "bg-primary/10",
    border: "border-primary",
    text: "text-foreground",
    indicatorBorder: "border-primary",
    indicatorBg: "bg-primary",
    indicatorDot: "bg-primary-foreground",
  };

  // Override with custom colors if provided
  const unselected = {
    bg: unselectedColor?.includes("bg-") ? unselectedColor : defaultUnselected.bg,
    border: unselectedColor?.includes("border-") ? unselectedColor : defaultUnselected.border,
    text: unselectedColor?.includes("text-") ? unselectedColor : defaultUnselected.text,
    indicatorBorder: defaultUnselected.indicatorBorder,
    indicatorBg: defaultUnselected.indicatorBg,
    hover: defaultUnselected.hover,
  };

  const selected = {
    bg: selectedColor?.includes("bg-") ? selectedColor : defaultSelected.bg,
    border: selectedColor?.includes("border-") ? selectedColor : defaultSelected.border,
    text: selectedColor?.includes("text-") ? selectedColor : defaultSelected.text,
    indicatorBorder: selectedColor?.includes("border-") ? selectedColor : defaultSelected.indicatorBorder,
    indicatorBg: selectedColor?.includes("bg-") ? selectedColor : defaultSelected.indicatorBg,
    indicatorDot: selectedColor?.includes("text-") ? selectedColor.replace("text-", "bg-") : defaultSelected.indicatorDot,
  };

  // ────────────────────────────────────────────────
  // Base wrapper
  // ────────────────────────────────────────────────
  let wrapper = `
    group w-full flex transition-all duration-200
    ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
    rounded-xl border
    ${isSelected ? selected.border : unselected.border}
    ${className}
  `;

  // ────────────────────────────────────────────────
  // Variant-specific styles
  // ────────────────────────────────────────────────
  if (variant === "default") {
    wrapper += " items-center gap-4 py-3 px-4";
    wrapper += isSelected ? ` ${selected.bg}` : ` ${unselected.bg} ${unselected.hover}`;
  }
  else if (variant === "pill") {
    wrapper += " items-center justify-center py-2.5 px-6 min-w-[110px] text-sm font-medium rounded-lg";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.text} bg-primary/100 text-white`
      : ` ${unselected.bg} ${unselected.text} ${unselected.hover}`;
  }
  else if (variant === "card") {
    wrapper += " items-center gap-0 pt-5 pr-5 pb-5 pl-0";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  }
  else if (variant === "boxed") {
    wrapper += " items-center gap-5 p-5 min-h-[80px] ";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  }
  else if (variant === "choice") {
    wrapper += " items-center gap-4 py-3 px-4 min-h-[72px]";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  }

  const indicatorClasses = `
    w-5 h-5 rounded-full border-2 transition-all duration-200 flex-shrink-0
    ${isSelected ? selected.indicatorBorder : unselected.indicatorBorder}
    ${isSelected ? selected.indicatorBg : unselected.indicatorBg}
  `;

  const choiceIndicatorClasses = `
    flex items-center justify-center w-10 h-10 rounded-md border-2 font-medium text-base transition-all
    ${isSelected ? selected.border : unselected.border}
    ${isSelected ? selected.bg : unselected.bg}
    ${isSelected ? selected.text : unselected.text}
  `;

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={wrapper.trim()}
    >
      {/* LEFT AREA */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {(variant === "boxed" || variant === "default") && icon && (
          <div
            className={`
              flex items-center justify-center rounded-lg w-11 h-11
              text-lg md:text-xl lg:text-2xl font-bold transition-all duration-200
              [&>svg]:size-[1em] [&>svg]:block   
              ${boxedBG} text-white
            `}
          >
            {icon}
          </div>
        )}

        {variant === "choice" && (
          <div className={choiceIndicatorClasses}>
            {value}
          </div>
        )}

        {!hideIndicator && variant !== "card" && variant !== "boxed" && variant !== "choice" && variant !== "pill" && (
          <div className="relative">
            <div className={indicatorClasses} />
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-2.5 h-2.5 rounded-full ${selected.indicatorDot}`} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      {variant === "pill" ? (
        <span className="font-medium text-center w-full">
          {label}
        </span>
      ) : (
        <div className="flex-1 min-w-0 flex flex-col justify-center ml-4">
          <div className={`font-medium leading-snug ${isSelected ? selected.text : unselected.text}`}>
            {label}
          </div>
          {description && (
            <div className="text-sm text-muted-foreground mt-1">
              {description}
            </div>
          )}
        </div>
      )}

      {/* RIGHT INDICATOR (card + boxed) */}
      {!hideIndicator && (variant === "card" || variant === "boxed") && (
        <div className="relative flex-shrink-0 ml-auto">
          <div className={indicatorClasses.replace("w-5 h-5", "w-6 h-6")} />
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-3 h-3 rounded-full ${selected.indicatorDot}`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}