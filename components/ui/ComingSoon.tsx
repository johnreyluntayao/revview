"use client";

import { motion, easeOut } from "framer-motion";
import { Card, Chip } from "@/lib/client-imports";

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

// Container stagger
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Fade up
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

const ComingSoon = () => {
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="w-full flex flex-col items-center justify-center text-pretty gap-8 md:gap-12 lg:gap-16 py-7.5 md:py-15 lg:py-22.5 px-4 md:px-6 lg:px-32"
      >
        {/* Header */}
        <div className="flex flex-col items-center">
          <motion.div variants={fadeUp}>
            <Chip
              text="Expanding Soon"
              className="mb-1 md:mb-1.5 lg:mb-2"
              variant="product"
              leftIcon={<span>🚀</span>}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground mb-2 md:mb-3 lg:mb-4 text-center"
          >
            More Exams Coming Soon
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xs md:text-base lg:text-xl text-muted-foreground text-center"
          >
            We're expanding to help more professionals achieve their goals
          </motion.p>
        </div>

        {/* Cards */}
        <motion.div
          variants={container}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 lg:gap-6 w-full"
        >
          {futureCards.map((card, index) => (
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
                variant="soon"
                icon={card.icon}
                badge="Coming Soon"
                value={card.value}
                subValue={card.subValue}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ComingSoon;