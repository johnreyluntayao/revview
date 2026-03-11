import { NavBar, AccountSettings } from "@/lib/client-imports"
import { createClient } from "@/lib/supabase/server"

const page = async () => {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser();
const { data: profile } = await supabase
  .from('users')
  .select('name, username, email')
  .eq('id', user?.id)
  .single();

const userInfo = {
  id: user?.id!,
  fullName: profile?.name ?? "",
  username: profile?.username ?? "",
  email: profile?.email ?? user?.email ?? "",
};

  return (
    <main>
      <NavBar State="LoggedIn" />
      <AccountSettings userInfo={userInfo} role="admin" />
    </main>
  )
}

export default page