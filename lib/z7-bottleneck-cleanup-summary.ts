import { classifyZ7BottleneckCleanup } from "./z7-bottleneck-cleanup-classifier";
import { reviewZ7BottleneckSignals, type Z7BottleneckCleanupInput } from "./z7-bottleneck-signal-review";
import { z7ManualRevenueBottleneckFlags } from "./z7-manual-revenue-bottleneck-policy";

export type Z7BottleneckCleanupSummaryState =
  | "stop_before_cleanup"
  | "cleanup_now"
  | "cleanup_today"
  | "cleanup_this_week"
  | "monitor_only"
  | "no_cleanup_terminal"
  | "not_ready";

export type Z7BottleneckCleanupSummary = {
  summaryState: Z7BottleneckCleanupSummaryState;
  bottleneckClarity: string;
  safetyPosture: string;
  cleanupLane: string;
  dataCleanupNeed: string;
  conversionImpact: string;
  followUpImpact: string;
  buyerClosingImpact: string;
  operatorRecommendation: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ7BottleneckSignals>;
  cleanup: ReturnType<typeof classifyZ7BottleneckCleanup>;
  flags: typeof z7ManualRevenueBottleneckFlags;
  advisoryOnly: true;
};

function getSummaryState(signals: ReturnType<typeof reviewZ7BottleneckSignals>, cleanup: ReturnType<typeof classifyZ7BottleneckCleanup>): Z7BottleneckCleanupSummaryState {
  if (signals.missingData.includes("Z5/Z6 priority, workday, readiness, or advisory score")) return "not_ready";
  if (cleanup.cleanupTier === "stop") return "stop_before_cleanup";
  if (signals.bottleneckSignalLevel === "terminal") return "no_cleanup_terminal";
  if (cleanup.cleanupTier === "now") return "cleanup_now";
  if (cleanup.cleanupTier === "today") return "cleanup_today";
  if (cleanup.cleanupTier === "week") return "cleanup_this_week";
  return "monitor_only";
}

export function createZ7BottleneckCleanupSummary(input: Z7BottleneckCleanupInput): Z7BottleneckCleanupSummary {
  const signals = reviewZ7BottleneckSignals(input);
  const cleanup = classifyZ7BottleneckCleanup(input);
  const summaryState = getSummaryState(signals, cleanup);

  return {
    summaryState,
    bottleneckClarity: signals.detectedBottlenecks.length > 0 ? `Detected bottlenecks: ${signals.detectedBottlenecks.join(", ")}.` : "No active bottleneck detected from advisory input.",
    safetyPosture: signals.blockers.length > 0 ? `Stop signals present: ${signals.blockers.join(", ")}.` : "No cleanup stop signal detected from advisory input.",
    cleanupLane: cleanup.cleanupLane,
    dataCleanupNeed: signals.missingData.length > 0 ? `Missing data: ${signals.missingData.join(", ")}.` : "No missing cleanup data detected.",
    conversionImpact: signals.detectedBottlenecks.some((signal) => signal.includes("conversion") || signal.includes("valuation")) ? "Conversion progress may be blocked." : "No conversion cleanup pressure detected.",
    followUpImpact: signals.detectedBottlenecks.includes("follow-up bottleneck") ? "Follow-up progress may be blocked." : "No follow-up cleanup pressure detected.",
    buyerClosingImpact: signals.detectedBottlenecks.some((signal) => signal.includes("buyer") || signal.includes("closing")) ? "Buyer or closing progress may be blocked." : "No buyer or closing cleanup pressure detected.",
    operatorRecommendation: summaryState === "stop_before_cleanup" ? "Resolve stop signals before manual cleanup." : "Use this as advisory human bottleneck cleanup only.",
    safeNextManualReview: cleanup.reason,
    signals,
    cleanup,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
  };
}

export function createZ7BottleneckCleanupList(inputs: Z7BottleneckCleanupInput[]) {
  const summaries = inputs.map((input, index) => ({
    inputIndex: index,
    inputId: input.id ?? "",
    inputLabel: input.label ?? "",
    summary: createZ7BottleneckCleanupSummary(input),
  }));
  const ranked = [...summaries].sort((a, b) =>
    b.summary.cleanup.advisoryCleanupScore - a.summary.cleanup.advisoryCleanupScore ||
    a.summary.cleanupLane.localeCompare(b.summary.cleanupLane) ||
    a.inputId.localeCompare(b.inputId) ||
    a.inputLabel.localeCompare(b.inputLabel) ||
    a.inputIndex - b.inputIndex,
  );

  return {
    phase: "Z7D" as const,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
    ranked,
    countsBySummaryState: ranked.reduce<Record<Z7BottleneckCleanupSummaryState, number>>((counts, item) => {
      counts[item.summary.summaryState] += 1;
      return counts;
    }, {
      stop_before_cleanup: 0,
      cleanup_now: 0,
      cleanup_today: 0,
      cleanup_this_week: 0,
      monitor_only: 0,
      no_cleanup_terminal: 0,
      not_ready: 0,
    }),
  };
}

export function createZ7BottleneckCleanupSummaryReview() {
  return {
    phase: "Z7D" as const,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
    deterministic: true,
    summaryStates: ["stop_before_cleanup", "cleanup_now", "cleanup_today", "cleanup_this_week", "monitor_only", "no_cleanup_terminal", "not_ready"] as const,
  };
}
