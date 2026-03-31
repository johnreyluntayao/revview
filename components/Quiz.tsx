"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, RadioButton, Progress } from "@/lib/client-imports";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useHybridQuizTimer } from "@/lib/hooks/useHybridQuizTimer";
import { CorrectAnswer, IncorrectAnswer } from "@/lib/icons";

type Question = {
  id: string;
  text: string;
  options: string[];
  correct_answer: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  img_url?: string | null;
};

type QuizSession = {
  id: string;
  total_questions: number;
  total_time_seconds: number;
  question_ids: string[];
  started_at: string;
  category_id: string | null;
  difficulty_id: string;
  is_paused: boolean;
  paused_at: string | null;
  total_paused_seconds: number;
};

type QuizAnswer = {
  question_id: string;
  selected_option: string | null;
  is_correct: boolean;
};

type QuizData = {
  session: QuizSession;
  questions: Question[];
  answers: QuizAnswer[] | null;
};

interface QuizProps {
  sessionId: string;
}

export default function Quiz({ sessionId }: QuizProps) {
  const supabase = createClient();
  const router = useRouter();

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | null>>(
    {},
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const questionStartTimeRef = useRef<number>(Date.now());
  const hasSubmittedRef = useRef(false);

  const { timeLeft, isPaused, setIsPaused } = useHybridQuizTimer({
    sessionId,
    onExpire: async () => {
      toast.error("Time's up! Submitting quiz...");
      await submitQuiz(true);
    },
  });

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (answerSubmitted || isPaused) return;

    const key = e.key.toLowerCase();

    let selectedValue: string | null = null;

    // A–E support
    if (["a", "b", "c", "d", "e"].includes(key)) {
      selectedValue = key.toUpperCase();
    }

    // 1–5 support (1=A, 2=B, ...)
    const num = parseInt(key);
    if (!isNaN(num) && num >= 1 && num <= 5) {
      selectedValue = String.fromCharCode(64 + num);
    }

    if (selectedValue) {
      setSelectedOption(selectedValue);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [answerSubmitted, isPaused]);

  useEffect(() => {
    async function fetchQuizData() {
      try {
        setLoading(true);

        const { data, error } = await supabase.rpc("get_quiz_data", {
          session_id: sessionId,
        });

        if (error) throw error;
        if (!data?.session) throw new Error("Session not found");

        const typedData = data as QuizData;
        const safeAnswers = typedData.answers || [];

        setQuizData({ ...typedData, answers: safeAnswers });

        const answeredMap: Record<string, string | null> = {};
        safeAnswers.forEach((a) => {
          answeredMap[a.question_id] = a.selected_option;
        });
        setUserAnswers(answeredMap);

        const answeredSet = new Set(Object.keys(answeredMap));
        const nextUnansweredIndex = typedData.questions.findIndex(
          (q) => !answeredSet.has(q.id),
        );
        setCurrentIndex(nextUnansweredIndex >= 0 ? nextUnansweredIndex : 0);

        setIsPaused(typedData.session.is_paused || false);

        questionStartTimeRef.current = Date.now();
      } catch (err: any) {
        console.error("Quiz load error:", err);
        toast.error("Could not load quiz. Redirecting...");
        router.replace("/dashboard?error=quiz_load_failed");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizData();
  }, [sessionId, router, supabase, setIsPaused]);

  const handleTimeExpired = useCallback(async () => {
    toast.error("Time's up! Submitting quiz...");
    await submitQuiz(true);
  }, []);

  const currentQuestion = quizData?.questions[currentIndex];
  const isLastQuestion = currentIndex === (quizData?.questions.length ?? 1) - 1;
  const answeredCount = Object.values(userAnswers).filter(
    (v) => v !== null,
  ).length;

  const handleChoice = (value: string | number | null) => {
    if (answerSubmitted || isPaused) return;
    if (value === null || value === undefined) return;

    const selectedValue =
      typeof value === "number" ? String.fromCharCode(64 + value) : value;

    if (["A", "B", "C", "D", "E"].includes(selectedValue)) {
      setSelectedOption(selectedValue);
    }
  };

  const submitCurrentAnswer = async () => {
    if (!currentQuestion || !selectedOption || isPaused) return;

    const timeTaken = Math.floor(
      (Date.now() - questionStartTimeRef.current) / 1000,
    );
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: selectedOption,
    }));
    setAnswerSubmitted(true);

    try {
      const { error } = await supabase.from("quiz_answers").upsert(
        {
          quiz_session_id: sessionId,
          question_id: currentQuestion.id,
          selected_option: selectedOption,
          is_correct: isCorrect,
          time_taken_seconds: timeTaken,
        },
        { onConflict: "quiz_session_id,question_id" },
      );

      if (error) throw error;
    } catch (err) {
      console.error("Failed to save answer:", err);
      toast.error("Could not save your answer");
    }
  };

  const goToNextQuestion = () => {
    if (currentIndex < (quizData?.questions.length ?? 0) - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
      questionStartTimeRef.current = Date.now();
    }
  };

  const submitQuiz = useCallback(
    async (timedOut = false) => {
      if (hasSubmittedRef.current) return;
      hasSubmittedRef.current = true;

      if (!quizData) return;

      try {
        const correctCount = quizData.questions.filter((q) => {
          const selected = userAnswers[q.id];
          return selected && selected === q.correct_answer;
        }).length;

        const answered = Object.keys(userAnswers).length;
        const wrongCount = answered - correctCount;

        const scorePercentage = quizData.session.total_questions
          ? Math.round((correctCount / quizData.session.total_questions) * 100)
          : 0;

        const totalPaused = quizData.session.total_paused_seconds || 0;
        const elapsedSeconds = Math.floor(
          (Date.now() - new Date(quizData.session.started_at).getTime()) / 1000,
        );
        let totalTimeTaken = elapsedSeconds - totalPaused;

        if (timedOut) {
          totalTimeTaken = quizData.session.total_time_seconds;
        }

        const unansweredInserts = quizData.questions
          .filter((q) => !userAnswers[q.id])
          .map((q) => ({
            quiz_session_id: sessionId,
            question_id: q.id,
            selected_option: null,
            is_correct: false,
            time_taken_seconds: 0,
          }));

        if (unansweredInserts.length > 0) {
          const { error: unansweredError } = await supabase
            .from("quiz_answers")
            .insert(unansweredInserts);

          if (unansweredError) throw unansweredError;
        }

        const { error: resultError } = await supabase
          .from("quiz_results")
          .insert({
            user_id: (await supabase.auth.getUser()).data.user?.id ?? "",
            quiz_session_id: sessionId,
            category_id: quizData.session.category_id,
            difficulty_id: quizData.session.difficulty_id,
            score: correctCount,
            total_questions: quizData.session.total_questions,
            correct_answers: correctCount,
            wrong_answers: wrongCount,
            skipped_answers: 0,
            time_taken_seconds: Math.max(0, totalTimeTaken),
            percentage: scorePercentage,
            date_taken: new Date().toISOString(),
          });

        if (resultError) throw resultError;

        await supabase
          .from("quiz_sessions")
          .update({
            is_completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        toast.success(
          timedOut ? "Time's up — quiz submitted!" : "Quiz completed!",
        );
        router.push(`/quiz-result/${sessionId}`);
      } catch (err: any) {
        console.error("Finish quiz error:", err);
        toast.error("Failed to submit quiz.");

        hasSubmittedRef.current = false;
      }
    },
    [quizData, userAnswers, sessionId, router, supabase],
  );

  useEffect(() => {
    (window as any).setQuizPaused = (paused: boolean) => {
      setIsPaused(paused);
    };
    return () => {
      delete (window as any).setQuizPaused;
    };
  }, [setIsPaused]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading your quiz...</p>
      </div>
    );
  }

  if (!quizData || !currentQuestion) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-destructive">Quiz data not found</p>
      </div>
    );
  }

  const confirmedAnswer = userAnswers[currentQuestion.id] ?? null;
  const isCorrect = confirmedAnswer === currentQuestion.correct_answer;

  return (
    <div className="px-4 md:px-6 lg:px-8 py-20 lg:py-24 place-self-center max-w-4xl w-full transition-all">
      <Progress
        variant="default"
        current={answeredCount}
        total={quizData.session.total_questions}
        label={`${answeredCount} of ${quizData.session.total_questions} answered`}
      />

      <div className="flex flex-col gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-5 lg:mt-6 p-4 md:p-6 lg:p-8 border border-border rounded-xl bg-card shadow-sm overflow-hidden transition-all">
        <div className="">
          <h2 className="text-sm md:text-base lg:text-lg font-semibold leading-tight">
            Question {currentIndex + 1}: {currentQuestion.text}
          </h2>
          {currentQuestion.img_url && (
            <div className="mt-2 md:mt-3 lg:mt-4 flex justify-center">
              <img
                src={currentQuestion.img_url}
                alt="Question illustration"
                className="max-h-64 object-contain rounded"
              />
            </div>
          )}
        </div>

        <div className="space-y-2 md:space-y-3 lg:space-y-4">
          {currentQuestion.options.map((optionText, idx) => {
            const value = String.fromCharCode(65 + idx);
            const isSelected = selectedOption === value;
            const isConfirmed = confirmedAnswer === value;

            let selectedColor = "";
            let indicator = "";
            let rightIcon = null;

            const isCorrectAnswer =
              answerSubmitted && value === currentQuestion.correct_answer;

            if (answerSubmitted) {
              if (isConfirmed && isCorrect) {
                selectedColor = "bg-success/10 border-success text-success";
                indicator = "text-white bg-success border-none";
                rightIcon = <CorrectAnswer className="text-success" />;
              } else if (isConfirmed && !isCorrect) {
                selectedColor =
                  "bg-destructive/10 border-destructive text-destructive";
                indicator = "text-white bg-destructive border-none";
                rightIcon = <IncorrectAnswer className="text-destructive" />;
              } else if (!isConfirmed && isCorrectAnswer) {
                selectedColor = "bg-success/10 border-none text-success";
                indicator = "text-white bg-success border-none";
                rightIcon = <CorrectAnswer className="text-success" />;
              }
            }

            // ✅ Detect if image exists → use image variant
            const hasImage = !!currentQuestion.img_url;

            return (
              <RadioButton
                key={value}
                variant={hasImage ? "image" : "choice"} // ✅ AUTO SWITCH
                value={value}
                label={optionText}
                image={hasImage ? currentQuestion.img_url! : undefined} // ✅ pass image
                isSelected={isSelected || isConfirmed || isCorrectAnswer}
                onSelect={handleChoice}
                disabled={answerSubmitted || isPaused}
                indicator={indicator}
                selectedColor={selectedColor}
                rightIcon={rightIcon}
              />
            );
          })}
        </div>

        {answerSubmitted && (
  <div className="p-4 md:p-5 lg:p-6 border border-primary/25 rounded-xl bg-primary/5 transition-all space-y-3 md:space-y-4">
    
    {/* RESULT HEADER */}
    <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
      {isCorrect ? (
        <CorrectAnswer className="text-success" />
      ) : (
        <IncorrectAnswer className="text-destructive" />
      )}
      <span className="text-sm md:text-base lg:text-lg font-bold text-foreground">
        {isCorrect ? "Correct!" : "Incorrect"}
      </span>
    </div>

    {/* EXPLANATION TEXT */}
    <p className="text-muted-foreground leading-relaxed text-xs md:text-sm lg:text-base">
      {currentQuestion.explanation}
    </p>

    {/* ✅ NEW: EXPLANATION IMAGE */}
    {currentQuestion.img_url && (
      <div className="flex justify-center">
        <img
          src={currentQuestion.img_url}
          alt="Explanation illustration"
          className="max-h-64 md:max-h-72 lg:max-h-80 w-auto object-contain rounded-lg border"
        />
      </div>
    )}
    
  </div>
)}
      </div>

      <div className="mt-4 md:mt-6 lg:mt-8 flex justify-end items-center gap-2 md:gap-3 lg:gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          {!answerSubmitted ? (
            <Button
              text="Submit Answer"
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              isDisabled={!selectedOption || isPaused}
              onClick={submitCurrentAnswer}
              className="flex-1 sm:flex-none"
            />
          ) : isLastQuestion ? (
            <Button
              text="Finish Quiz"
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              onClick={() => submitQuiz()}
              className="flex-1 sm:flex-none"
            />
          ) : (
            <Button
              text="Next Question"
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              onClick={goToNextQuestion}
              className="flex-1 sm:flex-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}
