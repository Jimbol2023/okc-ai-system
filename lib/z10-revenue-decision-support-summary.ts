import { reviewZ10DecisionSupportSignals, type Z10RevenueDecisionSupportInput } from "./z10-decision-support-signal-review";
import { classifyZ10ManualDecisionSupport } from "./z10-manual-decision-support-classifier";
import { z10ManualRevenueDecisionFlags } from "./z10-manual-revenue-decision-policy";

export type Z10RevenueDecisionSupportSummaryState =
  | "stop_before_decision"
  | "needs_cleanup"
  | "risk_review_first"
  | "decision_review_now"
  | "decision_review_today"
  | "monitor_only"
  | "defer"
  | "terminal_no_decision"
  | "consolidate_next"
  | "not_ready";

export type Z10RevenueDecisionSupportSummary = {
  summaryState: Z10RevenueDecisionSupportSummaryState;
  decisionClarity: string;
  safetyPosture: string;
  cleanupNeed: string;
  riskPosture: string;
  revenueUsefulness: string;
  operatorUsability: string;
  consolidationPressure: string;
  manualRecommendation: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ10DecisionSupportSignals>;
  decision: ReturnType<typeof classifyZ10ManualDecisionSupport>;
  flags: typeof z10ManualRevenueDecisionFlags;
  advisoryOnly: true;
};

function getSummaryState(signals: ReturnType<typeof reviewZ10DecisionSupportSignals>, decision: ReturnType<typeof classifyZ10ManualDecisionSupport>): Z10RevenueDecisionSupportSummaryState {
  if (signals.missingData.includes("Z2-Z9 readiness, priority, risk, summary, or advisory score")) return "not_ready";
  if (decision.decisionTier === "stop") return "stop_before_decision";
  if (decision.decisionLane === "terminal_no_decision") return "terminal_no_decision";
  if (decision.decisionLane === "cleanup_before_decision") return "needs_cleanup";
  if (decision.decisionLane === "review_risk_first") return "risk_review_first";
  if (decision.decisionLane === "review_revenue_now") return "decision_review_now";
  if (decision.decisionLane === "review_revenue_today") return "decision_review_today";
  if (decision.decisionLane === "consolidate_instead_of_expand") return "consolidate_next";
  if (decision.decisionLane === "defer_low_value") return "defer";
  return "monitor_only";
}

export function createZ10RevenueDecisionSupportSummary(input: Z10RevenueDecisionSupportInput): Z10RevenueDecisionSupportSummary {
  const signals = reviewZ10DecisionSupportSignals(input);
  const decision = classifyZ10ManualDecisionSupport(input);
  const summaryState = getSummaryState(signals, decision);

  return {
    summaryState,
    decisionClarity: signals.decisionFactors.length > 0 ? `Decision factors: ${signals.decisionFactors.join(", ")}.` : "No distinct decision factor detected from advisory input.",
    safetyPosture: signals.blockers.length > 0 ? `Stop signals present: ${signals.blockers.join(", ")}.` : "No decision stop signal detected.",
    cleanupNeed: signals.missingData.length > 0 ? `Missing data: ${signals.missingData.join(", ")}.` : "No cleanup need detected.",
    riskPosture: signals.decisionFactors.includes("risk review first") ? "Risk should be reviewed before revenue work." : "No risk-first decision posture detected.",
    revenueUsefulness: decision.advisoryDecisionScore >= 65 ? "Useful for manual revenue decision review." : "Useful mainly for monitoring, deferral, or consolidation.",
    operatorUsability: signals.usabilityNotes.length > 0 ? `Usability notes: ${signals.usabilityNotes.join(", ")}.` : "No operator usability warning detected.",
    consolidationPressure: signals.consolidationRecommendation,
    manualRecommendation: summaryState === "stop_before_decision" ? "Resolve stop signals before manual decision review." : "Use this as compact manual decision support only.",
    safeNextManualReview: decision.reason,
    signals,
    decision,
    flags: z10ManualRevenueDecisionFlags,
    advisoryOnly: true,
  };
}

export function createZ10RevenueDecisionSupportList(inputs: Z10RevenueDecisionSupportInput[]) {
  const summaries = inputs.map((input, index) => ({
    inputIndex: index,
    inputId: input.id ?? "",
    inputLabel: input.label ?? "",
    summary: createZ10RevenueDecisionSupportSummary(input),
  }));
  const ranked = [...summaries].sort((a, b) =>
    b.summary.decision.advisoryDecisionScore - a.summary.decision.advisoryDecisionScore ||
    a.summary.decision.decisionLane.localeCompare(b.summary.decision.decisionLane) ||
    a.inputId.localeCompare(b.inputId) ||
    a.inputLabel.localeCompare(b.inputLabel) ||
    a.inputIndex - b.inputIndex,
  );

  return {
    phase: "Z10D" as const,
    flags: z10ManualRevenueDecisionFlags,
    advisoryOnly: true,
    ranked,
    countsBySummaryState: ranked.reduce<Record<Z10RevenueDecisionSupportSummaryState, number>>((counts, item) => {
      counts[item.summary.summaryState] += 1;
      return counts;
    }, {
      stop_before_decision: 0,
      needs_cleanup: 0,
      risk_review_first: 0,
      decision_review_now: 0,
      decision_review_today: 0,
      monitor_only: 0,
      defer: 0,
      terminal_no_decision: 0,
      consolidate_next: 0,
      not_ready: 0,
    }),
  };
}

export function createZ10RevenueDecisionSupportSummaryReview() {
  return {
    phase: "Z10D" as const,
    flags: z10ManualRevenueDecisionFlags,
    advisoryOnly: true,
    deterministic: true,
    summaryStates: ["stop_before_decision", "needs_cleanup", "risk_review_first", "decision_review_now", "decision_review_today", "monitor_only", "defer", "terminal_no_decision", "consolidate_next", "not_ready"] as const,
  };
}
