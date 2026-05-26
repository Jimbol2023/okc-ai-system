import { phase4SellerReviewFinalLockdownRules } from "./phase-4-seller-review-final-lockdown";
import {
  assertPhase5FollowUpOrganizationScopeSafe,
  getPhase5FollowUpOrganizationScope,
  getPhase5FollowUpOrganizationScopeSummary,
  phase5FollowUpOrganizationScopeFlags,
} from "./phase-5-follow-up-organization-scope";

describe("phase 5A follow-up organization scope", () => {
  it("pins Phase 5A fields and Phase 4F continuity", () => {
    const result = getPhase5FollowUpOrganizationScope();

    expect(result.phase).toBe("Phase 5: Follow-Up Organization System");
    expect(result.phaseStep).toBe("Phase 5A — Follow-Up Organization System Scope");
    expect(result.previousStep).toBe("Phase 4F — Seller Review Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.humanRole).toBe("final_follow_up_judgment_seller_communication_timing_task_ownership_execution_owner");
    expect(result.phase4FinalLockdownReference.rules).toEqual(phase4SellerReviewFinalLockdownRules);
  });

  it("keeps all execution decisions blocked and hands off to Phase 5B", () => {
    const result = getPhase5FollowUpOrganizationScope();

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
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 5B — Follow-Up Signal Audit");
  });

  it("keeps boundaries forbidden drift and flags safe", () => {
    const result = getPhase5FollowUpOrganizationScope();

    expect(result.stopRules.join(" ")).toMatch(/No message sending/i);
    expect(result.aiOperatorLeverageBoundary.join(" ")).toMatch(/do not create follow-ups/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/final follow-up judgment/i);
    expect(result.humanOwnershipBoundary.join(" ")).toMatch(/seller communication/i);
    expect(result.forbiddenDrift.join(" ")).toMatch(/queue creation/i);
    expect(result.flags.scopeOnly).toBe(true);
    expect(result.flags.messageSendingEnabled).toBe(false);
    expect(result.flags.crmMutationEnabled).toBe(false);
    expect(result.flags.queueCreationEnabled).toBe(false);
    expect(result.flags.reminderCreationEnabled).toBe(false);
    expect(result.flags.calendarCreationEnabled).toBe(false);
    expect(result.flags.phase6ImplementationEnabled).toBe(false);
  });

  it("summarizes highest ROI scope and blocked execution", () => {
    const summary = getPhase5FollowUpOrganizationScopeSummary();

    expect(summary).toMatch(/Phase 5A/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned follow-up judgment/i);
    expect(summary).toMatch(/No outreach/i);
    expect(summary).toMatch(/no calling/i);
    expect(summary).toMatch(/no message sending/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no task, queue, reminder, or calendar creation/i);
    expect(summary).toMatch(/Phase 5B — Follow-Up Signal Audit/i);
  });

  it("throws on pinned drift blocked flag missing rules boundaries drift and unsafe wording", () => {
    const result = getPhase5FollowUpOrganizationScope();

    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, phaseStep: "Phase 5B — Follow-Up Signal Audit" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, flags: { ...phase5FollowUpOrganizationScopeFlags, queueCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase5FollowUpOrganizationScopeSafe({ ...result, scopePurpose: ["queue creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
