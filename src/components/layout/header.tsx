"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "/am-ni", cy: "Amdanom Ni", en: "About" },
  { href: "/prosiectau", cy: "Prosiectau", en: "Projects" },
  { href: "/newyddion", cy: "Newyddion", en: "News" },
  { href: "/cyfrannu", cy: "Cyfrannu", en: "Volunteer" },
  { href: "/cysylltu", cy: "Cysylltu", en: "Contact" },
];

const memberLinks: { href: string; cy: string; en: string; isPrimary?: boolean }[] = [
  { href: "/mewngofnodi", cy: "Mewngofnodi", en: "Log in" },
  { href: "/ymuno", cy: "Ymuno", en: "Join", isPrimary: true },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#EEE8D8]/95 backdrop-blur-sm border-b border-[#0A4B68]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Wordmark */}
          <Link
            href="/"
            className="flex flex-col leading-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68] rounded-sm"
          >
            <span className="font-display text-[#0A4B68] text-lg font-bold tracking-tight">
              Ynni Cymunedol
            </span>
            <span className="text-[#0A4B68] text-xs tracking-[0.2em] uppercase font-medium">
              Llanfairfechan
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Prif lywio / Main navigation" className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, cy, en }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col leading-none text-[#0A4B68] hover:text-[#C07E00] transition-colors"
              >
                <span className="font-display text-sm font-semibold">{cy}</span>
                <span className="text-xs italic opacity-60 group-hover:opacity-80">{en}</span>
              </Link>
            ))}

            {memberLinks.map(({ href, cy, en, isPrimary }) =>
              isPrimary ? (
                <Link
                  key={href}
                  href={href}
                  className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium hover:bg-[#083a52] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                >
                  <span lang="cy">{cy}</span>
                  <span className="opacity-60 text-xs italic" lang="en">/ {en}</span>
                </Link>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="group flex flex-col leading-none text-[#0A4B68] hover:text-[#C07E00] transition-colors"
                >
                  <span className="font-display text-sm font-semibold">{cy}</span>
                  <span className="text-xs italic opacity-60 group-hover:opacity-80">{en}</span>
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cau'r ddewislen / Close menu" : "Agor y ddewislen / Open menu"}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-[#0A4B68] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68] rounded-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Llywio symudol / Mobile navigation"
          className="md:hidden bg-[#EEE8D8] border-t border-[#0A4B68]/10 px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ href, cy, en }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-baseline gap-2 py-2 text-[#0A4B68] hover:text-[#C07E00] transition-colors"
                >
                  <span className="font-display font-semibold">{cy}</span>
                  <span className="text-sm italic opacity-60">{en}</span>
                </Link>
              </li>
            ))}
            {memberLinks.map(({ href, cy, en, isPrimary }) => (
              <li key={href} className={isPrimary ? "pt-2" : ""}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={
                    isPrimary
                      ? "flex items-baseline gap-2 py-2 text-[#C07E00] font-display font-semibold hover:text-[#0A4B68] transition-colors"
                      : "flex items-baseline gap-2 py-2 text-[#0A4B68] hover:text-[#C07E00] transition-colors"
                  }
                >
                  <span lang="cy">{cy}</span>
                  <span className="text-sm italic opacity-70" lang="en">/ {en}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
