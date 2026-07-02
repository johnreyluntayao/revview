"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import ProductCard from "../atoms/ProductCard";
import ComboBox from "../atoms/ComboBox";
import { Close, Search } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import type { Affiliate } from "@/lib/types";

/* ---------------- TYPES ---------------- */

type SortOption = "newest" | "price-low" | "price-high" | "name";
type PriceRange = "all" | "under-50" | "50-100" | "101-200" | "201-500" | "over-500";

/* ---------------- OPTIONS ---------------- */

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

const priceRangeOptions = [
  { value: "all", label: "All Prices" },
  { value: "under-50", label: "Under PHP 50" },
  { value: "50-100", label: "PHP 50 - PHP 100" },
  { value: "101-200", label: "PHP 101 - PHP 200" },
  { value: "201-500", label: "PHP 201 - PHP 500" },
  { value: "over-500", label: "Over PHP 500" },
];

const PRODUCTS_PER_PAGE = 8;

/* ---------------- COMPONENT ---------------- */

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
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

  const handlePriceRangeChange = (value: string) => {
    setPriceRange(value as PriceRange);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setActiveFilter("All");
    setPriceRange("all");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    const searchTerms = searchTerm
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return products.filter((product) => {
      const price = Number(product.price) || 0;

      const searchableText = [
        product.title,
        product.description,
        product.category,
        price.toString(),
        `php ${price}`,
        `${price} php`,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatch =
        searchTerms.length === 0 ||
        searchTerms.every((term) => searchableText.includes(term));

      const categoryMatch =
        activeFilter === "All" || product.category === activeFilter;

      const priceMatch =
        priceRange === "all"
          ? true
          : priceRange === "under-50"
            ? price < 50
            : priceRange === "50-100"
              ? price >= 50 && price <= 100
              : priceRange === "101-200"
                ? price >= 101 && price <= 200
                : priceRange === "201-500"
                  ? price >= 201 && price <= 500
                  : price > 500;

      return searchMatch && categoryMatch && priceMatch;
    }).sort((a, b) => {
      if (sortBy === "price-low") {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }

      if (sortBy === "price-high") {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }

      if (sortBy === "name") {
        return a.title.localeCompare(b.title);
      }

      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [activeFilter, priceRange, products, searchTerm, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    activeFilter !== "All" ||
    priceRange !== "all" ||
    sortBy !== "newest";

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
    <div className="min-h-screen bg-background">
      <main>
        <div className="px-4 md:px-6 lg:px-8 py-6">
          <div className="mx-auto max-w-screen-3xl">
            {/* FILTERS + INFO */}
            <div className="sticky top-16 lg:top-20 bg-white z-30 py-2 md:py-3 lg:py-4 ">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_220px_190px_190px_auto]">
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

                <div className="w-full">
                  <ComboBox
                    options={categoryOptions}
                    value={activeFilter}
                    onChange={handleCategoryChange}
                    placeholder="Category"
                    isSearchable
                  />
                </div>

                <div className="w-full">
                  <ComboBox
                    options={priceRangeOptions}
                    value={priceRange}
                    onChange={handlePriceRangeChange}
                    placeholder="Price Range"
                    isSearchable={false}
                  />
                </div>

                <div className="w-full">
                  <ComboBox
                    options={sortOptions}
                    value={sortBy}
                    onChange={handleSortChange}
                    placeholder="Sort"
                    isSearchable={false}
                  />
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-3 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <Close className="h-4 w-4" />
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-1 mt-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
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
