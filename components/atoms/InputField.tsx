"use client";

import React, { useEffect, useState } from "react";
import { EyeOff, Eye } from "@/lib/icons";
import { InputFieldProps } from "@/lib/types";

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder = "",
  type = "text",
  name,
  error,
  value,
  defaultValue,
  onChange,
  disabled = false,
  icon,
  showPasswordToggle = false,
  className = "",
  register,
  state = "editable",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || "");

  const isUsername = type === "username";

  useEffect(() => {
    setInternalValue(value || "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // Prevent typing @ for username
    if (isUsername) {
      val = val.replace("@", "");
    }

    setInternalValue(val);

    onChange?.({
      ...e,
      target: {
        ...e.target,
        value: val,
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const effectiveType =
    showPasswordToggle && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type === "username"
      ? "text"
      : type;

  const isDisabled = disabled || state === "disabled";
  const isReadOnly = state === "readonly" || isDisabled;
  const hasError = !!error;

  const displayValue =
    isUsername && state === "readonly"
      ? `@${value ?? internalValue}`
      : value ?? internalValue;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative flex items-center">

        {/* Username @ prefix when editing */}
        {isUsername && state !== "readonly" && (
          <span className="absolute left-3  text-gray-500 text-sm md:text-base lg:text-lg">
            @
          </span>
        )}

        {/* Icon */}
        {icon && !isUsername && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {icon}
          </div>
        )}

        <input
          {...(register ? register(name) : {})}
          type={effectiveType}
          name={name}
          value={displayValue}
          defaultValue={defaultValue}
          onChange={!isReadOnly ? handleChange : undefined}
          disabled={isDisabled}
          readOnly={isReadOnly && !isDisabled}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            ${isUsername && state !== "readonly" ? "pl-10" : icon ? "pl-10" : "pl-4"}
            ${showPasswordToggle ? "pr-12" : "pr-4"}
            text-sm md:text-base lg:text-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${
              hasError
                ? "border-red-500 ring-2 ring-red-200"
                : "border-gray-300 hover:border-gray-400"
            }
            ${
              isDisabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : state === "readonly"
                ? "bg-transparent text-gray-800 cursor-default pointer-events-none border-none focus:ring-0"
                : "bg-white text-gray-900 cursor-text"
            }
          `}
          {...rest}
        />

        {/* Password Toggle */}
        {showPasswordToggle && type === "password" && !isDisabled && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isDisabled}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export default InputField;