import { reviewZ7BottleneckSignals, type Z7BottleneckCleanupInput } from "./z7-bottleneck-signal-review";
import { z7ManualRevenueBottleneckFlags, type Z7BottleneckCleanupLane } from "./z7-manual-revenue-bottleneck-policy";

export type Z7BottleneckCleanupTier = "stop" | "now" | "today" | "week" | "monitor" | "none";
export type Z7BottleneckCleanupConfidence = "high" | "medium" | "low";

export type Z7BottleneckCleanupResult = {
  cleanupLane: Z7BottleneckCleanupLane;
  cleanupTier: Z7BottleneckCleanupTier;
  advisoryCleanupScore: number;
  reason: string;
  confidence: Z7BottleneckCleanupConfidence;
  triggeredBy: string[];
  missingData: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z7ManualRevenueBottleneckFlags;
  flags: typeof z7ManualRevenueBottleneckFlags;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function makeResult(cleanupLane: Z7BottleneckCleanupLane, cleanupTier: Z7BottleneckCleanupTier, score: number, reason: string, confidence: Z7BottleneckCleanupConfidence, triggeredBy: string[], missingData: string[]): Z7BottleneckCleanupResult {
  return {
    cleanupLane,
    cleanupTier,
    advisoryCleanupScore: clampScore(score),
    reason,
    confidence,
    triggeredBy,
    missingData,
    requiredHumanReview: true,
    blockedExecutionFlags: z7ManualRevenueBottleneckFlags,
    flags: z7ManualRevenueBottleneckFlags,
  };
}

export function classifyZ7BottleneckCleanup(input: Z7BottleneckCleanupInput): Z7BottleneckCleanupResult {
  const signals = reviewZ7BottleneckSignals(input);
  const triggeredBy = [...signals.detectedBottlenecks, ...signals.blockers, ...signals.warnings];
  const missingData = signals.missingData;
  const baseScore = (input.advisoryScore ?? input.score ?? 0) + Math.min(20, (input.estimatedRevenue ?? 0) / 1500);

  if (signals.bottleneckSignalLevel === "governance_stop") {
    return makeResult("governance_stop", "stop", 100, "Governance stop must be resolved before cleanup work.", "high", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "contact_safety_blocker") {
    return makeResult("contact_safety_blocker", "stop", 98, "Contact safety blocker must be reviewed before cleanup work.", "high", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "terminal") {
    return makeResult("monitor_only", "none", 5, "Terminal records do not need active bottleneck cleanup.", "high", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "missing_critical_data") {
    return makeResult("missing_critical_data", "now", 88, "Missing critical data blocks reliable revenue cleanup.", "high", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "closing_bottleneck") {
    return makeResult("closing_bottleneck", "now", baseScore + 22, "Closing bottleneck should be reviewed before lower-value cleanup.", "high", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "buyer_disposition_bottleneck") {
    return makeResult("buyer_disposition_bottleneck", "today", baseScore + 18, "Buyer/disposition bottleneck may block exit-side revenue.", "medium", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "conversion_bottleneck") {
    return makeResult("conversion_bottleneck", "today", baseScore + 15, "Conversion bottleneck is preventing manual revenue progress.", "medium", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "follow_up_bottleneck") {
    return makeResult("follow_up_bottleneck", "today", baseScore + 12, "Follow-up bottleneck may be leaking manual revenue opportunity.", "medium", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "valuation_bottleneck") {
    return makeResult("valuation_bottleneck", "week", baseScore + 8, "Valuation or offer inputs need manual cleanup before conversion review.", "medium", triggeredBy, missingData);
  }
  if (signals.bottleneckSignalLevel === "workflow_stall") {
    return makeResult("workflow_stall", "week", baseScore + 6, "Workflow appears stalled and needs manual inspection.", "medium", triggeredBy, missingData);
  }
  return makeResult("monitor_only", "monitor", baseScore + 3, "No active cleanup bottleneck detected from advisory input.", missingData.length > 0 ? "low" : "medium", triggeredBy, missingData);
}

export function createZ7BottleneckCleanupClassifierReview() {
  return {
    phase: "Z7C" as const,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
