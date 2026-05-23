import { validateZ1LeadCapture } from "./z1-lead-capture-validation-plan";

const validLead = {
  name: "Dana Seller",
  phone: "(405) 555-1212",
  email: "seller@example.com",
  propertyAddress: "123 Main St",
  zip: "73102",
  situationDetails: "Needs a simple local sale option.",
  source: "homepage_form",
  timestamp: "2026-05-23T12:00:00.000Z",
};

describe("Z1B lead capture validation plan", () => {
  it("validates complete lead capture input", () => {
    const result = validateZ1LeadCapture(validLead);
    expect(result.valid).toBe(true);
    expect(result.normalized.phone).toBe("4055551212");
    expect(result.normalized.source).toBe("homepage_form");
  });

  it("reports missing and invalid fields with friendly messages", () => {
    const result = validateZ1LeadCapture({ source: "unknown" });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.field)).toContain("name");
    expect(result.issues.map((issue) => issue.field)).toContain("source");
    expect(result.issues.map((issue) => issue.message).join(" ")).toMatch(/valid phone number/);
  });
});
