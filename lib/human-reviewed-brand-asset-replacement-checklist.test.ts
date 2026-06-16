import { brandConfig } from "./brand-config";
import {
  getDesignCreativeBrandIntegration,
  summarizeDesignCreativeBrandIntegration,
} from "./design-creative-brand-integration";
import {
  assertBrandAssetReplacementChecklistSafe,
  brandAssetReplacementChecklistFlags,
  getHumanReviewedBrandAssetReplacementChecklist,
  summarizeHumanReviewedBrandAssetReplacementChecklist,
} from "./human-reviewed-brand-asset-replacement-checklist";

describe("human reviewed brand asset replacement checklist", () => {
  it("uses brand fields from brandConfig", () => {
    const result = getHumanReviewedBrandAssetReplacementChecklist();

    expect(result.brandIdentity).toEqual({
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      logoAlt: brandConfig.logoAlt,
    });
  });

  it("derives from the safe design creative brand integration summary", () => {
    const result = getHumanReviewedBrandAssetReplacementChecklist();
    const integration = getDesignCreativeBrandIntegration();

    expect(result.integrationSummary).toBe(summarizeDesignCreativeBrandIntegration(integration));
  });

  it("keeps all mutation generation provider publishing storage and outreach flags false", () => {
    const result = getHumanReviewedBrandAssetReplacementChecklist();

    expect(result.flags.uiMutationEnabled).toBe(false);
    expect(result.flags.cssThemeChangeEnabled).toBe(false);
    expect(result.flags.assetReplacementEnabled).toBe(false);
    expect(result.flags.generationEnabled).toBe(false);
    expect(result.flags.canvaProviderActivated).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.publishingEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.crmWriteEnabled).toBe(false);
    expect(result.flags.storageWriteEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.spendEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("includes all required asset areas", () => {
    const result = getHumanReviewedBrandAssetReplacementChecklist();
    const text = result.requiredAssetAreas.join(" ");

    expect(text).toMatch(/logo replacement readiness/i);
    expect(text).toMatch(/Canva Brand Kit readiness/i);
    expect(text).toMatch(/website hero asset readiness/i);
    expect(text).toMatch(/email signature readiness/i);
    expect(text).toMatch(/social media template readiness/i);
    expect(text).toMatch(/seller trust asset readiness/i);
    expect(text).toMatch(/export file requirements/i);
  });

  it("summarizes the read-only human approval checklist", () => {
    const summary = summarizeHumanReviewedBrandAssetReplacementChecklist(getHumanReviewedBrandAssetReplacementChecklist());

    expect(summary).toBe("J Capital Property Group brand asset replacement checklist is read-only and requires human approval before implementation.");
    expect(summary).toMatch(/J Capital Property Group/i);
    expect(summary).toMatch(/read-only/i);
    expect(summary).toMatch(/human approval/i);
  });

  it("throws on unsafe modified results", () => {
    const result = getHumanReviewedBrandAssetReplacementChecklist();

    expect(() =>
      assertBrandAssetReplacementChecklistSafe({
        ...result,
        flags: { ...brandAssetReplacementChecklistFlags, uiMutationEnabled: true },
      }),
    ).toThrow(/unsafe flags/i);
    expect(() =>
      assertBrandAssetReplacementChecklistSafe({
        ...result,
        brandIdentity: { ...result.brandIdentity, displayName: "Drift" },
      }),
    ).toThrow(/display name/i);
    expect(() =>
      assertBrandAssetReplacementChecklistSafe({
        ...result,
        requiredAssetAreas: result.requiredAssetAreas.filter((area) => area !== "Canva Brand Kit readiness"),
      }),
    ).toThrow(/Required asset areas/i);
    expect(() =>
      assertBrandAssetReplacementChecklistSafe({
        ...result,
        humanApprovalGates: result.humanApprovalGates.filter((gate) => gate !== "implementation approval required"),
      }),
    ).toThrow(/Human approval gates/i);
    expect(() =>
      assertBrandAssetReplacementChecklistSafe({
        ...result,
        blockedUse: result.blockedUse.filter((item) => item !== "no Canva API/provider activation"),
      }),
    ).toThrow(/Blocked use/i);
    expect(() =>
      assertBrandAssetReplacementChecklistSafe({
        ...result,
        recommendedNextAction: "Generate a logo",
      }),
    ).toThrow(/Recommended next action/i);
  });
});
