"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface UseHybridQuizTimerProps {
  sessionId: string;
  onExpire?: () => void;
}

export function useHybridQuizTimer({ sessionId, onExpire }: UseHybridQuizTimerProps) {
  const [supabase] = useState(() => createClient());

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // 🔹 Fetch from server (authoritative)
  const fetchFromServer = useCallback(async () => {
    if (!sessionId) return;

    const { data: remaining } = await supabase.rpc(
      "get_quiz_remaining_seconds",
      { p_session_id: sessionId }
    );

    const { data: session } = await supabase
      .from("quiz_sessions")
      .select("is_paused")
      .eq("id", sessionId)
      .single();

    if (session) setIsPaused(session.is_paused);

    if (remaining !== null) {
      setTimeLeft((prev) => {
        if (prev === null) return remaining;

        // correct only if drift > 2s
        if (Math.abs(prev - remaining) > 2) {
          return remaining;
        }

        return prev;
      });
    }
  }, [sessionId, supabase]);

  // 🔹 Initial load
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchFromServer();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [fetchFromServer]);

  // 🔹 Smooth countdown (client)
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(interval);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isPaused, onExpire]);

  // 🔹 Server resync every 5s
  useEffect(() => {
    if (!sessionId) return;

    const interval = setInterval(() => {
      if (!isPaused) fetchFromServer();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchFromServer, isPaused, sessionId]);

  return {
    timeLeft,
    isPaused,
    setIsPaused,
    refetch: fetchFromServer,
  };
}
