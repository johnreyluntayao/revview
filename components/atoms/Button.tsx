"use client";

import React from "react";
import { ButtonProps } from "@/lib/types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      textColor = "text-foreground",
      backgroundColor = "",
      borderColor = "border-border",
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
    const baseClasses = `flex items-center justify-center rounded-[8px] transition-colors duration-200 hover:brightness-90 cursor-pointer ${
    isDisabled ? "opacity-50 cursor-not-allowed" : ""
  }`;

    const radiusClasses = isRounded ? "rounded-full" : "rounded-xl";

     const sizeClasses = size
    ? {
        lg: "text-[16px] gap-2 py-3 px-6",
        md: "text-[14px] gap-1.5 py-2.5 px-5",
        sm: "text-[12px] gap-1 py-2 px-4 ",
      }[size]
    : "text-[12px] gap-1 py-2 px-4  " +
      "md:text-[14px] md:gap-1.5 md:py-2.5 md:px-5 " +
      "lg:text-[16px] lg:gap-2 lg:py-3 lg:px-6 ";

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
          ${borderColor ? `border ${borderColor}` : ''}
          ${className}
        `}
        {...rest}
      >
        {leftIcon && <span className="">{leftIcon}</span>}
        {children ? children : text}
        {rightIcon && <span className="">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;