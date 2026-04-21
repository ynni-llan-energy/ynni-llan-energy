import Link from "next/link";
import { MobileMenu } from "./mobile-menu";

const navLinks = [
  { href: "/am-ni", cy: "Amdanom Ni", en: "About" },
  { href: "/prosiectau", cy: "Prosiectau", en: "Projects" },
  { href: "/newyddion", cy: "Newyddion", en: "News" },
  { href: "/cyfrannu", cy: "Cyfrannu", en: "Volunteer" },
  { href: "/cysylltu", cy: "Cysylltu", en: "Contact" },
];

/**
 * Site header — server component so auth state is available at render time
 * with no client-side flash. The interactive mobile menu toggle is extracted
 * into a separate client component.
 */
export async function Header() {
  // Resolve auth state gracefully: if Supabase isn't configured (e.g. during
  // a cold build without env vars) treat the user as logged-out.
  let isLoggedIn = false;
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch {
    // Supabase not configured — render as logged-out
  }

  return (
    <header className="sticky top-0 z-50 bg-[#EEE8D8]/95 backdrop-blur-sm border-b border-[#0A4B68]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

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
          <nav
            aria-label="Prif lywio / Main navigation"
            className="hidden md:flex items-center gap-6"
          >
            {navLinks.map(({ href, cy, en }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col leading-none text-[#0A4B68] hover:text-[#C07E00] transition-colors"
              >
                <span className="font-display text-sm font-semibold">{cy}</span>
                <span className="text-xs italic opacity-60 group-hover:opacity-80">
                  {en}
                </span>
              </Link>
            ))}

            {/* Auth CTA — grouped visually, separated from nav links */}
            <div className="flex items-center gap-2 ml-2 pl-4 border-l border-[#0A4B68]/15">
              {isLoggedIn ? (
                <Link
                  href="/aelodau"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium hover:bg-[#083a52] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                >
                  <span lang="cy">Fy Nghyfrif</span>
                  <span className="opacity-60 text-xs italic" lang="en">
                    / My Account
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    href="/mewngofnodi"
                    className="text-sm text-[#0A4B68]/70 hover:text-[#0A4B68] transition-colors"
                  >
                    <span lang="cy">Mewngofnodi</span>
                    <span className="text-xs italic opacity-60" lang="en">
                      {" "}/ Log in
                    </span>
                  </Link>
                  <Link
                    href="/ymuno"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#0A4B68] text-[#EEE8D8] text-sm font-medium hover:bg-[#083a52] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68]"
                  >
                    <span lang="cy">Ymuno</span>
                    <span className="opacity-60 text-xs italic" lang="en">
                      / Join
                    </span>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile: hamburger + dropdown (client component) */}
          <MobileMenu navLinks={navLinks} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}
