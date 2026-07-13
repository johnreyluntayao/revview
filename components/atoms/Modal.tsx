"use client";

import React, { useEffect, useRef } from "react";
import { Close } from "@/lib/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  contentClassName?: string;
  panelClassName?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-5xl",
};

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  contentClassName = "",
  panelClassName = "",
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`w-full overflow-hidden rounded-2xl border border-border bg-background shadow-2xl ${sizeClasses[size]} ${panelClassName}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              {typeof title === "string" ? (
                <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              ) : (
                title
              )}
              {description ? (
                <div className="mt-1 text-sm text-muted-foreground">{description}</div>
              ) : null}
            </div>
            {showCloseButton ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                aria-label="Close modal"
              >
                <Close size={18} />
              </button>
            ) : null}
          </div>
        )}

        <div className={`overflow-y-auto ${contentClassName}`}>{children}</div>

        {footer ? (
          <div className="border-t border-border bg-background/90 px-4 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
