import { SubmitFeedback } from "@/lib/client-imports";
import { UserDashboard } from "@/lib/server-imports";

const DashboardPage = () => {
  return (
    <>
      <UserDashboard />
      <SubmitFeedback />
    </>
  );
};

export default DashboardPage;
