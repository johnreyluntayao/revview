import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const adminRoutes = [
  "/admin",
  "/feedbacks",
  "/manage-questions",
  "/manage-blogs",
  "/admin-account",
  "/affiliate",
  "/boost",
];

const learnerRoutes = [
  "/dashboard",
  "/quiz-result",
  "/user-account",
  "/quiz-selection",
  "/results-history",
  "/quiz",
];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  const redirectWithCookies = (url: URL) => {
    const headers = new Headers(supabaseResponse.headers);
    headers.set("Location", url.toString());
    return new NextResponse(null, { status: 307, headers });
  };

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return redirectWithCookies(redirectUrl);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.is_admin === true;

  if (isAdmin && matchesRoute(pathname, learnerRoutes)) {
    return redirectWithCookies(new URL("/admin", request.url));
  }

  if (!isAdmin && matchesRoute(pathname, adminRoutes)) {
    return redirectWithCookies(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
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
    "/quiz-selection/:path*",
    "/results-history/:path*",
    "/quiz/:path*",
    "/affiliate/:path*",
    "/boost/:path*",
  ],
};
