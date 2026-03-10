"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/lib/client-imports";
import { Upload } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";

interface InsertImageProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  folder?: "img_question" | "img_options" | "img_explanation";
  placeholder?: string;
  maxSizeMB?: number;
  variant?: "default" | "compact";
}

const InsertImage: React.FC<InsertImageProps> = ({
  label,
  value,
  onChange,
  folder = "img_question",
  placeholder = "Drag/drop or click to add image...",
  maxSizeMB = 5,
  variant = "default",
}) => {

  const supabase = createClient();

  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);

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

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      alert("Only images allowed");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Max ${maxSizeMB}MB`);
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    await uploadFile(file);
  };

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const clearImage = () => {
    setPreview(null);
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div
        onClick={() => fileInputRef.current?.click()}
        className="border rounded-xl p-4 cursor-pointer"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />

        {preview ? (
          <div className="flex items-center gap-3">
            <img alt="preview" src={preview} className="w-12 h-12 object-cover rounded" />
            <Button text="Remove" onClick={clearImage} />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm">
            <Upload />
            {uploading ? "Uploading..." : placeholder}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsertImage;