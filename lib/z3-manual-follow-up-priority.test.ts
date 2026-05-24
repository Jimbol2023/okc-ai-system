import { classifyZ3ManualFollowUpPriority } from "./z3-manual-follow-up-priority";

const baseLead = {
  status: "follow_up_needed",
  source: "homepage_form",
  sellerResponse: "Interested",
  sellerMotivation: "motivated seller",
  sellerTimeline: "soon",
  nextFollowUpAt: "2026-05-26T12:00:00.000Z",
  now: "2026-05-24T12:00:00.000Z",
};

describe("Z3C manual follow-up priority", () => {
  it("classifies hot urgent sellers for same-day manual review", () => {
    const result = classifyZ3ManualFollowUpPriority({ ...baseLead, sellerTimeline: "today asap", isHot: true });
    expect(result.priorityLevel).toBe("urgent");
    expect(result.cadenceBand).toBe("same_day_manual_review");
    expect(result.requiredHumanReview).toBe(true);
  });

  it("classifies overdue and due-soon follow-ups", () => {
    const overdue = classifyZ3ManualFollowUpPriority({ ...baseLead, nextFollowUpAt: "2026-05-23T12:00:00.000Z" });
    const dueSoon = classifyZ3ManualFollowUpPriority({ ...baseLead, nextFollowUpAt: "2026-05-24T20:00:00.000Z" });
    expect(overdue.priorityLevel).toBe("urgent");
    expect(overdue.cadenceBand).toBe("same_day_manual_review");
    expect(dueSoon.priorityLevel).toBe("high");
    expect(dueSoon.cadenceBand).toBe("within_24_hours");
  });

  it("classifies missing data and cold repeated follow-up safely", () => {
    const cleanup = classifyZ3ManualFollowUpPriority({ status: "follow_up_needed", now: "2026-05-24T12:00:00.000Z" });
    const fatigue = classifyZ3ManualFollowUpPriority({ ...baseLead, sellerMotivation: "low", sellerTimeline: "later", nextFollowUpAt: undefined, followUpPlaceholder: "manual nurture", followUpCount: 5 });
    expect(cleanup.priorityLevel).toBe("cleanup");
    expect(cleanup.cadenceBand).toBe("within_48_hours");
    expect(fatigue.priorityLevel).toBe("low");
    expect(fatigue.cadenceBand).toBe("low_frequency_nurture");
  });

  it("suppresses DNC and pauses terminal leads", () => {
    const dnc = classifyZ3ManualFollowUpPriority({ ...baseLead, status: "do_not_contact", doNotContact: true });
    const dead = classifyZ3ManualFollowUpPriority({ ...baseLead, status: "dead" });
    const closed = classifyZ3ManualFollowUpPriority({ ...baseLead, status: "closed" });
    expect(dnc.cadenceBand).toBe("no_follow_up");
    expect(dnc.flags.outboundCommunicationAllowed).toBe(false);
    expect(dead.cadenceBand).toBe("pause_follow_up");
    expect(closed.cadenceBand).toBe("pause_follow_up");
  });
});
