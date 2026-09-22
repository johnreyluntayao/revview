"use client";

import { Button } from "@/lib/client-imports";
import { BackToDashboard, BestCategory, Check, Clock3, IncorrectAnswer, RetakeQuiz } from "@/lib/icons";
import { useRouter } from "next/navigation";

interface ScoreCardProps {
  score: number;          
  correctCount: number;
  totalQuestions: number;
  minutesUsed: number | string;
  secondsUsed: number;
}

export default function ScoreCard({
  score,
  correctCount,
  totalQuestions,
  minutesUsed,
  secondsUsed,
}: ScoreCardProps) {

   const getScoreBgColor = (scoreVal: number) => {
    if (scoreVal >= 80) return "bg-success/15 border border-success/50";
    if (scoreVal >= 60) return "bg-primary/15 border border-primary/50";
    if (scoreVal >= 40) return "bg-warning/15 border border-warning/50";
    return "bg-destructive/15 border border-destructive/50";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const incorrectCount = totalQuestions - correctCount;
  const scoreMessage = score >= 80
    ? "Excellent work — you have a strong grasp of this material."
    : score >= 60
      ? "A solid result. Review the missed concepts, then build on it."
      : score >= 40
        ? "You are making progress. Use the review below to target weak spots."
        : "Every attempt is useful data. Review the concepts and try again.";

  const router = useRouter();

  return (
    <section className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm sm:p-7 lg:p-8 ${getScoreBgColor(score)}`}>
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-primary"><BestCategory className="size-4" /> Quiz complete</div>
          <p className="text-xs font-semibold text-muted-foreground">{correctCount} of {totalQuestions} correct</p>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-[11rem_minmax(0,1fr)] md:items-center">
          <div className="mx-auto flex aspect-square w-40 flex-col items-center justify-center rounded-full border-8 border-card bg-card/80 shadow-lg sm:w-44">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">Your score</p>
            <p className={`mt-1 text-5xl font-bold tracking-tight sm:text-6xl ${getScoreTextColor(score)}`}>{score}<span className="text-xl">%</span></p>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Your results are ready</h1>
            <p className={`mt-2 text-sm font-semibold sm:text-base ${getScoreTextColor(score)}`}>{scoreMessage}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-success/20 bg-card/70 p-3 text-center"><Check className="mx-auto size-4 text-success" /><p className="mt-1 text-lg font-bold text-success sm:text-xl">{correctCount}</p><p className="text-[11px] font-medium text-muted-foreground">Correct</p></div>
              <div className="rounded-xl border border-destructive/20 bg-card/70 p-3 text-center"><IncorrectAnswer className="mx-auto size-4 text-destructive" /><p className="mt-1 text-lg font-bold text-destructive sm:text-xl">{incorrectCount}</p><p className="text-[11px] font-medium text-muted-foreground">Incorrect</p></div>
              <div className="rounded-xl border border-primary/20 bg-card/70 p-3 text-center"><Clock3 className="mx-auto size-4 text-primary" /><p className="mt-1 text-lg font-bold text-primary sm:text-xl">{minutesUsed}:{secondsUsed.toString().padStart(2, "0")}</p><p className="text-[11px] font-medium text-muted-foreground">Time used</p></div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:flex sm:justify-end">
          <Button onClick={() => router.push("/dashboard")} leftIcon={<BackToDashboard className="size-4" />} text="Back to dashboard" backgroundColor="bg-card/80" textColor="text-primary" className="min-h-11 border border-primary/20" />
          <Button onClick={() => router.push("/quiz-selection")} rightIcon={<RetakeQuiz className="size-4" />} text="Take another quiz" backgroundColor="bg-primary" textColor="text-primary-foreground" className="min-h-11" />
        </div>
      </div>
    </section>
  );
}
