import Link from "next/link";

const footerLinks = [
  { href: "/am-ni", cy: "Amdanom Ni", en: "About" },
  { href: "/prosiectau", cy: "Prosiectau", en: "Projects" },
  { href: "/newyddion", cy: "Newyddion", en: "News" },
  { href: "/cysylltu", cy: "Cysylltu", en: "Contact" },
  { href: "/aelodaeth", cy: "Ymuno", en: "Join" },
  { href: "/mewngofnodi", cy: "Mewngofnodi", en: "Log in" },
  { href: "/hygyrchedd", cy: "Hygyrchedd", en: "Accessibility" },
  { href: "/preifatrwydd", cy: "Preifatrwydd", en: "Privacy" },
];

export function Footer() {
  return (
    <footer className="bg-[#0A4B68] text-[#EEE8D8]" role="contentinfo">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="leading-none">
              <p className="font-display text-lg font-bold text-[#EEE8D8]">
                Ynni Cymunedol
              </p>
              <p className="text-xs tracking-[0.2em] uppercase text-[#E09800]">
                Llanfairfechan
              </p>
            </div>
            <p className="text-sm text-[#EEE8D8]/70 leading-relaxed">
              <span lang="cy">
                Cwmni Buddiant Cymunedol — ynni adnewyddadwy er budd y gymuned.
              </span>
            </p>
            <p className="text-xs italic text-[#EEE8D8]/50" lang="en">
              Community Interest Company — renewable energy for the benefit of the community.
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Llywio troed-dudalen / Footer navigation" className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest text-[#E09800] mb-1 font-medium">
              Llywio / Navigation
            </p>
            {footerLinks.map(({ href, cy, en }) => (
              <Link
                key={href}
                href={href}
                className="flex items-baseline gap-2 text-sm text-[#EEE8D8]/80 hover:text-[#EEE8D8] transition-colors"
              >
                <span lang="cy">{cy}</span>
                <span className="text-xs italic text-[#EEE8D8]/40" lang="en">{en}</span>
              </Link>
            ))}
          </nav>

          {/* Contact / social placeholder */}
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-[#E09800] mb-1 font-medium">
              Cysylltu / Contact
            </p>
            <p className="text-sm text-[#EEE8D8]/70">
              <Link
                href="/cysylltu"
                className="underline underline-offset-2 hover:text-[#EEE8D8] transition-colors"
              >
                Anfonwch neges / Send a message
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Sub-footer */}
      <div className="border-t border-[#EEE8D8]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#EEE8D8]/40">
          <p>
            &copy; {new Date().getFullYear()} Ynni Cymunedol Llanfairfechan CIC
          </p>
          <p lang="cy">Cymru &middot; Wales</p>
        </div>
      </div>
    </footer>
  );
}
