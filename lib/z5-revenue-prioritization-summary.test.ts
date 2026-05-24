import { createZ5RevenuePrioritizationList, createZ5RevenuePrioritizationSummary } from "./z5-revenue-prioritization-summary";

const baseLead = {
  id: "base",
  label: "Base",
  status: "validated",
  source: "homepage_form",
  score: 60,
  priority: "Medium",
};

describe("Z5D revenue prioritization summary", () => {
  it("maps summary levels from advisory rank lanes", () => {
    expect(createZ5RevenuePrioritizationSummary({ ...baseLead, governanceStop: true }).summaryLevel).toBe("blocked_do_not_work");
    expect(createZ5RevenuePrioritizationSummary({ status: "validated" }).summaryLevel).toBe("not_ready");
    expect(createZ5RevenuePrioritizationSummary({ ...baseLead, status: "under_contract", estimatedRevenue: 40000, score: 90, priority: "High" }).summaryLevel).toBe("review_now");
    expect(createZ5RevenuePrioritizationSummary({ ...baseLead, estimatedRevenue: 25000 }).summaryLevel).toBe("work_today");
    expect(createZ5RevenuePrioritizationSummary({ ...baseLead, status: "negotiating" }).summaryLevel).toBe("work_this_week");
    expect(createZ5RevenuePrioritizationSummary({ ...baseLead, followUpReadinessLevel: "paused_low_velocity" }).summaryLevel).toBe("monitor_only");
    expect(createZ5RevenuePrioritizationSummary({ ...baseLead, score: 20, priority: "Low" }).summaryLevel).toBe("low_priority");
  });

  it("sorts list output deterministically without mutating input", () => {
    const inputs = [
      { ...baseLead, id: "c", label: "Low", score: 20, priority: "Low" },
      { ...baseLead, id: "a", label: "Near close", status: "under_contract", estimatedRevenue: 30000, score: 85, priority: "High" },
      { ...baseLead, id: "b", label: "Blocked", doNotContact: true },
    ];
    const before = JSON.stringify(inputs);
    const result = createZ5RevenuePrioritizationList(inputs);
    expect(JSON.stringify(inputs)).toBe(before);
    expect(result.ranked[0]?.inputId).toBe("a");
    expect(result.ranked[1]?.inputId).toBe("b");
    expect(result.countsBySummaryLevel.review_now).toBe(1);
    expect(result.flags.workAssigned).toBe(false);
    expect(result.flags.leadRouted).toBe(false);
  });
});
