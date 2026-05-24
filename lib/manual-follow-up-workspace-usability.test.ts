import type { StoredLead } from "./leads-storage";
import {
  createManualFollowUpWorkspaceList,
  createManualFollowUpWorkspaceModel,
  createManualFollowUpWorkspaceUsabilitySummary,
  getManualFollowUpWorkspaceMissingData,
  manualFollowUpWorkspaceFlags,
  manualFollowUpWorkspaceLanes,
} from "./manual-follow-up-workspace-usability";

const now = new Date("2026-05-24T12:00:00.000Z");

function makeLead(overrides: Partial<StoredLead> = {}): StoredLead {
  return {
    id: "lead-1",
    timestamp: "2026-05-24T10:00:00.000Z",
    firstName: "Ada",
    lastName: "Seller",
    email: "ada@example.com",
    phone: "4055551212",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    ownerName: "",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "",
    situationDetails: "Needs a simple sale.",
    source: "website",
    status: "contacted",
    notes: [],
    followUps: [],
    analyzer: {
      arv: "",
      estimatedRepairs: "",
      desiredProfit: "20000",
    },
    distressFlags: {
      absenteeOwner: false,
      highEquity: false,
      codeViolation: false,
      taxDelinquent: false,
      vacant: false,
      tiredLandlord: false,
      inherited: false,
      divorce: false,
      foreclosure: false,
      unknown: false,
    },
    opportunityScore: "Medium",
    score: 55,
    priority: "Medium",
    scoreBreakdown: "Moderate lead score.",
    ...overrides,
  };
}

describe("manual follow-up workspace usability", () => {
  it("keeps lane metadata deterministic and advisory-only flags blocked", () => {
    expect(manualFollowUpWorkspaceLanes).toEqual([
      "blocked_no_follow_up",
      "cleanup_before_follow_up",
      "overdue_manual_review",
      "due_soon_manual_review",
      "ready_for_manual_follow_up_review",
      "monitor_follow_up",
      "pause_low_value",
      "terminal_no_follow_up",
    ]);
    expect(manualFollowUpWorkspaceFlags.sent).toBe(false);
    expect(manualFollowUpWorkspaceFlags.providerCalled).toBe(false);
    expect(manualFollowUpWorkspaceFlags.runtimeActivationAllowed).toBe(false);
    expect(manualFollowUpWorkspaceFlags.storageAuthorized).toBe(false);
    expect(manualFollowUpWorkspaceFlags.auditWritingAllowed).toBe(false);
    expect(manualFollowUpWorkspaceFlags.followUpQueueCreated).toBe(false);
    expect(manualFollowUpWorkspaceFlags.followUpReminderCreated).toBe(false);
    expect(manualFollowUpWorkspaceFlags.followUpCalendarItemCreated).toBe(false);
    expect(manualFollowUpWorkspaceFlags.followUpAutomationTriggered).toBe(false);
    expect(manualFollowUpWorkspaceFlags.followUpContactExecuted).toBe(false);
  });

  it("maps DNC and rejected leads to blocked no-follow-up", () => {
    expect(createManualFollowUpWorkspaceModel(makeLead({ doNotContact: true }), now).lane).toBe("blocked_no_follow_up");
    expect(createManualFollowUpWorkspaceModel(makeLead({ approvalStatus: "rejected" }), now).lane).toBe("blocked_no_follow_up");
  });

  it("maps closed leads to terminal no-follow-up", () => {
    const model = createManualFollowUpWorkspaceModel(makeLead({ status: "closed" }), now);

    expect(model.lane).toBe("terminal_no_follow_up");
    expect(model.safeManualNextReview).toContain("No active follow-up review");
  });

  it("maps missing source, contact, or property data to cleanup before follow-up", () => {
    const lead = makeLead({
      source: "",
      phone: "",
      email: "",
      propertyAddress: "",
    });
    const model = createManualFollowUpWorkspaceModel(lead, now);

    expect(getManualFollowUpWorkspaceMissingData(lead)).toEqual(expect.arrayContaining(["source", "contact", "property address"]));
    expect(model.lane).toBe("cleanup_before_follow_up");
    expect(model.sourceVisible).toBe("missing source");
  });

  it("maps past explicit or pending follow-up timing to overdue manual review", () => {
    expect(
      createManualFollowUpWorkspaceModel(
        makeLead({ nextFollowUpAt: "2026-05-24T11:00:00.000Z" }),
        now,
      ).lane,
    ).toBe("overdue_manual_review");

    expect(
      createManualFollowUpWorkspaceModel(
        makeLead({
          nextFollowUpAt: null,
          followUps: [
            {
              id: "fu-1",
              date: "2026-05-24T10:30:00.000Z",
              type: "call",
              message: "Manual review placeholder",
              status: "pending",
            },
          ],
        }),
        now,
      ).lane,
    ).toBe("overdue_manual_review");
  });

  it("maps near future timing to due soon manual review", () => {
    const model = createManualFollowUpWorkspaceModel(
      makeLead({ nextFollowUpAt: "2026-05-24T18:00:00.000Z" }),
      now,
    );

    expect(model.lane).toBe("due_soon_manual_review");
    expect(model.safeManualNextReview).toContain("no schedule or reminder is written");
  });

  it("maps high-priority contacted leads with usable data to ready manual review", () => {
    const model = createManualFollowUpWorkspaceModel(
      makeLead({ priority: "High", score: 82, nextFollowUpAt: "2026-05-30T12:00:00.000Z" }),
      now,
    );

    expect(model.lane).toBe("ready_for_manual_follow_up_review");
    expect(model.sourceVisible).toBe("website");
  });

  it("maps low-value repeated follow-up to pause or monitor lanes", () => {
    const model = createManualFollowUpWorkspaceModel(
      makeLead({
        priority: "Low",
        score: 20,
        followUpCount: 4,
        nextFollowUpAt: "2026-06-10T12:00:00.000Z",
      }),
      now,
    );

    expect(["pause_low_value", "monitor_follow_up"]).toContain(model.lane);
    expect(model.lane).toBe("pause_low_value");
  });

  it("creates a deterministic list and final usability summary without mutating inputs", () => {
    const leads = [
      makeLead({ id: "c", priority: "Low", score: 20, followUpCount: 4 }),
      makeLead({ id: "a", nextFollowUpAt: "2026-05-24T11:00:00.000Z" }),
      makeLead({ id: "b", doNotContact: true }),
    ];
    const before = JSON.stringify(leads);
    const list = createManualFollowUpWorkspaceList(leads, now);
    const summary = createManualFollowUpWorkspaceUsabilitySummary(leads, now);

    expect(JSON.stringify(leads)).toBe(before);
    expect(list.leads[0]?.leadId).toBe("b");
    expect(list.laneCounts.blocked_no_follow_up).toBe(1);
    expect(summary.followUpWorkspaceUsabilityReady).toBe(true);
    expect(summary.z10ConsolidationControlsDecisionLayer).toBe(true);
    expect(summary.recommendedNextExactStep).toBe("Lead Detail Manual Review Usability");
    expect(summary.flags.followUpMessageSent).toBe(false);
    expect(summary.flags.crmMutationAllowed).toBe(false);
  });
});
