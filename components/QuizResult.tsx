"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ScoreCard, Card, QuizAccordion } from "@/lib/client-imports";
import { toast } from "sonner";

type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
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
  const supabase = createClient();

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
          .select("id, text, options, correct_answer, explanation")
          .in("id", sessionFull.question_ids);

        if (qError) throw qError;

        const formattedQuestions: Question[] = qData.map((q: any) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correct_answer,
          explanation: q.explanation,
        }));

        setQuestions(formattedQuestions);

        const { data: answerData, error: aError } = await supabase
          .from("quiz_answers")
          .select("question_id, selected_option, is_correct")
          .eq("quiz_session_id", sessionId);

        if (aError) throw aError;

        const formattedAnswers: Answer[] = answerData.map((a: any) => ({
          questionId: a.question_id,
          selectedOption: a.selected_option,
          isCorrect: a.is_correct,
        }));

        setAnswers(formattedAnswers);
      } catch (err: any) {
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
    <div className="px-4 md:px-6 lg:px-8 py-20 lg:py-24 space-y-4 md:space-y-6 lg:space-y-8 bg-linear-to-br from-primary/5 to-secondary/5">
      <div>
        <ScoreCard
          score={score}
          correctCount={correctCount}
          totalQuestions={totalQuestions}
          minutesUsed={minutesUsed}
          secondsUsed={secondsUsed}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
        <Card variant="overview" title="Category" value={category || "N/A"} />
        <Card variant="overview" title="Difficulty" value={difficulty || "N/A"} />
      </div>

      <div className="rounded-xl border border-border p-4 md:p-6 lg:p-8 bg-white">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-4 md:mb-5 lg:mb-6 text-foreground">
          Answer Review
        </h2>
        <QuizAccordion questions={questions} answers={answers} />
      </div>
    </div>
  );
};

export default QuizResult;