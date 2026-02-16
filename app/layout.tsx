import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",     
  display: "swap",             
  weight: ["400", "500", "600", "700", "800"], 
});

export const metadata: Metadata = {
  title: "RevView",
  description: "A reviewing web application for CSE",
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
        {children}
      </body>
    </html>
  );
}