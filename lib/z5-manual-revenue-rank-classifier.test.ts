import { classifyZ5ManualRevenueRank } from "./z5-manual-revenue-rank-classifier";

const baseLead = {
  id: "base",
  status: "validated",
  source: "homepage_form",
  score: 60,
  priority: "Medium",
};

describe("Z5C manual revenue rank classifier", () => {
  it("follows precedence for blocked and terminal records", () => {
    expect(classifyZ5ManualRevenueRank({ ...baseLead, governanceStop: true }).priorityLane).toBe("governance_stop");
    expect(classifyZ5ManualRevenueRank({ ...baseLead, doNotContact: true }).priorityLane).toBe("blocked_cleanup");
    expect(classifyZ5ManualRevenueRank({ ...baseLead, status: "dead" }).priorityLane).toBe("low_priority");
  });

  it("classifies near-close, buyer disposition, near-conversion, work-first, and follow-up priority", () => {
    expect(classifyZ5ManualRevenueRank({ ...baseLead, status: "under_contract" }).priorityLane).toBe("near_close_revenue");
    expect(classifyZ5ManualRevenueRank({ ...baseLead, status: "buyer_disposition_needed" }).priorityLane).toBe("buyer_disposition_priority");
    expect(classifyZ5ManualRevenueRank({ ...baseLead, status: "negotiating" }).priorityLane).toBe("near_conversion");
    expect(classifyZ5ManualRevenueRank({ ...baseLead, estimatedRevenue: 25000 }).priorityLane).toBe("work_first");
    expect(classifyZ5ManualRevenueRank({ ...baseLead, overdueFollowUp: true }).priorityLane).toBe("follow_up_priority");
  });

  it("classifies data quality, nurture, and low-priority lanes without persistence", () => {
    const data = classifyZ5ManualRevenueRank({ status: "validated" });
    const nurture = classifyZ5ManualRevenueRank({ ...baseLead, followUpReadinessLevel: "paused_low_velocity" });
    const low = classifyZ5ManualRevenueRank({ ...baseLead, score: 20, priority: "Low" });
    expect(data.priorityLane).toBe("data_quality_priority");
    expect(nurture.priorityLane).toBe("nurture_monitor");
    expect(low.priorityLane).toBe("low_priority");
    expect(data.flags.priorityPersisted).toBe(false);
    expect(data.flags.rankPersisted).toBe(false);
  });
});
