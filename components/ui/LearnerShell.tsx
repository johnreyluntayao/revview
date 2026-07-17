"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/lib/client-imports";
import { Menu } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";

interface LearnerShellProps {
  children: React.ReactNode;
}

export default function LearnerShell({ children }: LearnerShellProps) {
  const [supabase] = useState(() => createClient());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    const loadUserName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserName("Guest");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.name ?? "User");
    };

    void loadUserName();
  }, [supabase]);

  useEffect(() => {
    if (!isSidebarOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };
    const closeAtDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setIsSidebarOpen(false);
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeAtDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeAtDesktop);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-xl lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="RevView homepage">
            <Image
              src="/Long-logo.svg"
              alt="RevView Logo"
              width={160}
              height={64}
              className="h-auto w-32 sm:w-36"
              priority
            />
          </Link>

          <button
            type="button"
            className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open learner navigation"
            aria-expanded={isSidebarOpen}
            aria-controls="learner-sidebar"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      <div className="flex min-h-screen">
        <Sidebar name={userName} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="min-w-0 flex-1">
          <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen">{children}</div>
        </div>
      </div>

      <button
        type="button"
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsSidebarOpen(false)}
        aria-label="Close learner navigation"
        tabIndex={isSidebarOpen ? 0 : -1}
      />
    </>
  );
}
