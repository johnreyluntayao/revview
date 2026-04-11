import { Card, List } from "@/lib/client-imports";

const steps = [
  {
    stepNumber: "1",
    title: "Sign In",
    description: "Create your account with Google or email and set up your profile.",
    image: "/steps/image 1.svg",
  },
  {
    stepNumber: "2",
    title: "Customize Your Quiz",
    description: "Choose categories, difficulty level, and number of questions.",
    image: "/steps/image 2.svg",
  },
  {
    stepNumber: "3",
    title: "Take the Quiz",
    description: "Answer questions with real-time timer and immediate feedback.",
    image: "/steps/image 3.svg",
  },
  {
    stepNumber: "4",
    title: "Learn & Improve",
    description: "Review answers, track progress, and improve systematically.",
    image: "/steps/image 4.svg",
  },
];

const HowItWorks = () => {
  return (
    <section>
      <div className="w-full flex flex-col items-center justify-center text-pretty gap-4 md:gap-6 lg:gap-8 py-7.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-32">
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
          <h1 className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground">
            How It Works
          </h1>
          <p className="text-xs md:text-base lg:text-xl text-muted-foreground text-center">
            Simple 4-step process to ace your exam
          </p>
        </div>

         <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
        <Card
          key={index}
          variant="step"
          title={step.stepNumber}     // shows in the blue circle
          value={step.title}          // main bold heading
          subValue={step.description}
          image={step.image}
          imageAlt={`${step.title} illustration`}
          className="h-full"          // makes all cards same height
        />
        
      ))}
      </div>
      </div>
    </section>
  );
};

export default HowItWorks;
