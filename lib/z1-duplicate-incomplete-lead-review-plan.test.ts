import { reviewZ1DuplicateIncompleteLead } from "./z1-duplicate-incomplete-lead-review-plan";

describe("Z1E duplicate incomplete lead review plan", () => {
  it("detects duplicate phone email and address", () => {
    const result = reviewZ1DuplicateIncompleteLead(
      {
        name: "Dana Seller",
        phone: "405-555-1212",
        email: "seller@example.com",
        propertyAddress: "123 Main St",
        zip: "73102",
        situationDetails: "Seller wants a simple option.",
        source: "homepage_form",
        timestamp: "2026-05-23T12:00:00.000Z",
      },
      [{ phone: "(405) 555-1212", email: "SELLER@example.com", propertyAddress: "123  Main St" }]
    );
    expect(result.needsReview).toBe(true);
    expect(result.duplicateReasons).toContain("duplicate phone");
    expect(result.duplicateReasons).toContain("duplicate email");
    expect(result.duplicateReasons).toContain("duplicate address");
    expect(result.deletionAllowed).toBe(false);
  });

  it("detects incomplete lead details without automation", () => {
    const result = reviewZ1DuplicateIncompleteLead({ name: "A", source: "homepage_form" });
    expect(result.needsReview).toBe(true);
    expect(result.incompleteReasons.join(" ")).toMatch(/valid phone number/);
    expect(result.automationAllowed).toBe(false);
  });
});
