"use client";

import { motion, easeOut } from "framer-motion";
import { Button } from "@/lib/client-imports";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
};

const Contact = () => {
  const router = useRouter();

  const handleStartReviewing = () => {
    router.push("/quiz-selection");
  };

  return (
    <section className="w-full">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={scaleIn}
        className="w-full h-[50vh] flex flex-col bg-linear-to-r from-hero1 to-hero2 text-white items-center justify-center text-center text-pretty gap-4 md:gap-6 lg:gap-8 px-8 md:px-10 lg:px-12"
      >
        <motion.div variants={container} className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8">
          
          <motion.h1
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-primary-foreground"
          >
            Ready to Ace your Exam?
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-sm md:text-base lg:text-lg text-primary50"
          >
            Start your free preparation journey today. No credit card required.
          </motion.p>

          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <Button
              text="Start Reviewing Now"
              textColor={"text-primary-foreground"}
              backgroundColor={"bg-linear-to-r from-primary/80 to-secondary/80"}
              rightIcon={<ArrowRightIcon />}
              onClick={handleStartReviewing}
            />
          </motion.div>

        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;