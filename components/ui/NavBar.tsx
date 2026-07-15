"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { CountDownTimer, Button, PauseModal } from "@/lib/client-imports";
import { Pause } from "@/lib/icons";
import {
  ProgressTracking,
  ShowFeedback,
  Questions,
  AccountSettings,
  Logout,
  Menu,
  Close,
  Username as User,
  Affiliate,
  Blog,
  Home,
} from "@/lib/icons";
import { toast } from "sonner";
import { useHybridQuizTimer } from "@/lib/hooks/useHybridQuizTimer";

function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const logout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        toast.error("Failed to log out. Please try again.");
        return;
      }
      router.replace("/login");
    } catch (err) {
      console.error("Unexpected logout error:", err);
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
}

interface NavbarProps {
  State: "LoggedIn" | "Home" | "SignIn" | "SignUp" | "Default" | "OnQuiz";
  title?: string;
  sessionId?: string;
}

type QuizWindow = Window &
  typeof globalThis & {
    setQuizPaused?: (paused: boolean) => void;
  };

export default function Navbar({ State, title, sessionId }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout: handleLogout, isLoggingOut } = useLogout();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ← New state for profile dropdown
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [quizCategoryName, setQuizCategoryName] = useState<string>(title || "Quiz");

  const [dashboardHref, setDashboardHref] = useState<string | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const lastScrollY = useRef(0);
  const accumulatedScroll = useRef(0);
  const lastDirection = useRef<"up" | "down" | null>(null);

  const supabase = createClient();

  // ✅ HYBRID TIMER
  const {
    timeLeft: remainingSeconds,
    isPaused,
    setIsPaused,
    refetch,
  } = useHybridQuizTimer({
    sessionId: sessionId || "",
  });

  useEffect(() => {
    if (State !== "Home") return;

    async function checkUserAndSetLink() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setDashboardHref("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      const isAdmin = profile?.is_admin === true;
      setDashboardHref(isAdmin ? "/admin" : "/dashboard");
    }

    checkUserAndSetLink();
  }, [State, supabase]);

  useEffect(() => {
    if (State !== "OnQuiz" || !sessionId) return;

    async function loadCategory() {
      const { data: session } = await supabase
        .from("quiz_sessions")
        .select("category_id")
        .eq("id", sessionId)
        .single();

      if (session?.category_id) {
        const { data: cat } = await supabase
          .from("categories")
          .select("name")
          .eq("id", session.category_id)
          .single();

        if (cat?.name) setQuizCategoryName(cat.name);
      }
    }

    loadCategory();
  }, [State, sessionId, supabase]);

  useEffect(() => {
    const hasScrollBehavior = State === "Home" || State === "Default";
    if (!hasScrollBehavior) return;

    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const distance = currentScrollY - lastScrollY.current;
      const direction = distance > 0 ? "down" : "up";

      setIsAtTop(currentScrollY < 12);

      if (direction !== lastDirection.current) {
        accumulatedScroll.current = 0;
        lastDirection.current = direction;
      }

      accumulatedScroll.current += distance;

      if (currentScrollY < 12) {
        setIsHeaderVisible(true);
        accumulatedScroll.current = 0;
      } else if (isMobileMenuOpen || isProfileOpen) {
        setIsHeaderVisible(true);
      } else if (accumulatedScroll.current > 32) {
        setIsHeaderVisible(false);
        accumulatedScroll.current = 0;
      } else if (accumulatedScroll.current < -16) {
        setIsHeaderVisible(true);
        accumulatedScroll.current = 0;
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [State, isMobileMenuOpen, isProfileOpen]);

  useEffect(() => {
    if (State !== "Home") return;

    const sectionIds = [
      "home",
      "why-revview",
      "coverage",
      "how-it-works",
      "products",
      "coming-soon",
      "blog",
    ];
    let animationFrame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.35;
        let currentSection = sectionIds[0];

        for (const sectionId of sectionIds) {
          const section = document.getElementById(sectionId);
          if (section && section.offsetTop <= marker) {
            currentSection = sectionId;
          }
        }

        setActiveSection(currentSection);
      });
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [State]);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: ProgressTracking },
    { href: "/feedbacks", label: "Feedback", icon: ShowFeedback },
    { href: "/manage-questions", label: "Questions", icon: Questions },
    { href: "/manage-blogs", label: "Blogs", icon: Blog },
    { href: "/admin-account", label: "Account Settings", icon: AccountSettings },
    { href: "/affiliate", label: "Manage Affiliate", icon: Affiliate },
  ];

  const publicNavItems = [
    { href: "/#home", label: "Home" },
    { href: "/#why-revview", label: "Why RevView" },
    { href: "/#coverage", label: "Coverage" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/#products", label: "Products" },
    { href: "/#coming-soon", label: "Coming soon" },
    { href: "/#blog", label: "Blog" },
  ];

  const hasScrollBehavior = State === "Home" || State === "Default";
  const isTransparent =
    hasScrollBehavior && isAtTop && !isMobileMenuOpen && !isProfileOpen;

  const handlePauseClick = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase.rpc("pause_quiz_session", {
        p_session_id: sessionId,
      });

      if (error) throw error;

      setIsPauseModalOpen(true);
      setIsPaused(true);
      (window as QuizWindow).setQuizPaused?.(true);
    } catch (err: unknown) {
      console.error("Pause failed:", err);
      toast.error("Failed to pause quiz");
    }
  };

  const handleResume = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase.rpc("resume_quiz_session", {
        p_session_id: sessionId,
      });

      if (error) throw error;

      setIsPauseModalOpen(false);
      setIsPaused(false);
      (window as QuizWindow).setQuizPaused?.(false);

      refetch();
    } catch (err: unknown) {
      console.error("Resume failed:", err);
      toast.error("Failed to resume quiz");
    }
  };

  const handleRestart = async () => {
    if (!sessionId) return;

    setIsPauseModalOpen(false);
    setIsPaused(false);
    (window as QuizWindow).setQuizPaused?.(false);

    try {
      const { error: e1 } = await supabase
        .from("quiz_answers")
        .delete()
        .eq("quiz_session_id", sessionId);

      const { error: e2 } = await supabase
        .from("quiz_sessions")
        .delete()
        .eq("id", sessionId);

      if (e1 || e2) throw e1 || e2;

      router.push("/quiz-selection");
    } catch (err) {
      console.error("Restart failed:", err);
      toast.error("Failed to restart quiz");
    }
  };

  const handleExitToDashboard = async () => {
    if (!sessionId) {
      router.push("/dashboard");
      return;
    }

    setIsPauseModalOpen(false);
    setIsPaused(false);
    (window as QuizWindow).setQuizPaused?.(false);

    try {
      const { error: e1 } = await supabase
        .from("quiz_answers")
        .delete()
        .eq("quiz_session_id", sessionId);

      const { error: e2 } = await supabase
        .from("quiz_sessions")
        .delete()
        .eq("id", sessionId);

      if (e1 || e2) throw e1 || e2;
    } catch (err) {
      console.error("Exit failed:", err);
    }

    router.push("/dashboard");
  };

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 transform-gpu transition-[transform,opacity,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isHeaderVisible || !hasScrollBehavior
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-full opacity-0"
        } ${
          isTransparent
            ? "border-b border-transparent bg-transparent shadow-none"
            : "border-b border-border/80 bg-background/90 shadow-sm backdrop-blur-xl"
        }`}
      >
        <div className="relative mx-auto flex min-h-16 max-w-screen-3xl flex-wrap items-center justify-between gap-y-1 px-4 py-2 md:flex-nowrap md:px-6 lg:min-h-20 lg:px-8">
          {/* Logo + Brand */}
          <Link
            href={`${State === "OnQuiz" ? "" : "/"}`}
            className="relative z-10"
          >
            <Image
              src={
                State === "Home" && isTransparent
                  ? "/Long-logo-white.svg"
                  : "/Long-logo.svg"
              }
              alt="RevView Logo"
              width={40}
              height={40}
              className="h-auto w-30 lg:w-40"
              loading="eager"
            />
          </Link>

          {/* CENTER DESKTOP NAV – only when logged in */}
          {State === "LoggedIn" && (
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-0.5 xl:flex 2xl:gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-1.5 whitespace-nowrap
                      px-2.5 py-2 text-sm font-medium 2xl:px-4 2xl:text-base
                      transition-colors duration-150
                      ${
                        isActive
                          ? "text-primary font-bold border-b-2 border-b-primary"
                          : "text-muted-foreground hover:text-primary hover:border-b-primary"
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {State === "Home" && (
            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-1 xl:flex xl:gap-2">
              {publicNavItems.map((item) => {
                const sectionId = item.href.split("#")[1];
                const isActive = activeSection === sectionId;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:origin-center after:rounded-full after:transition-transform after:duration-300 xl:px-3 xl:after:inset-x-3 ${
                      isActive
                        ? isTransparent
                          ? "text-white after:scale-x-100 after:bg-white"
                          : "text-primary after:scale-x-100 after:bg-primary"
                        : isTransparent
                        ? "text-white/80 hover:bg-white/10 hover:text-white"
                        : "text-muted-foreground hover:bg-primary/8 hover:text-primary"
                    } ${
                      isActive ? "" : "after:scale-x-0"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}

          {State === "Default" && (
            <div className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-1/2 min-w-0 -translate-x-1/2 items-center justify-center md:flex md:max-w-xl">
              <p className="w-full truncate text-center text-base font-semibold text-foreground lg:text-lg">
                {title}
              </p>
            </div>
          )}

          {/* Quiz Title in Center */}
          {State === "OnQuiz" && (
            <div className="hidden flex-1 text-center text-base font-bold text-foreground md:block lg:text-lg">
              {quizCategoryName}
            </div>
          )}

          {/* RIGHT SIDE */}
          <div className="relative z-10 flex items-center gap-2 md:gap-3 lg:gap-4">
            {State === "OnQuiz" && remainingSeconds !== null ? (
              <>
                <CountDownTimer
                  initialSeconds={remainingSeconds}
                  isPaused={isPaused}
                />
                <Button
                  leftIcon={<Pause className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"/>}
                  textColor="text-foreground/85"
                  backgroundColor="bg-muted-foreground/25"
                  onClick={handlePauseClick}
                />
              </>
            ) : State === "LoggedIn" ? (
              <>
                {/* Desktop Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`
                    hidden xl:flex items-center gap-2.5 px-3 2xl:px-4 py-2
                    text-sm 2xl:text-base font-medium transition-opacity bg-destructive/10 rounded-lg
                    ${
                      isLoggingOut
                        ? "opacity-50 cursor-not-allowed"
                        : "text-destructive hover:opacity-80"
                    }
                  `}
                >
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  <Logout className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                </button>

                {/* Mobile Hamburger */}
                <button
                  type="button"
                  className="rounded-full border border-border p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground xl:hidden"
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                  aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="admin-mobile-navigation"
                >
                  {isMobileMenuOpen ? (
                    <Close className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </>
            ) : State === "Home" ? (
              dashboardHref === null ? (
                <button
                  disabled
                  className="px-5 sm:px-6 py-2 bg-primary/50 text-primary-foreground/70 font-medium rounded-lg shadow-sm cursor-wait"
                >
                  Loading...
                </button>
              ) : dashboardHref === "/login" ? (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 active:bg-primary/95 transition text-xs md:text-sm lg:text-base"
                >
                  Sign In
                </Link>
              ) : (
                <div className="relative flex items-center gap-3">
                  <Link
                    href={dashboardHref}
                    className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg shadow-sm hover:bg-primary/90 active:bg-primary/95 transition text-xs md:text-sm lg:text-base"
                  >
                    Dashboard
                  </Link>

                  {/* Profile Dropdown Trigger */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`p-2 rounded-full border transition-colors flex items-center justify-center ${isTransparent ? "text-muted border-muted hover:bg-white hover:border-muted-foreground hover:text-muted-foreground"  : "text-muted-foreground border-muted-foreground hover:bg-muted"}`}
                    aria-label="Profile menu"
                  >
                    <User className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/user-account"
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        <span>My Account</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-muted transition-colors disabled:opacity-50"
                      >
                        <Logout className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : State === "SignIn" ? (
              <div className="flex items-center text-muted-foreground text-base">
                <span className="hidden md:inline">Don&apos;t have an account?</span>
                <Link
                  href="/signup"
                  className="text-primary font-semibold hover:underline ml-1.5"
                >
                  Sign up
                </Link>
              </div>
            ) : State === "SignUp" ? (
              <div className="flex items-center text-muted-foreground text-base">
                <span className="hidden md:inline">Already have an account?</span>
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline ml-1.5"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary md:px-4 md:text-sm"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                <span className="hidden sm:inline">Back home</span>
              </Link>
            )}

            {State === "Home" && (
              <button
                type="button"
                className={`rounded-full border p-2 transition xl:hidden ${isTransparent ? "text-muted border-muted hover:bg-white hover:border-muted-foreground hover:text-muted-foreground"  : "text-muted-foreground border-muted-foreground hover:bg-muted"}`}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <Close className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                ) : (
                  <Menu className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                )}
              </button>
            )}
          </div>

          {(State === "Default" || State === "OnQuiz") && (
            <div className="flex w-full basis-full items-center justify-center px-2 pb-0.5 pt-1 md:hidden">
              <p className="w-full text-center text-sm font-semibold leading-snug text-foreground">
                {State === "OnQuiz" ? quizCategoryName : title}
              </p>
            </div>
          )}
        </div>

        {State === "Home" && isMobileMenuOpen && (
          <div className="border-t border-border/80 bg-background/95 px-4 py-4 shadow-lg backdrop-blur-xl xl:hidden">
            <nav
              aria-label="Homepage sections"
              className="mx-auto grid max-w-screen-3xl grid-cols-2 gap-2 sm:grid-cols-3"
            >
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={
                    activeSection === item.href.split("#")[1]
                      ? "location"
                      : undefined
                  }
                  className={`rounded-xl px-3 py-3 text-sm font-medium transition hover:bg-primary/8 hover:text-primary ${
                    activeSection === item.href.split("#")[1]
                      ? "text-primary underline decoration-2 underline-offset-4"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

      </nav>

      {/* Logged-in mobile and tablet navigation must sit outside the transformed header. */}
      {State === "LoggedIn" && isMobileMenuOpen && (
        <div
          id="admin-mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-border bg-background/95 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-300 lg:top-20 xl:hidden"
        >
          <nav
            aria-label="Admin navigation"
            className="mx-auto flex min-h-full max-w-screen-3xl flex-col gap-1.5 px-4 py-5 sm:px-6 lg:px-8"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors md:px-5 md:py-4 md:text-base ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="mt-auto border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isLoggingOut}
                className={`flex w-full items-center gap-3 rounded-xl bg-destructive/10 px-4 py-3.5 text-sm font-medium text-destructive transition hover:bg-destructive/15 md:px-5 md:py-4 md:text-base ${
                  isLoggingOut ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <Logout className="h-5 w-5 shrink-0" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {State === "OnQuiz" && (
        <PauseModal
          isOpen={isPauseModalOpen}
          onClose={handleResume}
          onRestart={handleRestart}
          onExit={handleExitToDashboard}
        />
      )}
    </>
  );
}
