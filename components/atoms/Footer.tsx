import Image from "next/image";

const footerData = {
  menuItems: [
    { name: "Contact", href: "/contact" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],

  socialLinks: [
    { name: "Facebook", icon: "𝐟", href: "https://facebook.com" },
    { name: "Twitter", icon: "𝕏", href: "https://twitter.com" },
    { name: "LinkedIn", icon: "in", href: "https://linkedin.com" },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-hero2 text-white w-full px-4 md:px-6 py-12 md:py-16 lg:px-8">
      <div className=" p-4 md:p-6 lg:p-8 flex flex-wrap items-center justify-between gap-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 order-1">
          <Image
            src="/Long-logo-white.svg"
            alt="RevView Logo"
            width={100} 
            height={100} 
            className="w-32 h-18 lg:w-54 lg:h-30" 
            loading="eager"
          />
        </div>

        {/* Social Links */}
        <div className="flex gap-4 order-2 lg:order-3">
          {footerData.socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-lg transition-all hover:scale-110"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Navigation Menu */}
        <div className="flex gap-8 text-xs md:text-sm lg:text-md w-full justify-center order-3 lg:order-2 lg:w-auto lg:justify-start text-primary-foreground/80">
          {footerData.menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-purple-400 transition-colors duration-200"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t text-primary-foreground/80 border-primary-foreground/20 pt-8 text-center text-xs md:text-sm lg:text-md">
        © {year} CSE Reviewer. All rights reserved.
      </div>
    </footer>
  );
}
