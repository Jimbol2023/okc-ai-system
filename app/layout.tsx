import type { Metadata } from "next";
import { Cinzel, Inter, Montserrat } from "next/font/google";

import "@/app/globals.css";
import { brandConfig } from "@/lib/brand-config";
import { getAppUrl } from "@/lib/env";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"]
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"]
});

const cinzel = Cinzel({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["400", "600", "700"]
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
      <body className={`${inter.variable} ${montserrat.variable} ${cinzel.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
