import { reviewZ1CrmIntakeReadiness } from "./z1-crm-intake-readiness";

describe("Z1D CRM intake readiness", () => {
  it("reports ready CRM intake records", () => {
    const result = reviewZ1CrmIntakeReadiness({
      status: "new",
      source: "homepage_form",
      sourceDetail: "/:homepage_form",
      createdTimestamp: "2026-05-23T12:00:00.000Z",
      propertyAddress: "123 Main St",
      phone: "4055551212",
      sellerNotes: "Seller wants options.",
      nextActionPlaceholder: "manual_review",
      followUpPlaceholder: "schedule_follow_up",
    });
    expect(result.ready).toBe(true);
  });

  it("reports missing CRM readiness fields", () => {
    const result = reviewZ1CrmIntakeReadiness({ source: "homepage_form" });
    expect(result.ready).toBe(false);
    expect(result.missingReadinessFields).toContain("status");
    expect(result.missingReadinessFields).toContain("contact info");
  });
});
