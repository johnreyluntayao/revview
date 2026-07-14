import Image from "next/image";
import Link from "next/link";
import Chip from "@/components/atoms/Chip";
import { ArrowRight, Calendar, StudyTime } from "@/lib/icons";
import {
  blogPublishedAt,
  formatBlogDate,
  getReadingTime,
  type BlogPostPreview,
} from "@/lib/blog";

interface BlogCardProps {
  post: BlogPostPreview;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/8 ${
        featured ? "lg:grid lg:grid-cols-[1.08fr_0.92fr]" : "flex h-full flex-col"
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`relative block overflow-hidden bg-linear-to-br from-primary900 via-primary700 to-secondary ${
          featured ? "aspect-[16/10] min-h-56 sm:min-h-64 lg:aspect-auto lg:min-h-full" : "aspect-[16/10]"
        }`}
        aria-label={`Read ${post.title}`}
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt || post.title}
            fill
            sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-6">
            <span className="max-w-xs text-2xl font-extrabold leading-tight text-white/90">
              Learn with RevView
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
      </Link>

      <div className={`flex min-w-0 flex-1 flex-col ${featured ? "p-5 sm:p-6 md:p-8 lg:p-10" : "p-4 sm:p-5 md:p-6"}`}>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Chip
            text={post.category || "Study Guides"}
            className="bg-primary/10 text-primary"
          />
          {post.featured ? (
            <Chip text="Featured" className="bg-secondary/10 text-secondary" />
          ) : null}
        </div>

        <Link href={`/blog/${post.slug}`} className="focus-visible:rounded-md">
          <h2
            className={`font-bold leading-tight text-foreground transition-colors group-hover:text-primary ${
              featured ? "text-xl sm:text-2xl md:text-3xl" : "line-clamp-2 text-lg md:text-xl"
            }`}
          >
            {post.title}
          </h2>
        </Link>

        <p className={`mt-3 leading-relaxed text-muted-foreground ${featured ? "text-sm md:text-base" : "line-clamp-3 text-sm"}`}>
          {post.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatBlogDate(blogPublishedAt(post))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <StudyTime className="h-3.5 w-3.5" />
            {getReadingTime(post.content)} min read
          </span>
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary"
        >
          Read article
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
