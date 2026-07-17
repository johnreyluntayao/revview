import { Calendar, Eye, Questions, StudyTime } from "@/lib/icons";
import { Chip } from "@/lib/client-imports";
import type { ChipProps } from "@/lib/types";

interface ScoreRecordProps {
  title: string;
  difficulty: string;
  items: number;
  score: number;
  time: string;
  date: string;
  percentage: number;
  onViewDetail: () => void;
}

const getDifficultyVariant = (difficulty: string): ChipProps["variant"] => {
  const normalized = difficulty.toLowerCase();
  if (normalized === "easy") return "easy";
  if (normalized === "medium") return "medium";
  if (normalized === "hard") return "hard";
  return "default";
};

const getScoreStyles = (score: number) => {
  if (score >= 80) return "bg-success/10 text-success";
  if (score >= 60) return "bg-primary/10 text-primary";
  if (score >= 40) return "bg-warning/10 text-warning";
  return "bg-destructive/10 text-destructive";
};

const ScoreRecord = ({
  title,
  difficulty,
  items,
  score,
  time,
  date,
  percentage,
  onViewDetail,
}: ScoreRecordProps) => (
  <article className="group rounded-xl border border-border/80 bg-background p-4 transition duration-300 hover:border-primary/20 hover:shadow-sm md:p-5">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl ${getScoreStyles(percentage)}`}>
        <span className="text-xl font-bold tracking-tight">{percentage}%</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-sm font-semibold text-foreground md:text-base">{title}</h2>
          <Chip text={difficulty} variant={getDifficultyVariant(difficulty)} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground lg:grid-cols-3">
          <span className="flex items-center gap-1.5"><Questions className="size-3.5" />{score}/{items} correct</span>
          <span className="flex items-center gap-1.5"><StudyTime className="size-3.5" />{time}</span>
          <span className="col-span-2 flex items-center gap-1.5 lg:col-span-1"><Calendar className="size-3.5" />{date}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onViewDetail}
        className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground sm:w-auto md:text-sm"
      >
        <Eye className="size-4" />
        View details
      </button>
    </div>
  </article>
);

export default ScoreRecord;
