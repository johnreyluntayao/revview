"use client";

import { motion, easeOut } from "framer-motion";
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

const WhyChoose = () => {
  return (
    <section id="why-revview" className="scroll-mt-16 lg:scroll-mt-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="w-full flex flex-col items-center justify-center py-7.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-32 gap-8 md:gap-12 lg:gap-16"
      >

        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4">
          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground"
          >
            Why Choose RevView?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-xs md:text-base lg:text-xl text-muted-foreground text-center"
          >
            Everything you need to prepare for the Philippine CSE-PPT in one focused platform
          </motion.p>
        </div>

        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
        >
          {featureCards.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              <Card
                variant="compact"
                icon={feature.icon}
                title={feature.title}
                value={feature.description}
                className="h-full flex flex-col justify-between items-start"
                bg="bg-linear-to-br from-primary/70 to-secondary/70"
                textColor="text-white"
                iconColor="text-white"
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WhyChoose;
