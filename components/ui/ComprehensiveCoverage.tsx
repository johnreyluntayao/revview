"use client";

import {
  Analytical,
  CustomQuiz,
  General,
  Numerical,
  Verbal,
} from "@/lib/icons";
import { List } from "@/lib/client-imports";

const categoryCoverage = [
  {
    title: "Numerical Ability",
    icon: <Numerical />,
    background: "bg-gradient-to-r from-primary/90 to-primary/60",
    items: [
      { label: "Basic operations" },
      { label: "Word problems" },
      { label: "Quick calculations" },
    ],
  },
  {
    title: "Analytical Ability",
    icon: <Analytical />,
    background: "bg-violet-700",
    items: [
      { label: "Word association" },
      { label: "Logic & reasoning" },
      { label: "Data interpretation" },
    ],
  },
  {
    title: "Verbal Ability",
    icon: <Verbal />,
    background: "bg-green-700",
    items: [
      { label: "Grammar & usage" },
      { label: "Vocabulary" },
      { label: "Reading comprehension" },
    ],
  },
  {
    title: "General Information",
    icon: <General />,
    background: "bg-orange-700",
    items: [
      { label: "Philippine Constitution" },
      { label: "Code of Conduct" },
      { label: "Peace & Human Rights" },
    ],
  },
];

const ComprehensiveCoverage = () => {
  return (
    <section>
      <div className="w-full flex flex-col justify-center text-pretty gap-4 md:gap-6 lg:gap-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-10 text-center">
          Comprehensive Coverage
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-6 px-0 lg:px-16">
          {categoryCoverage.map((category) => (
            <div
              key={category.title}
              className="w-full p-4 md:p-5 lg:p-6 bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden border border-border"
            >
              <div
                className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center mb-4 ${category.background}`}
              >
                <text className="text-white text-sm md:text-base lg:text-lg">
                  {category.icon}
                </text>
              </div>
              <h2 className="text-base md:text-lg lg:text-xl font-bold text-foreground mb-2 md:mb-3 lg:mb-4">
                {category.title}
              </h2>
              <div className="pl-1 md:pl-1.5 lg:pl-2 py-1 md:py-1.5 lg:py-0 text-sm md:text-base">
                <List
                  items={category.items}
                  isNumberedList={false}
                  sharedIcon={<CustomQuiz className="text-primary" />}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComprehensiveCoverage;
