"use client";

import React, {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Check, ChevronDown, Search } from "@/lib/icons";

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
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const labelId = useId();

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { value: option, label: option }
          : option,
      ),
    [options],
  );

  const selectedOption = normalizedOptions.find(
    (option) => option.value === value,
  );

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return normalizedOptions;

    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [normalizedOptions, search]);

  const sizeClasses = {
    sm: "min-h-9 px-3 text-xs",
    md: "min-h-11 px-3.5 text-sm",
    lg: "min-h-12 px-4 text-base",
  }[size];

  const openMenu = () => {
    if (disabled) return;

    const selectedIndex = normalizedOptions.findIndex(
      (option) => option.value === value,
    );
    setSearch("");
    setHighlightedIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);

    if (isSearchable) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  };

  const closeMenu = (restoreFocus = false) => {
    setIsOpen(false);
    setSearch("");

    if (restoreFocus) {
      requestAnimationFrame(() => triggerRef.current?.focus());
    }
  };

  const handleSelect = (option: Option) => {
    onChange?.(option.value);
    closeMenu(true);
  };

  const moveHighlight = (direction: 1 | -1) => {
    if (filteredOptions.length === 0) return;

    setHighlightedIndex((current) => {
      const next = current + direction;
      if (next < 0) return filteredOptions.length - 1;
      if (next >= filteredOptions.length) return 0;
      return next;
    });
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu(true);
      return;
    }

    if (!isOpen && ["Enter", " ", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      openMenu();
      return;
    }

    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight(-1);
    } else if (event.key === "Enter" && filteredOptions[highlightedIndex]) {
      event.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={`w-full space-y-2 ${className}`}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeMenu();
        }
      }}
    >
      {label && (
        <span
          id={labelId}
          className="block text-xs font-bold text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
          aria-autocomplete={isSearchable ? "list" : "none"}
          aria-activedescendant={
            isOpen && filteredOptions[highlightedIndex]
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined
          }
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : placeholder}
          onClick={() => (isOpen ? closeMenu(false) : openMenu())}
          onKeyDown={handleKeyboard}
          className={`flex w-full items-center justify-between gap-3 rounded-lg border bg-background text-left transition ${
            isOpen
              ? "border-primary ring-2 ring-primary/20"
              : "border-border hover:border-primary/40"
          } ${sizeClasses} disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <span
            className={`min-w-0 flex-1 truncate ${
              selectedOption ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-background shadow-xl shadow-foreground/10">
            {isSearchable && (
              <div className="border-b border-border p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-activedescendant={
                      filteredOptions[highlightedIndex]
                        ? `${listboxId}-option-${highlightedIndex}`
                        : undefined
                    }
                    value={search}
                    onChange={(event) => {
                      setSearch(event.target.value);
                      setHighlightedIndex(0);
                    }}
                    onKeyDown={handleKeyboard}
                    placeholder="Search options..."
                    className="min-h-9 w-full rounded-lg border border-border bg-muted/30 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}

            <div
              id={listboxId}
              role="listbox"
              aria-labelledby={label ? labelId : undefined}
              className="max-h-60 overflow-y-auto p-1.5"
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No matching options
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = option.value === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => handleSelect(option)}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-xs transition md:text-sm ${
                        isHighlighted
                          ? "bg-primary/8 text-primary"
                          : "text-foreground hover:bg-muted"
                      } ${isSelected ? "font-bold" : "font-medium"}`}
                    >
                      <span className="min-w-0 truncate">{option.label}</span>
                      {isSelected && (
                        <Check
                          className="h-4 w-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
