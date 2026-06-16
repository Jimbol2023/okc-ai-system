import { brandConfig } from "./brand-config";

export const brandAssetSpecificationFlags = {
  readOnly: true,
  specificationOnly: true,
  humanReviewOnly: true,
  implementationEnabled: false,
  assetGenerationEnabled: false,
  publishingEnabled: false,
  canvaActivationEnabled: false,
  providerActivationEnabled: false,
  outreachEnabled: false,
  crmMutationEnabled: false,
  storageWriteEnabled: false,
  spendEnabled: false,
  goLiveAuthorized: false,
} as const;

const logoDeliverables = [
  "primary logo",
  "horizontal logo",
  "icon mark",
  "light version",
  "dark version",
  "favicon version",
] as const;

const exportFormats = ["SVG", "PNG", "PDF"] as const;

const websiteAssets = [
  "homepage hero",
  "sell your property hero",
  "contact page visual",
  "seller trust section graphics",
] as const;

const emailSignatureAssets = [
  "logo placement",
  "contact block",
  "social links area",
] as const;

const socialMediaTemplates = [
  "Facebook",
  "Instagram",
  "LinkedIn",
  "seller education",
  "testimonial",
  "property spotlight",
] as const;

const sellerTrustAssets = [
  "trust badge graphics",
  "process graphics",
  "credibility graphics",
] as const;

const accessibilityStandards = [
  "contrast requirements",
  "typography hierarchy",
  "mobile-first standards",
] as const;

export type BrandAssetSpecificationPackage = {
  brandIdentity: {
    companyName: typeof brandConfig.companyDisplayName;
    legalName: typeof brandConfig.companyLegalName;
    domain: typeof brandConfig.domain;
    email: typeof brandConfig.primaryEmail;
    logoAlt: typeof brandConfig.logoAlt;
  };
  logoDeliverables: typeof logoDeliverables;
  exportFormats: typeof exportFormats;
  websiteAssets: typeof websiteAssets;
  emailSignatureAssets: typeof emailSignatureAssets;
  socialMediaTemplates: typeof socialMediaTemplates;
  sellerTrustAssets: typeof sellerTrustAssets;
  accessibilityStandards: typeof accessibilityStandards;
  status: "specification_defined";
  allowedUse: ["read-only brand asset specification for human review"];
  blockedUse: typeof blockedUse;
  flags: typeof brandAssetSpecificationFlags;
};

const blockedUse = [
  "no implementation",
  "no asset generation",
  "no publishing",
  "no Canva activation",
  "no provider activation",
  "no outreach",
  "no CRM mutation",
  "no storage writes",
  "no spend",
  "no go-live",
] as const;

export function getBrandAssetSpecificationPackage(): BrandAssetSpecificationPackage {
  const result: BrandAssetSpecificationPackage = {
    brandIdentity: {
      companyName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    },
    logoDeliverables,
    exportFormats,
    websiteAssets,
    emailSignatureAssets,
    socialMediaTemplates,
    sellerTrustAssets,
    accessibilityStandards,
    status: "specification_defined",
    allowedUse: ["read-only brand asset specification for human review"],
    blockedUse,
    flags: brandAssetSpecificationFlags,
  };

  assertBrandAssetSpecificationPackageSafe(result);
  return result;
}

export function assertBrandAssetSpecificationPackageSafe(result: BrandAssetSpecificationPackage) {
  const allowedTrue = new Set(["readOnly", "specificationOnly", "humanReviewOnly"]);
  const unsafeTrue = Object.entries(result.flags).filter(([key, value]) => !allowedTrue.has(key) && value === true);
  const blockedUseText = result.blockedUse.join(" ");
  const blockedUseTerms = [
    /no implementation/i,
    /no asset generation/i,
    /no publishing/i,
    /no Canva activation/i,
    /no provider activation/i,
    /no outreach/i,
    /no CRM mutation/i,
    /no storage writes/i,
    /no spend/i,
    /no go-live/i,
  ];

  if (unsafeTrue.length > 0) throw new Error("Brand asset specification package unsafe flags cannot turn true.");
  if (result.brandIdentity.companyName !== brandConfig.companyDisplayName) throw new Error("Brand company name must come from brandConfig.");
  if (result.brandIdentity.legalName !== brandConfig.companyLegalName) throw new Error("Brand legal name must come from brandConfig.");
  if (result.brandIdentity.domain !== brandConfig.domain) throw new Error("Brand domain must come from brandConfig.");
  if (result.brandIdentity.email !== brandConfig.primaryEmail) throw new Error("Brand email must come from brandConfig.");
  if (result.brandIdentity.logoAlt !== brandConfig.logoAlt) throw new Error("Brand logo alt must come from brandConfig.");
  if (result.status !== "specification_defined") throw new Error("Brand asset specification status must remain specification_defined.");
  if (result.allowedUse.join("|") !== "read-only brand asset specification for human review") {
    throw new Error("Allowed use must remain read-only brand asset specification for human review.");
  }
  if (blockedUseTerms.some((term) => !term.test(blockedUseText))) {
    throw new Error("Blocked use must preserve all brand asset specification safety boundaries.");
  }
}

export function summarizeBrandAssetSpecificationPackage(result: BrandAssetSpecificationPackage) {
  assertBrandAssetSpecificationPackageSafe(result);
  return "J Capital Property Group specification package is read-only and ready for human review.";
}
