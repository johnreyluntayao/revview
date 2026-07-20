"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/lib/client-imports";
import { ArrowRight, Sparkles } from "@/lib/icons";
import { useRouter } from "next/navigation";

const Contact = () => {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  return (
    <section id="contact" className="relative isolate w-full overflow-hidden bg-linear-to-br from-hero1 via-hero2 to-purple950 px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 size-72 rounded-full bg-primary/30 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, 45, 0], y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 size-80 rounded-full bg-secondary/25 blur-3xl"
        animate={reduceMotion ? undefined : { x: [0, -35, 0], y: [0, 40, 0], scale: [1.1, 0.95, 1.1] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
        }}
        className="relative mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary100 backdrop-blur"
        >
          <Sparkles className="size-4 text-warning" /> Your next step
        </motion.div>

        <motion.div
          aria-hidden="true"
          variants={{
            hidden: { width: 0, opacity: 0 },
            visible: { width: 72, opacity: 1, transition: { duration: 0.55 } },
          }}
          className="mt-6 h-1 rounded-full bg-linear-to-r from-primary400 to-purple400"
        />

        <motion.h2
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 28, filter: reduceMotion ? "blur(0px)" : "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="mt-6 text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl"
        >
          Ready to ace your exam?
        </motion.h2>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
          }}
          className="mt-4 max-w-2xl text-sm leading-7 text-primary100 sm:text-base lg:text-lg"
        >
          Build a focused review session, track your progress, and prepare with confidence. No credit card required.
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: reduceMotion ? 0 : 18, scale: reduceMotion ? 1 : 0.94 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
          }}
          whileHover={reduceMotion ? undefined : { y: -3 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          className="mt-8 w-full sm:w-auto"
        >
          <Button
            text="Start reviewing now"
            textColor="text-primary-foreground"
            backgroundColor="bg-linear-to-r from-primary to-secondary"
            rightIcon={<ArrowRight className="size-4" />}
            onClick={() => router.push("/quiz-selection")}
            className="min-h-12 w-full px-6 font-semibold shadow-xl shadow-primary/20 sm:w-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
