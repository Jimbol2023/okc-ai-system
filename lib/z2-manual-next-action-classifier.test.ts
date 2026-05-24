import { classifyZ2ManualNextAction } from "./z2-manual-next-action-classifier";

const baseLead = {
  source: "homepage_form",
  sourceDetail: "/:homepage_form",
  propertyAddress: "123 Main St",
  contactName: "Seller Owner",
  phone: "4055551212",
  sellerNotes: "Seller is considering options.",
  nextActionPlaceholder: "manual_review",
  followUpPlaceholder: "manual_follow_up",
};

describe("Z2C manual next-action classifier", () => {
  it("classifies common manual workflow statuses", () => {
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "new" }).action).toBe("review_new_lead");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "incomplete", propertyAddress: "" }).action).toBe("complete_missing_info");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "duplicate_review" }).action).toBe("verify_duplicate");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "appointment_needed" }).action).toBe("schedule_appointment");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "offer_review_needed" }).action).toBe("prepare_conservative_offer");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "negotiating" }).action).toBe("prepare_contract_review");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "under_contract" }).action).toBe("prepare_buyer_disposition_review");
    expect(classifyZ2ManualNextAction({ ...baseLead, status: "closing_coordination_needed" }).action).toBe("coordinate_closing_manually");
  });

  it("keeps contacted communication recommendation manual and blocked from execution", () => {
    const result = classifyZ2ManualNextAction({ ...baseLead, status: "contacted" });
    expect(result.action).toBe("text_or_email_only_after_manual_approval");
    expect(result.requiredHumanReview).toBe(true);
    expect(result.flags.sent).toBe(false);
    expect(result.flags.providerCalled).toBe(false);
    expect(result.flags.outboundCommunicationAllowed).toBe(false);
  });

  it("returns no-contact for DNC or blocked leads", () => {
    const result = classifyZ2ManualNextAction({ ...baseLead, status: "manual_contact_needed", doNotContact: true });
    expect(result.action).toBe("no_contact_dnc");
    expect(result.confidence).toBe("high");
    expect(result.blockedExecutionFlags.crmMutationAllowed).toBe(false);
  });

  it("keeps dead and closed leads terminal with no execution recommendation", () => {
    const dead = classifyZ2ManualNextAction({ ...baseLead, status: "dead" });
    const closed = classifyZ2ManualNextAction({ ...baseLead, status: "closed" });
    expect(dead.action).toBe("mark_dead_after_review");
    expect(closed.action).toBe("mark_dead_after_review");
    expect(dead.whyRecommended).toMatch(/terminal/i);
    expect(closed.flags.autonomousStatusChangeAllowed).toBe(false);
  });
});
