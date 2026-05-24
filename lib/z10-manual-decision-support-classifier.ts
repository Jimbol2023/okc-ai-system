import { reviewZ10DecisionSupportSignals, type Z10RevenueDecisionSupportInput } from "./z10-decision-support-signal-review";
import { z10ManualRevenueDecisionFlags, type Z10RevenueDecisionLane } from "./z10-manual-revenue-decision-policy";

export type Z10RevenueDecisionTier = "stop" | "now" | "today" | "monitor" | "defer" | "none";
export type Z10RevenueDecisionConfidence = "high" | "medium" | "low";

export type Z10ManualDecisionSupportResult = {
  decisionLane: Z10RevenueDecisionLane;
  decisionTier: Z10RevenueDecisionTier;
  advisoryDecisionScore: number;
  reason: string;
  confidence: Z10RevenueDecisionConfidence;
  triggeredBy: string[];
  missingData: string[];
  usabilityNotes: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z10ManualRevenueDecisionFlags;
  flags: typeof z10ManualRevenueDecisionFlags;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function makeResult(decisionLane: Z10RevenueDecisionLane, decisionTier: Z10RevenueDecisionTier, score: number, reason: string, confidence: Z10RevenueDecisionConfidence, triggeredBy: string[], missingData: string[], usabilityNotes: string[]): Z10ManualDecisionSupportResult {
  return {
    decisionLane,
    decisionTier,
    advisoryDecisionScore: clampScore(score),
    reason,
    confidence,
    triggeredBy,
    missingData,
    usabilityNotes,
    requiredHumanReview: true,
    blockedExecutionFlags: z10ManualRevenueDecisionFlags,
    flags: z10ManualRevenueDecisionFlags,
  };
}

export function classifyZ10ManualDecisionSupport(input: Z10RevenueDecisionSupportInput): Z10ManualDecisionSupportResult {
  const signals = reviewZ10DecisionSupportSignals(input);
  const triggeredBy = [...signals.decisionFactors, ...signals.blockers, ...signals.warnings];
  const baseScore = Math.max(input.advisoryScore ?? 0, input.advisoryRiskScore ?? 0, input.advisoryRecoveryScore ?? 0) + Math.min(20, (input.estimatedRevenue ?? 0) / 2000);
  const cognitivePenalty = Math.min(25, ((input.redundantSignalCount ?? 0) + (input.repeatedMonitorOnlyCount ?? 0) + signals.usabilityNotes.length) * 5);
  const confidence: Z10RevenueDecisionConfidence = signals.missingData.length > 0 || cognitivePenalty >= 15 ? "low" : "medium";

  if (signals.decisionSignalLevel === "stop_do_not_work") {
    return makeResult("stop_do_not_work", "stop", 100, "Stop signals block manual revenue decision support.", "high", triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "terminal_no_decision") {
    return makeResult("terminal_no_decision", "none", 5, "Terminal records should not enter active decision support.", "high", triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "cleanup_before_decision") {
    return makeResult("cleanup_before_decision", "now", 88, "Cleanup is needed before this decision can be trusted.", "high", triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "review_risk_first") {
    return makeResult("review_risk_first", "now", baseScore + 16 - cognitivePenalty, "Risk posture should be reviewed before revenue work.", confidence, triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "review_revenue_now") {
    return makeResult("review_revenue_now", "now", baseScore + 20 - cognitivePenalty, "High-value or high-urgency revenue should be reviewed first.", confidence, triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "review_revenue_today") {
    return makeResult("review_revenue_today", "today", baseScore + 12 - cognitivePenalty, "This belongs in today's manual revenue review.", confidence, triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "consolidate_instead_of_expand") {
    return makeResult("consolidate_instead_of_expand", "monitor", Math.max(20, baseScore - cognitivePenalty), "Signals are too redundant or cognitively heavy; consolidate instead of expanding advisory layers.", "low", triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  if (signals.decisionSignalLevel === "defer_low_value") {
    return makeResult("defer_low_value", "defer", baseScore - cognitivePenalty, "Low-value or low-clarity record should defer behind stronger opportunities.", confidence, triggeredBy, signals.missingData, signals.usabilityNotes);
  }
  return makeResult("monitor_only", "monitor", baseScore + 2 - cognitivePenalty, "Monitor only; no active manual decision lane is justified.", confidence, triggeredBy, signals.missingData, signals.usabilityNotes);
}

export function createZ10ManualDecisionSupportClassifierReview() {
  return {
    phase: "Z10C" as const,
    flags: z10ManualRevenueDecisionFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
