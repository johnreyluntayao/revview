import { Calendar, NoResultsYet, StudyTime } from "@/lib/icons";
import { Chip } from "@/lib/client-imports";
import type { ChipProps } from "@/lib/types";

interface ScoreEntry {
  key: string;
  category: string;
  score: string;
  difficulty: string;
  time: string;
  date: string;
}

interface RecentScoresProps {
  scores: ScoreEntry[];
}

const getDifficultyVariant = (difficulty: string): ChipProps["variant"] => {
  const normalized = difficulty.toLowerCase().trim();
  if (normalized === "easy") return "easy";
  if (normalized === "medium") return "medium";
  if (normalized === "hard") return "hard";
  return "default";
};

const RecentScores = ({ scores }: RecentScoresProps) => (
  <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
    <header className="border-b border-border/70 px-4 py-4 md:px-6 md:py-5">
      <h2 className="text-base font-semibold text-foreground md:text-lg">Recent quiz results</h2>
      <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Your ten most recent review attempts</p>
    </header>

    {scores.length === 0 ? (
      <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
        <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <NoResultsYet className="size-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">No quiz results yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Complete your first review to see progress here.</p>
      </div>
    ) : (
      <>
        <div className="space-y-3 p-3 md:hidden">
          {scores.map((score) => (
            <article key={score.key} className="rounded-xl border border-border/80 bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{score.category}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Chip text={score.difficulty} variant={getDifficultyVariant(score.difficulty)} />
                    <span className="text-xs text-muted-foreground">Score</span>
                  </div>
                </div>
                <Chip text={score.score} variant="score" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/70 pt-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><StudyTime className="size-3.5" />{score.time}</span>
                <span className="flex items-center justify-end gap-1.5 text-right"><Calendar className="size-3.5" />{score.date}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Category</th>
                <th className="px-4 py-3 text-center">Score</th>
                <th className="px-4 py-3 text-center">Difficulty</th>
                <th className="px-4 py-3 text-center">Duration</th>
                <th className="px-5 py-3 text-right">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {scores.map((score) => (
                <tr key={score.key} className="transition hover:bg-primary/[0.025]">
                  <td className="px-5 py-4 font-medium text-foreground">{score.category}</td>
                  <td className="px-4 py-4 text-center"><Chip text={score.score} variant="score" /></td>
                  <td className="px-4 py-4 text-center"><Chip text={score.difficulty} variant={getDifficultyVariant(score.difficulty)} /></td>
                  <td className="px-4 py-4 text-center text-muted-foreground">{score.time}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground">{score.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    )}
  </section>
);

export default RecentScores;
