import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return user;
});

export const requireAdmin = cache(async () => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || profile?.is_admin !== true) redirect("/dashboard");

  return user;
});

export const requireQuizResultOwner = cache(async (sessionId: string) => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("id, is_completed")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!session) redirect("/dashboard?error=invalid_result");
  if (!session.is_completed) redirect(`/quiz/${sessionId}`);

  return user;
});
