// ComboBox.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { ComboBoxProps } from "@/lib/types";



export default function ComboBox({
  options,
  value = "",
  onChange,
  placeholder = "Choose option...",
  label,
  disabled = false,
  className = "",
  required = false,
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

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = isOpen ? search : (selectedOption?.label ?? "");

  return (
    <div className={`w-full ${className}`} ref={wrapperRef}>
      {label && (
        <label className="mb-1.5 block text-xs md:text-sm lg:text-base font-medium text-[hsl(var(--foreground))]">
          {label}
          {required && <span className="text-[hsl(var(--destructive))] ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayText}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          placeholder={selectedOption?.label ?? placeholder}
          disabled={disabled}
          readOnly={!isOpen}
          onClick={() => !disabled && setIsOpen(true)}
          className={`
            w-full px-3.5 py-2.5 pr-10
            text-sm md:text-base lg:text-lg
            bg-[hsl(var(--background))] 
            border-2 border-[hsl(var(--border))]
            rounded-[var(--radius)]
            text-[hsl(var(--foreground))] 
            placeholder:text-[hsl(var(--muted-foreground))]
            shadow-sm
            transition-all duration-150 ease-in-out
            cursor-pointer
            hover:border-[hsl(var(--muted-foreground))]

            focus:border-[hsl(var(--primary))]
            focus:ring-2 focus:ring-[hsl(var(--ring)/0.25)] focus:ring-offset-1 focus:ring-offset-[hsl(var(--background))]
            focus-visible:border-[hsl(var(--primary))]
            focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring)/0.3)] focus-visible:ring-offset-1

            disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[hsl(var(--muted)/0.4)]
            disabled:border-[hsl(var(--border))]
            caret-[hsl(var(--primary))]
          `}
        />

        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <ChevronDown
            size={18}
            className={`text-[hsl(var(--muted-foreground))] transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div
            className={`
              absolute z-50 w-full mt-1.5
              bg-[hsl(var(--popover))] 
              border border-[hsl(var(--popover-foreground)/0.12)]
              rounded-[var(--radius)] 
              shadow-xl
              max-h-64 overflow-auto
              divide-y divide-[hsl(var(--border))]
              text-[hsl(var(--popover-foreground))]
            `}
          >
            {options.filter((opt) =>
              opt.label.toLowerCase().includes(search.toLowerCase())
            ).length === 0 ? (
              <div className="px-4 py-3 text-xs md:text-sm lg:text-base text-[hsl(var(--muted-foreground))]">
                No options found
              </div>
            ) : (
              options
                .filter((opt) =>
                  opt.label.toLowerCase().includes(search.toLowerCase())
                )
                .map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <div
                      key={option.value}
                      className={`
                        px-4 py-2.5 text-sm cursor-pointer
                        flex items-center justify-between
                        transition-colors
                        ${
                          isSelected
                            ? "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]"
                            : "hover:bg-[hsl(var(--muted))]"
                        }
                      `}
                      onClick={() => {
                        onChange?.(option.value);
                        setSearch("");
                        setIsOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                      {isSelected && (
                        <Check size={16} className="text-current opacity-90" />
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