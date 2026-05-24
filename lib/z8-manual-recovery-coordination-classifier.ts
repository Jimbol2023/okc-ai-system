import { reviewZ8RecoveryCoordinationSignals, type Z8RecoveryCoordinationInput } from "./z8-recovery-coordination-signal-review";
import { z8ManualRevenueRecoveryFlags, type Z8RecoveryCoordinationLane } from "./z8-manual-revenue-recovery-policy";

export type Z8RecoveryCoordinationTier = "stop" | "now" | "today" | "week" | "monitor" | "none";
export type Z8RecoveryCoordinationConfidence = "high" | "medium" | "low";

export type Z8ManualRecoveryCoordinationResult = {
  recoveryLane: Z8RecoveryCoordinationLane;
  recoveryTier: Z8RecoveryCoordinationTier;
  advisoryRecoveryScore: number;
  reason: string;
  confidence: Z8RecoveryCoordinationConfidence;
  triggeredBy: string[];
  missingData: string[];
  dependencyChecks: string[];
  requiredHumanReview: true;
  blockedExecutionFlags: typeof z8ManualRevenueRecoveryFlags;
  flags: typeof z8ManualRevenueRecoveryFlags;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function makeResult(recoveryLane: Z8RecoveryCoordinationLane, recoveryTier: Z8RecoveryCoordinationTier, score: number, reason: string, confidence: Z8RecoveryCoordinationConfidence, triggeredBy: string[], missingData: string[], dependencyChecks: string[]): Z8ManualRecoveryCoordinationResult {
  return {
    recoveryLane,
    recoveryTier,
    advisoryRecoveryScore: clampScore(score),
    reason,
    confidence,
    triggeredBy,
    missingData,
    dependencyChecks,
    requiredHumanReview: true,
    blockedExecutionFlags: z8ManualRevenueRecoveryFlags,
    flags: z8ManualRevenueRecoveryFlags,
  };
}

export function classifyZ8ManualRecoveryCoordination(input: Z8RecoveryCoordinationInput): Z8ManualRecoveryCoordinationResult {
  const signals = reviewZ8RecoveryCoordinationSignals(input);
  const triggeredBy = [...signals.recoveryOpportunities, ...signals.blockers, ...signals.warnings];
  const baseScore = (input.advisoryCleanupScore ?? 0) + Math.min(20, (input.estimatedRevenue ?? 0) / 1500);

  if (signals.recoverySignalLevel === "governance_stop") {
    return makeResult("governance_stop", "stop", 100, "Governance stop must be resolved before recovery coordination.", "high", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "blocked_recovery") {
    return makeResult("blocked_recovery", "stop", 98, "Blocked or DNC recovery signal suppresses recovery coordination.", "high", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "terminal") {
    return makeResult("no_recovery_terminal", "none", 5, "Terminal records should not enter active recovery coordination.", "high", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "data_recovery_needed") {
    return makeResult("data_recovery_needed", "now", 88, "Recovery dependencies or critical data need manual review first.", "high", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "closing_recovery") {
    return makeResult("closing_recovery", "now", baseScore + 22, "Closing recovery pressure should be coordinated before lower-value paths.", "high", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "buyer_disposition_recovery") {
    return makeResult("buyer_disposition_recovery", "today", baseScore + 18, "Buyer/disposition recovery may unblock exit-side revenue.", "medium", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "conversion_recovery") {
    return makeResult("conversion_recovery", "today", baseScore + 15, "Conversion recovery may restore offer, negotiation, or contract progress.", "medium", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "follow_up_recovery") {
    return makeResult("follow_up_recovery", "today", baseScore + 12, "Follow-up recovery may reduce stale lead leakage.", "medium", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "multi_bottleneck_recovery") {
    return makeResult("multi_bottleneck_recovery", "week", baseScore + 10, "Multiple bottlenecks need coordinated manual recovery review.", "medium", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  if (signals.recoverySignalLevel === "stalled_monitor_recovery") {
    return makeResult("monitor_recovery", "monitor", baseScore + 6, "Stalled recovery should stay visible for manual monitoring.", "medium", triggeredBy, signals.missingData, signals.dependencyChecks);
  }
  return makeResult("monitor_recovery", "monitor", baseScore + 3, "No active recovery coordination path detected from advisory input.", signals.missingData.length > 0 ? "low" : "medium", triggeredBy, signals.missingData, signals.dependencyChecks);
}

export function createZ8ManualRecoveryCoordinationClassifierReview() {
  return {
    phase: "Z8C" as const,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
    deterministic: true,
    requiredHumanReview: true,
  };
}
