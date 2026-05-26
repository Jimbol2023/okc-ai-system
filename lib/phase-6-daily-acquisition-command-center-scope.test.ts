import { phase5FollowUpFinalLockdownRules } from "./phase-5-follow-up-final-lockdown";
import {
  assertPhase6DailyAcquisitionCommandCenterScopeSafe,
  getPhase6DailyAcquisitionCommandCenterScope,
  getPhase6DailyAcquisitionCommandCenterScopeSummary,
  phase6DailyAcquisitionCommandCenterScopeFlags,
} from "./phase-6-daily-acquisition-command-center-scope";

describe("phase 6A daily acquisition command center scope", () => {
  it("pins Phase 6A fields and Phase 5F continuity", () => {
    const result = getPhase6DailyAcquisitionCommandCenterScope();

    expect(result.phase).toBe("Phase 6: Daily Acquisition Command Center");
    expect(result.phaseStep).toBe("Phase 6A — Daily Acquisition Command Center Scope");
    expect(result.previousStep).toBe("Phase 5F — Follow-Up Organization Final Lockdown");
    expect(result.phaseDecision).toBe("scope_only");
    expect(result.primaryMetric).toBe("acquisition_roi_per_operator_hour");
    expect(result.aiRole).toBe("operator_leverage_only");
    expect(result.humanRole).toBe("final_daily_work_selection_seller_communication_task_ownership_prioritization_execution_owner");
    expect(result.phase5FinalLockdownReference.rules).toEqual(phase5FollowUpFinalLockdownRules);
  });

  it("keeps all decisions blocked and hands off to Phase 6B", () => {
    const result = getPhase6DailyAcquisitionCommandCenterScope();

    expect(result.implementationDecision).toBe("not_authorized");
    expect(result.providerDecision).toBe("not_authorized");
    expect(result.automationDecision).toBe("not_authorized");
    expect(result.communicationDecision).toBe("not_authorized");
    expect(result.crmMutationDecision).toBe("not_authorized");
    expect(result.taskDecision).toBe("not_authorized");
    expect(result.queueDecision).toBe("not_authorized");
    expect(result.routingDecision).toBe("not_authorized");
    expect(result.assignmentDecision).toBe("not_authorized");
    expect(result.reminderDecision).toBe("not_authorized");
    expect(result.calendarDecision).toBe("not_authorized");
    expect(result.notificationDecision).toBe("not_authorized");
    expect(result.dailyPlanDecision).toBe("not_authorized");
    expect(result.auditDecision).toBe("not_authorized");
    expect(result.recommendedNextExactStep).toBe("Phase 6B — Command Center Signal Audit");
  });

  it("summarizes highest ROI scope and blocked execution", () => {
    const summary = getPhase6DailyAcquisitionCommandCenterScopeSummary();

    expect(summary).toMatch(/Phase 6A/i);
    expect(summary).toMatch(/highest acquisition ROI per operator hour/i);
    expect(summary).toMatch(/human-owned daily work selection/i);
    expect(summary).toMatch(/No task, queue, routing, assignment/i);
    expect(summary).toMatch(/no CRM mutation/i);
    expect(summary).toMatch(/no automation/i);
    expect(summary).toMatch(/no revenue execution/i);
    expect(summary).toMatch(/Phase 6B — Command Center Signal Audit/i);
  });

  it("throws on pinned drift blocked flag missing rules boundaries drift and unsafe wording", () => {
    const result = getPhase6DailyAcquisitionCommandCenterScope();

    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, phaseStep: "Phase 6B — Command Center Signal Audit" as never })).toThrow(/step must remain pinned/i);
    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, flags: { ...phase6DailyAcquisitionCommandCenterScopeFlags, queueCreationEnabled: true } as never })).toThrow(/blocked flags/i);
    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, stopRules: [] })).toThrow(/stop rules/i);
    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, aiOperatorLeverageBoundary: [] })).toThrow(/AI boundary/i);
    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, humanOwnershipBoundary: [] })).toThrow(/human boundary/i);
    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, forbiddenDrift: [] })).toThrow(/forbidden drift/i);
    expect(() => assertPhase6DailyAcquisitionCommandCenterScopeSafe({ ...result, scopePurpose: ["queue creation is authorized"] })).toThrow(/unsafe authorization/i);
  });
});
