"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/lib/client-imports";
import { Menu } from "@/lib/icons";
import Image from "next/image";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string>("Loading...");

  useEffect(() => {
    async function loadUserName() {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setUserName("Guest");
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();

      setUserName(profile?.name ?? "User");
    }

    loadUserName();
  }, []);

  return (
    <>
      {/* Mobile/Tablet Top Bar – scrolls with content, not fixed */}
      <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo + Brand – left side */}
          <Link href="/">
            <Image
            src="/Long-logo.svg"
            alt="RevView Logo"
            width={40}
            height={40}
            className="w-32 h-32 md:w-36 md:h-36"
            />
          </Link>

          {/* Hamburger button – right side */}
          <button
            className="p-2.5 -mr-2 text-foreground hover:bg-muted rounded-lg"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {/* Sidebar Drawer (mobile) / Static Sidebar (desktop) */}
      <div className="flex min-h-screen">
        <Sidebar
          name={userName}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main content – pushed down by header height on mobile */}
        <main className="flex-1 pt-0 lg:pt-0">
          <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen">
            {children}
          </div>
        </main>
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}