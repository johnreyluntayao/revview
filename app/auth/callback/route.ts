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

  console.log("OAuth success - user ID:", user.id);

  const redirectPath = "/dashboard";

  const finalUrl = new URL(redirectPath, request.url);

  return NextResponse.redirect(finalUrl);
}