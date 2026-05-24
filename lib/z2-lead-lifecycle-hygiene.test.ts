import { reviewZ2LeadLifecycleHygiene } from "./z2-lead-lifecycle-hygiene";

const cleanLead = {
  status: "validated",
  source: "homepage_form",
  sourceDetail: "/:homepage_form",
  createdTimestamp: "2026-05-23T12:00:00.000Z",
  lastStatusUpdatedAt: "2026-05-23T12:00:00.000Z",
  propertyAddress: "123 Main St",
  contactName: "Seller Owner",
  phone: "4055551212",
  sellerNotes: "Seller wants a cash offer.",
  nextActionPlaceholder: "manual_contact",
  followUpPlaceholder: "manual_follow_up",
  now: "2026-05-24T12:00:00.000Z",
};

describe("Z2B lead lifecycle hygiene", () => {
  it("reports clear lifecycle hygiene for complete advisory input", () => {
    const result = reviewZ2LeadLifecycleHygiene(cleanLead);
    expect(result.hygieneLevel).toBe("clear");
    expect(result.issues).toHaveLength(0);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
  });

  it("reports missing and invalid status as fail-closed review issues", () => {
    const missing = reviewZ2LeadLifecycleHygiene({ ...cleanLead, status: "" });
    const invalid = reviewZ2LeadLifecycleHygiene({ ...cleanLead, status: "wonky" });
    expect(missing.issues).toContain("missing status");
    expect(invalid.issues).toContain("invalid status");
    expect(invalid.hygieneLevel).toBe("needs_review");
  });

  it("emits stale, source mismatch, duplicate, incomplete, follow-up, and next-action signals", () => {
    const result = reviewZ2LeadLifecycleHygiene({
      status: "new",
      source: "mystery_source",
      sourceDetail: "",
      createdTimestamp: "2026-05-01T12:00:00.000Z",
      propertyAddress: "",
      phone: "",
      email: "",
      sellerNotes: "",
      nextActionPlaceholder: "",
      followUpPlaceholder: "",
      duplicateReasons: ["duplicate phone"],
      now: "2026-05-24T12:00:00.000Z",
    });
    expect(result.warnings).toContain("status/source mismatch");
    expect(result.warnings).toContain("follow-up placeholder missing");
    expect(result.warnings).toContain("stale status");
    expect(result.issues).toContain("duplicate review required");
    expect(result.issues.join(" ")).toMatch(/incomplete intake data/);
    expect(result.issues).toContain("next action unclear");
  });

  it("blocks DNC leads and identifies active terminal conflicts", () => {
    const dnc = reviewZ2LeadLifecycleHygiene({ ...cleanLead, status: "do_not_contact", doNotContact: true });
    const terminal = reviewZ2LeadLifecycleHygiene({ ...cleanLead, status: "closed", active: true });
    expect(dnc.hygieneLevel).toBe("blocked");
    expect(dnc.issues).toContain("DNC/blocked lead needing no contact");
    expect(terminal.hygieneLevel).toBe("terminal");
    expect(terminal.issues).toContain("dead/closed terminal lead incorrectly marked active");
  });
});
