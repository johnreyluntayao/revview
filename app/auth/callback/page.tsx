import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export default async function AuthCallbackPage(request: NextRequest) {
  const supabase = await createClient(); 

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const redirectPath = profile?.is_admin ? "/admin" : "/dashboard";

  return redirect(redirectPath);
}