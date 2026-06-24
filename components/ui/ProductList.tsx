"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import ProductCard from "../atoms/ProductCard";
import ComboBox from "../atoms/ComboBox";
import Sidebar from "./SideBar";
import { Menu, Search } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import type { Affiliate } from "@/lib/types";

/* ---------------- TYPES ---------------- */

type PriceFilter = "All" | "Under 50" | "50-100" | "Over 100";

/* ---------------- OPTIONS ---------------- */

const priceOptions = [
  { value: "All", label: "All Prices" },
  { value: "Under 50", label: "Under ₱50" },
  { value: "50-100", label: "₱50 - ₱100" },
  { value: "Over 100", label: "Over ₱100" },
];

const PRODUCTS_PER_PAGE = 8;

/* ---------------- COMPONENT ---------------- */

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchAffiliates() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("affiliate")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching affiliates:", error);
        setLoading(false);
        return;
      }

      setProducts(data || []);
      setLoading(false);
    }

    fetchAffiliates();
  }, []);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return [
      { value: "All", label: "All" },
      ...categories.map((category) => ({ value: category, label: category })),
    ];
  }, [products]);

  const handleCategoryChange = (category: string) => {
    setActiveFilter(category);
    setCurrentPage(1);
  };

  const handlePriceFilterChange = (value: string) => {
    setPriceFilter(value as PriceFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const price = Number(product.price) || 0;

      const searchMatch =
        normalizedSearch === "" ||
        [
          product.title,
          product.description,
          product.category,
          price.toString(),
          `₱${price}`,
          `${price} php`,
        ].some((value) =>
          (value || "").toString().toLowerCase().includes(normalizedSearch),
        );

      const categoryMatch =
        activeFilter === "All" || product.category === activeFilter;

      const priceMatch =
        priceFilter === "All"
          ? true
          : priceFilter === "Under 50"
            ? price < 50
            : priceFilter === "50-100"
              ? price >= 50 && price <= 100
              : price > 100;

      return searchMatch && categoryMatch && priceMatch;
    });
  }, [activeFilter, priceFilter, products, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
        }
      },
      {
        rootMargin: "200px",
      },
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
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className="w-full rounded-md border border-border bg-background py-2.5 pl-10 pr-4 text-xs text-foreground placeholder-foreground focus:border-primary/75 focus:ring focus:ring-primary/30 md:text-sm lg:text-base"
                  />
                </div>

                <div className="w-full md:w-56">
                  <ComboBox
                    options={categoryOptions}
                    value={activeFilter}
                    onChange={handleCategoryChange}
                    placeholder="Category"
                    isSearchable={false}
                  />
                </div>

                <div className="w-full md:w-56">
                  <ComboBox
                    options={priceOptions}
                    value={priceFilter}
                    onChange={handlePriceFilterChange}
                    placeholder="Price Range"
                    isSearchable={false}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Showing {paginatedProducts.length} of{" "}
                  {filteredProducts.length} products
                </p>

                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>

            {/* PRODUCTS */}
            {loading ? (
              <div className="flex justify-center py-20">
                <p className="text-gray-500">Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 px-2">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      image={product.img_url || "/icon.svg"}
                      imageAlt={product.title}
                      title={product.title}
                      subtitle={product.description || ""}
                      price={product.price}
                      buttonLink={product.affiliate_link}
                      category={product.category}
                      onCategoryClick={handleCategoryChange}
                    />
                  ))}
                </div>

                <div ref={sentinelRef} className="h-2" />
                {currentPage < totalPages && (
                  <div className="flex justify-center py-8">
                    <p className="text-sm text-gray-500">
                      Loading more products...
                    </p>
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
