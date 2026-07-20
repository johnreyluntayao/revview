import { ManageQuestions, NavBar } from "@/lib/client-imports";
import { requireAdmin } from "@/lib/auth-guards";

const QuestionManagementPage = async () => {
  await requireAdmin();

  return (
    <>
      <NavBar State="LoggedIn" />
      <ManageQuestions />
    </>
  );
};

export default QuestionManagementPage;
