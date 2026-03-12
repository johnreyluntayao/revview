"use client";
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, ComboBox, ScoreRecord } from '@/lib/client-imports';

type Category = { id: string; name: string };


type QuizResult = {
  id: string;
  category_id: string | null;
  difficulty_id: string;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  percentage: number;
  date_taken: string;
  categories: { name: string }[] | null; 
  difficulty_levels: { label: string }[] | null; 
};

const PAGE_SIZE = 10;

const ResultsHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // null = All
  const [sortOption, setSortOption] = useState("Newest on top");

  const [currentPage, setCurrentPage] = useState(1);

  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const { data: cats, error: catErr } = await supabase
          .from("categories")
          .select("id, name")
          .order("name");

        if (catErr) throw catErr;
        setCategories(cats || []);

        const { data: results, error: resErr } = await supabase
          .from("quiz_results")
          .select(`
            id,
            category_id,
            difficulty_id,
            total_questions,
            correct_answers,
            time_taken_seconds,
            percentage,
            date_taken,
            categories!left (name),
            difficulty_levels!left (label)
          `)
          .order("date_taken", { ascending: false });

        if (resErr) throw resErr;

        setAllResults(results || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categoryOptions = useMemo(() => {
    const opts = categories.map(c => ({ value: c.id, label: c.name }));
    return [{ value: "all", label: "All Categories" }, ...opts];
  }, [categories]);

  const sortOptions = [
    "Newest on top",
    "Oldest on top",
    "Highest score first",
    "Lowest score first",
  ];

  const processedResults = useMemo(() => {
    let filtered = [...allResults];

    if (selectedCategoryId && selectedCategoryId !== "all") {
      filtered = filtered.filter(r => r.category_id === selectedCategoryId);
    }

    filtered.sort((a, b) => {
      if (sortOption === "Newest on top") {
        return new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime();
      }
      if (sortOption === "Oldest on top") {
        return new Date(a.date_taken).getTime() - new Date(b.date_taken).getTime();
      }
      if (sortOption === "Highest score first") {
        return b.percentage - a.percentage;
      }
      if (sortOption === "Lowest score first") {
        return a.percentage - b.percentage;
      }
      return 0;
    });

    return filtered;
  }, [allResults, selectedCategoryId, sortOption]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processedResults.slice(start, start + PAGE_SIZE);
  }, [processedResults, currentPage]);

  const totalPages = Math.ceil(processedResults.length / PAGE_SIZE);

  const stats = useMemo(() => {
    if (allResults.length === 0) return { avg: 0, count: 0, best: 0 };
    const percentages = allResults.map(r => r.percentage);
    const avg = percentages.reduce((sum, p) => sum + p, 0) / percentages.length;
    return {
      avg: Math.round(avg),
      count: allResults.length,
      best: Math.round(Math.max(...percentages)),
    };
  }, [allResults]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };


  if (loading) return <div className="p-8 text-center">Loading results...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error: {error}</div>;

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Results History</h1>
        <p className="text-muted-foreground text-sm">View your past attempts and track progress</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 md:p-6 border border-border rounded-xl">
        <ComboBox
          options={categoryOptions.map(o => o.label)}
          value={
            selectedCategoryId === null || selectedCategoryId === "all"
              ? "All Categories"
              : categories.find(c => c.id === selectedCategoryId)?.name ?? ""
          }
          onChange={(val: string) => {
            if (val === "All Categories") {
              setSelectedCategoryId(null);
            } else {
              const match = categoryOptions.find(o => o.label === val);
              setSelectedCategoryId(match?.value ?? null);
            }
            setCurrentPage(1);
          }}
          placeholder="Select category..."
          label="Category"
          isSearchable={true}
        />

        <ComboBox
          options={sortOptions}
          value={sortOption}
          onChange={(val: string) => {
            setSortOption(val);
            setCurrentPage(1);
          }}
          placeholder="Sort by..."
          label="Sort"
          isSearchable={false}
        />
      </div>

      {/* Records */}
      <div className="flex flex-col gap-3 md:gap-4 max-h-[60vh] overflow-auto">
        {paginatedResults.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No results match the current filters.
          </div>
        ) : (
          paginatedResults.map(record => {
            const catName =
              record.categories?.[0]?.name ??
              (record.category_id === null ? "All Categories" : "Unknown");

            const diffLabel = record.difficulty_levels?.[0]?.label ?? "—";

            return (
              <ScoreRecord
                key={record.id}
                title={catName}
                difficulty={diffLabel}
                items={record.total_questions}
                score={record.correct_answers}
                time={formatTime(record.time_taken_seconds)}
                date={formatDate(record.date_taken)}
                percentage={Math.round(record.percentage)}
              />
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {processedResults.length > 0 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <button
            className="px-4 py-2 border rounded disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} • {processedResults.length} results
          </span>

          <button
            className="px-4 py-2 border rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        <Card variant="highlight" title="Average Score" value={`${stats.avg}%`} textColor={getScoreTextColor(stats.avg)} />
        <Card variant="highlight" title="Quizzes Completed" value={stats.count.toString()} textColor="text-secondary" />
        <Card variant="highlight" title="Best Score" value={`${stats.best}%`} textColor={getScoreTextColor(stats.best)} />
      </div>
    </div>
  );
};

export default ResultsHistory;