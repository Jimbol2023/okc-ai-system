import { classifyZ9ManualRiskReview } from "./z9-manual-risk-review-classifier";
import { z9ManualRevenueRiskFlags } from "./z9-manual-revenue-risk-policy";
import { reviewZ9RevenueRiskSignals, type Z9RevenueRiskReviewInput } from "./z9-revenue-risk-signal-review";

export type Z9RevenueRiskReviewSummaryState =
  | "stop_before_risk_review"
  | "risk_review_now"
  | "risk_review_today"
  | "risk_review_this_week"
  | "monitor_risk_only"
  | "terminal_no_risk_review"
  | "not_ready";

export type Z9RevenueRiskReviewSummary = {
  summaryState: Z9RevenueRiskReviewSummaryState;
  riskClarity: string;
  governanceContactSafety: string;
  dataConfidence: string;
  recoveryComplexity: string;
  nearCloseRisk: string;
  buyerConversionRisk: string;
  followUpLeakageRisk: string;
  operatorRecommendation: string;
  diminishingReturnsWarning: string;
  safeNextManualReview: string;
  signals: ReturnType<typeof reviewZ9RevenueRiskSignals>;
  risk: ReturnType<typeof classifyZ9ManualRiskReview>;
  flags: typeof z9ManualRevenueRiskFlags;
  advisoryOnly: true;
};

function getSummaryState(signals: ReturnType<typeof reviewZ9RevenueRiskSignals>, risk: ReturnType<typeof classifyZ9ManualRiskReview>): Z9RevenueRiskReviewSummaryState {
  if (signals.missingData.includes("Z8 recovery lane, summary state, opportunities, or advisory recovery score")) return "not_ready";
  if (risk.riskTier === "stop") return "stop_before_risk_review";
  if (signals.riskSignalLevel === "terminal") return "terminal_no_risk_review";
  if (risk.riskTier === "now") return "risk_review_now";
  if (risk.riskTier === "today") return "risk_review_today";
  if (risk.riskTier === "week") return "risk_review_this_week";
  return "monitor_risk_only";
}

export function createZ9RevenueRiskReviewSummary(input: Z9RevenueRiskReviewInput): Z9RevenueRiskReviewSummary {
  const signals = reviewZ9RevenueRiskSignals(input);
  const risk = classifyZ9ManualRiskReview(input);
  const summaryState = getSummaryState(signals, risk);

  return {
    summaryState,
    riskClarity: signals.riskFactors.length > 0 ? `Risk factors: ${signals.riskFactors.join(", ")}.` : "No distinct revenue risk factor detected from advisory input.",
    governanceContactSafety: signals.blockers.length > 0 ? `Stop signals present: ${signals.blockers.join(", ")}.` : "No governance or contact stop detected.",
    dataConfidence: signals.missingData.length > 0 ? `Missing data: ${signals.missingData.join(", ")}.` : "No missing risk data detected.",
    recoveryComplexity: signals.complexityNotes.length > 0 ? `Complexity notes: ${signals.complexityNotes.join(", ")}.` : "No complexity warning detected.",
    nearCloseRisk: signals.riskFactors.includes("near-close risk") ? "Near-close risk is visible." : "No near-close risk detected.",
    buyerConversionRisk: signals.riskFactors.some((factor) => factor.includes("buyer") || factor.includes("conversion")) ? "Buyer or conversion risk is visible." : "No buyer or conversion risk detected.",
    followUpLeakageRisk: signals.riskFactors.includes("follow-up leakage risk") ? "Follow-up leakage risk is visible." : "No follow-up leakage risk detected.",
    operatorRecommendation: summaryState === "stop_before_risk_review" ? "Resolve stop signals before manual risk review." : "Use this as advisory human risk review only.",
    diminishingReturnsWarning: signals.diminishingReturnsNote,
    safeNextManualReview: risk.reason,
    signals,
    risk,
    flags: z9ManualRevenueRiskFlags,
    advisoryOnly: true,
  };
}

export function createZ9RevenueRiskReviewList(inputs: Z9RevenueRiskReviewInput[]) {
  const summaries = inputs.map((input, index) => ({
    inputIndex: index,
    inputId: input.id ?? "",
    inputLabel: input.label ?? "",
    summary: createZ9RevenueRiskReviewSummary(input),
  }));
  const ranked = [...summaries].sort((a, b) =>
    b.summary.risk.advisoryRiskScore - a.summary.risk.advisoryRiskScore ||
    a.summary.risk.riskLane.localeCompare(b.summary.risk.riskLane) ||
    a.inputId.localeCompare(b.inputId) ||
    a.inputLabel.localeCompare(b.inputLabel) ||
    a.inputIndex - b.inputIndex,
  );

  return {
    phase: "Z9D" as const,
    flags: z9ManualRevenueRiskFlags,
    advisoryOnly: true,
    ranked,
    countsBySummaryState: ranked.reduce<Record<Z9RevenueRiskReviewSummaryState, number>>((counts, item) => {
      counts[item.summary.summaryState] += 1;
      return counts;
    }, {
      stop_before_risk_review: 0,
      risk_review_now: 0,
      risk_review_today: 0,
      risk_review_this_week: 0,
      monitor_risk_only: 0,
      terminal_no_risk_review: 0,
      not_ready: 0,
    }),
  };
}

export function createZ9RevenueRiskReviewSummaryReview() {
  return {
    phase: "Z9D" as const,
    flags: z9ManualRevenueRiskFlags,
    advisoryOnly: true,
    deterministic: true,
    summaryStates: ["stop_before_risk_review", "risk_review_now", "risk_review_today", "risk_review_this_week", "monitor_risk_only", "terminal_no_risk_review", "not_ready"] as const,
  };
}
