import { reviewZ5RevenuePrioritySignals } from "./z5-revenue-priority-signal-review";

const baseLead = {
  id: "base",
  status: "validated",
  source: "homepage_form",
  score: 60,
  priority: "Medium",
};

describe("Z5B revenue priority signal review", () => {
  it("detects governance stop, blocked/DNC, and terminal cases", () => {
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, governanceStop: true }).signalLevel).toBe("governance_stop");
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, status: "do_not_contact", doNotContact: true }).signalLevel).toBe("blocked");
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, status: "closed" }).signalLevel).toBe("terminal");
  });

  it("detects high-value, near-conversion, near-close, buyer/disposition, and stale follow-up cases", () => {
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, estimatedRevenue: 25000 }).signalLevel).toBe("high_value");
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, conversionReadinessLevel: "needs_offer_review" }).signalLevel).toBe("near_conversion");
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, status: "under_contract" }).signalLevel).toBe("near_close");
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, status: "buyer_disposition_needed" }).signalLevel).toBe("buyer_disposition");
    expect(reviewZ5RevenuePrioritySignals({ ...baseLead, overdueFollowUp: true }).signalLevel).toBe("stale_follow_up");
  });

  it("detects missing critical data, nurture, and low-priority cases", () => {
    const missing = reviewZ5RevenuePrioritySignals({ status: "validated" });
    const nurture = reviewZ5RevenuePrioritySignals({ ...baseLead, followUpReadinessLevel: "paused_low_velocity" });
    const low = reviewZ5RevenuePrioritySignals({ ...baseLead, score: 20, priority: "Low" });
    expect(missing.signalLevel).toBe("needs_data");
    expect(missing.missingData).toEqual(expect.arrayContaining(["source", "score or estimated revenue"]));
    expect(nurture.signalLevel).toBe("nurture");
    expect(low.signalLevel).toBe("low_priority");
    expect(low.flags.revenueActionExecuted).toBe(false);
  });
});
