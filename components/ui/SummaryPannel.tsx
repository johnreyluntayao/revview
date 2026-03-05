import Link from "next/link";
import { BeginQuiz } from "@/lib/icons";
import { QuizCategory } from "@/lib/types";
import { Button } from "@/lib/client-imports"

interface SummaryPanelProps {
  categories: QuizCategory[];
  selectedCategory: string | null;
  selectedQuestions: number;
  selectedDifficulty: string;
  totalTime: number | string;
  isStarting: boolean;
  handleStartQuiz: () => void;
}

export default function SummaryPanel({
  categories,
  selectedCategory,
  selectedQuestions,
  selectedDifficulty,
  totalTime,
  isStarting,
  handleStartQuiz,
}: SummaryPanelProps) {
  const categoryName =
    categories.find((c) => c.id === selectedCategory)?.name || "Not selected";

  return (
    <div className="lg:sticky lg:top-20 h-fit w-full">
      <div className="bg-linear-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-border">
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Quiz Summary
        </h3>

        <div className="space-y-6 mb-8">
          {/* Category */}
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Category</p>
            <p className="font-semibold text-foreground text-lg">
              {categoryName}
            </p>
          </div>

          {/* Questions count */}
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Questions</p>
            <p className="font-semibold text-foreground text-lg">
              {selectedQuestions} questions
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <p className="text-sm text-muted-foreground mb-1.5">Difficulty</p>
            <p className="font-semibold text-foreground text-lg capitalize">
              {selectedDifficulty || "—"}
            </p>
          </div>

          {/* Estimated Time */}
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground mb-2">
              Estimated Time
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {totalTime}
              </span>
              <span className="text-foreground text-xl">minutes</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              You can finish early by clicking "Finish Quiz" anytime.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 mt-2">
        <Button
            onClick={handleStartQuiz}
            isDisabled={isStarting}
            backgroundColor="bg-gradient-to-r from-primary to-secondary"
            textColor="text-primary-foreground"
            className="
            w-full 
            font-semibold 
            shadow-sm hover:shadow-md hover:shadow-primary/30 
            transition-all duration-300
            disabled:opacity-60
            "
            isRounded={false}
        >
            {isStarting ? (
            <>
                <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
                >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
                </svg>
                <span>Starting...</span>
            </>
            ) : (
            <>
                Start Quiz
                <BeginQuiz className="w-5 h-5" /> 
            </>
            )}
        </Button>

        <Link
            href="/dashboard"
            className="
            flex h-13 sm:h-14 md:h-15
            w-full items-center justify-center
            rounded-xl border border-border
            text-foreground
            hover:bg-muted/70 active:bg-muted
            transition-colors text-sm sm:text-base 
                gap-2 sm:gap-2.5 
                font-medium
            "
        >
            Back to Dashboard
        </Link>

        </div>
      </div>
    </div>
  );
}