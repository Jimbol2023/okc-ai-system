import { createZ4ManualConversionPolicyReview, z4ManualConversionFlags, z4ManualConversionStageMetadata, z4ManualConversionStages } from "./z4-manual-conversion-policy";

describe("Z4A manual conversion policy", () => {
  it("defines deterministic advisory conversion stages", () => {
    expect(z4ManualConversionStages).toEqual([
      "lead_context_review",
      "follow_up_review",
      "offer_review",
      "negotiation_review",
      "contract_review",
      "buyer_disposition_review",
      "closing_coordination_review",
      "terminal_or_suppressed",
    ]);

    for (const stage of z4ManualConversionStages) {
      const metadata = z4ManualConversionStageMetadata[stage];
      expect(metadata.label).toBeTruthy();
      expect(metadata.manualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(metadata.requiresHumanReview).toBe(true);
      expect(metadata.blockedExecutionBoundary).toMatch(/no offer/i);
    }
  });

  it("preserves all conversion lockdown flags", () => {
    const result = createZ4ManualConversionPolicyReview();
    expect(result.flags).toBe(z4ManualConversionFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.followUpTaskCreated).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.automationTriggered).toBe(false);
    expect(result.flags.offerSent).toBe(false);
    expect(result.flags.contractGenerated).toBe(false);
    expect(result.flags.contractSent).toBe(false);
    expect(result.flags.signatureRequested).toBe(false);
    expect(result.flags.buyerContacted).toBe(false);
    expect(result.flags.sellerContacted).toBe(false);
    expect(result.flags.statusChanged).toBe(false);
    expect(result.flags.dealMovedStage).toBe(false);
    expect(result.flags.conversionActionExecuted).toBe(false);
  });
});
