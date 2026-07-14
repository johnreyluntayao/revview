"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { easeOut, motion } from "framer-motion";
import Chip from "@/components/atoms/Chip";
import { ArrowRight, Calendar, StudyTime } from "@/lib/icons";
import {
  BLOG_PREVIEW_SELECT,
  blogPublishedAt,
  formatBlogDate,
  getReadingTime,
  type BlogPostPreview,
} from "@/lib/blog";
import { createClient } from "@/lib/supabase/client";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

export default function LatestArticles() {
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("blog_posts")
        .select(BLOG_PREVIEW_SELECT)
        .eq("status", "published")
        .lte("published_at", new Date().toISOString())
        .order("featured", { ascending: false })
        .order("published_at", { ascending: false })
        .limit(3);

      if (!cancelled) {
        setPosts((data ?? []) as BlogPostPreview[]);
        setLoading(false);
      }
    };

    void loadPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const gridWidth =
    posts.length === 1
      ? "mx-auto max-w-md"
      : posts.length === 2
        ? "mx-auto max-w-4xl md:grid-cols-2"
        : "mx-auto max-w-7xl md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      id="blog"
      className="scroll-mt-16 overflow-hidden bg-primary/5 px-4 py-10 md:scroll-mt-20 md:px-6 md:py-16 lg:px-8 lg:py-24"
    >
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
        className="mx-auto max-w-7xl"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div variants={fadeUp}>
            <Chip
              text="RevView Learning Hub"
              variant="product"
              leftIcon={<span aria-hidden="true">✦</span>}
            />
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="mt-3 text-2xl font-bold leading-tight text-foreground md:text-[32px] lg:text-5xl"
          >
            Learn smarter with practical exam guides
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-3 text-xs leading-relaxed text-muted-foreground md:text-base lg:mt-4 lg:text-xl"
          >
            Clear strategies, study techniques, and focused advice to help you prepare with confidence.
          </motion.p>
        </div>

        {loading ? (
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 md:mt-12 md:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className={`overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${
                  item === 2 ? "md:col-span-2 md:mx-auto md:w-full md:max-w-md lg:col-span-1 lg:max-w-none" : ""
                }`}
              >
                <div className="aspect-[16/9] animate-pulse bg-primary/10" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length ? (
          <motion.div
            variants={container}
            className={`mt-8 grid gap-4 md:mt-12 lg:mt-16 lg:gap-6 ${gridWidth}`}
          >
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-primary/10 ${
                  posts.length === 3 && index === 2
                    ? "md:col-span-2 md:mx-auto md:w-full md:max-w-md lg:col-span-1 lg:max-w-none"
                    : ""
                }`}
              >
                <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-linear-to-br from-primary900 to-purple900">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.cover_image_alt || post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-end p-5">
                      <span className="text-lg font-bold text-white/90">Learn with RevView</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip text={post.category || "Study Guides"} className="bg-primary/10 text-primary" />
                    {post.featured ? <Chip text="Featured" className="bg-secondary/10 text-secondary" /> : null}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="mt-4 focus-visible:rounded-md">
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatBlogDate(blogPublishedAt(post))}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <StudyTime className="h-3.5 w-3.5" />
                      {getReadingTime(post.content)} min read
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={fadeUp}
            className="mx-auto mt-8 max-w-2xl rounded-2xl border border-dashed border-primary/25 bg-background/80 px-5 py-10 text-center md:mt-12 md:px-8 md:py-12"
          >
            <h3 className="text-lg font-bold text-foreground md:text-xl">Fresh learning guides are on the way</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Visit the Learning Hub for Civil Service Exam resources as soon as they are published.
            </p>
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="mt-8 flex justify-center md:mt-10 lg:mt-12">
          <Link
            href="/blog"
            className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90 md:px-6 md:text-base"
          >
            Explore the Learning Hub
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
