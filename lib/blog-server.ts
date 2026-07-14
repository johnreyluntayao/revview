import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  BLOG_POST_SELECT,
  BLOG_PREVIEW_SELECT,
  type BlogPost,
  type BlogPostPreview,
} from "@/lib/blog";

const nowIso = () => new Date().toISOString();

export const getPublishedBlogPosts = cache(
  async (limit?: number): Promise<BlogPostPreview[]> => {
    const supabase = await createClient();
    let query = supabase
      .from("blog_posts")
      .select(BLOG_PREVIEW_SELECT)
      .eq("status", "published")
      .lte("published_at", nowIso())
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Unable to load published blog posts:", error.message);
      return [];
    }

    return (data ?? []) as BlogPostPreview[];
  },
);

export const getPublishedBlogPost = cache(
  async (slug: string): Promise<BlogPost | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_POST_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", nowIso())
      .maybeSingle();

    if (error) {
      console.error("Unable to load blog post:", error.message);
      return null;
    }

    return (data as BlogPost | null) ?? null;
  },
);
