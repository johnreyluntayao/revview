"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type Size = "sm" | "md" | "lg" | undefined;

interface ComboBoxProps {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  isSearchable?: boolean;
  size?: Size;                    // ← NEW: "sm" | "md" | "lg"
}

export default function ComboBox({
  options,
  value = "",
  onChange,
  placeholder = "Choose option...",
  label,
  disabled = false,
  className = "",
  required = false,
  isSearchable = true,
  size,
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setSearch("");
  }, [isOpen]);

  const displayText = isOpen && isSearchable ? search : value;
  const filteredOptions = isSearchable
    ? options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()))
    : options;

  // Size logic exactly as you provided
  const sizeClasses = size
    ? {
        lg: "text-[16px] gap-2 py-3 px-6",
        md: "text-[14px] gap-1.5 py-2.5 px-5",
        sm: "text-[12px] gap-1 py-2 px-4",
      }[size]
    : "text-[12px] gap-1 py-2 px-4 " +
      "md:text-[14px] md:gap-1.5 md:py-2.5 md:px-5 " +
      "lg:text-[16px] lg:gap-2 lg:py-3 lg:px-6";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSearchable) return;
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(true);
    if (isSearchable && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`w-full ${className}`} ref={wrapperRef}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayText}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={value || placeholder}
          disabled={disabled}
          readOnly={!isSearchable || !isOpen}
          className={`
            w-full pr-10
            bg-background
            border-2 border-input rounded-lg
            text-foreground
            placeholder:text-muted-foreground
            focus:border-primary focus:ring-2 focus:ring-ring/30 focus:outline-none
            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted/40
            transition-all duration-150
            ${!isSearchable ? "cursor-pointer" : "cursor-text"}
            ${sizeClasses}
          `}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown
            className={`text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            size={size === "lg" ? 20 : size === "sm" ? 16 : 18}
          />
        </div>

        {isOpen && !disabled && (
          <div
            className={`
              absolute z-50 w-full mt-1.5
              bg-popover border border-border rounded-lg
              shadow-xl overflow-auto
              text-popover-foreground
              ${size === "lg" ? "max-h-72 text-base" : size === "sm" ? "max-h-52 text-xs" : "max-h-64 text-sm"}
            `}
          >
            {filteredOptions.length === 0 && isSearchable ? (
              <div className="px-4 py-3 text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option === value;
                return (
                  <div
                    key={option}
                    className={`
                      px-4 cursor-pointer flex items-center justify-between
                      transition-colors
                      ${isSelected
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-primary hover:text-background"
                      }
                      ${size === "lg" ? "py-3 text-base" : size === "sm" ? "py-2 text-xs" : "py-2.5 text-sm"}
                    `}
                    onClick={() => {
                      onChange?.(option);
                      setSearch("");
                      setIsOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <Check
                        size={size === "lg" ? 18 : size === "sm" ? 14 : 16}
                        className="text-primary"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}