import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3, Gauge, ListChecks, Play } from "lucide-react";
import { QuizCategory } from "@/lib/types";
import { Button } from "@/lib/client-imports";

interface SummaryPanelProps {
  categories: QuizCategory[];
  selectedCategory: string | null;
  selectedQuestions: number;
  selectedDifficulty: string;
  totalTime: number;
  isStarting: boolean;
  canStart: boolean;
  handleStartQuiz: () => void;
}

export default function SummaryPanel({
  categories,
  selectedCategory,
  selectedQuestions,
  selectedDifficulty,
  totalTime,
  isStarting,
  canStart,
  handleStartQuiz,
}: SummaryPanelProps) {
  const categoryName = selectedCategory === null
    ? "All Categories"
    : categories.find((category) => category.id === selectedCategory)?.name || "Not selected";

  const details = [
    { label: "Category", value: categoryName, icon: BookOpen },
    { label: "Questions", value: selectedQuestions ? `${selectedQuestions} questions` : "Not selected", icon: ListChecks },
    { label: "Difficulty", value: selectedDifficulty || "Not selected", icon: Gauge },
  ];

  return (
    <aside className="h-fit xl:sticky xl:top-6">
      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-sm">
        <div className="bg-linear-to-br from-primary/15 via-primary/8 to-secondary/15 p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Ready when you are</p>
          <h2 className="mt-1 text-xl font-bold text-foreground">Your quiz plan</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Review your choices before beginning the timed session.</p>
        </div>

        <div className="p-5 sm:p-6">
          <dl className="space-y-4">
            {details.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4.5" /></span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="truncate text-sm font-semibold capitalize text-foreground">{value}</dd>
                </div>
              </div>
            ))}
          </dl>

          <div className="my-5 flex items-center justify-between rounded-xl border border-border/70 bg-muted/40 p-4">
            <div className="flex items-center gap-3">
              <Clock3 className="size-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated time</p>
                <p className="text-sm font-semibold text-foreground">{totalTime > 0 ? `${totalTime} minutes` : "—"}</p>
              </div>
            </div>
            {totalTime > 0 && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">Timed</span>}
          </div>

          <Button
            onClick={handleStartQuiz}
            isDisabled={!canStart || isStarting}
            backgroundColor="bg-linear-to-r from-primary to-secondary"
            textColor="text-primary-foreground"
            className="min-h-12 w-full font-semibold shadow-sm hover:shadow-md"
            rightIcon={<Play />}
          >
            {isStarting ? (
              <><span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Starting quiz…</>
            ) : (
              <>Start quiz</>
            )}
          </Button>

          {!canStart && <p className="mt-2 text-center text-xs text-muted-foreground">Choose a question count and difficulty to continue.</p>}

          <Link href="/dashboard" className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted">
            <ArrowLeft className="size-4" /> Back to dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}
