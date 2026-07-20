"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import ProductCard from "../atoms/ProductCard";
import ComboBox from "../atoms/ComboBox";
import Button from "../atoms/Button";
import { createClient } from "@/lib/supabase/client";
import type { Affiliate } from "@/lib/types";
import {
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "@/lib/icons";

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

const PRODUCTS_PER_PAGE = 12;

/* ---------------- COMPONENT ---------------- */

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
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
      { value: "All", label: "All categories" },
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
    0,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    activeFilter !== "All" ||
    priceRange !== "all" ||
    sortBy !== "newest";

  const activeFilterCount = [
    searchTerm.trim() !== "",
    activeFilter !== "All",
    priceRange !== "all",
  ].filter(Boolean).length;

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
    <div className="min-h-screen bg-muted/20">
      <section className="border-b border-primary/10 bg-linear-to-br from-primary/10 via-background to-secondary/8 px-4 pb-12 pt-28 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Build a smarter study setup
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base lg:text-lg">
              Explore trusted review materials, courses, and learning tools
              selected to complement your RevView preparation.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Purchases are completed securely on each provider&apos;s website.
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-border/80 bg-background p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-4 md:hidden">
              <div>
                <p className="text-sm font-bold text-foreground">Find products</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Search or narrow the catalog
                </p>
              </div>
              <Button
                text="Filters"
                size="sm"
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                rightIcon={
                  activeFilterCount > 0 ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                      {activeFilterCount}
                    </span>
                  ) : undefined
                }
                borderColor="border-border"
                backgroundColor="bg-background"
                onClick={() => setIsFiltersOpen((open) => !open)}
                className="min-h-10 px-3 py-2 text-xs font-bold hover:bg-primary/5"
                aria-expanded={isFiltersOpen}
              />
            </div>

            <div
              className={`${isFiltersOpen ? "grid" : "hidden"} mt-4 gap-4 md:mt-0 md:grid md:grid-cols-2 xl:grid-cols-[minmax(280px,1.5fr)_minmax(180px,0.8fr)_minmax(180px,0.8fr)_minmax(180px,0.8fr)_auto]`}
            >
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-foreground">
                  Search
                </span>
                <span className="relative block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search titles or categories"
                    className="min-h-11 w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </span>
              </label>

              <ComboBox
                label="Category"
                options={categoryOptions}
                value={activeFilter}
                onChange={handleCategoryChange}
                placeholder="Category"
                isSearchable
              />

              <ComboBox
                label="Price"
                options={priceRangeOptions}
                value={priceRange}
                onChange={handlePriceRangeChange}
                placeholder="Price range"
                isSearchable={false}
              />

              <ComboBox
                label="Sort by"
                options={sortOptions}
                value={sortBy}
                onChange={handleSortChange}
                placeholder="Sort"
                isSearchable={false}
              />

              <div className="flex items-end">
                <Button
                  text="Reset"
                  size="sm"
                  leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
                  borderColor="border-border"
                  onClick={resetFilters}
                  isDisabled={!hasActiveFilters}
                  className="min-h-11 w-full px-4 py-2.5 text-xs font-bold hover:bg-primary/5 xl:w-auto"
                />
              </div>
            </div>
          </div>

          <div className="mb-5 mt-7 flex items-end justify-between gap-4 sm:mb-6 sm:mt-8">
            <div>
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                Recommended products
              </h2>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {loading
                  ? "Loading the latest resources..."
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1 ? "product" : "products"
                    } found`}
              </p>
            </div>
            {!loading && filteredProducts.length > 0 && (
              <p className="shrink-0 text-xs font-medium text-muted-foreground sm:text-sm">
                Showing {paginatedProducts.length} of {filteredProducts.length}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-border/70 bg-background"
                >
                  <div className="aspect-[4/3] animate-pulse bg-muted" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-4/5 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-3/5 animate-pulse rounded bg-muted" />
                    <div className="mt-5 h-10 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    image={product.img_url || "/Icon.svg"}
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
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  Loading more products
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-16 text-center">
              <PackageSearch className="mx-auto h-10 w-10 text-primary/60" />
              <h3 className="mt-4 text-lg font-bold text-foreground">
                No products match your filters
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Try a broader search, another category, or reset the filters to
                see the full catalog.
              </p>
              <Button
                text="Clear all filters"
                size="sm"
                leftIcon={<RotateCcw className="h-4 w-4" />}
                backgroundColor="bg-primary"
                textColor="text-primary-foreground"
                onClick={resetFilters}
                className="mx-auto mt-5 min-h-10 px-4 py-2 text-sm font-bold"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductList;
