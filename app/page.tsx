import type { Metadata } from "next";
import { Homepage, Footer, NavBar } from "@/lib/client-imports";

export const metadata: Metadata = {
  title: "Civil Service Exam Reviewer & Practice Tests",
  description:
    "Prepare for the Civil Service Exam with RevView's focused practice quizzes, progress tracking, explanations, coverage sections, and curated study products.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "RevView | Civil Service Exam Reviewer & Practice Tests",
    description:
      "Practice smarter for the Civil Service Exam with quizzes, explanations, progress insights, and curated review resources.",
  },
};

export default function Home() {
  return (
    <div className="w-full">
      <NavBar State="Home" />
      <Homepage />
      <Footer />
    </div>
  );
}
