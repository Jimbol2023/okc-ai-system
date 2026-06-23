import type { MetadataRoute } from "next";

import { brandConfig } from "@/lib/brand-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brandConfig.companyDisplayName,
    short_name: "J Capital",
    description: brandConfig.appDescription,
    start_url: "/",
    display: "standalone",
    background_color: brandConfig.colors.white,
    theme_color: brandConfig.colors.deepNavy,
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
