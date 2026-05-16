import type { FundingSensitivityResult } from "@/types/capital-stack";
import type { BuyerMatch, BuyerType, DispositionPath, DispositionRecommendation } from "@/types/disposition-buyer-matching";
import type { FundingApprovalReadiness } from "@/types/funding-approval";
import type { FollowUpRecommendation } from "@/types/follow-up-conversion";
import type { NegotiationRecommendation } from "@/types/negotiation-engine";
import type { OfferRecommendation } from "@/types/offer-engine";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type BuyerInput = {
  id?: string;
  buyerId?: string;
  name?: string;
  buyerName?: string;
  buyerType?: BuyerType | string;
  preferredLocations?: unknown;
  markets?: unknown;
  cities?: unknown;
  propertyTypes?: unknown;
  assetTypes?: unknown;
  priceRangeMin?: number | string | null;
  priceRangeMax?: number | string | null;
  preferredDealSize?: number | string | null;
  preferredCondition?: string | null;
  financingType?: string | null;
  tier?: string | null;
  buyerQualityScore?: number | string | null;
  matchReadinessScore?: number | string | null;
  isActive?: boolean | null;
  activityCount?: number | string | null;
  meaningfulActivityCount?: number | string | null;
  lastActiveAt?: string | Date | null;
  recentActivities?: Array<{ eventType?: string | null }> | null;
  activities?: Array<{ eventType?: string | null }> | null;
};

type DispositionBuyerMatchingInput = {
  followUpRecommendation?: FollowUpRecommendation | null;
  negotiationRecommendation?: NegotiationRecommendation | null;
  offerRecommendation?: OfferRecommendation | null;
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
  capitalStackComparison?: FundingSensitivityResult | null;
  portfolioDecision?: PortfolioDecision | null;
  strategyDecision?: unknown;
  deal?: unknown;
  lead?: unknown;
  existingBuyerList?: BuyerInput[] | null;
  buyers?: BuyerInput[] | null;
  assetType?: string | null;
  propertyType?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  market?: string | null;
  zip?: string | null;
  arv?: number | string | null;
  repairs?: number | string | null;
  estimatedRepairs?: number | string | null;
  askingPrice?: number | string | null;
  recommendedOffer?: number | string | null;
  walkAwayPrice?: number | string | null;
  expectedProfit?: number | string | null;
  buyerDemandScore?: number | string | null;
  titleStatus?: string | null;
  occupancyStatus?: string | null;
  closingTimeline?: string | null;
  propertyCondition?: string | null;
  condition?: string | null;
  zoning?: string | null;
  rent?: number | string | null;
  monthlyRent?: number | string | null;
  noi?: number | string | null;
  acreage?: number | string | null;
  access?: string | null;
  utilities?: string | null;
  floodplain?: string | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, contract, marketing, buyer-disclosure, and closing requirements with a qualified Oklahoma real estate attorney/title company before marketing, assigning, double-closing, or signing any agreement.";

const ASSUMPTION_WARNING = "Some disposition guidance uses assumptions and requires human verification.";

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

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function toArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") return String(item).trim().toLowerCase();
      if (item && typeof item === "object" && "zip" in item) return String((item as { zip?: unknown }).zip ?? "").trim().toLowerCase();
      if (item && typeof item === "object" && "label" in item) return String((item as { label?: unknown }).label ?? "").trim().toLowerCase();

      return "";
    })
    .filter(Boolean);
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { currency: "USD", maximumFractionDigits: 0, style: "currency" }).format(value);
}

function getMetrics(input: DispositionBuyerMatchingInput) {
  const assetType = getString(input, ["assetType", "propertyType", "deal.assetType", "deal.propertyType", "lead.propertyType"], "").toLowerCase();
  const strategyText = `${getString(input, ["strategyDecision.recommendedStrategy"], "")} ${input.portfolioDecision?.action ?? ""} ${input.offerRecommendation?.offerType ?? ""}`.toLowerCase();
  const condition = getString(input, ["propertyCondition", "condition", "deal.propertyCondition", "deal.condition"], "").toLowerCase();
  const occupancyStatus = getString(input, ["occupancyStatus", "occupancy", "deal.occupancyStatus", "lead.occupancy"], "unknown").toLowerCase();
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown").toLowerCase();
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const cityMarket = `${getString(input, ["city", "deal.city", "lead.city"], "")} ${getString(input, ["zip", "deal.zip", "lead.zip"], "")} ${stateMarket}`.toLowerCase();
  const arv = getNumber(input, ["arv", "deal.arv"], 0);
  const repairs = getNumber(input, ["repairs", "estimatedRepairs", "deal.repairs", "deal.estimatedRepairs"], 0);
  const askingPrice = getNumber(input, ["askingPrice", "deal.askingPrice"], 0);
  const recommendedOffer = input.offerRecommendation?.recommendedOffer ?? getNumber(input, ["recommendedOffer"], 0);
  const walkAwayPrice = input.offerRecommendation?.walkAwayPrice ?? getNumber(input, ["walkAwayPrice"], input.offerRecommendation?.maxAllowableOffer ?? recommendedOffer);
  const expectedProfit = input.offerRecommendation?.expectedProfit ?? input.portfolioDecision?.estimatedReturn?.profit ?? getNumber(input, ["expectedProfit"], 0);
  const buyerDemandScore = getNumber(input, ["buyerDemandScore", "deal.buyerDemandScore"], 0);
  const rent = getNumber(input, ["rent", "monthlyRent", "deal.rent", "deal.monthlyRent"], 0);
  const noi = getNumber(input, ["noi", "deal.noi"], 0);
  const acreage = getNumber(input, ["acreage", "deal.acreage"], 0);
  const floodplain = getString(input, ["floodplain", "deal.floodplain"], "").toLowerCase();
  const zoning = getString(input, ["zoning", "deal.zoning"], "").toLowerCase();

  return {
    assetType,
    strategyText,
    condition,
    occupancyStatus,
    titleStatus,
    stateMarket,
    cityMarket,
    arv,
    repairs,
    askingPrice,
    recommendedOffer,
    walkAwayPrice,
    expectedProfit,
    buyerDemandScore,
    rent,
    noi,
    acreage,
    floodplain,
    zoning,
  };
}

function buyerDemandSignal(score: number): DispositionRecommendation["buyerDemandSignal"] {
  if (score >= 70) return "strong";
  if (score >= 45) return "moderate";
  if (score > 0) return "weak";

  return "unknown";
}

function hasTitleRisk(titleStatus: string) {
  return titleStatus === "unknown" || titleStatus.includes("issue") || titleStatus.includes("lien") || titleStatus.includes("probate") || titleStatus.includes("cloud");
}

function needsOklahomaWarning(input: DispositionBuyerMatchingInput) {
  const metrics = getMetrics(input);
  const text = `${metrics.stateMarket} ${metrics.strategyText} ${input.capitalStackComparison?.bestMethod ?? ""}`.toLowerCase();

  return (
    metrics.stateMarket.trim() === "" ||
    text.includes("ok") ||
    text.includes("oklahoma") ||
    text.includes("wholesale") ||
    text.includes("assignment") ||
    text.includes("double") ||
    text.includes("seller_finance") ||
    text.includes("subject_to") ||
    text.includes("creative") ||
    text.includes("contract")
  );
}

function targetBuyerType(input: DispositionBuyerMatchingInput): BuyerType {
  const metrics = getMetrics(input);
  const text = `${metrics.assetType} ${metrics.strategyText} ${metrics.condition} ${metrics.zoning}`.toLowerCase();

  if (text.includes("creative") || text.includes("seller_finance") || text.includes("subject_to")) return "creative_finance_buyer";
  if (text.includes("portfolio") || metrics.arv >= 750000 || metrics.askingPrice >= 500000) return "institutional_buyer";
  if (text.includes("multifamily") || text.includes("duplex") || text.includes("triplex") || text.includes("quad") || metrics.noi > 0) return "multifamily_buyer";
  if (text.includes("commercial") || text.includes("retail") || text.includes("office") || text.includes("industrial")) return "commercial_buyer";
  if (text.includes("land") || metrics.acreage > 0) return metrics.zoning.includes("res") || text.includes("develop") ? "builder_developer" : "land_investor";
  if (text.includes("str") || text.includes("short")) return "str_buyer";
  if (metrics.rent > 0 || metrics.occupancyStatus.includes("tenant") || text.includes("rental") || text.includes("rent_ready")) return "rental_buyer";
  if (metrics.repairs > 25000 || text.includes("distressed") || text.includes("heavy") || text.includes("flip")) return "fix_and_flip_investor";
  if (text.includes("single") || text.includes("house") || text.includes("residential")) return metrics.condition.includes("ready") ? "rental_buyer" : "fix_and_flip_investor";

  return "cash_buyer";
}

function chooseDispositionPath(input: DispositionBuyerMatchingInput): DispositionPath {
  const metrics = getMetrics(input);
  const followUp = input.followUpRecommendation;
  const portfolioAction = input.portfolioDecision?.action;
  const capitalMethod = input.capitalStackComparison?.bestMethod;

  if (
    followUp?.sellerState === "do_not_contact" ||
    followUp?.sellerState === "dead" ||
    followUp?.recommendedAction === "kill" ||
    followUp?.priority === "do_not_pursue" ||
    input.negotiationRecommendation?.status === "do_not_negotiate" ||
    portfolioAction === "pass"
  ) {
    return "do_not_dispose";
  }

  if (input.fundingApprovalReadiness?.status === "rejected") return "pause_review";
  if (hasTitleRisk(metrics.titleStatus)) return "pause_review";
  if (portfolioAction === "package_portfolio") return "package_portfolio";
  if (portfolioAction === "hold") return "hold_internal";
  if (portfolioAction === "flip") return "sell_owned_asset";
  if (portfolioAction === "creative_finance") return "pause_review";

  if (portfolioAction === "wholesale") {
    if (capitalMethod === "transactional_funding" || capitalMethod === "buyer_funded_double_close") return "double_close";
    if (buyerDemandSignal(metrics.buyerDemandScore) === "strong" || metrics.strategyText.includes("wholesale")) return "assign_contract";

    return "pause_review";
  }

  if (capitalMethod === "transactional_funding" || capitalMethod === "buyer_funded_double_close") return "double_close";

  return "pause_review";
}

function inferBuyerType(buyer: BuyerInput): BuyerType {
  const text = `${buyer.buyerType ?? ""} ${buyer.financingType ?? ""} ${buyer.preferredCondition ?? ""} ${toArray(buyer.propertyTypes).join(" ")}`.toLowerCase();

  if (text.includes("creative") || text.includes("seller") || text.includes("subject")) return "creative_finance_buyer";
  if (text.includes("multifamily") || text.includes("duplex")) return "multifamily_buyer";
  if (text.includes("commercial")) return "commercial_buyer";
  if (text.includes("land")) return "land_investor";
  if (text.includes("builder") || text.includes("develop")) return "builder_developer";
  if (text.includes("rental") || text.includes("rent")) return "rental_buyer";
  if (text.includes("rehab") || text.includes("flip") || text.includes("distressed")) return "fix_and_flip_investor";
  if (text.includes("cash")) return "cash_buyer";

  return "unknown";
}

function getBuyerPriceFit(buyer: BuyerInput, exitPrice: number): BuyerMatch["priceFit"] {
  const min = getNumber(buyer, ["priceRangeMin"], 0);
  const max = getNumber(buyer, ["priceRangeMax"], 0);

  if (!exitPrice || (!min && !max)) return "unknown";
  if ((min === 0 || exitPrice >= min) && (max === 0 || exitPrice <= max)) return "strong";
  if ((min === 0 || exitPrice >= min * 0.85) && (max === 0 || exitPrice <= max * 1.15)) return "moderate";

  return "weak";
}

function scoreBuyer(buyer: BuyerInput, input: DispositionBuyerMatchingInput, targetType: BuyerType, exitPrice: number): BuyerMatch {
  const metrics = getMetrics(input);
  const buyerType = inferBuyerType(buyer);
  const buyerLocations = toArray(buyer.preferredLocations ?? buyer.markets ?? buyer.cities);
  const buyerAssetTypes = toArray(buyer.propertyTypes ?? buyer.assetTypes);
  const activities = buyer.recentActivities ?? buyer.activities ?? [];
  const priceFit = getBuyerPriceFit(buyer, exitPrice);
  const typeScore = buyerType === targetType ? 28 : buyerType === "cash_buyer" ? 16 : buyerType === "unknown" ? 8 : 4;
  const marketScore = buyerLocations.length === 0 ? 8 : buyerLocations.some((location) => metrics.cityMarket.includes(location)) ? 18 : 4;
  const assetScore = buyerAssetTypes.length === 0 ? 8 : buyerAssetTypes.some((asset) => metrics.assetType.includes(asset) || asset.includes(metrics.assetType)) ? 16 : 4;
  const priceScore = priceFit === "strong" ? 18 : priceFit === "moderate" ? 10 : priceFit === "unknown" ? 6 : 0;
  const reliabilityBase = getNumber(buyer, ["buyerQualityScore", "matchReadinessScore"], 0);
  const reliabilityScore = reliabilityBase > 0 ? Math.min(18, reliabilityBase / 6) : buyer.tier === "A" ? 16 : buyer.tier === "B" ? 12 : buyer.isActive ? 10 : 4;
  const behaviorScore = Math.min(12, activities.filter((activity) => ["deal_closed", "offer_made", "responded", "replied", "requested_details"].includes(String(activity.eventType))).length * 4);
  const matchScore = clampScore(typeScore + marketScore + assetScore + priceScore + reliabilityScore + behaviorScore);
  const financingText = `${buyer.financingType ?? ""}`.toLowerCase();
  const fundingReliability = reliabilityBase >= 75 || buyer.tier === "A" || financingText.includes("cash") ? "strong" : reliabilityBase >= 50 || buyer.tier === "B" ? "moderate" : reliabilityBase > 0 ? "weak" : "unknown";
  const expectedCloseSpeed = financingText.includes("cash") ? "fast" : financingText.includes("hard") || financingText.includes("private") ? "moderate" : "unknown";

  return {
    buyerId: buyer.id ?? buyer.buyerId,
    buyerName: buyer.name ?? buyer.buyerName,
    buyerType: buyerType === "unknown" ? targetType : buyerType,
    matchScore,
    reason: `Fit based on ${targetType.replaceAll("_", " ")} target, market preference, asset preference, price range, and observed buyer reliability.`,
    risks: unique([
      ...(priceFit === "weak" ? ["Exit price appears outside this buyer's stated range."] : []),
      ...(fundingReliability === "weak" || fundingReliability === "unknown" ? ["Buyer funding reliability needs verification before marketing priority."] : []),
      ...(buyer.isActive === false ? ["Buyer is not currently marked active."] : []),
    ]),
    expectedCloseSpeed,
    priceFit,
    fundingReliability,
  };
}

function getBuyerMatches(input: DispositionBuyerMatchingInput, targetType: BuyerType, exitPrice: number): BuyerMatch[] {
  const buyers = input.existingBuyerList ?? input.buyers ?? [];

  return buyers
    .map((buyer) => scoreBuyer(buyer, input, targetType, exitPrice))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 8);
}

function dealPackageChecklist(path: DispositionPath) {
  return unique([
    "Property address",
    "Current property photos",
    "ARV support and comparable sales notes",
    "Repair estimate and condition notes",
    "Access instructions",
    "Title status",
    "Occupancy status",
    "Asking or exit price",
    "Proof of equitable interest or ownership review",
    "Disclosures and legal/title review where applicable",
    ...(path === "package_portfolio" ? ["Portfolio asset list, shared thesis, and package-level pricing"] : []),
  ]);
}

function requiredVerifications(input: DispositionBuyerMatchingInput, path: DispositionPath) {
  const metrics = getMetrics(input);

  return unique([
    "Verify seller authority, contract status, equitable interest or ownership position, and title path.",
    "Verify title status, liens, taxes, payoff, escrow path, and closing constraints with title company.",
    "Verify ARV support, repair scope, occupancy, access, utilities, zoning, and floodplain details.",
    "Verify buyer funding, closing history, entity details, and proof of funds before any buyer-facing marketing.",
    ...(metrics.buyerDemandScore <= 0 ? ["Verify buyer demand before marketing or setting a buyer priority order."] : []),
    ...(path === "double_close" ? ["Verify double-close mechanics, escrow/title requirements, and funding path before marketing."] : []),
    ...(path === "sell_owned_asset" ? ["Confirm the asset is owned or otherwise legally controlled before treating this as an owned-asset sale."] : []),
    ...(input.fundingApprovalReadiness?.requiredFixes ?? []),
    ...(input.offerRecommendation?.requiredVerifications ?? []),
    ...(input.negotiationRecommendation?.requiredVerifications ?? []),
  ]);
}

function dispositionRisks(input: DispositionBuyerMatchingInput, path: DispositionPath, matches: BuyerMatch[]) {
  const metrics = getMetrics(input);

  return unique([
    ...(path === "pause_review" ? ["Disposition path is paused because required title, funding, or readiness data is unresolved."] : []),
    ...(path === "assign_contract" ? ["Assignment restrictions, disclosure requirements, buyer disclosure, or title-company handling may affect the exit path."] : []),
    ...(path === "double_close" ? ["Double close may require verified transactional funding, title-company coordination, and clean settlement timing."] : []),
    ...(path === "sell_owned_asset" ? ["Owned-asset sale should not be assumed unless ownership or control is verified."] : []),
    ...(metrics.floodplain.includes("yes") || metrics.floodplain.includes("true") ? ["Floodplain signal may reduce buyer pool or lender appetite."] : []),
    ...(metrics.occupancyStatus.includes("occupied") || metrics.occupancyStatus.includes("tenant") ? ["Occupancy can affect access, closing timing, pricing, and buyer pool."] : []),
    ...(buyerDemandSignal(metrics.buyerDemandScore) === "weak" || buyerDemandSignal(metrics.buyerDemandScore) === "unknown" ? ["Buyer demand is weak or unknown."] : []),
    ...(matches.length === 0 ? ["No buyer list found. Showing target buyer profile and deal package checklist only."] : []),
    ...(input.portfolioDecision?.risks ?? []),
    ...(input.capitalStackComparison?.sensitivityAlerts ?? []),
  ]);
}

function stopConditions(input: DispositionBuyerMatchingInput) {
  const metrics = getMetrics(input);

  return unique([
    "Title issue unresolved",
    "Seller contract not compliant or legal/title review required",
    "Buyer funding unverified",
    "Exit price below walk-away",
    "No buyer demand",
    "Legal/title review required",
    ...(metrics.walkAwayPrice > 0 && metrics.askingPrice > metrics.walkAwayPrice ? ["Seller required price remains above walk-away without new verified facts."] : []),
    ...(input.followUpRecommendation?.stopConditions ?? []),
  ]);
}

function marketingAngle(input: DispositionBuyerMatchingInput, buyerType: BuyerType) {
  const metrics = getMetrics(input);

  if (buyerType === "fix_and_flip_investor") return "Distressed OKC value-add opportunity with repair scope, ARV support, and clean exit-price review prepared for human approval.";
  if (buyerType === "rental_buyer") return `Rental-focused opportunity${metrics.rent > 0 ? ` with ${formatMoney(metrics.rent)} monthly rent signal` : ""}, occupancy review, and yield support prepared for human approval.`;
  if (buyerType === "land_investor" || buyerType === "builder_developer") return "Land or development-focused opportunity with acreage, access, utilities, zoning, and floodplain verification prepared for human approval.";
  if (buyerType === "multifamily_buyer") return "Small multifamily or income-property opportunity with rent, NOI, occupancy, and value-add support prepared for human approval.";
  if (buyerType === "creative_finance_buyer") return "Creative-finance buyer profile only. Human legal/title review is required before any structure is discussed or marketed.";
  if (buyerType === "institutional_buyer") return "Scaled or packageable asset profile with repeatable thesis, pricing support, and diligence package prepared for human review.";

  return "Cash-buyer profile with verified price, title, access, condition, and closing-readiness details prepared for human approval.";
}

function confidence(input: DispositionBuyerMatchingInput, matches: BuyerMatch[]) {
  const metrics = getMetrics(input);
  let score = 45;

  if (input.followUpRecommendation) score += 8;
  if (input.negotiationRecommendation) score += 8;
  if (input.offerRecommendation) score += 8;
  if (input.fundingApprovalReadiness) score += 8;
  if (input.portfolioDecision) score += 8;
  if (!hasTitleRisk(metrics.titleStatus)) score += 8;
  if (metrics.buyerDemandScore > 0) score += 5;
  if (matches.length > 0) score += 5;
  if (metrics.assetType) score += 4;
  if (metrics.walkAwayPrice > 0 || metrics.recommendedOffer > 0) score += 4;

  return clampScore(score);
}

export function generateDispositionRecommendation(input: DispositionBuyerMatchingInput): DispositionRecommendation {
  const metrics = getMetrics(input);
  const dispositionPath = chooseDispositionPath(input);
  const targetBuyer = targetBuyerType(input);
  const expectedExitPrice = metrics.walkAwayPrice || metrics.recommendedOffer || metrics.askingPrice || undefined;
  const expectedAssignmentFee = dispositionPath === "assign_contract" && metrics.expectedProfit > 0 ? Math.round(metrics.expectedProfit * 0.35) : undefined;
  const matches = expectedExitPrice ? getBuyerMatches(input, targetBuyer, expectedExitPrice) : getBuyerMatches(input, targetBuyer, 0);
  const warnings = unique([
    ...(needsOklahomaWarning(input) ? [OKLAHOMA_COMPLIANCE_WARNING, "Internal disposition guidance only. This is not legal advice and does not guarantee compliance."] : []),
    ...(!input.followUpRecommendation || !input.offerRecommendation || !input.portfolioDecision || hasTitleRisk(metrics.titleStatus) ? [ASSUMPTION_WARNING] : []),
    ...(input.capitalStackComparison?.complianceWarnings ?? []),
    ...(input.fundingApprovalReadiness?.complianceWarnings ?? []),
  ]);
  const risks = dispositionRisks(input, dispositionPath, matches);
  const verifications = requiredVerifications(input, dispositionPath);

  if (dispositionPath === "do_not_dispose") {
    return {
      dispositionPath,
      targetBuyerType: targetBuyer,
      confidence: confidence(input, matches),
      recommendedBuyerMatches: matches,
      buyerDemandSignal: buyerDemandSignal(metrics.buyerDemandScore),
      dealPackageChecklist: dealPackageChecklist(dispositionPath),
      requiredVerifications: verifications,
      dispositionRisks: risks,
      stopConditions: stopConditions(input),
      complianceWarnings: warnings,
      recommendedNextStep: "Do not market or dispose. Preserve the internal record and require human review before any future disposition work.",
    };
  }

  return {
    dispositionPath,
    targetBuyerType: targetBuyer,
    confidence: confidence(input, matches),
    recommendedBuyerMatches: matches,
    buyerDemandSignal: buyerDemandSignal(metrics.buyerDemandScore),
    expectedAssignmentFee,
    expectedExitPrice,
    recommendedMarketingAngle: marketingAngle(input, targetBuyer),
    dealPackageChecklist: dealPackageChecklist(dispositionPath),
    requiredVerifications: verifications,
    dispositionRisks: risks,
    stopConditions: stopConditions(input),
    complianceWarnings: warnings,
    recommendedNextStep:
      dispositionPath === "pause_review"
        ? "Pause disposition. Complete title, funding, buyer-demand, and legal/title verifications before any buyer-facing marketing is considered."
        : "Prepare the internal deal package for human approval. Do not contact buyers, send messages, launch automation, or generate contracts from this recommendation.",
  };
}
