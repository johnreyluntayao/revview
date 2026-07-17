import { ManageQuestions, NavBar } from "@/lib/client-imports";

const QuestionManagementPage = () => {
  return (
    <>
      <NavBar State="LoggedIn" />
      <ManageQuestions />
    </>
  );
};

export default QuestionManagementPage;
