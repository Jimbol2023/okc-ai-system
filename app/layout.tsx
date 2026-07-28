import type { Metadata, Viewport } from "next";

import "@/app/globals.css";
import { brandConfig } from "@/lib/brand-config";
import { getAppUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: {
    default: brandConfig.appName,
    template: `%s | ${brandConfig.appName}`
  },
  description: brandConfig.appDescription,
  metadataBase: new URL(getAppUrl()),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "J Capital OS",
    statusBarStyle: "black-translucent"
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "J Capital OS"
  },
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

export const viewport: Viewport = {
  themeColor: brandConfig.colors.deepNavy
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
