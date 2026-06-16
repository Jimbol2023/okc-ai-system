import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";

import "@/app/globals.css";
import { brandConfig } from "@/lib/brand-config";
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
    default: brandConfig.appName,
    template: `%s | ${brandConfig.appName}`
  },
  description: brandConfig.appDescription,
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
