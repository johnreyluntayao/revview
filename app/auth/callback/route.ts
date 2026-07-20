import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  const supabase = await createClient();

  if (code) {
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("Code exchange failed:", exchangeError);
      const errorUrl = new URL("/login", request.url);
      errorUrl.searchParams.set("error", "Authentication failed - code exchange issue");
      return NextResponse.redirect(errorUrl);
    }
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("No user after callback:", userError);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const redirectPath = profile?.is_admin ? "/admin" : "/dashboard";

  const finalUrl = new URL(redirectPath, request.url);

  return NextResponse.redirect(finalUrl);
}
