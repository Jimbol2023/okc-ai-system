import { createZ4ManualConversionReadiness, createZ4ManualConversionReadinessList } from "./z4-manual-conversion-readiness";

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

describe("Z4D manual conversion readiness", () => {
  it("maps readiness levels for single-lead inputs", () => {
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "new" }).readinessLevel).toBe("ready_for_manual_conversion_review");
    expect(createZ4ManualConversionReadiness({ status: "validated", source: "homepage_form" }).readinessLevel).toBe("needs_conversion_data_cleanup");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "offer_review_needed" }).readinessLevel).toBe("needs_offer_review");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "negotiating" }).readinessLevel).toBe("needs_negotiation_review");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "contract_review_needed" }).readinessLevel).toBe("needs_contract_review");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "buyer_disposition_needed" }).readinessLevel).toBe("needs_buyer_disposition_review");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "closing_coordination_needed" }).readinessLevel).toBe("needs_closing_coordination_review");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "do_not_contact", doNotContact: true }).readinessLevel).toBe("blocked_or_suppressed");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "closed" }).readinessLevel).toBe("terminal_no_conversion");
    expect(createZ4ManualConversionReadiness({ ...baseLead, status: "unknown" }).readinessLevel).toBe("not_ready");
  });

  it("summarizes list readiness without conversion execution", () => {
    const result = createZ4ManualConversionReadinessList([
      { ...baseLead, status: "offer_review_needed" },
      { ...baseLead, status: "negotiating" },
      { ...baseLead, status: "do_not_contact", doNotContact: true },
    ]);
    expect(result.countsByReadinessLevel.needs_offer_review).toBe(1);
    expect(result.countsByReadinessLevel.needs_negotiation_review).toBe(1);
    expect(result.countsByReadinessLevel.blocked_or_suppressed).toBe(1);
    expect(result.flags.contractGenerated).toBe(false);
    expect(result.flags.buyerContacted).toBe(false);
    expect(result.flags.conversionActionExecuted).toBe(false);
  });
});
