import { reviewZ10DecisionSupportSignals } from "./z10-decision-support-signal-review";

describe("Z10B decision support signal review", () => {
  it("detects stop, terminal, cleanup, and risk-first signals", () => {
    expect(reviewZ10DecisionSupportSignals({ governanceStop: true }).decisionSignalLevel).toBe("stop_do_not_work");
    expect(reviewZ10DecisionSupportSignals({ doNotContact: true }).decisionSignalLevel).toBe("stop_do_not_work");
    expect(reviewZ10DecisionSupportSignals({ terminal: true }).decisionSignalLevel).toBe("terminal_no_decision");
    expect(reviewZ10DecisionSupportSignals({ missingData: ["source"] }).decisionSignalLevel).toBe("cleanup_before_decision");
    expect(reviewZ10DecisionSupportSignals({ riskLane: "near_close_risk" }).decisionSignalLevel).toBe("review_risk_first");
  });

  it("detects revenue review, monitor, defer, consolidation, and not-ready cases", () => {
    expect(reviewZ10DecisionSupportSignals({ estimatedRevenue: 25000 }).decisionSignalLevel).toBe("review_revenue_now");
    expect(reviewZ10DecisionSupportSignals({ priorityLane: "near_conversion" }).decisionSignalLevel).toBe("review_revenue_today");
    expect(reviewZ10DecisionSupportSignals({ riskLane: "monitor_risk", recoveryLane: "monitor_recovery" }).decisionSignalLevel).toBe("monitor_only");
    expect(reviewZ10DecisionSupportSignals({ priorityLane: "low_priority", estimatedRevenue: 2000 }).decisionSignalLevel).toBe("defer_low_value");
    expect(reviewZ10DecisionSupportSignals({ redundantSignalCount: 3, riskLane: "monitor_risk" }).decisionSignalLevel).toBe("consolidate_instead_of_expand");
    expect(reviewZ10DecisionSupportSignals({}).decisionSignalLevel).toBe("cleanup_before_decision");
  });

  it("does not authorize decision execution or status changes", () => {
    const result = reviewZ10DecisionSupportSignals({ estimatedRevenue: 25000 });
    expect(result.flags.decisionPersisted).toBe(false);
    expect(result.flags.decisionRouteCreated).toBe(false);
    expect(result.flags.decisionApprovalRequested).toBe(false);
    expect(result.flags.decisionExecuted).toBe(false);
    expect(result.flags.operatorAssignmentCreated).toBe(false);
    expect(result.flags.decisionNotificationCreated).toBe(false);
    expect(result.flags.leadStatusChanged).toBe(false);
    expect(result.flags.decisionAuditWritten).toBe(false);
    expect(result.consolidationRecommendation).toMatch(/No additional advisory expansion/);
  });
});
