import { reviewZ3FollowUpStalenessRisk } from "./z3-follow-up-staleness-risk";

const baseLead = {
  status: "follow_up_needed",
  source: "homepage_form",
  sellerResponse: "Interested",
  sellerMotivation: "motivated",
  sellerTimeline: "soon",
  nextFollowUpAt: "2026-05-25T12:00:00.000Z",
  now: "2026-05-24T12:00:00.000Z",
};

describe("Z3B follow-up staleness risk", () => {
  it("detects overdue and due-soon timing", () => {
    const overdue = reviewZ3FollowUpStalenessRisk({ ...baseLead, nextFollowUpAt: "2026-05-23T12:00:00.000Z" });
    const dueSoon = reviewZ3FollowUpStalenessRisk({ ...baseLead, nextFollowUpAt: "2026-05-24T20:00:00.000Z" });
    expect(overdue.velocityRiskLevel).toBe("overdue");
    expect(overdue.stalenessSignals).toContain("overdue follow-up");
    expect(dueSoon.velocityRiskLevel).toBe("due_soon");
    expect(dueSoon.stalenessSignals).toContain("due soon");
  });

  it("detects stale contacted, stale negotiating, and aged new leads", () => {
    const contacted = reviewZ3FollowUpStalenessRisk({ ...baseLead, status: "contacted", lastContactedAt: "2026-05-20T12:00:00.000Z", nextFollowUpAt: undefined });
    const negotiating = reviewZ3FollowUpStalenessRisk({ ...baseLead, status: "negotiating", lastContactedAt: "2026-05-20T12:00:00.000Z", nextFollowUpAt: undefined });
    const agedNew = reviewZ3FollowUpStalenessRisk({ ...baseLead, status: "new", createdTimestamp: "2026-05-20T12:00:00.000Z", nextFollowUpAt: undefined });
    expect(contacted.stalenessSignals).toContain("stale contacted lead");
    expect(negotiating.stalenessSignals).toContain("stale negotiating lead");
    expect(agedNew.stalenessSignals).toContain("aged new lead");
  });

  it("detects repeated fatigue, missing timing, DNC, and terminal cases", () => {
    const fatigue = reviewZ3FollowUpStalenessRisk({ ...baseLead, followUpCount: 5, nextFollowUpAt: undefined });
    const missingTiming = reviewZ3FollowUpStalenessRisk({ ...baseLead, nextFollowUpAt: undefined, followUpPlaceholder: "" });
    const dnc = reviewZ3FollowUpStalenessRisk({ ...baseLead, status: "do_not_contact", doNotContact: true });
    const terminal = reviewZ3FollowUpStalenessRisk({ ...baseLead, status: "closed", nextFollowUpAt: undefined });
    expect(fatigue.stalenessSignals).toContain("repeated follow-up fatigue");
    expect(missingTiming.warnings).toContain("missing follow-up timing");
    expect(dnc.velocityRiskLevel).toBe("suppressed");
    expect(terminal.velocityRiskLevel).toBe("terminal");
  });

  it("does not authorize execution", () => {
    const result = reviewZ3FollowUpStalenessRisk(baseLead);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.followUpTaskCreated).toBe(false);
    expect(result.flags.scheduleWritten).toBe(false);
    expect(result.flags.automationTriggered).toBe(false);
  });
});
