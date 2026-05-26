import {
  assertPhase4SellerReviewSignalAuditSafe,
  getPhase4SellerReviewSignalAudit,
  getPhase4SellerReviewSignalAuditSummary,
  phase4SellerReviewSignalAuditFlags,
  phase4SellerReviewSignalFamilies,
} from "./phase-4-seller-review-signal-audit";

describe("phase 4B seller review signal audit", () => {
  it("pins Phase 4B fields and includes all repo-grounded signal families", () => {
    const result = getPhase4SellerReviewSignalAudit();

    expect(result.phase).toBe("Phase 4: Seller Review & Call Prep");
    expect(result.phaseStep).toBe("Phase 4B — Seller Review Signal Audit");
    expect(result.previousStep).toBe("Phase 4A — Seller Review & Call Prep Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual([
      "lead_identity_contact_fields",
      "lead_property_source_status_fields",
      "lead_score_priority_notes_payload_fields",
      "review_safety_fields",
      "seller_reply_fields",
      "follow_up_visibility_fields",
      "seller_call_outcome_fields",
      "seller_call_usability_helper_concepts",
      "seller_call_outcome_plan_concepts",
      "human_guided_seller_conversation_helper_concepts",
    ]);
  });

  it("keeps decisions blocked and audits without authorizing mutation", () => {
    const result = getPhase4SellerReviewSignalAudit();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.sellerCallMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.outreachDecision).toBe("not_authorized");
    expect(result.callingDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 4C — Call Prep Advisory Policy");
    expect(result.auditPurpose.join(" ")).toMatch(/motivation, timeline, condition, price expectations/i);
    expect(result.flags.signalAuditOnly).toBe(true);
    expect(result.flags.sellerCallRecordMutationEnabled).toBe(false);
  });

  it("summarizes signal audit and blocked execution", () => {
    const summary = getPhase4SellerReviewSignalAuditSummary();

    expect(summary).toMatch(/Phase 4B/i);
    expect(summary).toMatch(/seller-call outcome/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/Human-owned seller communication/i);
    expect(summary).toMatch(/No outreach/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/Phase 4C — Call Prep Advisory Policy/i);
  });

  it("throws on missing signals blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase4SellerReviewSignalAudit();

    expect(() => assertPhase4SellerReviewSignalAuditSafe({ ...result, signalFamilies: phase4SellerReviewSignalFamilies.slice(0, -1) })).toThrow(/signal families/i);
    expect(() => assertPhase4SellerReviewSignalAuditSafe({ ...result, flags: { ...phase4SellerReviewSignalAuditFlags, sellerCallRecordMutationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase4SellerReviewSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase4SellerReviewSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase4SellerReviewSignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase4SellerReviewSignalAuditSafe({ ...result, auditPurpose: ["outreach is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
