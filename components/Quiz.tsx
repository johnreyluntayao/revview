"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button, RadioButton, Progress } from "@/lib/client-imports";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  CorrectAnswer,
  IncorrectAnswer,
  Lightbulb,
  LoaderCircle,
} from "@/lib/icons";
import Image from "next/image";

type Question = {
  option_images?: (string | null)[];
  id: string;
  text: string;
  options: (string | null | undefined)[];
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

type AvailableOption = {
  value: "A" | "B" | "C" | "D" | "E";
  text: string;
  image: string | null;
};

const answerValues = ["A", "B", "C", "D", "E"] as const;

function getAvailableOptions(question: Question): AvailableOption[] {
  return question.options.flatMap((option, index) => {
    if (index >= answerValues.length || typeof option !== "string" || !option.trim()) {
      return [];
    }

    return [{
      value: answerValues[index],
      text: option,
      image: question.option_images?.[index] ?? null,
    }];
  });
}

interface QuizProps {
  sessionId: string;
}

type QuizWindow = Window &
  typeof globalThis & {
    setQuizPaused?: (paused: boolean) => void;
    submitQuiz?: (timedOut?: boolean) => Promise<void>;
  };

export default function Quiz({ sessionId }: QuizProps) {
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | null>>(
    {},
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const questionStartTimeRef = useRef<number>(Date.now());
  const hasSubmittedRef = useRef(false);

  const currentQuestion = quizData?.questions[currentIndex];
  const currentOptions = useMemo(
    () => (currentQuestion ? getAvailableOptions(currentQuestion) : []),
    [currentQuestion],
  );
  const isLastQuestion = currentIndex === (quizData?.questions.length ?? 1) - 1;
  const answeredCount = Object.values(userAnswers).filter(
    (value) => value !== null,
  ).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (answerSubmitted || isPaused || isSavingAnswer) return;

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

      if (
        selectedValue &&
        currentOptions.some((option) => option.value === selectedValue)
      ) {
        setSelectedOption(selectedValue);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [answerSubmitted, currentOptions, isPaused, isSavingAnswer]);

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
      } catch (err: unknown) {
        console.error("Quiz load error:", err);
        toast.error("Could not load quiz. Redirecting...");
        router.replace("/dashboard?error=quiz_load_failed");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizData();
  }, [sessionId, router, supabase, setIsPaused]);

  const handleChoice = (value: string | number | null) => {
    if (answerSubmitted || isPaused || isSavingAnswer) return;
    if (value === null || value === undefined) return;

    const selectedValue =
      typeof value === "number" ? String.fromCharCode(64 + value) : value;

    if (currentOptions.some((option) => option.value === selectedValue)) {
      setSelectedOption(selectedValue);
    }
  };

  const submitCurrentAnswer = async () => {
    if (!currentQuestion || !selectedOption || isPaused) return;

    const timeTaken = Math.floor(
      (Date.now() - questionStartTimeRef.current) / 1000,
    );
    const isCorrect = selectedOption === currentQuestion.correct_answer;

    try {
      setIsSavingAnswer(true);
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
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOption,
      }));
      setAnswerSubmitted(true);
    } catch (err) {
      console.error("Failed to save answer:", err);
      toast.error("Could not save your answer. Please try again.");
    } finally {
      setIsSavingAnswer(false);
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
      if (!quizData) return;
      if (hasSubmittedRef.current) return;
      hasSubmittedRef.current = true;

      try {
        setIsSubmittingQuiz(true);
        const correctCount = quizData.questions.filter((q) => {
          const selected = userAnswers[q.id];
          return selected && selected === q.correct_answer;
        }).length;

        const answered = Object.values(userAnswers).filter(Boolean).length;
        const wrongCount = answered - correctCount;
        const skippedCount = quizData.session.total_questions - answered;

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
            skipped_answers: skippedCount,
            time_taken_seconds: Math.max(0, totalTimeTaken),
            percentage: scorePercentage,
            date_taken: new Date().toISOString(),
          });

        if (resultError) throw resultError;

        const { error: sessionUpdateError } = await supabase
          .from("quiz_sessions")
          .update({
            is_completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        if (sessionUpdateError) throw sessionUpdateError;

        toast.success(
          timedOut ? "Time's up — quiz submitted!" : "Quiz completed!",
        );
        router.replace(`/quiz-result/${sessionId}`);
      } catch (err: unknown) {
        console.error("Finish quiz error:", err);
        toast.error("Failed to submit quiz.");

        hasSubmittedRef.current = false;
        setIsSubmittingQuiz(false);
      }
    },
    [quizData, userAnswers, sessionId, router, supabase],
  );

  useEffect(() => {
    (window as QuizWindow).setQuizPaused = (paused: boolean) => {
      setIsPaused(paused);
    };
    (window as QuizWindow).submitQuiz = submitQuiz;
    return () => {
      delete (window as QuizWindow).setQuizPaused;
      delete (window as QuizWindow).submitQuiz;
    };
  }, [submitQuiz]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-primary/5 to-background px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LoaderCircle className="size-6 animate-spin" />
          </span>
          <div>
            <p className="font-semibold text-foreground">Preparing your quiz</p>
            <p className="mt-1 text-sm text-muted-foreground">Loading your questions and saved progress…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizData || !currentQuestion) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <p className="font-semibold text-destructive">Quiz data could not be found.</p>
          <p className="mt-1 text-sm text-muted-foreground">Return to the dashboard and start a new session.</p>
        </div>
      </div>
    );
  }

  const confirmedAnswer = userAnswers[currentQuestion.id] ?? null;
  const isCorrect = confirmedAnswer === currentQuestion.correct_answer;

  const optionImage = currentOptions.some((option) => option.image);

  return (
    <div className="min-h-screen bg-linear-to-b from-primary/5 via-background to-background px-4 pb-10 pt-32 sm:px-6 md:pt-28 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:mb-5 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Quiz progress</p>
              <p className="mt-1 text-sm font-semibold text-foreground">Question {currentIndex + 1} of {quizData.session.total_questions}</p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              {answeredCount} answered
            </div>
          </div>
          <Progress
            variant="default"
            current={answeredCount}
            total={quizData.session.total_questions}
            className="!p-0"
          />
        </div>

        <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 p-5 sm:p-7 lg:p-8">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">{currentIndex + 1}</span>
              Select the best answer
            </div>
            <h1 className="whitespace-pre-wrap text-lg font-bold leading-relaxed text-foreground sm:text-xl lg:text-2xl">
              {currentQuestion.text}
            </h1>
          {currentQuestion.img_url && (
            <div className="mt-5 flex h-56 w-full justify-center rounded-xl border border-border/70 bg-muted/40 p-3 sm:h-72">
              <Image
                src={currentQuestion.img_url}
                alt="Question illustration"
                className="h-full w-full rounded-lg object-contain"
                width={1000}
                height={1000}
              />
            </div>
          )}
          </div>

        <div
          className={`${
            optionImage
              ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
              : "grid grid-cols-1 gap-3"
          } p-5 sm:p-7 lg:p-8`}
        >
          {currentOptions.map(({ value, text: optionText, image }) => {
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

            return (
                <RadioButton
                  key={value}
                  variant={image ? "image" : "choice"}
                  value={value}
                  label={optionText}
                  image={
                    image || undefined
                  }
                  isSelected={isSelected || isConfirmed || isCorrectAnswer}
                  onSelect={handleChoice}
                  disabled={answerSubmitted || isPaused || isSavingAnswer}
                  indicator={indicator}
                  selectedColor={selectedColor}
                  rightIcon={rightIcon}
                  className={image ? "!p-3" : "!min-h-14 !p-3 sm:!p-4"}
                />
            );
          })}
        </div>

        {answerSubmitted && (
          <div className={`border-t p-5 sm:p-7 lg:p-8 ${isCorrect ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <span className="flex size-9 items-center justify-center rounded-full bg-success/15 text-success"><Check className="size-5" /></span>
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-destructive/15"><IncorrectAnswer className="text-destructive" /></span>
              )}
              <div>
              <p className="text-base font-bold text-foreground sm:text-lg">
                {isCorrect ? "Correct!" : "Incorrect"}
              </p>
              {!isCorrect && <p className="text-xs text-muted-foreground">The correct answer is {currentQuestion.correct_answer}.</p>}
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-border/60 bg-card/70 p-4">
              <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-primary">Explanation</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">{currentQuestion.explanation}</p>
              </div>
            </div>
          </div>
        )}
        </article>

        <div className="sticky bottom-3 z-10 mt-4 rounded-2xl border border-border/70 bg-background/90 p-3 shadow-lg backdrop-blur-xl sm:static sm:mt-5 sm:flex sm:items-center sm:justify-between sm:bg-transparent sm:p-0 sm:shadow-none">
          <div className="p-2 md:p-2.5 lg:p-3 hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <Clock3 className="size-4" /> Your answer is saved before you continue.
          </div>
          <div className="w-full sm:w-auto sm:min-w-44">
          {!answerSubmitted ? (
            <Button
              text={isSavingAnswer ? "Saving answer…" : "Submit answer"}
              leftIcon={isSavingAnswer ? <LoaderCircle className="size-4 animate-spin" /> : <Check className="size-4" />}
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              isDisabled={!selectedOption || isPaused || isSavingAnswer}
              onClick={submitCurrentAnswer}
              className="min-h-12 w-full font-semibold"
            />
          ) : isLastQuestion ? (
            <Button
              text={isSubmittingQuiz ? "Submitting quiz…" : "Finish quiz"}
              leftIcon={isSubmittingQuiz ? <LoaderCircle className="size-4 animate-spin" /> : undefined}
              rightIcon={!isSubmittingQuiz ? <Check className="size-4" /> : undefined}
              backgroundColor="bg-linear-to-r from-primary to-secondary"
              textColor="text-primary-foreground"
              isDisabled={isSubmittingQuiz}
              onClick={() => submitQuiz()}
              className="min-h-12 w-full font-semibold"
            />
          ) : (
            <Button
              text="Next question"
              rightIcon={<ArrowRight className="size-4" />}
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              onClick={goToNextQuestion}
              className="min-h-12 w-full font-semibold"
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
