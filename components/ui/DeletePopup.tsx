"use client";

import { Button } from '@/lib/client-imports';
import React, { useEffect, useRef } from 'react';
import { Delete } from '@/lib/icons';

interface DeletePopupProps {
  isOpen: boolean;
  questionText?: string;     
  onConfirm: () => void;       
  onCancel: () => void;          
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  isOpen,
  questionText,
  onConfirm,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Optional: prevent background scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onCancel]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-background rounded-xl border border-border shadow-2xl
          w-full max-w-md mx-4 p-5 sm:p-6 md:p-7
          scale-100 animate-in fade-in-60 zoom-in-95 duration-200
        `}
      >
        {/* Header / Warning */}
        <div className="flex items-center gap-3 mb-4">
          <Delete className="h-7 w-7 md:h-8 md:w-8 text-destructive shrink-0" />
          <h2 className="text-xl font-semibold text-foreground">
            Delete Question?
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Are you sure you want to delete this question? This action cannot be undone.
          </p>

          {questionText && (
            <div className="p-3 bg-muted/40 rounded-md border border-border text-sm text-foreground/90 line-clamp-3">
              “{questionText}”
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4">
          <Button
            text="Cancel"
            onClick={onCancel}
          />
          <Button
            text="Delete"
            backgroundColor="bg-destructive"
            textColor="text-white"
            borderColor="border-destructive"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;