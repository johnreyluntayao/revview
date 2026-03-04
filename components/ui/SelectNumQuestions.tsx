'use client'

import React, { useState } from 'react'
import RadioButton from '../atoms/RadioButton'
import { AllCategories, Analytical, General, Numerical, Verbal } from '@/lib/icons';

const categories = [
    {
        value: "numerical",
    },

];

const SelectNumQuestions = () => {

    const [selected, setSelected] = useState<string | number | null>(null);
    return (
        <section>
            <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-3 lg:p-4 rounded-xl border-border border">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-10">
                    2. Number of Questions
                </h1>
                {categories.map((category) => (
                    <RadioButton
                        variant="pill"
                        value="easy"
                        label="Easy"
                        isSelected={selected === "easy"}
                        onSelect={setSelected}
                    />
                ))}
            </div>
        </section>
    )
}

export default SelectNumQuestions