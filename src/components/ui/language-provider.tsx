"use client";

import { useEffect } from "react";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Sync any storage value that wasn't caught by the inline script (e.g. if
    // the script was blocked). Falls back to Welsh as the site's primary language.
    const stored = localStorage.getItem("lang") as "cy" | "en" | null;
    const lang = stored === "en" ? "en" : "cy";
    const html = document.documentElement;
    if (html.dataset.lang !== lang) {
      html.dataset.lang = lang;
      html.lang = lang;
    }
  }, []);

  return <>{children}</>;
}
