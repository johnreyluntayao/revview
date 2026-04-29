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
  userName?.trim().charAt(0).toUpperCase() || '';

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

export default function RecentTestsInfinite({ initialTests }: RecentTestsInfiniteProps) {
  const [tests, setTests] = useState<RecentTest[]>(initialTests);
  const [offset, setOffset] = useState(10);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialTests.length === 10);

  const supabase = createClient();

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

    const userIds = [...new Set(recentResultsRaw.map((r: any) => r.user_id))];

    const { data: usersData } = await supabase
      .from("users")
      .select("id, name")
      .in("id", userIds);

    const userMap = new Map(usersData?.map((u: any) => [u.id, u.name]) || []);

    const newTests: RecentTest[] = recentResultsRaw.map((r: any) => {
      const categoryName = r.categories?.name || (r.category_id ? "Unknown Category" : "All Categories");
      return {
        id: r.id,
        userName: userMap.get(r.user_id) || "Unknown User",
        category: categoryName,
        percentage: r.percentage || 0,
        totalQuestions: r.total_questions || 0,
        timestamp: formatTimestamp(r.date_taken),
      };
    });

    setTests((prev) => [...prev, ...newTests]);
    setOffset((prev) => prev + limit);
    setHasMore(newTests.length === limit);
    setLoading(false);
  }, [offset, loading, hasMore, supabase]);

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  return (
    <div className="space-y-1 md:space-y-2 lg:space-y-3 max-h-[75vh] overflow-y-auto">
      {tests.map((test) => (
        <div
          key={test.id}
          className="group relative bg-linear-to-br from-primary/5 to-secondary/5 border border-border rounded-xl p-4 md:p-5 lg:p-6 hover:shadow-md hover:border-primary/30 transition duration-300"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 space-y-2 md:space-y-3 lg:space-y-4">
              <div className="flex gap-2 md:gap-3 lg:gap-4 items-center">
                <div className="w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-linear-to-br from-primary/90 to-secondary/90 flex items-center justify-center text-white font-bold text-xs md:text-sm lg:text-base shrink-0">
                  {getFirstLetter(test.userName)}
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base lg:text-lg font-semibold text-foreground">
                    {test.userName}
                  </p>
                  <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground mt-0 md:mt-0.5 lg:mt-1">
                    {test.category}
                  </p>
                </div>
              </div>

              <p className="flex items-center gap-1 text-muted-foreground text-[10px] md:text-xs lg:text-sm">
                <Calendar className="w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3" />
                {test.timestamp}
              </p>
            </div>

            <div className="flex flex-col space-y-1.5 items-end">
              <div className="text-right">
                <p
                  className={`text-base md:text-lg lg:text-2xl font-bold ${getScoreTextColor(
                    test.percentage
                  )} ${getScoreBgColor(test.percentage)} rounded-xl w-16 h-10 md:w-20 md:h-12 lg:w-24 lg:h-14 flex items-center justify-center text-center shrink-0 transition-all group-hover:scale-105`}
                >
                  {test.percentage}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs md:text-sm lg:text-base font-bold text-muted-foreground">
                  {test.totalQuestions} <span className="font-normal">Questions</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 md:mt-4 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                test.percentage >= 80
                  ? "bg-success"
                  : test.percentage >= 60
                  ? "bg-primary"
                  : test.percentage >= 40
                  ? "bg-warning"
                  : "bg-destructive"
              }`}
              style={{ width: `${test.percentage}%` }}
            />
          </div>
        </div>
      ))}

      <div ref={ref} className="py-4 md:py-5 lg:py-6 text-center">
        {loading && <p className="text-xs md:text-sm lg:text-base text-muted-foreground">Loading more tests...</p>}
        {!hasMore && tests.length > 0 && (
          <p className="text-xs md:text-sm lg:text-base text-muted-foreground">No more recent tests to load.</p>
        )}
      </div>
    </div>
  );
}