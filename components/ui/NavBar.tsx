"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";     
import Link from "next/link";
import { 
  AllCategories, 
  ProgressTracking, 
  ShowFeedback, 
  Questions, 
  AccountSettings, 
  Logout, 
  Menu, 
  Close 
} from "@/lib/icons";

interface NavbarProps {
  State: "LoggedIn" | "Home" | "SignIn" | "SignUp";
}

export default function Navbar({ State }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();                   

  const navItems = [
    { href: "/admin",        label: "Dashboard",       icon: ProgressTracking },
    { href: "/feedback",     label: "Feedback",        icon: ShowFeedback },
    { href: "/questions",    label: "Questions",       icon: Questions },
    { href: "/account",      label: "Account Settings", icon: AccountSettings },
  ];

  return (
    <nav className="relative top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo + Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-linear-to-br from-primary to-secondary rounded-md flex items-center justify-center shadow-sm">
            <AllCategories className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            RevView
          </span>
        </div>

        {/* CENTER DESKTOP NAV – only when logged in */}
        {State === "LoggedIn" && (
          <div className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 
                    px-4 py-2 text-sm font-medium 
                    transition-colors duration-150
                    ${isActive 
                      ? "text-primary font-bold border-b-2 border-b-primary" 
                      : "text-muted-foreground hover:text-primary hover:border-b-primary"
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">
          {State === "LoggedIn" ? (
            <>
              {/* Desktop profile indicator */}
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5"
              >
                
                <span className="text-sm font-medium text-destructive">Logout</span>
                <div className="flex items-center justify-center">
                  <Logout className="w-4 h-4 text-destructive" />
                </div>
              </Link>

              {/* Mobile Hamburger – only when logged in */}
              <button
                className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <Close className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          ) : State === "Home" ? (
            <Link
              href="/login"
              className="
                px-5 sm:px-6 py-2 
                bg-primary text-primary-foreground 
                text-sm font-medium 
                rounded-lg shadow-sm 
                hover:bg-primary/90 active:bg-primary/95 
                transition
              "
            >
              Sign In
            </Link>
          ) : State === "SignIn" ? (
           <div className="flex text-muted-foreground">
            <p className="hidden md:block">Don't have an account?</p>
            <a href="/signup" className="text-primary font-semibold hover:underline ml-1">
              Sign up
            </a>
          </div>
          ):(
            <div className="flex text-muted-foreground">
            <p className=" hidden md:block">Already have an account?</p>
            <a href="/login" className="text-primary font-semibold hover:underline ml-1">
              Sign in
            </a>
          </div>
          )
        }
        </div>
      </div>

      {/* MOBILE MENU */}
      {State === "LoggedIn" && isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm border-t border-border z-50 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="max-w-screen-2xl mx-auto px-4 py-6 flex flex-col gap-2 bg-white/90 h-screen">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 
                    px-4 py-3 text-base font-medium 
                    transition-colors duration-150 rounded-lg
                    ${isActive 
                      ? "text-primary font-bold border-b-2 border-b-primary" 
                      : "text-muted-foreground hover:text-primary hover:border-b-primary"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Extra mobile-only profile link */}
            <div className="mt-6 pt-5 border-t border-border">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-5 py-3.5 text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium text-destructive">Logout</span>
                <div className="flex items-center justify-center">
                  <Logout className="w-4 h-4 text-destructive" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}