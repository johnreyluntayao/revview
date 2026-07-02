import { Footer, NavBar } from "@/lib/client-imports";

export default function TermsPage() {
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
              Terms and Conditions
            </h1>
            <p className="text-muted-foreground">
              These terms describe the basic rules for using RevView and its
              review, quiz, feedback, and product resource features.
            </p>
          </div>

          <div className="space-y-4 text-sm leading-7 text-muted-foreground md:text-base">
            <p>
              Use RevView for lawful review and learning purposes only. You are
              responsible for keeping your account credentials secure.
            </p>
            <p>
              Review materials, quiz content, and product recommendations are
              provided as educational resources and may change over time.
            </p>
            <p>
              Product links may lead to third-party websites. Purchases and
              interactions on those websites are governed by their own terms.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
