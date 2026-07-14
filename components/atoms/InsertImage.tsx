"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";

interface InsertImageProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "img_question" | "img_options" | "img_explanation" | "blog_covers";
  placeholder?: string;
  maxSizeMB?: number;
  variant?: "default" | "compact";
  isDisabled?: boolean;
}

const InsertImage: React.FC<InsertImageProps> = ({
  label,
  value,
  onChange,
  folder = "img_question",
  placeholder = "Drag & drop or click to upload",
  maxSizeMB = 5,
  variant = "default",
  isDisabled = false,
}) => {
  const supabase = createClient();

  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random()}.${ext}`;
    const path = `${folder}/${filename}`;

    const { error } = await supabase.storage
      .from("revview-files")
      .upload(path, file);

    if (error) {
      console.error(error);
      alert("Upload failed");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("revview-files")
      .getPublicUrl(path);

    onChange(data.publicUrl);
    setPreview(data.publicUrl);

    setUploading(false);
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Max ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length || isDisabled) return;

    const file = files[0];
    if (!validateFile(file)) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    await uploadFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    onChange("");
  };

  const handleClick = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDisabled) return;
    clearImage();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    setDragActive(false);
    await handleFiles(e.dataTransfer.files);
  };

  const isCompact = variant === "compact";
  const displayedPreview = preview ?? (value || null);

  return (
    <div className="space-y-2">
      {label && (
        <label
          className={`text-[10px] md:text-xs lg:text-sm font-medium ${
            isDisabled ? "text-muted-foreground" : ""
          }`}
        >
          {label}
        </label>
      )}

      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative border rounded-xl transition-all overflow-hidden
          ${isCompact ? "p-3" : "p-5"}

          ${
            isDisabled
              ? "bg-muted/50 border-muted cursor-not-allowed opacity-70"
              : "cursor-pointer"
          }

          ${
            dragActive
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "hover:border-primary/50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          disabled={isDisabled}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {/* Preview Mode */}
        {displayedPreview ? (
          <div className="relative group">
            <Image
              src={displayedPreview}
              alt="preview"
              width={640}
              height={360}
              unoptimized
              className={`
                w-auto place-self-center h-auto rounded-lg
                ${isCompact ? "max-h-20" : "max-h-40"}
              `}
            />

            {!isDisabled && (
              <button
                onClick={handleRemove}
                className="
                  absolute top-2 right-2 
                  bg-black/70 text-white text-xs px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100 transition
                "
              >
                Remove
              </button>
            )}

            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[10px] md:text-xs lg:text-sm">
                Uploading...
              </div>
            )}
          </div>
        ) : (
          <div
            className={`
              flex flex-col items-center justify-center text-center gap-2
              ${isDisabled ? "text-muted-foreground" : ""}
            `}
          >
            <Upload className="w-5 h-5" />

            <p className="text-[10px] md:text-xs lg:text-sm font-medium">
              {uploading ? "Uploading..." : placeholder}
            </p>

            {!isCompact && (
              <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
                PNG, JPG up to {maxSizeMB}MB
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsertImage;
