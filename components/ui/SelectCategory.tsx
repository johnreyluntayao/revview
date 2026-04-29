'use client'

import { AllCategories, Analytical, General, Numerical, Verbal } from '@/lib/icons';
import { RadioButton } from '@/lib/client-imports';
import { QuizCategory } from '@/lib/types';

interface Props {
  categories: QuizCategory[];
  selected: string | null;
  setSelected: (value: string | null) => void;
}

const icons = [
  <Numerical />,   
  <Analytical />, 
  <Verbal />,  
  <General />, 
];

const backgrounds = [
  "bg-blue-700",
  "bg-violet-700",
  "bg-green-700", 
  "bg-orange-700",
];

const SelectCategory = ({ categories, selected, setSelected }: Props) => {
  return (
    <section>
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-4 md:p-5 lg:p-6 rounded-xl border-border border bg-card">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
          1. Select Category
        </h1>

        {/* ALL */}
        <RadioButton
          variant="boxed"
          value="all"
          label="All Categories"
          description="Mixed questions from all categories"
          icon={<AllCategories />}
          boxedBG="bg-purple-700"
          isSelected={selected === null}
          onSelect={() => setSelected(null)}
        />

        {categories.map((category, index) => {
          const icon = icons[index] ?? null;
          const bg = backgrounds[index] ?? "bg-gray-700";

          return (
            <RadioButton
              key={category.id}
              variant="boxed"
              value={category.id}
              label={category.name}
              description={category.description || ""}
              icon={icon}
              boxedBG={bg}
              isSelected={selected === category.id}
              onSelect={() => setSelected(category.id)}
            />
          );
        })}
      </div>
    </section>
  );
};

export default SelectCategory;