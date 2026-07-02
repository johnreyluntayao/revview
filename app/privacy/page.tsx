import { Footer, NavBar } from "@/lib/client-imports";

export default function PrivacyPage() {
  return (
    <>
      <NavBar State="Default" />
      <main className="min-h-screen px-4 pt-28 pb-16 md:px-6 lg:px-8">
        <section className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Legal
            </p>
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              RevView respects your privacy. This page explains the basic ways
              we handle information while you use the review platform.
            </p>
          </div>

          <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
            <p>
              We collect the account and activity information needed to provide
              quizzes, results history, feedback, and account features.
            </p>
            <p>
              We use this information to operate the service, improve review
              content, protect accounts, and respond to support requests.
            </p>
            <p>
              We do not sell personal information. Some product links may send
              you to third-party sites, and their own privacy practices apply.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
