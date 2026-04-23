"use client";

import React, { useState } from "react";
import Card from "../atoms/Card";
import { Button, Chip, DeletePopup } from "@/lib/client-imports";
import { Add, Delete, Edit } from "@/lib/icons";
import { Share } from "lucide-react";
import AddAffiliateItem from "./AddEditAffiliateItem";
import AddEditAffiliateItem from "./AddEditAffiliateItem";
import { toast } from "sonner";

interface AffiliateItem {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  imageUrl?: string;
  affiliateLink: string;
  status: "Active" | "Inactive";
}

const AffiliateManagement = () => {
  const [items, setItems] = useState<AffiliateItem[]>([
    {
      id: 1,
      title: "CSE Reviewer: Complete Guide",
      description: "Best reviewer for Civil Service Exam",
      category: "Book",
      price: 499,
      affiliateLink: "#",
      status: "Active",
    },
    {
      id: 2,
      title: "Online Coaching Program",
      description: "Full coaching with mentors",
      category: "Course",
      price: 2999,
      affiliateLink: "#",
      status: "Active",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats
  const totalItems = items.length;
  const activeItems = items.filter((item) => item.status === "Active").length;
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  const handleShare = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);

      // simple feedback (you can replace with toast later)
      toast.success("Link copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link.");
    }
  };

  // ✅ Add item from modal
  const handleAddItem = (data: {
    title: string;
    description: string;
    category: string;
    price: number;
    imageUrl: string;
    affiliateLink: string;
  }) => {
    const newItem: AffiliateItem = {
      id: Date.now(),
      ...data,
      status: "Active",
    };

    setItems((prev) => [...prev, newItem]);
  };

  // Remove item
  const removeItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [deleteText, setDeleteText] = useState("");

  const openDeletePopup = (id: number) => {
    const item = items.find((i) => i.id === id);

    setSelectedId(id);
    setDeleteText(`Delete "${item?.title}"?`);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedId) return;

    setItems((prev) => prev.filter((item) => item.id !== selectedId));

    setSelectedId(null);
    setDeleteOpen(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Affiliate Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your affiliate marketing materials
          </p>
        </div>

        {/* Desktop Add Button */}
        <div className="hidden lg:flex">
          <Button
            onClick={() => setIsModalOpen(true)}
            text="Add Affiliate Item"
            backgroundColor="bg-primary"
            textColor="text-white"
            leftIcon={<Add />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
          <Card title="Total Items" textColor="text-white" value={totalItems} />
          <Card
            title="Active Items"
            textColor="text-white"
            value={activeItems}
          />
          <Card
            title="Total Value"
            textColor="text-white"
            value={new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(totalValue)}
          />

          {/* Mobile Add Button */}
          <div className="flex justify-end md:col-span-2 lg:hidden">
            <Button
              onClick={() => setIsModalOpen(true)}
              text="Add Affiliate Item"
              backgroundColor="bg-primary"
              textColor="text-white"
              leftIcon={<Add />}
            />
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Head */}
              <thead>
                <tr className="bg-blue-50 border-b">
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="hidden md:table-cell text-left px-4 py-3">
                    Category
                  </th>
                  <th className="hidden lg:table-cell text-left px-4 py-3">
                    Price
                  </th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3">Actions</th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Title */}
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>

                      <div className="text-xs text-gray-500 md:hidden">
                        {item.category} • ₱ {item.price.toLocaleString()}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="hidden md:table-cell px-4 py-4">
                      {item.category}
                    </td>

                    {/* Price */}
                    <td className="hidden lg:table-cell px-4 py-4 font-semibold">
                      ₱ {item.price.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">
                      <Chip
                        text={item.status}
                        className={
                          item.status === "Active"
                            ? "bg-success text-white"
                            : "bg-gray-300 text-gray-800"
                        }
                      />
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex justify-center gap-1">
                        <Button
                          leftIcon={<Edit size={14} />}
                          backgroundColor="bg-primary/20"
                          textColor="text-primary"
                          isRounded
                        />

                        <Button
                          onClick={() => handleShare(item.affiliateLink)}
                          leftIcon={<Share size={14} />}
                          backgroundColor="bg-primary/20"
                          textColor="text-primary"
                          isRounded
                        />

                        <Button
                          onClick={() => openDeletePopup(item.id)}
                          leftIcon={<Delete size={14} />}
                          backgroundColor="bg-destructive/20"
                          textColor="text-destructive"
                          isRounded
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-500">
                      No affiliate items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Modal Usage */}
      <AddEditAffiliateItem
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
      />

      <DeletePopup
        isOpen={deleteOpen}
        questionText={deleteText}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteOpen(false);
          setSelectedId(null);
        }}
      />
    </div>
  );
};

export default AffiliateManagement;
