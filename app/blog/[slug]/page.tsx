import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogCard from "@/components/atoms/BlogCard";
import Chip from "@/components/atoms/Chip";
import BlogContent from "@/components/ui/BlogContent";
import { Footer, NavBar } from "@/lib/client-imports";
import { ArrowLeft, Calendar, StudyTime, User2 } from "@/lib/icons";
import {
  blogPublishedAt,
  formatBlogDate,
  getReadingTime,
} from "@/lib/blog";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/blog-server";

const baseUrl = "https://revview.online";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug);

  if (!post) return { title: "Guide not found" };

  const title = post.seo_title || post.title;
  const description = post.seo_description || post.excerpt;
  const image = post.cover_image_url || "/opengraph-image";

  return {
    title,
    description,
    authors: [{ name: post.author_name }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title,
      description,
      publishedTime: post.published_at || post.created_at,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      images: [{ url: image, alt: post.cover_image_alt || post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPublishedBlogPost(slug),
    getPublishedBlogPosts(5),
  ]);

  if (!post) notFound();

  const publishedAt = blogPublishedAt(post);
  const relatedPosts = allPosts.filter((candidate) => candidate.id !== post.id).slice(0, 3);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo_description || post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : [`${baseUrl}/opengraph-image`],
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    author: { "@type": "Organization", name: post.author_name },
    publisher: {
      "@type": "Organization",
      name: "RevView",
      logo: { "@type": "ImageObject", url: `${baseUrl}/Long-logo.svg` },
    },
  };

  return (
    <>
      <NavBar State="Default" title="RevView Learning Hub" />
      <main className="min-h-screen overflow-x-hidden bg-background pt-16 lg:pt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <article>
          <header className="bg-slate-50 px-4 py-8 sm:py-10 md:px-6 md:py-14 lg:px-8 lg:py-16">
            <div className="mx-auto max-w-4xl">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                <ArrowLeft className="h-4 w-4" />
                Back to all guides
              </Link>

              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8">
                <Chip text={post.category} className="bg-primary/10 text-primary" />
                {post.featured ? <Chip text="Featured" className="bg-secondary/10 text-secondary" /> : null}
              </div>

              <h1 className="mt-5 text-[1.75rem] font-extrabold leading-[1.14] tracking-tight text-foreground sm:text-3xl md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base md:mt-5 md:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-6 grid gap-3 text-xs text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-x-5 sm:text-sm md:mt-7">
                <span className="inline-flex items-center gap-2">
                  <User2 className="h-4 w-4" /> {post.author_name}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> {formatBlogDate(publishedAt)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <StudyTime className="h-4 w-4" /> {getReadingTime(post.content)} min read
                </span>
              </div>
            </div>
          </header>

          {post.cover_image_url ? (
            <div className="px-4 pt-5 sm:px-6 sm:pt-7 lg:px-8 lg:pt-8">
              <div className="relative mx-auto aspect-[4/3] max-w-6xl overflow-hidden rounded-xl bg-muted shadow-xl sm:aspect-video sm:rounded-2xl md:aspect-[16/7]">
                <Image
                  src={post.cover_image_url}
                  alt={post.cover_image_alt || post.title}
                  fill
                  priority
                  sizes="(min-width: 1280px) 1152px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}

          <div className="mx-auto max-w-3xl px-4 py-10 sm:py-12 md:px-6 md:py-16 lg:py-20">
            <BlogContent content={post.content} />
          </div>
        </article>

        {relatedPosts.length ? (
          <section className="border-t border-border bg-slate-50 px-4 py-12 md:px-6 md:py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">Continue learning</h2>
              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
