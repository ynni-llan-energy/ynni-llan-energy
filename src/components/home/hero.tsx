import Link from "next/link";
import { SunCircle } from "@/components/icons/sun-circle";
import { TopoBackground } from "@/components/icons/wave-divider";

interface HeroProps {
  heading_cy?: string;
  heading_en?: string;
  body_cy?: string;
  body_en?: string;
}

export function Hero({
  heading_cy = "Ynni i\u2019r Gymuned, gan y Gymuned",
  heading_en = "Energy for the community, by the community",
  body_cy = "Rydym yn gwmni buddiant cymunedol sy\u2019n datblygu prosiectau ynni adnewyddadwy er budd pobl Llanfairfechan a\u2019r ardal gyfagos.",
  body_en = "We are a community interest company developing renewable energy projects for the benefit of Llanfairfechan and the surrounding area.",
}: HeroProps) {
  return (
    <section
      className="relative overflow-hidden bg-[#EEE8D8] min-h-[90vh] flex items-center"
      aria-labelledby="hero-heading"
    >
      <TopoBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="flex flex-col gap-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#C07E00] font-medium">
              <span lang="cy">Ynni Cymunedol</span>
              <span className="mx-2 opacity-40">/</span>
              <span lang="en" className="italic">Community Energy</span>
            </p>

            <div className="flex flex-col gap-3">
              <h1
                id="hero-heading"
                lang="cy"
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0A4B68] leading-[1.05] tracking-tight"
              >
                {heading_cy}
              </h1>
              <p
                lang="en"
                className="text-xl sm:text-2xl italic text-[#0A4B68]/60 pl-4 border-l-2 border-[#C07E00] leading-snug"
              >
                {heading_en}
              </p>
            </div>

            <div className="flex flex-col gap-3 max-w-lg">
              <p lang="cy" className="text-lg text-[#0A4B68]/80 leading-relaxed">
                {body_cy}
              </p>
              <p lang="en" className="text-sm italic text-[#0A4B68]/50 pl-3 border-l border-[#C07E00]/40 leading-relaxed">
                {body_en}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/aelodaeth"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A4B68] text-[#EEE8D8] font-medium rounded-sm hover:bg-[#083a52] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A4B68]"
              >
                <span lang="cy" className="font-display font-semibold">Ymunwch â ni</span>
                <span lang="en" className="text-sm italic opacity-60">/ Join us</span>
              </Link>

              <Link
                href="/prosiectau"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-[#0A4B68] text-[#0A4B68] font-medium rounded-sm hover:bg-[#0A4B68]/8 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A4B68]"
              >
                <span lang="cy" className="font-display font-semibold">Ein Prosiectau</span>
                <span lang="en" className="text-sm italic opacity-60">/ Our Projects</span>
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end" aria-hidden="true">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#E09800]/10 scale-110 blur-3xl" />
              <SunCircle size={400} className="relative drop-shadow-sm" />
              <svg viewBox="0 0 400 120" className="absolute bottom-0 left-0 w-full opacity-15" aria-hidden="true">
                <path
                  d="M0 120 L60 60 L100 80 L150 30 L200 55 L240 20 L280 50 L320 35 L360 65 L400 45 L400 120 Z"
                  fill="#0A4B68"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16" aria-hidden="true">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full">
          <path
            d="M0 32 C360 64 720 0 1080 32 C1260 48 1350 40 1440 32 L1440 64 L0 64 Z"
            fill="#EEE8D8"
            opacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
}
