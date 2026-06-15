"use client";

import { useEffect, useState } from "react";

export function LanguageToggle() {
  const [lang, setLang] = useState<"cy" | "en">("cy");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as "cy" | "en" | null;
    if (stored === "en") setLang("en");
  }, []);

  function switchTo(next: "cy" | "en") {
    setLang(next);
    localStorage.setItem("lang", next);
    document.documentElement.dataset.lang = next;
    document.documentElement.lang = next;
  }

  return (
    <div
      role="group"
      aria-label="Dewis iaith / Language selection"
      className="flex items-center rounded-sm border border-[#0A4B68]/20 overflow-hidden text-xs font-medium"
    >
      <button
        type="button"
        onClick={() => switchTo("cy")}
        aria-pressed={lang === "cy"}
        aria-label="Cymraeg"
        className={`px-2.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68] focus-visible:outline-offset-[-2px] ${
          lang === "cy"
            ? "bg-[#0A4B68] text-[#EEE8D8]"
            : "text-[#0A4B68]/60 hover:text-[#0A4B68] hover:bg-[#0A4B68]/8"
        }`}
      >
        CY
      </button>
      <span aria-hidden="true" className="w-px h-4 bg-[#0A4B68]/20" />
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={lang === "en"}
        aria-label="English"
        className={`px-2.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0A4B68] focus-visible:outline-offset-[-2px] ${
          lang === "en"
            ? "bg-[#0A4B68] text-[#EEE8D8]"
            : "text-[#0A4B68]/60 hover:text-[#0A4B68] hover:bg-[#0A4B68]/8"
        }`}
      >
        EN
      </button>
    </div>
  );
}
