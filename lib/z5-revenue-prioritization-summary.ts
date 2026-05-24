import { classifyZ5ManualRevenueRank } from "./z5-manual-revenue-rank-classifier";
import { reviewZ5RevenuePrioritySignals, type Z5RevenuePriorityInput } from "./z5-revenue-priority-signal-review";
import { z5ManualRevenuePrioritizationFlags, type Z5RevenuePriorityLane } from "./z5-manual-revenue-prioritization-policy";

export type Z5RevenuePrioritizationSummaryLevel =
  | "review_now"
  | "work_today"
  | "work_this_week"
  | "cleanup_before_work"
  | "blocked_do_not_work"
  | "monitor_only"
  | "low_priority"
  | "not_ready";

export type Z5RevenuePrioritizationSummary = {
  summaryLevel: Z5RevenuePrioritizationSummaryLevel;
  governanceSafety: string;
  revenuePriorityLane: Z5RevenuePriorityLane;
  manualRank: string;
  conversionUsefulness: string;
  followUpUrgency: string;
  dataQuality: string;
  blockerBurden: string;
  operatorAttentionRecommendation: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ5RevenuePrioritySignals>;
  rank: ReturnType<typeof classifyZ5ManualRevenueRank>;
  flags: typeof z5ManualRevenuePrioritizationFlags;
  advisoryOnly: true;
};

function getSummaryLevel(signals: ReturnType<typeof reviewZ5RevenuePrioritySignals>, rank: ReturnType<typeof classifyZ5ManualRevenueRank>): Z5RevenuePrioritizationSummaryLevel {
  if (!signals.status) return "not_ready";
  if (rank.priorityLane === "governance_stop" || rank.priorityLane === "blocked_cleanup") return "blocked_do_not_work";
  if (rank.priorityLane === "data_quality_priority") return "cleanup_before_work";
  if (rank.rankTier === "critical") return "review_now";
  if (rank.rankTier === "high" || rank.priorityLane === "work_first" || rank.priorityLane === "near_close_revenue") return "work_today";
  if (rank.priorityLane === "near_conversion" || rank.priorityLane === "buyer_disposition_priority" || rank.priorityLane === "follow_up_priority") return "work_this_week";
  if (rank.priorityLane === "low_priority") return "low_priority";
  return "monitor_only";
}

export function createZ5RevenuePrioritizationSummary(input: Z5RevenuePriorityInput): Z5RevenuePrioritizationSummary {
  const signals = reviewZ5RevenuePrioritySignals(input);
  const rank = classifyZ5ManualRevenueRank(input);
  const summaryLevel = getSummaryLevel(signals, rank);

  return {
    summaryLevel,
    governanceSafety: signals.blockers.length > 0 ? `Blockers present: ${signals.blockers.join(", ")}.` : "No governance stop or blocker detected from advisory input.",
    revenuePriorityLane: rank.priorityLane,
    manualRank: `${rank.rankTier} (${rank.advisoryScore}/100 advisory score, not persisted).`,
    conversionUsefulness: signals.readySignals.some((signal) => signal.includes("conversion")) ? "Conversion signal is useful for manual revenue prioritization." : "Conversion usefulness is limited or indirect.",
    followUpUrgency: signals.readySignals.includes("stale or overdue follow-up") ? "Follow-up urgency is visible." : "No stale follow-up priority detected.",
    dataQuality: signals.missingData.length > 0 ? `Missing data: ${signals.missingData.join(", ")}.` : "Critical prioritization data is present from advisory input.",
    blockerBurden: `${signals.blockers.length} blocker(s), ${signals.warnings.length} warning(s).`,
    operatorAttentionRecommendation: summaryLevel === "blocked_do_not_work" ? "Do not work this as revenue until blockers are reviewed." : "Use this as manual priority guidance only.",
    safeNextManualReview: rank.reason,
    signals,
    rank,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
  };
}

export function createZ5RevenuePrioritizationList(inputs: Z5RevenuePriorityInput[]) {
  const summaries = inputs.map((input, index) => ({
    inputIndex: index,
    inputId: input.id ?? "",
    inputLabel: input.label ?? "",
    summary: createZ5RevenuePrioritizationSummary(input),
  }));
  const ranked = [...summaries].sort((a, b) =>
    b.summary.rank.advisoryScore - a.summary.rank.advisoryScore ||
    a.summary.revenuePriorityLane.localeCompare(b.summary.revenuePriorityLane) ||
    a.inputId.localeCompare(b.inputId) ||
    a.inputLabel.localeCompare(b.inputLabel) ||
    a.inputIndex - b.inputIndex,
  );

  return {
    phase: "Z5D" as const,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
    ranked,
    countsBySummaryLevel: ranked.reduce<Record<Z5RevenuePrioritizationSummaryLevel, number>>((counts, item) => {
      counts[item.summary.summaryLevel] += 1;
      return counts;
    }, {
      review_now: 0,
      work_today: 0,
      work_this_week: 0,
      cleanup_before_work: 0,
      blocked_do_not_work: 0,
      monitor_only: 0,
      low_priority: 0,
      not_ready: 0,
    }),
  };
}

export function createZ5RevenuePrioritizationSummaryReview() {
  return {
    phase: "Z5D" as const,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
    deterministic: true,
    summaryLevels: ["review_now", "work_today", "work_this_week", "cleanup_before_work", "blocked_do_not_work", "monitor_only", "low_priority", "not_ready"] as const,
  };
}
