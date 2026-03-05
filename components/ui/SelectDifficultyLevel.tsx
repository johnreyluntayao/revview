'use client'

import React, { useState } from 'react'

import { RadioButton } from '@/lib/client-imports';

const categories = [
    {
        value: "Easy",
        label: "Easy",
        time: 3,
    },
    {
        value: "Medium",
        label: "Medium",
        time: 2,
    },
    {
        value: "Hard",
        label: "Hard",
        time: 1,
    },
];

const SelectDifficultyLevel = () => {

    const [selected, setSelected] = useState<string | number | null>(null);
    return (
        <section>
            <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-4 lg:p-6 rounded-xl border-border border">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
                    3. Difficulty Level
                </h1>
                {categories.map((category) => (
                    <RadioButton
                        key={category.value}
                        variant="card"
                        value={category.value}
                        label={category.label}
                        description={`${category.time} minute per question`}
                        isSelected={selected === category.value}
                        onSelect={setSelected}
                    />
                ))}
            </div>
        </section>
    )
}

export default SelectDifficultyLevel