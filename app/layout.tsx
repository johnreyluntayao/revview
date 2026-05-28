import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from 'sonner';

import { AuthProvider } from "@/components/auth/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "RevView",
  description: "A reviewing web application for CSE",
  other: {
    "google-adsense-account": "ca-pub-4571981118354444",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.variable}
          antialiased
          min-h-screen
          bg-background
          text-foreground
        `}
      >
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors       
            closeButton      
            duration={4000}   
          />
        </AuthProvider>

        {/* === Google AdSense === */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4571981118354444"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* === Adsterra - Previous Script === */}
        <Script
          async
          src="https://pl29553950.effectivecpmnetwork.com/04/0e/71/040e7186efda1b54c9b663f0f40487ae.js"
          strategy="afterInteractive"
        />

        {/* === Adsterra - Social Bar === */}
        <Script
          async
          src="https://pl29553951.effectivecpmnetwork.com/16/86/0a/16860a7f734b46f926ed2cf87c97b3a2.js"
          strategy="afterInteractive"
        />

        {/* === Adsterra - Smartlink === */}
        <Script
          id="adsterra-smartlink"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var smartlink = "https://www.effectivecpmnetwork.com/iw3s6t78s?key=e05a2c9753650c0d7a4c4b326129803d";
            `,
          }}
        />
        <Script
          async
          src="https://www.effectivecpmnetwork.com/iw3s6t78s/invoke.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}