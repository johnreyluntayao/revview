'use client'

import React, { useState } from 'react'
import { AllCategories, Analytical, General, Numerical, Verbal } from '@/lib/icons';
import { RadioButton } from '@/lib/imports';

const categories = [
    {
        value: "numerical",
        iconBg:"bg-blue-700",
        label: "Numerical Ability",
        description: "Basic operations, word problems, quick calculations",
        icon: <Numerical/>
    },
    {
        value: "analytical",
        iconBg:"bg-violet-700",
        label: "Analytical Ability",
        description: "Word association, logic, data interpretation",
        icon: <Analytical/>
    },
    {
        value: "verbal",
        iconBg:"bg-green-700",
        label: "Verbal Ability",
        description: "Grammar, vocabulary, reading comprehension",
        icon: <Verbal/>
    },
    {
        value: "general",
        iconBg:"bg-orange-700",
        label: "General Information",
        description: "Constitution, Code of Conduct, peace & human rights",
        icon: <General/>
    },
    {
        value: "all",
        iconBg:"bg-purple-700",
        label: "All Categories",
        description: "Mixed questions from all categories",
        icon: <AllCategories/>
    },
];

const SelectCategory = () => {

    const [selected, setSelected] = useState<string | number | null>(null);
    return (
        <section>
            <div className="w-full flex flex-col gap-1 md:gap-1.5 lg:gap-2 p-2 md:p-4 lg:p-6 rounded-xl border-border border">
                <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-4 lg:mb-6">
                    1. Select Category
                </h1>
                {categories.map((category) => (
                    <RadioButton
                        key={category.value}
                        variant="boxed"
                        value={category.value}
                        label={category.label}
                        description={category.description}
                        icon={category.icon}
                        boxedBG={category.iconBg}
                        isSelected={selected === category.value}
                        onSelect={setSelected}
                    />
                ))}
            </div>
        </section>
    )
}

export default SelectCategory