import { CustomizeQuiz, SubmitFeedback } from "@/lib/client-imports";

const QuizSelectionPage = () => {
  return (
    <main className="min-h-screen">
      <CustomizeQuiz />
      <SubmitFeedback />
    </main>
  );
};

export default QuizSelectionPage;
