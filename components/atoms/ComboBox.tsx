"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type Size = "sm" | "md" | "lg";

interface Option {
  value: string;
  label: string;
}

type ComboBoxOption = string | Option;

interface ComboBoxProps {
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  isSearchable?: boolean;
  size?: Size;
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
  size = "md",
}: ComboBoxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
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

  // Get display label for current value
  const getDisplayLabel = () => {
    const selected = options.find(opt =>
      typeof opt === "string" ? opt === value : opt.value === value
    );
    return typeof selected === "string" ? selected : selected?.label || "";
  };

  const displayText = isOpen && isSearchable ? search : getDisplayLabel();

  const filteredOptions = isSearchable
    ? options.filter(opt => {
        const label = typeof opt === "string" ? opt : opt.label;
        return label.toLowerCase().includes(search.toLowerCase());
      })
    : options;

  // Size classes
  const sizeClasses = {
    sm: "text-sm py-2 px-3 gap-1",
    md: "text-base py-2.5 px-4 gap-1.5",
    lg: "text-lg py-3 px-5 gap-2",
  }[size];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSearchable) return;
    setSearch(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleInputClick = () => {
    if (disabled) return;
    setIsOpen(true);
    if (isSearchable) inputRef.current?.focus();
  };

  const handleSelect = (option: ComboBoxOption) => {
    const selectedValue = typeof option === "string" ? option : option.value;
    onChange?.(selectedValue);
    setIsOpen(false);
    setSearch("");
  };

  return (
   <div className={`w-full space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm md:text-base lg:text-lg font-medium text-foreground">
          {label}
        </label>
      )}

      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={displayText}
          onChange={handleInputChange}
          onClick={handleInputClick}
          placeholder={value ? getDisplayLabel() || placeholder : placeholder}
          readOnly={!isSearchable || !isOpen}
          disabled={disabled}
          className={`w-full pr-10 rounded-md border bg-background 
          ${!isSearchable || !isOpen ? "cursor-pointer" : "cursor-text"}
          border-border text-foreground placeholder-foreground 
          focus:border-primary/75 focus:ring focus:ring-primary/30
          disabled:cursor-not-allowed disabled:opacity-50
          ${sizeClasses}
        `}/>

        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDown
            size={size === "lg" ? 20 : size === "md" ? 16 : 18}
            className={`text-foreground/40 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {isOpen && !disabled && (
          <div className="absolute text-xs md:text-sm lg:text-base z-50 mt-1 w-full overflow-auto rounded-md border border-border/30 bg-background shadow-lg max-h-60">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-foreground/40">No options found</div>
            ) : (
              filteredOptions.map((option, index) => {
                const label = typeof option === "string" ? option : option.label;
                const optValue = typeof option === "string" ? option : option.value;
                const isSelected = optValue === value;

                return (
                  <div
                    key={index}
                    className={`flex text-xs md:text-sm lg:text-base items-center justify-between cursor-pointer px-3 py-2 transition hover:bg-primary hover:text-primary-foreground ${
                      isSelected ? "bg-primary text-primary-foreground font-medium" : "text-foreground"
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <span>{label}</span>
                    {isSelected && <Check size={16} />}
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