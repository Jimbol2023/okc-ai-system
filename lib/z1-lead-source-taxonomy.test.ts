import { createZ1LeadSourceTaxonomyReview, normalizeZ1LeadSource, z1LeadSourceLabels } from "./z1-lead-source-taxonomy";

describe("Z1A lead source taxonomy", () => {
  it("includes deterministic source labels", () => {
    expect(z1LeadSourceLabels).toContain("homepage_hero");
    expect(z1LeadSourceLabels).toContain("tax_list_upload");
    expect(z1LeadSourceLabels).toContain("out_of_state_owner");
  });

  it("normalizes known source aliases", () => {
    expect(normalizeZ1LeadSource("Seller Page Form")).toBe("seller_page");
    expect(normalizeZ1LeadSource("dashboard_manual")).toBe("manual_dashboard_entry");
    expect(normalizeZ1LeadSource("unknown")).toBeNull();
  });

  it("keeps revenue operations flags blocked", () => {
    const result = createZ1LeadSourceTaxonomyReview();
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
  });
});
