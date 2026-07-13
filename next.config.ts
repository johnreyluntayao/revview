import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",     
        pathname: "/storage/v1/object/public/**", 
      },
    ],
  },
  async headers() {
    const noIndexRoutes = [
      "/admin/:path*",
      "/admin-account/:path*",
      "/affiliate/:path*",
      "/auth/:path*",
      "/boost/:path*",
      "/dashboard/:path*",
      "/feedbacks/:path*",
      "/login",
      "/manage-questions/:path*",
      "/quiz/:path*",
      "/quiz-result/:path*",
      "/quiz-selection/:path*",
      "/results-history/:path*",
      "/signup",
      "/test",
      "/user-account/:path*",
    ];

    return noIndexRoutes.map((source) => ({
      source,
      headers: [
        {
          key: "X-Robots-Tag",
          value: "noindex, nofollow",
        },
      ],
    }));
  },
};

export default nextConfig;
