// components/ui/InsertImage.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, Link as LinkIcon, X } from "lucide-react"; // assuming you have lucide-react

interface InsertImageProps {
  label: string;
  value: string;                    // this will be the final image URL (remote or blob)
  onChange: (url: string) => void;  // called with final usable URL
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  maxSizeMB?: number;               // default 5MB
}

const InsertImage: React.FC<InsertImageProps> = ({
  label,
  value,
  onChange,
  placeholder = "Paste image URL or drag & drop here...",
  error,
  required = false,
  className = "",
  maxSizeMB = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [inputMode, setInputMode] = useState<"url" | "file">("url"); // default to URL input
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const hasError = !!error || !!localError;

  // Sync external value → preview
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  // Cleanup blob URLs when component unmounts or value changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setLocalError(null);

    // Validate file type & size
    if (!file.type.startsWith("image/")) {
      setLocalError("Only image files are allowed (jpg, png, gif, etc.)");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File too large. Max ${maxSizeMB}MB allowed.`);
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);
    onChange(blobUrl); // Pass blob URL to parent — you can upload it later
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setPreview(url || null);
    onChange(url);
    setLocalError(null);
  };

  const clearImage = () => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange("");
    setLocalError(null);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-destructive/50 ml-1">*</span>}
        </label>

        {/* Toggle between URL and Upload mode */}
        <div className="flex space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`px-2.5 py-1 rounded-md ${
              inputMode === "url"
                ? "bg-primary/10 text-primary font-medium"
                : "text-border/60 hover:bg-border/10"
            }`}
          >
            <LinkIcon className="inline w-3.5 h-3.5 mr-1" />
            Link
          </button>
          <button
            type="button"
            onClick={() => setInputMode("file")}
            className={`px-2.5 py-1 rounded-md ${
              inputMode === "file"
                ? "bg-primary/10 text-primary font-medium"
                : "text-border/60 hover:bg-border/10"
            }`}
          >
            <Upload className="inline w-3.5 h-3.5 mr-1" />
            Upload
          </button>
        </div>
      </div>

      {inputMode === "url" ? (
        <input
          type="url"
          value={value}
          onChange={handleUrlChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl border transition-all duration-200
            text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
            ${hasError
              ? "border-destructive/50 ring-2 ring-destructive/20"
              : "border-border/30 hover:border-border/40"}
            bg-white
          `}
        />
      ) : (
        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
            ${isDragging
              ? "border-primary/50 bg-primary/5"
              : hasError
              ? "border-destructive/50 bg-destructive/5"
              : "border-border/5 hover:border-primary/40 hover:bg-background/5"}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          {!preview ? (
            <>
              <Upload className="mx-auto h-10 w-10 text-foreground/60" />
              <p className="mt-2 text-sm font-medium text-foreground/60">
                Drag & drop image here or click to browse
              </p>
              <p className="mt-1 text-xs text-foreground/50">
                PNG, JPG, GIF up to {maxSizeMB}MB
              </p>
            </>
          ) : (
            <div className="space-y-2">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 mx-auto object-contain rounded shadow-sm"
                onError={() => setLocalError("Invalid image URL")}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearImage();
                }}
                className="text-sm text-destructive/60 hover:text-destructive/80"
              >
                <X className="inline w-4 h-4 mr-1" />
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {(error || localError) && (
        <p className="text-destructive/50 text-xs mt-1">{error || localError}</p>
      )}

      {preview && inputMode === "url" && (
        <div className="mt-3 border border-border/20 rounded-lg overflow-hidden bg-border/20">
          <div className="aspect-video bg-border/20 flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
              onError={() => setLocalError("Failed to load image from URL")}
            />
          </div>
          <p className="text-xs text-foreground/60 p-2 truncate">{preview}</p>
        </div>
      )}
    </div>
  );
};

export default InsertImage;