import { QuizResult, NavBar } from "@/lib/client-imports";
import { requireQuizResultOwner } from "@/lib/auth-guards";

const page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;
  await requireQuizResultOwner(sessionId);

  return (
    <main>
      <NavBar State="Default" title="Quiz Results" />
      <QuizResult sessionId={sessionId} />
    </main>
  );
};

export default page;
