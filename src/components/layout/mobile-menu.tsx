"use client";

import { useState } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  cy: string;
  en: string;
}

interface MobileMenuProps {
  navLinks: NavLink[];
  /** When true, show the dashboard link instead of join/login. */
  isLoggedIn: boolean;
}

export function MobileMenu({ navLinks, isLoggedIn }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cau'r ddewislen / Close menu" : "Agor y ddewislen / Open menu"}
        onClick={() => setOpen(!open)}
        className="md:hidden p-2 text-[#0A4B68] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68] rounded-sm"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden
        >
          {open ? (
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

      {/* Dropdown panel */}
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Llywio symudol / Mobile navigation"
          className="md:hidden absolute top-full left-0 right-0 bg-[#EEE8D8] border-t border-[#0A4B68]/10 px-4 pb-4 z-50"
        >
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ href, cy, en }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-2 py-2 text-[#0A4B68] hover:text-[#C07E00] transition-colors"
                >
                  <span className="font-display font-semibold">{cy}</span>
                  <span className="text-sm italic opacity-60">{en}</span>
                </Link>
              </li>
            ))}

            {/* Divider */}
            <li aria-hidden className="border-t border-[#0A4B68]/10 my-1" />

            {isLoggedIn ? (
              <li>
                <Link
                  href="/aelodau"
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-2 py-2 text-[#C07E00] font-display font-semibold hover:text-[#0A4B68] transition-colors"
                >
                  <span lang="cy">Fy Nghyfrif</span>
                  <span className="text-sm italic opacity-70" lang="en">/ My Account</span>
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/mewngofnodi"
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-2 py-2 text-[#0A4B68] hover:text-[#C07E00] transition-colors"
                  >
                    <span lang="cy">Mewngofnodi</span>
                    <span className="text-sm italic opacity-60" lang="en">/ Log in</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/ymuno"
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-2 py-2 text-[#C07E00] font-display font-semibold hover:text-[#0A4B68] transition-colors"
                  >
                    <span lang="cy">Ymuno</span>
                    <span className="text-sm italic opacity-70" lang="en">/ Join</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}
    </>
  );
}
