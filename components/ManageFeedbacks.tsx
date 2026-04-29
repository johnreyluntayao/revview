"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Feedback as FeedbackComponent, Button } from "@/lib/client-imports";
import { createClient } from "@/lib/supabase/client";

import type { Feedback } from "@/lib/types";

const ManageFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<"all" | "resolved" | "pending">("all");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

useEffect(() => {
  const fetchFeedbacks = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("feedback")
        .select(`
          id,
          user_id,
          rating,
          comment,
          created_at,
          resolved,
          resolved_by,
          resolved_at,
          updated_at,
          user_name
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const parsed = (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        rating: item.rating,
        comment: item.comment,
        user_name: item.user_name || "Anonymous",
        created_at: new Date(item.created_at),
        resolved: item.resolved,
        resolved_by: item.resolved_by,
        resolved_at: item.resolved_at ? new Date(item.resolved_at) : null,
        updated_at: new Date(item.updated_at),
      }));

      setFeedbacks(parsed);
    } catch (err: any) {
      console.error("Fetch failed:", err);
      toast.error(
        `Failed to load feedbacks: ${err.message || "Unknown error"} ` +
        `(code: ${err.code || "—"})`
      );
    } finally {
      setLoading(false);
    }
  };

  fetchFeedbacks();
}, []);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (filter === "all") return true;
    if (filter === "resolved") return fb.resolved === true;
    if (filter === "pending") return fb.resolved === false;
    return true;
  });

  const handleToggleResolve = async (id: string, currentResolved: boolean) => {
    const newResolved = !currentResolved;

    const { error } = await supabase
      .from("feedback")
      .update({
        resolved: newResolved,
        resolved_at: newResolved ? new Date().toISOString() : null,
        resolved_by: newResolved ? (await supabase.auth.getUser()).data.user?.id : null,
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      console.error(error);
      return;
    }

    toast.success(newResolved ? "Feedback marked as resolved" : "Feedback unmarked (unresolved)");

    setFeedbacks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, resolved: newResolved } : item
      )
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    const { error } = await supabase.from("feedback").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete feedback");
      console.error(error);
      return;
    }

    toast.success("Feedback deleted");
    setFeedbacks((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (loading) {
    return <div className="p-8 text-center">Loading feedbacks...</div>;
  }

  return (
    <main className="px-4 md:px-6 lg:px-8 py-20 md:py-24 lg:py-28 bg-primary/3 min-h-screen">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Manage Feedbacks</h1>
      <p className="text-xs md:text-sm font-medium lg:text-base text-muted-foreground mt-1">
        Overview of user feedbacks
      </p>

      <div className="flex flex-wrap border border-border bg-white p-4 md:p-5 lg:p-6 rounded-xl gap-2 md:gap-3 mt-6 md:mt-8">
        <Button
          text="All"
          textColor={filter === "all" ? "text-white" : "text-foreground"}
          backgroundColor={filter === "all" ? "bg-primary" : "bg-muted-foreground/30"}
          onClick={() => setFilter("all")}
        />
        <Button
          text="Resolved"
          textColor={filter === "resolved" ? "text-white" : "text-foreground"}
          backgroundColor={filter === "resolved" ? "bg-primary" : "bg-muted-foreground/30"}
          onClick={() => setFilter("resolved")}
        />
        <Button
          text="Pending"
          textColor={filter === "pending" ? "text-white" : "text-foreground"}
          backgroundColor={filter === "pending" ? "bg-primary" : "bg-muted-foreground/30"}
          onClick={() => setFilter("pending")}
        />
      </div>

      {filteredFeedbacks.length === 0 ? (
        <div className="mt-10 text-center text-muted-foreground">
          No feedbacks found in this filter.
        </div>
      ) : (
        <div className="mt-6 md:mt-8 grid grid-cols-1 gap-4 md:gap-6">
          {filteredFeedbacks.map((feedback) => (
            <FeedbackComponent
              key={feedback.id}
              name={feedback.user_name}
              date={formatDate(feedback.created_at)}
              rating={feedback.rating}
              comment={feedback.comment ?? "No comment provided"}
              status={feedback.resolved ? "resolved" : "pending"}
              onResolveToggle={() => handleToggleResolve(feedback.id, feedback.resolved)}
              onDelete={() => handleDelete(feedback.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default ManageFeedbacks;