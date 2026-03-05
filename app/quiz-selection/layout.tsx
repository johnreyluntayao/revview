"use client";

import { useState } from "react";
import { Sidebar } from "@/lib/imports";
import { Menu } from "@/lib/icons";
import { Metadata } from "next";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  return (
    <>
      <button
        className={`lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-white rounded-lg shadow-md border border-border ${isSidebarOpen ? "hidden" : "block"}`}
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-foreground" />
      </button>

      <div className="flex min-h-screen ">
        <Sidebar
          userName="Johnrey"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1">{children}</main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
}