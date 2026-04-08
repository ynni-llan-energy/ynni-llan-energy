import type { Metadata } from "next";
import { Lora, DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
    <html
      lang="cy"
      className={`${lora.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
