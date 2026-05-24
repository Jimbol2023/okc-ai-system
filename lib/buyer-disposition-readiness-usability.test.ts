import type { StoredLead } from "./leads-storage";
import {
  buyerDispositionReadinessUsabilityFlags,
  createBuyerDispositionReadinessUsabilityModel,
  createBuyerDispositionReadinessUsabilitySummary,
} from "./buyer-disposition-readiness-usability";

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
      arv: "180000",
      estimatedRepairs: "25000",
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

describe("buyer disposition readiness usability", () => {
  it("surfaces approved buyer-ready leads for manual buyer/disposition review", () => {
    const result = createBuyerDispositionReadinessUsabilityModel(
      makeLead({
        approvalStatus: "approved_for_outreach",
        score: 86,
        priority: "High",
      }),
    );

    expect(result.nearCloseVisibility).toContain("Buyer-ready approval visibility");
    expect(result.buyerReadinessScore).toBeGreaterThan(0);
    expect(result.safeManualNextReview).toMatch(/buyer package|buyer\/disposition|seller agreement|photos|access/i);
    expect(result.sourceVisible).toBe("website");
  });

  it("surfaces missing package data for buyer package cleanup", () => {
    const result = createBuyerDispositionReadinessUsabilityModel(
      makeLead({
        analyzer: {
          arv: "",
          estimatedRepairs: "",
          desiredProfit: "",
        },
      }),
    );

    expect(result.missingPackageData).toEqual(expect.arrayContaining(["ARV", "Repair estimate", "Estimated spread / assignment assumption", "Photos", "Access instructions"]));
    expect(result.safeManualNextReview).toContain("Clean up buyer package data");
    expect(result.packageChecklistSummary.missing).toBeGreaterThan(0);
  });

  it("returns blocked guidance for DNC or rejected leads", () => {
    const dnc = createBuyerDispositionReadinessUsabilityModel(makeLead({ doNotContact: true }));
    const rejected = createBuyerDispositionReadinessUsabilityModel(makeLead({ approvalStatus: "rejected" }));

    expect(dnc.buyerReadinessLabel).toBe("blocked");
    expect(dnc.blockerLabels).toContain("DNC protection active");
    expect(dnc.safeManualNextReview).toContain("Stop before buyer/disposition work");
    expect(rejected.blockerLabels).toContain("Lead rejected");
    expect(rejected.flags.buyerContacted).toBe(false);
  });

  it("surfaces under-contract near-close and title/closing review visibility", () => {
    const result = createBuyerDispositionReadinessUsabilityModel(makeLead({ status: "under_contract" }));

    expect(result.nearCloseVisibility).toContain("Under-contract visibility");
    expect(result.missingPackageData.join(" ")).toMatch(/Title|Buyer assignment|Earnest money|Closing date/i);
    expect(result.closingVisibility).toMatch(/revenue risk/i);
    expect(result.safeManualNextReview).toMatch(/closing|buyer assignment|title|earnest/i);
  });

  it("keeps clean low-priority non-contract leads in monitor or prep-only guidance", () => {
    const result = createBuyerDispositionReadinessUsabilityModel(
      makeLead({
        priority: "Low",
        score: 15,
        status: "new",
      }),
    );

    expect(result.nearCloseVisibility).toContain("No under-contract");
    expect(result.assignmentReadinessLabel).toBe("needs contract");
    expect(result.safeManualNextReview).toMatch(/Monitor|Clean up|Wait for acquisition/i);
  });

  it("does not mutate caller input while deriving checklist visibility", () => {
    const lead = makeLead({ id: "mutate-check", status: "under_contract" });
    const before = JSON.stringify(lead);
    const result = createBuyerDispositionReadinessUsabilityModel(lead);

    expect(result.leadId).toBe("mutate-check");
    expect(JSON.stringify(lead)).toBe(before);
  });

  it("keeps buyer, seller, provider, sending, runtime, queue, routing, assignment, calendar, reminder, storage, audit, contract, and CRM mutation flags blocked", () => {
    const summary = createBuyerDispositionReadinessUsabilitySummary();

    expect(buyerDispositionReadinessUsabilityFlags.buyerContacted).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.sellerContacted).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.providerCalled).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.sent).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.runtimeActivationAllowed).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionQueueCreated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionRoutingCreated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionAssignmentCreated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionCalendarItemCreated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionReminderCreated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionStorageAuthorized).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionAuditWriteAuthorized).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.contractGenerated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionContractGenerated).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionAssignmentExecuted).toBe(false);
    expect(buyerDispositionReadinessUsabilityFlags.buyerDispositionCrmMutationExpanded).toBe(false);
    expect(summary.recommendedNextExactStep).toBe("Operational Pilot Hardening");
  });
});
