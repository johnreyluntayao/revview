"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import ProductCard from "../atoms/ProductCard";
import ComboBox from "../atoms/ComboBox";
import Sidebar from "./SideBar";
import { Menu } from "@/lib/icons";

/* ---------------- TYPES ---------------- */

type Category = "All" | "Materials" | "Books" | "Courses";

type PriceFilter = "All" | "Under 50" | "50-100" | "Over 100";

type Product = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonLink: string;
  price: number;
  category: Exclude<Category, "All">;
};

/* ---------------- DATA ---------------- */

const products: Product[] = [
  {
    id: 1,
    image: "/steps/image 1.svg",
    title: "Color Mastery in Web Design",
    subtitle: "A Guide to Creating Visually Stunning Websites",
    buttonLink:
      "https://www.amazon.com/dp/B0CGLZ9Z5P?ref_=pe_3052080_397514860",
    price: 29.99,
    category: "Books",
  },
  {
    id: 2,
    image: "/images/product2.jpg",
    title: "Minimalist UI Kit",
    subtitle: "High-quality Figma components",
    buttonLink: "#",
    price: 49,
    category: "Materials",
  },
  {
    id: 3,
    image: "/images/product2.jpg",
    title: "Advanced React Course",
    subtitle: "Master React and Next.js",
    buttonLink: "#",
    price: 120,
    category: "Courses",
  },
  {
    id: 4,
    image: "/images/product2.jpg",
    title: "Design System Pack",
    subtitle: "Reusable design assets",
    buttonLink: "#",
    price: 89,
    category: "Materials",
  },
  {
    id: 5,
    image: "/images/product2.jpg",
    title: "Frontend Masterclass",
    subtitle: "Complete web development course",
    buttonLink: "#",
    price: 199,
    category: "Courses",
  },
  {
    id: 6,
    image: "/images/product2.jpg",
    title: "UI Resources Bundle",
    subtitle: "Icons, templates, and assets",
    buttonLink: "#",
    price: 39,
    category: "Materials",
  },
];

/* ---------------- OPTIONS ---------------- */

const categoryOptions = [
  { value: "All", label: "All" },
  { value: "Materials", label: "Materials" },
  { value: "Books", label: "Books" },
  { value: "Courses", label: "Courses" },
];

const priceOptions = [
  { value: "All", label: "All Prices" },
  { value: "Under 50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "Over 100", label: "Over $100" },
];

const PRODUCTS_PER_PAGE = 8;

/* ---------------- COMPONENT ---------------- */

const ProductList = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, priceFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        activeFilter === "All" || product.category === activeFilter;

      const priceMatch =
        priceFilter === "All"
          ? true
          : priceFilter === "Under 50"
          ? product.price < 50
          : priceFilter === "50-100"
          ? product.price >= 50 && product.price <= 100
          : product.price > 100;

      return categoryMatch && priceMatch;
    });
  }, [activeFilter, priceFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) =>
            Math.min(prevPage + 1, totalPages)
          );
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [currentPage, totalPages]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Menu Button */}
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-border px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
            <span className="text-sm">Menu</span>
          </button>
        </div>

        <div className="px-4 md:px-6 lg:px-8 py-4">
          <div className="mx-auto">
            {/* FILTERS + INFO */}
            <div className="sticky top-10 lg:top-0 bg-white z-30 py-2 md:py-3 lg:py-4 ">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-56">
                  <ComboBox
                    options={categoryOptions}
                    value={activeFilter}
                    onChange={(value) =>
                      setActiveFilter(value as Category)
                    }
                    placeholder="Category"
                    isSearchable={false}
                  />
                </div>

                <div className="w-full md:w-56">
                  <ComboBox
                    options={priceOptions}
                    value={priceFilter}
                    onChange={(value) =>
                      setPriceFilter(value as PriceFilter)
                    }
                    placeholder="Price Range"
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {paginatedProducts.length} of {filteredProducts.length} products
                </p>

                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            {/* PRODUCTS */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(320px,1fr))] px-2">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      image={product.image}
                      title={product.title}
                      subtitle={product.subtitle}
                      buttonLink={product.buttonLink}
                      category={product.category}
                    />
                  ))}
                </div>

                <div ref={sentinelRef} className="h-2" />
                {currentPage < totalPages && (
                  <div className="flex justify-center py-8">
                    <p className="text-sm text-gray-500">Loading more products...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex justify-center py-20">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;