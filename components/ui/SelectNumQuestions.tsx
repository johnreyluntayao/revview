'use client'

import React, { useState } from 'react'
import RadioButton from '../atoms/RadioButton'

const questionOptions = [
  { value: 5 },
  { value: 10 },
  { value: 15 },
  { value: 20 },
  { value: 25 },
  { value: 30 },
  { value: 40 },
  { value: 50 },
]

const SelectNumQuestions = () => {
  const [selected, setSelected] = useState<string | number | null>(null)

  return (
    <section>
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-3 lg:p-4 rounded-xl border-border border">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-6 md:mb-8 lg:mb-10">
          2. Number of Questions
        </h1>

        <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 grid grid-cols-4">
          {questionOptions.map((option) => (
            <RadioButton
              key={option.value}
              variant="pill"
              value={option.value}
              label={option.value.toString()}
              isSelected={selected === option.value}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default SelectNumQuestions