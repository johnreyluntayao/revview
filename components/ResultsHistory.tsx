"use client";
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, ComboBox, ScoreRecord, Button } from '@/lib/client-imports';

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

const PAGE_SIZE = 5;

const ResultsHistory = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allResults, setAllResults] = useState<QuizResult[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState("Newest on top");
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();
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
            quiz_session_id,
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
        setAllResults(
          (results || []).map((r: any) => ({
            ...r,
            categories: Array.isArray(r.categories)
              ? r.categories[0] ?? null
              : r.categories,
            difficulty_levels: Array.isArray(r.difficulty_levels)
              ? r.difficulty_levels[0] ?? null
              : r.difficulty_levels,
          }))
        );
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


  if (loading) return <div className="p-8 text-center">Loading results...</div>;
  if (error) return <div className="p-8 text-center text-destructive">Error: {error}</div>;

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 flex flex-col gap-4 md:gap-6 lg:gap-8 ">
      {/* Header */}
      <div className="flex flex-col gap-1 md:gap-1.5 lg:gap-2">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Results History</h1>
        <p className="text-muted-foreground text-xs md:text-sm lg:text-base">View your past attempts and track progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 w-full">
        <Card variant="highlight" title="Average Score" value={`${stats.avg}%`} bg='bg-linear-to-br from-primary/70 to-secondary/70' textColor="text-white" subColor='text-white'/>
        <Card variant="highlight" title="Quizzes Completed" value={stats.count.toString()} bg='bg-linear-to-br from-primary/70 to-secondary/70' textColor="text-white" subColor='text-white'/>
        <Card variant="highlight" title="Best Score" value={`${stats.best}%`}  bg='bg-linear-to-br from-primary/70 to-secondary/70'textColor="text-white" subColor='text-white'/>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-5 lg:gap-6 p-4 md:p-5 lg:p-6 border border-border rounded-xl bg-white">
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
      <div className="flex flex-col gap-2 md:gap-3 lg:gap-4 overflow-auto">
        {paginatedResults.length === 0 ? (
          <div className="text-center flex items-center justify-center text-xs md:text-sm lg:text-base h-[50vh] text-muted-foreground">
            No results match the current filters.
          </div>
        ) : (
          paginatedResults.map(record => {
            const catName =
              record.category_id === null
                ? "All Categories"
                : record.categories?.name ?? "Unknown Category";

            const diffLabel =
              record.difficulty_levels?.label ?? "Unknown Difficulty";

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
                quizSessionId={record.quiz_session_id}
                onViewDetail={() => {
                  if (record.quiz_session_id) {
                    router.push(`/quiz-result/${record.quiz_session_id}`);
                  }
                }}
              />
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {processedResults.length > 0 && (
        <div className="flex items-center justify-between px-1 md:-x-1.5 lg:px-2">
          <Button
            text="Prev"
            textColor='text-white'
            backgroundColor='bg-primary'
            isDisabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          />

          <span className="text-xs md:text-sm lg:text-base text-muted-foreground">
            Page {currentPage} of {totalPages} • {processedResults.length} results
          </span>

          <Button
            text='Next'
            textColor='text-white'
            backgroundColor='bg-primary'
            isDisabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
          />
        </div>
      )}

    </div>
  );
};

export default ResultsHistory;