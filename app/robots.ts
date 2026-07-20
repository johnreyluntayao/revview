import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin-account",
          "/affiliate",
          "/auth",
          "/boost",
          "/dashboard",
          "/feedbacks",
          "/login",
          "/manage-questions",
          "/manage-blogs",
          "/quiz",
          "/quiz-result",
          "/quiz-selection",
          "/results-history",
          "/signup",
          "/user-account",
        ],
      },
    ],
    sitemap: "https://revview.online/sitemap.xml",
    host: "https://revview.online",
  };
}
