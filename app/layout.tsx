import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/next"

import { AuthProvider } from "@/components/auth/AuthProvider";

const siteUrl = new URL("https://revview.online");
const siteTitle = "RevView | Civil Service Exam Reviewer & Practice Tests";
const siteDescription =
  "Practice smarter for the Civil Service Exam with RevView's quizzes, progress tracking, explanations, and curated review resources.";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "RevView",
  title: {
    default: siteTitle,
    template: "%s | RevView",
  },
  description: siteDescription,
  keywords: [
    "RevView",
    "Civil Service Exam reviewer",
    "CSE reviewer",
    "civil service practice test",
    "exam preparation",
    "online review platform",
    "practice quizzes",
  ],
  authors: [{ name: "RevView" }],
  creator: "RevView",
  publisher: "RevView",
  category: "education",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Icon.svg",
    shortcut: "/Icon.svg",
    apple: "/Icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: "RevView",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "RevView exam preparation platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
        <Script
          id="revview-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://revview.online/#organization",
                  name: "RevView",
                  url: "https://revview.online",
                  logo: "https://revview.online/Long-logo.svg",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://revview.online/#website",
                  name: "RevView",
                  url: "https://revview.online",
                  description: siteDescription,
                  publisher: {
                    "@id": "https://revview.online/#organization",
                  },
                  inLanguage: "en",
                },
              ],
            }),
          }}
        />
        <AuthProvider>
          {children}
          <Analytics/>
          <Toaster 
            position="top-right"
            richColors       
            closeButton      
            duration={4000}   
          />
        </AuthProvider>

      </body>
    </html>
  );
}
