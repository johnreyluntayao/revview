"use client";

import { motion, easeOut } from "framer-motion";
import { Chip, Carousel } from "@/lib/client-imports";

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

const BoostPreparation = () => {
  return (
    <section>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="bg-primary/10 w-full flex flex-col items-center justify-center text-pretty gap-8 md:gap-12 lg:gap-16 py-7.5 md:py-15 lg:py-22.5"
      >
        <div className="flex flex-col items-center">
          <motion.div variants={fadeUp}>
            <Chip
              text="Recommended Resources"
              className="mb-1 md:mb-1.5 lg:mb-2"
              variant="product"
              leftIcon={<span>📚</span>}
            />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground mb-2 md:mb-3 lg:mb-4 text-center"
          >
            Boost Your Preparation
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xs md:text-base lg:text-xl text-muted-foreground text-center"
          >
            Curated study materials and courses from trusted providers
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          className="w-full"
        >
          <Carousel />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BoostPreparation;