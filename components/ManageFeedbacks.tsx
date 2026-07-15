"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button, Feedback as FeedbackComponent, Modal } from "@/lib/client-imports";
import {
  AverageScore,
  Feedback as FeedbackIcon,
  Resolve,
  Search,
  ShowFeedback,
  ToDelete,
} from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import type { Feedback } from "@/lib/types";

type FeedbackFilter = "all" | "resolved" | "pending";

interface FeedbackRow {
  id: string;
  user_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: string;
  resolved: boolean;
  resolved_by: string | null;
  resolved_at: string | null;
  updated_at: string;
  user_name: string | null;
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

export default function ManageFeedbacks() {
  const [supabase] = useState(() => createClient());
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filter, setFilter] = useState<FeedbackFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);
  const [deleting, setDeleting] = useState(false);

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

        const parsed = ((data ?? []) as FeedbackRow[]).map((item) => ({
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
      } catch (error: unknown) {
        console.error("Failed to fetch feedback:", error);
        toast.error("Failed to load feedback. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void fetchFeedbacks();
  }, [supabase]);

  const stats = useMemo(() => {
    const resolved = feedbacks.filter((item) => item.resolved).length;
    const pending = feedbacks.length - resolved;
    const averageRating = feedbacks.length
      ? feedbacks.reduce((total, item) => total + item.rating, 0) / feedbacks.length
      : 0;

    return {
      total: feedbacks.length,
      pending,
      resolved,
      averageRating: averageRating.toFixed(1),
    };
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return feedbacks.filter((feedback) => {
      const matchesStatus =
        filter === "all" ||
        (filter === "resolved" && feedback.resolved) ||
        (filter === "pending" && !feedback.resolved);
      const matchesSearch =
        !query ||
        feedback.user_name.toLowerCase().includes(query) ||
        feedback.comment?.toLowerCase().includes(query);

      return matchesStatus && Boolean(matchesSearch);
    });
  }, [feedbacks, filter, searchQuery]);

  const handleToggleResolve = async (id: string, currentResolved: boolean) => {
    if (updatingId) return;

    setUpdatingId(id);
    const newResolved = !currentResolved;

    try {
      const currentUserId = newResolved
        ? (await supabase.auth.getUser()).data.user?.id ?? null
        : null;
      const resolvedAt = newResolved ? new Date() : null;
      const { error } = await supabase
        .from("feedback")
        .update({
          resolved: newResolved,
          resolved_at: resolvedAt?.toISOString() ?? null,
          resolved_by: currentUserId,
        })
        .eq("id", id);

      if (error) throw error;

      setFeedbacks((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                resolved: newResolved,
                resolved_at: resolvedAt,
                resolved_by: currentUserId,
              }
            : item,
        ),
      );
      toast.success(newResolved ? "Feedback marked as resolved" : "Feedback reopened");
    } catch (error: unknown) {
      console.error("Failed to update feedback:", error);
      toast.error("Failed to update feedback status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!feedbackToDelete || deleting) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("feedback")
        .delete()
        .eq("id", feedbackToDelete.id);

      if (error) throw error;

      setFeedbacks((current) =>
        current.filter((item) => item.id !== feedbackToDelete.id),
      );
      setFeedbackToDelete(null);
      toast.success("Feedback deleted");
    } catch (error: unknown) {
      console.error("Failed to delete feedback:", error);
      toast.error("Failed to delete feedback");
    } finally {
      setDeleting(false);
    }
  };

  const filters: Array<{ value: FeedbackFilter; label: string; count: number }> = [
    { value: "all", label: "All", count: stats.total },
    { value: "pending", label: "Pending", count: stats.pending },
    { value: "resolved", label: "Resolved", count: stats.resolved },
  ];

  const summaryCards = [
    { label: "Total feedback", value: stats.total, icon: ShowFeedback, color: "text-primary", bg: "bg-primary/10" },
    { label: "Pending review", value: stats.pending, icon: FeedbackIcon, color: "text-warning", bg: "bg-warning/10" },
    { label: "Resolved", value: stats.resolved, icon: Resolve, color: "text-success", bg: "bg-success/10" },
    { label: "Average rating", value: `${stats.averageRating}/5`, icon: AverageScore, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 pb-10 pt-20 md:px-6 md:pb-12 md:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto max-w-screen-2xl space-y-5 md:space-y-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <ShowFeedback className="size-3.5" />
            Learner insights
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Manage feedback</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Review learner experiences, resolve concerns, and identify opportunities to improve RevView.
          </p>
        </header>

        <section aria-label="Feedback summary" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground md:text-sm">{card.label}</p>
                  <p className="mt-2 text-xl font-bold tracking-tight text-foreground md:text-2xl">{loading ? "—" : card.value}</p>
                </div>
                <div className={`hidden size-9 shrink-0 items-center justify-center rounded-xl sm:flex ${card.bg} ${card.color}`}>
                  <card.icon className="size-4.5" />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border/70 p-4 md:flex-row md:items-center md:justify-between md:p-5">
            <div className="flex w-full gap-1 overflow-x-auto rounded-xl bg-muted/70 p-1 md:w-auto">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  aria-pressed={filter === item.value}
                  className={`inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition md:flex-none md:text-sm ${
                    filter === item.value
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${filter === item.value ? "bg-primary/10 text-primary" : "bg-background/70"}`}>
                    {item.count}
                  </span>
                </button>
              ))}
            </div>

            <label className="relative block w-full md:max-w-sm">
              <span className="sr-only">Search feedback</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by learner or comment"
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              />
            </label>
          </div>

          <div className="p-3 md:p-5">
            {loading ? (
              <div className="space-y-3" aria-label="Loading feedback">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-40 animate-pulse rounded-xl border border-border bg-muted/40" />
                ))}
              </div>
            ) : filteredFeedbacks.length === 0 ? (
              <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 px-4 text-center">
                <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShowFeedback className="size-5" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">No feedback found</h2>
                <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted-foreground">
                  {searchQuery ? "Try a different search term or status filter." : "Feedback matching this status will appear here."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {filteredFeedbacks.map((feedback) => (
                  <FeedbackComponent
                    key={feedback.id}
                    name={feedback.user_name}
                    date={formatDate(feedback.created_at)}
                    rating={feedback.rating}
                    comment={feedback.comment ?? "No comment provided"}
                    status={feedback.resolved ? "resolved" : "pending"}
                    onResolveToggle={() => void handleToggleResolve(feedback.id, feedback.resolved)}
                    onDelete={() => setFeedbackToDelete(feedback)}
                    isUpdating={updatingId === feedback.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal
        isOpen={Boolean(feedbackToDelete)}
        onClose={() => !deleting && setFeedbackToDelete(null)}
        title="Delete feedback?"
        description="This action permanently removes the feedback record and cannot be undone."
        size="sm"
        closeOnBackdrop={!deleting}
        contentClassName="p-4 sm:p-6"
        footer={
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              text="Cancel"
              backgroundColor="bg-muted"
              textColor="text-foreground"
              onClick={() => setFeedbackToDelete(null)}
              isDisabled={deleting}
              className="w-full sm:w-auto"
            />
            <Button
              text={deleting ? "Deleting..." : "Delete feedback"}
              backgroundColor="bg-destructive"
              textColor="text-white"
              leftIcon={<ToDelete className="size-4" />}
              onClick={() => void handleDelete()}
              isDisabled={deleting}
              className="w-full sm:w-auto"
            />
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Feedback from <span className="font-semibold text-foreground">{feedbackToDelete?.user_name}</span> will be removed.
        </p>
      </Modal>
    </main>
  );
}
