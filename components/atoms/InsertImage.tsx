// components/ui/InsertImage.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/lib/client-imports";
import { Upload } from "@/lib/icons";

interface InsertImageProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  maxSizeMB?: number;
  variant?: "default" | "compact";   // ← new: compact = input-field-like height
}

const InsertImage: React.FC<InsertImageProps> = ({
  label,
  value,
  onChange,
  placeholder = "Drag/drop or click to add image...",
  error,
  required = false,
  className = "",
  maxSizeMB = 5,
  variant = "default",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasError = !!error || !!localError;

  useEffect(() => setPreview(value || null), [value]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    setLocalError(null);

    if (!file.type.startsWith("image/")) {
      setLocalError("Only images allowed");
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`Max ${maxSizeMB}MB`);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange(url);
  };

  const clearImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange("");
    setLocalError(null);
  };

  // ────────────────────────────────────────────────
  // COMPACT variant – looks similar to InputField
  // ────────────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div className={`space-y-1.5 ${className}`}>
        {label && (
          <label className="block text-xs md:text-sm lg:text-base font-medium text-gray-700">
            {label}
            {required && <span className="text-destructive/50 ml-1">*</span>}
          </label>
        )}

        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`
            relative flex items-center px-4 py-4 rounded-xl border transition-all
            cursor-pointer text-sm
            ${isDragging
              ? "border-blue-500 bg-blue-50"
              : preview
                ? "border-green-500/60 bg-green-50/40"
                : hasError
                  ? "border-destructive/50 bg-destructive/20"
                  : "border-gray-300 hover:border-foreground/40 bg-white"}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          {preview ? (
            <div className="flex items-center gap-3 w-full">
              <div className="shrink-0 w-10 h-10 rounded overflow-hidden border bg-gray-50">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Image selected</p>
                <p className="text-xs text-foreground/50">Click to change • drag to replace</p>
              </div>
              <Button
                text="Remove"
                backgroundColor="hover:bg-destructive"
                textColor="text-destructive hover:text-destructive-foreground"
                className="shrink-0"
                onClick={clearImage}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-foreground">
              <Upload className="h-5 w-5" />
              <span>{placeholder}</span>
            </div>
          )}
        </div>

        {(error || localError) && (
          <p className="text-destructive/50 text-xs mt-1">{error || localError}</p>
        )}
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // DEFAULT (larger drag-drop area)
  // ────────────────────────────────────────────────
  return (
    <div className={`space-y-2 ${className}`}>
      {(label || required) && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-destructive/50 ml-1">*</span>}
        </label>
      )}

      <div
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => !preview && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all
          min-h-35 flex flex-col justify-center
          ${isDragging ? "border-primary/50 bg-blue-primary/20" :
            preview ? "border-success/50 bg-success/20" :
              hasError ? "border-destructive/50 bg-destructive/20" :
                "border-border hover:border-foreground/40 hover:bg-foreground/5"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex items-center justify-between gap-4 w-full">
          {/* Left / Center content */}
          <div className="flex-1 flex items-center gap-4">
            {!preview ? (
              <>
                <Upload className="h-9 w-9 text-foreground shrink-0" />
                <div>
                  <p className="text-base font-medium text-foreground/70">
                    {placeholder}
                  </p>
                  <p className="text-sm text-foreground/50 mt-0.5">
                    PNG, JPG, GIF • max {maxSizeMB}MB
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden border bg-white shadow-sm">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground/80 truncate">
                    Image uploaded
                  </p>
                  <p className="text-xs text-foreground/50">
                    Click area to replace • drag new image
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right-side button */}
          {preview ? (
            <Button
              text="Remove"
              backgroundColor="hover:bg-destructive"
              textColor="text-destructive hover:text-destructive-foreground"
              className="shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                clearImage();
              }}
            />
          ) : (
            <Button
              text="Browse files"
              size="sm"
              backgroundColor="bg-primary"
              textColor="text-white"
              className="shrink-0 hover:bg-primary"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            />
          )}
        </div>
      </div>

      {(error || localError) && (
        <p className="text-destructive/50 text-xs mt-1.5">{error || localError}</p>
      )}
    </div>
  );
};

export default InsertImage;