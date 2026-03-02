import { footerSections } from "@/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 w-full px-4 md:px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm md:text-base lg:text-lg font-semibold uppercase tracking-wider text-white mb-4">
                {section.title}
              </h3>

              {"description" in section && (
                <p className="text-sm leading-relaxed">{section.description}</p>
              )}

              {"links" in section && (
                <ul className="space-y-3 text-xs md:text-sm lg:text-base">
                  {section.links.map((item, i) => {
                    if (typeof item === "string") {
                      return <li key={i}>{item}</li>;
                    }
                    return (
                      <li key={item.label}>
                        <a href={item.href} className="hover:text-gray-200 transition">
                          {item.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          © {year} CSE Reviewer. All rights reserved.
        </div>
    </footer>
  );
}