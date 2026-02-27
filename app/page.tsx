"use client"
import ComboBox from "@/components/atoms/ComboBox";
import { InputField } from "@/lib/imports";
import React, { useState } from "react";


export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics & Gadgets" },
    { value: "fashion", label: "Fashion & Apparel" },
    { value: "home", label: "Home & Kitchen" },
    { value: "books", label: "Books & Stationery" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "toys", label: "Toys & Games" },
  ];

  return (
    <div className="space-y-3 w-full max-w-lg">


          <ComboBox
            label="Category"
            placeholder="Choose a category..."
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <InputField label="Yes"/>

    </div>
  );
}
