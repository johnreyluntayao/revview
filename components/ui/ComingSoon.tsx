import { Card, Chip } from "@/lib/client-imports";
import React from "react";

const futureCards = [
  {
    icon: <span>👩‍🏫</span>,
    value: "Licensure Examination for Teachers (LET)",
    subValue: "Comprehensive prep for education professionals",
  },
  {
    icon: <span>📋</span>,
    value: "Civil Service Examination (CSE)",
    subValue: "Professional and Sub-Professional levels preparation",
  },
  {
    icon: <span>🏛️</span>,
    value: "Board Examination for Professional Teachers",
    subValue: "Advanced review materials and mock exams",
  },
  {
    icon: <span>🎓</span>,
    value: "LET Masterclass Series",
    subValue: "Live sessions with top educators and examiners",
  },
];

const ComingSoon = () => {
  return (
    <section>
      <div className="bg-primary/10 w-full flex flex-col items-center justify-center text-pretty gap-4 md:gap-6 lg:gap-8 py-7.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-32">
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
          <Chip
            text="Expanding Soon"
            className="py-2"
            variant="product"
            leftIcon={<span>🚀</span>}
          />
          <h1 className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground">
            More Exams Coming Soon
          </h1>
          <p className="text-xs md:text-base lg:text-xl text-muted-foreground text-center">
            We're expanding to help more professionals achieve their goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-6 w-full">
          {futureCards.map((card, index) => (
              <Card
                key={index}
                variant="soon"                    // ← Use "future" variant
                icon={card.icon}
                badge="Coming Soon"
                value={card.value}
                subValue={card.subValue}
              />
            ))}
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
