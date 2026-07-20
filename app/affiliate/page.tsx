import { AdminAffiliate, NavBar } from "@/lib/client-imports";
import { requireAdmin } from "@/lib/auth-guards";

const AffiliateManagementPage = async () => {
  await requireAdmin();

  return (
    <>
      <NavBar State="LoggedIn" />
      <AdminAffiliate />
    </>
  );
};

export default AffiliateManagementPage;
