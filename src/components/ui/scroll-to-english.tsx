"use client";

interface ScrollToEnglishProps {
  targetId?: string;
}

export function ScrollToEnglish({ targetId = "en" }: ScrollToEnglishProps) {
  return (
    <button
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }}
      className="text-sm text-[#C07E00] hover:text-[#0A4B68] transition-colors inline-flex items-center gap-1.5 group"
      aria-label="Scroll to English translation"
    >
      <span aria-hidden="true" className="group-hover:translate-y-0.5 transition-transform inline-block">↓</span>
      <span lang="cy">Saesneg</span>
      <span lang="en" className="italic opacity-60">/ Scroll to English</span>
    </button>
  );
}
