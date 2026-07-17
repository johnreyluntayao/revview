"use client";

import { AllCategories, Analytical, General, Numerical, Verbal } from "@/lib/icons";
import { RadioButton } from "@/lib/client-imports";
import { QuizCategory } from "@/lib/types";

interface Props {
  categories: QuizCategory[];
  selected: string | null;
  setSelected: (value: string | null) => void;
  isLoading?: boolean;
}

const icons = [<Numerical key="numerical" />, <Analytical key="analytical" />, <Verbal key="verbal" />, <General key="general" />];
const backgrounds = ["bg-blue-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600"];

const SelectCategory = ({ categories, selected, setSelected, isLoading = false }: Props) => (
  <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5 lg:p-6">
    <div className="mb-4 flex items-start gap-3 sm:mb-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">1</span>
      <div>
        <h2 className="text-base font-bold text-foreground sm:text-lg">Choose a category</h2>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">Focus on one subject or build a mixed practice set.</p>
      </div>
    </div>

    {isLoading ? (
      <div className="grid gap-2 sm:grid-cols-2" aria-label="Loading categories">
        {[1, 2, 3, 4].map((item) => <div key={item} className="h-17 animate-pulse rounded-xl bg-muted" />)}
      </div>
    ) : (
      <div className="grid gap-2 sm:grid-cols-2">
        <RadioButton
          variant="boxed"
          value="all"
          label="All Categories"
          description="A balanced mix of every subject"
          icon={<AllCategories />}
          boxedBG="bg-primary"
          isSelected={selected === null}
          onSelect={() => setSelected(null)}
          className="!gap-3 !p-3"
        />
        {categories.map((category, index) => (
          <RadioButton
            key={category.id}
            variant="boxed"
            value={category.id}
            label={category.name}
            description={category.description || "Practice this category"}
            icon={icons[index] ?? <General />}
            boxedBG={backgrounds[index] ?? "bg-slate-600"}
            isSelected={selected === category.id}
            onSelect={() => setSelected(category.id)}
            className="!gap-3 !p-3"
          />
        ))}
      </div>
    )}
  </section>
);

export default SelectCategory;
