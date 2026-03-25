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
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">

          <Link
            href={State === "OnQuiz" ? "#" : "/"}
            className={`${State === "OnQuiz" ? "hidden md:block" : ""}`}
          >
            <Image
              src="/Long-logo.svg"
              alt="RevView Logo"
              width={40}
              height={40}
              className="w-32 h-20 lg:w-40 lg:h-28"
            />
          </Link>

          {State === "OnQuiz" && (
            <div className="flex-1 text-center text-sm md:text-base lg:text-lg font-bold text-foreground">
              {quizCategoryName}
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4">
            {State === "OnQuiz" && remainingSeconds !== null ? (
              <>
                <CountDownTimer
                  initialSeconds={remainingSeconds}
                  isPaused={isPaused}
                />
                <Button
                  leftIcon={<Pause />}
                  textColor="text-foreground"
                  backgroundColor="bg-muted-foreground/25"
                  onClick={handlePauseClick}
                />
              </>
            ) : State === "LoggedIn" ? (
              <>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`hidden lg:flex items-center gap-2.5 px-4 py-2 text-base font-medium transition-opacity bg-destructive/10 rounded-l ${
                    isLoggingOut
                      ? "opacity-50 cursor-not-allowed"
                      : "text-destructive hover:opacity-80"
                  }`}
                >
                  <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                  <Logout className="w-4 h-4" />
                </button>

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
                <button disabled className="px-5 py-2 bg-primary/50 text-primary-foreground/70 rounded-lg">
                  Loading...
                </button>
              ) : dashboardHref === "/login" ? (
                <Link href="/login" className="px-5 py-2 bg-primary text-primary-foreground rounded-lg">
                  Sign In
                </Link>
              ) : (
                <Link href={dashboardHref} className="px-5 py-2 bg-primary text-primary-foreground rounded-lg">
                  Dashboard
                </Link>
              )
            ) : State === "SignIn" ? (
              <div className="flex items-center text-muted-foreground">
                <span className="hidden md:inline">Don't have an account?</span>
                <Link href="/signup" className="text-primary font-semibold ml-1.5">
                  Sign up
                </Link>
              </div>
            ) : State === "SignUp" ? (
              <div className="flex items-center text-muted-foreground">
                <span className="hidden md:inline">Already have an account?</span>
                <Link href="/login" className="text-primary font-semibold ml-1.5">
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="text-xs md:text-sm lg:text-base text-muted-foreground">{title}</div>
            )}
          </div>
        </div>

        {State === "LoggedIn" && isMobileMenuOpen && (
          <div className="lg:hidden fixed h-screen top-16 left-0 right-0 bg-background border-t">
            <div className="px-4 py-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                </Link>
              ))}
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