import { phase4SellerReviewSignalFamilies } from "./phase-4-seller-review-signal-audit";
import {
  assertPhase4CallPrepAdvisoryPolicySafe,
  getPhase4CallPrepAdvisoryPolicy,
  getPhase4CallPrepAdvisoryPolicySummary,
  phase4CallPrepAdvisoryLanes,
  phase4CallPrepAdvisoryPolicyFlags,
} from "./phase-4-call-prep-advisory-policy";

describe("phase 4C call prep advisory policy", () => {
  it("pins Phase 4C fields and includes all advisory call-prep lanes", () => {
    const result = getPhase4CallPrepAdvisoryPolicy();

    expect(result.phase).toBe("Phase 4: Seller Review & Call Prep");
    expect(result.phaseStep).toBe("Phase 4C — Call Prep Advisory Policy");
    expect(result.previousStep).toBe("Phase 4B — Seller Review Signal Audit");
    expect(result.phaseDecision).toBe("advisory_policy_only");
    expect(result.advisoryLanes).toEqual([
      "stop_contact_safety_first",
      "missing_seller_context_review",
      "motivation_timeline_review",
      "condition_price_expectation_review",
      "seller_reply_review",
      "objection_and_question_prep",
      "offer_readiness_context_review",
      "manual_next_step_review",
      "defer_until_data_quality_improves",
    ]);
    expect(result.signalReferences).toEqual(phase4SellerReviewSignalFamilies);
  });

  it("blocks generated outreach calling and execution", () => {
    const result = getPhase4CallPrepAdvisoryPolicy();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.sellerCallMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.outreachDecision).toBe("not_authorized");
    expect(result.callingDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 4D — Call Prep Implementation Scope");
    expect(result.policyRules.join(" ")).toMatch(/must not become generated outreach/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not contact or call sellers/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final call-prep judgment/i);
    expect(result.flags.policyOnly).toBe(true);
    expect(result.flags.callingEnabled).toBe(false);
  });

  it("summarizes advisory lanes and safe boundaries", () => {
    const summary = getPhase4CallPrepAdvisoryPolicySummary();

    expect(summary).toMatch(/Phase 4C/i);
    expect(summary).toMatch(/advisory call-prep lanes/i);
    expect(summary).toMatch(/human-owned seller communication/i);
    expect(summary).toMatch(/No generated outreach/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no autonomous lead creation/i);
    expect(summary).toMatch(/Phase 4D — Call Prep Implementation Scope/i);
  });

  it("throws on missing lanes reference drift blocked flag and unsafe wording", () => {
    const result = getPhase4CallPrepAdvisoryPolicy();

    expect(() => assertPhase4CallPrepAdvisoryPolicySafe({ ...result, advisoryLanes: phase4CallPrepAdvisoryLanes.slice(0, -1) })).toThrow(/call-prep lanes/i);
    expect(() => assertPhase4CallPrepAdvisoryPolicySafe({ ...result, signalReferences: phase4SellerReviewSignalFamilies.slice(0, -1) as never })).toThrow(/signal references/i);
    expect(() => assertPhase4CallPrepAdvisoryPolicySafe({ ...result, flags: { ...phase4CallPrepAdvisoryPolicyFlags, outreachEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase4CallPrepAdvisoryPolicySafe({ ...result, policyRules: ["generated outreach is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
