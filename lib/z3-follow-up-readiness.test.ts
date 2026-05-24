import { createZ3FollowUpReadiness, createZ3FollowUpReadinessList } from "./z3-follow-up-readiness";

const readyLead = {
  status: "follow_up_needed",
  source: "homepage_form",
  sellerResponse: "Interested",
  sellerMotivation: "motivated",
  sellerTimeline: "soon",
  nextFollowUpAt: "2026-05-26T12:00:00.000Z",
  now: "2026-05-24T12:00:00.000Z",
};

describe("Z3D follow-up readiness", () => {
  it("maps all readiness levels from advisory inputs", () => {
    expect(createZ3FollowUpReadiness(readyLead).readinessLevel).toBe("ready_for_manual_follow_up_review");
    expect(createZ3FollowUpReadiness({ ...readyLead, nextFollowUpAt: undefined, followUpPlaceholder: "" }).readinessLevel).toBe("needs_data_cleanup");
    expect(createZ3FollowUpReadiness({ ...readyLead, nextFollowUpAt: "2026-05-23T12:00:00.000Z" }).readinessLevel).toBe("overdue_manual_review");
    expect(createZ3FollowUpReadiness({ ...readyLead, status: "do_not_contact", doNotContact: true }).readinessLevel).toBe("suppressed_do_not_contact");
    expect(createZ3FollowUpReadiness({ ...readyLead, status: "closed", nextFollowUpAt: undefined }).readinessLevel).toBe("terminal_no_follow_up");
    expect(createZ3FollowUpReadiness({ ...readyLead, sellerMotivation: "low", sellerTimeline: "later", followUpCount: 5, nextFollowUpAt: undefined, followUpPlaceholder: "manual nurture" }).readinessLevel).toBe("paused_low_velocity");
    expect(createZ3FollowUpReadiness({ ...readyLead, status: "unknown" }).readinessLevel).toBe("not_ready");
  });

  it("summarizes list readiness without creating follow-up artifacts", () => {
    const result = createZ3FollowUpReadinessList([
      readyLead,
      { ...readyLead, nextFollowUpAt: "2026-05-23T12:00:00.000Z" },
      { ...readyLead, status: "do_not_contact", doNotContact: true },
    ]);
    expect(result.countsByReadinessLevel.ready_for_manual_follow_up_review).toBe(1);
    expect(result.countsByReadinessLevel.overdue_manual_review).toBe(1);
    expect(result.countsByReadinessLevel.suppressed_do_not_contact).toBe(1);
    expect(result.flags.queueCreated).toBe(false);
    expect(result.flags.reminderCreated).toBe(false);
    expect(result.flags.messageDraftPersisted).toBe(false);
  });
});
