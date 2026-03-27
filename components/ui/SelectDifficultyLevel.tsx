'use client'

import { RadioButton } from '@/lib/client-imports';
import { DifficultyLevel } from '@/lib/types';

interface Props {
  difficultyLevels: DifficultyLevel[];
  selected: string;
  setSelected: (value: string) => void;
}

const SelectDifficultyLevel = ({
  difficultyLevels,
  selected,
  setSelected,
}: Props) => {
  return (
    <section>
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-4 md:p-5 lg:p-6 rounded-xl border-border border bg-card">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
          3. Difficulty Level
        </h1>

        {difficultyLevels.map((d) => (
          <RadioButton
            key={d.id}
            variant="card"
            value={d.id}
            label={d.label}
            description={`${d.description}`}
            isSelected={selected === d.id}
            onSelect={() => setSelected(d.id)}
          />
        ))}
      </div>
    </section>
  );
};

export default SelectDifficultyLevel;