import type { StoredLead } from "./leads-storage";
import {
  createLeadDetailManualReviewModel,
  createLeadDetailManualReviewUsabilitySummary,
  type LeadDetailSellerCallOutcomeInput,
} from "./lead-detail-manual-review-usability";

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

function makeOutcome(overrides: Partial<LeadDetailSellerCallOutcomeInput> = {}): LeadDetailSellerCallOutcomeInput {
  return {
    outcome: "interested",
    callCompletedAt: "2026-05-24T11:00:00.000Z",
    operatorSummary: "Seller wants a manual review.",
    sellerMotivationSignal: "strong",
    sellerTimelineSignal: "medium",
    propertyConditionSignal: "medium",
    priceExpectationSignal: "not_captured",
    manualNextStep: "operator_review",
    safetyFlags: ["no_execution"],
    ...overrides,
  };
}

describe("lead detail manual review usability", () => {
  it("maps DNC or rejected leads to blocked manual-stop guidance", () => {
    const dnc = createLeadDetailManualReviewModel(makeLead({ doNotContact: true }), [makeOutcome()], now);
    const rejected = createLeadDetailManualReviewModel(makeLead({ approvalStatus: "rejected" }), [makeOutcome()], now);

    expect(dnc.decision.decisionLane).toBe("stop_do_not_work");
    expect(dnc.followUp.lane).toBe("blocked_no_follow_up");
    expect(dnc.safeManualNextReview).toContain("Stop before working");
    expect(rejected.blockedVisibility).toContain("Rejected approval");
  });

  it("maps missing source, contact, property, or seller context to cleanup guidance", () => {
    const review = createLeadDetailManualReviewModel(
      makeLead({
        source: "",
        phone: "",
        email: "",
        propertyAddress: "",
      }),
      [makeOutcome({ sellerMotivationSignal: "not_captured", sellerTimelineSignal: "not_captured" })],
      now,
    );

    expect(review.decision.decisionLane).toBe("cleanup_before_decision");
    expect(review.followUp.lane).toBe("cleanup_before_follow_up");
    expect(review.sourceVisible).toBe("missing source");
    expect(review.missingCriticalData).toEqual(
      expect.arrayContaining(["source", "contact", "property address", "seller motivation", "seller timeline"]),
    );
    expect(review.safeManualNextReview).toContain("Clean up");
  });

  it("maps closed leads to terminal no-active-review guidance", () => {
    const review = createLeadDetailManualReviewModel(makeLead({ status: "closed" }), [makeOutcome()], now);

    expect(review.decision.decisionLane).toBe("terminal_no_decision");
    expect(review.followUp.lane).toBe("terminal_no_follow_up");
    expect(review.safeManualNextReview).toContain("No active manual review");
  });

  it("summarizes valid seller call outcomes", () => {
    const review = createLeadDetailManualReviewModel(makeLead(), [makeOutcome({ outcome: "wants_offer" })], now);

    expect(review.sellerContextSummary).toContain("wants offer");
    expect(review.sellerContextSummary).toContain("motivation strong");
    expect(review.sellerContextSummary).toContain("manual next step operator review");
  });

  it("preserves follow-up workspace lanes and Z10 as the controlling decision layer", () => {
    const review = createLeadDetailManualReviewModel(
      makeLead({
        priority: "High",
        score: 82,
        nextFollowUpAt: "2026-05-24T11:30:00.000Z",
      }),
      [makeOutcome()],
      now,
    );

    expect(review.followUp.lane).toBe("overdue_manual_review");
    expect(review.z10ControlsDecisionLayer).toBe(true);
    expect(review.decision.decisionLane).toBe("review_revenue_now");
    expect(review.sourceVisible).toBe("website");
  });

  it("keeps all execution, communication, storage, queue, reminder, calendar, and CRM mutation flags blocked", () => {
    const review = createLeadDetailManualReviewModel(makeLead(), [makeOutcome()], now);
    const summary = createLeadDetailManualReviewUsabilitySummary();

    expect(review.flags.providerCalled).toBe(false);
    expect(review.flags.sent).toBe(false);
    expect(review.flags.runtimeActivationAllowed).toBe(false);
    expect(review.flags.storageAuthorized).toBe(false);
    expect(review.flags.auditWritingAllowed).toBe(false);
    expect(review.flags.followUpQueueCreated).toBe(false);
    expect(review.flags.followUpReminderCreated).toBe(false);
    expect(review.flags.followUpCalendarItemCreated).toBe(false);
    expect(review.flags.followUpContactExecuted).toBe(false);
    expect(review.flags.crmMutationAllowed).toBe(false);
    expect(summary.recommendedNextExactStep).toBe("Dashboard Signal Consolidation");
  });
});
