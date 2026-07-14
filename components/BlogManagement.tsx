"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import Button from "@/components/atoms/Button";
import Chip from "@/components/atoms/Chip";
import InputField from "@/components/atoms/InputField";
import InsertImage from "@/components/atoms/InsertImage";
import Modal from "@/components/atoms/Modal";
import { Add, Calendar, Delete, Edit, Eye, Search } from "@/lib/icons";
import {
  BLOG_POST_SELECT,
  formatBlogDate,
  slugifyBlogTitle,
  type BlogPost,
  type BlogPostStatus,
} from "@/lib/blog";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  coverImageAlt: string;
  authorName: string;
  status: BlogPostStatus;
  featured: boolean;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
}

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Study Guides",
  coverImageUrl: "",
  coverImageAlt: "",
  authorName: "RevView Team",
  status: "draft",
  featured: false,
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
};

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schemaMissing, setSchemaMissing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogPostStatus>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [slugEdited, setSlugEdited] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select(BLOG_POST_SELECT)
      .order("updated_at", { ascending: false });

    if (error) {
      const missing = error.code === "42P01" || error.code === "PGRST205";
      setSchemaMissing(missing);
      if (!missing) toast.error(`Unable to load blog posts: ${error.message}`);
      setPosts([]);
    } else {
      setSchemaMissing(false);
      setPosts((data ?? []) as BlogPost[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(BLOG_POST_SELECT)
        .order("updated_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        const missing = error.code === "42P01" || error.code === "PGRST205";
        setSchemaMissing(missing);
        if (!missing) toast.error(`Unable to load blog posts: ${error.message}`);
        setPosts([]);
      } else {
        setSchemaMissing(false);
        setPosts((data ?? []) as BlogPost[]);
      }
      setLoading(false);
    };

    void loadInitialPosts();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesSearch =
        !normalized ||
        `${post.title} ${post.slug} ${post.category} ${post.author_name}`
          .toLowerCase()
          .includes(normalized);
      return matchesStatus && matchesSearch;
    });
  }, [posts, search, statusFilter]);

  const publishedCount = posts.filter((post) => post.status === "published").length;
  const draftCount = posts.length - publishedCount;

  const openNewPost = () => {
    setEditingPost(null);
    setForm(emptyForm);
    setSlugEdited(false);
    setEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverImageUrl: post.cover_image_url ?? "",
      coverImageAlt: post.cover_image_alt ?? "",
      authorName: post.author_name,
      status: post.status,
      featured: post.featured,
      publishedAt: toLocalDateTime(post.published_at),
      seoTitle: post.seo_title ?? "",
      seoDescription: post.seo_description ?? "",
    });
    setSlugEdited(true);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
  };

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : slugifyBlogTitle(title),
    }));
  };

  const handleStatusChange = (status: BlogPostStatus) => {
    setForm((current) => ({
      ...current,
      status,
      publishedAt:
        status === "published" && !current.publishedAt
          ? toLocalDateTime(new Date().toISOString())
          : current.publishedAt,
    }));
  };

  const savePost = async () => {
    const title = form.title.trim();
    const slug = slugifyBlogTitle(form.slug);
    const excerpt = form.excerpt.trim();
    const content = form.content.trim();

    if (!title || !slug || !excerpt) {
      toast.error("Title, URL slug, and summary are required.");
      return;
    }

    if (form.status === "published" && !content) {
      toast.error("Add article content before publishing.");
      return;
    }

    if (form.status === "published" && !form.publishedAt) {
      toast.error("Choose a publication date and time.");
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Your session expired. Please sign in again.");
      setSaving(false);
      return;
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      category: form.category.trim() || "Study Guides",
      cover_image_url: form.coverImageUrl || null,
      cover_image_alt: form.coverImageAlt.trim() || null,
      author_name: form.authorName.trim() || "RevView Team",
      status: form.status,
      featured: form.featured,
      published_at:
        form.status === "published" ? new Date(form.publishedAt).toISOString() : null,
      seo_title: form.seoTitle.trim() || null,
      seo_description: form.seoDescription.trim() || null,
    };

    const result = editingPost
      ? await supabase.from("blog_posts").update(payload).eq("id", editingPost.id)
      : await supabase.from("blog_posts").insert({ ...payload, author_id: user.id });

    if (result.error) {
      toast.error(
        result.error.code === "23505"
          ? "That URL slug is already used by another post."
          : `Unable to save post: ${result.error.message}`,
      );
      setSaving(false);
      return;
    }

    toast.success(editingPost ? "Blog post updated." : "Blog post created.");
    setSaving(false);
    closeEditor();
    await loadPosts();
  };

  const deletePost = async () => {
    if (!deleteTarget) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", deleteTarget.id);

    if (error) {
      toast.error(`Unable to delete post: ${error.message}`);
      return;
    }

    toast.success("Blog post deleted.");
    setDeleteTarget(null);
    await loadPosts();
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 px-4 pb-10 pt-20 md:px-6 md:pb-14 md:pt-24 lg:px-8 lg:pb-16 lg:pt-28">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:flex-row md:items-end md:justify-between md:p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Content manager</p>
            <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">Blog Management</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Create helpful learning guides, prepare drafts, and control exactly when articles become public.
            </p>
          </div>
          <Button
            text="New blog post"
            leftIcon={<Add className="h-4 w-4" />}
            backgroundColor="bg-primary"
            textColor="text-white"
            className="w-full shrink-0 md:w-auto"
            onClick={openNewPost}
            isDisabled={schemaMissing}
          />
        </section>

        {schemaMissing ? (
          <section className="rounded-2xl border border-warning/40 bg-warning/10 p-5 md:p-6">
            <h2 className="font-semibold text-foreground">One-time database setup required</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Run <code className="rounded bg-background px-1.5 py-1 text-foreground">supabase/migrations/202607140001_create_blog_posts.sql</code> in your Supabase SQL Editor, then refresh this page.
            </p>
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-3 md:gap-4">
          {[
            { label: "All posts", value: posts.length, className: "from-primary to-secondary" },
            { label: "Published", value: publishedCount, className: "from-emerald-500 to-emerald-700" },
            { label: "Drafts", value: draftCount, className: "from-slate-600 to-slate-800" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl bg-linear-to-br ${stat.className} p-4 text-white shadow-sm sm:p-5`}>
              <p className="text-sm font-medium text-white/80">{stat.label}</p>
              <p className="mt-3 text-2xl font-bold sm:mt-4 sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <InputField
              label="Search blog posts"
              value={search}
              placeholder="Search title, URL, category, or author"
              icon={<Search className="h-4 w-4" />}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
              {(["all", "published", "draft"] as const).map((status) => (
                <Button
                  key={status}
                  text={status === "all" ? "All" : status === "published" ? "Published" : "Drafts"}
                  size="sm"
                  backgroundColor={statusFilter === status ? "bg-primary" : "bg-muted/70"}
                  textColor={statusFilter === status ? "text-white" : "text-muted-foreground"}
                  className="w-full sm:w-auto"
                  onClick={() => setStatusFilter(status)}
                />
              ))}
            </div>
          </div>

          <div className="mt-5 space-y-3 md:hidden">
            {filteredPosts.map((post) => (
              <article key={post.id} className="min-w-0 rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-semibold leading-snug text-foreground">{post.title}</h2>
                    <p className="mt-1 truncate text-xs text-muted-foreground">/{post.slug}</p>
                  </div>
                  {post.featured ? <Chip text="Featured" className="shrink-0 bg-secondary/10 text-secondary" /> : null}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Chip
                    text={post.status === "published" ? "Published" : "Draft"}
                    className={post.status === "published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}
                  />
                  <span className="inline-flex min-w-0 items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    {post.status === "published" ? formatBlogDate(post.published_at) : "Not published"}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  {post.status === "published" ? (
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/20"
                    >
                      <Eye className="h-4 w-4" /> View
                    </Link>
                  ) : null}
                  <Button
                    text="Edit"
                    leftIcon={<Edit className="h-4 w-4" />}
                    size="sm"
                    backgroundColor="bg-primary/10"
                    textColor="text-primary"
                    className="w-full"
                    onClick={() => openEditPost(post)}
                  />
                  <Button
                    text="Delete"
                    leftIcon={<Delete className="h-4 w-4" />}
                    size="sm"
                    backgroundColor="bg-destructive/10"
                    textColor="text-destructive"
                    className={post.status === "published" ? "col-span-2 w-full" : "w-full"}
                    onClick={() => setDeleteTarget(post)}
                  />
                </div>
              </article>
            ))}

            {!loading && filteredPosts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border px-5 py-12 text-center text-sm text-muted-foreground">
                {posts.length ? "No blog posts match these filters." : "No blog posts yet. Create your first draft when you are ready."}
              </div>
            ) : null}
            {loading ? (
              <div className="rounded-xl border border-border px-5 py-12 text-center text-sm text-muted-foreground">Loading blog posts...</div>
            ) : null}
          </div>

          <div className="mt-5 hidden overflow-hidden rounded-xl border border-border md:block">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed bg-white text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Article</th>
                    <th className="hidden w-32 px-4 py-3 font-semibold md:table-cell">Status</th>
                    <th className="hidden w-52 px-4 py-3 font-semibold lg:table-cell">Publication</th>
                    <th className="w-36 px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="transition hover:bg-slate-50/80">
                      <td className="min-w-0 px-4 py-4">
                        <div className="flex min-w-0 items-center gap-2">
                          <p className="truncate font-semibold text-foreground" title={post.title}>{post.title}</p>
                          {post.featured ? <Chip text="Featured" className="bg-secondary/10 text-secondary" /> : null}
                        </div>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">/{post.slug}</p>
                        <div className="mt-2 flex items-center gap-2 md:hidden">
                          <Chip
                            text={post.status === "published" ? "Published" : "Draft"}
                            className={post.status === "published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}
                          />
                        </div>
                      </td>
                      <td className="hidden px-4 py-4 md:table-cell">
                        <Chip
                          text={post.status === "published" ? "Published" : "Draft"}
                          className={post.status === "published" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}
                        />
                      </td>
                      <td className="hidden px-4 py-4 text-muted-foreground lg:table-cell">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {post.status === "published" ? formatBlogDate(post.published_at) : "Not published"}
                        </span>
                      </td>
                      <td className="w-36 px-4 py-4 align-middle">
                        <div className="flex h-9 items-center justify-center gap-2 whitespace-nowrap">
                          {post.status === "published" ? (
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition hover:bg-primary/20"
                              aria-label={`View ${post.title}`}
                              title="View published article"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          ) : null}
                          <button
                            type="button"
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition hover:bg-primary/20"
                            onClick={() => openEditPost(post)}
                            aria-label={`Edit ${post.title}`}
                            title="Edit article"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive transition hover:bg-destructive/20"
                            onClick={() => setDeleteTarget(post)}
                            aria-label={`Delete ${post.title}`}
                            title="Delete article"
                          >
                            <Delete className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-14 text-center text-sm text-muted-foreground">
                        {posts.length ? "No blog posts match these filters." : "No blog posts yet. Create your first draft when you are ready."}
                      </td>
                    </tr>
                  ) : null}
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-14 text-center text-sm text-muted-foreground">Loading blog posts...</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <Modal
        isOpen={editorOpen}
        onClose={closeEditor}
        size="xl"
        closeOnBackdrop={false}
        panelClassName="sm:max-h-[94dvh]"
        title={editingPost ? "Edit blog post" : "Create blog post"}
        description="Save unfinished work as a draft, or publish it when the article is ready."
        footer={
          <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end">
            <Button text="Cancel" borderColor="border-border" backgroundColor="bg-background" className="w-full sm:w-auto" onClick={closeEditor} isDisabled={saving} />
            <Button
              text={saving ? "Saving..." : editingPost ? "Save changes" : "Create post"}
              backgroundColor="bg-primary"
              textColor="text-white"
              onClick={savePost}
              isDisabled={saving}
              className="w-full sm:w-auto"
            />
          </div>
        }
      >
        <div className="grid min-w-0 gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.85fr)]">
          <div className="space-y-5">
            <InputField
              label="Article title *"
              value={form.title}
              placeholder="A clear, useful title for learners"
              maxLength={160}
              onChange={(event) => handleTitleChange(event.target.value)}
            />
            <InputField
              label="URL slug *"
              value={form.slug}
              placeholder="civil-service-exam-study-guide"
              onChange={(event) => {
                setSlugEdited(true);
                setForm((current) => ({ ...current, slug: slugifyBlogTitle(event.target.value) }));
              }}
            />
            <InputField
              label={`Summary * (${form.excerpt.length}/320)`}
              type="textarea"
              value={form.excerpt}
              placeholder="Briefly explain what readers will learn from this article."
              maxLength={320}
              onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
            />

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="blog-content" className="text-sm font-medium text-foreground">Article content</label>
                <span className="text-xs text-muted-foreground">Markdown: ## heading, **bold**, - list, [link](url)</span>
              </div>
              <textarea
                id="blog-content"
                value={form.content}
                rows={18}
                placeholder="Write the article here..."
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                className="min-h-80 w-full resize-y rounded-xl border border-border bg-background px-3 py-3 font-mono text-sm leading-6 text-foreground transition focus:border-primary focus:ring-2 focus:ring-primary/20 sm:min-h-96 sm:px-4 sm:leading-7"
              />
            </div>

            <div className="rounded-xl border border-border bg-slate-50 p-4">
              <h3 className="font-semibold text-foreground">Search appearance</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Optional. RevView uses the article title and summary when these fields are empty.</p>
              <div className="mt-4 space-y-4">
                <InputField
                  label={`SEO title (${form.seoTitle.length}/70)`}
                  value={form.seoTitle}
                  maxLength={70}
                  placeholder="Concise search result title"
                  onChange={(event) => setForm((current) => ({ ...current, seoTitle: event.target.value }))}
                />
                <InputField
                  label={`SEO description (${form.seoDescription.length}/170)`}
                  type="textarea"
                  value={form.seoDescription}
                  maxLength={170}
                  placeholder="Describe why this guide is useful."
                  onChange={(event) => setForm((current) => ({ ...current, seoDescription: event.target.value }))}
                />
              </div>
            </div>
          </div>

          <aside className="min-w-0 space-y-5">
            <div className="rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground">Publication</h3>
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(["draft", "published"] as const).map((status) => (
                    <Button
                      key={status}
                      text={status === "draft" ? "Draft" : "Published"}
                      size="sm"
                      backgroundColor={form.status === status ? "bg-primary" : "bg-muted"}
                      textColor={form.status === status ? "text-white" : "text-muted-foreground"}
                      onClick={() => handleStatusChange(status)}
                    />
                  ))}
                </div>
                {form.status === "published" ? (
                  <div className="space-y-2">
                    <label htmlFor="published-at" className="text-sm font-medium text-foreground">Publish date and time</label>
                    <input
                      id="published-at"
                      type="datetime-local"
                      value={form.publishedAt}
                      onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs leading-relaxed text-muted-foreground">A future time schedules the article. It appears publicly after that time.</p>
                  </div>
                ) : null}
                <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                    className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span>
                    <span className="block text-sm font-medium text-foreground">Feature this article</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">Featured guides receive more prominent placement.</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground">Article details</h3>
              <div className="mt-4 space-y-4">
                <InputField label="Category" value={form.category} placeholder="Study Guides" maxLength={80} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
                <InputField label="Author display name" value={form.authorName} placeholder="RevView Team" maxLength={100} onChange={(event) => setForm((current) => ({ ...current, authorName: event.target.value }))} />
              </div>
            </div>

            <div className="rounded-xl border border-border p-4">
              <h3 className="font-semibold text-foreground">Cover image</h3>
              <div className="mt-4 space-y-4">
                <InsertImage folder="blog_covers" value={form.coverImageUrl} onChange={(url) => setForm((current) => ({ ...current, coverImageUrl: url }))} placeholder="Upload a landscape cover image" />
                <InputField label="Image description" value={form.coverImageAlt} placeholder="Describe the image for accessibility" maxLength={180} onChange={(event) => setForm((current) => ({ ...current, coverImageAlt: event.target.value }))} />
              </div>
            </div>
          </aside>
        </div>
      </Modal>

      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete blog post?"
        description="This action permanently removes the article and cannot be undone."
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button text="Cancel" borderColor="border-border" onClick={() => setDeleteTarget(null)} />
            <Button text="Delete" backgroundColor="bg-destructive" textColor="text-white" onClick={deletePost} />
          </div>
        }
      >
        <div className="p-5">
          <p className="rounded-lg bg-muted p-3 text-sm font-medium text-foreground">{deleteTarget?.title}</p>
        </div>
      </Modal>
    </main>
  );
}
