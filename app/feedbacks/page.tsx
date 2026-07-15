import { ManageFeedback, NavBar } from "@/lib/client-imports";

const FeedbackManagementPage = () => {
  return (
    <>
      <NavBar State="LoggedIn" />
      <ManageFeedback />
    </>
  );
};

export default FeedbackManagementPage;
