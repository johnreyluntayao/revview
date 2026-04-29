"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  DeletePopup,
  AddEditAffiliate,
  Card,
} from "@/lib/client-imports";
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

const AffiliateManagement = () => {
  const [items, setItems] = useState<AffiliateItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AffiliateItem | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    fetchItems();
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

    const formatted: AffiliateItem[] = data.map((item) => ({
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

  const handleAddItem = async (data: any) => {
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
    fetchItems();
  };

  const openDeletePopup = (id: string) => {
    const item = items.find((i) => i.id === id);

    setSelectedId(id);
    setDeleteText(`Delete "${item?.title}"?`);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;

    const { error } = await supabase
      .from("affiliate")
      .delete()
      .eq("id", selectedId);

    if (error) {
      toast.error("Failed to delete");
      return;
    }

    toast.success("Item deleted!");
    setDeleteOpen(false);
    setSelectedId(null);
    fetchItems();
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

    toast.success(
      newStatus ? "Activated successfully" : "Deactivated successfully"
    );

    fetchItems();
  };

  const totalItems = items.length;
  const activeItems = items.filter((i) => i.status === "Active").length;
  const totalValue = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="px-4 md:px-6 lg:px-8 py-20 md:py-24 lg:py-28 space-y-6 bg-primary/3 min-h-screen">
      {/* HEADER */}
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
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            text="Add Affiliate Item"
            backgroundColor="bg-primary"
            textColor="text-white"
            leftIcon={<Add />}
          />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start ">
        {/* STATS */}
        <div className="grid gap-2 lg:h-[500px]">
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
        </div>

        {/* TABLE */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="h-[500px] flex flex-col">
            {/* HEADER */}
            <table className="w-full border-collapse">
              <thead className="bg-blue-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left hidden md:table-cell px-4 py-3">
                    Category
                  </th>
                  <th className="text-left hidden lg:table-cell px-4 py-3">
                    Price
                  </th>
                  <th className="hidden md:table-cell px-4 py-3">Status</th>
                  <th className="text-center px-4 py-3">Actions</th>
                </tr>
              </thead>
            </table>

            {/* SCROLLABLE BODY */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full border-collapse">
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-4">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500 md:hidden">
                          {item.category} • ₱ {item.price.toLocaleString()}
                        </div>
                      </td>

                      <td className="hidden md:table-cell px-4 py-4">
                        {item.category}
                      </td>

                      <td className="hidden lg:table-cell px-4 py-4 font-semibold">
                        ₱ {item.price.toLocaleString()}
                      </td>

                      <td className="hidden md:table-cell px-4 py-4">
                        <div className="flex justify-center gap-2">
                          <Chip
                            text={item.status}
                            className={
                              item.status === "Active"
                                ? "bg-success text-white"
                                : "bg-gray-300 text-gray-800"
                            }
                            onClick={() => toggleStatus(item)}
                          />

                          <Button
                            onClick={() => toggleStatus(item)}
                            leftIcon={
                              item.status === "Active" ? <Eye /> : <EyeOff />
                            }
                            size="sm"
                            backgroundColor="bg-transparent"
                            textColor="text-gray-600"
                            className="hidden md:flex"
                          />
                        </div>
                      </td>

                      <td className="p-2">
                        <div className="flex justify-center gap-1">
                          <Button
                            onClick={() => {
                              setEditingItem(item);
                              setIsModalOpen(true);
                            }}
                            leftIcon={<Edit />}
                            backgroundColor="bg-primary/20"
                            textColor="text-primary"
                            size="sm"
                          />

                          <Button
                            onClick={() =>
                              window.open(item.affiliateLink, "_blank")
                            }
                            leftIcon={<Redirect />}
                            backgroundColor="bg-primary/20"
                            textColor="text-primary"
                            size="sm"
                          />

                          <Button
                            onClick={() => openDeletePopup(item.id)}
                            leftIcon={<Delete />}
                            backgroundColor="bg-destructive/20"
                            textColor="text-destructive"
                            size="sm"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}

                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10">
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

      {/* MODAL */}
      <AddEditAffiliate
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        initialData={editingItem}
        onSubmit={async (formData) => {
          if (editingItem) {
            await supabase
              .from("affiliate")
              .update({
                title: formData.title,
                description: formData.description,
                category: formData.category,
                price: formData.price,
                img_url: formData.imageUrl,
                affiliate_link: formData.affiliateLink,
              })
              .eq("id", editingItem.id);

            toast.success("Item updated!");
          } else {
            await handleAddItem(formData);
          }

          setIsModalOpen(false);
          setEditingItem(null);
          fetchItems();
        }}
      />

      {/* DELETE */}
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