import { AdminAffiliate, NavBar } from "@/lib/client-imports";

const AffiliateManagementPage = () => {
  return (
    <>
      <NavBar State="LoggedIn" />
      <AdminAffiliate />
    </>
  );
};

export default AffiliateManagementPage;
