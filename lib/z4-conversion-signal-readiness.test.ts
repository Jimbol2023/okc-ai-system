import { reviewZ4ConversionSignalReadiness } from "./z4-conversion-signal-readiness";

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

describe("Z4B conversion signal readiness", () => {
  it("detects ready seller and valuation context", () => {
    const result = reviewZ4ConversionSignalReadiness(baseLead);
    expect(result.readySignals).toContain("seller context clarity");
    expect(result.readySignals).toContain("valuation readiness");
    expect(result.signalLevel).toBe("needs_offer_review");
  });

  it("detects missing critical valuation and context data", () => {
    const result = reviewZ4ConversionSignalReadiness({ status: "validated", source: "homepage_form" });
    expect(result.signalLevel).toBe("needs_data");
    expect(result.issues).toContain("missing critical conversion data");
    expect(result.missingData).toEqual(expect.arrayContaining(["seller response, motivation, or timeline", "ARV and repair estimate", "property address"]));
  });

  it("detects offer, negotiation, contract, buyer, and closing readiness levels", () => {
    expect(reviewZ4ConversionSignalReadiness({ ...baseLead, offerRecommendation: { recommendedOffer: 90000 } }).signalLevel).toBe("needs_offer_review");
    expect(reviewZ4ConversionSignalReadiness({ ...baseLead, status: "negotiating" }).signalLevel).toBe("needs_negotiation_review");
    expect(reviewZ4ConversionSignalReadiness({ ...baseLead, status: "contract_review_needed" }).signalLevel).toBe("needs_contract_review");
    expect(reviewZ4ConversionSignalReadiness({ ...baseLead, status: "buyer_disposition_needed" }).signalLevel).toBe("needs_buyer_disposition");
    expect(reviewZ4ConversionSignalReadiness({ ...baseLead, status: "closing_coordination_needed" }).signalLevel).toBe("needs_closing_coordination");
  });

  it("detects DNC blocked and terminal states without authorizing conversion", () => {
    const dnc = reviewZ4ConversionSignalReadiness({ ...baseLead, status: "do_not_contact", doNotContact: true });
    const closed = reviewZ4ConversionSignalReadiness({ ...baseLead, status: "closed" });
    expect(dnc.signalLevel).toBe("blocked");
    expect(closed.signalLevel).toBe("terminal");
    expect(dnc.flags.offerSent).toBe(false);
    expect(closed.flags.conversionActionExecuted).toBe(false);
  });
});
