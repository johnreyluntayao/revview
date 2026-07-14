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

  // ── 1. Unauthenticated users ───────────────────────────────────────
  if (!user) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin")    ||
      pathname.startsWith("/feedbacks") ||
      pathname.startsWith("/quiz-result") ||
      pathname.startsWith("/manage-questions") ||
      pathname.startsWith("/manage-blogs") ||
      pathname.startsWith("/user-account") ||
      pathname.startsWith("/admin-account") || 
      pathname.startsWith("/quiz-result") ||
      pathname.startsWith("/quiz-selection") ||
      pathname.startsWith("/results-history") ||
      pathname.startsWith("/quiz") ||
      pathname.startsWith("/affiliate")
    ) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // ── 2. Fetch admin status once ─────────────────────────────────────
  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  const isAdmin = !!profile?.is_admin;

  // ── 3. Role-based route enforcement ────────────────────────────────
  const adminRoutes = ["/admin", "/feedbacks", "/manage-questions", "/manage-blogs", "/admin-account", "/affiliate"];
  const userRoutes = ["/dashboard", "/quiz-result", "/user-account", "/quiz-result", "/quiz-selection", "/results-history", "/quiz"];

  if (isAdmin) {
    if (userRoutes.some(p => pathname === p || pathname.startsWith(p + "/"))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  } else {
    if (adminRoutes.some(p => pathname === p || pathname.startsWith(p + "/"))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/feedbacks/:path*",
    "/quiz-result/:path*",
    "/manage-questions/:path*",
    "/manage-blogs/:path*",
    "/user-account/:path*",
    "/admin-account/:path*",
    "/quiz-result/:path*",
    "/quiz-selection/:path*",
    "/results-history/:path*",
    "/quiz/:path*",
    "/affiliate/:path*",
  ],
};
