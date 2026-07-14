import type { Metadata } from "next";
import BlogExplorer from "@/components/ui/BlogExplorer";
import { Footer, NavBar } from "@/lib/client-imports";
import { getPublishedBlogPosts } from "@/lib/blog-server";

export const metadata: Metadata = {
  title: "Civil Service Exam Guides & Study Tips",
  description:
    "Explore practical Civil Service Exam study guides, preparation strategies, coverage explainers, and learning tips from RevView.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Civil Service Exam Guides & Study Tips | RevView",
    description:
      "Practical study guides and preparation strategies to help you approach the Civil Service Exam with confidence.",
  },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <NavBar State="Default" title="RevView Learning Hub" />
      <main className="min-h-screen overflow-x-hidden bg-slate-50 pt-16 lg:pt-20">
        <section className="relative overflow-hidden bg-linear-to-br from-primary950 via-primary800 to-purple900 px-4 py-12 text-white sm:py-14 md:px-6 md:py-20 lg:px-8 lg:py-24">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan400/15 blur-3xl" />
          <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-purple400/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan200 md:text-sm">
              Learn with purpose
            </p>
            <h1 className="mt-4 text-[1.75rem] font-extrabold leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
              Clear guidance for smarter exam preparation
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 md:text-lg">
              Study strategies, coverage explainers, and practical advice designed for Civil Service Exam learners.
            </p>
          </div>
        </section>

        <section className="px-4 py-8 sm:py-10 md:px-6 md:py-14 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-7xl">
            {posts.length ? (
              <BlogExplorer posts={posts} />
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white px-5 py-14 text-center shadow-sm sm:px-6 sm:py-20">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">Guides are coming soon</h2>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                  We are preparing useful Civil Service Exam resources. Check back soon for the first RevView guide.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
