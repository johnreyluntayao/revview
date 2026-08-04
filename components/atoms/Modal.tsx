"use client";

import React, { useEffect, useId, useRef } from "react";
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
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

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
        onCloseRef.current();
        return;
      }

      if (event.key === "Tab" && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusable.length === 0) {
          event.preventDefault();
          modalRef.current.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const focusFrame = requestAnimationFrame(() => {
      const modal = modalRef.current;
      // Do not steal focus after a parent re-render while the user is editing a field.
      if (!modal || modal.contains(document.activeElement)) return;

      const firstFormControl = modal.querySelector<HTMLElement>(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled])',
      );
      const firstFocusable = modal.querySelector<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      (firstFormControl ?? firstFocusable ?? modal).focus();
    });

    window.addEventListener("keydown", handleEsc);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleEsc);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-0 backdrop-blur-sm sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-none border border-border bg-background shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:rounded-2xl ${sizeClasses[size]} ${panelClassName}`}
      >
        {(title || showCloseButton) && (
          <div className="flex shrink-0 items-start justify-between border-b border-border px-4 py-4 sm:px-6 sm:py-5">
            <div className="min-w-0">
              {typeof title === "string" ? (
                <h2 id={titleId} className="text-lg font-semibold text-foreground">{title}</h2>
              ) : (
                <div id={titleId}>{title}</div>
              )}
              {description ? (
                <div id={descriptionId} className="mt-1 text-sm text-muted-foreground">{description}</div>
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

        <div className={`min-h-0 flex-1 overscroll-contain overflow-y-auto ${contentClassName}`}>{children}</div>

        {footer ? (
          <div className="shrink-0 border-t border-border bg-background/95 px-4 py-3 sm:px-6 sm:py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
