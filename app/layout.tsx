import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/next"

import { AuthProvider } from "@/components/auth/AuthProvider";

// Keep generated canonicals, metadata, and structured data aligned with the
// production hostname configured in Vercel. The apex domain redirects here.
const siteUrl = new URL("https://www.revview.online");
const siteTitle = "RevView: Free Civil Service Exam Reviewer Philippines";
const siteDescription =
  "Prepare for the Philippine Civil Service Exam with free CSE-PPT practice quizzes, answer explanations, progress tracking, and Professional and Subprofessional review resources.";

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
    "RevView Online",
    "Civil Service Exam reviewer Philippines",
    "free Civil Service Exam reviewer",
    "Philippine Civil Service Exam reviewer",
    "Civil Service Exam 2026 reviewer",
    "CSC exam reviewer",
    "Civil Service Exam reviewer",
    "CSE reviewer",
    "CSE-PPT reviewer",
    "CSE Professional reviewer",
    "CSE Subprofessional reviewer",
    "Civil Service Exam practice test",
    "Civil Service Exam mock exam",
    "Civil Service Exam practice questions",
    "online CSE reviewer",
  ],
  authors: [{ name: "RevView" }],
  creator: "RevView",
  publisher: "RevView",
  category: "education",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/Icon.svg", type: "image/svg+xml", sizes: "any" }],
    shortcut: "/Icon.svg",
    apple: "/Icon.svg",
  },
  manifest: "/manifest.webmanifest",
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
                  "@id": "https://www.revview.online/#organization",
                  name: "RevView",
                  alternateName: "RevView Online",
                  url: "https://www.revview.online",
                  description: siteDescription,
                  logo: {
                    "@type": "ImageObject",
                    url: "https://www.revview.online/Icon.svg",
                    contentUrl: "https://www.revview.online/Icon.svg",
                    width: 336,
                    height: 336,
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.revview.online/#website",
                  name: "RevView",
                  alternateName: ["RevView Online", "RevView CSE Reviewer"],
                  url: "https://www.revview.online",
                  description: siteDescription,
                  publisher: {
                    "@id": "https://www.revview.online/#organization",
                  },
                  inLanguage: "en-PH",
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
