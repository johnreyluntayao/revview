"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { createClient } from "@/lib/supabase/client";
import { Calendar } from "@/lib/icons";

interface RecentTest {
  id: string;
  userName: string;
  category: string;
  percentage: number;
  totalQuestions: number;
  timestamp: string;
}

interface RecentTestsInfiniteProps {
  initialTests: RecentTest[];
}

interface QuizResultRow {
  id: string;
  user_id: string;
  category_id: string | null;
  total_questions: number | null;
  date_taken: string;
  percentage: number | null;
  categories: { name: string } | { name: string }[] | null;
}

const getScoreTextColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-primary";
  if (score >= 40) return "text-warning";
  return "text-destructive";
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return "bg-success/15";
  if (score >= 60) return "bg-primary/15";
  if (score >= 40) return "bg-warning/15";
  return "bg-destructive/15";
};

const getFirstLetter = (userName: string | null | undefined): string =>
  userName?.trim().charAt(0).toUpperCase() || "?";

function formatTimestamp(date: string | Date): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .replace(", ", ", ");
}

function getCategoryName(result: QuizResultRow): string {
  const category = Array.isArray(result.categories)
    ? result.categories[0]
    : result.categories;

  return category?.name || (result.category_id ? "Unknown Category" : "All Categories");
}

export default function RecentTestsInfinite({ initialTests }: RecentTestsInfiniteProps) {
  const [tests, setTests] = useState<RecentTest[]>(initialTests);
  const [offset, setOffset] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTests.length === 10);

  const [supabase] = useState(() => createClient());

  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "200px",
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const limit = 10;
    const from = offset;
    const to = offset + limit - 1;

    const { data: recentResultsRaw, error } = await supabase
      .from("quiz_results")
      .select(`
        id,
        user_id,
        category_id,
        score,
        total_questions,
        date_taken,
        percentage,
        categories!left (name)
      `)
      .order("date_taken", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error loading more tests:", error);
      setLoading(false);
      return;
    }

    if (!recentResultsRaw || recentResultsRaw.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const recentResults = recentResultsRaw as unknown as QuizResultRow[];
    const userIds = [...new Set(recentResults.map((result) => result.user_id))];

    const { data: usersData } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    const userMap = new Map(
      (usersData ?? []).map((profile) => [profile.id, profile.name] as const),
    );

    const newTests: RecentTest[] = recentResults.map((result) => {
      return {
        id: result.id,
        userName: userMap.get(result.user_id) || "Unknown User",
        category: getCategoryName(result),
        percentage: result.percentage || 0,
        totalQuestions: result.total_questions || 0,
        timestamp: formatTimestamp(result.date_taken),
      };
    });

    setTests((prev) => [...prev, ...newTests]);
    setOffset((prev) => prev + limit);
    setHasMore(newTests.length === limit);
    setLoading(false);
  }, [offset, loading, hasMore, supabase]);

  useEffect(() => {
    if (!inView || !hasMore || loading) return;

    const loadTimer = window.setTimeout(() => {
      void loadMore();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [inView, hasMore, loading, loadMore]);

  return (
    <div className="max-h-[38rem] overflow-y-auto overscroll-contain pr-0.5">
      <div className="sticky top-0 z-10 mb-1 hidden grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(10rem,0.85fr)_5rem] gap-4 rounded-lg bg-muted/90 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur md:grid">
        <span>Learner</span>
        <span>Quiz</span>
        <span>Completed</span>
        <span className="text-center">Score</span>
      </div>

      {tests.map((test) => (
        <div
          key={test.id}
          className="group mb-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/80 bg-background p-3 transition hover:border-primary/20 hover:bg-primary/[0.025] md:mb-0 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(10rem,0.85fr)_5rem] md:gap-4 md:rounded-none md:border-x-0 md:border-b md:border-t-0 md:px-4 md:py-3.5 md:last:border-b-0"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-xs font-bold text-white shadow-sm">
              {getFirstLetter(test.userName)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{test.userName}</p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground md:hidden">{test.category}</p>
            </div>
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="truncate text-sm font-medium text-foreground">{test.category}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{test.totalQuestions} questions</p>
          </div>

          <p className="hidden items-center gap-1.5 text-xs leading-relaxed text-muted-foreground md:flex">
            <Calendar className="size-3.5 shrink-0" />
            {test.timestamp}
          </p>

          <div className="flex flex-col items-end gap-1 md:items-center">
            <span className={`inline-flex min-w-14 items-center justify-center rounded-lg px-2 py-1.5 text-sm font-bold ${getScoreTextColor(test.percentage)} ${getScoreBgColor(test.percentage)}`}>
              {test.percentage}%
            </span>
            <span className="text-[10px] text-muted-foreground md:hidden">{test.totalQuestions} questions</span>
          </div>
        </div>
      ))}

      <div ref={ref} className="py-4 text-center">
        {loading && <p className="text-xs text-muted-foreground">Loading more activity...</p>}
        {!hasMore && tests.length > 0 && (
          <p className="text-xs text-muted-foreground">You&apos;ve reached the end of the activity list.</p>
        )}
      </div>
    </div>
  );
}
