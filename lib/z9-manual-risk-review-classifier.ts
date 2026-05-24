import { reviewZ9RevenueRiskSignals, type Z9RevenueRiskReviewInput } from "./z9-revenue-risk-signal-review";
import { z9ManualRevenueRiskFlags, type Z9RevenueRiskReviewLane } from "./z9-manual-revenue-risk-policy";

export type Z9RevenueRiskTier = "stop" | "now" | "today" | "week" | "monitor" | "none";
export type Z9RevenueRiskConfidence = "high" | "medium" | "low";

export type Z9ManualRiskReviewResult = {
  riskLane: Z9RevenueRiskReviewLane;
  riskTier: Z9RevenueRiskTier;
  advisoryRiskScore: number;
  reason: string;
  confidence: Z9RevenueRiskConfidence;
  triggeredBy: string[];
  missingData: string[];
  complexityNotes: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z9ManualRevenueRiskFlags;
  flags: typeof z9ManualRevenueRiskFlags;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function makeResult(riskLane: Z9RevenueRiskReviewLane, riskTier: Z9RevenueRiskTier, score: number, reason: string, confidence: Z9RevenueRiskConfidence, triggeredBy: string[], missingData: string[], complexityNotes: string[]): Z9ManualRiskReviewResult {
  return {
    riskLane,
    riskTier,
    advisoryRiskScore: clampScore(score),
    reason,
    confidence,
    triggeredBy,
    missingData,
    complexityNotes,
    requiredHumanReview: true,
    blockedExecutionFlags: z9ManualRevenueRiskFlags,
    flags: z9ManualRevenueRiskFlags,
  };
}

export function classifyZ9ManualRiskReview(input: Z9RevenueRiskReviewInput): Z9ManualRiskReviewResult {
  const signals = reviewZ9RevenueRiskSignals(input);
  const triggeredBy = [...signals.riskFactors, ...signals.blockers, ...signals.warnings];
  const baseScore = (input.advisoryRecoveryScore ?? 0) + Math.min(20, (input.estimatedRevenue ?? 0) / 2000);
  const redundantPenalty = Math.min(20, ((input.redundantSignalCount ?? 0) + (input.repeatedMonitorOnlyCount ?? 0)) * 5);
  const confidence: Z9RevenueRiskConfidence = redundantPenalty >= 10 ? "low" : signals.missingData.length > 0 ? "low" : "medium";

  if (signals.riskSignalLevel === "governance_stop") {
    return makeResult("governance_stop", "stop", 100, "Governance stop must be resolved before revenue risk review.", "high", triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "contact_risk_stop") {
    return makeResult("contact_risk_stop", "stop", 98, "Contact risk stop blocks manual revenue risk review from becoming work.", "high", triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "terminal") {
    return makeResult("terminal_no_risk_review", "none", 5, "Terminal records should not enter active revenue risk review.", "high", triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "data_confidence_risk") {
    return makeResult("data_confidence_risk", "now", 88, "Low-confidence or missing data can make revenue review misleading.", "high", triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "near_close_risk") {
    return makeResult("near_close_risk", "now", baseScore + 20 - redundantPenalty, "Near-close revenue risk should be reviewed before lower-impact work.", "high", triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "buyer_disposition_risk") {
    return makeResult("buyer_disposition_risk", "today", baseScore + 16 - redundantPenalty, "Buyer/disposition risk may block exit-side revenue.", confidence, triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "conversion_quality_risk") {
    return makeResult("conversion_quality_risk", "today", baseScore + 14 - redundantPenalty, "Conversion quality risk may make offer, negotiation, or contract review fragile.", confidence, triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "follow_up_leakage_risk") {
    return makeResult("follow_up_leakage_risk", "today", baseScore + 12 - redundantPenalty, "Follow-up leakage risk may create revenue loss or operator confusion.", confidence, triggeredBy, signals.missingData, signals.complexityNotes);
  }
  if (signals.riskSignalLevel === "recovery_complexity_risk") {
    return makeResult("recovery_complexity_risk", "week", baseScore + 8 - redundantPenalty, "Recovery complexity may reduce usability and should be reviewed before further expansion.", "medium", triggeredBy, signals.missingData, signals.complexityNotes);
  }
  return makeResult("monitor_risk", "monitor", baseScore + 2 - redundantPenalty, "Risk signal is not distinct enough to create a new manual work lane.", confidence, triggeredBy, signals.missingData, signals.complexityNotes);
}

export function createZ9ManualRiskReviewClassifierReview() {
  return {
    phase: "Z9C" as const,
    flags: z9ManualRevenueRiskFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
