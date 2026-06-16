import { brandConfig } from "./brand-config";
import {
  assertBrandAssetReplacementReadinessGateSafe,
  brandAssetReplacementReadinessGateFlags,
  getBrandAssetReplacementReadinessGate,
  summarizeBrandAssetReplacementReadinessGate,
} from "./brand-asset-replacement-readiness-gate";
import {
  getHumanReviewedBrandAssetReplacementChecklist,
  summarizeHumanReviewedBrandAssetReplacementChecklist,
} from "./human-reviewed-brand-asset-replacement-checklist";

const allAssetSignals = {
  logoReviewed: true,
  canvaBrandKitReviewed: true,
  websiteHeroReviewed: true,
  emailSignatureReviewed: true,
  socialTemplatesReviewed: true,
  sellerTrustAssetsReviewed: true,
  exportRequirementsReviewed: true,
};

const allApprovalSignals = {
  brandOwnerApproved: true,
  legalIdentityVerified: true,
  finalVisualApproval: true,
  implementationScopeApproved: true,
};

describe("brand asset replacement readiness gate", () => {
  it("uses brand fields from brandConfig", () => {
    const result = getBrandAssetReplacementReadinessGate();

    expect(result.brandIdentity).toEqual({
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    });
  });

  it("uses the safe checklist summary before readiness output", () => {
    const result = getBrandAssetReplacementReadinessGate();
    const checklist = getHumanReviewedBrandAssetReplacementChecklist();

    expect(result.checklistSummary).toBe(summarizeHumanReviewedBrandAssetReplacementChecklist(checklist));
  });

  it("returns blocked when no signals are provided", () => {
    const result = getBrandAssetReplacementReadinessGate();

    expect(result.readinessStatus).toBe("blocked");
    expect(result.missingAssetAreas).toContain("logo replacement readiness");
    expect(result.recommendedNextAction).toBe("Complete all required brand asset review areas before requesting implementation approval.");
  });

  it("returns blocked when any asset review is missing", () => {
    const result = getBrandAssetReplacementReadinessGate({
      logoReviewed: true,
      canvaBrandKitReviewed: true,
      websiteHeroReviewed: true,
    });

    expect(result.readinessStatus).toBe("blocked");
    expect(result.missingAssetAreas).toContain("email signature readiness");
    expect(result.missingApprovalGates).toContain("brand owner review required");
  });

  it("returns needs human review when all assets are reviewed but approvals are missing", () => {
    const result = getBrandAssetReplacementReadinessGate(allAssetSignals);

    expect(result.readinessStatus).toBe("needs_human_review");
    expect(result.missingAssetAreas).toEqual([]);
    expect(result.missingApprovalGates).toContain("brand owner review required");
    expect(result.recommendedNextAction).toBe("Complete missing human approval gates before creating any implementation scope.");
  });

  it("returns ready for future implementation scope when all signals are complete", () => {
    const result = getBrandAssetReplacementReadinessGate({
      ...allAssetSignals,
      ...allApprovalSignals,
    });

    expect(result.readinessStatus).toBe("ready_for_future_implementation_scope");
    expect(result.missingAssetAreas).toEqual([]);
    expect(result.missingApprovalGates).toEqual([]);
    expect(result.recommendedNextAction).toBe("Create a separate human-approved implementation scope before replacing any brand assets.");
  });

  it("lists missing asset areas and approval gates correctly", () => {
    const result = getBrandAssetReplacementReadinessGate({
      logoReviewed: true,
      brandOwnerApproved: true,
    });

    expect(result.missingAssetAreas).toEqual([
      "Canva Brand Kit readiness",
      "website hero asset readiness",
      "email signature readiness",
      "social media template readiness",
      "seller trust asset readiness",
      "export file requirements",
    ]);
    expect(result.missingApprovalGates).toEqual([
      "legal name/domain/email verification required",
      "final visual approval required",
      "implementation approval required",
    ]);
  });

  it("keeps all implementation mutation provider publishing storage and outreach flags false", () => {
    const result = getBrandAssetReplacementReadinessGate({
      ...allAssetSignals,
      ...allApprovalSignals,
    });

    expect(result.flags.directImplementationEnabled).toBe(false);
    expect(result.flags.canvaApiActivationEnabled).toBe(false);
    expect(result.flags.logoImageReplacementEnabled).toBe(false);
    expect(result.flags.cssThemeChangeEnabled).toBe(false);
    expect(result.flags.uiEditEnabled).toBe(false);
    expect(result.flags.publishingEnabled).toBe(false);
    expect(result.flags.providerActivationEnabled).toBe(false);
    expect(result.flags.crmWriteEnabled).toBe(false);
    expect(result.flags.storageWriteEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.spendEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes status as read-only human review", () => {
    const result = getBrandAssetReplacementReadinessGate(allAssetSignals);
    const summary = summarizeBrandAssetReplacementReadinessGate(result);

    expect(summary).toMatch(/J Capital Property Group/i);
    expect(summary).toMatch(/needs_human_review/i);
    expect(summary).toMatch(/read-only/i);
    expect(summary).toMatch(/human review/i);
  });

  it("throws on unsafe modified results", () => {
    const result = getBrandAssetReplacementReadinessGate();

    expect(() =>
      assertBrandAssetReplacementReadinessGateSafe({
        ...result,
        flags: { ...brandAssetReplacementReadinessGateFlags, directImplementationEnabled: true },
      }),
    ).toThrow(/unsafe flags/i);
    expect(() =>
      assertBrandAssetReplacementReadinessGateSafe({
        ...result,
        brandIdentity: { ...result.brandIdentity, displayName: "Drift" },
      }),
    ).toThrow(/display name/i);
    expect(() =>
      assertBrandAssetReplacementReadinessGateSafe({
        ...result,
        blockedUse: result.blockedUse.filter((item) => item !== "no provider activation"),
      }),
    ).toThrow(/Blocked use/i);
    expect(() =>
      assertBrandAssetReplacementReadinessGateSafe({
        ...result,
        readinessStatus: "ready_for_future_implementation_scope",
      }),
    ).toThrow(/Readiness status/i);
    expect(() =>
      assertBrandAssetReplacementReadinessGateSafe({
        ...result,
        recommendedNextAction: "Replace the logo",
      }),
    ).toThrow(/Recommended next action/i);
  });
});
