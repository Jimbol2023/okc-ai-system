import { createZ4FinalManualConversionPipelineSummary } from "./z4-final-manual-conversion-pipeline-summary";

describe("Z4F final manual conversion pipeline summary", () => {
  it("summarizes Z4 readiness and recommends Z5 next", () => {
    const result = createZ4FinalManualConversionPipelineSummary();
    expect(result.phase).toBe("Z4F");
    expect(result.policyReadiness.phase).toBe("Z4A");
    expect(result.signalReadiness.phase).toBe("Z4B");
    expect(result.stageClassifierReadiness.phase).toBe("Z4C");
    expect(result.manualConversionReadiness.phase).toBe("Z4D");
    expect(result.recommendedNextExactPhase).toBe("Z5 - Manual Revenue Prioritization");
    expect(result.z4Complete).toBe(true);
  });

  it("keeps execution, contact, persistence, audit, and mutation blocked", () => {
    const result = createZ4FinalManualConversionPipelineSummary();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.offerSent).toBe(false);
    expect(result.flags.contractGenerated).toBe(false);
    expect(result.flags.signatureRequested).toBe(false);
    expect(result.flags.buyerContacted).toBe(false);
    expect(result.flags.sellerContacted).toBe(false);
    expect(result.flags.statusChanged).toBe(false);
    expect(result.flags.dealMovedStage).toBe(false);
    expect(result.flags.conversionActionExecuted).toBe(false);
    expect(result.unresolvedBlockers.join(" ")).toMatch(/no offer\/contract\/signature execution/);
  });
});
