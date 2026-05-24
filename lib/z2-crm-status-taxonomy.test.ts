import { createZ2CrmStatusTaxonomyReview, normalizeZ2CrmStatus, z2CrmStatuses, z2CrmStatusTaxonomy, z2CrmWorkflowFlags } from "./z2-crm-status-taxonomy";

describe("Z2A CRM status taxonomy", () => {
  it("includes all recommended CRM statuses with required metadata", () => {
    expect(z2CrmStatuses).toEqual([
      "new",
      "needs_review",
      "validated",
      "incomplete",
      "duplicate_review",
      "manual_contact_needed",
      "contacted",
      "follow_up_needed",
      "appointment_needed",
      "appointment_set",
      "offer_review_needed",
      "offer_made",
      "negotiating",
      "contract_review_needed",
      "under_contract",
      "buyer_disposition_needed",
      "closing_coordination_needed",
      "closed",
      "dead",
      "do_not_contact",
    ]);

    for (const status of z2CrmStatuses) {
      const metadata = z2CrmStatusTaxonomy[status];
      expect(metadata.label).toBeTruthy();
      expect(metadata.description).toBeTruthy();
      expect(metadata.allowedManualMeaning).toBeTruthy();
      expect(metadata.revenuePurpose).toBeTruthy();
      expect(typeof metadata.needsHumanReview).toBe("boolean");
      expect(typeof metadata.terminal).toBe("boolean");
      expect(typeof metadata.blocked).toBe("boolean");
      expect(metadata.safeNextManualActionHints.length).toBeGreaterThan(0);
    }
  });

  it("normalizes valid statuses and fails closed for invalid status values", () => {
    expect(normalizeZ2CrmStatus("Manual Contact Needed")).toBe("manual_contact_needed");
    expect(normalizeZ2CrmStatus("unknown")).toBeNull();
    expect(normalizeZ2CrmStatus(undefined)).toBeNull();
  });

  it("preserves Z2 lockdown flags", () => {
    const result = createZ2CrmStatusTaxonomyReview();
    expect(result.flags).toBe(z2CrmWorkflowFlags);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.runtimeActivationAllowed).toBe(false);
    expect(result.flags.providerActivationAllowed).toBe(false);
    expect(result.flags.approvalGrantsExecution).toBe(false);
    expect(result.flags.auditWritingAllowed).toBe(false);
    expect(result.flags.schemaChangesAuthorized).toBe(false);
    expect(result.flags.migrationsAuthorized).toBe(false);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.autonomousStatusChangeAllowed).toBe(false);
    expect(result.flags.outboundCommunicationAllowed).toBe(false);
  });
});
