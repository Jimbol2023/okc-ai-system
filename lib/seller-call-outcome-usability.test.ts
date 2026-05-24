import type { StoredLead } from "./leads-storage";
import {
  createSellerCallOutcomeUsabilityModel,
  createSellerCallOutcomeUsabilitySummary,
  sellerCallOutcomeUsabilityFlags,
  type SellerCallOutcomeUsabilityOutcomeInput,
} from "./seller-call-outcome-usability";

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

function makeOutcome(overrides: Partial<SellerCallOutcomeUsabilityOutcomeInput> = {}): SellerCallOutcomeUsabilityOutcomeInput {
  return {
    id: "outcome-1",
    leadId: "lead-1",
    outcome: "interested",
    callCompletedAt: "2026-05-24T11:00:00.000Z",
    operatorSummary: "Seller confirmed context for manual review.",
    sellerMotivationSignal: "medium",
    sellerTimelineSignal: "medium",
    propertyConditionSignal: "medium",
    priceExpectationSignal: "medium",
    manualNextStep: "operator_review",
    safetyFlags: ["no_execution"],
    createdAt: "2026-05-24T11:01:00.000Z",
    ...overrides,
  };
}

describe("seller call outcome usability", () => {
  it("returns not-captured state, missing seller signals, and safe capture guidance when no outcomes exist", () => {
    const result = createSellerCallOutcomeUsabilityModel(makeLead(), []);

    expect(result.latestOutcomeLabel).toBe("not captured");
    expect(result.captureState).toBe("needs_capture");
    expect(result.recommendedFormDefaults).toBe(result.recommendedDefaults);
    expect(result.conciseSafetyCopy).toBe(result.safetyCopy);
    expect(result.historyScanRows).toBe(result.historyRows);
    expect(result.sourceVisibility).toBe(result.sourceVisible);
    expect(result.blockedCaptureGuidance).toContain("No DNC or rejected capture blocker");
    expect(result.missingSellerSignals).toEqual(
      expect.arrayContaining(["seller motivation", "seller timeline", "property condition", "price expectation"]),
    );
    expect(result.operatorGuidance).toContain("capture the outcome");
    expect(result.safetyCopy.join(" ")).toContain("does not send outreach");
  });

  it("summarizes the latest outcome, source, seller signals, and manual next step", () => {
    const result = createSellerCallOutcomeUsabilityModel(makeLead({ source: "county-import" }), [
      makeOutcome({ id: "old", outcome: "no_answer", callCompletedAt: "2026-05-23T11:00:00.000Z" }),
      makeOutcome({ id: "new", outcome: "wants_offer", callCompletedAt: "2026-05-24T11:00:00.000Z", manualNextStep: "manual_offer_readiness_review" }),
    ]);

    expect(result.sourceVisible).toBe("county-import");
    expect(result.sourceVisibility).toBe("county-import");
    expect(result.latestOutcomeLabel).toBe("wants offer");
    expect(result.historyRows[0]?.id).toBe("new");
    expect(result.historyScanRows[0]?.id).toBe("new");
    expect(result.historyRows[0]?.manualNextStepLabel).toBe("manual offer readiness review");
    expect(result.historyRows[0]?.sellerSignalSummary).toContain("Motivation medium");
  });

  it("returns blocked capture guidance for DNC or rejected leads", () => {
    const dnc = createSellerCallOutcomeUsabilityModel(makeLead({ doNotContact: true }), [makeOutcome()]);
    const rejected = createSellerCallOutcomeUsabilityModel(makeLead({ approvalStatus: "rejected" }), [makeOutcome()]);

    expect(dnc.captureState).toBe("blocked_manual_review");
    expect(dnc.operatorGuidance).toContain("Stop before seller-call work");
    expect(dnc.blockedCaptureGuidance).toContain("Blocked capture guidance");
    expect(rejected.captureState).toBe("blocked_manual_review");
    expect(rejected.blockedCaptureGuidance).toContain("contact-safety context");
    expect(rejected.flags.sellerCallContactExecuted).toBe(false);
  });

  it("surfaces missing source, contact, property, and seller signals as cleanup guidance", () => {
    const result = createSellerCallOutcomeUsabilityModel(
      makeLead({
        source: "",
        phone: "",
        email: "",
        propertyAddress: "",
      }),
      [makeOutcome({ sellerMotivationSignal: "not_captured", sellerTimelineSignal: "not_captured" })],
    );

    expect(result.captureState).toBe("needs_seller_signal_cleanup");
    expect(result.sourceVisible).toBe("missing source");
    expect(result.missingSellerSignals).toEqual(
      expect.arrayContaining(["source", "seller contact", "property address", "seller motivation", "seller timeline"]),
    );
  });

  it("surfaces strong seller signals for manual review without implying execution", () => {
    const result = createSellerCallOutcomeUsabilityModel(makeLead(), [
      makeOutcome({
        outcome: "appointment_set",
        sellerMotivationSignal: "high",
        sellerTimelineSignal: "high",
      }),
    ]);

    expect(result.captureState).toBe("captured_review_value");
    expect(result.operatorGuidance).toContain("Review this seller context manually");
    expect(result.safetyCopy.join(" ")).not.toMatch(/send now|call now|execute/i);
  });

  it("sorts history rows without mutating caller input", () => {
    const outcomes = [
      makeOutcome({ id: "b", callCompletedAt: "2026-05-23T11:00:00.000Z" }),
      makeOutcome({ id: "a", callCompletedAt: "2026-05-24T11:00:00.000Z" }),
    ];
    const before = JSON.stringify(outcomes);
    const result = createSellerCallOutcomeUsabilityModel(makeLead(), outcomes);

    expect(result.historyRows.map((row) => row.id)).toEqual(["a", "b"]);
    expect(JSON.stringify(outcomes)).toBe(before);
  });

  it("keeps provider, sending, runtime, queue, reminder, calendar, automation, contact, audit, and CRM mutation flags blocked", () => {
    const summary = createSellerCallOutcomeUsabilitySummary();

    expect(sellerCallOutcomeUsabilityFlags.providerCalled).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sent).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.runtimeActivationAllowed).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.storageAuthorized).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.auditWritingAllowed).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.followUpQueueCreated).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.followUpReminderCreated).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.followUpCalendarItemCreated).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.followUpAutomationTriggered).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.followUpContactExecuted).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.crmMutationAllowed).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallProviderCalled).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallSent).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallStorageAuthorizedByHelper).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallAuditWriteAuthorized).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallQueueCreated).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallReminderCreated).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallCalendarItemCreated).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallAutomationTriggered).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallContactExecuted).toBe(false);
    expect(sellerCallOutcomeUsabilityFlags.sellerCallCrmMutationExpanded).toBe(false);
    expect(summary.recommendedNextExactStep).toBe("Buyer/Disposition Readiness Usability");
  });
});
