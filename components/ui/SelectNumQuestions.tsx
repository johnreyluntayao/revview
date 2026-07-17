"use client";

import { useState } from "react";
import { InputField, RadioButton } from "@/lib/client-imports";

const questionOptions = [5, 10, 15, 20, 25, 30, 40, 50];

interface Props {
  selected: number;
  setSelected: (value: number) => void;
}

const SelectNumQuestions = ({ selected, setSelected }: Props) => {
  const [custom, setCustom] = useState("");

  const handlePreset = (value: number) => {
    setCustom("");
    setSelected(value);
  };

  const handleCustom = (value: string) => {
    setCustom(value);
    const count = Number(value);
    setSelected(count >= 1 && count <= 120 ? count : 0);
  };

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5 lg:p-6">
      <div className="mb-4 flex items-start gap-3 sm:mb-5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">2</span>
        <div>
          <h2 className="text-base font-bold text-foreground sm:text-lg">Set the quiz length</h2>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">Choose a quick drill or a longer review session.</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {questionOptions.map((value) => (
          <RadioButton
            key={value}
            variant="pill"
            value={value}
            label={value.toString()}
            isSelected={selected === value && custom === ""}
            onSelect={() => handlePreset(value)}
            className="!min-h-11 !p-2"
          />
        ))}
      </div>

      <div className="mt-4 grid items-end gap-2 sm:grid-cols-[minmax(0,14rem)_1fr]">
        <InputField
          label="Custom amount"
          placeholder="1–120 questions"
          type="number"
          value={custom}
          onChange={(event) => handleCustom(event.target.value)}
          max={120}
          min={1}
          step={1}
        />
        <p className="pb-2 text-xs leading-relaxed text-muted-foreground">Up to 120 questions per practice session.</p>
      </div>
    </section>
  );
};

export default SelectNumQuestions;
