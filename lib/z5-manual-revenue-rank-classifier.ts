import { reviewZ5RevenuePrioritySignals, type Z5RevenuePriorityInput } from "./z5-revenue-priority-signal-review";
import { z5ManualRevenuePrioritizationFlags, z5RevenuePriorityLaneMetadata, type Z5RevenuePriorityLane } from "./z5-manual-revenue-prioritization-policy";

export type Z5RevenueRankTier = "critical" | "high" | "medium" | "low" | "blocked";
export type Z5RevenueRankConfidence = "high" | "medium" | "low";

export type Z5ManualRevenueRankResult = {
  priorityLane: Z5RevenuePriorityLane;
  rankTier: Z5RevenueRankTier;
  advisoryScore: number;
  reason: string;
  confidence: Z5RevenueRankConfidence;
  triggeredBy: string[];
  missingData: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z5ManualRevenuePrioritizationFlags;
  flags: typeof z5ManualRevenuePrioritizationFlags;
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function valueScore(input: Z5RevenuePriorityInput) {
  const value = input.estimatedRevenue ?? input.estimatedValue ?? 0;
  return Math.min(25, value / 1000);
}

function baseScore(input: Z5RevenuePriorityInput) {
  return (input.score ?? 0) * 0.45 + valueScore(input) + (input.priority === "High" ? 18 : input.priority === "Medium" ? 9 : 0);
}

function tier(score: number, lane: Z5RevenuePriorityLane): Z5RevenueRankTier {
  if (lane === "governance_stop" || lane === "blocked_cleanup") return "blocked";
  if (score >= 85) return "critical";
  if (score >= 65) return "high";
  if (score >= 35) return "medium";
  return "low";
}

function makeResult(priorityLane: Z5RevenuePriorityLane, advisoryScore: number, reason: string, confidence: Z5RevenueRankConfidence, triggeredBy: string[], missingData: string[]): Z5ManualRevenueRankResult {
  const score = clampScore(advisoryScore);
  return {
    priorityLane,
    rankTier: tier(score, priorityLane),
    advisoryScore: score,
    reason,
    confidence,
    triggeredBy,
    missingData,
    requiredHumanReview: true,
    blockedExecutionFlags: z5ManualRevenuePrioritizationFlags,
    flags: z5ManualRevenuePrioritizationFlags,
  };
}

export function classifyZ5ManualRevenueRank(input: Z5RevenuePriorityInput): Z5ManualRevenueRankResult {
  const signals = reviewZ5RevenuePrioritySignals(input);
  const triggerData = [...signals.readySignals, ...signals.blockers, ...signals.warnings];
  const missingData = signals.missingData;
  const score = baseScore(input);

  if (signals.signalLevel === "governance_stop") {
    return makeResult("governance_stop", 100, "Governance stop outranks all revenue priority.", "high", triggerData, missingData);
  }
  if (signals.signalLevel === "blocked") {
    return makeResult("blocked_cleanup", 88, "Blocked, DNC, rejected, or suppressed records need cleanup before revenue work.", "high", triggerData, missingData);
  }
  if (signals.signalLevel === "terminal") {
    return makeResult("low_priority", 5, "Terminal leads should not consume active revenue priority.", "high", triggerData, missingData);
  }
  if (signals.signalLevel === "near_close") {
    return makeResult("near_close_revenue", score + 45, "Near-close or under-contract revenue should be reviewed before earlier-stage opportunities.", "high", triggerData, missingData);
  }
  if (signals.signalLevel === "buyer_disposition") {
    return makeResult("buyer_disposition_priority", score + 36, "Buyer/disposition signals can unblock revenue exit paths.", "high", triggerData, missingData);
  }
  if (signals.signalLevel === "near_conversion") {
    return makeResult("near_conversion", score + 30, "Conversion-ready lead deserves manual offer, negotiation, or contract review.", "medium", triggerData, missingData);
  }
  if (signals.signalLevel === "high_value" && signals.readySignals.includes("stale or overdue follow-up")) {
    return makeResult("work_first", score + 28, "High-value stale follow-up should be reviewed first by a human.", "medium", triggerData, missingData);
  }
  if (signals.signalLevel === "high_value") {
    return makeResult("work_first", score + 20, "High-value opportunity deserves early manual review.", "medium", triggerData, missingData);
  }
  if (signals.signalLevel === "stale_follow_up") {
    return makeResult("follow_up_priority", score + 22, "Stale or overdue follow-up can leak revenue.", "medium", triggerData, missingData);
  }
  if (signals.signalLevel === "needs_data") {
    return makeResult("data_quality_priority", 42, "Missing data blocks reliable revenue priority.", "low", triggerData, missingData);
  }
  if (signals.signalLevel === "low_priority") {
    return makeResult("low_priority", score, "Low score or low priority should not outrank stronger revenue signals.", "medium", triggerData, missingData);
  }
  return makeResult("nurture_monitor", score + 8, "Lead should remain visible for manual nurture or monitoring.", "medium", triggerData, missingData);
}

export function createZ5ManualRevenueRankClassifierReview() {
  return {
    phase: "Z5C" as const,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
    laneMetadata: z5RevenuePriorityLaneMetadata,
  };
}
