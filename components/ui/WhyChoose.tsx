import { Card } from "@/lib/client-imports";
import {
  CustomQuiz,
  InstantFeedback,
  ProgressTracking,
  AllCategories,
} from "@/lib/icons";

const featureCards = [
  {
    icon: (
      <InstantFeedback
        className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12"
        strokeWidth={1.8}
      />
    ),
    title: "Instant Feedback",
    description:
      "Get immediate answers and detailed explanations for every question.",
  },
  {
    icon: (
      <ProgressTracking
        className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12"
        strokeWidth={1.8}
      />
    ),
    title: "Progress Tracking",
    description:
      "Monitor your improvement across all categories with detailed analytics.",
  },
  {
    icon: (
      <AllCategories
        className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12"
        strokeWidth={1.8}
      />
    ),
    title: "All Categories",
    description:
      "Complete coverage of Numerical, Analytical, Verbal, and General Information.",
  },
  {
    icon: (
      <CustomQuiz
        className="w-6 h-6 md:w-8 md:h-10 lg:w-12 lg:h-12"
        strokeWidth={1.8}
      />
    ),
    title: "Customizable Quizzes",
    description:
      "Choose difficulty, number of questions, and specific categories.",
  },
];

const WhyChoose = () => {
  return (
    <section>
      <div className="w-full h-[75vh] flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 gap-4 md:gap-6 lg:gap-8">
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Why Choose <span className="text-primary">RevView</span>?
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
            Everything you need for successful exam preparation in one platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-12 ">
          {featureCards.map((feature, idx) => (
            <Card
              key={idx}
              variant="compact"
              icon={feature.icon}
              title={feature.title}
              value={feature.description}
              className="h-auto lg:h-64 flex flex-col justify-between items-start"
              bg="bg-linear-to-br from-primary/70 to-secondary/70"
              textColor="text-white"
              iconColor="text-white"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
