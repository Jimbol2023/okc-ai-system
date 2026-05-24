import { classifyZ8ManualRecoveryCoordination } from "./z8-manual-recovery-coordination-classifier";
import { reviewZ8RecoveryCoordinationSignals, type Z8RecoveryCoordinationInput } from "./z8-recovery-coordination-signal-review";
import { z8ManualRevenueRecoveryFlags } from "./z8-manual-revenue-recovery-policy";

export type Z8RecoveryCoordinationSummaryState =
  | "stop_before_recovery"
  | "recovery_dependency_cleanup"
  | "recover_now"
  | "recover_today"
  | "recover_this_week"
  | "monitor_recovery"
  | "no_recovery_terminal"
  | "not_ready";

export type Z8RecoveryCoordinationSummary = {
  summaryState: Z8RecoveryCoordinationSummaryState;
  recoveryPathClarity: string;
  safetyPosture: string;
  dependencyReadiness: string;
  followUpRecoveryPressure: string;
  conversionRecoveryPressure: string;
  buyerClosingRecoveryPressure: string;
  multiBottleneckBurden: string;
  operatorRecommendation: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ8RecoveryCoordinationSignals>;
  recovery: ReturnType<typeof classifyZ8ManualRecoveryCoordination>;
  flags: typeof z8ManualRevenueRecoveryFlags;
  advisoryOnly: true;
};

function getSummaryState(signals: ReturnType<typeof reviewZ8RecoveryCoordinationSignals>, recovery: ReturnType<typeof classifyZ8ManualRecoveryCoordination>): Z8RecoveryCoordinationSummaryState {
  if (signals.missingData.includes("Z7 cleanup lane, summary state, bottlenecks, or advisory cleanup score")) return "not_ready";
  if (recovery.recoveryTier === "stop") return "stop_before_recovery";
  if (signals.recoverySignalLevel === "terminal") return "no_recovery_terminal";
  if (recovery.recoveryLane === "data_recovery_needed") return "recovery_dependency_cleanup";
  if (recovery.recoveryTier === "now") return "recover_now";
  if (recovery.recoveryTier === "today") return "recover_today";
  if (recovery.recoveryTier === "week") return "recover_this_week";
  return "monitor_recovery";
}

export function createZ8RecoveryCoordinationSummary(input: Z8RecoveryCoordinationInput): Z8RecoveryCoordinationSummary {
  const signals = reviewZ8RecoveryCoordinationSignals(input);
  const recovery = classifyZ8ManualRecoveryCoordination(input);
  const summaryState = getSummaryState(signals, recovery);

  return {
    summaryState,
    recoveryPathClarity: signals.recoveryOpportunities.length > 0 ? `Recovery opportunities: ${signals.recoveryOpportunities.join(", ")}.` : "No active recovery path detected from advisory input.",
    safetyPosture: signals.blockers.length > 0 ? `Stop signals present: ${signals.blockers.join(", ")}.` : "No recovery stop signal detected from advisory input.",
    dependencyReadiness: signals.dependencyChecks.length > 0 ? `Dependency checks: ${signals.dependencyChecks.join(", ")}.` : "No dependency cleanup detected.",
    followUpRecoveryPressure: signals.recoveryOpportunities.includes("follow-up recovery") ? "Follow-up recovery pressure is visible." : "No follow-up recovery pressure detected.",
    conversionRecoveryPressure: signals.recoveryOpportunities.includes("conversion recovery") ? "Conversion recovery pressure is visible." : "No conversion recovery pressure detected.",
    buyerClosingRecoveryPressure: signals.recoveryOpportunities.some((signal) => signal.includes("buyer") || signal.includes("closing")) ? "Buyer or closing recovery pressure is visible." : "No buyer or closing recovery pressure detected.",
    multiBottleneckBurden: signals.recoveryOpportunities.includes("multi-bottleneck recovery") ? "Multiple recovery bottlenecks need coordinated review." : "No multi-bottleneck recovery burden detected.",
    operatorRecommendation: summaryState === "stop_before_recovery" ? "Resolve stop signals before recovery coordination." : "Use this as advisory human recovery coordination only.",
    safeNextManualReview: recovery.reason,
    signals,
    recovery,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
  };
}

export function createZ8RecoveryCoordinationList(inputs: Z8RecoveryCoordinationInput[]) {
  const summaries = inputs.map((input, index) => ({
    inputIndex: index,
    inputId: input.id ?? "",
    inputLabel: input.label ?? "",
    summary: createZ8RecoveryCoordinationSummary(input),
  }));
  const ranked = [...summaries].sort((a, b) =>
    b.summary.recovery.advisoryRecoveryScore - a.summary.recovery.advisoryRecoveryScore ||
    a.summary.recovery.recoveryLane.localeCompare(b.summary.recovery.recoveryLane) ||
    a.inputId.localeCompare(b.inputId) ||
    a.inputLabel.localeCompare(b.inputLabel) ||
    a.inputIndex - b.inputIndex,
  );

  return {
    phase: "Z8D" as const,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
    ranked,
    countsBySummaryState: ranked.reduce<Record<Z8RecoveryCoordinationSummaryState, number>>((counts, item) => {
      counts[item.summary.summaryState] += 1;
      return counts;
    }, {
      stop_before_recovery: 0,
      recovery_dependency_cleanup: 0,
      recover_now: 0,
      recover_today: 0,
      recover_this_week: 0,
      monitor_recovery: 0,
      no_recovery_terminal: 0,
      not_ready: 0,
    }),
  };
}

export function createZ8RecoveryCoordinationSummaryReview() {
  return {
    phase: "Z8D" as const,
    flags: z8ManualRevenueRecoveryFlags,
    advisoryOnly: true,
    deterministic: true,
    summaryStates: ["stop_before_recovery", "recovery_dependency_cleanup", "recover_now", "recover_today", "recover_this_week", "monitor_recovery", "no_recovery_terminal", "not_ready"] as const,
  };
}
