import {
  assertPhase16BuyerFitSignalAuditSafe,
  getPhase16BuyerFitSignalAudit,
  getPhase16BuyerFitSignalAuditSummary,
  phase16BuyerFitSignalAuditFlags,
  phase16BuyerFitSignalFamilies,
} from "./phase-16-buyer-fit-signal-audit";

describe("phase 16B buyer fit signal audit", () => {
  it("pins Phase 16B fields and includes repo-grounded signal families", () => {
    const result = getPhase16BuyerFitSignalAudit();

    expect(result.phase).toBe("Phase 16: Buyer Fit Intelligence");
    expect(result.phaseStep).toBe("Phase 16B â€” Buyer Fit Signal Audit");
    expect(result.previousStep).toBe("Phase 16A â€” Buyer Fit Intelligence Scope");
    expect(result.signalFamilies).toEqual(phase16BuyerFitSignalFamilies);
    expect(result.recommendedNextExactStep).toBe("Phase 16C â€” Manual Buyer Fit Advisory Policy");
    expect(result.groundedReferences.buyerIntelligenceFiles).toContain("buyer-demand");
    expect(result.groundedReferences.dispositionBuyerMatchingSurfaces).toContain("/api/disposition-buyer-matching");
  });

  it("keeps all decisions unauthorized and blocks buyer-fit execution", () => {
    const result = getPhase16BuyerFitSignalAudit();

    expect(Object.entries(result).filter(([key]) => key.endsWith("Decision") && key !== "phaseDecision").every(([, value]) => value === "not_authorized")).toBe(true);
    expect(result.flags.buyerRecordMutationEnabled).toBe(false);
    expect(result.flags.matchingExecutionEnabled).toBe(false);
    expect(result.flags.scorePersistenceEnabled).toBe(false);
    expect(result.flags.dealPackageSendingEnabled).toBe(false);
    expect(result.flags.buyerOutreachEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("references buyer intelligence, disposition matching, readiness, and safety boundaries", () => {
    const result = getPhase16BuyerFitSignalAudit();
    const text = [result.signalFamilies, result.auditPurpose, result.stopRules].flat().join(" ");

    expect(text).toMatch(/buyer_demand_quality_score_activity/i);
    expect(text).toMatch(/disposition_buyer_matching/i);
    expect(text).toMatch(/r61_r62_r78/i);
    expect(text).toMatch(/x4_human_guided/i);
    expect(text).toMatch(/highest acquisition ROI per operator hour/i);
  });

  it("summarizes signal audit boundaries", () => {
    const summary = getPhase16BuyerFitSignalAuditSummary();

    expect(summary).toMatch(/audits existing buyer demand/i);
    expect(summary).toMatch(/disposition matching/i);
    expect(summary).toMatch(/No buyer outreach/i);
    expect(summary).toMatch(/no deal blasting/i);
    expect(summary).toMatch(/no deal package sending/i);
    expect(summary).toMatch(/Phase 16C â€” Manual Buyer Fit Advisory Policy/i);
  });

  it("throws on missing signals, blocked flags, missing boundaries, and unsafe wording", () => {
    const result = getPhase16BuyerFitSignalAudit();

    expect(() => assertPhase16BuyerFitSignalAuditSafe({ ...result, signalFamilies: [] })).toThrow(/signal families/i);
    expect(() => assertPhase16BuyerFitSignalAuditSafe({ ...result, flags: { ...phase16BuyerFitSignalAuditFlags, matchingExecutionEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase16BuyerFitSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase16BuyerFitSignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase16BuyerFitSignalAuditSafe({ ...result, auditPurpose: ["deal package sending is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
