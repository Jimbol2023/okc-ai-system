import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";

import "@/app/globals.css";
import { getAppUrl } from "@/lib/env";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"]
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: {
    default: "OKC Wholesale AI System",
    template: "%s | OKC Wholesale AI System"
  },
  description:
    "Wholesale real estate platform for Oklahoma City with a public acquisition website and an internal operations dashboard.",
  metadataBase: new URL(getAppUrl())
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${instrumentSerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
