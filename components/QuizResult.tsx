"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScoreCard, QuizAccordion } from "@/lib/client-imports";
import { AllCategories, Gauge } from "@/lib/icons";
import { toast } from "sonner";

type Question = {
  id: string;
  text: string;
  options: (string | null | undefined)[];
  option_images?: string[] | null;  
  correctAnswer: string;
  explanation: string;
  img_url?: string | null;    
  explanation_img_url?: string | null;
};

type Answer = {
  questionId: string;
  selectedOption: string | null;
  isCorrect: boolean;
};

interface QuizResultProps {
  sessionId: string;
}

const QuizResult = ({ sessionId }: QuizResultProps) => {
  const [supabase] = useState(() => createClient());

  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [minutesUsed, setMinutesUsed] = useState(0);
  const [secondsUsed, setSecondsUsed] = useState(0);

  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResultData() {
      try {
        setLoading(true);

        const { data: resultData, error: resultError } = await supabase
          .from("quiz_results")
          .select("percentage, correct_answers, total_questions, time_taken_seconds")
          .eq("quiz_session_id", sessionId)
          .single();

        if (resultError) throw resultError;

        setScore(Math.round(resultData.percentage));
        setCorrectCount(resultData.correct_answers);
        setTotalQuestions(resultData.total_questions);

        const totalSec = resultData.time_taken_seconds || 0;
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        setMinutesUsed(mins);
        setSecondsUsed(secs);

        const { data: sessionData, error: sessionError } = await supabase
          .from("quiz_sessions")
          .select("difficulty_id, category_id")
          .eq("id", sessionId)
          .single();

        if (sessionError) throw sessionError;

        if (sessionData.difficulty_id) {
          const { data: diffData } = await supabase
            .from("difficulty_levels")
            .select("label")
            .eq("id", sessionData.difficulty_id)
            .single();

          if (diffData) setDifficulty(diffData.label);
        }

        if (sessionData.category_id) {
          const { data: catData } = await supabase
            .from("categories")
            .select("name")
            .eq("id", sessionData.category_id)
            .single();

          if (catData) setCategory(catData.name);
        } else {
          setCategory("All Categories");
        }

        const { data: sessionFull, error: sessFullErr } = await supabase
          .from("quiz_sessions")
          .select("question_ids")
          .eq("id", sessionId)
          .single();

        if (sessFullErr || !sessionFull?.question_ids?.length) {
          throw new Error("No questions found");
        }

        const { data: qData, error: qError } = await supabase
          .from("questions")
          .select(`
            id, 
            text, 
            options, 
            option_images, 
            correct_answer, 
            explanation, 
            img_url, 
            explanation_img_url
          `)
          .in("id", sessionFull.question_ids);

        if (qError) throw qError;

        const formattedQuestions: Question[] = qData.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options || [],
          option_images: q.option_images,        
          correctAnswer: q.correct_answer,
          explanation: q.explanation || "",
          img_url: q.img_url,               
          explanation_img_url: q.explanation_img_url,
        }));

        setQuestions(formattedQuestions);

        const { data: answerData, error: aError } = await supabase
          .from("quiz_answers")
          .select("question_id, selected_option, is_correct")
          .eq("quiz_session_id", sessionId);

        if (aError) throw aError;

        const formattedAnswers: Answer[] = answerData.map((a) => ({
          questionId: a.question_id,
          selectedOption: a.selected_option,
          isCorrect: a.is_correct,
        }));

        setAnswers(formattedAnswers);
      } catch (err: unknown) {
        console.error("Error loading quiz result:", err);
        toast.error("Failed to load quiz results. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (sessionId) fetchResultData();
  }, [sessionId, supabase]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-lg text-muted-foreground">Loading your results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-secondary/5 px-4 pb-10 pt-28 sm:px-6 md:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
      <div>
        <ScoreCard
          score={score}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          minutesUsed={minutesUsed}
          secondsUsed={secondsUsed}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <section className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-card p-4 shadow-sm sm:p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><AllCategories className="size-5" /></span>
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Quiz scope</p><p className="mt-1 truncate text-base font-bold text-foreground sm:text-lg">{category || "N/A"}</p></div>
        </section>
        <section className="flex items-center gap-3 rounded-2xl border border-secondary/20 bg-card p-4 shadow-sm sm:p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Gauge className="size-5" /></span>
          <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Difficulty</p><p className="mt-1 truncate text-base font-bold text-foreground sm:text-lg">{difficulty || "N/A"}</p></div>
        </section>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 md:p-6 lg:p-8">
        
        <h2 className="text-base md:text-lg lg:text-xl font-bold mb-4 md:mb-5 lg:mb-6 text-foreground">
          Answer Review
        </h2>
        <QuizAccordion questions={questions} answers={answers} />
      </div>
      </div>
    </div>
  );
};

export default QuizResult;
