import type { FundingRecommendation } from "@/types/capital-funding";
import type { FundingApprovalReadiness } from "@/types/funding-approval";
import type { NegotiationPosture, NegotiationRecommendation, NegotiationStatus, SellerObjection } from "@/types/negotiation-engine";
import type { OfferRecommendation } from "@/types/offer-engine";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type NegotiationInput = {
  offerRecommendation?: OfferRecommendation | null;
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
  portfolioDecision?: PortfolioDecision | null;
  feasibilityResult?: unknown;
  fundingRecommendation?: FundingRecommendation | null;
  deal?: unknown;
  lead?: unknown;
  askingPrice?: number | null;
  recommendedOffer?: number | null;
  openingOffer?: number | null;
  walkAwayPrice?: number | null;
  repairs?: number | null;
  estimatedRepairs?: number | null;
  arv?: number | null;
  sellerMotivation?: string | null;
  sellerTimeline?: string | null;
  occupancyStatus?: string | null;
  titleStatus?: string | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  reliabilityScore?: number | null;
  dataCompletenessScore?: number | null;
  assetType?: string | null;
  propertyType?: string | null;
  state?: string | null;
  market?: string | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, contract, and closing requirements with a qualified Oklahoma real estate attorney/title company before presenting, negotiating, or signing any offer.";

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

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getOptionalNumber(source: unknown, paths: string[]) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : null;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : fallback;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function formatMoney(value?: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "the current internal number";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getMetrics(input: NegotiationInput) {
  const offer = input.offerRecommendation;
  const askingPrice = getNumber(input, ["askingPrice", "deal.askingPrice", "lead.askingPrice"], 0);
  const recommendedOffer = offer?.recommendedOffer ?? getNumber(input, ["recommendedOffer"], 0);
  const openingOffer = offer?.openingOffer ?? getNumber(input, ["openingOffer"], recommendedOffer);
  const walkAwayPrice = offer?.walkAwayPrice ?? getNumber(input, ["walkAwayPrice"], offer?.maxAllowableOffer ?? recommendedOffer);
  const arv = getNumber(input, ["arv", "deal.arv", "lead.arv"], 0);
  const repairs = getNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"], 0);
  const sellerMotivation = getString(input, ["sellerMotivation", "deal.sellerMotivation", "lead.sellerMotivation"], "").toLowerCase();
  const sellerTimeline = getString(input, ["sellerTimeline", "deal.sellerTimeline", "lead.sellerTimeline"], "").toLowerCase();
  const occupancyStatus = getString(input, ["occupancyStatus", "occupancy", "deal.occupancyStatus", "lead.occupancy"], "unknown").toLowerCase();
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown").toLowerCase();
  const riskScore = getNumber(input, ["riskScore"], 50);
  const uncertaintyScore = getNumber(input, ["uncertaintyScore"], 50);
  const reliabilityScore = getNumber(input, ["reliabilityScore", "portfolioDecision.confidence"], input.portfolioDecision?.confidence ?? 50);
  const dataCompletenessScore = getNumber(input, ["dataCompletenessScore"], 70);
  const assetType = getString(input, ["assetType", "propertyType", "deal.assetType", "lead.propertyType"], "").toLowerCase();
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const approvalStatus = input.fundingApprovalReadiness?.status;
  const offerType = offer?.offerType;
  const priceGap = askingPrice > 0 && walkAwayPrice > 0 ? ((askingPrice - walkAwayPrice) / askingPrice) * 100 : 0;

  return {
    askingPrice,
    recommendedOffer,
    openingOffer,
    walkAwayPrice,
    arv,
    repairs,
    sellerMotivation,
    sellerTimeline,
    occupancyStatus,
    titleStatus,
    riskScore,
    uncertaintyScore,
    reliabilityScore,
    dataCompletenessScore,
    assetType,
    stateMarket,
    approvalStatus,
    offerType,
    priceGap,
    primaryFunding: input.fundingRecommendation?.primaryMethod ?? "",
  };
}

function isHighMotivation(text: string) {
  return ["urgent", "high", "motivated", "foreclosure", "probate", "tax", "vacant", "distress", "behind"].some((term) => text.includes(term));
}

function isUrgentTimeline(text: string) {
  return ["asap", "urgent", "fast", "immediate", "now", "soon", "30", "two weeks", "week"].some((term) => text.includes(term));
}

function needsComplianceWarning(input: NegotiationInput) {
  const metrics = getMetrics(input);
  const text = `${metrics.offerType ?? ""} ${metrics.primaryFunding} ${input.portfolioDecision?.action ?? ""}`.toLowerCase();

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

function getStatus(input: NegotiationInput): NegotiationStatus {
  const metrics = getMetrics(input);

  if (!input.offerRecommendation) return "review_required";
  if (metrics.offerType === "pass_no_offer" || metrics.approvalStatus === "rejected") return "do_not_negotiate";
  if (metrics.approvalStatus === "review_required" || metrics.dataCompletenessScore < 55) return "review_required";
  if (metrics.approvalStatus === "approved_with_conditions" || metrics.uncertaintyScore >= 70 || metrics.titleStatus === "unknown") return "negotiate_with_conditions";

  return "ready_to_negotiate";
}

function getPosture(input: NegotiationInput, status: NegotiationStatus): NegotiationPosture {
  const metrics = getMetrics(input);

  if (status === "do_not_negotiate" || status === "review_required") return "pause_review";
  if (metrics.offerType === "seller_finance_offer" || metrics.offerType === "subject_to_offer") return "soft_consultative";
  if (metrics.priceGap >= 20) return "data_driven";
  if (isHighMotivation(metrics.sellerMotivation) && isUrgentTimeline(metrics.sellerTimeline)) return "urgent_deadline";
  if (isHighMotivation(metrics.sellerMotivation)) return "problem_solver";
  if (metrics.riskScore >= 65 || metrics.uncertaintyScore >= 60) return "data_driven";

  return "firm_investor";
}

function buildObjections(input: NegotiationInput): SellerObjection[] {
  const metrics = getMetrics(input);
  const lowOfferResponse = `I understand. The number is based on the repair scope, resale risk, closing costs, and the need to stay below ${formatMoney(metrics.walkAwayPrice)}. If the facts change, we can revisit it.`;

  return [
    {
      objection: "Your offer is too low",
      likelyReason: "Seller is anchored to asking price, retail value, or emotional value.",
      responseStrategy: "Use data and repair risk without arguing.",
      sampleResponse: lowOfferResponse,
      riskLevel: metrics.priceGap >= 20 ? "high" : "medium",
    },
    {
      objection: "I need to think about it",
      likelyReason: "Seller may need certainty, family input, or a comparison point.",
      responseStrategy: "Give space while clarifying the next decision point.",
      sampleResponse: "That makes sense. The most helpful next step is confirming title, repairs, and timing so you can compare the offer clearly.",
      riskLevel: "low",
    },
    {
      objection: "Another investor offered more",
      likelyReason: "Seller is testing price or comparing headline numbers without terms.",
      responseStrategy: "Compare certainty, proof, timing, contingencies, and closing path.",
      sampleResponse: "A higher number can be useful if it is real and closeable. I would compare proof of funds, inspection terms, closing date, and whether the buyer can actually perform.",
      riskLevel: "medium",
    },
    {
      objection: "I don't want to pay repairs",
      likelyReason: "Seller wants net certainty without repair responsibility.",
      responseStrategy: "Position the offer as as-is pricing.",
      sampleResponse: "The internal number assumes an as-is purchase, so the repair burden is priced into the offer instead of being pushed back onto you.",
      riskLevel: "low",
    },
    {
      objection: "I still owe too much",
      likelyReason: "Mortgage payoff, arrears, liens, or equity gap may block a cash offer.",
      responseStrategy: "Pause and verify payoff before discussing structure.",
      sampleResponse: "Before discussing any structure, the payoff, arrears, and title items need to be verified through the proper closing process.",
      riskLevel: metrics.offerType === "subject_to_offer" ? "high" : "medium",
    },
    {
      objection: "I don't trust wholesalers",
      likelyReason: "Seller may worry about assignment, double-close, fees, or performance.",
      responseStrategy: "Be transparent that legal/title review is required and avoid promises.",
      sampleResponse: "That concern is fair. Any path should be reviewed with the title company and qualified counsel so the closing process and disclosures are clear.",
      riskLevel: metrics.offerType === "wholesale_offer" ? "high" : "medium",
    },
    {
      objection: "Can you close fast?",
      likelyReason: "Seller values speed and certainty.",
      responseStrategy: "Confirm speed only after title, funding, and closing facts are verified.",
      sampleResponse: "Speed depends on title, payoff, access, and funding verification. Once those are clear, the closing timeline can be confirmed.",
      riskLevel: "medium",
    },
    {
      objection: "What happens if I change my mind?",
      likelyReason: "Seller is worried about rights, cancellation, and contract obligations.",
      responseStrategy: "Avoid legal advice and direct them to attorney/title review.",
      sampleResponse: "That is a legal and contract question. You should review cancellation rights and obligations with a qualified Oklahoma real estate attorney or title company before signing anything.",
      riskLevel: "high",
    },
  ];
}

function getOpeningPosition(input: NegotiationInput, posture: NegotiationPosture) {
  const metrics = getMetrics(input);

  if (posture === "pause_review") return "Do not open a seller negotiation until review items are resolved.";
  if (posture === "soft_consultative") return `Lead with problem discovery and terms fit before discussing ${formatMoney(metrics.openingOffer)} or structure.`;
  if (posture === "data_driven") return `Anchor around ${formatMoney(metrics.openingOffer)} and explain the gap using ARV, repairs, title, funding readiness, and resale risk.`;
  if (posture === "urgent_deadline") return `Open with speed and certainty, then frame ${formatMoney(metrics.openingOffer)} as the as-is number that supports a clean timeline.`;
  if (posture === "problem_solver") return `Start with the seller's problem, then connect ${formatMoney(metrics.openingOffer)} to as-is convenience and closing certainty.`;

  return `Open firmly around ${formatMoney(metrics.openingOffer)} and keep room to negotiate up to ${formatMoney(metrics.walkAwayPrice)} only if verification supports it.`;
}

function getRequiredVerifications(input: NegotiationInput) {
  const metrics = getMetrics(input);
  const items = [
    "Verify seller authority and decision maker.",
    "Verify ARV, repair scope, and current property condition.",
    "Verify title status, liens, payoff, taxes, and closing constraints.",
    "Verify funding readiness and walk-away number before seller conversation.",
    ...(input.offerRecommendation?.requiredVerifications ?? []),
    ...(input.fundingApprovalReadiness?.requiredFixes ?? []),
  ];

  if (metrics.occupancyStatus === "occupied") items.push("Verify occupancy, access, and move-out expectations.");
  if (metrics.offerType === "seller_finance_offer" || metrics.offerType === "subject_to_offer") {
    items.push("Verify loan balance, arrears, payment, insurance, escrow, due-on-sale risk, and attorney/title review.");
  }

  return unique(items);
}

function usesAssumptions(input: NegotiationInput) {
  return (
    !input.offerRecommendation ||
    getOptionalNumber(input, ["riskScore"]) === null ||
    getOptionalNumber(input, ["uncertaintyScore"]) === null ||
    getOptionalNumber(input, ["dataCompletenessScore"]) === null ||
    getPath(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"]) === null ||
    getPath(input, ["sellerTimeline", "deal.sellerTimeline", "lead.sellerTimeline"]) === null
  );
}

export function generateNegotiationRecommendation(input: NegotiationInput): NegotiationRecommendation {
  const metrics = getMetrics(input);
  const status = getStatus(input);
  const posture = getPosture(input, status);
  const complianceWarnings = needsComplianceWarning(input)
    ? [OKLAHOMA_COMPLIANCE_WARNING, "This is internal negotiation guidance only and is not legal advice or a guarantee of compliance."]
    : [];
  const negotiationRisks = unique([
    ...(input.offerRecommendation?.riskAdjustments ?? []),
    ...(metrics.priceGap >= 20 ? ["Seller asking price is materially above the internal walk-away number."] : []),
    ...(metrics.titleStatus === "unknown" ? ["Title status is unknown before negotiation."] : []),
    ...(metrics.uncertaintyScore >= 70 ? ["High uncertainty may make seller commitments premature."] : []),
    ...(usesAssumptions(input) ? ["Some negotiation guidance uses assumptions and requires human verification."] : []),
  ]);
  const safeConcessions = [
    "Flexible closing date after title and funding review.",
    "Seller leave-behind cleanup flexibility if budget allows.",
    "Title-company closing and documented closing process.",
    "Proof-of-funds or funding evidence after internal review.",
    "Limited earnest money only if allowed, safe, and reviewed.",
  ];
  const unsafeConcessions = [
    "Waiving critical due diligence.",
    "Promising legal, tax, title, or cancellation outcomes.",
    "Claiming to act for the seller.",
    "Clouding title or pressuring a seller to sign.",
    "Promising funding or closing speed that is not verified.",
    "Exceeding the walk-away price.",
  ];

  return {
    status,
    posture,
    openingPosition: getOpeningPosition(input, posture),
    targetOutcome:
      status === "do_not_negotiate"
        ? "Pause negotiation and resolve offer or approval blockers."
        : `Keep the conversation focused on an as-is outcome near ${formatMoney(metrics.recommendedOffer)} without exceeding ${formatMoney(metrics.walkAwayPrice)}.`,
    walkAwayTrigger:
      status === "do_not_negotiate"
        ? "Any seller conversation requiring price, contract, or closing commitments before review is complete."
        : `Walk away if the seller requires more than ${formatMoney(metrics.walkAwayPrice)}, asks for unverified legal promises, or refuses title/funding verification.`,
    safeConcessions,
    unsafeConcessions,
    likelyObjections: buildObjections(input),
    talkingPoints: unique([
      "This is an internal negotiation plan, not seller outreach.",
      metrics.repairs > 0 ? `Repair exposure is estimated around ${formatMoney(metrics.repairs)} and should be verified.` : "Repair exposure must be verified before negotiation.",
      metrics.arv > 0 ? `ARV support is around ${formatMoney(metrics.arv)} before risk adjustments.` : "ARV support is missing or unverified.",
      "Emphasize as-is certainty, verified closing process, and title-company handling.",
      posture === "soft_consultative" ? "Use discovery questions before discussing creative terms." : "",
      posture === "data_driven" ? "Explain the offer with numbers instead of pressure." : "",
    ]),
    negotiationRisks,
    requiredVerifications: getRequiredVerifications(input),
    complianceWarnings,
    recommendedNextStep:
      status === "do_not_negotiate"
        ? "Do not negotiate. Fix offer, funding approval, and verification blockers first."
        : status === "review_required"
          ? "Require human review before any seller conversation."
          : status === "negotiate_with_conditions"
            ? "Negotiate only after conditions are reviewed and the operator confirms the opening position."
            : "Prepare an internal conversation plan for a human operator. Do not send messages from this system.",
  };
}
