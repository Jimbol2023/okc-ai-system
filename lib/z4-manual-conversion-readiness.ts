import { classifyZ4ManualConversionStage } from "./z4-conversion-stage-classifier";
import { reviewZ4ConversionSignalReadiness, type Z4ConversionLeadInput } from "./z4-conversion-signal-readiness";
import { z4ManualConversionFlags } from "./z4-manual-conversion-policy";

export type Z4ManualConversionReadinessLevel =
  | "ready_for_manual_conversion_review"
  | "needs_conversion_data_cleanup"
  | "needs_offer_review"
  | "needs_negotiation_review"
  | "needs_contract_review"
  | "needs_buyer_disposition_review"
  | "needs_closing_coordination_review"
  | "blocked_or_suppressed"
  | "terminal_no_conversion"
  | "not_ready";

export type Z4ManualConversionReadinessResult = {
  readinessLevel: Z4ManualConversionReadinessLevel;
  conversionStageClarity: string;
  sellerContext: string;
  valuationOfferClarity: string;
  negotiationClarity: string;
  contractSafety: string;
  buyerDispositionReadiness: string;
  closingReadiness: string;
  manualOperatorReadiness: string;
  revenueConversionUsefulness: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ4ConversionSignalReadiness>;
  stage: ReturnType<typeof classifyZ4ManualConversionStage>;
  flags: typeof z4ManualConversionFlags;
  advisoryOnly: true;
};

function hasSignal(signals: string[], pattern: string) {
  return signals.some((signal) => signal.toLowerCase().includes(pattern));
}

function getReadinessLevel(signals: ReturnType<typeof reviewZ4ConversionSignalReadiness>, stage: ReturnType<typeof classifyZ4ManualConversionStage>): Z4ManualConversionReadinessLevel {
  if (signals.signalLevel === "blocked") return "blocked_or_suppressed";
  if (signals.signalLevel === "terminal") return "terminal_no_conversion";
  if (!signals.status) return "not_ready";
  if (stage.stage === "closing_coordination_review") return "needs_closing_coordination_review";
  if (stage.stage === "buyer_disposition_review") return "needs_buyer_disposition_review";
  if (stage.stage === "contract_review") return "needs_contract_review";
  if (stage.stage === "negotiation_review") return "needs_negotiation_review";
  if (stage.stage === "offer_review") return "needs_offer_review";
  if (signals.issues.includes("missing critical conversion data")) return "needs_conversion_data_cleanup";
  return "ready_for_manual_conversion_review";
}

export function createZ4ManualConversionReadiness(input: Z4ConversionLeadInput): Z4ManualConversionReadinessResult {
  const signals = reviewZ4ConversionSignalReadiness(input);
  const stage = classifyZ4ManualConversionStage(input);
  const readinessLevel = getReadinessLevel(signals, stage);

  return {
    readinessLevel,
    conversionStageClarity: `Manual conversion stage is ${stage.stage}.`,
    sellerContext: hasSignal(signals.readySignals, "seller") ? "Seller context is ready for manual review." : "Seller context needs cleanup.",
    valuationOfferClarity: hasSignal(signals.readySignals, "valuation") || hasSignal(signals.readySignals, "offer") ? "Valuation or offer signal is visible." : "Valuation and offer signals need review.",
    negotiationClarity: hasSignal(signals.readySignals, "negotiation") ? "Negotiation signal is visible." : "Negotiation signal is not yet clear.",
    contractSafety: hasSignal(signals.readySignals, "contract") ? "Contract review signal exists, but execution remains blocked." : "No contract review signal is ready.",
    buyerDispositionReadiness: hasSignal(signals.readySignals, "buyer") ? "Buyer/disposition review signal is visible." : "Buyer/disposition readiness is not yet clear.",
    closingReadiness: hasSignal(signals.readySignals, "closing") ? "Closing coordination signal is visible." : "Closing coordination readiness is not yet clear.",
    manualOperatorReadiness: readinessLevel === "ready_for_manual_conversion_review" ? "Operator has enough context for manual conversion review." : "Operator should resolve advisory conversion blockers before advancing.",
    revenueConversionUsefulness: "Z4 conversion readiness is manual-first, advisory-only, and useful for choosing the next human revenue review.",
    safeNextManualReview: stage.reason,
    signals,
    stage,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
  };
}

export function createZ4ManualConversionReadinessList(inputs: Z4ConversionLeadInput[]) {
  const leads = inputs.map(createZ4ManualConversionReadiness);
  return {
    phase: "Z4D" as const,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
    leads,
    countsByReadinessLevel: leads.reduce<Record<Z4ManualConversionReadinessLevel, number>>((counts, lead) => {
      counts[lead.readinessLevel] += 1;
      return counts;
    }, {
      ready_for_manual_conversion_review: 0,
      needs_conversion_data_cleanup: 0,
      needs_offer_review: 0,
      needs_negotiation_review: 0,
      needs_contract_review: 0,
      needs_buyer_disposition_review: 0,
      needs_closing_coordination_review: 0,
      blocked_or_suppressed: 0,
      terminal_no_conversion: 0,
      not_ready: 0,
    }),
  };
}

export function createZ4ManualConversionReadinessReview() {
  return {
    phase: "Z4D" as const,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
    deterministic: true,
    readinessLevels: ["ready_for_manual_conversion_review", "needs_conversion_data_cleanup", "needs_offer_review", "needs_negotiation_review", "needs_contract_review", "needs_buyer_disposition_review", "needs_closing_coordination_review", "blocked_or_suppressed", "terminal_no_conversion", "not_ready"] as const,
  };
}
