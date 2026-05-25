import { importedLeadToStoredLead, storedLeadToDbData } from "./lead-record";
import type { ImportedLeadDraft } from "./list-importer";

function makeImportedLead(overrides: Partial<ImportedLeadDraft> = {}): ImportedLeadDraft {
  return {
    firstName: "Ada",
    lastName: "Seller",
    ownerName: "",
    phone: "4055551212",
    email: "",
    propertyAddress: "123 Main St",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    mailingAddress: "",
    county: "Oklahoma",
    parcelId: "P-1",
    situationDetails: "Imported list row.",
    source: "tax_delinquent",
    ...overrides,
  };
}

describe("lead record import conversion", () => {
  it("preserves imported lead source attribution", () => {
    const lead = importedLeadToStoredLead(makeImportedLead({ source: "driving_for_dollars" }));

    expect(lead.source).toBe("driving_for_dollars");
    expect(lead.doNotContact).toBeUndefined();
    expect(lead.automationStatus).toBeUndefined();
  });

  it("marks property-first imports as blocked manual cleanup records", () => {
    const lead = importedLeadToStoredLead(makeImportedLead({ phone: "", email: "" }));

    expect(lead.phone).toBe("");
    expect(lead.source).toBe("tax_delinquent");
    expect(lead.doNotContact).toBe(true);
    expect(lead.requiresHumanApproval).toBe(true);
    expect(lead.approvalStatus).toBe("needs_human_review");
    expect(lead.automationStatus).toBe("idle");
    expect(lead.nextFollowUpAt).toBeNull();
    expect(lead.situationDetails).toMatch(/contact cleanup required before outreach/i);
  });

  it("uses an internal synthetic DB phone key for property-first imports while keeping payload phone empty", () => {
    const lead = importedLeadToStoredLead(makeImportedLead({ phone: "", email: "" }));
    const dbData = storedLeadToDbData(lead);

    expect(dbData.phone).toMatch(/^property_only:/);
    expect(JSON.parse(dbData.payload).phone).toBe("");
  });
});
