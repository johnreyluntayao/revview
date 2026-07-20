import { AccountSettings } from "@/lib/client-imports"
import { createClient } from "@/lib/supabase/server"
import { requireUser } from "@/lib/auth-guards";

const page = async () => {

  const supabase = await createClient()

  const user = await requireUser();
const { data: profile } = await supabase
  .from('users')
  .select('name, username, email')
  .eq('id', user.id)
  .single();

const userInfo = {
  fullName: profile?.name ?? "",
  username: profile?.username ?? "",
  email: profile?.email ?? user.email ?? "",
};

  return (
    <main>
      <AccountSettings userInfo={userInfo} role="user" />
      
    </main>
  )
}

export default page
