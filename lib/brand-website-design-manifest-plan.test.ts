import { brandConfig } from "./brand-config";
import {
  assertBrandWebsiteDesignManifestPlanSafe,
  brandWebsiteDesignManifestPlanFlags,
  getBrandWebsiteDesignManifestPlan,
  summarizeBrandWebsiteDesignManifestPlan,
} from "./brand-website-design-manifest-plan";
import {
  getBrandAssetReplacementReadinessGate,
  summarizeBrandAssetReplacementReadinessGate,
} from "./brand-asset-replacement-readiness-gate";

const allManifestSignals = {
  primaryLogoReviewed: true,
  alternateLogoReviewed: true,
  faviconReviewed: true,
  socialProfileImageReviewed: true,
  emailSignatureLogoReviewed: true,
  canvaBrandKitExportsReviewed: true,
  sellerTrustGraphicsReviewed: true,
  homepageHeroAssetReviewed: true,
  sellYourHousePageVisualReviewed: true,
  contactPageVisualTreatmentReviewed: true,
  footerBrandPresentationReviewed: true,
  navbarLogoPlacementReviewed: true,
  mobileFirstLayoutReviewed: true,
  ctaVisualConsistencyReviewed: true,
  sellerTrustSectionDesignReviewed: true,
  accessibilityReadabilityReviewed: true,
  socialMediaTemplatesReviewed: true,
  adCreativeTemplatesReviewed: true,
  buyerSellerPdfOnePagerTemplatesReviewed: true,
  emailSignatureDesignReviewed: true,
  brandColorPaletteReviewed: true,
  typographyReviewed: true,
  iconIllustrationStyleReviewed: true,
};

const allApprovalSignals = {
  brandOwnerApproved: true,
  legalIdentityVerified: true,
  finalVisualApproval: true,
  accessibilityApproved: true,
  implementationScopeApproved: true,
};

describe("brand website design manifest plan", () => {
  it("uses brand fields from brandConfig", () => {
    const result = getBrandWebsiteDesignManifestPlan();

    expect(result.brandIdentity).toEqual({
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    });
  });

  it("uses the safe readiness gate summary before manifest output", () => {
    const result = getBrandWebsiteDesignManifestPlan();
    const readinessGate = getBrandAssetReplacementReadinessGate();

    expect(result.readinessGateSummary).toBe(summarizeBrandAssetReplacementReadinessGate(readinessGate));
  });

  it("returns manifest blocked when no signals are provided", () => {
    const result = getBrandWebsiteDesignManifestPlan();

    expect(result.manifestStatus).toBe("manifest_blocked");
    expect(result.missingManifestAreas).toContain("primary logo");
    expect(result.recommendedNextAction).toBe("Complete all required brand and website design manifest areas before requesting human design approval.");
  });

  it("returns manifest blocked when any manifest review is missing", () => {
    const result = getBrandWebsiteDesignManifestPlan({
      primaryLogoReviewed: true,
      alternateLogoReviewed: true,
      faviconReviewed: true,
      homepageHeroAssetReviewed: true,
    });

    expect(result.manifestStatus).toBe("manifest_blocked");
    expect(result.missingManifestAreas).toContain("social profile image");
    expect(result.missingApprovalGates).toContain("brand owner approval");
  });

  it("returns manifest needs human review when all manifest areas are reviewed but approvals are missing", () => {
    const result = getBrandWebsiteDesignManifestPlan(allManifestSignals);

    expect(result.manifestStatus).toBe("manifest_needs_human_review");
    expect(result.missingManifestAreas).toEqual([]);
    expect(result.missingApprovalGates).toContain("brand owner approval");
    expect(result.recommendedNextAction).toBe("Complete missing human approval gates before creating any design implementation scope.");
  });

  it("returns manifest ready for future design scope when all signals are complete", () => {
    const result = getBrandWebsiteDesignManifestPlan({
      ...allManifestSignals,
      ...allApprovalSignals,
    });

    expect(result.manifestStatus).toBe("manifest_ready_for_future_design_scope");
    expect(result.missingManifestAreas).toEqual([]);
    expect(result.missingApprovalGates).toEqual([]);
    expect(result.recommendedNextAction).toBe(
      "Create a separate human-approved design implementation scope before changing any brand, website, Canva, or public-facing design assets.",
    );
  });

  it("lists missing manifest areas and approval gates correctly", () => {
    const result = getBrandWebsiteDesignManifestPlan({
      primaryLogoReviewed: true,
      homepageHeroAssetReviewed: true,
      brandOwnerApproved: true,
    });

    expect(result.missingManifestAreas).toEqual([
      "alternate logo",
      "favicon",
      "social profile image",
      "email signature logo",
      "Canva Brand Kit exports",
      "seller trust graphics",
      "sell-your-house page hero/visual",
      "contact page visual treatment",
      "footer brand presentation",
      "navbar logo placement",
      "mobile-first layout review",
      "CTA visual consistency",
      "seller trust section design",
      "accessibility/readability review",
      "social media templates",
      "ad creative templates",
      "buyer/seller PDF one-pager templates",
      "email signature design",
      "brand color/palette review",
      "typography review",
      "icon/illustration style review",
    ]);
    expect(result.missingApprovalGates).toEqual([
      "legal identity verification",
      "final visual approval",
      "accessibility approval",
      "implementation scope approval",
    ]);
  });

  it("groups manifest areas into brand assets website design and other design", () => {
    const result = getBrandWebsiteDesignManifestPlan();

    expect(result.manifestAreas.brandAssets).toEqual(
      expect.arrayContaining(["primary logo", "Canva Brand Kit exports", "seller trust graphics"]),
    );
    expect(result.manifestAreas.websiteDesign).toEqual(
      expect.arrayContaining(["homepage hero asset", "mobile-first layout review", "accessibility/readability review"]),
    );
    expect(result.manifestAreas.otherDesign).toEqual(
      expect.arrayContaining(["social media templates", "email signature design", "typography review"]),
    );
  });

  it("keeps all implementation mutation provider publishing storage and outreach flags false", () => {
    const result = getBrandWebsiteDesignManifestPlan({
      ...allManifestSignals,
      ...allApprovalSignals,
    });

    expect(result.flags.designImplementationEnabled).toBe(false);
    expect(result.flags.imageLogoReplacementEnabled).toBe(false);
    expect(result.flags.cssThemeChangeEnabled).toBe(false);
    expect(result.flags.uiEditEnabled).toBe(false);
    expect(result.flags.canvaApiActivationEnabled).toBe(false);
    expect(result.flags.publishingEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.providerActivationEnabled).toBe(false);
    expect(result.flags.crmWriteEnabled).toBe(false);
    expect(result.flags.storageWriteEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.spendEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.flags.directImplementationEnabled).toBe(false);
  });

  it("summarizes status as read-only human review", () => {
    const result = getBrandWebsiteDesignManifestPlan(allManifestSignals);
    const summary = summarizeBrandWebsiteDesignManifestPlan(result);

    expect(summary).toMatch(/J Capital Property Group/i);
    expect(summary).toMatch(/manifest_needs_human_review/i);
    expect(summary).toMatch(/read-only/i);
    expect(summary).toMatch(/human review/i);
  });

  it("throws on unsafe modified results", () => {
    const result = getBrandWebsiteDesignManifestPlan();

    expect(() =>
      assertBrandWebsiteDesignManifestPlanSafe({
        ...result,
        flags: { ...brandWebsiteDesignManifestPlanFlags, designImplementationEnabled: true },
      }),
    ).toThrow(/unsafe flags/i);
    expect(() =>
      assertBrandWebsiteDesignManifestPlanSafe({
        ...result,
        brandIdentity: { ...result.brandIdentity, displayName: "Drift" },
      }),
    ).toThrow(/display name/i);
    expect(() =>
      assertBrandWebsiteDesignManifestPlanSafe({
        ...result,
        blockedUse: result.blockedUse.filter((item) => item !== "no provider activation"),
      }),
    ).toThrow(/Blocked use/i);
    expect(() =>
      assertBrandWebsiteDesignManifestPlanSafe({
        ...result,
        manifestStatus: "manifest_ready_for_future_design_scope",
      }),
    ).toThrow(/Manifest status/i);
    expect(() =>
      assertBrandWebsiteDesignManifestPlanSafe({
        ...result,
        recommendedNextAction: "Change the website design",
      }),
    ).toThrow(/Recommended next action/i);
  });
});
