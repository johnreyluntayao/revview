import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RevView Civil Service Exam Reviewer",
    short_name: "RevView",
    description:
      "Free online reviewer and practice quizzes for the Philippine Civil Service Exam.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2995ca",
    icons: [
      {
        src: "/Icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
