"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

import {
  Logout,
  AccountSettings,
  Close,
  StartQuiz,
  ProgressTracking,
  AverageScore,
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
  { href: "/quiz-selection", label: "Start Review", section: "main", icon: StartQuiz, exact: false },
  { href: "/results-history", label: "Results History", section: "main", icon: AverageScore, exact: true },
  { href: "/user-account", label: "Account Settings", icon: AccountSettings, section: "account", exact: true },
];

export default function Sidebar({
  name,
  isOpen = false,
  onClose = () => {},
  items = defaultItems,
  adHide = false
}: SidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const close = () => onClose();

  const mainItems = items.filter((i) => i.section !== "account");
  const accountItems = items.filter((i) => i.section === "account");

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        alert("Failed to sign out. Please try again.");
        return;
      }
      window.location.href = "/login";
    } catch (err) {
      console.error("Unexpected logout error:", err);
      window.location.href = "/login";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:translate-x-0 lg:h-screen lg:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <button
            className="lg:hidden absolute top-4 right-4 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
            onClick={close}
            aria-label="Close sidebar"
          >
            <Close className="w-6 h-6" />
          </button>

          {/* Logo / Brand – pinned at top */}
          <div className="shrink-0 px-4 md:px-5 lg:px-6">
            {/* Logo + Brand – left side */}
              <Link href="/">
                <Image
                src="/Long-logo.svg"
                alt="RevView Logo"
                width={40}
                height={40}
                className="w-32 h-20 lg:w-36 lg:h-24"
                />
              </Link>
          </div>

          {/* Scrollable navigation area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-5 lg:px-6 pb-4 md:pb-5 lg:pb-6">
            <nav className="space-y-1.5">
              {mainItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={close}
                  className={`
                    flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base
                    ${
                      isActive(item)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  {item.icon && <item.icon className="w-4 h-4 md:w-5 md:h-5" />}
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Account Section */}
              {accountItems.length > 0 && (
                <div className="pt-6 md:pt-8 mt-2 md:mt-4 border-t border-border">
                  <p className="px-2 md:px-4 mb-2 md:mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Account
                  </p>
                  {accountItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={close}
                      className={`
                        flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base
                        ${
                          isActive(item)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }
                      `}
                    >
                      {item.icon && <item.icon className="w-4 h-4 md:w-5 md:h-5" />}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}

            </nav>
          </div>

          {/* User info + Logout – pinned at bottom */}
          <div className="shrink-0 px-4 md:px-6 pt-3 md:pt-4 pb-4 md:pb-6 border-t border-border space-y-4">
            <div className="px-2 md:px-4">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="font-medium text-foreground truncate max-w-full text-sm md:text-base">
                {name || "User"}
              </p>
            </div>

            <button
              className={`
                w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 rounded-lg 
                font-medium transition-colors text-sm md:text-base
                ${
                  isLoggingOut
                    ? "opacity-60 cursor-not-allowed bg-destructive/5"
                    : "text-destructive hover:bg-destructive/10"
                }
              `}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <Logout className="w-4 h-4 md:w-5 md:h-5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
