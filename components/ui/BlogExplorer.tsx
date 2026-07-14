"use client";

import { useMemo, useState } from "react";
import BlogCard from "@/components/atoms/BlogCard";
import Button from "@/components/atoms/Button";
import InputField from "@/components/atoms/InputField";
import { Search } from "@/lib/icons";
import type { BlogPostPreview } from "@/lib/blog";

interface BlogExplorerProps {
  posts: BlogPostPreview[];
}

export default function BlogExplorer({ posts }: BlogExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean))).sort()],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = category === "All" || post.category === category;
      const matchesQuery =
        !normalizedQuery ||
        `${post.title} ${post.excerpt} ${post.category} ${post.author_name}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, posts, query]);

  const featuredPost = filteredPosts.find((post) => post.featured) ?? filteredPosts[0];
  const remainingPosts = featuredPost
    ? filteredPosts.filter((post) => post.id !== featuredPost.id)
    : [];

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(260px,0.85fr)_1.5fr] lg:items-end">
          <InputField
            label="Search learning guides"
            placeholder="Search topics, categories, or keywords"
            value={query}
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
            onChange={(event) => setQuery(event.target.value)}
          />

          <div className="space-y-2">
            <p className="text-[10px] font-medium text-gray-700 md:text-xs lg:text-sm">
              Browse by category
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
              {categories.map((item) => (
                <Button
                  key={item}
                  text={item}
                  size="sm"
                  onClick={() => setCategory(item)}
                  backgroundColor={category === item ? "bg-primary" : "bg-muted/70"}
                  textColor={category === item ? "text-white" : "text-muted-foreground"}
                  className="min-w-fit shrink-0 whitespace-nowrap"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {featuredPost ? <BlogCard post={featuredPost} featured /> : null}

      {remainingPosts.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {remainingPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : null}

      {filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-foreground">No guides found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or category.
          </p>
          <Button
            text="Clear filters"
            backgroundColor="bg-primary"
            textColor="text-white"
            className="mx-auto mt-5"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
