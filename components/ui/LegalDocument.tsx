import Link from "next/link";
import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  summary: string;
  effectiveDate: string;
  sections: LegalSection[];
  relatedHref: string;
  relatedLabel: string;
}

export default function LegalDocument({
  eyebrow,
  title,
  summary,
  effectiveDate,
  sections,
  relatedHref,
  relatedLabel,
}: LegalDocumentProps) {
  return (
    <main className="min-h-screen bg-linear-to-b from-primary/6 via-background to-background px-3 pb-14 pt-24 sm:px-4 sm:pb-20 sm:pt-28 md:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="overflow-hidden rounded-2xl border border-primary/15 bg-linear-to-br from-hero1 to-hero2 px-5 py-8 text-white shadow-xl shadow-primary/10 sm:rounded-3xl sm:px-6 sm:py-10 md:px-10 md:py-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary200 sm:text-xs sm:tracking-[0.22em]">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl text-2xl font-extrabold tracking-tight sm:mt-4 sm:text-3xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75 sm:mt-4 sm:leading-7 md:text-base">
            {summary}
          </p>
          <p className="mt-5 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-medium text-white/80 sm:mt-6 sm:px-4 sm:text-xs">
            Effective {effectiveDate}
          </p>
        </header>

        <div className="mt-5 grid items-start gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)]">
          <details className="group rounded-2xl border border-border bg-background shadow-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-sm font-bold text-foreground [&::-webkit-details-marker]:hidden">
              <span>On this page</span>
              <span
                aria-hidden="true"
                className="text-lg text-primary transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <nav
              aria-label={`${title} sections`}
              className="border-t border-border px-3 py-3"
            >
              <ol className="grid gap-1 sm:grid-cols-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-2 rounded-lg px-2 py-2 text-xs text-muted-foreground transition hover:bg-primary/5 hover:text-primary sm:text-sm"
                    >
                      <span className="w-6 shrink-0 whitespace-nowrap font-semibold tabular-nums text-primary/70 [overflow-wrap:normal] [word-break:normal]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </details>

          <aside className="hidden rounded-2xl border border-border bg-background p-5 shadow-sm lg:sticky lg:top-28 lg:block">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
            <nav aria-label={`${title} sections`} className="mt-4">
              <ol className="space-y-1">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition hover:bg-primary/5 hover:text-primary"
                    >
                      <span className="w-7 shrink-0 whitespace-nowrap font-semibold tabular-nums text-primary/70 [overflow-wrap:normal] [word-break:normal]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">{section.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="space-y-4">
            {sections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 rounded-2xl border border-border bg-background p-4 shadow-sm sm:p-6 md:scroll-mt-28 md:p-8"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary sm:h-9 sm:w-9 sm:text-sm">
                    {index + 1}
                  </span>
                  <h2 className="min-w-0 text-lg font-bold leading-tight text-foreground sm:text-xl md:text-2xl">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground sm:space-y-4 sm:leading-7 md:text-base [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-0.5 [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2 sm:[&_li]:pl-1 sm:[&_ul]:ml-5">
                  {section.content}
                </div>
              </section>
            ))}

            <div className="flex flex-col gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <p className="text-sm text-muted-foreground">
                You may also want to review our {relatedLabel.toLowerCase()}.
              </p>
              <Link
                href={relatedHref}
                className="shrink-0 text-sm font-semibold text-primary hover:underline"
              >
                Read {relatedLabel} <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
