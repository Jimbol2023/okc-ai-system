import {
  assertPhase5FollowUpSignalAuditSafe,
  getPhase5FollowUpSignalAudit,
  getPhase5FollowUpSignalAuditSummary,
  phase5FollowUpSignalAuditFlags,
  phase5FollowUpSignalFamilies,
} from "./phase-5-follow-up-signal-audit";

describe("phase 5B follow-up signal audit", () => {
  it("pins Phase 5B fields and includes all repo-grounded follow-up signal families", () => {
    const result = getPhase5FollowUpSignalAudit();

    expect(result.phase).toBe("Phase 5: Follow-Up Organization System");
    expect(result.phaseStep).toBe("Phase 5B — Follow-Up Signal Audit");
    expect(result.previousStep).toBe("Phase 5A — Follow-Up Organization System Scope");
    expect(result.phaseDecision).toBe("signal_audit_only");
    expect(result.signalFamilies).toEqual([
      "lead_follow_up_fields",
      "lead_review_fields",
      "contact_safety_fields",
      "seller_context_fields",
      "manual_follow_up_workspace_concepts",
      "z3_follow_up_readiness_concepts",
      "z3_follow_up_staleness_risk_concepts",
      "z3_manual_follow_up_priority_concepts",
      "z3_follow_up_velocity_policy_concepts",
    ]);
  });

  it("keeps decisions blocked and audits without creating follow-up artifacts", () => {
    const result = getPhase5FollowUpSignalAudit();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.followUpCreationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 5C — Manual Follow-Up Organization Policy");
    expect(result.auditPurpose.join(" ")).toMatch(/stale, overdue, due-soon/i);
    expect(result.flags.signalAuditOnly).toBe(true);
    expect(result.flags.messageDraftPersistenceEnabled).toBe(false);
  });

  it("summarizes signal audit and blocked execution", () => {
    const summary = getPhase5FollowUpSignalAuditSummary();

    expect(summary).toMatch(/Phase 5B/i);
    expect(summary).toMatch(/manual-follow-up workspace/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/Human-owned follow-up judgment/i);
    expect(summary).toMatch(/No outreach/i);
    expect(summary).toMatch(/no message sending/i);
    expect(summary).toMatch(/no queue, reminder, or calendar creation/i);
    expect(summary).toMatch(/Phase 5C — Manual Follow-Up Organization Policy/i);
  });

  it("throws on missing signals blocked flag missing boundaries and unsafe wording", () => {
    const result = getPhase5FollowUpSignalAudit();

    expect(() => assertPhase5FollowUpSignalAuditSafe({ ...result, signalFamilies: phase5FollowUpSignalFamilies.slice(0, -1) })).toThrow(/signal families/i);
    expect(() => assertPhase5FollowUpSignalAuditSafe({ ...result, flags: { ...phase5FollowUpSignalAuditFlags, taskCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase5FollowUpSignalAuditSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase5FollowUpSignalAuditSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase5FollowUpSignalAuditSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase5FollowUpSignalAuditSafe({ ...result, auditPurpose: ["task creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
