import { classifyZ10ManualDecisionSupport } from "./z10-manual-decision-support-classifier";

describe("Z10C manual decision support classifier", () => {
  it("follows precedence for stop, terminal, cleanup, and risk-first", () => {
    expect(classifyZ10ManualDecisionSupport({ governanceStop: true }).decisionLane).toBe("stop_do_not_work");
    expect(classifyZ10ManualDecisionSupport({ terminal: true }).decisionLane).toBe("terminal_no_decision");
    expect(classifyZ10ManualDecisionSupport({ missingData: ["phone"] }).decisionLane).toBe("cleanup_before_decision");
    expect(classifyZ10ManualDecisionSupport({ riskLane: "conversion_quality_risk" }).decisionLane).toBe("review_risk_first");
  });

  it("classifies review-now, review-today, consolidate, monitor, and defer lanes", () => {
    expect(classifyZ10ManualDecisionSupport({ estimatedRevenue: 30000 }).decisionLane).toBe("review_revenue_now");
    expect(classifyZ10ManualDecisionSupport({ workdayLane: "work_today" }).decisionLane).toBe("review_revenue_today");
    expect(classifyZ10ManualDecisionSupport({ redundantSignalCount: 3, riskLane: "monitor_risk" }).decisionLane).toBe("consolidate_instead_of_expand");
    expect(classifyZ10ManualDecisionSupport({ riskLane: "monitor_risk" }).decisionLane).toBe("monitor_only");
    expect(classifyZ10ManualDecisionSupport({ priorityLane: "low_priority", estimatedRevenue: 1000 }).decisionLane).toBe("defer_low_value");
  });

  it("keeps decision score advisory and penalizes cognitive load", () => {
    const strong = classifyZ10ManualDecisionSupport({ estimatedRevenue: 30000, advisoryScore: 80 });
    const noisy = classifyZ10ManualDecisionSupport({ estimatedRevenue: 30000, advisoryScore: 80, redundantSignalCount: 4, usabilityNotes: ["too many panels"] });
    expect(strong.advisoryDecisionScore).toBeGreaterThan(noisy.advisoryDecisionScore);
    expect(noisy.confidence).toBe("low");
    expect(strong.flags.decisionPersisted).toBe(false);
    expect(strong.flags.decisionExecuted).toBe(false);
  });
});
