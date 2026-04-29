"use client";

import { motion, easeOut } from "framer-motion";
import { Card } from "@/lib/client-imports";

const steps = [
  {
    stepNumber: "1",
    title: "Sign In",
    description:
      "Create your account with Google or email and set up your profile.",
    image: "/steps/image 1.svg",
  },
  {
    stepNumber: "2",
    title: "Customize Your Quiz",
    description:
      "Choose categories, difficulty level, and number of questions.",
    image: "/steps/image 2.svg",
  },
  {
    stepNumber: "3",
    title: "Take the Quiz",
    description:
      "Answer questions with real-time timer and immediate feedback.",
    image: "/steps/image 3.svg",
  },
  {
    stepNumber: "4",
    title: "Learn & Improve",
    description:
      "Review answers, track progress, and improve systematically.",
    image: "/steps/image 4.svg",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const HowItWorks = () => {
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="w-full flex flex-col items-center justify-center text-pretty gap-8 md:gap-12 lg:gap-16 py-7.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-32"
      >
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground"
          >
            How It Works
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base lg:text-xl text-muted-foreground text-center"
          >
            Simple 4-step process to ace your exam
          </motion.p>
        </div>

        <motion.div
          variants={container}
          className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Card
                variant="step"
                title={step.stepNumber}
                value={step.title}
                subValue={step.description}
                image={step.image}
                imageAlt={`${step.title} illustration`}
                subColor="bg-linear-to-br from-primary to-secondary"
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorks;