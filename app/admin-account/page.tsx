import { redirect } from "next/navigation";
import { AccountSettings, NavBar } from "@/lib/client-imports";
import { createClient } from "@/lib/supabase/server";

const AdminAccountPage = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
