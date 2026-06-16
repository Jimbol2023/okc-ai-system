import { brandConfig } from "./brand-config";
import {
  assertBrandAssetSpecificationPackageSafe,
  brandAssetSpecificationFlags,
  getBrandAssetSpecificationPackage,
  summarizeBrandAssetSpecificationPackage,
} from "./brand-asset-specification-package";

describe("brand asset specification package", () => {
  it("uses brand identity fields from brandConfig", () => {
    const result = getBrandAssetSpecificationPackage();

    expect(result.brandIdentity).toEqual({
      companyName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    });
  });

  it("defines required logo deliverables and export formats", () => {
    const result = getBrandAssetSpecificationPackage();

    expect(result.logoDeliverables).toEqual([
      "primary logo",
      "horizontal logo",
      "icon mark",
      "light version",
      "dark version",
      "favicon version",
    ]);
    expect(result.exportFormats).toEqual(["SVG", "PNG", "PDF"]);
  });

  it("defines website email social seller trust and accessibility requirements", () => {
    const result = getBrandAssetSpecificationPackage();

    expect(result.websiteAssets).toEqual([
      "homepage hero",
      "sell your property hero",
      "contact page visual",
      "seller trust section graphics",
    ]);
    expect(result.emailSignatureAssets).toEqual(["logo placement", "contact block", "social links area"]);
    expect(result.socialMediaTemplates).toEqual([
      "Facebook",
      "Instagram",
      "LinkedIn",
      "seller education",
      "testimonial",
      "property spotlight",
    ]);
    expect(result.sellerTrustAssets).toEqual(["trust badge graphics", "process graphics", "credibility graphics"]);
    expect(result.accessibilityStandards).toEqual(["contrast requirements", "typography hierarchy", "mobile-first standards"]);
  });

  it("returns specification defined status", () => {
    const result = getBrandAssetSpecificationPackage();

    expect(result.status).toBe("specification_defined");
  });

  it("keeps all implementation asset generation publishing provider outreach and write flags false", () => {
    const result = getBrandAssetSpecificationPackage();

    expect(result.flags.implementationEnabled).toBe(false);
    expect(result.flags.assetGenerationEnabled).toBe(false);
    expect(result.flags.publishingEnabled).toBe(false);
    expect(result.flags.canvaActivationEnabled).toBe(false);
    expect(result.flags.providerActivationEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.storageWriteEnabled).toBe(false);
    expect(result.flags.spendEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes the package as read-only human review", () => {
    const result = getBrandAssetSpecificationPackage();
    const summary = summarizeBrandAssetSpecificationPackage(result);

    expect(summary).toMatch(/J Capital Property Group/i);
    expect(summary).toMatch(/specification package/i);
    expect(summary).toMatch(/read-only/i);
    expect(summary).toMatch(/human review/i);
  });

  it("throws on unsafe modified results", () => {
    const result = getBrandAssetSpecificationPackage();

    expect(() =>
      assertBrandAssetSpecificationPackageSafe({
        ...result,
        flags: { ...brandAssetSpecificationFlags, assetGenerationEnabled: true },
      }),
    ).toThrow(/unsafe flags/i);
    expect(() =>
      assertBrandAssetSpecificationPackageSafe({
        ...result,
        brandIdentity: { ...result.brandIdentity, companyName: "Drift" },
      }),
    ).toThrow(/company name/i);
    expect(() =>
      assertBrandAssetSpecificationPackageSafe({
        ...result,
        status: "implementation_ready" as never,
      }),
    ).toThrow(/status/i);
    expect(() =>
      assertBrandAssetSpecificationPackageSafe({
        ...result,
        blockedUse: result.blockedUse.filter((item) => item !== "no Canva activation"),
      }),
    ).toThrow(/Blocked use/i);
  });
});
