import { createZ2CrmWorkflowReadiness, createZ2CrmWorkflowReadinessList } from "./z2-crm-workflow-readiness";

const readyLead = {
  status: "validated",
  source: "homepage_form",
  sourceDetail: "/:homepage_form",
  propertyAddress: "123 Main St",
  contactName: "Seller Owner",
  phone: "4055551212",
  sellerNotes: "Seller wants options.",
  nextActionPlaceholder: "manual_contact",
  followUpPlaceholder: "manual_follow_up",
};

describe("Z2D CRM workflow readiness", () => {
  it("maps ready, cleanup, duplicate, human-action, DNC, terminal, and not-ready states", () => {
    expect(createZ2CrmWorkflowReadiness(readyLead).readinessLevel).toBe("ready_for_manual_review");
    expect(createZ2CrmWorkflowReadiness({ ...readyLead, propertyAddress: "" }).readinessLevel).toBe("needs_data_cleanup");
    expect(createZ2CrmWorkflowReadiness({ ...readyLead, status: "duplicate_review" }).readinessLevel).toBe("needs_duplicate_review");
    expect(createZ2CrmWorkflowReadiness({ ...readyLead, status: "manual_contact_needed" }).readinessLevel).toBe("needs_human_next_action");
    expect(createZ2CrmWorkflowReadiness({ ...readyLead, status: "do_not_contact" }).readinessLevel).toBe("blocked_do_not_contact");
    expect(createZ2CrmWorkflowReadiness({ ...readyLead, status: "closed" }).readinessLevel).toBe("terminal_no_action");
    expect(createZ2CrmWorkflowReadiness({ ...readyLead, status: "unknown" }).readinessLevel).toBe("not_ready");
  });

  it("summarizes list readiness without persistence or mutation authorization", () => {
    const result = createZ2CrmWorkflowReadinessList([
      readyLead,
      { ...readyLead, status: "duplicate_review" },
      { ...readyLead, status: "do_not_contact" },
    ]);
    expect(result.countsByReadinessLevel.ready_for_manual_review).toBe(1);
    expect(result.countsByReadinessLevel.needs_duplicate_review).toBe(1);
    expect(result.countsByReadinessLevel.blocked_do_not_contact).toBe(1);
    expect(result.flags.storageAuthorized).toBe(false);
    expect(result.flags.crmMutationAllowed).toBe(false);
    expect(result.flags.providerCalled).toBe(false);
  });
});
