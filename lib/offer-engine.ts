import type { FundingRecommendation } from "@/types/capital-funding";
import type { FundingSensitivityResult } from "@/types/capital-stack";
import type { FundingApprovalReadiness } from "@/types/funding-approval";
import type { OfferRecommendation, OfferType } from "@/types/offer-engine";
import type { PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type OfferEngineInput = {
  portfolioDecision?: PortfolioDecision | null;
  feasibilityResult?: unknown;
  fundingRecommendation?: FundingRecommendation | null;
  capitalStackComparison?: FundingSensitivityResult | null;
  fundingApprovalReadiness?: FundingApprovalReadiness | null;
  deal?: unknown;
  lead?: unknown;
  strategyDecision?: unknown;
  purchasePrice?: number | null;
  askingPrice?: number | null;
  arv?: number | null;
  repairs?: number | null;
  estimatedRepairs?: number | null;
  rent?: number | null;
  monthlyRent?: number | null;
  noi?: number | null;
  taxes?: number | null;
  insurance?: number | null;
  mortgageBalance?: number | null;
  estimatedProfit?: number | null;
  timelineDays?: number | null;
  riskScore?: number | null;
  uncertaintyScore?: number | null;
  reliabilityScore?: number | null;
  dataCompletenessScore?: number | null;
  buyerDemandScore?: number | null;
  sellerMotivation?: string | null;
  sellerTermsAvailable?: boolean | null;
  assetType?: string | null;
  propertyType?: string | null;
  state?: string | null;
  market?: string | null;
  titleStatus?: string | null;
};

const OKLAHOMA_COMPLIANCE_WARNING =
  "Review Oklahoma wholesaling, disclosure, licensing, assignment, double-close, seller-finance, subject-to, cancellation-right, escrow, contract, and closing requirements with a qualified Oklahoma real estate attorney/title company before presenting or signing any offer.";

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

function getBoolean(source: unknown, paths: string[], fallback = false) {
  const value = getPath(source, paths);

  return typeof value === "boolean" ? value : fallback;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function money(value: number) {
  return Math.max(0, Math.round(value));
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function getMetrics(input: OfferEngineInput) {
  const purchasePrice = getNumber(input, ["purchasePrice", "askingPrice", "deal.purchasePrice", "deal.askingPrice", "lead.askingPrice"], 0);
  const arv = getNumber(input, ["arv", "deal.arv", "lead.arv"], 0);
  const repairs = getNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"], 0);
  const rent = getNumber(input, ["rent", "monthlyRent", "deal.rent", "deal.monthlyRent", "lead.monthlyRent"], 0);
  const taxes = getNumber(input, ["taxes", "deal.taxes", "lead.taxes"], 0);
  const insurance = getNumber(input, ["insurance", "deal.insurance", "lead.insurance"], 0);
  const noi = getNumber(input, ["noi", "deal.noi", "lead.noi"], rent > 0 ? rent * 12 * 0.55 - taxes - insurance : 0);
  const mortgageBalance = getNumber(input, ["mortgageBalance", "deal.mortgageBalance", "lead.mortgageBalance"], 0);
  const timelineDays = input.portfolioDecision?.timelineDays ?? getNumber(input, ["timelineDays"], 90);
  const expectedProfit = input.portfolioDecision?.estimatedReturn?.profit ?? getNumber(input, ["estimatedProfit"], arv > 0 ? arv - purchasePrice - repairs : 0);
  const riskScore = getNumber(input, ["riskScore"], 50);
  const uncertaintyScore = getNumber(input, ["uncertaintyScore"], 50);
  const reliabilityScore = getNumber(input, ["reliabilityScore", "portfolioDecision.confidence"], input.portfolioDecision?.confidence ?? 50);
  const dataCompletenessScore = getNumber(input, ["dataCompletenessScore"], 70);
  const buyerDemandScore = getNumber(input, ["buyerDemandScore"], 50);
  const sellerTermsAvailable = getBoolean(input, ["sellerTermsAvailable"], false);
  const sellerMotivation = getString(input, ["sellerMotivation", "deal.sellerMotivation", "lead.sellerMotivation"], "");
  const assetType = getString(input, ["assetType", "propertyType", "deal.assetType", "lead.propertyType"], "").toLowerCase();
  const stateMarket = `${getString(input, ["state", "deal.state", "lead.state"], "")} ${getString(input, ["market", "deal.market", "lead.market"], "")}`.toLowerCase();
  const titleStatus = getString(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"], "unknown").toLowerCase();
  const strategy = getString(input, ["portfolioDecision.action", "strategyDecision.recommendedStrategy"], input.portfolioDecision?.action ?? "").toLowerCase();
  const primaryFunding = input.fundingRecommendation?.primaryMethod ?? "";
  const approvalStatus = input.fundingApprovalReadiness?.status;

  return {
    purchasePrice,
    arv,
    repairs,
    rent,
    noi,
    taxes,
    insurance,
    mortgageBalance,
    timelineDays,
    expectedProfit,
    riskScore,
    uncertaintyScore,
    reliabilityScore,
    dataCompletenessScore,
    buyerDemandScore,
    sellerTermsAvailable,
    sellerMotivation,
    assetType,
    stateMarket,
    titleStatus,
    strategy,
    primaryFunding,
    approvalStatus,
    timelineRisk: input.portfolioDecision?.timelineRisk,
  };
}

function determineOfferType(input: OfferEngineInput): OfferType {
  const metrics = getMetrics(input);

  if (metrics.approvalStatus === "rejected") return "pass_no_offer";
  if (metrics.assetType.includes("land") || metrics.strategy.includes("land")) return "land_offer";
  if (metrics.primaryFunding === "subject_to" || metrics.strategy.includes("subject")) return "subject_to_offer";
  if (metrics.primaryFunding === "seller_finance" || metrics.strategy.includes("seller_finance") || metrics.strategy.includes("creative")) return "seller_finance_offer";
  if (metrics.primaryFunding === "partnership" || metrics.strategy.includes("partnership")) return "partnership_offer";
  if (metrics.strategy.includes("hold") || metrics.strategy.includes("rental")) return "rental_hold_offer";
  if (metrics.strategy.includes("flip")) return "flip_offer";
  if (metrics.strategy.includes("wholesale") || metrics.primaryFunding === "transactional_funding" || metrics.primaryFunding === "buyer_funded_double_close") return "wholesale_offer";
  if (metrics.strategy.includes("pass")) return "pass_no_offer";

  return "cash_offer";
}

function getMissingData(input: OfferEngineInput, offerType: OfferType) {
  const missing: string[] = [];

  if (getOptionalNumber(input, ["arv", "deal.arv", "lead.arv"]) === null && offerType !== "seller_finance_offer" && offerType !== "subject_to_offer") missing.push("ARV");
  if (getOptionalNumber(input, ["purchasePrice", "askingPrice", "deal.purchasePrice", "deal.askingPrice", "lead.askingPrice"]) === null) missing.push("asking price");
  if (getOptionalNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"]) === null && offerType !== "subject_to_offer") missing.push("repair estimate");
  if (getOptionalNumber(input, ["timelineDays", "portfolioDecision.timelineDays"]) === null && offerType !== "rental_hold_offer") missing.push("timeline");
  if (!input.portfolioDecision && !getPath(input, ["strategyDecision.recommendedStrategy"])) missing.push("strategy");
  if (!input.fundingApprovalReadiness) missing.push("funding readiness details");
  if (offerType === "rental_hold_offer" && getOptionalNumber(input, ["rent", "monthlyRent", "deal.rent", "deal.monthlyRent", "lead.monthlyRent"]) === null && getOptionalNumber(input, ["noi", "deal.noi", "lead.noi"]) === null) missing.push("rent or NOI");
  if (offerType === "subject_to_offer" && getOptionalNumber(input, ["mortgageBalance", "deal.mortgageBalance", "lead.mortgageBalance"]) === null) missing.push("mortgage balance");

  return unique(missing);
}

function getRiskAdjustmentPercent(input: OfferEngineInput) {
  const metrics = getMetrics(input);
  let adjustment = 0;
  const riskAdjustments: string[] = [];

  if (metrics.dataCompletenessScore < 60) {
    adjustment += 0.04;
    riskAdjustments.push("Reduced for low data completeness.");
  }
  if (metrics.riskScore >= 70) {
    adjustment += 0.04;
    riskAdjustments.push("Reduced for high risk score.");
  }
  if (metrics.uncertaintyScore >= 65) {
    adjustment += 0.04;
    riskAdjustments.push("Reduced for high uncertainty.");
  }
  if (metrics.titleStatus === "unknown" || metrics.titleStatus === "missing") {
    adjustment += 0.03;
    riskAdjustments.push("Reduced because title status is unknown.");
  }
  if (getOptionalNumber(input, ["repairs", "estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"]) === null) {
    adjustment += 0.03;
    riskAdjustments.push("Reduced because repair estimate is missing.");
  }
  if (metrics.timelineRisk === "high" || metrics.timelineDays > 180) {
    adjustment += 0.03;
    riskAdjustments.push("Reduced for timeline risk.");
  }
  if (metrics.approvalStatus === "review_required") {
    adjustment += 0.05;
    riskAdjustments.push("Reduced because funding approval readiness requires review.");
  }
  if (metrics.approvalStatus === "approved_with_conditions") {
    adjustment += 0.02;
    riskAdjustments.push("Reduced because funding approval readiness has conditions.");
  }

  return { adjustment: Math.min(adjustment, 0.25), riskAdjustments };
}

function needsComplianceWarning(input: OfferEngineInput, offerType: OfferType) {
  const metrics = getMetrics(input);
  const transactionText = `${offerType} ${metrics.strategy} ${metrics.primaryFunding}`.toLowerCase();

  return (
    metrics.stateMarket.trim() === "" ||
    metrics.stateMarket.includes("ok") ||
    metrics.stateMarket.includes("oklahoma") ||
    transactionText.includes("wholesale") ||
    transactionText.includes("assignment") ||
    transactionText.includes("double") ||
    transactionText.includes("seller_finance") ||
    transactionText.includes("subject_to") ||
    transactionText.includes("contract")
  );
}

function getOfferStrength(confidence: number, marginOfSafety: number) {
  if (confidence >= 75 && marginOfSafety >= 15) return "strong";
  if (confidence >= 55 && marginOfSafety >= 7) return "moderate";
  return "weak";
}

function commonRequiredVerifications(input: OfferEngineInput) {
  const metrics = getMetrics(input);
  const required = [
    "Verify ARV with current comparable sales.",
    "Verify repair scope and repair budget.",
    "Verify title, ownership, liens, and closing constraints.",
    "Verify funding readiness before presenting any offer.",
  ];

  if (metrics.titleStatus === "unknown" || metrics.titleStatus === "missing") required.push("Resolve unknown title status.");
  if (metrics.sellerMotivation) required.push("Verify seller motivation directly before relying on it.");

  return required;
}

function buildNumericOffer(input: OfferEngineInput, offerType: OfferType): OfferRecommendation {
  const metrics = getMetrics(input);
  const { adjustment, riskAdjustments } = getRiskAdjustmentPercent(input);
  const desiredAssignmentFee = Math.max(10000, metrics.arv * 0.03);
  const desiredFlipProfit = Math.max(25000, metrics.arv * 0.12);
  const financingCost = metrics.timelineDays > 0 ? Math.round((metrics.arv * 0.65 * 0.12 / 365) * metrics.timelineDays) : 0;
  const holdingCost = metrics.timelineDays > 0 ? Math.round(1250 * Math.max(1, Math.ceil(metrics.timelineDays / 30))) : 0;
  let maxAllowableOffer = 0;
  const rationale: string[] = [];
  const terms: string[] = [];
  const requiredVerifications = commonRequiredVerifications(input);

  if (offerType === "wholesale_offer") {
    maxAllowableOffer = metrics.arv * 0.7 - metrics.repairs - desiredAssignmentFee;
    rationale.push("Wholesale MAO uses conservative ARV x 70% minus repairs and desired assignment spread.");
    terms.push("Internal assignment or double-close analysis only; no offer is sent from this system.");
    if (metrics.buyerDemandScore < 55) riskAdjustments.push("Reduced because buyer demand is not strong enough for aggressive wholesale pricing.");
  } else if (offerType === "flip_offer" || offerType === "cash_offer") {
    maxAllowableOffer = metrics.arv * 0.7 - metrics.repairs - desiredFlipProfit - financingCost - holdingCost;
    rationale.push("Flip MAO uses ARV, repairs, financing cost, holding cost, and desired profit.");
    terms.push("Cash or short-close structure may fit if funding readiness and title are verified.");
  } else if (offerType === "land_offer") {
    maxAllowableOffer = metrics.arv > 0 ? metrics.arv * 0.45 : metrics.purchasePrice * 0.65;
    rationale.push("Land offer uses conservative discount logic because zoning, access, utilities, floodplain, survey, and comparable sales can materially change value.");
    requiredVerifications.push("Verify zoning, access, utilities, floodplain, survey, and comparable land sales.");
  } else {
    maxAllowableOffer = metrics.arv * 0.68 - metrics.repairs - desiredFlipProfit;
    rationale.push("Default cash-style offer uses conservative ARV, repairs, and desired profit.");
  }

  const adjustedMax = money(maxAllowableOffer * (1 - adjustment));
  const negotiationRoom = money(Math.max(2500, adjustedMax * 0.04));
  const recommendedOffer = money(adjustedMax - negotiationRoom);
  const openingOffer = money(recommendedOffer - Math.max(1500, negotiationRoom * 0.5));
  const walkAwayPrice = adjustedMax;
  const expectedProfit = money((metrics.arv || metrics.purchasePrice) - walkAwayPrice - metrics.repairs - financingCost - holdingCost);
  const marginOfSafety = metrics.arv > 0 ? clampScore(((metrics.arv - walkAwayPrice - metrics.repairs) / metrics.arv) * 100) : 0;
  const confidence = clampScore(metrics.reliabilityScore * 0.45 + metrics.dataCompletenessScore * 0.35 + (100 - metrics.uncertaintyScore) * 0.2 - adjustment * 80);

  return {
    offerType,
    recommendedOffer,
    maxAllowableOffer: adjustedMax,
    walkAwayPrice,
    openingOffer,
    confidence,
    offerStrength: getOfferStrength(confidence, marginOfSafety),
    negotiationRoom,
    expectedProfit,
    marginOfSafety,
    terms,
    rationale,
    riskAdjustments,
    requiredVerifications,
  };
}

function buildRentalOffer(input: OfferEngineInput): OfferRecommendation {
  const metrics = getMetrics(input);
  const { adjustment, riskAdjustments } = getRiskAdjustmentPercent(input);
  const targetCapRate = 0.085;
  const valueFromNoi = metrics.noi > 0 ? metrics.noi / targetCapRate : 0;
  const maxAllowableOffer = money((valueFromNoi || metrics.purchasePrice * 0.85) * (1 - adjustment));
  const negotiationRoom = money(Math.max(2500, maxAllowableOffer * 0.04));
  const recommendedOffer = money(maxAllowableOffer - negotiationRoom);
  const confidence = clampScore(metrics.reliabilityScore * 0.4 + metrics.dataCompletenessScore * 0.35 + (metrics.noi > 0 || metrics.rent > 0 ? 20 : 0) - adjustment * 75);
  const marginOfSafety = metrics.purchasePrice > 0 ? clampScore(((metrics.purchasePrice - recommendedOffer) / metrics.purchasePrice) * 100) : 0;

  return {
    offerType: "rental_hold_offer",
    recommendedOffer,
    maxAllowableOffer,
    walkAwayPrice: maxAllowableOffer,
    openingOffer: money(recommendedOffer - Math.max(1500, negotiationRoom * 0.5)),
    confidence,
    offerStrength: getOfferStrength(confidence, marginOfSafety),
    negotiationRoom,
    expectedProfit: metrics.noi > 0 ? money(metrics.noi) : undefined,
    marginOfSafety,
    terms: ["Evaluate cashflow, reserve requirements, financing terms, vacancy, taxes, insurance, and property management before presenting any offer."],
    rationale: ["Rental hold offer uses NOI and a conservative target cap-rate style value when rent or NOI is available."],
    riskAdjustments,
    requiredVerifications: unique([...commonRequiredVerifications(input), "Verify rent, vacancy, taxes, insurance, repairs, and management assumptions."]),
  };
}

function buildCreativeOffer(input: OfferEngineInput, offerType: "seller_finance_offer" | "subject_to_offer" | "partnership_offer"): OfferRecommendation {
  const metrics = getMetrics(input);
  const { adjustment, riskAdjustments } = getRiskAdjustmentPercent(input);
  const baseValue = metrics.arv > 0 ? metrics.arv * 0.82 : metrics.purchasePrice * 0.9;
  const maxAllowableOffer = money(baseValue * (1 - adjustment));
  const downPayment = money(maxAllowableOffer * (offerType === "subject_to_offer" ? 0.03 : 0.08));
  const confidencePenalty = metrics.sellerTermsAvailable ? 0 : 20;
  const confidence = clampScore(metrics.reliabilityScore * 0.45 + metrics.dataCompletenessScore * 0.35 + (100 - metrics.uncertaintyScore) * 0.2 - confidencePenalty - adjustment * 70);
  const requiredVerifications = commonRequiredVerifications(input);
  const terms: string[] = [];
  const rationale: string[] = [];

  if (offerType === "seller_finance_offer") {
    terms.push(`Target down payment around ${downPayment}.`);
    terms.push("Target payment should stay below conservative rent/cashflow or resale carrying capacity.");
    terms.push("Consider 36 to 60 month review or refinance target only after attorney/title review.");
    rationale.push("Seller finance guidance prioritizes low cash exposure and payment safety when seller terms are real.");
    if (!metrics.sellerTermsAvailable) riskAdjustments.push("Seller terms are not verified, so confidence is reduced.");
  }

  if (offerType === "subject_to_offer") {
    terms.push(`Target upfront cash around ${downPayment}, subject to verified loan, arrears, escrow, insurance, and closing facts.`);
    terms.push("Monthly payment target must be verified against existing loan payment and holding budget.");
    rationale.push("Subject-to guidance is only high-level internal analysis and requires loan and due-on-sale risk review.");
    requiredVerifications.push("Verify loan balance, arrears, payment, due-on-sale risk, insurance, escrow, and seller consent.");
    if (metrics.mortgageBalance <= 0) riskAdjustments.push("Mortgage balance is missing or unverified.");
  }

  if (offerType === "partnership_offer") {
    terms.push("Consider high-level profit-share structure only after attorney review; do not generate an agreement here.");
    terms.push("Define capital contribution, control, exit, reserve, and loss-sharing terms with counsel.");
    rationale.push("Partnership guidance is structure-level only and does not create a legal agreement.");
    requiredVerifications.push("Verify partner capital, authority, roles, reserves, profit share, and exit rights with counsel.");
  }

  return {
    offerType,
    recommendedOffer: maxAllowableOffer,
    maxAllowableOffer,
    walkAwayPrice: maxAllowableOffer,
    openingOffer: money(maxAllowableOffer * 0.96),
    confidence,
    offerStrength: getOfferStrength(confidence, metrics.arv > 0 ? clampScore(((metrics.arv - maxAllowableOffer) / metrics.arv) * 100) : 8),
    negotiationRoom: money(maxAllowableOffer * 0.04),
    expectedProfit: metrics.expectedProfit > 0 ? money(metrics.expectedProfit) : undefined,
    marginOfSafety: metrics.arv > 0 ? clampScore(((metrics.arv - maxAllowableOffer) / metrics.arv) * 100) : undefined,
    terms,
    rationale,
    riskAdjustments,
    requiredVerifications: unique(requiredVerifications),
  };
}

function buildPassOffer(input: OfferEngineInput): OfferRecommendation {
  const missingData = getMissingData(input, "pass_no_offer");
  const approval = input.fundingApprovalReadiness;

  return {
    offerType: "pass_no_offer",
    confidence: clampScore((approval?.readinessScore ?? 40) * 0.8),
    offerStrength: "weak",
    terms: ["No offer should be prepared from this read-only engine until blockers are resolved."],
    rationale: [
      approval?.status === "rejected" ? "Funding approval readiness is rejected." : "Deal does not currently clear internal offer-readiness thresholds.",
      "This engine does not generate legal contracts or send offers.",
    ],
    riskAdjustments: approval?.violatedGuardrails?.map((guardrail) => `${guardrail.name}: ${guardrail.message}`),
    requiredVerifications: unique([...(approval?.requiredFixes ?? []), "Re-run funding approval readiness after fixes are complete."]),
    missingData,
    recommendedNextStep: "Do not present an offer. Fix guardrails, missing data, and verification issues before reconsidering.",
  };
}

function usesDefaultAssumptions(input: OfferEngineInput) {
  return (
    getOptionalNumber(input, ["riskScore"]) === null ||
    getOptionalNumber(input, ["uncertaintyScore"]) === null ||
    getOptionalNumber(input, ["reliabilityScore", "portfolioDecision.confidence"]) === null ||
    getOptionalNumber(input, ["dataCompletenessScore"]) === null ||
    getPath(input, ["titleStatus", "deal.titleStatus", "lead.titleStatus"]) === null
  );
}

export function generateOfferRecommendation(input: OfferEngineInput): OfferRecommendation {
  const offerType = determineOfferType(input);
  let recommendation: OfferRecommendation;

  if (offerType === "pass_no_offer") {
    recommendation = buildPassOffer(input);
  } else if (offerType === "rental_hold_offer") {
    recommendation = buildRentalOffer(input);
  } else if (offerType === "seller_finance_offer" || offerType === "subject_to_offer" || offerType === "partnership_offer") {
    recommendation = buildCreativeOffer(input, offerType);
  } else {
    recommendation = buildNumericOffer(input, offerType);
  }

  const missingData = getMissingData(input, recommendation.offerType);
  const complianceWarnings = needsComplianceWarning(input, recommendation.offerType)
    ? [OKLAHOMA_COMPLIANCE_WARNING, "This is internal offer guidance only and is not legal advice or a guarantee of compliance."]
    : [];
  const riskAdjustments = unique([
    ...(recommendation.riskAdjustments ?? []),
    ...(usesDefaultAssumptions(input) ? ["Some offer values use default assumptions and require human verification."] : []),
  ]);
  const requiredVerifications = unique([
    ...(recommendation.requiredVerifications ?? []),
    ...(input.fundingApprovalReadiness?.fundingConditions ?? []),
  ]);

  if (missingData.length >= 5 && recommendation.offerType !== "pass_no_offer") {
    return {
      offerType: "pass_no_offer",
      confidence: 20,
      offerStrength: "weak",
      terms: ["No offer should be prepared until the missing inputs are added."],
      rationale: ["Offer recommendation unavailable. Add ARV, repairs, asking price, timeline, strategy, and funding readiness details."],
      riskAdjustments,
      requiredVerifications,
      missingData,
      complianceWarnings,
      recommendedNextStep: "Add missing offer inputs and rerun the read-only offer engine.",
    };
  }

  return {
    ...recommendation,
    missingData,
    riskAdjustments,
    requiredVerifications,
    complianceWarnings,
    recommendedNextStep:
      recommendation.recommendedNextStep ??
      "Use this only as internal offer guidance. Verify all assumptions with a qualified human operator before presenting or signing any offer.",
  };
}
