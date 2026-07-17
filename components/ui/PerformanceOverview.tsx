import { AverageScore, BestCategory, NoResultsYet, ProgressTracking } from "@/lib/icons";

interface PerformanceOverviewProps {
  overallScore: string;
  overallScoreSub: string;
  bestScore: string;
  lowestScore: string;
  scoreImprovement: string;
}

const PerformanceOverview = ({
  overallScore,
  overallScoreSub,
  bestScore,
  lowestScore,
  scoreImprovement,
}: PerformanceOverviewProps) => {
  const isNegative = scoreImprovement.startsWith("-");
  const metrics = [
    {
      label: "Overall average",
      value: overallScore,
      helper: `Based on ${overallScoreSub} completed quizzes`,
      icon: AverageScore,
      style: "bg-primary/10 text-primary",
      wide: true,
    },
    {
      label: "Best score",
      value: bestScore,
      helper: "Your highest result",
      icon: BestCategory,
      style: "bg-success/10 text-success",
    },
    {
      label: "Lowest score",
      value: lowestScore,
      helper: "An opportunity to improve",
      icon: NoResultsYet,
      style: "bg-warning/10 text-warning",
    },
    {
      label: "Latest change",
      value: scoreImprovement,
      helper: "Compared with your previous quiz",
      icon: ProgressTracking,
      style: isNegative ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary",
      wide: true,
    },
  ];

  return (
    <section className="h-full rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-6">
      <header className="mb-5">
        <h2 className="text-base font-semibold text-foreground md:text-lg">Performance overview</h2>
        <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">A snapshot of your quiz results</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className={`rounded-xl border border-border/70 bg-background p-3.5 md:p-4 ${metric.wide ? "col-span-2" : ""}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-1.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">{metric.value}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{metric.helper}</p>
              </div>
              <div className={`hidden size-9 shrink-0 items-center justify-center rounded-lg sm:flex ${metric.style}`}>
                <metric.icon className="size-4" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PerformanceOverview;
