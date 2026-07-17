"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ComboBox, ScoreRecord } from "@/lib/client-imports";
import { AverageScore, BestCategory, NoResultsYet, Sparkles, TotalTests } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";

type Category = { id: string; name: string };

type QuizResult = {
  id: string;
  category_id: string | null;
  difficulty_id: string;
  quiz_session_id: string;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  percentage: number;
  date_taken: string;
  categories: { name: string } | null;
  difficulty_levels: { label: string } | null;
};

type QuizResultRow = Omit<QuizResult, "categories" | "difficulty_levels"> & {
  categories: { name: string } | { name: string }[] | null;
  difficulty_levels: { label: string } | { label: string }[] | null;
};

const PAGE_SIZE = 5;

const firstRelation = <T,>(relation: T | T[] | null): T | null =>
  Array.isArray(relation) ? relation[0] ?? null : relation;

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export default function ResultsHistory() {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("Newest on top");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Your session has expired. Please sign in again.");

        const [categoryResponse, resultsResponse] = await Promise.all([
          supabase.from("categories").select("id, name").order("name"),
          supabase
            .from("quiz_results")
            .select(`
              id,
              category_id,
              difficulty_id,
              quiz_session_id,
              total_questions,
              correct_answers,
              time_taken_seconds,
              percentage,
              date_taken,
              categories!left (name),
              difficulty_levels!left (label)
            `)
            .eq("user_id", user.id)
            .order("date_taken", { ascending: false }),
        ]);

        if (categoryResponse.error) throw categoryResponse.error;
        if (resultsResponse.error) throw resultsResponse.error;

        setCategories(categoryResponse.data ?? []);
        setAllResults(
          ((resultsResponse.data ?? []) as unknown as QuizResultRow[]).map((result) => ({
            ...result,
            percentage: Number(result.percentage) || 0,
            categories: firstRelation(result.categories),
            difficulty_levels: firstRelation(result.difficulty_levels),
          })),
        );
      } catch (loadError: unknown) {
        console.error("Failed to load result history:", loadError);
        setError(loadError instanceof Error ? loadError.message : "Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    void loadData();
  }, [supabase]);

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "All categories" },
      ...categories.map((category) => ({ value: category.id, label: category.name })),
    ],
    [categories],
  );

  const sortOptions = [
    "Newest on top",
    "Oldest on top",
    "Highest score first",
    "Lowest score first",
  ];

  const processedResults = useMemo(() => {
    const filtered =
      selectedCategoryId && selectedCategoryId !== "all"
        ? allResults.filter((result) => result.category_id === selectedCategoryId)
        : [...allResults];

    return filtered.sort((a, b) => {
      if (sortOption === "Oldest on top") {
        return new Date(a.date_taken).getTime() - new Date(b.date_taken).getTime();
      }
      if (sortOption === "Highest score first") return b.percentage - a.percentage;
      if (sortOption === "Lowest score first") return a.percentage - b.percentage;
      return new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime();
    });
  }, [allResults, selectedCategoryId, sortOption]);

  const totalPages = Math.max(1, Math.ceil(processedResults.length / PAGE_SIZE));
  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processedResults.slice(start, start + PAGE_SIZE);
  }, [currentPage, processedResults]);

  const stats = useMemo(() => {
    if (!allResults.length) return { average: 0, count: 0, best: 0 };
    const scores = allResults.map((result) => result.percentage);
    return {
      average: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      count: scores.length,
      best: Math.round(Math.max(...scores)),
    };
  }, [allResults]);

  const summaryCards = [
    { label: "Average score", value: `${stats.average}%`, icon: AverageScore, style: "bg-primary/10 text-primary" },
    { label: "Quizzes completed", value: stats.count, icon: TotalTests, style: "bg-secondary/10 text-secondary" },
    { label: "Best score", value: `${stats.best}%`, icon: BestCategory, style: "bg-success/10 text-success" },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-primary/[0.025] p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-4" aria-label="Loading results history">
          <div className="h-28 animate-pulse rounded-2xl bg-muted/60" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-muted/60" />)}
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-muted/60" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-5 md:gap-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Progress archive
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Results history</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Review past attempts, compare scores, and revisit detailed quiz results.
          </p>
        </header>

        {error ? (
          <div role="alert" className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-destructive">
            {error}
          </div>
        ) : (
          <>
            <section aria-label="Results summary" className="grid gap-3 sm:grid-cols-3">
              {summaryCards.map((card) => (
                <article key={card.label} className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground md:text-sm">{card.label}</p>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{card.value}</p>
                    </div>
                    <div className={`flex size-10 items-center justify-center rounded-xl ${card.style}`}><card.icon className="size-5" /></div>
                  </div>
                </article>
              ))}
            </section>

            <section className="grid gap-4 rounded-2xl border border-border/80 bg-card p-4 shadow-sm sm:grid-cols-2 md:p-5">
              <ComboBox
                options={categoryOptions.map((option) => option.label)}
                value={
                  selectedCategoryId
                    ? categoryOptions.find((option) => option.value === selectedCategoryId)?.label ?? "All categories"
                    : "All categories"
                }
                onChange={(value: string) => {
                  setSelectedCategoryId(categoryOptions.find((option) => option.label === value)?.value ?? null);
                  setCurrentPage(1);
                }}
                placeholder="Select category"
                label="Category"
                isSearchable
              />
              <ComboBox
                options={sortOptions}
                value={sortOption}
                onChange={(value: string) => {
                  setSortOption(value);
                  setCurrentPage(1);
                }}
                placeholder="Sort results"
                label="Sort by"
                isSearchable={false}
              />
            </section>

            <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-4 md:px-6 md:py-5">
                <div>
                  <h2 className="text-base font-semibold text-foreground md:text-lg">Quiz attempts</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">{processedResults.length} matching results</p>
                </div>
                <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Page {currentPage} of {totalPages}</span>
              </div>

              <div className="space-y-3 p-3 md:p-5">
                {!paginatedResults.length ? (
                  <div className="flex min-h-64 flex-col items-center justify-center text-center">
                    <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><NoResultsYet className="size-5" /></div>
                    <p className="text-sm font-semibold text-foreground">No matching results</p>
                    <p className="mt-1 text-xs text-muted-foreground">Try selecting another category.</p>
                  </div>
                ) : (
                  paginatedResults.map((record) => (
                    <ScoreRecord
                      key={record.id}
                      title={record.category_id === null ? "All Categories" : record.categories?.name ?? "Unknown Category"}
                      difficulty={record.difficulty_levels?.label ?? "Unknown Difficulty"}
                      items={record.total_questions}
                      score={record.correct_answers}
                      time={formatTime(record.time_taken_seconds)}
                      date={formatDate(record.date_taken)}
                      percentage={Math.round(record.percentage)}
                      onViewDetail={() => record.quiz_session_id && router.push(`/quiz-result/${record.quiz_session_id}`)}
                    />
                  ))
                )}
              </div>

              {processedResults.length > 0 && (
                <footer className="flex flex-col gap-3 border-t border-border/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
                  <p className="text-center text-xs text-muted-foreground sm:text-left">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, processedResults.length)} of {processedResults.length}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      className="min-h-10 rounded-xl border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-primary/20 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      className="min-h-10 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </footer>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
