"use client";

import { motion, easeOut } from "framer-motion";
import { Chip, Carousel } from "@/lib/client-imports";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Affiliate } from "@/lib/types";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";

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
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAffiliates() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("affiliate")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching affiliates:", error);
      } else {
        setAffiliates(data || []);
      }
      setLoading(false);
    }

    fetchAffiliates();
  }, []);

  if (loading) {
    return (
      <section id="products" className="scroll-mt-16 lg:scroll-mt-20">
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

            <motion.h2
              variants={fadeUp}
              className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground mb-2 md:mb-3 lg:mb-4 text-center"
            >
              Boost Your Preparation
            </motion.h2>

            <motion.p
              variants={fadeUp}
              className="text-xs md:text-base lg:text-xl text-muted-foreground text-center"
            >
              Curated study materials and courses from trusted providers
            </motion.p>
          </div>

          <div className="w-full h-96 flex items-center justify-center">
            <p className="text-muted-foreground">Loading resources...</p>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="products" className="scroll-mt-16 lg:scroll-mt-20">
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

          <motion.h2
            variants={fadeUp}
            className="text-2xl md:text-[32px] lg:text-5xl font-bold text-foreground mb-2 md:mb-3 lg:mb-4 text-center"
          >
            Boost Your Preparation
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-xs md:text-base lg:text-xl text-muted-foreground text-center"
          >
            Curated study materials and courses from trusted providers
          </motion.p>
        </div>

        <motion.div variants={fadeUp} className="w-full">
          <Carousel cards={affiliates} />
        </motion.div>

        <motion.div variants={fadeUp}>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 md:px-6 md:text-base"
          >
            Explore all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BoostPreparation;
