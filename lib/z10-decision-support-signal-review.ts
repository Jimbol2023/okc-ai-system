import { z10ManualRevenueDecisionFlags } from "./z10-manual-revenue-decision-policy";

export type Z10DecisionSignalLevel =
  | "stop_do_not_work"
  | "terminal_no_decision"
  | "cleanup_before_decision"
  | "review_risk_first"
  | "review_revenue_now"
  | "review_revenue_today"
  | "consolidate_instead_of_expand"
  | "monitor_only"
  | "defer_low_value";

export type Z10RevenueDecisionSupportInput = {
  id?: string;
  label?: string;
  status?: string | null;
  source?: string | null;
  readinessLevel?: string | null;
  priorityLane?: string | null;
  workdayLane?: string | null;
  cleanupLane?: string | null;
  recoveryLane?: string | null;
  riskLane?: string | null;
  summaryState?: string | null;
  riskSummaryState?: string | null;
  advisoryScore?: number | null;
  advisoryRiskScore?: number | null;
  advisoryRecoveryScore?: number | null;
  blockers?: string[];
  warnings?: string[];
  missingData?: string[];
  riskFactors?: string[];
  estimatedRevenue?: number | null;
  confidenceScore?: number | null;
  dataQualityScore?: number | null;
  terminal?: boolean | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  governanceStop?: boolean | null;
  redundantSignalCount?: number | null;
  repeatedMonitorOnlyCount?: number | null;
  usabilityNotes?: string[];
  cognitiveLoadNotes?: string[];
  now?: string | Date;
};

export type Z10DecisionSupportSignalReviewResult = {
  decisionSignalLevel: Z10DecisionSignalLevel;
  decisionFactors: string[];
  blockers: string[];
  warnings: string[];
  missingData: string[];
  usabilityNotes: string[];
  consolidationRecommendation: string;
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z10ManualRevenueDecisionFlags;
};

function includesAny(values: string[], needles: string[]) {
  return values.some((value) => needles.some((needle) => value.toLowerCase().includes(needle)));
}

export function reviewZ10DecisionSupportSignals(input: Z10RevenueDecisionSupportInput): Z10DecisionSupportSignalReviewResult {
  const decisionFactors: string[] = [];
  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];
  const missingData = [...(input.missingData ?? [])];
  const usabilityNotes = [...(input.usabilityNotes ?? []), ...(input.cognitiveLoadNotes ?? [])];
  const riskFactors = input.riskFactors ?? [];
  const status = (input.status ?? "").toLowerCase();
  const redundantCount = (input.redundantSignalCount ?? 0) + (input.repeatedMonitorOnlyCount ?? 0);

  if (input.governanceStop || input.riskLane === "governance_stop") blockers.push("governance stop");
  if (input.doNotContact || input.blocked || input.riskLane === "contact_risk_stop") blockers.push("DNC/blocked/contact stop");
  if (input.terminal || status === "closed" || status === "dead" || input.riskLane === "terminal_no_risk_review") decisionFactors.push("terminal/no-decision");
  if (missingData.length > 0 || input.riskLane === "data_confidence_risk" || input.readinessLevel === "needs_data_cleanup" || (input.confidenceScore ?? 100) < 55 || (input.dataQualityScore ?? 100) < 55) decisionFactors.push("cleanup before decision");
  if (input.riskLane === "near_close_risk" || input.riskLane === "buyer_disposition_risk" || input.riskLane === "conversion_quality_risk" || input.riskLane === "follow_up_leakage_risk" || riskFactors.length > 0) decisionFactors.push("risk review first");
  if ((input.estimatedRevenue ?? 0) >= 20000 || input.priorityLane === "work_first" || input.workdayLane === "review_now" || input.riskSummaryState === "risk_review_now" || (input.advisoryScore ?? 0) >= 85 || (input.advisoryRiskScore ?? 0) >= 85) decisionFactors.push("review revenue now");
  if (input.priorityLane === "near_conversion" || input.workdayLane === "work_today" || input.summaryState === "focus_today" || input.riskSummaryState === "risk_review_today" || (input.advisoryRecoveryScore ?? 0) >= 65) decisionFactors.push("review revenue today");
  if (input.priorityLane === "low_priority" || (input.estimatedRevenue ?? 0) > 0 && (input.estimatedRevenue ?? 0) < 5000) decisionFactors.push("defer low value");
  if (input.riskLane === "monitor_risk" || input.recoveryLane === "monitor_recovery" || input.summaryState === "monitor_only") decisionFactors.push("monitor only");
  if (redundantCount >= 2 || usabilityNotes.length >= 2 || includesAny(usabilityNotes, ["cognitive", "complex", "confusing", "too many"])) {
    decisionFactors.push("consolidate instead of expand");
    usabilityNotes.push("signals may increase cognitive load without improving action clarity");
  }
  if (!input.riskLane && !input.priorityLane && !input.readinessLevel && !input.summaryState && (input.advisoryScore ?? input.advisoryRiskScore ?? null) === null) missingData.push("Z2-Z9 readiness, priority, risk, summary, or advisory score");

  const uniqueBlockers = [...new Set(blockers)];
  const uniqueDecisionFactors = [...new Set(decisionFactors)];
  const uniqueMissingData = [...new Set(missingData)];
  const uniqueUsabilityNotes = [...new Set(usabilityNotes)];

  const decisionSignalLevel: Z10DecisionSignalLevel = uniqueBlockers.length > 0
    ? "stop_do_not_work"
    : uniqueDecisionFactors.includes("terminal/no-decision")
      ? "terminal_no_decision"
      : uniqueDecisionFactors.includes("cleanup before decision") || uniqueMissingData.length > 0
        ? "cleanup_before_decision"
        : uniqueDecisionFactors.includes("risk review first")
          ? "review_risk_first"
          : uniqueDecisionFactors.includes("review revenue now")
            ? "review_revenue_now"
            : uniqueDecisionFactors.includes("review revenue today")
              ? "review_revenue_today"
              : uniqueDecisionFactors.includes("consolidate instead of expand")
                ? "consolidate_instead_of_expand"
                : uniqueDecisionFactors.includes("monitor only")
                  ? "monitor_only"
                  : uniqueDecisionFactors.includes("defer low value")
                    ? "defer_low_value"
                    : "monitor_only";

  return {
    decisionSignalLevel,
    decisionFactors: uniqueDecisionFactors,
    blockers: uniqueBlockers,
    warnings,
    missingData: uniqueMissingData,
    usabilityNotes: uniqueUsabilityNotes,
    consolidationRecommendation: uniqueDecisionFactors.includes("consolidate instead of expand") ? "Consolidate advisory layers and move toward real manual lead operations usability." : "No additional advisory expansion is recommended after Z10.",
    manualReviewRecommendation: decisionSignalLevel === "stop_do_not_work" ? "Resolve stop signals before any manual revenue decision." : "Use this as compact manual decision support only.",
    safeExplanation: "Z10 decision support does not persist decisions, create routes, request approvals, execute decisions, assign operators, create notifications, change lead status, write audits, mutate CRM records, contact anyone, or execute revenue actions.",
    flags: z10ManualRevenueDecisionFlags,
  };
}

export function createZ10DecisionSupportSignalReview() {
  return {
    phase: "Z10B" as const,
    flags: z10ManualRevenueDecisionFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["governance/contact stops", "terminal no-decision", "missing data", "risk-first review", "high-value review-now", "review-today", "monitor/defer", "low-value/noisy records", "consolidation-needed"],
  };
}
