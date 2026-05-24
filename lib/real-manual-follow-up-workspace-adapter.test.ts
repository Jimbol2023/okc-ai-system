import type { StoredLead } from "./leads-storage";
import {
  createRealManualFollowUpWorkspaceList,
  createRealManualFollowUpWorkspaceModel,
  createRealManualFollowUpWorkspaceUsabilitySummary,
  getRealManualFollowUpWorkspaceMissingData,
  realManualFollowUpWorkspaceFlags,
  realManualFollowUpWorkspaceLanes,
} from "./real-manual-follow-up-workspace-adapter";

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
      taxDelinquent: false,
      inheritedProperty: false,
      vacantProperty: false,
      foreclosureRisk: false,
      majorRepairs: false,
      tiredLandlord: false,
      urgentTimeline: false,
      outOfStateOwner: false,
    },
    opportunityScore: "Medium",
    score: 55,
    priority: "Medium",
    scoreBreakdown: "Moderate lead score.",
    ...overrides,
  };
}

describe("real manual follow-up workspace adapter", () => {
  it("re-exports the canonical lanes and keeps lockdown flags blocked", () => {
    expect(realManualFollowUpWorkspaceLanes).toEqual([
      "blocked_no_follow_up",
      "cleanup_before_follow_up",
      "overdue_manual_review",
      "due_soon_manual_review",
      "ready_for_manual_follow_up_review",
      "monitor_follow_up",
      "pause_low_value",
      "terminal_no_follow_up",
    ]);
    expect(realManualFollowUpWorkspaceFlags.sent).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.providerCalled).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.runtimeActivationAllowed).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.storageAuthorized).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.auditWritingAllowed).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.followUpQueueCreated).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.followUpReminderCreated).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.followUpCalendarItemCreated).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.followUpAutomationTriggered).toBe(false);
    expect(realManualFollowUpWorkspaceFlags.followUpContactExecuted).toBe(false);
  });

  it("maps blocked, cleanup, overdue, due soon, ready, pause, and terminal leads through the canonical helper", () => {
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ doNotContact: true }), now).lane).toBe("blocked_no_follow_up");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ approvalStatus: "rejected" }), now).lane).toBe("blocked_no_follow_up");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ status: "closed" }), now).lane).toBe("terminal_no_follow_up");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ source: "", phone: "", email: "", propertyAddress: "" }), now).lane).toBe("cleanup_before_follow_up");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ nextFollowUpAt: "2026-05-24T11:00:00.000Z" }), now).lane).toBe("overdue_manual_review");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ nextFollowUpAt: "2026-05-24T18:00:00.000Z" }), now).lane).toBe("due_soon_manual_review");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ priority: "High", score: 82, nextFollowUpAt: "2026-05-30T12:00:00.000Z" }), now).lane).toBe("ready_for_manual_follow_up_review");
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ priority: "Low", score: 20, followUpCount: 4, nextFollowUpAt: "2026-06-10T12:00:00.000Z" }), now).lane).toBe("pause_low_value");
  });

  it("preserves source visibility, missing data, sorting, and consolidation summary", () => {
    const missingLead = makeLead({ source: "", phone: "", email: "", propertyAddress: "" });
    const leads = [
      makeLead({ id: "c", priority: "Low", score: 20, followUpCount: 4 }),
      makeLead({ id: "a", nextFollowUpAt: "2026-05-24T11:00:00.000Z" }),
      makeLead({ id: "b", doNotContact: true }),
    ];
    const before = JSON.stringify(leads);
    const list = createRealManualFollowUpWorkspaceList(leads, now);
    const summary = createRealManualFollowUpWorkspaceUsabilitySummary(leads, now);

    expect(getRealManualFollowUpWorkspaceMissingData(missingLead)).toEqual(expect.arrayContaining(["source", "contact", "property address"]));
    expect(createRealManualFollowUpWorkspaceModel(makeLead({ source: "county-import" }), now).sourceVisible).toBe("county-import");
    expect(JSON.stringify(leads)).toBe(before);
    expect(list.leads[0]?.leadId).toBe("b");
    expect(summary.canonicalHelper).toBe("manual-follow-up-workspace-usability");
    expect(summary.duplicateArchitectureCreated).toBe(false);
    expect(summary.recommendedNextExactStep).toBe("Dashboard Signal Consolidation");
    expect(summary.flags.followUpContactExecuted).toBe(false);
  });
});
