"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Chip, Modal, Card, InputField } from "@/lib/client-imports";
import { Add, Delete, Edit, Redirect, Eye, EyeOff } from "@/lib/icons";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

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
  const [items, setItems] = useState<AffiliateItem[]>([]);
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

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!bulkMode) {
      setSelectedIds([]);
    }
  }, [bulkMode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        setBulkMode(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("affiliate")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load items");
      return;
    }

    const formatted: AffiliateItem[] = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      price: Number(item.price),
      imageUrl: item.img_url,
      affiliateLink: item.affiliate_link,
      status: item.is_active ? "Active" : "Inactive",
    }));

    setItems(formatted);
  };

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

  const handleLongPressStart = (id: string) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    longPressTimer.current = setTimeout(() => {
      setBulkMode(true);
      toggleSelectItem(id);
    }, 350);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
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

    if (normalized.includes("book")) return "bg-blue-600 text-white";
    if (normalized.includes("course")) return "bg-purple-600 text-white";
    if (normalized.includes("material")) return "bg-amber-600 text-white";

    return "bg-slate-600 text-white";
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-20 md:px-6 md:py-24 lg:px-8 lg:py-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-white/90 p-5 shadow-sm md:flex-row md:items-end md:justify-between md:p-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Affiliate Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your affiliate marketing materials in one place.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_3fr]">
          <div className="grid gap-4 md:grid-cols-3 xl:flex xl:flex-col xl:gap-4">
            <div className="flex h-28 flex-col justify-between rounded-2xl border border-border bg-linear-to-br from-primary to-secondary p-4 text-white shadow-sm">
              <div className="text-sm font-medium opacity-90">Total Items</div>
              <div className="text-2xl font-semibold">{totalItems}</div>
            </div>
            <div className="flex h-28 flex-col justify-between rounded-2xl border border-border bg-linear-to-br from-emerald-500 to-green-600 p-4 text-white shadow-sm">
              <div className="text-sm font-medium opacity-90">Active Items</div>
              <div className="text-2xl font-semibold">{activeItems}</div>
            </div>
            <div className="flex h-28 flex-col justify-between rounded-2xl border border-border bg-linear-to-br from-slate-700 to-slate-900 p-4 text-white shadow-sm">
              <div className="text-sm font-medium opacity-90">Total Value</div>
              <div className="text-xl font-semibold">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(totalValue)}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-white p-4 shadow-sm md:p-6">
            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
              <InputField
                label="Search affiliates"
                placeholder="Search by title, category, or description"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <div className="space-y-2">
                <label className="block text-[10px] font-medium text-gray-700 md:text-xs lg:text-sm">
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

              <div className="space-y-2">
                <label className="block text-[10px] font-medium text-gray-700 md:text-xs lg:text-sm">
                  Max price
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

              <div className="flex items-end">
                <Button
                  onClick={handleOpenAddModal}
                  text="Add Affiliate Item"
                  backgroundColor="bg-primary"
                  textColor="text-white"
                  leftIcon={<Add />}
                  className="w-full md:w-auto"
                />
              </div>
            </div>

            {bulkMode && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-slate-50 px-4 py-3">
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

            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white text-sm">
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
                          onTouchStart={() => handleLongPressStart(item.id)}
                          onTouchEnd={handleLongPressEnd}
                          onTouchCancel={handleLongPressEnd}
                          onMouseDown={() => handleLongPressStart(item.id)}
                          onMouseUp={handleLongPressEnd}
                          onMouseLeave={handleLongPressEnd}
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
                                  window.open(item.affiliateLink, "_blank");
                                }}
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
                        <td colSpan={bulkMode ? 6 : 5} className="px-4 py-12 text-center text-sm text-slate-500">
                          No affiliate items match the current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
              backgroundColor="bg-white"
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
    </div>
  );
};

export default AffiliateManagement;