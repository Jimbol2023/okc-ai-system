import type { Metadata } from "next";

import { brandConfig } from "@/lib/brand-config";

export const publicSiteUrl = "https://jcapitalpropertygroup.com";
export const publicLogoUrl = `${publicSiteUrl}${brandConfig.logoPath}`;

type PublicPageMetadataInput = {
  path: "/" | "/sell-your-house" | "/about" | "/contact" | "/privacy";
  title: string;
  description: string;
};

export function createPublicPageMetadata({ path, title, description }: PublicPageMetadataInput): Metadata {
  const canonical = path === "/" ? publicSiteUrl : `${publicSiteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: brandConfig.companyDisplayName,
      type: "website",
      images: [
        {
          url: publicLogoUrl,
          width: 512,
          height: 512,
          alt: brandConfig.logoAlt
        }
      ]
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [publicLogoUrl]
    }
  };
}
