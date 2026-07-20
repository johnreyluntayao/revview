import { AccountSettings, NavBar } from "@/lib/client-imports";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth-guards";

const AdminAccountPage = async () => {
  const supabase = await createClient();

  const user = await requireAdmin();

  const { data: profile } = await supabase
    .from("users")
    .select("name, username, email")
    .eq("id", user.id)
    .single();

  const userInfo = {
    fullName: profile?.name ?? "",
    username: profile?.username ?? "",
    email: profile?.email ?? user.email ?? "",
  };

  return (
    <>
      <NavBar State="LoggedIn" />
      <AccountSettings userInfo={userInfo} role="admin" />
    </>
  );
};

export default AdminAccountPage;
