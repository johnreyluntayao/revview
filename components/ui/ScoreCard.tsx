"use client";

import { Button } from "@/lib/imports";
import { RotateCw, ArrowLeft } from "lucide-react"; 
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

  const router = useRouter();

  return (
    <div
      className={`
        ${getScoreBgColor(score)}
        rounded-xl p-8 sm:p-12 
        border-2 
        mb-8 
        animate-slide-up
        w-full
      `}
    >
      <div className="text-center">
        <p className="text-muted-foreground mb-2">Your Score</p>

        <div className="flex items-baseline justify-center gap-2 mb-6">
          <span className={`text-6xl sm:text-7xl font-bold ${getScoreTextColor(score)}`}>
            {score}
          </span>
          <span className="text-2xl sm:text-3xl text-muted-foreground">%</span>
        </div>

        <p className="text-lg text-foreground mb-8">
          You got <span className="font-bold">{correctCount}</span> out of{" "}
          <span className="font-bold">{totalQuestions}</span> questions correct
        </p>

        {/* Performance Message */}
        <p className={`text-lg font-semibold mb-8 ${getScoreTextColor(score)}`}>
          {score >= 80
            ? "Excellent work! You've mastered this topic."
            : score >= 60
              ? "Good job! Keep practicing to improve further."
              : score >= 40
                ? "You're making progress. Review the explanations and try again."
                : "Let's review the concepts. Practice makes perfect!"}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-10">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Correct</p>
            <p className="text-2xl sm:text-3xl font-bold text-success">{correctCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Incorrect</p>
            <p className="text-2xl sm:text-3xl font-bold text-destructive">{incorrectCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Time Used</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary">
              {minutesUsed}:{secondsUsed.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.push("/quizselection")}
            leftIcon={<RotateCw className="w-5 h-5" />}
            text="Retake Quiz"
            backgroundColor="bg-primary"
            textColor="text-primary-foreground"
          />

          <Button
            onClick={() => router.push("/dashboard")}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            text="Dashboard"
            backgroundColor="bg-transparent"
            textColor="text-primary"
            className="border-2 border-primary hover:bg-primary/5"
          />
        </div>
      </div>
    </div>
  );
}