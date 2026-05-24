import { normalizeZ2CrmStatus, z2CrmStatusTaxonomy, type Z2CrmStatus } from "./z2-crm-status-taxonomy";
import { z5ManualRevenuePrioritizationFlags } from "./z5-manual-revenue-prioritization-policy";

export type Z5RevenuePrioritySignalLevel =
  | "governance_stop"
  | "blocked"
  | "terminal"
  | "high_value"
  | "near_conversion"
  | "near_close"
  | "buyer_disposition"
  | "stale_follow_up"
  | "needs_data"
  | "nurture"
  | "low_priority";

export type Z5RevenuePriorityInput = {
  id?: string;
  label?: string;
  status?: string | null;
  source?: string | null;
  score?: number | null;
  priority?: string | null;
  estimatedRevenue?: number | null;
  estimatedValue?: number | null;
  conversionReadinessLevel?: string | null;
  conversionStage?: string | null;
  followUpReadinessLevel?: string | null;
  blockers?: string[];
  bottlenecks?: string[];
  missingData?: string[];
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  approvalStatus?: string | null;
  governanceStop?: boolean | null;
  terminal?: boolean | null;
  buyerReadiness?: string | null;
  closingReadiness?: string | null;
  staleFollowUp?: boolean | null;
  overdueFollowUp?: boolean | null;
  nextFollowUpAt?: string | Date | null;
  lastContactedAt?: string | Date | null;
  now?: string | Date;
};

export type Z5RevenuePrioritySignalReviewResult = {
  signalLevel: Z5RevenuePrioritySignalLevel;
  status: Z2CrmStatus | null;
  readySignals: string[];
  blockers: string[];
  warnings: string[];
  missingData: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z5ManualRevenuePrioritizationFlags;
};

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function toTime(value: string | Date | null | undefined) {
  if (!value) return null;
  const time = value instanceof Date ? value.getTime() : Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

function getNow(input: Z5RevenuePriorityInput) {
  return toTime(input.now) ?? Date.now();
}

function isHighValue(input: Z5RevenuePriorityInput) {
  return (input.estimatedRevenue ?? input.estimatedValue ?? 0) >= 15000 || (input.score ?? 0) >= 70 || input.priority === "High";
}

function hasNearConversion(input: Z5RevenuePriorityInput, status: Z2CrmStatus | null) {
  return Boolean(
    status === "offer_review_needed" ||
      status === "offer_made" ||
      status === "negotiating" ||
      status === "contract_review_needed" ||
      input.conversionReadinessLevel?.includes("offer") ||
      input.conversionReadinessLevel?.includes("negotiation") ||
      input.conversionReadinessLevel?.includes("contract") ||
      input.conversionStage?.includes("offer") ||
      input.conversionStage?.includes("negotiation") ||
      input.conversionStage?.includes("contract"),
  );
}

function hasNearClose(input: Z5RevenuePriorityInput, status: Z2CrmStatus | null) {
  return Boolean(status === "under_contract" || status === "closing_coordination_needed" || input.closingReadiness?.includes("closing") || input.conversionReadinessLevel?.includes("closing"));
}

function hasBuyerDisposition(input: Z5RevenuePriorityInput, status: Z2CrmStatus | null) {
  return Boolean(status === "buyer_disposition_needed" || input.buyerReadiness?.includes("buyer") || input.conversionReadinessLevel?.includes("buyer_disposition"));
}

function hasStaleFollowUp(input: Z5RevenuePriorityInput) {
  if (input.staleFollowUp || input.overdueFollowUp || input.followUpReadinessLevel?.includes("overdue")) return true;
  const nextFollowUp = toTime(input.nextFollowUpAt);
  return nextFollowUp !== null && nextFollowUp <= getNow(input);
}

export function reviewZ5RevenuePrioritySignals(input: Z5RevenuePriorityInput): Z5RevenuePrioritySignalReviewResult {
  const status = normalizeZ2CrmStatus(input.status);
  const metadata = status ? z2CrmStatusTaxonomy[status] : null;
  const readySignals: string[] = [];
  const blockers = [...(input.blockers ?? [])];
  const warnings: string[] = [];
  const missingData = [...(input.missingData ?? [])];

  if (!status) missingData.push("valid CRM status");
  if (!hasText(input.source)) missingData.push("source");
  if ((input.score ?? null) === null && (input.estimatedRevenue ?? input.estimatedValue ?? null) === null) missingData.push("score or estimated revenue");

  if (input.governanceStop) blockers.push("governance stop");
  if (input.doNotContact || input.blocked || status === "do_not_contact" || input.approvalStatus === "rejected") blockers.push("DNC/blocked/rejected");
  if (metadata?.terminal || input.terminal) readySignals.push("terminal lead");
  if (isHighValue(input)) readySignals.push("high-value opportunity");
  if (hasNearConversion(input, status)) readySignals.push("near-conversion opportunity");
  if (hasNearClose(input, status)) readySignals.push("near-close revenue");
  if (hasBuyerDisposition(input, status)) readySignals.push("buyer/disposition priority");
  if (hasStaleFollowUp(input)) readySignals.push("stale or overdue follow-up");
  if (input.priority === "Low" || (input.score ?? 100) < 40) warnings.push("low-priority signal");
  if (input.followUpReadinessLevel?.includes("paused") || input.conversionReadinessLevel?.includes("not_ready")) warnings.push("nurture or monitor signal");
  if (missingData.length > 0) warnings.push("missing critical data");

  const signalLevel: Z5RevenuePrioritySignalLevel = blockers.includes("governance stop")
    ? "governance_stop"
    : blockers.length > 0
      ? "blocked"
      : readySignals.includes("terminal lead")
        ? "terminal"
        : readySignals.includes("near-close revenue")
          ? "near_close"
          : readySignals.includes("buyer/disposition priority")
            ? "buyer_disposition"
            : readySignals.includes("near-conversion opportunity")
              ? "near_conversion"
              : readySignals.includes("high-value opportunity")
                ? "high_value"
                : readySignals.includes("stale or overdue follow-up")
                  ? "stale_follow_up"
                  : warnings.includes("missing critical data")
                    ? "needs_data"
                    : warnings.includes("nurture or monitor signal")
                      ? "nurture"
                      : warnings.includes("low-priority signal")
                        ? "low_priority"
                        : "nurture";

  return {
    signalLevel,
    status,
    readySignals,
    blockers: [...new Set(blockers)],
    warnings,
    missingData: [...new Set(missingData)],
    manualReviewRecommendation: signalLevel === "blocked" || signalLevel === "governance_stop" ? "Resolve governance and blocker signals before revenue work." : "Use these signals for manual revenue prioritization only.",
    safeExplanation: "Z5 revenue priority signals are advisory only. They do not assign work, create queues, route leads, persist ranks, notify operators, mutate CRM data, contact anyone, or execute revenue actions.",
    flags: z5ManualRevenuePrioritizationFlags,
  };
}

export function createZ5RevenuePrioritySignalReview() {
  return {
    phase: "Z5B" as const,
    flags: z5ManualRevenuePrioritizationFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["governance stop", "DNC/suppressed", "terminal", "missing critical data", "high-value opportunity", "near-conversion", "under-contract/near-close", "buyer/disposition priority", "stale/overdue follow-up", "nurture/low-priority"],
  };
}
