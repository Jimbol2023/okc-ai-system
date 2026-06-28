export type OfferReadinessStatus =
  | "ready_for_manual_offer_review"
  | "needs_underwriting_facts"
  | "needs_seller_context"
  | "blocked_or_suppressed"
  | "not_ready";

export type OfferReadinessOutcomeInput = {
  outcome: string;
  callCompletedAt?: Date | string;
  sellerMotivationSignal: string;
  sellerTimelineSignal: string;
  propertyConditionSignal: string;
  priceExpectationSignal: string;
  manualNextStep: string;
};

export type OfferReadinessLeadInput = {
  status: string;
  score: number;
  priority: string;
  doNotContact: boolean;
  approvalStatus: string;
  payload: string | null;
};

export const offerReadinessSafetyFlags = {
  offerSent: false,
  contractGenerated: false,
  valuationClaimed: false,
  externalPropertyDataUsed: false,
  providerCalled: false,
  crmAutoMutation: false,
  automationTriggered: false,
} as const;

function parsePayload(rawPayload: string | null) {
  if (!rawPayload) return {};

  try {
    const parsed = JSON.parse(rawPayload) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => {
      if (!current || typeof current !== "object" || Array.isArray(current)) return undefined;
      return (current as Record<string, unknown>)[key];
    }, source);

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return null;
}

function parseMoney(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;

  const parsed = Number(value.replace(/[$,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function getOfferReadinessAnalyzerFacts(payload: string | null) {
  const parsed = parsePayload(payload);

  return {
    arv: parseMoney(getPath(parsed, ["analyzer.arv", "arv", "deal.arv"])),
    estimatedRepairs: parseMoney(getPath(parsed, ["analyzer.estimatedRepairs", "estimatedRepairs", "repairs", "deal.estimatedRepairs"])),
    desiredProfit: parseMoney(getPath(parsed, ["analyzer.desiredProfit", "desiredProfit", "assignmentFee", "deal.desiredProfit"])),
  };
}

function hasPayloadText(payload: Record<string, unknown>, paths: string[]) {
  return paths.some((path) => {
    const value = getPath(payload, [path]);
    return typeof value === "string" && value.trim().length > 0;
  });
}

function isCapturedSignal(value: string | undefined) {
  return Boolean(value && !["not_captured", "unknown", "missing"].includes(value));
}

export function getOfferReadinessMissingFacts(lead: OfferReadinessLeadInput, latestOutcome?: OfferReadinessOutcomeInput | null) {
  const payload = parsePayload(lead.payload);
  const analyzerFacts = getOfferReadinessAnalyzerFacts(lead.payload);
  const missing = [
    analyzerFacts.arv === null ? "ARV" : "",
    analyzerFacts.estimatedRepairs === null ? "repair estimate" : "",
    analyzerFacts.desiredProfit === null ? "desired profit / assignment fee assumption" : "",
    !isCapturedSignal(latestOutcome?.priceExpectationSignal) &&
    !hasPayloadText(payload, ["priceExpectation", "askingPrice", "sellerPriceExpectation"])
      ? "seller price expectation"
      : "",
    !isCapturedSignal(latestOutcome?.sellerTimelineSignal) && !hasPayloadText(payload, ["timeline", "sellerTimeline", "sellerTimelineSignal"])
      ? "seller timeline"
      : "",
    !isCapturedSignal(latestOutcome?.propertyConditionSignal) && !hasPayloadText(payload, ["propertyCondition", "condition", "propertyConditionSignal"])
      ? "property condition"
      : "",
    !hasPayloadText(payload, ["occupancy", "occupancyStatus", "access", "accessNotes"]) ? "occupancy/access" : "",
    !hasPayloadText(payload, ["titleNotes", "titleStatus", "probateNotes", "taxConcernNotes", "taxStatus"]) ? "title/probate/tax concern notes" : "",
    !isCapturedSignal(latestOutcome?.sellerMotivationSignal) && !hasPayloadText(payload, ["sellerMotivation", "motivation", "sellerMotivationSignal"])
      ? "seller motivation"
      : "",
  ].filter(Boolean);

  return Array.from(new Set(missing));
}

export function getOfferReadinessAssumptionRoi(payload: string | null) {
  const facts = getOfferReadinessAnalyzerFacts(payload);

  if (facts.arv === null || facts.estimatedRepairs === null || facts.desiredProfit === null) {
    return {
      available: false,
      label: "Assumption ROI unavailable",
      assumptions: [],
    };
  }

  return {
    available: true,
    label: "Internal assumption-only review math",
    assumptions: [
      `ARV assumption: ${facts.arv}`,
      `Repair estimate assumption: ${facts.estimatedRepairs}`,
      `Desired profit / assignment fee assumption: ${facts.desiredProfit}`,
    ],
    reviewNote:
      "These are existing internal analyzer inputs only. They are not a valuation claim, seller-facing offer, appraisal, contract term, or external property-data result.",
  };
}

export function classifyOfferReadiness(lead: OfferReadinessLeadInput, latestOutcome?: OfferReadinessOutcomeInput | null): OfferReadinessStatus {
  if (lead.doNotContact || lead.approvalStatus === "rejected") return "blocked_or_suppressed";

  const missingFacts = getOfferReadinessMissingFacts(lead, latestOutcome);
  const underwritingMissing = missingFacts.some((fact) => ["ARV", "repair estimate", "desired profit / assignment fee assumption"].includes(fact));
  const sellerContextMissing = missingFacts.some((fact) =>
    ["seller price expectation", "seller timeline", "property condition", "seller motivation"].includes(fact),
  );

  if (underwritingMissing) return "needs_underwriting_facts";
  if (sellerContextMissing) return "needs_seller_context";

  const strongOutcome = latestOutcome
    ? ["wants_offer", "appointment_set", "interested"].includes(latestOutcome.outcome) ||
      latestOutcome.manualNextStep === "manual_offer_readiness_review"
    : false;
  const priorityReady = lead.priority === "High" || lead.score >= 60 || lead.status === "negotiating";

  if (strongOutcome && priorityReady) return "ready_for_manual_offer_review";

  return "not_ready";
}

export function getOfferReadinessNextAction(status: OfferReadinessStatus, missingFacts: string[]) {
  if (status === "ready_for_manual_offer_review") return "Review deal assumptions manually before any offer decision.";
  if (status === "needs_underwriting_facts") return `Complete underwriting facts: ${missingFacts.slice(0, 4).join(", ")}.`;
  if (status === "needs_seller_context") return `Capture seller context: ${missingFacts.slice(0, 4).join(", ")}.`;
  if (status === "blocked_or_suppressed") return "Do not advance. Resolve DNC, opt-out, or approval blocker manually.";
  return "Keep in sales follow-up until seller and underwriting signals improve.";
}

export function getOfferReadinessRank(input: {
  status: OfferReadinessStatus;
  lead: Pick<OfferReadinessLeadInput, "score" | "priority" | "status">;
  missingFacts: string[];
}) {
  if (input.status === "blocked_or_suppressed") return 0;

  let rank = input.lead.score;
  if (input.lead.priority === "High") rank += 30;
  if (input.lead.priority === "Medium") rank += 12;
  if (input.lead.status === "negotiating") rank += 25;
  if (input.status === "ready_for_manual_offer_review") rank += 40;
  if (input.status === "needs_underwriting_facts") rank += 18;
  if (input.status === "needs_seller_context") rank += 10;
  rank -= Math.min(input.missingFacts.length * 3, 24);

  return Math.max(1, rank);
}

export function buildOfferReadinessAudit(input: {
  totalLeads: number;
  readyCount: number;
  blockedCount: number;
  missingFactCount: number;
}) {
  return {
    status: "manual_offer_readiness_review_only",
    summary: `${input.readyCount} lead(s) ready for manual offer review from ${input.totalLeads} reviewed lead(s).`,
    blockedCount: input.blockedCount,
    missingFactCount: input.missingFactCount,
    safetyFlags: offerReadinessSafetyFlags,
    reviewNotes: [
      "Offer readiness is advisory only.",
      "No offer, contract, valuation claim, seller contact, provider call, or external property data is created.",
      "Any money context is based only on existing internal analyzer assumptions.",
    ],
  };
}
