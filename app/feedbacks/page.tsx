import { ManageFeedback, NavBar } from "@/lib/client-imports";
import { requireAdmin } from "@/lib/auth-guards";

const FeedbackManagementPage = async () => {
  await requireAdmin();

  return (
    <>
      <NavBar State="LoggedIn" />
      <ManageFeedback />
    </>
  );
};

export default FeedbackManagementPage;
