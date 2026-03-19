"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "@/lib/icons";
import { InputFieldProps } from "@/lib/types";

type Size = "sm" | "md" | "lg";

interface ExtendedInputFieldProps extends InputFieldProps {
  size?: Size;
  min?: number | string;
  max?: number | string;
  step?: number | string;
}

const InputField: React.FC<ExtendedInputFieldProps> = ({
  label,
  placeholder = "",
  type = "text",
  name,
  error,
  value,
  onChange,
  disabled = false,
  icon,
  showPasswordToggle = false,
  className = "",
  state = "editable",
  size = "md",
  min,
  max,
  step,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isUsername = type === "username";
  const isDisabled = disabled || state === "disabled";
  const isReadOnly = state === "readonly" || isDisabled;
  const hasError = !!error;

  const effectiveType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type === "username"
      ? "text"
      : type;

  const displayValue =
    isUsername && state === "readonly"
      ? `@${value ?? ""}`
      : value ?? "";

  const sizeClasses = {
    sm: "text-sm py-2 px-3",
    md: "text-base py-2.5 px-4",
    lg: "text-lg py-3 px-5",
  }[size];

  const paddingLeft = isUsername && state !== "readonly" ? "pl-10" : icon ? "pl-10" : "pl-4";
  const paddingRight = showPasswordToggle ? "pr-12" : "pr-4";

  // ── Number clamping logic ───────────────────────────────────────
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type !== "number" || !onChange) {
      onChange?.(e);
      return;
    }

    const inputValue = e.target.value;

    // Allow empty string (user deleting everything)
    if (inputValue === "") {
      onChange(e);
      return;
    }

    // Allow only valid number input (including -, ., temporary invalid states)
    if (!/^-?\d*\.?\d*$/.test(inputValue)) {
      return; // ignore invalid characters
    }

    const numValue = Number(inputValue);

    // If it's not a valid number yet (like "-" or "12."), allow it
    if (isNaN(numValue)) {
      onChange(e);
      return;
    }

    let clamped = numValue;

    // Apply min clamp
    if (min !== undefined) {
      const minVal = Number(min);
      if (!isNaN(minVal) && clamped < minVal) {
        clamped = minVal;
      }
    }

    // Apply max clamp
    if (max !== undefined) {
      const maxVal = Number(max);
      if (!isNaN(maxVal) && clamped > maxVal) {
        clamped = maxVal;
      }
    }

    // Create synthetic event with clamped value
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: clamped.toString(),
        name: e.target.name,
      },
    };

    onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
  };
  // ─────────────────────────────────────────────────────────────────

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block font-medium text-gray-700 text-xs md:text-sm">
          {label}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {isUsername && state !== "readonly" && (
          <span className="absolute left-3 text-gray-500 text-sm md:text-base">@</span>
        )}

        {icon && !isUsername && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-border pointer-events-none">
            {icon}
          </div>
        )}

        <input
          {...rest}
          type={effectiveType}
          name={name}
          value={displayValue}
          onChange={!isReadOnly ? (type === "number" ? handleNumberChange : onChange) : undefined}
          disabled={isDisabled}
          readOnly={isReadOnly && !isDisabled}
          placeholder={placeholder}
          min={type === "number" ? min : undefined}
          max={type === "number" ? max : undefined}
          step={type === "number" ? step : undefined}
          className={`
            w-full rounded-lg transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500
            ${sizeClasses} ${paddingLeft} ${paddingRight}
            ${hasError ? "border-destructive ring-2 ring-red-200 text-destructive" : ""}
            ${
              isDisabled
                ? "bg-background text-foreground/50 cursor-not-allowed border-border"
                : state === "readonly"
                ? "bg-transparent text-foreground/80 cursor-default pointer-events-none border-none"
                : "bg-white text-foreground border border-border hover:border-border"
            }
          `}
        />

        {showPasswordToggle && type === "password" && !isDisabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/70"
            disabled={isDisabled}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>

      {error && <p className="text-destructive text-xs mt-1 font-medium">{error}</p>}
    </div>
  );
};

export default InputField;