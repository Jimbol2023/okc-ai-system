import { z9ManualRevenueRiskFlags } from "./z9-manual-revenue-risk-policy";

export type Z9RevenueRiskSignalLevel =
  | "governance_stop"
  | "contact_risk_stop"
  | "terminal"
  | "data_confidence_risk"
  | "near_close_risk"
  | "buyer_disposition_risk"
  | "conversion_quality_risk"
  | "follow_up_leakage_risk"
  | "recovery_complexity_risk"
  | "monitor_risk";

export type Z9RevenueRiskReviewInput = {
  id?: string;
  label?: string;
  recoveryLane?: string | null;
  recoverySummaryState?: string | null;
  advisoryRecoveryScore?: number | null;
  recoveryOpportunities?: string[];
  blockers?: string[];
  warnings?: string[];
  missingData?: string[];
  dependencyChecks?: string[];
  estimatedRevenue?: number | null;
  confidenceScore?: number | null;
  dataQualityScore?: number | null;
  conversionQualityScore?: number | null;
  daysStalled?: number | null;
  nearCloseRiskSignal?: boolean | null;
  buyerDispositionRiskSignal?: boolean | null;
  conversionQualityRiskSignal?: boolean | null;
  followUpLeakageRiskSignal?: boolean | null;
  governanceStop?: boolean | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  terminal?: boolean | null;
  status?: string | null;
  repeatedMonitorOnlyCount?: number | null;
  redundantSignalCount?: number | null;
  now?: string | Date;
};

export type Z9RevenueRiskSignalReviewResult = {
  riskSignalLevel: Z9RevenueRiskSignalLevel;
  riskFactors: string[];
  blockers: string[];
  warnings: string[];
  missingData: string[];
  complexityNotes: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  diminishingReturnsNote: string;
  flags: typeof z9ManualRevenueRiskFlags;
};

function hasOpportunity(input: Z9RevenueRiskReviewInput, pattern: string) {
  return (input.recoveryOpportunities ?? []).some((opportunity) => opportunity.toLowerCase().includes(pattern));
}

export function reviewZ9RevenueRiskSignals(input: Z9RevenueRiskReviewInput): Z9RevenueRiskSignalReviewResult {
  const riskFactors: string[] = [];
  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];
  const missingData = [...(input.missingData ?? [])];
  const complexityNotes = [...(input.dependencyChecks ?? [])];
  const status = (input.status ?? "").toLowerCase();

  if (input.governanceStop || input.recoveryLane === "governance_stop") blockers.push("governance stop");
  if (input.doNotContact || input.blocked || input.recoveryLane === "blocked_recovery") blockers.push("contact risk stop");
  if (input.terminal || status === "closed" || status === "dead" || input.recoverySummaryState === "no_recovery_terminal") riskFactors.push("terminal/no-risk-review");
  if (missingData.length > 0 || input.recoveryLane === "data_recovery_needed" || input.recoverySummaryState === "recovery_dependency_cleanup" || (input.confidenceScore ?? 100) < 55 || (input.dataQualityScore ?? 100) < 55) riskFactors.push("data confidence risk");
  if (input.nearCloseRiskSignal || input.recoveryLane === "closing_recovery" || hasOpportunity(input, "closing") || (input.estimatedRevenue ?? 0) >= 20000 && (input.confidenceScore ?? 100) < 75) riskFactors.push("near-close risk");
  if (input.buyerDispositionRiskSignal || input.recoveryLane === "buyer_disposition_recovery" || hasOpportunity(input, "buyer")) riskFactors.push("buyer/disposition risk");
  if (input.conversionQualityRiskSignal || input.recoveryLane === "conversion_recovery" || hasOpportunity(input, "conversion") || (input.conversionQualityScore ?? 100) < 60) riskFactors.push("conversion quality risk");
  if (input.followUpLeakageRiskSignal || input.recoveryLane === "follow_up_recovery" || hasOpportunity(input, "follow")) riskFactors.push("follow-up leakage risk");
  if ((input.recoveryOpportunities ?? []).length >= 3 || input.recoveryLane === "multi_bottleneck_recovery") {
    riskFactors.push("recovery complexity risk");
    complexityNotes.push("multiple recovery paths may reduce operator usability");
  }
  if ((input.daysStalled ?? 0) >= 14) {
    riskFactors.push("stale stalled risk");
    complexityNotes.push("stalled recovery may indicate fragile workflow quality");
  }
  if ((input.repeatedMonitorOnlyCount ?? 0) >= 2 || (input.redundantSignalCount ?? 0) >= 2 || input.recoveryLane === "monitor_recovery") complexityNotes.push("monitor-only or redundant signal should not create a new work lane");
  if (!input.recoveryLane && !input.recoverySummaryState && (input.advisoryRecoveryScore ?? null) === null && (input.recoveryOpportunities ?? []).length === 0) missingData.push("Z8 recovery lane, summary state, opportunities, or advisory recovery score");

  const uniqueBlockers = [...new Set(blockers)];
  const uniqueRiskFactors = [...new Set(riskFactors)];
  const uniqueMissingData = [...new Set(missingData)];
  const uniqueComplexityNotes = [...new Set(complexityNotes)];

  const onlyRedundantMonitor = uniqueRiskFactors.length === 0 && uniqueComplexityNotes.some((note) => note.includes("redundant"));
  const riskSignalLevel: Z9RevenueRiskSignalLevel = uniqueBlockers.includes("governance stop")
    ? "governance_stop"
    : uniqueBlockers.length > 0
      ? "contact_risk_stop"
      : uniqueRiskFactors.includes("terminal/no-risk-review")
        ? "terminal"
        : uniqueRiskFactors.includes("data confidence risk") || uniqueMissingData.length > 0
          ? "data_confidence_risk"
          : uniqueRiskFactors.includes("near-close risk")
            ? "near_close_risk"
            : uniqueRiskFactors.includes("buyer/disposition risk")
              ? "buyer_disposition_risk"
              : uniqueRiskFactors.includes("conversion quality risk")
                ? "conversion_quality_risk"
                : uniqueRiskFactors.includes("follow-up leakage risk")
                  ? "follow_up_leakage_risk"
                  : uniqueRiskFactors.includes("recovery complexity risk") || uniqueRiskFactors.includes("stale stalled risk")
                    ? "recovery_complexity_risk"
                    : onlyRedundantMonitor
                      ? "monitor_risk"
                      : "monitor_risk";

  return {
    riskSignalLevel,
    riskFactors: uniqueRiskFactors,
    blockers: uniqueBlockers,
    warnings,
    missingData: uniqueMissingData,
    complexityNotes: uniqueComplexityNotes,
    manualReviewRecommendation: riskSignalLevel === "governance_stop" || riskSignalLevel === "contact_risk_stop" ? "Resolve stop signals before manual risk review." : "Use risk review as manual advisory guidance only.",
    safeExplanation: "Z9 revenue risk review does not persist risk decisions, persist scores, create routes, request approvals, create alerts, archive reviews, mutate CRM records, contact anyone, write storage, write audits, escalate risk, execute recovery, or execute revenue actions.",
    diminishingReturnsNote: "If this risk signal only repeats Z7/Z8 without reducing operator confusion or preventing unsafe work, keep it monitor-only and consolidate future phases.",
    flags: z9ManualRevenueRiskFlags,
  };
}

export function createZ9RevenueRiskSignalReview() {
  return {
    phase: "Z9B" as const,
    flags: z9ManualRevenueRiskFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["governance stop", "contact risk stop", "terminal/no-risk-review", "data confidence risk", "recovery complexity risk", "near-close risk", "buyer/disposition risk", "conversion quality risk", "follow-up leakage risk", "stale stalled risk", "monitor-only redundancy"],
  };
}
