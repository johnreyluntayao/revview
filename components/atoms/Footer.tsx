import Image from "next/image";
import Link from "next/link";

const footerData = {
  menuItems: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ],

  socialLinks: [
    { name: "Facebook", label: "f", href: "https://facebook.com" },
    { name: "X", label: "X", href: "https://twitter.com" },
    { name: "LinkedIn", label: "in", href: "https://linkedin.com" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-hero2 px-4 py-10 text-white md:px-6 md:py-12 lg:px-8">
      <div className="mx-auto flex max-w-screen-3xl flex-col items-center gap-8 text-center md:flex-row md:justify-between md:text-left">
        <Link href="/" aria-label="RevView homepage" className="inline-flex w-fit">
          <Image
            src="/Long-logo-white.svg"
            alt="RevView Logo"
            width={160}
            height={72}
            className="h-auto w-32 lg:w-40"
            style={{ height: "auto" }}
            loading="eager"
          />
        </Link>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-primary-foreground/80"
        >
          {footerData.menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex justify-center gap-3">
          {footerData.socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-sm font-semibold transition hover:bg-white/20"
              aria-label={social.name}
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-screen-3xl border-t border-primary-foreground/20 pt-6 text-center text-xs text-primary-foreground/70 md:text-sm">
        &copy; {year} RevView. All rights reserved.
      </div>
    </footer>
  );
}
