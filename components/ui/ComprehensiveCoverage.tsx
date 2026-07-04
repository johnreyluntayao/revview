"use client";

import { motion, easeOut } from "framer-motion";
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
    background: "bg-primary",
    items: [
      { label: "Basic operations" },
      { label: "Word problems" },
      { label: "Quick calculations" },
      { label: "Percentage & ratios" },
    ],
  },
  {
    title: "Analytical Ability",
    icon: <Analytical />,
    background: "bg-secondary",
    items: [
      { label: "Word association" },
      { label: "Logic & reasoning" },
      { label: "Data interpretation" },
      { label: "Pattern recognition" },
    ],
  },
  {
    title: "Verbal Ability",
    icon: <Verbal />,
    background: "bg-success",
    items: [
      { label: "Grammar & usage" },
      { label: "Vocabulary" },
      { label: "Reading comprehension" },
      { label: "Academic writing" },
    ],
  },
  {
    title: "General Information",
    icon: <General />,
    background: "bg-warning",
    items: [
      { label: "Philippine Constitution" },
      { label: "Code of Conduct" },
      { label: "Peace & Human Rights" },
      { label: "Random Questions" },
    ],
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

const ComprehensiveCoverage = () => {
  return (
    <section id="coverage" className="scroll-mt-16 lg:scroll-mt-20">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="w-full flex flex-col justify-center text-pretty py-8.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-32 gap-8 md:gap-12 lg:gap-16 bg-primary/5"
      >
        <div className="flex flex-col items-center gap-2 md:gap-3 lg:gap-4 text-center">
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground"
          >
            Comprehensive Coverage
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base lg:text-xl text-muted-foreground text-center"
          >
            Master all four exam categories with detailed content and practice
          </motion.p>
        </div>

        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6"
        >
          {categoryCoverage.map((category) => (
            <motion.div
              key={category.title}
              variants={fadeUp}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="flex-1 p-4 md:p-5 lg:p-6 bg-linear-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden border border-border"
            >
              <div
                className={`text-white w-10 md:w-11 lg:w-12 text-base md:text-xl lg:text-2xl p-2.5 md:p-2.75 lg:p-3 rounded-lg flex items-center justify-center mb-4 md:mb-5 lg:mb-6 ${category.background}`}
              >
                {category.icon}
              </div>

              <h2 className="text-base md:text-xl lg:text-2xl font-bold text-foreground mb-2 md:mb-3 lg:mb-4">
                {category.title}
              </h2>

              <div className="pl-1 md:pl-1.5 lg:pl-2">
                <List
                  items={category.items}
                  isNumberedList={false}
                  sharedIcon={
                    <CustomQuiz className="text-primary h-auto w-4 md:w-5 lg:w-6" />
                  }
                  className="space-y-2 md:space-y-2.5 lg:space-y-3"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ComprehensiveCoverage;
