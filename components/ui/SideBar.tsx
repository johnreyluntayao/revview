"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  AccountSettings,
  AverageScore,
  Close,
  Logout,
  ProgressTracking,
  StartQuiz,
} from "@/lib/icons";

type NavItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  section?: "main" | "account";
  exact?: boolean;
};

interface SidebarProps {
  name?: string;
  isOpen?: boolean;
  onClose?: () => void;
  items?: NavItem[];
  adHide?: boolean;
}

const defaultItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: ProgressTracking, section: "main", exact: true },
  { href: "/quiz-selection", label: "Start review", icon: StartQuiz, section: "main" },
  { href: "/results-history", label: "Results history", icon: AverageScore, section: "main", exact: true },
  { href: "/user-account", label: "Account settings", icon: AccountSettings, section: "account", exact: true },
];

export default function Sidebar({
  name,
  isOpen = false,
  onClose = () => {},
  items = defaultItems,
}: SidebarProps) {
  const pathname = usePathname();
  const [supabase] = useState(() => createClient());
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const mainItems = items.filter((item) => item.section !== "account");
  const accountItems = items.filter((item) => item.section === "account");

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = "/login";
    } catch (error: unknown) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  const renderLink = (item: NavItem) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={onClose}
      aria-current={isActive(item) ? "page" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        isActive(item)
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {item.icon && <item.icon className="size-4.5 shrink-0" />}
      <span>{item.label}</span>
    </Link>
  );

  return (
    <aside
      id="learner-sidebar"
      className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border/80 bg-card shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground lg:hidden"
          onClick={onClose}
          aria-label="Close dashboard navigation"
        >
          <Close className="size-5" />
        </button>

        <div className="shrink-0 px-5 py-4 lg:px-6">
          <Link href="/" aria-label="RevView homepage">
            <Image src="/Long-logo.svg" alt="RevView Logo" width={160} height={64} className="h-auto w-36" priority />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-5 lg:px-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Learning</p>
          <nav aria-label="Learner navigation" className="space-y-1">
            {mainItems.map(renderLink)}

            {accountItems.length > 0 && (
              <div className="mt-5 border-t border-border pt-5">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Account</p>
                {accountItems.map(renderLink)}
              </div>
            )}
          </nav>
        </div>

        <div className="shrink-0 space-y-3 border-t border-border px-4 py-4 lg:px-5">
          <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-bold text-white">
              {(name || "U").trim().charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Signed in as</p>
              <p className="truncate text-sm font-semibold text-foreground">{name || "User"}</p>
            </div>
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            <Logout className="size-4.5" />
            <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
