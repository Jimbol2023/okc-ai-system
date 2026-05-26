import { phase3FinalLockdownRules } from "./phase-3-lead-prioritization-final-lockdown";
import {
  assertPhase4SellerReviewCallPrepScopeSafe,
  getPhase4SellerReviewCallPrepScope,
  getPhase4SellerReviewCallPrepScopeSummary,
  phase4SellerReviewCallPrepScopeFlags,
} from "./phase-4-seller-review-call-prep-scope";

describe("phase 4A seller review call prep scope", () => {
  it("pins Phase 4A fields and Phase 3F continuity", () => {
    const result = getPhase4SellerReviewCallPrepScope();

    expect(result.phase).toBe("Phase 4: Seller Review & Call Prep");
    expect(result.phaseStep).toBe("Phase 4A — Seller Review & Call Prep Scope");
    expect(result.previousStep).toBe("Phase 3F — Lead Prioritization Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.humanRole).toBe("final_seller_communication_property_verification_call_judgment_negotiation_execution_owner");
    expect(result.phase3FinalLockdownReference.rules).toEqual(phase3FinalLockdownRules);
  });

  it("keeps all execution decisions blocked and hands off to Phase 4B", () => {
    const result = getPhase4SellerReviewCallPrepScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.schemaDecision).toBe("not_authorized");
    expect(result.storageDecision).toBe("not_authorized");
    expect(result.runtimeDecision).toBe("not_authorized");
    expect(result.outreachDecision).toBe("not_authorized");
    expect(result.callingDecision).toBe("not_authorized");
    expect(result.messageSendingDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 4B — Seller Review Signal Audit");
  });

  it("keeps stop rules boundaries forbidden drift and flags safe", () => {
    const result = getPhase4SellerReviewCallPrepScope();

    expect(result.stopRules.join(" ")).toMatch(/No seller outreach/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not invent property facts/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not call sellers/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final seller communication/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/call execution/i);
    expect(result.forbiddenDrift.join(" ")).toMatch(/seller-call record mutation/i);
    expect(result.flags.scopeOnly).toBe(true);
    expect(result.flags.outreachEnabled).toBe(false);
    expect(result.flags.callingEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.sellerCallRecordMutationEnabled).toBe(false);
    expect(result.flags.phase5ImplementationEnabled).toBe(false);
    expect(result.flags.goLiveAuthorized).toBe(false);
  });

  it("summarizes highest ROI scope and blocked execution", () => {
    const summary = getPhase4SellerReviewCallPrepScopeSummary();

    expect(summary).toMatch(/Phase 4A/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned seller communication/i);
    expect(summary).toMatch(/No outreach/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no scraping/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/Phase 4B — Seller Review Signal Audit/i);
  });

  it("throws on pinned drift blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase4SellerReviewCallPrepScope();

    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, phaseStep: "Phase 4B — Seller Review Signal Audit" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, flags: { ...phase4SellerReviewCallPrepScopeFlags, callingEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase4SellerReviewCallPrepScopeSafe({ ...result, scopePurpose: ["calling is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
