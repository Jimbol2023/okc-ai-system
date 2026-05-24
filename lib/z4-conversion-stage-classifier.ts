import { reviewZ4ConversionSignalReadiness, type Z4ConversionLeadInput } from "./z4-conversion-signal-readiness";
import { z4ManualConversionFlags, z4ManualConversionStageMetadata, type Z4ManualConversionStage } from "./z4-manual-conversion-policy";

export type Z4ConversionStageConfidence = "high" | "medium" | "low";

export type Z4ManualConversionStageResult = {
  stage: Z4ManualConversionStage;
  stageLabel: string;
  reason: string;
  confidence: Z4ConversionStageConfidence;
  requiredHumanReview: true;
  triggeredBy: string[];
  missingData: string[];
  blockedExecutionFlags: typeof z4ManualConversionFlags;
  flags: typeof z4ManualConversionFlags;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function result(stage: Z4ManualConversionStage, reason: string, confidence: Z4ConversionStageConfidence, triggeredBy: string[], missingData: string[]): Z4ManualConversionStageResult {
  return {
    stage,
    stageLabel: z4ManualConversionStageMetadata[stage].label,
    reason,
    confidence,
    requiredHumanReview: true,
    triggeredBy,
    missingData,
    blockedExecutionFlags: z4ManualConversionFlags,
    flags: z4ManualConversionFlags,
  };
}

export function classifyZ4ManualConversionStage(input: Z4ConversionLeadInput): Z4ManualConversionStageResult {
  const signals = reviewZ4ConversionSignalReadiness(input);
  const status = signals.status;
  const missingData = signals.missingData;

  if (signals.signalLevel === "blocked" || signals.signalLevel === "terminal") {
    return result("terminal_or_suppressed", "Lead is terminal, DNC, blocked, rejected, or suppressed; no conversion movement is recommended.", "high", signals.issues, missingData);
  }

  if (status === "closing_coordination_needed" || signals.signalLevel === "needs_closing_coordination") {
    return result("closing_coordination_review", "Closing coordination signals are present and require human review.", "high", signals.readySignals, missingData);
  }

  if (status === "under_contract" || status === "buyer_disposition_needed" || signals.signalLevel === "needs_buyer_disposition") {
    return result("buyer_disposition_review", "Under-contract or buyer/disposition signals are present and require manual disposition review.", "high", signals.readySignals, missingData);
  }

  if (status === "contract_review_needed" || signals.signalLevel === "needs_contract_review") {
    return result("contract_review", "Contract readiness signals are present, but no contract execution is authorized.", "high", signals.readySignals, missingData);
  }

  if (status === "negotiating" || signals.signalLevel === "needs_negotiation_review") {
    return result("negotiation_review", "Negotiation signals are present and require manual review.", "medium", signals.readySignals, missingData);
  }

  if (status === "offer_review_needed" || status === "offer_made" || signals.signalLevel === "needs_offer_review") {
    return result("offer_review", "Offer or valuation-ready seller context is present and requires manual offer review.", "medium", signals.readySignals, missingData);
  }

  if (status === "follow_up_needed" || hasText(input.followUpReadinessLevel) || hasText(input.followUpPriorityLevel)) {
    return result("follow_up_review", "Follow-up context exists but conversion readiness is not yet clear.", "medium", signals.readySignals.length > 0 ? signals.readySignals : ["follow-up context"], missingData);
  }

  return result("lead_context_review", "Lead needs manual context review before conversion stage can be trusted.", missingData.length > 0 ? "low" : "medium", signals.readySignals, missingData);
}

export function createZ4ConversionStageClassifierReview() {
  return {
    phase: "Z4C" as const,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
