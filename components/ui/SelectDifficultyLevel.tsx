"use client";

import { RadioButton } from "@/lib/client-imports";
import { DifficultyLevel } from "@/lib/types";

interface Props {
  difficultyLevels: DifficultyLevel[];
  selected: string;
  setSelected: (value: string) => void;
  isLoading?: boolean;
}

const SelectDifficultyLevel = ({ difficultyLevels, selected, setSelected, isLoading = false }: Props) => (
  <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5 lg:p-6">
    <div className="mb-4 flex items-start gap-3 sm:mb-5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">3</span>
      <div>
        <h2 className="text-base font-bold text-foreground sm:text-lg">Select a difficulty</h2>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">Pick the pace and challenge that suit today&apos;s goal.</p>
      </div>
    </div>

    {isLoading ? (
      <div className="grid gap-2 md:grid-cols-3" aria-label="Loading difficulty levels">
        {[1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-muted" />)}
      </div>
    ) : (
      <div className="grid gap-2 md:grid-cols-3">
        {difficultyLevels.map((difficulty) => (
          <RadioButton
            key={difficulty.id}
            variant="card"
            value={difficulty.id}
            label={difficulty.label}
            description={difficulty.description || `${difficulty.minutes_per_question} minute(s) per question`}
            isSelected={selected === difficulty.id}
            onSelect={() => setSelected(difficulty.id)}
            className="!min-h-20 !p-3"
          />
        ))}
      </div>
    )}
  </section>
);

export default SelectDifficultyLevel;
