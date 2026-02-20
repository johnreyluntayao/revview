"use client";

import React from "react";
import { ButtonProps } from "@/lib/types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      textColor = "",
      backgroundColor = "",
      leftIcon,
      rightIcon,
      text,
      children,
      onClick,
      size,
      isDisabled = false,
      type = "button",
      className = "",
      isRounded = false,
      ...rest
    },
    ref
  ) => {
    const baseClasses = `
      flex items-center justify-center 
      transition-all duration-200 
      hover:brightness-[0.96] active:brightness-[0.92]
      ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      h-[52px] sm:h-[56px] md:h-[60px] 
      px-5 sm:px-6 md:px-7 lg:px-8
    `;

    const radiusClasses = isRounded ? "rounded-full" : "rounded-xl";

    const sizeClasses = size
      ? {
          lg: "text-lg gap-3 font-semibold",
          md: "text-base gap-2.5 font-medium",
          sm: "text-sm gap-2 font-medium",
        }[size]
      : `
        text-sm sm:text-base 
        gap-2 sm:gap-2.5 
        font-medium
      `;

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={isDisabled}
        className={`
          ${baseClasses}
          ${radiusClasses}
          ${sizeClasses}
          ${textColor}
          ${backgroundColor}
          ${className}
        `}
        {...rest}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children ? children : text}
        {rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;