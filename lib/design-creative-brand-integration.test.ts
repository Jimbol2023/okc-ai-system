import { brandConfig } from "./brand-config";
import {
  assertDesignCreativeBrandIntegrationSafe,
  designCreativeBrandIntegrationFlags,
  getDesignCreativeBrandIntegration,
  summarizeDesignCreativeBrandIntegration,
} from "./design-creative-brand-integration";

describe("design creative brand integration", () => {
  it("uses brand fields from brandConfig", () => {
    const result = getDesignCreativeBrandIntegration();

    expect(result.brandIdentity).toEqual({
      displayName: brandConfig.companyDisplayName,
      legalName: brandConfig.companyLegalName,
      domain: brandConfig.domain,
      email: brandConfig.primaryEmail,
      appDescription: brandConfig.appDescription,
      logoAlt: brandConfig.logoAlt,
    });
  });

  it("keeps all mutation generation provider publishing storage and outreach flags false", () => {
    const result = getDesignCreativeBrandIntegration();

    expect(result.flags.implementationEnabled).toBe(false);
    expect(result.flags.mutationEnabled).toBe(false);
    expect(result.flags.generationEnabled).toBe(false);
    expect(result.flags.logoGenerationEnabled).toBe(false);
    expect(result.flags.assetEditEnabled).toBe(false);
    expect(result.flags.contentGenerationEnabled).toBe(false);
    expect(result.flags.canvaProviderActivated).toBe(false);
    expect(result.flags.providerActivated).toBe(false);
    expect(result.flags.publishingEnabled).toBe(false);
    expect(result.flags.trackingEnabled).toBe(false);
    expect(result.flags.crmWriteEnabled).toBe(false);
    expect(result.flags.storageWriteEnabled).toBe(false);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.spendEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
    expect(result.flags.phase16ExecutionEnabled).toBe(false);
  });

  it("summarizes the read-only human review integration", () => {
    const summary = summarizeDesignCreativeBrandIntegration(getDesignCreativeBrandIntegration());

    expect(summary).toBe("J Capital Property Group design/creative integration is read-only and ready for human review.");
    expect(summary).toMatch(/J Capital Property Group/i);
    expect(summary).toMatch(/read-only/i);
    expect(summary).toMatch(/human review/i);
  });

  it("throws on unsafe modified results", () => {
    const result = getDesignCreativeBrandIntegration();

    expect(() =>
      assertDesignCreativeBrandIntegrationSafe({
        ...result,
        flags: { ...designCreativeBrandIntegrationFlags, implementationEnabled: true },
      }),
    ).toThrow(/unsafe flags/i);
    expect(() =>
      assertDesignCreativeBrandIntegrationSafe({
        ...result,
        brandIdentity: { ...result.brandIdentity, displayName: "Drift" },
      }),
    ).toThrow(/display name/i);
    expect(() =>
      assertDesignCreativeBrandIntegrationSafe({
        ...result,
        allowedUse: ["implementation visibility"],
      }),
    ).toThrow(/human-review-only/i);
    expect(() =>
      assertDesignCreativeBrandIntegrationSafe({
        ...result,
        blockedUse: result.blockedUse.filter((item) => item !== "no Canva/provider activation"),
      }),
    ).toThrow(/Blocked use/i);
    expect(() =>
      assertDesignCreativeBrandIntegrationSafe({
        ...result,
        recommendedNextAction: "Generate a logo",
      }),
    ).toThrow(/Recommended next action/i);
  });
});
