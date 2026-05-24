import { z7ManualRevenueBottleneckFlags } from "./z7-manual-revenue-bottleneck-policy";

export type Z7BottleneckSignalLevel =
  | "governance_stop"
  | "contact_safety_blocker"
  | "terminal"
  | "missing_critical_data"
  | "valuation_bottleneck"
  | "follow_up_bottleneck"
  | "conversion_bottleneck"
  | "buyer_disposition_bottleneck"
  | "closing_bottleneck"
  | "workflow_stall"
  | "monitor_only";

export type Z7BottleneckCleanupInput = {
  id?: string;
  label?: string;
  bottlenecks?: string[];
  blockers?: string[];
  warnings?: string[];
  missingData?: string[];
  priorityLane?: string | null;
  workdayLane?: string | null;
  summaryState?: string | null;
  conversionReadinessLevel?: string | null;
  followUpReadinessLevel?: string | null;
  buyerDispositionReady?: boolean | null;
  buyerReviewSignal?: boolean | null;
  closingReady?: boolean | null;
  closingSignal?: boolean | null;
  valuationReady?: boolean | null;
  offerReady?: boolean | null;
  score?: number | null;
  advisoryScore?: number | null;
  estimatedRevenue?: number | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  governanceStop?: boolean | null;
  rejected?: boolean | null;
  terminal?: boolean | null;
  status?: string | null;
  staleFollowUp?: boolean | null;
  overdueFollowUp?: boolean | null;
  daysStalled?: number | null;
  daysInStage?: number | null;
  now?: string | Date;
};

export type Z7BottleneckSignalReviewResult = {
  bottleneckSignalLevel: Z7BottleneckSignalLevel;
  detectedBottlenecks: string[];
  blockers: string[];
  warnings: string[];
  missingData: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z7ManualRevenueBottleneckFlags;
};

function includesAny(values: string[], needles: string[]) {
  return values.some((value) => needles.some((needle) => value.toLowerCase().includes(needle)));
}

export function reviewZ7BottleneckSignals(input: Z7BottleneckCleanupInput): Z7BottleneckSignalReviewResult {
  const detectedBottlenecks = [...(input.bottlenecks ?? [])];
  const blockers = [...(input.blockers ?? [])];
  const warnings = [...(input.warnings ?? [])];
  const missingData = [...(input.missingData ?? [])];
  const status = (input.status ?? "").toLowerCase();

  if (input.governanceStop || input.rejected || input.priorityLane === "governance_stop") blockers.push("governance stop");
  if (input.doNotContact || input.blocked || input.priorityLane === "blocked_cleanup" || input.workdayLane === "stop_first") blockers.push("DNC/blocked/contact safety");
  if (input.terminal || status === "closed" || status === "dead" || input.summaryState === "no_work") detectedBottlenecks.push("terminal/no-cleanup");
  if (missingData.length > 0 || input.summaryState === "cleanup_before_work" || input.priorityLane === "data_quality_priority" || input.workdayLane === "cleanup_first") detectedBottlenecks.push("missing critical data");
  if (input.valuationReady === false || input.offerReady === false || includesAny(detectedBottlenecks, ["valuation", "offer"])) detectedBottlenecks.push("valuation bottleneck");
  if (input.staleFollowUp || input.overdueFollowUp || input.followUpReadinessLevel === "overdue_manual_review" || input.workdayLane === "follow_up_today" || includesAny(detectedBottlenecks, ["follow"])) detectedBottlenecks.push("follow-up bottleneck");
  if (input.conversionReadinessLevel === "needs_offer_review" || input.conversionReadinessLevel === "needs_negotiation_review" || input.conversionReadinessLevel === "needs_contract_review" || input.priorityLane === "near_conversion" || includesAny(detectedBottlenecks, ["conversion", "contract", "negotiation"])) detectedBottlenecks.push("conversion bottleneck");
  if (input.buyerDispositionReady === false || input.buyerReviewSignal || input.conversionReadinessLevel === "needs_buyer_disposition_review" || input.workdayLane === "buyer_review_today" || input.priorityLane === "buyer_disposition_priority") detectedBottlenecks.push("buyer/disposition bottleneck");
  if (input.closingReady === false || input.closingSignal || input.conversionReadinessLevel === "needs_closing_coordination_review" || input.workdayLane === "near_close_today" || input.priorityLane === "near_close_revenue") detectedBottlenecks.push("closing bottleneck");
  if ((input.daysStalled ?? 0) >= 7 || (input.daysInStage ?? 0) >= 14 || input.summaryState === "monitor_only" && (input.advisoryScore ?? 0) >= 60) detectedBottlenecks.push("workflow stall");
  if (!input.priorityLane && !input.workdayLane && !input.summaryState && !input.conversionReadinessLevel && !input.followUpReadinessLevel && (input.advisoryScore ?? input.score ?? null) === null) missingData.push("Z5/Z6 priority, workday, readiness, or advisory score");

  const uniqueBlockers = [...new Set(blockers)];
  const uniqueBottlenecks = [...new Set(detectedBottlenecks)];
  const uniqueMissingData = [...new Set(missingData)];

  const bottleneckSignalLevel: Z7BottleneckSignalLevel = uniqueBlockers.includes("governance stop")
    ? "governance_stop"
    : uniqueBlockers.length > 0
      ? "contact_safety_blocker"
      : uniqueBottlenecks.includes("terminal/no-cleanup")
        ? "terminal"
        : uniqueBottlenecks.includes("missing critical data") || uniqueMissingData.length > 0
          ? "missing_critical_data"
          : uniqueBottlenecks.includes("closing bottleneck")
            ? "closing_bottleneck"
            : uniqueBottlenecks.includes("buyer/disposition bottleneck")
              ? "buyer_disposition_bottleneck"
              : uniqueBottlenecks.includes("conversion bottleneck")
                ? "conversion_bottleneck"
                : uniqueBottlenecks.includes("follow-up bottleneck")
                  ? "follow_up_bottleneck"
                  : uniqueBottlenecks.includes("valuation bottleneck")
                    ? "valuation_bottleneck"
                    : uniqueBottlenecks.includes("workflow stall")
                      ? "workflow_stall"
                      : "monitor_only";

  return {
    bottleneckSignalLevel,
    detectedBottlenecks: uniqueBottlenecks,
    blockers: uniqueBlockers,
    warnings,
    missingData: uniqueMissingData,
    manualReviewRecommendation: bottleneckSignalLevel === "governance_stop" || bottleneckSignalLevel === "contact_safety_blocker" ? "Resolve stop signals before manual cleanup review." : "Use bottleneck cleanup as manual advisory guidance only.",
    safeExplanation: "Z7 bottleneck cleanup signals do not resolve bottlenecks, change data, persist cleanup, create tasks, trigger enrichment, scraping, skip tracing, external lookups, storage writes, audit writes, CRM mutations, outreach, or revenue recovery execution.",
    flags: z7ManualRevenueBottleneckFlags,
  };
}

export function createZ7BottleneckSignalReview() {
  return {
    phase: "Z7B" as const,
    flags: z7ManualRevenueBottleneckFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["governance stop", "DNC/blocked/contact safety", "terminal/no-cleanup", "missing critical data", "valuation bottleneck", "follow-up bottleneck", "conversion bottleneck", "buyer/disposition bottleneck", "closing bottleneck", "workflow stall", "monitor only"],
  };
}
