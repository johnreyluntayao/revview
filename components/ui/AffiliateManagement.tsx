"use client";
import React, { useState } from "react";
import Card from "../atoms/Card";
import { Button, Chip } from "@/lib/client-imports";
import { Add, Delete, Edit } from "@/lib/icons";
import { Share } from "lucide-react";

interface AffiliateItem {
  id: number;
  title: string;
  category: string;
  icon: string;
  price: number;
  status: "Active" | "Inactive";
}

const AffiliateManagement = () => {
  const statsConfig = (items: AffiliateItem[]) => [
    {
      label: "Total Items",
      value: items.length,
    },
    {
      label: "Active Items",
      value: items.filter((i) => i.status === "Active").length,
    },
    {
      label: "Total Value",
      value: `₱ ${items.reduce((sum, i) => sum + i.price, 0).toLocaleString()}`,
    },
  ];

  const [items, setItems] = useState<AffiliateItem[]>([
    {
      id: 1,
      title: "CSE Reviewer: Complete Guide",
      category: "Book",
      icon: "📘",
      price: 499,
      status: "Active",
    },
    {
      id: 2,
      title: "Online Coaching Program",
      category: "Course",
      icon: "⭐",
      price: 2999,
      status: "Active",
    },
  ]);

  const totalItems = items.length;
  const activeItems = items.filter((item) => item.status === "Active").length;
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  // Add new item
  const addItem = () => {
    const newItem: AffiliateItem = {
      id: Date.now(),
      title: "New Affiliate Item",
      category: "Course",
      icon: "📚",
      price: 999,
      status: "Active",
    };
    setItems([...items, newItem]);
  };

  // Remove item
  const removeItem = (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
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
        <div className="hidden lg:flex">
          <Button
            onClick={addItem}
            text="Add Affiliate Item"
            backgroundColor="bg-primary"
            textColor="text-white"
            leftIcon={<Add />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div
          className="
    grid gap-4
    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-1
    "
        >
          <div className="col-span-1">
            <Card
              title="Total Items"
              textColor="text-white"
              value={totalItems}
            />
          </div>
          <div className="col-span-1">
            <Card
              title="Active Items"
              textColor="text-white"
              value={activeItems}
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Card
              title="Total Value"
              textColor="text-white"
              value={new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(totalValue)}
            />
          </div>

          {/* Added justify-end and md:col-span-2 here */}
          <div className="flex justify-end md:col-span-2 lg:hidden">
            <Button
              onClick={addItem}
              text="Add Affiliate Item"
              backgroundColor="bg-primary"
              textColor="text-white"
              leftIcon={<Add />}
            />
          </div>
        </div>

        {/* Affiliate Items Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Head */}
              <thead>
                <tr className="bg-blue-50 border-b">
                  <th className="text-sm md:text-base lg:text-lg text-left px-4 md:px-6 py-3 md:py-4">
                    Title
                  </th>

                  <th className="hidden md:table-cell text-sm md:text-base lg:text-lg text-left px-4 md:px-6 py-3 md:py-4">
                    Category
                  </th>

                  <th className="hidden lg:table-cell text-sm md:text-base lg:text-lg text-left px-4 md:px-6 py-3 md:py-4">
                    Price
                  </th>

                  <th className="text-sm md:text-base lg:text-lg text-left px-2 md:px-6 py-3 md:py-4">
                    Status
                  </th>

                  <th className="text-sm md:text-base lg:text-lg text-center px-4 md:px-6 py-3 md:py-4">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {/* Title + Mobile fallback */}
                    <td className="px-4 md:px-6 py-4 md:py-5 text-sm md:text-base lg:text-lg">
                      <div className="font-medium text-gray-900">
                        {item.title}
                      </div>

                      {/* Mobile Info */}
                      <div className="text-xs text-gray-500 md:hidden">
                        {item.category} • ₱ {item.price.toLocaleString()}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="hidden md:table-cell px-4 md:px-6 py-4 md:py-5 text-sm md:text-base lg:text-lg">
                      <div className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.category}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="hidden lg:table-cell px-4 md:px-6 py-4 md:py-5 font-semibold text-sm md:text-base lg:text-lg">
                      ₱ {item.price.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-2 md:px-6 py-4 md:py-5 text-sm md:text-base lg:text-lg">
                      <Chip
                        text={item.status}
                        className="bg-success whitespace-nowrap text-white"
                      />
                    </td>

                    {/* Actions */}
                    <td className="text-sm md:text-base lg:text-lg p-2 md:p-3 lg:p-4">
                      <div className="flex justify-center items-center gap-1 whitespace-nowrap">
                        <Button
                          leftIcon={<Edit size={14} />}
                          backgroundColor="bg-primary/20"
                          textColor="text-primary"
                          isRounded={true}
                        />
                        <Button
                          leftIcon={<Share size={14} />}
                          backgroundColor="bg-primary/20"
                          textColor="text-primary"
                          isRounded={true}
                        />

                        <Button
                          leftIcon={<Delete size={14} />}
                          backgroundColor="bg-destructive/20"
                          textColor="text-destructive"
                          isRounded={true}
                        />
                      </div>
                    </td>
                  </tr>
                ))}

                {items.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-gray-500 text-sm md:text-base"
                    >
                      No affiliate items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateManagement;
