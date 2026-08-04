import type { Metadata } from "next";
import { Homepage, Footer, NavBar } from "@/lib/client-imports";
import { redirect } from "next/navigation";

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

interface HomePageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { code } = await searchParams;

  // Supabase sends the authorization code to the Site URL when the callback
  // URL is not yet allow-listed. Forward it so the server can exchange it for
  // a session and finish the normal dashboard redirect instead of exposing it
  // on the homepage URL.
  if (code) {
    redirect(`/auth/callback?code=${encodeURIComponent(code)}`);
  }

  return (
    <div className="w-full">
      <NavBar State="Home" />
      <Homepage />
      <Footer />
    </div>
  );
}
