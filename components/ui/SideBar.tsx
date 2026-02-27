"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import {
  AllCategories,
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
  userName?: string;
  isOpen?: boolean;
  onClose?: () => void;
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: ProgressTracking, section: "main", exact: true },
  { href: "/quiz-selection", label: "Start Review", section: "main", icon: StartQuiz, exact: false },
  { href: "/results", label: "Results History", section: "main", icon: AverageScore, exact: true },
  { href: "/account", label: "Account Settings", icon: AccountSettings, section: "account", exact: true },
];

export default function Sidebar({
  userName = "User",
  isOpen = false,
  onClose = () => {},
  items = defaultItems,
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
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        <div className="flex flex-col h-full p-6 relative">
          {/* Mobile close button */}
          <button
            className="lg:hidden absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted/50"
            onClick={close}
            aria-label="Close sidebar"
          >
            <Close className="w-6 h-6" />
          </button>

          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 mb-10"
            onClick={close}
          >
            <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-sm">
              <AllCategories className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              RevView
            </span>
          </Link>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1.5">
            {mainItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors
                  ${
                    isActive(item)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Account Section */}
            {accountItems.length > 0 && (
              <div className="pt-8 mt-4 border-t border-border">
                <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account
                </p>
                {accountItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={close}
                    className={`
                      flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-colors
                      ${
                        isActive(item)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    {item.icon && <item.icon className="w-5 h-5" />}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* Footer – user info + logout */}
          <div className="pt-6 mt-auto border-t border-border space-y-4">
            <div className="px-4">
              <p className="text-sm text-muted-foreground">Logged in as</p>
              <p className="font-medium text-foreground truncate max-w-45">
                {userName}
              </p>
            </div>

            <button
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-lg 
                font-medium transition-colors
                ${
                  isLoggingOut
                    ? "opacity-60 cursor-not-allowed bg-destructive/5"
                    : "text-destructive hover:bg-destructive/10"
                }
              `}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <Logout className="w-5 h-5" />
              <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}