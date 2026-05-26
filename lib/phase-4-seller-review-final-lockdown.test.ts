import { phase4MinimalCallPrepGateLanes } from "./phase-4-minimal-call-prep-gate";
import {
  assertPhase4SellerReviewFinalLockdownSafe,
  getPhase4SellerReviewFinalLockdown,
  getPhase4SellerReviewFinalLockdownSummary,
  phase4SellerReviewFinalLockdownFlags,
} from "./phase-4-seller-review-final-lockdown";

describe("phase 4F seller review final lockdown", () => {
  it("pins Phase 4F fields and recommends Phase 5 only", () => {
    const result = getPhase4SellerReviewFinalLockdown();

    expect(result.phase).toBe("Phase 4: Seller Review & Call Prep");
    expect(result.phaseStep).toBe("Phase 4F — Seller Review Final Lockdown");
    expect(result.previousStep).toBe("Phase 4E — Minimal Call Prep Gate");
    expect(result.phaseDecision).toBe("final_lockdown_only");
    expect(result.phase4eGateReferences).toEqual(phase4MinimalCallPrepGateLanes);
    expect(result.recommendedNextExactStep).toBe("Phase 5 — Follow-Up Organization System");
    expect(result.nextStageRecommendation).toBe("Phase 5 — Follow-Up Organization System");
  });

  it("enforces final lockdown decisions boundaries drift blocks and flags", () => {
    const result = getPhase4SellerReviewFinalLockdown();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.sellerCallMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.reminderCreationDecision).toBe("not_authorized");
    expect(result.outreachDecision).toBe("not_authorized");
    expect(result.callingDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.finalLockdownRules.join(" ")).toMatch(/locks Phase 4/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not approve Phase 5 implementation/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/Phase 5 transition approval/i);
    expect(result.forbiddenDrift.join(" ")).toMatch(/seller outreach/i);
    expect(result.flags.finalLockdownOnly).toBe(true);
    expect(result.flags.phase4LockdownEnforced).toBe(true);
    expect(result.flags.phase5ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes final lockdown and Phase 5 recommendation", () => {
    const summary = getPhase4SellerReviewFinalLockdownSummary();

    expect(summary).toMatch(/Phase 4F/i);
    expect(summary).toMatch(/final lockdown/i);
    expect(summary).toMatch(/human-owned seller communication/i);
    expect(summary).toMatch(/No implementation/i);
    expect(summary).toMatch(/no outreach/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Phase 5 — Follow-Up Organization System/i);
  });

  it("throws on pinned drift reference drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase4SellerReviewFinalLockdown();

    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, phaseStep: "Phase 5 — Follow-Up Organization System" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, phase4eGateReferences: phase4MinimalCallPrepGateLanes.slice(0, -1) as never })).toThrow(/Phase 4E gate references/i);
    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, flags: { ...phase4SellerReviewFinalLockdownFlags, goLiveAuthorized: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase4SellerReviewFinalLockdownSafe({ ...result, finalLockdownRules: ["go-live is authorized"] })).toThrow(/rules|unsafe authorization/i);
  });
});
