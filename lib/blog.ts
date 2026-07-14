export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  author_id: string | null;
  author_name: string;
  status: BlogPostStatus;
  featured: boolean;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogPostPreview = Pick<
  BlogPost,
  | "id"
  | "title"
  | "slug"
  | "excerpt"
  | "category"
  | "cover_image_url"
  | "cover_image_alt"
  | "author_name"
  | "featured"
  | "published_at"
  | "created_at"
  | "content"
>;

export const BLOG_POST_SELECT =
  "id,title,slug,excerpt,content,category,cover_image_url,cover_image_alt,author_id,author_name,status,featured,published_at,seo_title,seo_description,created_at,updated_at";

export const BLOG_PREVIEW_SELECT =
  "id,title,slug,excerpt,content,category,cover_image_url,cover_image_alt,author_name,featured,published_at,created_at";

export function slugifyBlogTitle(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function getReadingTime(content: string) {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 220));
}

export function formatBlogDate(value: string | null | undefined) {
  if (!value) return "Not published";

  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function blogPublishedAt(post: Pick<BlogPost, "published_at" | "created_at">) {
  return post.published_at ?? post.created_at;
}
