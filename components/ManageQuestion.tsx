"use client";

import { useState } from "react";
import { Button, Card, Chip, ComboBox, InputField } from "@/lib/imports";
import { Add, Delete, Edit, Search } from "@/lib/icons";

const questionsData = [
    {
        question: "What is the result of 25 × 4?",
        category: "Numerical",
        answer: "B",
        added: "Jan 20, 2024",
    },
    {
        question: "Which word means 'to make or become bitter'?",
        category: "Verbal",
        answer: "A",
        added: "Jan 18, 2024",
    },
    {
        question: "As a teacher is to students, a doctor is to ___",
        category: "Analytical",
        answer: "A",
        added: "Jan 17, 2024",
    },
    {
        question: "If a train travels 240 km in 4 hours, what is its average speed?",
        category: "Numerical",
        answer: "C",
        added: "Jan 16, 2024",
    },
    {
        question: "The Philippine Constitution was ratified in what year?",
        category: "General",
        answer: "D", // corrected / example
        added: "Jan 15, 2024",
    },
];

export default function ManageQuestion() {
    // Set the first item as default selected value
    const [selectedCategory, setSelectedCategory] = useState("All Category");
    const [selectedTime, setSelectedTime] = useState("All Time");

    const selectCategory = [
        "All Category",
        "English",
        "Math",
        "Science"
    ];

    const selectTime = ["All Time", "5 minutes", "10 minutes", "15 minutes"];

    return (
        <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="m-4 md:m-6 lg:m-8 gap-4 md:gap-6 lg:gap-8 flex flex-col">
                <Button
                    text="Add New Question"
                    backgroundColor="bg-linear-to-r from-primary to-secondary"
                    textColor="text-white"
                    className="w-fit"
                    leftIcon={<Add />}
                />

                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 md:gap-6">

                    <div className="w-full lg:flex-1 min-w-0">
                        <InputField
                            icon={<Search />}
                            placeholder="Search questions..."
                            className="w-full"
                        />
                    </div>

                    <div className="w-full lg:w-40 lg:min-w-40">
                        <ComboBox
                            placeholder="All Categories"
                            options={selectCategory}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            isSearchable={false}
                        />
                    </div>

                    <div className="w-full lg:w-40 lg:min-w-40">
                        <ComboBox
                            placeholder="All Time"
                            options={selectTime}
                            value={selectedTime}
                            onChange={setSelectedTime}
                            isSearchable={false}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border bg-card shadow-sm">
                    <div className="grid grid-cols-[3fr_1fr_100px_1fr_120px] divide-y divide-border">
                        {/* Header row */}
                        <div className="contents text-xs md:text-sm lg:text-base">
                            <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">
                                Question
                            </div>
                            <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">
                                Category
                            </div>
                            <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">
                                Answer
                            </div>
                            <div className="bg-muted/40 font-semibold text-foreground py-3.5 px-5 flex items-center">
                                Added
                            </div>
                            <div className="bg-muted/40 font-semibold text-foreground px-5 flex text-left items-center ">
                                Actions
                            </div>
                        </div>

                        {/* Data rows */}
                        {questionsData.map((item, index) => (
                            <div
                                key={index}
                                className="contents group hover:bg-muted/20 transition-colors"
                            >
                                <div className="py-4 px-5 text-sm text-foreground flex items-center line-clamp-2">
                                    {item.question}
                                </div>
                                <div className="py-4 px-5 flex items-center">
                                    <Chip
                                        text={item.category}
                                        variant={item.category.toLowerCase() as any}
                                    />
                                </div>
                                <div className="py-4 px-5 text-center text-sm font-semibold text-primary flex items-center justify-center">
                                    {item.answer}
                                </div>
                                <div className="py-4 px-5 text-sm text-muted-foreground flex items-center">
                                    {item.added}
                                </div>
                                <div className="py-4 px-5 flex items-center justify-end gap-2">
                                    <Button
                                        leftIcon={<Edit size={16} />} className="bg-primary/30 text-primary"
                                    />
                                    <Button
                                        
                                        leftIcon={<Delete size={16} />} className="bg-destructive/30 text-destructive"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}