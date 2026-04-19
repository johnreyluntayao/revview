"use client";

import { motion, easeOut } from "framer-motion";
import { Button, Chip } from "@/lib/client-imports";
import CountdownCard from "./CountdownCard";
import { BeginQuiz, Sparkles } from "@/lib/icons";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
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

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: easeOut,
    },
  },
};

const HeroSection = () => {
  return (
    <section>
      <div
        className="w-full min-h-screen
        grid grid-cols-1 lg:grid-cols-2 
        bg-linear-to-r from-hero1 to-hero2
        mt-16 items-center
        py-12 md:py-20 lg:py-24
        px-4 md:px-6 lg:px-8
        gap-8"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="justify-start text-white text-center lg:text-left"
        >
          <div className="space-y-3.5 md:space-y-4 lg:space-y-4.5">

            <motion.div variants={fadeUp}>
              <Chip
                text="Welcome to Revview"
                leftIcon={
                  <Sparkles
                    size={16}
                    strokeWidth={1}
                    className="text-yellow-300"
                    fill="currentColor"
                  />
                }
                className=" uppercase border border-primary/30 bg-primary/20 tracking-widest text-[#BFDBFE]"
              />
            </motion.div>

            <div className="tracking-wide">
              <motion.h1
                variants={fadeUp}
                className="text-[36px] md:text-5xl lg:text-6xl font-black"
              >
                Master your
              </motion.h1>

              <motion.h1
                variants={fadeScale}
                className="inline-block text-[36px] md:text-5xl lg:text-6xl font-black bg-linear-to-r from-text1 via-text2 to-text3 bg-clip-text text-transparent"
              >
                Board Exam
              </motion.h1>
            </div>
          </div>
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg lg:text-xl text-white/80 mt-6 md:mt-7 lg:mt-8"
          >
            The most intelligent online reviewer platform featuring adaptive
            learning algorithms, comprehensive analytics, and real-time feedback
            to accelerate your exam preparation.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row gap-2 md:gap-3 lg:gap-4 items-center justify-center lg:justify-start mt-6 md:mt-8 lg:mt-12"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                text="Get Started Free"
                backgroundColor="bg-primary"
                textColor="text-white"
                rightIcon={<BeginQuiz />}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                text="Learn More"
                borderColor="border border-primary"
                textColor="text-white"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            className="flex mt-8 md:mt-10 lg:mt-12 text-center lg:text-start justify-center lg:justify-start"
          >
            <motion.div
              variants={fadeUp}
              className="flex-1 px-0 lg:px-3 py-0 border-l-none lg:border-l-4 border-primary300 space-y-2 md:space-y-2.5 lg:space-y-3"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary300">
                Expert
              </h1>
              <p className="block text-[10px] md:text-xs lg:text-sm text-white/80">
                Crafted Content
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex-1 px-0 lg:px-3 py-0 border-l-none lg:border-l-4 border-purple300 space-y-2 md:space-y-2.5 lg:space-y-3"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple300">
                100+
              </h1>
              <p className="block text-[10px] md:text-xs lg:text-sm text-white/80">
                Practice Questions
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex-1 px-0 lg:px-3 py-0 border-l-none lg:border-l-4 border-cyan400 space-y-2 md:space-y-2.5 lg:space-y-3"
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan400">
                Realistic
              </h1>
              <p className="block text-[10px] md:text-xs lg:text-sm text-white/80">
                Exam Simulation
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={slideRight}
          initial="hidden"
          animate="show"
          className="flex items-center justify-center"
        >
          <CountdownCard
            targetDate="August 15, 2026"
            message="Exam Day is Approaching!"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;