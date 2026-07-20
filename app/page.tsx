import type { Metadata } from "next";
import { Homepage, Footer, NavBar } from "@/lib/client-imports";

export const metadata: Metadata = {
  title: "Free Civil Service Exam Reviewer Philippines",
  description:
    "Use RevView's free Philippine Civil Service Exam reviewer for CSE-PPT Professional and Subprofessional practice quizzes, explanations, and progress tracking.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "Free Civil Service Exam Reviewer Philippines | RevView",
    description:
      "Practice for the Philippine CSE-PPT with free quizzes, answer explanations, performance insights, and Professional and Subprofessional review coverage.",
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
