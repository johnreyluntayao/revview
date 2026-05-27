"use client";

import React, { useState } from "react";
import ProductCard from "../atoms/ProductCard";

type Product = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  category: "Materials" | "Books" | "Courses";
};

const products: Product[] = [
  {
    id: 1,
    image: "/steps/image 1.svg",
    title: "Color Mastery in Web Design",
    subtitle: "A Guide to Creating Visually Stunning Websites",
    buttonLink: "https://www.amazon.com/dp/B0CGLZ9Z5P?ref_=pe_3052080_397514860",
    category: "Books",
  },
  {
    id: 2,
    image: "/images/product2.jpg",
    title: "Minimalist UI Kit",
    subtitle: "High-quality Figma components",
    buttonLink: "#",
    category: "Materials",
  },
  {
    id: 3,
    image: "/images/product2.jpg",
    title: "Minimalist UI Kit",
    subtitle: "High-quality Figma components",
    buttonLink: "#",
    category: "Materials",
  },
  {
    id: 4,
    image: "/images/product2.jpg",
    title: "Minimalist UI Kit",
    subtitle: "High-quality Figma components",
    buttonLink: "#",
    category: "Materials",
  },
  {
    id: 5,
    image: "/images/product2.jpg",
    title: "Minimalist UI Kit",
    subtitle: "High-quality Figma components",
    buttonLink: "#",
    category: "Materials",
  },
];

const categories = ["All", "Materials", "Books", "Courses"] as const;

const ProductList = () => {
  const [activeFilter, setActiveFilter] = useState<"All" | "Materials" | "Books" | "Courses">("All");

  const filteredProducts = activeFilter === "All"
    ? products
    : products.filter((product) => product.category === activeFilter);

  return (
    <main className="px-4 md:px-6 lg:px-8 py-8 md:py-10 min-h-screen">
      <div className="mx-auto">
        {/* Fixed Sticky Filter */}
        <div className="sticky top-6 md:top-8 lg:top-10 bg-white z-30 pb-6 border-b border-gray-100">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 text-sm
                  ${
                    activeFilter === category
                      ? "bg-black text-white shadow-md"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Product Area */}
        <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide pt-6 pb-12 pr-2">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.image}
                  title={product.title}
                  subtitle={product.subtitle}
                  buttonLink={product.buttonLink}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-center text-gray-500 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductList;