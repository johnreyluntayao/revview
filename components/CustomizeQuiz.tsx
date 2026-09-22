"use client";

import { Button, SelectCategory, SelectDifficultyLevel, SelectNumQuestions, SummaryPanel } from "@/lib/client-imports";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DifficultyLevel, QuizCategory } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Clock3, Play, Sparkles } from "@/lib/icons";

type QuestionRecord = { id: string };

const fullExamPlan = [
  { name: "Verbal Ability", count: 50 },
  { name: "Analytical Ability", count: 40 },
  { name: "Numerical Ability", count: 40 },
  { name: "General Information", count: 20 },
] as const;

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
          session_mode: "practice",
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

  const handleStartFullExam = async () => {
    try {
      setIsStarting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in again to start the full exam.");

      const categoryRequests = fullExamPlan.map(async ({ name, count }) => {
        const category = categories.find((item) => item.name === name);
        if (!category) throw new Error(`${name} is not available.`);

        const { data, error } = await supabase.rpc("get_random_questions", {
          p_limit: count,
          p_category_id: category.id,
        });
        if (error) throw error;
        if ((data ?? []).length < count) throw new Error(`Not enough ${name} questions are available.`);
        return data as QuestionRecord[];
      });

      const groups = await Promise.all(categoryRequests);
      const questionIds = groups.flatMap((group) => group.map((question) => question.id));
      const mediumDifficulty = difficultyLevels.find((item) => item.label.toLowerCase() === "medium");
      if (!mediumDifficulty) throw new Error("The standard difficulty level could not be found.");

      const { data: newSession, error } = await supabase
        .from("quiz_sessions")
        .insert({
          user_id: user.id,
          category_id: null,
          difficulty_id: mediumDifficulty.id,
          total_questions: 150,
          total_time_seconds: 190 * 60,
          question_ids: questionIds,
          session_mode: "full_exam",
        })
        .select("id")
        .single();
      if (error) throw error;
      if (!newSession) throw new Error("The full exam session could not be created.");
      toast.success("Your full exam is ready. You have 3 hours and 10 minutes.");
      router.push(`/quiz/${newSession.id}`);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to start the full exam.");
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

        <section className="mb-5 overflow-hidden rounded-2xl border border-secondary/25 bg-card shadow-md shadow-secondary/5 sm:mb-6">
          <div className="bg-linear-to-br from-secondary/15 via-primary/8 to-transparent p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">Exam simulation</p>
                <h2 className="mt-1 text-lg font-bold text-foreground sm:text-xl">Take the full Civil Service Exam</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">A fixed 150-item exam with four sections and a 3 hour, 10 minute time limit.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl border border-secondary/20 bg-card/80 px-3 py-2 text-sm font-semibold text-secondary"><Clock3 className="size-4" /> 3h 10m</div>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {fullExamPlan.map((section, index) => (
                <div key={section.name} className="rounded-xl border border-border/70 bg-card/80 p-3">
                  <p className="text-xs font-semibold text-muted-foreground">{section.name}</p>
                  <p className="mt-1 text-sm font-bold text-foreground">{index === 0 ? "1–50" : index === 1 ? "51–90" : index === 2 ? "91–130" : "131–150"}</p>
                  <p className="text-xs text-muted-foreground">{section.count} questions</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-secondary/20 bg-card/90 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">Ready for the complete exam experience?</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Your timer starts immediately and each section stays in its planned order.</p>
              </div>
              <Button onClick={handleStartFullExam} isDisabled={isLoading || isStarting} backgroundColor="bg-linear-to-r from-secondary to-primary" textColor="text-primary-foreground" className="min-h-12 w-full shrink-0 justify-center shadow-lg shadow-secondary/20 sm:min-w-52 sm:w-auto" rightIcon={<Play className="size-4 fill-current" />}>
                {isStarting ? "Preparing exam…" : "Start full exam"}
              </Button>
            </div>
          </div>
        </section>

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
