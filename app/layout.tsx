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
  metadataBase: new URL(getAppUrl()),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  }
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
