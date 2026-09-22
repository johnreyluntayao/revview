import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Quiz, NavBar } from "@/lib/client-imports";

export default async function QuizPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: session, error } = await supabase
    .from("quiz_sessions")
    .select(`
      *,
      categories(name)
    `)
    .eq("id", sessionId)
    .single();

  if (error || !session) {
    redirect("/dashboard?error=invalid_session");
  }

  if (session.user_id !== user.id) {
    redirect("/dashboard?error=unauthorized");
  }

  if (session.is_completed) {
    redirect("/dashboard?message=quiz_already_completed");
  }

  const categoryName = session.session_mode === "full_exam"
    ? "Civil Service Full Exam"
    : session.categories?.name
      ? session.categories.name
      : "All Categories";

  return (
    <main className="min-h-screen bg-background">
      <NavBar 
        State="OnQuiz" 
        sessionId={sessionId} 
        title={categoryName} 
      />
      <Quiz sessionId={sessionId} navigationTitle={categoryName} />
    </main>
  );
}
