import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-and-conditions",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",     
        pathname: "/storage/v1/object/public/**", 
      },
      {
        protocol: "https",
        hostname: "**",
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
      "/manage-blogs/:path*",
      "/quiz/:path*",
      "/quiz-result/:path*",
      "/quiz-selection/:path*",
      "/results-history/:path*",
      "/signup",
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
