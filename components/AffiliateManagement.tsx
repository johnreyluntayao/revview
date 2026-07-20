"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Chip, InputField, Modal } from "@/lib/client-imports";
import {
  Add,
  Affiliate,
  AverageScore,
  Delete,
  Edit,
  Eye,
  EyeOff,
  Redirect,
  Sparkles,
} from "@/lib/icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { normalizeHttpUrl, normalizeImageUrl } from "@/lib/safe-url";

interface AffiliateItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  affiliateLink: string;
  status: "Active" | "Inactive";
}

interface AffiliateRow {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price: number | string;
  img_url: string | null;
  affiliate_link: string;
  is_active: boolean;
}

interface AffiliateFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  affiliateLink: string;
}

const defaultFormData: AffiliateFormData = {
  title: "",
  description: "",
  category: "",
  price: 0,
  imageUrl: "",
  affiliateLink: "",
};

const AffiliateManagement = () => {
  const [supabase] = useState(() => createClient());
  const [items, setItems] = useState<AffiliateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<AffiliateFormData>(defaultFormData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AffiliateItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteText, setDeleteText] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionMode, setBulkActionMode] = useState<"move" | "delete" | null>(null);
  const [bulkMoveCategory, setBulkMoveCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const fetchItems = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: AffiliateItem[] = ((data ?? []) as AffiliateRow[]).map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        category: item.category ?? "",
        price: Number(item.price),
        imageUrl: item.img_url ? normalizeImageUrl(item.img_url) ?? "" : "",
        affiliateLink: normalizeHttpUrl(item.affiliate_link) ?? "",
        status: item.is_active ? "Active" : "Inactive",
      }));

      setItems(formatted);
    } catch (error: unknown) {
      console.error("Failed to load affiliate items:", error);
      toast.error("Failed to load affiliate items");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (!bulkMode) {
      setSelectedIds([]);
    }
  }, [bulkMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target.isContentEditable;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s" && !isTyping) {
        event.preventDefault();
        setBulkMode(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddItem = async (data: AffiliateFormData) => {
    const { error } = await supabase.from("affiliate").insert({
      title: data.title,
      description: data.description,
      category: data.category,
      price: data.price,
      img_url: data.imageUrl,
      affiliate_link: data.affiliateLink,
      is_active: true,
    });

    if (error) {
      toast.error("Failed to add item");
      return;
    }

    toast.success("Item added!");
    await fetchItems();
  };

  const openDeletePopup = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    setSelectedId(id);
    setDeleteText(`Delete "${item?.title}"?`);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (bulkActionMode === "delete") {
      if (selectedIds.length === 0) return;

      const { error } = await supabase.from("affiliate").delete().in("id", selectedIds);

      if (error) {
        toast.error("Failed to delete selected items");
        return;
      }

      toast.success("Selected items deleted");
      setDeleteOpen(false);
      setBulkActionMode(null);
      setSelectedIds([]);
      setBulkMode(false);
      await fetchItems();
      return;
    }

    if (!selectedId) return;

    const { error } = await supabase.from("affiliate").delete().eq("id", selectedId);

    if (error) {
      toast.error("Failed to delete");
      return;
    }

    toast.success("Item deleted!");
    setDeleteOpen(false);
    setSelectedId(null);
    await fetchItems();
  };

  const toggleStatus = async (item: AffiliateItem) => {
    const newStatus = item.status !== "Active";

    const { error } = await supabase
      .from("affiliate")
      .update({ is_active: newStatus })
      .eq("id", item.id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(newStatus ? "Activated successfully" : "Deactivated successfully");
    await fetchItems();
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: AffiliateItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      price: item.price,
      imageUrl: item.imageUrl,
      affiliateLink: item.affiliateLink,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData(defaultFormData);
  };

  const handleSaveItem = async () => {
    const payload = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      imageUrl: formData.imageUrl.trim(),
      affiliateLink: formData.affiliateLink.trim(),
      price: Number(formData.price) || 0,
    };

    if (!payload.title || !payload.affiliateLink) {
      toast.error("Title and affiliate link are required.");
      return;
    }

    const safeAffiliateLink = normalizeHttpUrl(payload.affiliateLink);
    const safeImageUrl = payload.imageUrl ? normalizeImageUrl(payload.imageUrl) : "";
    if (!safeAffiliateLink) {
      toast.error("Enter a valid HTTP or HTTPS affiliate link.");
      return;
    }
    if (payload.imageUrl && !safeImageUrl) {
      toast.error("Image URLs must use HTTPS.");
      return;
    }

    payload.affiliateLink = safeAffiliateLink;
    payload.imageUrl = safeImageUrl || "";

    if (editingItem) {
      const { error } = await supabase
        .from("affiliate")
        .update({
          title: payload.title,
          description: payload.description,
          category: payload.category,
          price: payload.price,
          img_url: payload.imageUrl,
          affiliate_link: payload.affiliateLink,
        })
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Failed to update item");
        return;
      }

      toast.success("Item updated!");
    } else {
      await handleAddItem(payload);
    }

    closeModal();
    await fetchItems();
  };

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]));
  };

  const handleMoveSelected = async () => {
    if (!bulkMoveCategory || selectedIds.length === 0) return;

    const { error } = await supabase
      .from("affiliate")
      .update({ category: bulkMoveCategory })
      .in("id", selectedIds);

    if (error) {
      toast.error("Failed to move selected items");
      return;
    }

    toast.success("Selected items moved");
    setDeleteOpen(false);
    setBulkActionMode(null);
    setBulkMoveCategory("");
    setSelectedIds([]);
    setBulkMode(false);
    await fetchItems();
  };

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        `${item.title} ${item.description} ${item.category}`.toLowerCase().includes(normalizedSearch);

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

      const matchesPrice = (() => {
        switch (priceFilter) {
          case "under100": return item.price < 100;
          case "under500": return item.price < 500;
          case "under1000": return item.price < 1000;
          case "under5000": return item.price < 5000;
          default: return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [items, searchTerm, selectedCategory, priceFilter]);

  const allCategories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort(),
    [items],
  );

  const totalItems = items.length;
  const activeItems = items.filter((item) => item.status === "Active").length;
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  const getCategoryClasses = (category: string) => {
    const normalized = category.toLowerCase();

    if (normalized.includes("book")) return "bg-primary/10 text-primary";
    if (normalized.includes("course")) return "bg-secondary/10 text-secondary";
    if (normalized.includes("material")) return "bg-warning/10 text-warning";

    return "bg-muted text-muted-foreground";
  };

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 pb-10 pt-20 md:px-6 md:pb-12 md:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 md:gap-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Product partnerships
            </div>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Manage affiliates</h1>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
              Organize recommended products, control visibility, and maintain affiliate destinations.
            </p>
          </div>
          <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => setBulkMode((current) => !current)}
              className="inline-flex min-h-10 items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              {bulkMode ? "Cancel selection" : "Select multiple"}
            </button>
            <Button
              onClick={handleOpenAddModal}
              text="Add affiliate item"
              backgroundColor="bg-primary"
              textColor="text-white"
              leftIcon={<Add className="size-4" />}
              className="w-full sm:w-auto"
            />
          </div>
        </header>

        <div className="space-y-4">
          <section aria-label="Affiliate summary" className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-medium text-muted-foreground md:text-sm">Total products</div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{loading ? "—" : totalItems}</div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Affiliate className="size-5" /></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-medium text-muted-foreground md:text-sm">Active products</div>
                  <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{loading ? "—" : activeItems}</div>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-success/10 text-success"><Eye className="size-5" /></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium text-muted-foreground md:text-sm">Catalog value</div>
                  <div className="mt-2 truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {loading ? "—" : new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                  maximumFractionDigits: 0,
                }).format(totalValue)}
                  </div>
                </div>
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><AverageScore className="size-5" /></div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-6">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(16rem,1.5fr)_1fr_1fr]">
              <InputField
                label="Search products"
                placeholder="Search title, category, or description"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <div className="space-y-2">
                <label className="block text-xs font-medium text-foreground md:text-sm">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All categories</option>
                  {allCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <label className="block text-xs font-medium text-foreground md:text-sm">
                  Maximum price
                </label>
                <select
                  value={priceFilter}
                  onChange={(event) => setPriceFilter(event.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All prices</option>
                  <option value="under100">Under ₱100</option>
                  <option value="under500">Under ₱500</option>
                  <option value="under1000">Under ₱1000</option>
                  <option value="under5000">Under ₱5000</option>
                </select>
              </div>

            </div>

            {bulkMode && (
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-foreground">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} items selected`
                    : "Select items to manage them in bulk."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    text="Move Selected"
                    onClick={() => {
                      setBulkActionMode("move");
                      setDeleteText(`${selectedIds.length} selected items`);
                      setDeleteOpen(true);
                    }}
                    backgroundColor="bg-primary"
                    textColor="text-white"
                    isDisabled={selectedIds.length === 0}
                  />
                  <Button
                    text="Delete Selected"
                    onClick={() => {
                      setBulkActionMode("delete");
                      setDeleteText(`${selectedIds.length} selected items`);
                      setDeleteOpen(true);
                    }}
                    backgroundColor="bg-destructive"
                    textColor="text-white"
                    borderColor="border-destructive"
                    isDisabled={selectedIds.length === 0}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3 md:hidden">
              {loading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
                  ))
                : filteredItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <article
                        key={item.id}
                        className={`rounded-xl border p-4 transition ${
                          isSelected ? "border-primary/30 bg-primary/5" : "border-border/80 bg-background"
                        }`}
                        onClick={() => bulkMode && toggleSelectItem(item.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {bulkMode && (
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectItem(item.id)}
                                  onClick={(event) => event.stopPropagation()}
                                  className="size-4 rounded border-border text-primary focus:ring-primary"
                                  aria-label={`Select ${item.title}`}
                                />
                              )}
                              <h2 className="truncate text-sm font-semibold text-foreground">{item.title}</h2>
                            </div>
                            <p className="mt-1 text-lg font-bold text-foreground">₱{item.price.toLocaleString()}</p>
                          </div>
                          <Chip text={item.category || "Uncategorized"} className={getCategoryClasses(item.category)} />
                        </div>

                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description || "No description provided."}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              void toggleStatus(item);
                            }}
                            className={`inline-flex min-h-9 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                              item.status === "Active"
                                ? "bg-success/10 text-success hover:bg-success/15"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            {item.status === "Active" ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                            {item.status}
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleOpenEditModal(item);
                              }}
                              className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition hover:bg-primary/15"
                              aria-label={`Edit ${item.title}`}
                            >
                              <Edit className="size-4" />
                            </button>
                            {item.affiliateLink ? (
                              <a
                                href={item.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition hover:bg-primary/15"
                                aria-label={`Open affiliate link for ${item.title}`}
                              >
                                <Redirect className="size-4" />
                              </a>
                            ) : null}
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                openDeletePopup(item.id);
                              }}
                              className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/15"
                              aria-label={`Delete ${item.title}`}
                            >
                              <Delete className="size-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}

              {!loading && filteredItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-12 text-center text-sm text-muted-foreground">
                  No affiliate products match the current filters.
                </div>
              )}
            </div>

            <div className="mt-4 hidden overflow-hidden rounded-xl border border-border md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-card text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      {bulkMode && <th className="w-10 px-3 py-3"></th>}
                      <th className="px-4 py-3">Title</th>
                      <th className="hidden px-4 py-3 md:table-cell">Category</th>
                      <th className="hidden px-4 py-3 lg:table-cell">Price</th>
                      <th className="hidden px-4 py-3 md:table-cell text-center">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isSelected = selectedIds.includes(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`transition ${isSelected ? "bg-primary/5" : "hover:bg-slate-50"}`}
                          onClick={() => {
                            if (bulkMode) {
                              toggleSelectItem(item.id);
                            }
                          }}
                        >
                          {bulkMode && (
                            <td className="px-3 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectItem(item.id)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              />
                            </td>
                          )}

                          <td className="px-4 py-4">
                            <div className="flex items-start gap-3">
                              <div>
                                <div className="font-semibold text-foreground">{item.title}</div>
                                <div className="mt-1 text-xs text-slate-500 md:hidden">
                                  {item.category} • ₱ {item.price.toLocaleString()}
                                </div>
                                <div className="mt-2 text-xs text-slate-500">
                                  {item.description || "No description provided."}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="hidden px-4 py-4 md:table-cell">
                            <Chip text={item.category || "Uncategorized"} className={getCategoryClasses(item.category)} />
                          </td>

                          <td className="hidden px-4 py-4 font-semibold text-foreground lg:table-cell">
                            ₱ {item.price.toLocaleString()}
                          </td>

                          <td className="hidden px-4 py-4 md:table-cell">
                            <div className="flex items-center">
                              <Chip
                                text={item.status}
                                className={item.status === "Active" ? "bg-success text-white" : "bg-slate-300 text-slate-700"}
                                onClick={() => toggleStatus(item)}
                              />
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleStatus(item);
                                }}
                                leftIcon={item.status === "Active" ? <Eye /> : <EyeOff />}
                                size="sm"
                                backgroundColor="bg-transparent"
                                textColor="text-slate-600"
                                className="hidden md:flex"
                              />
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-1">
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleOpenEditModal(item);
                                }}
                                leftIcon={<Edit size={14} />}
                                backgroundColor="bg-primary/20"
                                textColor="text-primary"
                                size="sm"
                              />
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  window.open(item.affiliateLink, "_blank", "noopener,noreferrer");
                                }}
                                isDisabled={!item.affiliateLink}
                                leftIcon={<Redirect size={14} />}
                                backgroundColor="bg-primary/20"
                                textColor="text-primary"
                                size="sm"
                              />
                              <Button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  openDeletePopup(item.id);
                                }}
                                leftIcon={<Delete size={14} />}
                                backgroundColor="bg-destructive/20"
                                textColor="text-destructive"
                                size="sm"
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={bulkMode ? 6 : 5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                          {loading ? "Loading affiliate products..." : "No affiliate products match the current filters."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        size="lg"
        title={
          <div className="text-lg font-semibold text-foreground">
            {editingItem ? "Edit Affiliate Item" : "Add New Affiliate Item"}
          </div>
        }
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              onClick={closeModal}
              textColor="text-foreground"
              backgroundColor="bg-card"
              borderColor="border-foreground/50"
              className="w-full sm:w-auto"
            />
            <Button
              text={editingItem ? "Update Item" : "Add Item"}
              onClick={handleSaveItem}
              textColor="text-white"
              backgroundColor="bg-primary"
              className="w-full sm:w-auto"
            />
          </div>
        }
      >
        <div className="space-y-5 p-4 md:p-5 lg:p-6">
          <InputField
            label="Title *"
            placeholder="Item title"
            value={formData.title}
            onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
          />

          <InputField
            label="Description"
            type="textarea"
            placeholder="Write something..."
            value={formData.description}
            onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <select
                value={formData.category}
                onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Choose option...</option>
                <option value="Book">Book</option>
                <option value="Course">Course</option>
                <option value="Material">Material</option>
              </select>
            </div>

            <InputField
              label="Price (₱)"
              type="number"
              placeholder="0"
              value={formData.price}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, price: Number(event.target.value) || 0 }))
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InputField
              label="Image URL"
              placeholder="https://..."
              value={formData.imageUrl}
              onChange={(event) => setFormData((prev) => ({ ...prev, imageUrl: event.target.value }))}
            />

            <InputField
              label="Affiliate Link *"
              placeholder="https://..."
              value={formData.affiliateLink}
              onChange={(event) => setFormData((prev) => ({ ...prev, affiliateLink: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedId(null);
          setBulkActionMode(null);
          setBulkMoveCategory("");
        }}
        size="md"
        title={
          <div className="flex items-center gap-3">
            <Delete className="h-7 w-7 shrink-0 text-destructive md:h-8 md:w-8" />
            <span className="text-xl font-semibold text-foreground">
              {bulkActionMode === "move" ? "Move Selected?" : bulkActionMode === "delete" ? "Delete Selected?" : "Delete Item?"}
            </span>
          </div>
        }
        description={
          bulkActionMode === "move"
            ? "Move the selected affiliate items to a different category."
            : bulkActionMode === "delete"
              ? "Delete the selected affiliate items permanently?"
              : "Are you sure you want to delete this item? This action cannot be undone."
        }
        footer={
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Button
              text="Cancel"
              onClick={() => {
                setDeleteOpen(false);
                setSelectedId(null);
                setBulkActionMode(null);
                setBulkMoveCategory("");
              }}
            />
            <Button
              text={bulkActionMode === "move" ? "Move Selected" : "Delete"}
              backgroundColor={bulkActionMode === "move" ? "bg-primary" : "bg-destructive"}
              textColor="text-white"
              borderColor={bulkActionMode === "move" ? "border-primary" : "border-destructive"}
              onClick={bulkActionMode === "move" ? handleMoveSelected : confirmDelete}
            />
          </div>
        }
      >
        <div className="space-y-4 px-4 py-4 sm:px-6 sm:py-5">
          {bulkActionMode === "move" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Choose a category</label>
              <select
                value={bulkMoveCategory}
                onChange={(event) => setBulkMoveCategory(event.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select category</option>
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            deleteText && (
              <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-foreground/90 line-clamp-3">
                {deleteText}
              </div>
            )
          )}
        </div>
      </Modal>
    </main>
  );
};

export default AffiliateManagement;
