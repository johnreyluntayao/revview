import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const footerData = {
  menuItems: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate w-full overflow-hidden bg-hero2 px-5 text-white sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blue-400/50 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-48 -z-10 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="mx-auto grid max-w-7xl gap-10 py-12 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[2fr_1fr_1fr] lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
        <Link href="/" aria-label="RevView homepage" className="inline-flex w-fit">
          <Image
            src="/Long-logo-white.svg"
            alt="RevView Logo"
            width={160}
            height={72}
            className="h-auto w-32 lg:w-40"
            style={{ height: "auto" }}
            loading="eager"
          />
        </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-400">
            A little practice. A step closer.<br />
            Build your confidence for the Philippine Civil Service Exam, one question at a time.
          </p>
          <Link href="/quiz-selection" className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition-colors hover:text-blue-200">
            Start practicing
            <ArrowRight aria-hidden="true" className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
          </Link>
        </div>

        <nav aria-label="Explore RevView">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Explore</h2>
          <ul className="space-y-3.5 text-sm text-slate-400">
            {[
              { name: "Practice quizzes", href: "/quiz-selection" },
              { name: "Exam coverage", href: "/#coverage" },
              { name: "How it works", href: "/#how-it-works" },
              { name: "Articles & resources", href: "/blog" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          aria-label="Footer navigation"
        >
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Legal</h2>
          <ul className="space-y-3.5 text-sm text-slate-400">
          {footerData.menuItems.map((item) => (
            <li key={item.name}>
            <Link
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.name}
            </Link>
            </li>
          ))}
          </ul>
        </nav>

      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 border-t border-white/10 py-6 text-center text-xs text-slate-400 md:flex-row md:justify-between md:text-left">
        <p>&copy; {year} RevView. All rights reserved.</p>
        <a
          href="https://johnreyluntayao.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/3 px-4 py-2.5 leading-relaxed transition-colors hover:border-blue-300/30 hover:bg-blue-400/10 focus-visible:border-blue-300/30"
        >
          <span>Designed &amp; Developed by <span className="font-medium text-slate-200 transition-colors group-hover:text-blue-200">Johnrey V. Luntayao</span></span>
          <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0 text-blue-300 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" />
        </a>
      </div>
    </footer>
  );
}
