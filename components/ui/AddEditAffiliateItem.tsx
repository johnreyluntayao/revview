"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/lib/client-imports";
import InputField from "@/components/atoms/InputField";

interface AffiliateItem {
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  affiliateLink: string;
}

interface AddEditAffiliateItemProps {
  isOpen: boolean;
  onClose: () => void;

  // if provided → EDIT mode
  initialData?: AffiliateItem | null;

  // single handler for both add/edit
  onSubmit: (item: AffiliateItem) => void;
}

const defaultForm: AffiliateItem = {
  title: "",
  description: "",
  category: "",
  price: 0,
  imageUrl: "",
  affiliateLink: "",
};

const AddEditAffiliateItem: React.FC<AddEditAffiliateItemProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const isEditMode = !!initialData;

  const [form, setForm] = useState<AffiliateItem>(defaultForm);

  // Load data when editing
  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(defaultForm);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.title || !form.affiliateLink) {
      alert("Title and Affiliate Link are required.");
      return;
    }

    onSubmit(form);
    onClose();
    setForm(defaultForm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit Affiliate Item" : "Add New Affiliate Item"}
          </h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">

          {/* Title */}
          <InputField
            label="Title *"
            placeholder="Item title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* Description (textarea support assumed in InputField) */}
          <InputField
            label="Description"
            type="textarea"
            placeholder="Write something..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* Category + Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium text-gray-700">
                Category
              </label>

              <select
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="">Choose option...</option>
                <option value="Book">Book</option>
                <option value="Course">Course</option>
                <option value="Software">Software</option>
              </select>
            </div>

            <InputField
              label="Price (₱)"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
          </div>

          {/* Image + Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InputField
              label="Image URL"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />

            <InputField
              label="Affiliate Link *"
              placeholder="https://..."
              value={form.affiliateLink}
              onChange={(e) =>
                setForm({ ...form, affiliateLink: e.target.value })
              }
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">

          <Button
            text="Cancel"
            backgroundColor="bg-gray-200"
            textColor="text-gray-800"
            onClick={onClose}
          />

          <Button
            text={isEditMode ? "Update Item" : "Add Item"}
            backgroundColor="bg-blue-600"
            textColor="text-white"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditAffiliateItem;