import { normalizeZ2CrmStatus, z2CrmStatusTaxonomy, type Z2CrmStatus } from "./z2-crm-status-taxonomy";
import { z4ManualConversionFlags } from "./z4-manual-conversion-policy";

export type Z4ConversionSignalLevel = "ready" | "needs_data" | "needs_offer_review" | "needs_negotiation_review" | "needs_contract_review" | "needs_buyer_disposition" | "needs_closing_coordination" | "blocked" | "terminal";

export type Z4ConversionLeadInput = {
  id?: string;
  status?: string | null;
  source?: string | null;
  sellerResponse?: string | null;
  sellerMotivation?: string | null;
  sellerTimeline?: string | null;
  followUpReadinessLevel?: string | null;
  followUpPriorityLevel?: string | null;
  nextAction?: string | null;
  nextActionPlaceholder?: string | null;
  offerRecommendation?: unknown;
  negotiationRecommendation?: unknown;
  fundingApprovalReadiness?: unknown;
  dispositionRecommendation?: unknown;
  closingRecommendation?: unknown;
  propertyAddress?: string | null;
  arv?: string | number | null;
  estimatedRepairs?: string | number | null;
  askingPrice?: string | number | null;
  recommendedOffer?: string | number | null;
  titleStatus?: string | null;
  buyerReadiness?: string | null;
  closingReadiness?: string | null;
  doNotContact?: boolean | null;
  blocked?: boolean | null;
  approvalStatus?: string | null;
  now?: string | Date;
};

export type Z4ConversionSignalReadinessResult = {
  signalLevel: Z4ConversionSignalLevel;
  status: Z2CrmStatus | null;
  issues: string[];
  warnings: string[];
  readySignals: string[];
  missingData: string[];
  manualReviewRecommendation: string;
  safeExplanation: string;
  flags: typeof z4ManualConversionFlags;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function hasText(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function hasMoney(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  if (!hasText(value)) return false;
  const parsed = Number(String(value).replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) && parsed > 0;
}

function hasRecommendation(value: unknown, keys: string[]) {
  const record = asRecord(value);
  return keys.some((key) => hasText(record[key]));
}

export function reviewZ4ConversionSignalReadiness(input: Z4ConversionLeadInput): Z4ConversionSignalReadinessResult {
  const status = normalizeZ2CrmStatus(input.status);
  const metadata = status ? z2CrmStatusTaxonomy[status] : null;
  const issues: string[] = [];
  const warnings: string[] = [];
  const readySignals: string[] = [];
  const missingData: string[] = [];

  if (!status) issues.push("missing or invalid CRM status");
  if (input.doNotContact || input.blocked || status === "do_not_contact" || input.approvalStatus === "rejected") issues.push("DNC/blocked/suppressed state");
  if (metadata?.terminal) issues.push("terminal state");

  const sellerContextReady = hasText(input.sellerResponse) || hasText(input.sellerMotivation) || hasText(input.sellerTimeline);
  if (sellerContextReady) readySignals.push("seller context clarity");
  else missingData.push("seller response, motivation, or timeline");

  const valuationReady = hasMoney(input.arv) && hasMoney(input.estimatedRepairs);
  if (valuationReady) readySignals.push("valuation readiness");
  else missingData.push("ARV and repair estimate");

  const offerReady = hasMoney(input.recommendedOffer) || hasRecommendation(input.offerRecommendation, ["recommendedOffer", "offerType", "recommendedNextStep"]);
  if (offerReady || status === "offer_review_needed" || status === "offer_made") readySignals.push("offer readiness");
  else if (sellerContextReady && valuationReady) warnings.push("offer review needed");

  const negotiationReady = status === "negotiating" || hasRecommendation(input.negotiationRecommendation, ["status", "posture", "recommendedNextStep"]);
  if (negotiationReady) readySignals.push("negotiation readiness");

  const contractReady = status === "contract_review_needed" || hasText(asRecord(input.negotiationRecommendation).targetOutcome) || hasText(input.nextAction) && String(input.nextAction).includes("contract");
  if (contractReady) readySignals.push("contract review readiness");

  const buyerDispositionReady = status === "buyer_disposition_needed" || hasText(input.buyerReadiness) || hasRecommendation(input.dispositionRecommendation, ["recommendedNextStep", "buyerReadiness", "recommendedMarketingAngle"]);
  if (buyerDispositionReady) readySignals.push("buyer/disposition readiness");

  const closingReady = status === "closing_coordination_needed" || hasText(input.closingReadiness) || hasRecommendation(input.closingRecommendation, ["readinessStatus", "readinessState", "recommendedNextStep"]);
  if (closingReady) readySignals.push("closing coordination readiness");

  if (!hasText(input.propertyAddress)) missingData.push("property address");
  if (!hasText(input.source)) missingData.push("source");
  if (missingData.length > 0) issues.push("missing critical conversion data");

  const signalLevel: Z4ConversionSignalLevel = issues.includes("DNC/blocked/suppressed state")
    ? "blocked"
    : issues.includes("terminal state")
      ? "terminal"
      : closingReady
        ? "needs_closing_coordination"
        : buyerDispositionReady
          ? "needs_buyer_disposition"
          : contractReady
            ? "needs_contract_review"
            : negotiationReady
              ? "needs_negotiation_review"
              : offerReady || warnings.includes("offer review needed")
                ? "needs_offer_review"
                : issues.length > 0
                  ? "needs_data"
                  : "ready";

  return {
    signalLevel,
    status,
    issues,
    warnings,
    readySignals,
    missingData: [...new Set(missingData)],
    manualReviewRecommendation: signalLevel === "ready" ? "Ready for human manual conversion review." : "Human operator should resolve conversion readiness before any real-world conversion action.",
    safeExplanation: "Z4 conversion signal readiness is advisory only. It does not send offers, generate contracts, contact buyers or sellers, mutate CRM state, create queues, write storage, or execute conversion actions.",
    flags: z4ManualConversionFlags,
  };
}

export function createZ4ConversionSignalReadinessReview() {
  return {
    phase: "Z4B" as const,
    flags: z4ManualConversionFlags,
    advisoryOnly: true,
    deterministic: true,
    checks: ["seller context clarity", "valuation readiness", "offer readiness", "negotiation readiness", "contract-readiness blockers", "buyer/disposition readiness", "closing coordination readiness", "DNC/suppressed state", "terminal state", "missing critical conversion data"],
  };
}
