import { QuizResult, NavBar } from "@/lib/client-imports";

const page = async ({ params }: { params: Promise<{ sessionId: string }> }) => {
  const { sessionId } = await params;

  return (
    <main>
      <NavBar State="Default" title="Quiz Results" />
      <QuizResult sessionId={sessionId} />
    </main>
  );
};

export default page;