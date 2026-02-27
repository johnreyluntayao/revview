import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set({ name, value, ...options });
              const response = NextResponse.next();
              response.cookies.set({ name, value, ...options });
              return response;
            });
          } catch {
            // Ignore — common in proxy when called from Server Components
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 1. If not logged in → redirect to login (except public pages)
  if (!user) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin")
    ) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // 2. Logged-in user — fetch is_admin once
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const isAdmin = !!profile?.is_admin;

  // 3. Enforce separation
  if (isAdmin) {
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  } else {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};