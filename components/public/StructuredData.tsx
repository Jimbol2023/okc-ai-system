import { JsonLdScript } from "@/components/public/JsonLdScript";
import { brandConfig } from "@/lib/brand-config";
import { publicLogoUrl, publicSiteUrl } from "@/lib/public-seo";

export function StructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${publicSiteUrl}/#organization`,
        name: brandConfig.companyDisplayName,
        legalName: brandConfig.companyLegalName,
        url: publicSiteUrl,
        logo: publicLogoUrl,
        email: brandConfig.primaryEmail,
        telephone: brandConfig.phone,
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Oklahoma"
        }
      },
      {
        "@type": "LocalBusiness",
        "@id": `${publicSiteUrl}/#localbusiness`,
        name: brandConfig.companyDisplayName,
        legalName: brandConfig.companyLegalName,
        url: publicSiteUrl,
        logo: publicLogoUrl,
        image: publicLogoUrl,
        email: brandConfig.primaryEmail,
        telephone: brandConfig.phone,
        description: "Professional real estate solutions for Oklahoma property owners.",
        areaServed: {
          "@type": "AdministrativeArea",
          name: "Oklahoma"
        }
      },
      {
        "@type": "WebSite",
        "@id": `${publicSiteUrl}/#website`,
        name: brandConfig.companyDisplayName,
        url: publicSiteUrl,
        publisher: {
          "@id": `${publicSiteUrl}/#organization`
        },
        inLanguage: "en-US"
      }
    ]
  };

  return <JsonLdScript data={graph} />;
}
