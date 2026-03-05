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
      <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-4 lg:p-6 rounded-xl border-border border">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
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