import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="cy" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,100..1000;1,100..1000&family=Geist+Mono:wght@100..900&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
