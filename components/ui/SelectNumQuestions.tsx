'use client'

import React, { useState } from 'react'
import { RadioButton, InputField } from '@/lib/client-imports';

const questionOptions = [5,10,15,20,25,30,40,50];

interface Props {
  selected: number;
  setSelected: (value: number) => void;
}

const SelectNumQuestions = ({ selected, setSelected }: Props) => {
  const [custom, setCustom] = useState("");

  const handleCustom = (val: string) => {
    const num = Number(val);
    setCustom(val);

    if (num > 0 && num <= 120) {
      setSelected(num);
    }
  };

  return (
    <section>
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-4 md:p-5 lg:p-6 rounded-xl border-border border">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
          2. Number of Questions
        </h1>

        <div className="flex-wrap gap-2 md:gap-3 lg:gap-4 grid grid-cols-4">
          {questionOptions.map((value) => (
            <RadioButton
              key={value}
              variant="pill"
              value={value}
              label={value.toString()}
              isSelected={selected === value}
              onSelect={() => setSelected(value)}
            />
          ))}
        </div>

        {/* Custom */}
        <div className="mt-4">
          <InputField
            placeholder="Custom (max 120)"
            type="number"
            value={custom}
            onChange={(e) => handleCustom(e.target.value)}
            max={120}
            min={0}
            step={5}
          />
        </div>
      </div>
    </section>
  );
};

export default SelectNumQuestions;