"use client";

import React from "react";
import { ButtonProps } from "@/lib/types";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      textColor = "text-foreground",
      backgroundColor = "",
      borderColor = "",
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
      restrict = false,
      ...rest
    },
    ref,
  ) => {
    const baseClasses = `flex py-2 md:py-3 lg:py-4 items-center justify-center rounded-[8px] transition-colors duration-200 hover:brightness-90 cursor-pointer ${
      isDisabled ? "opacity-50 cursor-not-allowed" : ""
    }`;

    const radiusClasses = isRounded ? "rounded-full" : "rounded-xl";

    const sizeClasses = isRounded
      ? "p-2 md:p-3 lg:p-4" // equal padding for circle buttons (or use p-0 if you want tight)
      : size
        ? {
            lg: "text-[16px] gap-2 py-3 px-3",
            md: "text-[14px] gap-1.5 py-2.5 px-2.5",
            sm: "text-[12px] gap-1 py-2 px-2",
          }[size]
        : "text-[12px] gap-1 py-2 px-4 " +
          "md:text-[14px] md:gap-1.5 md:py-2.5 md:px-2.5 " +
          "lg:text-[16px] lg:gap-2 lg:py-3 lg:px-3";

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
    ${borderColor ? `border ${borderColor}` : ""}
    ${restrict ? "leading-none" : ""}
    ${className}
  `}
        {...rest}
      >
        {leftIcon && <span>{leftIcon}</span>}

        <span className={restrict ? "line-clamp-1 leading-none" : ""}>
          {children ? children : text}
        </span>

        {rightIcon && <span>{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
