"use client";

import { useState, useEffect } from "react";
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
  User2,
  Affiliate,
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

export default function Navbar({ State, title, sessionId }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout: handleLogout, isLoggingOut } = useLogout();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // ← New state for profile dropdown
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [quizCategoryName, setQuizCategoryName] = useState<string>(title || "Quiz");

  const [dashboardHref, setDashboardHref] = useState<string | null>(null);

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

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: ProgressTracking },
    { href: "/feedbacks", label: "Feedback", icon: ShowFeedback },
    { href: "/manage-questions", label: "Questions", icon: Questions },
    { href: "/admin-account", label: "Account Settings", icon: AccountSettings },
    { href: "/affiliate", label: "Manage Affiliate", icon: Affiliate },
  ];

  const handlePauseClick = async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase.rpc("pause_quiz_session", {
        p_session_id: sessionId,
      });

      if (error) throw error;

      setIsPauseModalOpen(true);
      setIsPaused(true);
      (window as any).setQuizPaused?.(true);
    } catch (err: any) {
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
      (window as any).setQuizPaused?.(false);

      refetch();
    } catch (err: any) {
      console.error("Resume failed:", err);
      toast.error("Failed to resume quiz");
    }
  };

  const handleRestart = async () => {
    if (!sessionId) return;

    setIsPauseModalOpen(false);
    setIsPaused(false);
    (window as any).setQuizPaused?.(false);

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
    (window as any).setQuizPaused?.(false);

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
      <nav className="fixed top-0 left-0 right-0 bg-background backdrop-blur-md border-b border-border z-50">
        <div className="max-w-screen-3xl mx-auto px-4 md:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          {/* Logo + Brand */}
          <Link
            href={`${State === "OnQuiz" ? "" : "/"}`}
            className={`${State === "OnQuiz" ? "hidden md:block" : ""}`}
          >
            <Image
              src="/Long-logo.svg"
              alt="RevView Logo"
              width={40}
              height={40}
              className="w-30 h-18 lg:w-40 lg:h-28"
              loading="eager"
            />
          </Link>

          {/* CENTER DESKTOP NAV – only when logged in */}
          {State === "LoggedIn" && (
            <div className="hidden lg:flex items-center justify-center gap-1.5 lg:gap-2 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-1.5 
                      px-4 py-2 text-base font-medium 
                      transition-colors duration-150
                      ${
                        isActive
                          ? "text-primary font-bold border-b-2 border-b-primary"
                          : "text-muted-foreground hover:text-primary hover:border-b-primary"
                      }
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Quiz Title in Center */}
          {State === "OnQuiz" && (
            <div className="flex-1 text-start md:text-center text-sm md:text-base lg:text-lg font-bold text-foreground">
              {quizCategoryName}
            </div>
          )}

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
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
                    hidden lg:flex items-center gap-2.5 px-4 py-2 
                    text-base font-medium transition-opacity bg-destructive/10 rounded-lg
                    ${
                      isLoggingOut
                        ? "opacity-50 cursor-not-allowed"
                        : "text-destructive hover:opacity-80"
                    }
                  `}
                >
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  <Logout className="w-4 h-4" />
                </button>

                {/* Mobile Hamburger */}
                <button
                  className="lg:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <Close className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
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
                    className="p-2 rounded-full hover:bg-muted transition-colors bg-secondary/15 flex items-center justify-center"
                    aria-label="Profile menu"
                  >
                    <User className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-foreground/85" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/user-account"
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
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
                        <Logout className="w-4 h-4" />
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : State === "SignIn" ? (
              <div className="flex items-center text-muted-foreground text-base">
                <span className="hidden md:inline">Don't have an account?</span>
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
              <div className="flex text-muted-foreground">
                <p className="text-xs md:text-sm lg:text-base">{title}</p>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {State === "LoggedIn" && isMobileMenuOpen && (
          <div className="lg:hidden fixed h-screen top-16 left-0 right-0 bottom-0 z-50 bg-white/75 border-t border-border animate-in fade-in slide-in-from-top-5 duration-200 transition-all">
            <div className="mx-auto px-4 py-6 flex flex-col gap-2 h-auto bg-background/95 border border-border">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 md:gap-3 px-4 md:px-5 py-3 md:py-4 font-medium 
                      rounded-lg transition-colors text-sm md:text-base
                      ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted"
                      }
                    `}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile Profile Section (My Account + Logout) */}
              <div className="mt-4 pt-4 border-t border-border">

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  disabled={isLoggingOut}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm md:text-base font-medium rounded-lg bg-destructive/10 mt-2
                    ${
                      isLoggingOut
                        ? "opacity-50 cursor-not-allowed"
                        : "text-destructive"
                    }
                  `}
                >
                  <Logout className="w-5 h-5" />
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

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