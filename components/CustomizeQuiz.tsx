"use client";

import { SelectCategory, SelectDifficultyLevel, SelectNumQuestions, SummaryPanel } from "@/lib/client-imports";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DifficultyLevel, QuizCategory } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Sparkles } from "@/lib/icons";

type QuestionRecord = { id: string };

const CustomizeQuiz = () => {
  const [supabase] = useState(() => createClient());
  const router = useRouter();
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<DifficultyLevel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      const [categoryResult, difficultyResult] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("difficulty_levels").select("*"),
      ]);

      if (!active) return;
      if (categoryResult.error || difficultyResult.error) {
        toast.error("Some quiz options could not be loaded. Please refresh and try again.");
      }
      setCategories(categoryResult.data ?? []);
      setDifficultyLevels(difficultyResult.data ?? []);
      setIsLoading(false);
    };
    void fetchData();
    return () => { active = false; };
  }, [supabase]);

  const selectedDifficultyObj = useMemo(
    () => difficultyLevels.find((difficulty) => String(difficulty.id) === selectedDifficulty),
    [difficultyLevels, selectedDifficulty],
  );
  const totalTime = selectedDifficultyObj && selectedQuestions
    ? Number(selectedDifficultyObj.minutes_per_question) * selectedQuestions
    : 0;
  const canStart = Boolean(selectedDifficulty && selectedQuestions > 0 && !isLoading);

  const handleStartQuiz = async () => {
    if (!canStart) {
      toast.error("Choose a question count and difficulty first.");
      return;
    }

    try {
      setIsStarting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in again to start a quiz.");

      const { data, error: questionError } = await supabase.rpc("get_random_questions", {
        p_limit: selectedQuestions,
        p_category_id: selectedCategory,
      });
      if (questionError) throw questionError;

      const randomQuestions = (data ?? []) as QuestionRecord[];
      if (randomQuestions.length < selectedQuestions) {
        throw new Error(`Only ${randomQuestions.length} questions are available for this selection.`);
      }

      const { data: newSession, error: insertError } = await supabase
        .from("quiz_sessions")
        .insert({
          user_id: user.id,
          category_id: selectedCategory,
          difficulty_id: selectedDifficulty,
          total_questions: selectedQuestions,
          total_time_seconds: totalTime * 60,
          question_ids: randomQuestions.map((question) => question.id),
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      if (!newSession) throw new Error("The quiz session could not be created.");
      toast.success("Your quiz is ready. Good luck!");
      router.push(`/quiz/${newSession.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to start quiz.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-full bg-linear-to-b from-primary/5 via-background to-background px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-sm sm:mb-8">
          <div className="relative px-5 py-6 sm:px-7 sm:py-8">
            <div className="absolute -right-12 -top-16 size-44 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Sparkles className="size-4" /> Personalized practice</div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Build your next review quiz</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Create a focused practice session in three quick steps, then review your setup before you begin.</p>
              </div>
              <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:flex"><ClipboardCheck className="size-7" /></div>
            </div>
          </div>
        </header>

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_21rem] xl:gap-6">
          <div className="space-y-4 sm:space-y-5">
            <SelectCategory categories={categories} selected={selectedCategory} setSelected={setSelectedCategory} isLoading={isLoading} />
            <SelectNumQuestions selected={selectedQuestions} setSelected={setSelectedQuestions} />
            <SelectDifficultyLevel difficultyLevels={difficultyLevels} selected={selectedDifficulty} setSelected={setSelectedDifficulty} isLoading={isLoading} />
          </div>
          <SummaryPanel
            categories={categories}
            selectedCategory={selectedCategory}
            selectedQuestions={selectedQuestions}
            selectedDifficulty={selectedDifficultyObj?.label || ""}
            totalTime={totalTime}
            isStarting={isStarting}
            canStart={canStart}
            handleStartQuiz={handleStartQuiz}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizeQuiz;
