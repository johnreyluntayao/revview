"use client";

import { RadioButtonProps } from "@/lib/types";
import Image from "next/image";

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
  indicator,
  rightIcon,
  image,
}: RadioButtonProps & { rightIcon?: React.ReactNode; image?: string | React.ReactNode }) {
  const handleClick = () => {
    if (!disabled) onSelect(value);
  };

  // Default colors
  const defaultUnselected = {
    bg: "bg-card",
    border: "border-border",
    text: "text-foreground",
    indicatorBorder: "border-muted-foreground/60",
    indicatorBg: "bg-card",
    hover: "hover:border-primary hover:bg-muted/40",
    indicatorDot: "text-foreground",
  };

  const defaultSelected = {
    bg: "bg-primary/10",
    border: "border-primary",
    text: "text-foreground",
    indicatorBorder: "border-primary",
    indicatorBg: "bg-primary/100",
    indicatorDot: "text-white",
  };

  const unselected = {
    bg: unselectedColor?.includes("bg-") ? unselectedColor : defaultUnselected.bg,
    border: unselectedColor?.includes("border-") ? unselectedColor : defaultUnselected.border,
    text:
      unselectedColor
        ?.split(" ")
        .find((cls) => cls.startsWith("text-")) || defaultUnselected.text,
    indicatorBorder: defaultUnselected.indicatorBorder,
    indicatorBg: defaultUnselected.indicatorBg,
    hover: defaultUnselected.hover,
    indicatorDot: defaultUnselected.indicatorDot,
  };

  const selected = {
    bg: selectedColor?.includes("bg-") ? selectedColor : defaultSelected.bg,
    border: selectedColor?.includes("border-") ? selectedColor : defaultSelected.border,
    text:
      selectedColor
        ?.split(" ")
        .find((cls) => cls.startsWith("text-")) || defaultSelected.text,
    indicatorBorder: indicator?.includes("border-") ? indicator : defaultSelected.indicatorBorder,
    indicatorBg: indicator?.includes("bg-") ? indicator : defaultSelected.indicatorBg,
    indicatorDot: indicator?.includes("text-") ? indicator : defaultSelected.indicatorDot,
  };

  // Wrapper
  let wrapper = `
    relative
    group w-full flex transition-all duration-200
    ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
    rounded-xl border
    ${isSelected ? selected.border : unselected.border}
    ${className}
  `;

  // Variants
  if (variant === "default") {
    wrapper += " items-center gap-4 py-3 px-4";
    wrapper += isSelected ? ` ${selected.bg}` : ` ${unselected.bg} ${unselected.hover}`;
  } else if (variant === "pill") {
    wrapper +=
      "flex items-center justify-center p-4 md:p-5 lg:p-6 text-sm md:text-base font-medium rounded-lg";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.text} bg-primary/100 text-white font-semibold`
      : ` ${unselected.bg} ${unselected.text} ${unselected.hover}`;
  } else if (variant === "card") {
    wrapper += " items-center p-4 md:p-5 lg:p-6";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  } else if (variant === "boxed") {
    wrapper += " items-center gap-3 md:gap-4 lg:gap-5 p-3 md:p-4 lg:p-5";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  } else if (variant === "choice") {
    wrapper += " items-center gap-2 md:gap-3 lg:gap-4 p-3 md:p-3.5 lg:p-4";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  } else if (variant === "image") {
    // ✅ NEW IMAGE VARIANT
    wrapper += " flex-col items-center p-2 md:p-3 lg:p-4";
    wrapper += isSelected
      ? ` ${selected.bg} ${selected.border}`
      : ` ${unselected.bg} ${unselected.hover}`;
  }

  const indicatorClasses = `
    w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full border-2 transition-all duration-200 flex-shrink-0
    ${isSelected ? selected.indicatorBorder : unselected.indicatorBorder}
    ${isSelected ? selected.indicatorBg : unselected.indicatorBg}
  `;

  const choiceIndicatorClasses = `
    flex items-center justify-center w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-xs md:text-sm lg:text-base rounded-md border-2 font-medium transition-all
    ${isSelected ? selected.indicatorBg : unselected.indicatorBg}
    ${isSelected ? selected.text : unselected.text}
    ${isSelected ? selected.indicatorBorder : unselected.indicatorBorder}
    ${isSelected ? selected.indicatorDot : unselected.indicatorDot}
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
      {/* TOP / LEFT AREA */}
      <div className="flex items-center gap-4 shrink-0">
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

        {variant === "choice" && <div className={choiceIndicatorClasses}>{value}</div>}

        { variant === "image" && image && (
          <div className=" w-full h-32 md:h-40 lg:h-48 overflow-hidden rounded-lg border flex items-center justify-center">
            <div className="relative w-full h-full">
              {typeof image === "string" ? (
                <Image
                  src={image}
                  alt={label ? String(label) : "Option Image"}
                  className="object-cover w-full h-full"
                  width={1000}
                  height={1000}
                />
              ) : (
                image
              )}

              {isSelected && (
                <div className="absolute inset-0 bg-linear-to-t from-white/60 to-transparent transition-all duration-200" />
              )}
            </div>

            <div className={`${choiceIndicatorClasses} absolute top-2 left-2 md:top-3 md:left-3 lg:top-4 lg:left-4 z-10`}>
              {value}
            </div>

          </div>
        )}

        {!hideIndicator &&
          variant !== "card" &&
          variant !== "boxed" &&
          variant !== "choice" &&
          variant !== "pill" &&
          variant !== "image" && ( // ✅ exclude image
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
        <span className="text-sm md:text-base font-medium text-center w-full">
          {label}
        </span>
      ) : variant === "image" ? (
        <div className="w-full text-center">
          <div
            className={`font-medium text-sm md:text-base ${
              isSelected ? selected.text : unselected.text
            }`}
          >
            {label}  
          </div>
          {description && (
            <div className="text-xs md:text-sm text-muted-foreground mt-1">
              {description}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div
            className={`font-medium text-xs md:text-sm lg:text-base leading-snug ${
              isSelected ? selected.text : unselected.text
            }`}
          >
            {label} 
          </div>
          {description && (
            <div className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
              {description}
            </div>
          )}
        </div>
      )}

      {/* RIGHT ICON */}
      {rightIcon && (
        <div className={`${variant === "image" ? "absolute right-2 bottom-2 md:right-3 md:bottom-3 lg:right-4 lg:bottom-4" : "ml-auto flex items-center justify-center shrink-0"} `}>
          {rightIcon}
        </div>
      )}

      {/* RIGHT INDICATOR (card + boxed) */}
      {!hideIndicator && (variant === "card" || variant === "boxed") && (
        <div className="relative shrink-0 ml-auto">
          <div className={indicatorClasses} />
        </div>
      )}
    </div>
  );
}