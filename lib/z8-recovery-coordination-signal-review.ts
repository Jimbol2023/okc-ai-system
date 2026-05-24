import { z8ManualRevenueRecoveryFlags } from "./z8-manual-revenue-recovery-policy";

export type Z8RecoverySignalLevel =
  | "governance_stop"
  | "blocked_recovery"
  | "terminal"
  | "data_recovery_needed"
  | "closing_recovery"
  | "buyer_disposition_recovery"
  | "conversion_recovery"
  | "follow_up_recovery"
  | "multi_bottleneck_recovery"
  | "stalled_monitor_recovery"
  | "monitor_recovery";

export type Z8RecoveryCoordinationInput = {
  id?: string;
  label?: string;
  cleanupLane?: string | null;
  cleanupSummaryState?: string | null;
  advisoryCleanupScore?: number | null;
  detectedBottlenecks?: string[];
  blockers?: string[];
  warnings?: string[];
  missingData?: string[];
  dependencyChecks?: string[];
  followUpRecoverySignal?: boolean | null;
  conversionRecoverySignal?: boolean | null;
  buyerDispositionRecoverySignal?: boolean | null;
  closingRecoverySignal?: boolean | null;
  estimatedRevenue?: number | null;
  daysStalled?: number | null;
  governanceStop?: boolean | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  terminal?: boolean | null;
  status?: string | null;
  now?: string | Date;
};

export type Z8RecoveryCoordinationSignalReviewResult = {
  recoverySignalLevel: Z8RecoverySignalLevel;
  recoveryOpportunities: string[];
  blockers: string[];
  warnings: string[];
  missingData: string[];
  dependencyChecks: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z8ManualRevenueRecoveryFlags;
};

function hasBottleneck(input: Z8RecoveryCoordinationInput, pattern: string) {
  return (input.detectedBottlenecks ?? []).some((bottleneck) => bottleneck.toLowerCase().includes(pattern));
}

export function reviewZ8RecoveryCoordinationSignals(input: Z8RecoveryCoordinationInput): Z8RecoveryCoordinationSignalReviewResult {
  const recoveryOpportunities: string[] = [];
  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];
  const missingData = [...(input.missingData ?? [])];
  const dependencyChecks = [...(input.dependencyChecks ?? [])];
  const status = (input.status ?? "").toLowerCase();

  if (input.governanceStop || input.cleanupLane === "governance_stop") blockers.push("governance stop");
  if (input.doNotContact || input.blocked || input.cleanupLane === "contact_safety_blocker") blockers.push("DNC/blocked recovery suppression");
  if (input.terminal || status === "closed" || status === "dead" || input.cleanupSummaryState === "no_cleanup_terminal") recoveryOpportunities.push("terminal/no-recovery");
  if (missingData.length > 0 || input.cleanupLane === "missing_critical_data" || input.cleanupSummaryState === "recovery_dependency_cleanup") {
    recoveryOpportunities.push("data recovery needed");
    dependencyChecks.push("missing recovery dependencies");
  }
  if (input.closingRecoverySignal || input.cleanupLane === "closing_bottleneck" || hasBottleneck(input, "closing")) recoveryOpportunities.push("closing recovery");
  if (input.buyerDispositionRecoverySignal || input.cleanupLane === "buyer_disposition_bottleneck" || hasBottleneck(input, "buyer")) recoveryOpportunities.push("buyer/disposition recovery");
  if (input.conversionRecoverySignal || input.cleanupLane === "conversion_bottleneck" || hasBottleneck(input, "conversion") || hasBottleneck(input, "valuation")) recoveryOpportunities.push("conversion recovery");
  if (input.followUpRecoverySignal || input.cleanupLane === "follow_up_bottleneck" || hasBottleneck(input, "follow")) recoveryOpportunities.push("follow-up recovery");
  if ((input.detectedBottlenecks ?? []).length >= 2) recoveryOpportunities.push("multi-bottleneck recovery");
  if ((input.daysStalled ?? 0) >= 10 || input.cleanupLane === "workflow_stall") recoveryOpportunities.push("stalled recovery");
  if (!input.cleanupLane && !input.cleanupSummaryState && (input.advisoryCleanupScore ?? null) === null && (input.detectedBottlenecks ?? []).length === 0) missingData.push("Z7 cleanup lane, summary state, bottlenecks, or advisory cleanup score");

  const uniqueBlockers = [...new Set(blockers)];
  const uniqueOpportunities = [...new Set(recoveryOpportunities)];
  const uniqueMissingData = [...new Set(missingData)];
  const uniqueDependencyChecks = [...new Set(dependencyChecks)];

  const recoverySignalLevel: Z8RecoverySignalLevel = uniqueBlockers.includes("governance stop")
    ? "governance_stop"
    : uniqueBlockers.length > 0
      ? "blocked_recovery"
      : uniqueOpportunities.includes("terminal/no-recovery")
        ? "terminal"
        : uniqueOpportunities.includes("data recovery needed") || uniqueMissingData.length > 0
          ? "data_recovery_needed"
          : uniqueOpportunities.includes("closing recovery")
            ? "closing_recovery"
            : uniqueOpportunities.includes("buyer/disposition recovery")
              ? "buyer_disposition_recovery"
              : uniqueOpportunities.includes("conversion recovery")
                ? "conversion_recovery"
                : uniqueOpportunities.includes("follow-up recovery")
                  ? "follow_up_recovery"
                  : uniqueOpportunities.includes("multi-bottleneck recovery")
                    ? "multi_bottleneck_recovery"
                    : uniqueOpportunities.includes("stalled recovery")
                      ? "stalled_monitor_recovery"
                      : "monitor_recovery";

  return {
    recoverySignalLevel,
    recoveryOpportunities: uniqueOpportunities,
    blockers: uniqueBlockers,
    warnings,
    missingData: uniqueMissingData,
    dependencyChecks: uniqueDependencyChecks,
    manualReviewRecommendation: recoverySignalLevel === "governance_stop" || recoverySignalLevel === "blocked_recovery" ? "Resolve stop signals before recovery coordination review." : "Use recovery coordination as manual advisory guidance only.",
    safeExplanation: "Z8 recovery coordination signals do not create recovery plans, assign steps, persist sequences, update dependencies, create handoffs, contact sellers, contact buyers, contact closing parties, write storage, write audits, mutate CRM records, or execute recovery coordination.",
    flags: z8ManualRevenueRecoveryFlags,
  };
}

export function createZ8RecoveryCoordinationSignalReview() {
  return {
    phase: "Z8B" as const,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["governance stop", "DNC/blocked recovery suppression", "terminal/no-recovery", "data recovery needed", "follow-up recovery", "conversion recovery", "buyer/disposition recovery", "closing recovery", "multi-bottleneck recovery", "stalled recovery", "monitor recovery"],
  };
}
