import type { Metadata } from "next";

import { brandConfig } from "@/lib/brand-config";

export const publicSiteUrl = "https://jcapitalpropertygroup.com";
export const publicLogoUrl = `${publicSiteUrl}${brandConfig.logoPath}`;
export const publicOpenGraphImageUrl = `${publicSiteUrl}/images/og-jcapital.jpg`;

export type PublicPath =
  | "/"
  | "/sell-your-house"
  | "/about"
  | "/contact"
  | "/thank-you"
  | "/privacy"
  | "/accessibility"
  | "/faq"
  | "/resources"
  | "/resources/education"
  | "/resources/education/probate-basics-oklahoma-property-owners"
  | "/resources/education/deferred-maintenance-oklahoma"
  | "/resources/education/property-ownership-change-considerations"
  | "/resources/education/family-property-discussions"
  | "/resources/videos"
  | "/resources/videos/inherited-property"
  | "/resources/videos/vacant-property"
  | "/resources/videos/relocation-property"
  | "/resources/videos/landlord-property"
  | "/resources/property-insights"
  | "/resources/inherited-property-oklahoma"
  | "/resources/sell-inherited-house-oklahoma-city"
  | "/resources/vacant-property-oklahoma"
  | "/resources/sell-vacant-house-okc"
  | "/resources/landlord-property-decisions-oklahoma"
  | "/resources/shared-inherited-property-oklahoma"
  | "/resources/relocation-property-decisions-oklahoma"
  | "/resources/selling-house-during-probate-oklahoma"
  | "/resources/out-of-state-owner-selling-oklahoma-property"
  | "/oklahoma-city"
  | "/yukon"
  | "/moore"
  | "/norman"
  | "/edmond"
  | "/midwest-city";

export type BreadcrumbItem = {
  name: string;
  path?: PublicPath;
};

type PublicPageMetadataInput = {
  path: PublicPath;
  title: string;
  description: string;
};

export function getPublicCanonicalUrl(path: PublicPath) {
  return path === "/" ? publicSiteUrl : `${publicSiteUrl}${path}`;
}

export function createPublicPageMetadata({ path, title, description }: PublicPageMetadataInput): Metadata {
  const canonical = getPublicCanonicalUrl(path);

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
          url: publicOpenGraphImageUrl,
          width: 1058,
          height: 556,
          alt: "J Capital Property Group social sharing image"
        }
      ]
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [publicOpenGraphImageUrl]
    }
  };
}

export function createBreadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const listItem: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: item.name
      };

      if (item.path) {
        listItem.item = getPublicCanonicalUrl(item.path);
      }

      return listItem;
    })
  };
}

export function createArticleJsonLd({
  path,
  title,
  description
}: {
  path: PublicPath;
  title: string;
  description: string;
}) {
  const canonical = getPublicCanonicalUrl(path);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: canonical,
    mainEntityOfPage: canonical,
    image: publicOpenGraphImageUrl,
    author: {
      "@type": "Organization",
      name: brandConfig.companyDisplayName,
      url: publicSiteUrl
    },
    publisher: {
      "@type": "Organization",
      name: brandConfig.companyDisplayName,
      logo: {
        "@type": "ImageObject",
        url: publicLogoUrl
      }
    }
  };
}

export function createFaqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
