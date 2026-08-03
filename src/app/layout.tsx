import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/ui/language-provider";

export const metadata: Metadata = {
  title: "Ynni Cymunedol Llanfairfechan Community Energy",
  description:
    "Menter ynni cymunedol ar gyfer Llanfairfechan a'r ardal gyfagos. Community energy for Llanfairfechan and the surrounding area.",
  keywords: ["community energy", "ynni cymunedol", "Llanfairfechan", "renewable energy", "Wales", "Cymru"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cy" data-lang="cy" className="h-full antialiased">
      <head>
        {/* Anti-flash: read language preference from localStorage before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var l=localStorage.getItem('lang');if(l==='en'){document.documentElement.dataset.lang='en';document.documentElement.lang='en';}}catch(e){}`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,100..1000;1,100..1000&family=Geist+Mono:wght@100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
