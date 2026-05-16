import type { FundingApprovalReadiness } from "@/types/funding-approval";
import type { FollowUpRecommendation } from "@/types/follow-up-conversion";
import type { NegotiationRecommendation } from "@/types/negotiation-engine";
import type { OfferRecommendation } from "@/types/offer-engine";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type FollowUpConversionInput = {
  negotiationRecommendation?: NegotiationRecommendation | null;
  offerRecommendation?: OfferRecommendation | null;
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
  portfolioDecision?: PortfolioDecision | null;
  deal?: unknown;
  lead?: unknown;
  sellerResponse?: string | null;
  sellerMotivation?: string | null;
  sellerTimeline?: string | null;
  lastContactedAt?: string | Date | null;
  followUpCount?: number | null;
  doNotContact?: boolean | null;
  optOutReason?: string | null;
  askingPrice?: number | null;
  recommendedOffer?: number | null;
  walkAwayPrice?: number | null;
  titleStatus?: string | null;
  occupancyStatus?: string | null;
  state?: string | null;
  market?: string | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  dataCompletenessScore?: number | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, contract, and closing requirements with a qualified Oklahoma real estate attorney/title company before presenting, negotiating, sending, or signing any offer.";

const ASSUMPTION_WARNING = "Some follow-up guidance uses assumptions and requires human verification.";

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (value !== undefined && value !== null && value !== "") return value;
  }

  return null;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : fallback;
}

function getBoolean(source: unknown, paths: string[], fallback = false) {
  const value = getPath(source, paths);

  return typeof value === "boolean" ? value : fallback;
}

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function isHighMotivation(text: string) {
  return hasAny(text, ["urgent", "high", "motivated", "foreclosure", "probate", "tax", "vacant", "distress", "behind", "relocation", "divorce", "tired"]);
}

function isUrgentTimeline(text: string) {
  return hasAny(text, ["asap", "urgent", "fast", "immediate", "now", "soon", "today", "tomorrow", "week", "30", "two weeks"]);
}

function sellerNeedsTime(text: string) {
  return hasAny(text, ["think", "thinking", "need time", "sleep on", "talk to", "family", "spouse", "later", "not ready"]);
}

function sellerRejected(text: string) {
  return hasAny(text, ["stop", "never", "no thanks", "not interested", "too low", "leave me alone", "remove", "unsubscribe", "already sold", "sold"]);
}

function getMetrics(input: FollowUpConversionInput) {
  const sellerResponse = getString(input, ["sellerResponse", "deal.sellerResponse", "lead.lastSellerReply", "lead.sellerResponse"], "").toLowerCase();
  const sellerMotivation = getString(input, ["sellerMotivation", "deal.sellerMotivation", "lead.sellerMotivation"], "").toLowerCase();
  const sellerTimeline = getString(input, ["sellerTimeline", "deal.sellerTimeline", "lead.sellerTimeline"], "").toLowerCase();
  const optOutReason = getString(input, ["optOutReason", "deal.optOutReason", "lead.optOutReason"], "");
  const askingPrice = getNumber(input, ["askingPrice", "deal.askingPrice", "lead.askingPrice"], 0);
  const recommendedOffer = input.offerRecommendation?.recommendedOffer ?? getNumber(input, ["recommendedOffer"], 0);
  const walkAwayPrice = input.offerRecommendation?.walkAwayPrice ?? getNumber(input, ["walkAwayPrice"], input.offerRecommendation?.maxAllowableOffer ?? recommendedOffer);
  const followUpCount = getNumber(input, ["followUpCount", "deal.followUpCount", "lead.followUpCount"], 0);
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown").toLowerCase();
  const occupancyStatus = getString(input, ["occupancyStatus", "occupancy", "deal.occupancyStatus", "lead.occupancy"], "unknown").toLowerCase();
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const riskScore = getNumber(input, ["riskScore"], 50);
  const uncertaintyScore = getNumber(input, ["uncertaintyScore"], 50);
  const dataCompletenessScore = getNumber(input, ["dataCompletenessScore"], 70);
  const doNotContact = input.doNotContact === true || getBoolean(input, ["deal.doNotContact", "lead.doNotContact"], false);
  const priceGap = askingPrice > 0 && walkAwayPrice > 0 ? ((askingPrice - walkAwayPrice) / askingPrice) * 100 : 0;

  return {
    sellerResponse,
    sellerMotivation,
    sellerTimeline,
    optOutReason,
    askingPrice,
    walkAwayPrice,
    followUpCount,
    titleStatus,
    occupancyStatus,
    stateMarket,
    riskScore,
    uncertaintyScore,
    dataCompletenessScore,
    doNotContact,
    priceGap,
  };
}

function needsComplianceWarning(input: FollowUpConversionInput) {
  const metrics = getMetrics(input);
  const offerType = input.offerRecommendation?.offerType ?? "";
  const portfolioAction = input.portfolioDecision?.action ?? "";
  const text = `${offerType} ${portfolioAction} ${input.negotiationRecommendation?.openingPosition ?? ""}`.toLowerCase();

  return (
    metrics.stateMarket.trim() === "" ||
    metrics.stateMarket.includes("ok") ||
    metrics.stateMarket.includes("oklahoma") ||
    text.includes("wholesale") ||
    text.includes("assignment") ||
    text.includes("double") ||
    text.includes("seller_finance") ||
    text.includes("subject_to") ||
    text.includes("creative") ||
    text.includes("contract")
  );
}

function usesAssumptions(input: FollowUpConversionInput) {
  return (
    !input.negotiationRecommendation ||
    !input.offerRecommendation ||
    getPath(input, ["sellerResponse", "deal.sellerResponse", "lead.lastSellerReply", "lead.sellerResponse"]) === null ||
    getPath(input, ["sellerTimeline", "deal.sellerTimeline", "lead.sellerTimeline"]) === null ||
    getPath(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"]) === null
  );
}

function baseWarnings(input: FollowUpConversionInput) {
  return unique([
    ...(needsComplianceWarning(input) ? [OKLAHOMA_COMPLIANCE_WARNING, "This is internal follow-up guidance only and is not legal advice or a guarantee of compliance."] : []),
    ...(usesAssumptions(input) ? [ASSUMPTION_WARNING] : []),
  ]);
}

function baseVerifications(input: FollowUpConversionInput) {
  const metrics = getMetrics(input);

  return unique([
    "Verify contact safety status before any human outreach is considered.",
    "Verify seller authority, title status, payoff, liens, taxes, and closing constraints.",
    "Verify ARV, repair scope, offer ceiling, and walk-away number.",
    ...(metrics.occupancyStatus === "occupied" ? ["Verify occupancy, access, and move-out expectations."] : []),
    ...(input.negotiationRecommendation?.requiredVerifications ?? []),
    ...(input.offerRecommendation?.requiredVerifications ?? []),
    ...(input.fundingApprovalReadiness?.requiredFixes ?? []),
  ]);
}

function withCommon(input: FollowUpConversionInput, recommendation: FollowUpRecommendation): FollowUpRecommendation {
  return {
    ...recommendation,
    escalationTriggers: unique(recommendation.escalationTriggers ?? []),
    stopConditions: unique(recommendation.stopConditions ?? []),
    risks: unique(recommendation.risks ?? []),
    requiredVerifications: unique([...(recommendation.requiredVerifications ?? []), ...baseVerifications(input)]),
    complianceWarnings: unique([...(recommendation.complianceWarnings ?? []), ...baseWarnings(input)]),
  };
}

export function generateFollowUpRecommendation(input: FollowUpConversionInput): FollowUpRecommendation {
  const metrics = getMetrics(input);

  if (metrics.doNotContact || metrics.optOutReason) {
    return withCommon(input, {
      sellerState: "do_not_contact",
      priority: "do_not_pursue",
      recommendedAction: "kill",
      messageGuidance: undefined,
      conversionGoal: "Protect contact safety and stop seller-facing activity.",
      stopConditions: ["Lead is marked Do Not Contact or has an opt-out reason."],
      risks: ["Continuing follow-up after opt-out or Do Not Contact creates compliance and trust risk."],
      requiredVerifications: ["Confirm Do Not Contact and opt-out status are preserved before any future review."],
      recommendedNextStep: "Do not follow up. Keep the record suppressed from outreach unless a qualified human review documents a lawful basis to update contact status.",
    });
  }

  if (sellerRejected(metrics.sellerResponse) && !metrics.sellerResponse.includes("too low")) {
    return withCommon(input, {
      sellerState: "dead",
      priority: "do_not_pursue",
      recommendedAction: "kill",
      conversionGoal: "Close the loop internally without further seller pressure.",
      stopConditions: ["Seller rejected further conversation or indicated the opportunity is no longer active."],
      risks: ["Additional follow-up may damage trust or violate contact preferences."],
      recommendedNextStep: "Mark as dead or require human review if the seller later re-engages through an allowed channel.",
    });
  }

  if (input.negotiationRecommendation?.status === "do_not_negotiate") {
    return withCommon(input, {
      sellerState: "dead",
      priority: "do_not_pursue",
      recommendedAction: "kill",
      conversionGoal: "Avoid advancing a deal that the negotiation engine blocked.",
      stopConditions: ["Negotiation engine status is do_not_negotiate."],
      risks: unique(["Offer, approval, or verification blockers make seller follow-up unsafe.", ...(input.negotiationRecommendation.negotiationRisks ?? [])]),
      recommendedNextStep: "Do not continue follow-up until the underlying offer and approval blockers are resolved by a human operator.",
    });
  }

  if (
    input.negotiationRecommendation?.status === "review_required" ||
    input.fundingApprovalReadiness?.status === "review_required" ||
    input.fundingApprovalReadiness?.status === "rejected" ||
    metrics.dataCompletenessScore < 55
  ) {
    return withCommon(input, {
      sellerState: "review_required",
      priority: input.fundingApprovalReadiness?.status === "rejected" ? "do_not_pursue" : "medium",
      recommendedAction: "human_review",
      conversionGoal: "Resolve review items before preparing any seller-facing follow-up.",
      followUpAngle: "Internal verification first, then clarify seller concerns only after review.",
      messageGuidance: "Prepare a low-pressure clarification plan only after review is complete. Do not promise price, closing speed, legal outcomes, or contract terms.",
      escalationTriggers: ["Funding approval is rejected or review-required.", "Negotiation status requires review.", "Data completeness is below the decision threshold."],
      risks: ["Seller follow-up before review could create unverified expectations."],
      recommendedNextStep: "Route to human review and complete required verifications before any follow-up is prepared.",
    });
  }

  if (metrics.priceGap >= 20 || metrics.sellerResponse.includes("too low")) {
    return withCommon(input, {
      sellerState: "price_gap",
      priority: metrics.priceGap >= 35 ? "low" : "medium",
      recommendedAction: "task_only",
      nextFollowUpInHours: metrics.priceGap >= 35 ? 168 : 72,
      followUpAngle: "Data-driven repair, ARV, title, funding, and resale-risk explanation.",
      messageGuidance: "Prepare guidance that calmly explains how the internal number was built from verified facts. Keep the tone factual, avoid arguing, and do not exceed the walk-away price.",
      conversionGoal: "Find out whether the seller can move toward the verified walk-away range.",
      escalationTriggers: ["Seller produces new repair, title, payoff, or competing-offer facts.", "Seller signals urgency despite the price gap."],
      stopConditions: ["Seller required price remains above the walk-away price.", "Seller asks for unverified legal, tax, or closing guarantees."],
      risks: ["Waiting may lose the lead to a higher headline offer.", "Increasing price without new facts can break the deal model."],
      recommendedNextStep: "Prepare a human-reviewed price-gap explanation and update the model only if new facts are verified.",
    });
  }

  if (isHighMotivation(metrics.sellerMotivation) && isUrgentTimeline(metrics.sellerTimeline)) {
    return withCommon(input, {
      sellerState: "hot_ready",
      priority: metrics.riskScore >= 70 || metrics.uncertaintyScore >= 70 ? "high" : "urgent",
      recommendedAction: metrics.riskScore >= 70 || metrics.uncertaintyScore >= 70 ? "task_only" : "call",
      nextFollowUpInHours: metrics.riskScore >= 70 || metrics.uncertaintyScore >= 70 ? 24 : 2,
      followUpAngle: "Certainty, speed, simple closing path, and practical problem solving.",
      messageGuidance: "Prepare concise guidance focused on verified certainty, as-is convenience, and next facts needed. Do not promise closing speed until title, payoff, access, and funding are confirmed.",
      conversionGoal: "Confirm decision maker, timeline, price range, property access, and title path.",
      escalationTriggers: ["Seller wants to move immediately.", "Seller asks about signing, assignment, double-close, seller-finance, subject-to, or closing terms.", "Title, payoff, occupancy, or funding uncertainty appears."],
      stopConditions: ["Contact safety changes to opt-out or Do Not Contact.", "Seller requires promises the operator cannot verify."],
      risks: ["Delay may reduce trust or allow a competing buyer to step in.", "High urgency can hide title, occupancy, or payoff issues."],
      recommendedNextStep: "Create an internal same-day task for a human operator. No automated outreach is authorized.",
    });
  }

  if (sellerNeedsTime(metrics.sellerResponse)) {
    return withCommon(input, {
      sellerState: "needs_time",
      priority: "medium",
      recommendedAction: "task_only",
      nextFollowUpInHours: 48,
      followUpAngle: "Helpful check-in that clarifies concerns and decision criteria.",
      messageGuidance: "Prepare a respectful check-in that gives space, asks what concern needs clarification, and avoids pressure.",
      conversionGoal: "Identify the actual blocker: price, trust, timing, family input, title, or competing options.",
      escalationTriggers: ["Seller names a specific concern.", "Seller requests contract, closing, tax, or legal explanation."],
      stopConditions: ["Seller asks not to be contacted.", "Seller remains nonresponsive after repeated human-reviewed follow-ups."],
      risks: ["Waiting too long can let uncertainty harden into rejection."],
      recommendedNextStep: "Schedule a human-reviewed follow-up task 48 hours out.",
    });
  }

  if (metrics.followUpCount >= 5 || (!isHighMotivation(metrics.sellerMotivation) && metrics.followUpCount >= 3)) {
    return withCommon(input, {
      sellerState: "cold",
      priority: "low",
      recommendedAction: "pause",
      nextFollowUpInHours: 336,
      followUpAngle: "Soft re-engagement with no pressure.",
      messageGuidance: "Prepare a brief re-engagement note for later human review that asks whether selling is still relevant and gives the seller an easy way to decline.",
      conversionGoal: "Determine whether the lead is still active without creating pressure.",
      escalationTriggers: ["Seller re-engages with a clear need, timeline, or price movement."],
      stopConditions: ["Seller remains inactive after the planned nurture window.", "Any opt-out or Do Not Contact signal appears."],
      risks: ["Continued frequent follow-up can reduce trust on a low-motivation lead."],
      recommendedNextStep: "Pause aggressive follow-up and keep only a low-frequency internal task.",
    });
  }

  if (!metrics.sellerResponse && !metrics.sellerMotivation && !metrics.sellerTimeline) {
    return withCommon(input, {
      sellerState: "new_uncontacted",
      priority: "medium",
      recommendedAction: "human_review",
      followUpAngle: "Initial discovery only after contact safety and lead source are verified.",
      messageGuidance: "Follow-up recommendation unavailable. Add seller response, motivation, timeline, offer, negotiation status, and contact safety status.",
      conversionGoal: "Verify whether this lead has enough seller context for follow-up planning.",
      risks: ["Follow-up guidance is weak without seller response, motivation, timeline, and contact safety data."],
      recommendedNextStep: "Add seller response, motivation, timeline, offer, negotiation status, and contact safety status.",
    });
  }

  return withCommon(input, {
    sellerState: isHighMotivation(metrics.sellerMotivation) ? "interested" : "follow_up_needed",
    priority: isHighMotivation(metrics.sellerMotivation) ? "high" : "medium",
    recommendedAction: "task_only",
    nextFollowUpInHours: isHighMotivation(metrics.sellerMotivation) ? 24 : 72,
    followUpAngle: isHighMotivation(metrics.sellerMotivation)
      ? "Problem solving, verified certainty, and simple next decision."
      : "Low-pressure clarification of interest, timeline, and decision criteria.",
    messageGuidance: "Prepare internal guidance for a human operator that is honest, low-pressure, and focused on verified facts. Do not misrepresent buyer role or promise legal, tax, title, funding, or closing outcomes.",
    conversionGoal: "Move from general interest to a verified next decision: price range, timeline, access, title, and closing path.",
    escalationTriggers: ["Seller asks for contract terms, assignment, double-close, seller-finance, subject-to, legal rights, or closing commitments.", "Seller timeline becomes urgent.", "Seller changes price expectations or provides new property facts."],
    stopConditions: ["Seller opts out or asks not to be contacted.", "Seller requires a price above walk-away without new verified facts.", "Required verification fails."],
    risks: ["Waiting may reduce seller engagement.", "Proceeding without verification may create inaccurate expectations."],
    recommendedNextStep: "Create an internal follow-up task for human approval. Do not send messages or execute outreach from this system.",
  });
}
