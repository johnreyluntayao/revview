"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { AllCategories, Analytical, ArrowLeft, ArrowRight, General, LibraryBig, LoaderCircle, Numerical, Verbal } from "@/lib/icons";
import { Button, RadioButton } from "@/lib/client-imports";
import type { QuizCategory } from "@/lib/types";
import { toast } from "sonner";

type StudyQuestion = {
  id: string;
  text: string | null;
  img_url: string | null;
  options: (string | null)[] | null;
  option_images: (string | null)[] | null;
  correct_answer: string;
  explanation: string | null;
  explanation_img_url: string | null;
};

const letters = ["A", "B", "C", "D", "E"];
const questionsPerPage = 8;
const categoryIcons = [<Numerical key="numerical" />, <Analytical key="analytical" />, <Verbal key="verbal" />, <General key="general" />];
const backgrounds = ["bg-blue-600", "bg-violet-600", "bg-emerald-600", "bg-amber-600"];

const getAnswerContent = (question: StudyQuestion) => {
  const normalizedAnswer = question.correct_answer.trim();
  const letterMatch = normalizedAnswer.match(/^(?:option\s*)?([a-e])\s*[.)]?\s*$/i);
  const labelledValueMatch = normalizedAnswer.match(/^(?:option\s*)?([a-e])\s*[.):]\s*(.+)$/i);
  const answerLetter = letterMatch?.[1] || labelledValueMatch?.[1];
  const answerIndex = answerLetter ? letters.indexOf(answerLetter.toUpperCase()) : -1;

  if (answerIndex >= 0) {
    const text = question.options?.[answerIndex]?.trim() || labelledValueMatch?.[2]?.trim() || null;
    const image = question.option_images?.[answerIndex] || null;
    return { text, image, isResolved: Boolean(text || image) };
  }

  return { text: normalizedAnswer || null, image: null, isResolved: Boolean(normalizedAnswer) };
};

export default function StudyLibrary() {
  const [supabase] = useState(() => createClient());
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<StudyQuestion[]>([]);
  const [page, setPage] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) toast.error("Could not load study categories.");
      setCategories(data ?? []);
      setLoadingCategories(false);
    };
    void loadCategories();
  }, [supabase]);

  useEffect(() => {
    if (!selectedCategory) return;

    const loadQuestions = async () => {
      setLoadingQuestions(true);
      const from = (page - 1) * questionsPerPage;
      const { data, error, count } = await supabase
        .from("questions")
        .select("id, text, img_url, options, option_images, correct_answer, explanation, explanation_img_url", { count: "exact" })
        .eq("category_id", selectedCategory)
        .order("date_added", { ascending: false })
        .range(from, from + questionsPerPage - 1);
      if (error) {
        toast.error("Could not load these study questions.");
        setQuestions([]);
      } else {
        setQuestions((data ?? []) as StudyQuestion[]);
        setTotalQuestions(count ?? 0);
      }
      setLoadingQuestions(false);
    };
    void loadQuestions();
  }, [page, selectedCategory, supabase]);

  const categoryName = categories.find((category) => category.id === selectedCategory)?.name;
  const totalPages = Math.max(1, Math.ceil(totalQuestions / questionsPerPage));
  const firstQuestion = totalQuestions === 0 ? 0 : (page - 1) * questionsPerPage + 1;
  const lastQuestion = Math.min(page * questionsPerPage, totalQuestions);

  return (
    <main className="min-h-full bg-linear-to-b from-primary/5 via-background to-background px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
      <div className="mx-auto max-w-6xl">
        <header className="overflow-hidden rounded-2xl border border-primary/15 bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"><LibraryBig className="size-5" /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Study library</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Study every question, with context</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Choose a category to review the newest questions first, with the answer, explanation, and supporting images shown clearly.</p>
            </div>
          </div>
        </header>

        <section className="mt-5 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-bold text-foreground">Choose a category</h2>
          {loadingCategories ? <div className="mt-3 h-24 animate-pulse rounded-xl bg-muted" /> : (
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category, index) => (
                <RadioButton key={category.id} variant="boxed" value={category.id} label={category.name} description="Review newest questions first" icon={categoryIcons[index] ?? <AllCategories />} boxedBG={backgrounds[index] ?? "bg-primary"} isSelected={selectedCategory === category.id} onSelect={(value) => { setPage(1); setSelectedCategory(String(value)); }} className="!gap-3 !p-3" />
              ))}
            </div>
          )}
        </section>

        {!selectedCategory ? (
          <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <LibraryBig className="mx-auto size-8 text-primary/60" />
            <h2 className="mt-3 text-lg font-bold text-foreground">Select a category to begin</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">Each question is shown with its answer and explanation so you can study at your own pace.</p>
          </div>
        ) : loadingQuestions ? (
          <div className="mt-5 flex min-h-56 items-center justify-center rounded-2xl border border-border bg-card"><LoaderCircle className="size-6 animate-spin text-primary" /></div>
        ) : (
          <section className="mt-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{categoryName}</p><h2 className="mt-1 text-xl font-bold text-foreground">Question bank</h2></div>
              <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">{totalQuestions} questions</span>
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <article key={question.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
                  <div className="border-b border-border/70 p-4 sm:p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Question {firstQuestion + index}</p>
                    {question.text && <h3 className="mt-2 whitespace-pre-wrap text-base font-bold leading-relaxed text-foreground sm:text-lg">{question.text}</h3>}
                    {question.img_url && <div className="relative mt-4 h-56 overflow-hidden rounded-xl border border-border/70 bg-muted/40 sm:h-80"><Image src={question.img_url} alt={`Question ${index + 1} illustration`} fill sizes="(min-width: 640px) 700px, 100vw" className="object-contain p-2" /></div>}
                  </div>
                  {(() => {
                    const answer = getAnswerContent(question);
                    return <div className="border-t border-success/15 bg-success/5 p-4 sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.14em] text-success">Answer</p>{answer.text && <p className="mt-1 text-sm font-semibold text-foreground">{answer.text}</p>}{answer.image && <div className="relative mt-3 h-48 overflow-hidden rounded-xl border border-success/20 bg-card sm:h-64"><Image src={answer.image} alt={`Correct answer for question ${firstQuestion + index}`} fill sizes="(min-width: 640px) 700px, 100vw" className="object-contain p-2" /></div>}{!answer.isResolved && <p className="mt-1 text-sm text-muted-foreground">Answer content is not available for this question.</p>}<p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-primary">Explanation</p><p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{question.explanation || "No explanation has been added yet."}</p>{question.explanation_img_url && <div className="relative mt-4 h-56 overflow-hidden rounded-xl border border-border/70 bg-card sm:h-80"><Image src={question.explanation_img_url} alt={`Explanation for question ${firstQuestion + index}`} fill sizes="(min-width: 640px) 700px, 100vw" className="object-contain p-2" /></div>}</div>;
                  })()}
                </article>
              ))}
              {questions.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-14 text-center text-sm text-muted-foreground">No questions are available in this category yet.</div>}
            </div>
            {totalQuestions > questionsPerPage && <nav aria-label="Study question pagination" className="mt-5 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"><p className="text-center text-xs text-muted-foreground sm:text-left">Showing {firstQuestion}–{lastQuestion} of {totalQuestions} questions</p><div className="flex items-center justify-center gap-2"><Button text={<span className="sr-only sm:not-sr-only">Previous</span>} leftIcon={<ArrowLeft className="size-4" />} isDisabled={page === 1} onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))} className="size-10 !p-0 sm:w-auto sm:!px-3" backgroundColor="bg-muted" aria-label="Previous page" /><Button text={`Page ${page} of ${totalPages}`} isDisabled className="min-h-10 px-3" backgroundColor="bg-primary/10" textColor="text-primary" /><Button text={<span className="sr-only sm:not-sr-only">Next</span>} rightIcon={<ArrowRight className="size-4" />} isDisabled={page === totalPages} onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))} className="size-10 !p-0 sm:w-auto sm:!px-3" backgroundColor="bg-primary" textColor="text-primary-foreground" aria-label="Next page" /></div></nav>}
          </section>
        )}
      </div>
    </main>
  );
}
