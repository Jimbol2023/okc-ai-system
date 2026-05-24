import { classifyZ4ManualConversionStage } from "./z4-conversion-stage-classifier";

const baseLead = {
  status: "validated",
  source: "homepage_form",
  propertyAddress: "123 Main St",
  sellerResponse: "Interested",
  sellerMotivation: "motivated",
  sellerTimeline: "soon",
  arv: 150000,
  estimatedRepairs: 25000,
};

describe("Z4C conversion stage classifier", () => {
  it("prioritizes DNC and terminal leads as terminal_or_suppressed", () => {
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "do_not_contact", doNotContact: true }).stage).toBe("terminal_or_suppressed");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "closed" }).stage).toBe("terminal_or_suppressed");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "dead" }).stage).toBe("terminal_or_suppressed");
  });

  it("follows deterministic stage precedence for conversion states", () => {
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "closing_coordination_needed" }).stage).toBe("closing_coordination_review");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "under_contract" }).stage).toBe("buyer_disposition_review");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "buyer_disposition_needed" }).stage).toBe("buyer_disposition_review");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "contract_review_needed" }).stage).toBe("contract_review");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "negotiating" }).stage).toBe("negotiation_review");
    expect(classifyZ4ManualConversionStage({ ...baseLead, status: "offer_review_needed" }).stage).toBe("offer_review");
  });

  it("classifies follow-up and lead-context review without execution", () => {
    const followUp = classifyZ4ManualConversionStage({ ...baseLead, status: "follow_up_needed", arv: undefined, estimatedRepairs: undefined });
    const context = classifyZ4ManualConversionStage({ status: "new", source: "homepage_form" });
    expect(followUp.stage).toBe("follow_up_review");
    expect(context.stage).toBe("lead_context_review");
    expect(followUp.flags.sellerContacted).toBe(false);
    expect(context.flags.statusChanged).toBe(false);
  });
});
