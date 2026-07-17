interface CategoryItem {
  title: string;
  value: number;
  testCount: number;
}

interface CategoryProgressProps {
  categories: CategoryItem[];
}

const CategoryProgress = ({ categories }: CategoryProgressProps) => (
  <section className="h-full rounded-2xl border border-border/80 bg-card p-4 shadow-sm md:p-6">
    <header className="mb-5">
      <h2 className="text-base font-semibold text-foreground md:text-lg">Category progress</h2>
      <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Your average result in each review area</p>
    </header>

    <div className="space-y-4">
      {categories.map((category) => {
        const percentage = Math.min(100, Math.max(0, category.value));

        return (
          <div key={category.title}>
            <div className="mb-1.5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{category.title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {category.testCount} {category.testCount === 1 ? "quiz" : "quizzes"} completed
                </p>
              </div>
              <span className="text-sm font-bold text-primary">{percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-[width] duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default CategoryProgress;
