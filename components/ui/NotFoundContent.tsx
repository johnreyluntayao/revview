"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Home, LibraryBig, SearchX } from "@/lib/icons";
import { Button } from "@/lib/client-imports";

const NotFoundContent = () => {
  const router = useRouter();

  return (
    <main className="relative isolate min-h-[calc(100vh-5rem)] overflow-hidden bg-linear-to-b from-primary/5 via-background to-secondary/5 px-4 pb-12 pt-28 sm:px-6 sm:pb-16 md:pt-24 lg:px-8 lg:pt-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 bottom-10 size-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:gap-12">
        <section className="order-2 text-center lg:order-1 lg:text-left">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-primary lg:mx-0">
            <SearchX className="size-4" /> Error 404
          </div>

          <p className="mt-5 bg-linear-to-r from-primary to-secondary bg-clip-text text-7xl font-extrabold leading-none tracking-tighter text-transparent sm:text-8xl lg:text-9xl">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            This page missed the review session.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base lg:mx-0 lg:text-lg">
            The page may have moved, the link may be outdated, or the address may have a typo. Let&apos;s get you back to a useful place.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Button
              text="Back to home"
              leftIcon={<Home className="size-4.5" />}
              rightIcon={<ArrowRight className="size-4.5" />}
              onClick={() => router.push("/")}
              backgroundColor="bg-linear-to-r from-primary to-secondary"
              textColor="text-primary-foreground"
              className="min-h-12 w-full px-5 font-semibold shadow-lg shadow-primary/15 sm:w-auto"
            />
            <Button
              text="Browse products"
              leftIcon={<LibraryBig className="size-4.5" />}
              onClick={() => router.push("/products")}
              backgroundColor="bg-card"
              textColor="text-foreground"
              borderColor="border-border"
              className="min-h-12 w-full px-5 font-semibold shadow-sm sm:w-auto"
            />
          </div>

          <p className="mt-5 text-xs text-muted-foreground sm:text-sm">
            Tip: check the web address for missing or extra characters.
          </p>
        </section>

        <div className="order-1 mx-auto w-full max-w-2xl lg:order-2">
          <div className="relative overflow-hidden rounded-3xl border border-primary/15 bg-card p-2 shadow-2xl shadow-primary/10 sm:p-3">
            <div aria-hidden="true" className="absolute inset-x-12 bottom-0 h-12 rounded-full bg-primary/20 blur-2xl" />
            <Image
              src="/images/revview-404.png"
              alt="A RevView study robot searching for a missing puzzle piece in an open book"
              width={1456}
              height={1092}
              priority
              sizes="(max-width: 1024px) 92vw, 52vw"
              className="relative h-auto w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundContent;
