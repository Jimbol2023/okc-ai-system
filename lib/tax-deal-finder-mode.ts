import { getAcquisitionZoneAssessment } from "@/lib/acquisition-zone-intelligence";
import { getBuyerDemandProfile } from "@/lib/buyer-demand-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getMarketTargetingAssessment } from "@/lib/market-intelligence-agent";

export type TaxOpportunityGrade = "A+" | "A" | "B" | "C" | "D";

export type TaxDealMode =
  | "tax_delinquency_watch"
  | "tax_lien_candidate"
  | "tax_deed_candidate"
  | "county_auction_candidate"
  | "pre_auction_review"
  | "not_tax_focused";

export type TaxAcquisitionPriority = "elite" | "high" | "medium" | "low" | "avoid";

export type TaxReadinessLevel =
  | "not_ready"
  | "research_only"
  | "watchlist"
  | "review_ready";

export type TaxSignals = {
  delinquencyPressure: number;
  auctionReadiness: number;
  equityPotential: number;
  vacancyDistress: number;
  countyOpportunity: number;
  investorCompetitionRisk: number;
};

export type TaxDealFinderAssessmentInput = {
  location?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  assetType?: string;
  strategy?: string;
  assessedValue?: number;
  estimatedValue?: number;
  askingPrice?: number;
  arv?: number;
  taxBalance?: number;
  yearsDelinquent?: number;
  auctionDateKnown?: boolean;
  ownerOccupied?: boolean;
  vacant?: boolean;
  foreclosureRate?: number;
  distressRate?: number;
  vacancyRate?: number;
  investorActivity?: number;
  buyerDemandProfile?: unknown;
  countyAlphaProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
  marketTargetingProfile?: unknown;
  acquisitionZoneProfile?: unknown;
};

export type TaxDealFinderAssessment = {
  taxOpportunityScore: number;
  taxOpportunityGrade: TaxOpportunityGrade;
  taxDealMode: TaxDealMode;
  acquisitionPriority: TaxAcquisitionPriority;
  legalReviewRequired: boolean;
  humanReviewRequired: boolean;
  readinessLevel: TaxReadinessLevel;
  taxSignals: TaxSignals;
  opportunitySignals: string[];
  warningSignals: string[];
  riskFlags: string[];
  recommendedResearchSteps: string[];
  recommendedLeadSources: string[];
  recommendedSellerProfiles: string[];
  recommendedBuyerProfiles: string[];
  confidenceScore: number;
  requiredMissingData: string[];
  intelligenceInputsUsed: string[];
  reasoning: string;
  complianceNotice: string;
};

type JsonRecord = Record<string, unknown>;
type TaxContext = ReturnType<typeof getTaxContext>;

const TAX_COMPLIANCE_NOTICE =
  "This is internal read-only tax opportunity research, not legal, tax, title, or investment advice. Verify all county/state tax lien, tax deed, redemption, notice, owner-occupancy, auction, title, escrow, disclosure, marketing, and closing requirements with a qualified local real estate attorney, tax professional, and title company before any contact, bidding, marketing, signing, assignment, purchase, or closing activity.";

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

  return Number.isFinite(parsed) ? parsed : undefined;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : fallback;
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
}

function normalize(value?: string) {
  return value?.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_") ?? "";
}

function hasNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function average(values: number[]) {
  if (values.length === 0) return 0;

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function rateToPressure(value: number | undefined, multiplier: number, baseline: number) {
  if (!hasNumber(value)) return 48;

  return clampScore(baseline + value * multiplier);
}

function scaleSignal(value: number | undefined, fallback: number) {
  if (!hasNumber(value)) return fallback;

  return clampScore(value <= 10 ? value * 10 : value);
}

function riskLevelToScore(level: string) {
  const normalizedLevel = normalize(level);

  if (normalizedLevel === "high" || normalizedLevel === "critical" || normalizedLevel === "avoid") return 78;
  if (normalizedLevel === "low" || normalizedLevel === "ready") return 24;

  return 50;
}

function getRequiredMissingData(input: TaxDealFinderAssessmentInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.zipCode && !input.neighborhood ? ["ZIP code or neighborhood"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!hasNumber(input.taxBalance) ? ["tax balance"] : []),
    ...(!hasNumber(input.yearsDelinquent) ? ["years delinquent"] : []),
    ...(!hasNumber(input.assessedValue) ? ["assessed value"] : []),
    ...(!hasNumber(input.estimatedValue) && !hasNumber(input.arv) ? ["estimated value or ARV"] : []),
    ...(typeof input.auctionDateKnown !== "boolean" ? ["auction date known flag"] : []),
    ...(typeof input.ownerOccupied !== "boolean" ? ["owner occupancy flag"] : []),
    ...(typeof input.vacant !== "boolean" ? ["vacancy flag"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.vacancyRate) ? ["vacancy rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
  ]);
}

function getProfiles(input: TaxDealFinderAssessmentInput) {
  const buyerDemandProfile = input.buyerDemandProfile ?? getBuyerDemandProfile({
    location: input.location,
    assetType: input.assetType,
  });
  const countyAlphaProfile = input.countyAlphaProfile ?? getCountyAlphaProfile({
    county: input.county,
    state: input.state,
    assetType: input.assetType,
  });
  const marketTargetingProfile = input.marketTargetingProfile ?? getMarketTargetingAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: input.assetType,
    strategy: input.strategy,
    medianPrice: input.estimatedValue ?? input.assessedValue,
    medianRent: undefined,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    buyerDemandProfile,
    countyAlphaProfile,
    pricingProfile: input.pricingProfile,
    riskProfile: input.riskProfile,
  });
  const acquisitionZoneProfile = input.acquisitionZoneProfile ?? getAcquisitionZoneAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    zipCode: input.zipCode,
    neighborhood: input.neighborhood,
    assetType: input.assetType,
    strategy: input.strategy,
    medianPrice: input.estimatedValue ?? input.assessedValue,
    medianRent: undefined,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    vacancyRate: input.vacancyRate,
    investorActivity: input.investorActivity,
    buyerDemandProfile,
    countyAlphaProfile,
    pricingProfile: input.pricingProfile,
    riskProfile: input.riskProfile,
    marketTargetingProfile,
  });

  return {
    buyerDemandProfile,
    countyAlphaProfile,
    marketTargetingProfile,
    acquisitionZoneProfile,
  };
}

function getRiskScore(input: TaxDealFinderAssessmentInput, acquisitionZoneProfile: unknown) {
  const directRisk = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return clampScore(directRisk);

  const readinessRisk = riskLevelToScore(getString(input.riskProfile, ["riskReadiness", "readinessLevel"], "medium"));
  const zoneWarnings = stringArray(getPath(acquisitionZoneProfile, ["warningSignals"])).length;
  const zoneMode = normalize(getString(acquisitionZoneProfile, ["recommendedAcquisitionMode"], ""));
  const zoneRisk = zoneMode === "avoid" ? 78 : zoneMode === "monitor_only" ? 58 : zoneMode === "opportunistic" ? 48 : 36;

  return clampScore(readinessRisk * 0.36 + zoneRisk * 0.34 + zoneWarnings * 8);
}

function getTaxContext(input: TaxDealFinderAssessmentInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const value = input.estimatedValue ?? input.arv ?? input.assessedValue ?? 0;
  const assessedValue = input.assessedValue ?? 0;
  const taxBalance = input.taxBalance ?? 0;
  const yearsDelinquent = input.yearsDelinquent ?? 0;
  const taxToValueRatio = value > 0 ? taxBalance / value : 0;
  const taxToAssessedRatio = assessedValue > 0 ? taxBalance / assessedValue : taxToValueRatio;
  const askingPrice = input.askingPrice ?? 0;
  const equityBasis = askingPrice > 0 ? askingPrice : taxBalance;
  const equitySpread = value > 0 ? value - equityBasis : 0;
  const equitySpreadRatio = value > 0 ? equitySpread / value : 0;
  const buyerDemandScore = getNumber(profiles.buyerDemandProfile, ["demandScore"], 55);
  const buyerConfidence = getNumber(profiles.buyerDemandProfile, ["confidenceScore"], 0.55);
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = getNumber(profiles.countyAlphaProfile, ["confidenceScore"], 0.55);
  const countyDistressLevel = getNumber(profiles.countyAlphaProfile, ["distressLevel"], 55);
  const countyOpportunityLevel = normalize(getString(profiles.countyAlphaProfile, ["opportunityLevel"], "medium"));
  const countyAcquisitionDifficulty = getNumber(profiles.countyAlphaProfile, ["acquisitionDifficulty"], 55);
  const marketAcquisitionScore = getNumber(profiles.marketTargetingProfile, ["acquisitionScore"], 55);
  const marketConfidence = getNumber(profiles.marketTargetingProfile, ["confidenceScore"], 0.58);
  const marketDistress = asRecord(getPath(profiles.marketTargetingProfile, ["distressIndicators"]));
  const zoneScore = getNumber(profiles.acquisitionZoneProfile, ["zoneScore"], 55);
  const zoneConfidence = getNumber(profiles.acquisitionZoneProfile, ["confidenceScore"], 0.58);
  const corridorSignals = asRecord(getPath(profiles.acquisitionZoneProfile, ["corridorSignals"]));
  const zoneMode = normalize(getString(profiles.acquisitionZoneProfile, ["recommendedAcquisitionMode"], "opportunistic"));
  const foreclosurePressure = getNumber(marketDistress, ["foreclosurePressure"], rateToPressure(input.foreclosureRate, 18, 12));
  const distressPressure = getNumber(marketDistress, ["distressPressure"], rateToPressure(input.distressRate, 11, 10));
  const vacancyPressure = rateToPressure(input.vacancyRate, 6, 18);
  const investorActivityScore = scaleSignal(input.investorActivity, 55);
  const zoneInvestorSaturation = getNumber(corridorSignals, ["investorSaturation"], investorActivityScore);
  const zoneDistressCorridor = getNumber(corridorSignals, ["distressCorridor"], average([foreclosurePressure, distressPressure, countyDistressLevel]));
  const pricingConfidence = clamp(getNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"], marketConfidence), 0, 1);
  const riskScore = getRiskScore(input, profiles.acquisitionZoneProfile);
  const riskQuality = 100 - riskScore;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 6);
  const countyRulesUncertain = !input.county || !input.state;
  const taxDataMissing = !hasNumber(input.taxBalance) || !hasNumber(input.yearsDelinquent);

  return {
    ...profiles,
    requiredMissingData,
    value,
    assessedValue,
    taxBalance,
    yearsDelinquent,
    taxToValueRatio,
    taxToAssessedRatio,
    askingPrice,
    equitySpread,
    equitySpreadRatio,
    buyerDemandScore,
    buyerConfidence,
    countyAlphaScore,
    countyConfidence,
    countyDistressLevel,
    countyOpportunityLevel,
    countyAcquisitionDifficulty,
    marketAcquisitionScore,
    marketConfidence,
    zoneScore,
    zoneConfidence,
    zoneMode,
    foreclosurePressure,
    distressPressure,
    vacancyPressure,
    investorActivityScore,
    zoneInvestorSaturation,
    zoneDistressCorridor,
    pricingConfidence,
    riskScore,
    riskQuality,
    dataCompletenessScore,
    countyRulesUncertain,
    taxDataMissing,
  };
}

function getTaxSignals(input: TaxDealFinderAssessmentInput, context: TaxContext): TaxSignals {
  const delinquencyPressure = clampScore(
    Math.min(context.yearsDelinquent, 5) * 13 +
    Math.min(context.taxToValueRatio * 520, 34) +
    Math.min(context.taxToAssessedRatio * 420, 28) +
    context.distressPressure * 0.18 +
    context.foreclosurePressure * 0.12,
  );
  const auctionReadiness = clampScore(
    (input.auctionDateKnown ? 38 : 8) +
    Math.min(context.yearsDelinquent, 5) * 9 +
    (context.taxBalance > 0 ? 14 : 0) +
    context.foreclosurePressure * 0.12 +
    context.dataCompletenessScore * 0.1,
  );
  const equityPotential = clampScore(
    context.equitySpreadRatio * 125 +
    (context.value > 0 ? 16 : 0) +
    (context.taxBalance > 0 ? 10 : 0) -
    Math.max(0, context.taxToValueRatio - 0.12) * 120,
  );
  const vacancyDistress = clampScore(
    (input.vacant ? 32 : 0) +
    (input.ownerOccupied ? -18 : 8) +
    context.vacancyPressure * 0.24 +
    context.distressPressure * 0.24 +
    context.foreclosurePressure * 0.14,
  );
  const countyOpportunity = clampScore(
    context.countyAlphaScore * 0.24 +
    context.zoneScore * 0.22 +
    context.marketAcquisitionScore * 0.16 +
    context.zoneDistressCorridor * 0.16 +
    context.countyDistressLevel * 0.12 +
    context.buyerDemandScore * 0.1,
  );
  const investorCompetitionRisk = clampScore(
    context.investorActivityScore * 0.34 +
    context.zoneInvestorSaturation * 0.34 +
    context.countyAcquisitionDifficulty * 0.16 +
    (100 - context.pricingConfidence * 100) * 0.08 +
    (input.auctionDateKnown ? 8 : 0),
  );

  return {
    delinquencyPressure,
    auctionReadiness,
    equityPotential,
    vacancyDistress,
    countyOpportunity,
    investorCompetitionRisk,
  };
}

function calculateTaxOpportunityScore(context: TaxContext, taxSignals: TaxSignals, input: TaxDealFinderAssessmentInput) {
  const ownerOccupiedPenalty = input.ownerOccupied ? 8 : 0;
  const auctionRiskPenalty = input.auctionDateKnown && context.riskScore >= 62 ? 6 : 0;
  const competitionPenalty = taxSignals.investorCompetitionRisk >= 75 ? 8 : taxSignals.investorCompetitionRisk >= 65 ? 4 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 3) * 1.8;

  return clampScore(
    taxSignals.delinquencyPressure * 0.2 +
    taxSignals.equityPotential * 0.22 +
    taxSignals.countyOpportunity * 0.18 +
    taxSignals.vacancyDistress * 0.12 +
    taxSignals.auctionReadiness * 0.12 +
    context.riskQuality * 0.08 +
    context.pricingConfidence * 100 * 0.05 +
    context.buyerDemandScore * 0.03 -
    ownerOccupiedPenalty -
    auctionRiskPenalty -
    competitionPenalty -
    missingPenalty,
  );
}

function getTaxOpportunityGrade(score: number): TaxOpportunityGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getTaxDealMode(score: number, taxSignals: TaxSignals, context: TaxContext, input: TaxDealFinderAssessmentInput): TaxDealMode {
  if (score < 38 || context.riskScore >= 82) return "not_tax_focused";
  if (input.auctionDateKnown && taxSignals.auctionReadiness >= 72 && taxSignals.equityPotential >= 58 && context.riskScore < 64) return "county_auction_candidate";
  if (input.auctionDateKnown && taxSignals.auctionReadiness >= 56) return "pre_auction_review";
  if (context.yearsDelinquent >= 3 && taxSignals.equityPotential >= 55 && taxSignals.delinquencyPressure >= 58) return "tax_deed_candidate";
  if (context.yearsDelinquent >= 1 && context.taxBalance > 0 && taxSignals.equityPotential >= 45) return "tax_lien_candidate";
  if (taxSignals.delinquencyPressure >= 42 || context.taxDataMissing) return "tax_delinquency_watch";

  return "not_tax_focused";
}

function getPriority(score: number, mode: TaxDealMode, taxSignals: TaxSignals, context: TaxContext): TaxAcquisitionPriority {
  if (mode === "not_tax_focused" || context.riskScore >= 82 || score < 35) return "avoid";
  if (score >= 84 && taxSignals.equityPotential >= 72 && context.riskScore < 48) return "elite";
  if (score >= 70 && context.riskScore < 62) return "high";
  if (score >= 52) return "medium";

  return "low";
}

function getReadinessLevel(mode: TaxDealMode, context: TaxContext, input: TaxDealFinderAssessmentInput, legalReviewRequired: boolean): TaxReadinessLevel {
  if (mode === "not_tax_focused" || context.riskScore >= 82) return "not_ready";
  if (context.requiredMissingData.length >= 6 || context.taxDataMissing || context.countyRulesUncertain) return "research_only";
  if (legalReviewRequired || input.ownerOccupied || input.auctionDateKnown || context.riskScore >= 58) return "watchlist";

  return "review_ready";
}

function getOpportunitySignals(mode: TaxDealMode, taxSignals: TaxSignals, context: TaxContext, input: TaxDealFinderAssessmentInput) {
  return unique([
    ...(taxSignals.delinquencyPressure >= 60 ? ["Tax delinquency pressure is strong enough for internal watchlist research."] : []),
    ...(taxSignals.equityPotential >= 65 ? ["Equity potential appears strong relative to tax balance and estimated value."] : []),
    ...(taxSignals.countyOpportunity >= 65 ? ["County and zone intelligence support tax-opportunity research."] : []),
    ...(taxSignals.vacancyDistress >= 60 ? ["Vacancy and distress signals may support future tax-related acquisition review."] : []),
    ...(taxSignals.auctionReadiness >= 65 ? ["Known auction or delinquency maturity supports county-auction readiness research."] : []),
    ...(mode === "tax_lien_candidate" ? ["Informational tax lien candidate classification is active for future tax lien intelligence."] : []),
    ...(mode === "tax_deed_candidate" ? ["Informational tax deed candidate classification is active for future tax deed intelligence."] : []),
    ...(mode === "county_auction_candidate" ? ["County auction candidate classification is active for future auction intelligence."] : []),
    ...(input.vacant && !input.ownerOccupied ? ["Vacant non-owner-occupied signal improves investor-safe review posture."] : []),
  ]);
}

function getWarningSignals(taxSignals: TaxSignals, context: TaxContext, input: TaxDealFinderAssessmentInput, legalReviewRequired: boolean) {
  return unique([
    ...(legalReviewRequired ? ["Legal and title review is required before any tax-related action."] : []),
    ...(input.ownerOccupied ? ["Owner-occupied property increases compliance and consumer-protection caution."] : []),
    ...(input.auctionDateKnown ? ["Known auction date increases urgency and legal/title risk."] : []),
    ...(context.countyRulesUncertain ? ["County/state rule uncertainty prevents readiness beyond research-only."] : []),
    ...(context.taxDataMissing ? ["Tax balance or years delinquent is missing, reducing confidence."] : []),
    ...(taxSignals.investorCompetitionRisk >= 70 ? ["Investor competition risk is high for tax opportunities."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is weak for tax-opportunity underwriting."] : []),
    ...(context.riskScore >= 65 ? ["Risk profile is weak and downgrades readiness."] : []),
  ]);
}

function getRiskFlags(context: TaxContext, taxSignals: TaxSignals, input: TaxDealFinderAssessmentInput) {
  return unique([
    ...(context.taxDataMissing ? ["missing_tax_data"] : []),
    ...(context.countyRulesUncertain ? ["county_state_rules_uncertain"] : []),
    ...(input.ownerOccupied ? ["owner_occupied_compliance_caution"] : []),
    ...(input.auctionDateKnown ? ["known_auction_date_urgency"] : []),
    ...(taxSignals.investorCompetitionRisk >= 70 ? ["high_investor_competition"] : []),
    ...(context.riskScore >= 65 ? ["weak_risk_profile"] : []),
    ...(context.pricingConfidence < 0.58 ? ["weak_pricing_confidence"] : []),
    ...(taxSignals.equityPotential < 45 ? ["thin_or_unclear_equity"] : []),
  ]);
}

function getResearchSteps(mode: TaxDealMode, context: TaxContext, input: TaxDealFinderAssessmentInput) {
  return unique([
    "Verify tax balance, parcel number, assessed value, owner name, mailing address, and delinquency years from official county records manually.",
    "Review county/state tax lien, tax deed, redemption, notice, auction, and owner-occupancy rules with qualified counsel before any action.",
    "Verify title, liens, mortgages, code violations, probate/heirship risk, and occupancy with qualified title/legal professionals.",
    "Compare assessed value, estimated value, ARV, tax balance, and any asking price before creating an internal watchlist decision.",
    ...(input.auctionDateKnown ? ["Confirm auction date, deposit rules, bidder rules, payment deadlines, and cancellation/redemption windows manually."] : ["Research whether an auction date, sale date, or redemption deadline exists." ]),
    ...(mode === "tax_lien_candidate" ? ["Prepare future tax lien intelligence review fields: lien amount, interest/penalty rules, redemption period, priority, and title impact."] : []),
    ...(mode === "tax_deed_candidate" ? ["Prepare future tax deed intelligence review fields: deed type, redemption status, title insurability, possession, and quiet-title risk."] : []),
    ...(mode === "county_auction_candidate" || mode === "pre_auction_review" ? ["Prepare future county auction readiness fields: bidder eligibility, deposit, funding proof, due diligence deadline, and post-sale title path."] : []),
    ...(context.requiredMissingData.length > 0 ? [`Collect missing inputs: ${context.requiredMissingData.join(", ")}.`] : []),
  ]);
}

function getLeadSources(taxSignals: TaxSignals, mode: TaxDealMode) {
  if (mode === "not_tax_focused") {
    return ["Do not prioritize tax-specific lead sources until tax signals improve."];
  }

  return unique([
    "county tax delinquency list",
    ...(taxSignals.auctionReadiness >= 55 ? ["county auction calendar", "sheriff sale or treasurer sale notices"] : []),
    ...(taxSignals.vacancyDistress >= 55 ? ["vacant property list", "driving-for-dollars distress routes"] : []),
    ...(taxSignals.delinquencyPressure >= 58 ? ["pre-foreclosure list", "notice-of-default research list"] : []),
    ...(taxSignals.equityPotential >= 60 ? ["high-equity owner list"] : []),
    "county parcel research queue",
  ]).slice(0, 8);
}

function getSellerProfiles(taxSignals: TaxSignals, input: TaxDealFinderAssessmentInput) {
  return unique([
    ...(taxSignals.delinquencyPressure >= 55 ? ["tax-delinquent owners"] : []),
    ...(taxSignals.vacancyDistress >= 55 ? ["vacant property owners", "deferred-maintenance owners"] : []),
    ...(input.ownerOccupied ? ["owner-occupied properties requiring heightened compliance review"] : ["non-owner-occupied owners"] ),
    ...(taxSignals.auctionReadiness >= 60 ? ["pre-auction research candidates"] : []),
    ...(taxSignals.equityPotential >= 60 ? ["equity-rich owners with tax pressure"] : []),
  ]).slice(0, 7);
}

function getBuyerProfiles(taxSignals: TaxSignals, mode: TaxDealMode) {
  return unique([
    ...(mode !== "not_tax_focused" ? ["cash buyers comfortable with title due diligence"] : []),
    ...(taxSignals.equityPotential >= 60 ? ["value-add investors"] : []),
    ...(taxSignals.vacancyDistress >= 55 ? ["rehab buyers", "fix-and-flip investors"] : []),
    ...(mode === "tax_lien_candidate" ? ["tax lien investors"] : []),
    ...(mode === "tax_deed_candidate" ? ["tax deed investors"] : []),
    ...(mode === "county_auction_candidate" || mode === "pre_auction_review" ? ["county auction buyers"] : []),
  ]).slice(0, 7);
}

function calculateConfidence(context: TaxContext, taxSignals: TaxSignals, input: TaxDealFinderAssessmentInput) {
  const intelligenceConfidence = average([
    context.buyerConfidence,
    context.countyConfidence,
    context.marketConfidence,
    context.zoneConfidence,
    context.pricingConfidence,
  ]);
  const taxDataConfidence =
    (hasNumber(input.taxBalance) ? 0.2 : 0) +
    (hasNumber(input.yearsDelinquent) ? 0.18 : 0) +
    (hasNumber(input.assessedValue) ? 0.14 : 0) +
    (hasNumber(input.estimatedValue) || hasNumber(input.arv) ? 0.14 : 0) +
    (typeof input.auctionDateKnown === "boolean" ? 0.12 : 0) +
    (typeof input.ownerOccupied === "boolean" ? 0.11 : 0) +
    (typeof input.vacant === "boolean" ? 0.11 : 0);
  const signalScores = Object.values(taxSignals);
  const signalConsistency = 1 - clamp((Math.max(...signalScores) - Math.min(...signalScores)) / 100, 0, 1);
  const riskPenalty = context.riskScore >= 70 ? 0.12 : context.riskScore >= 58 ? 0.06 : 0;
  const ownerOccupiedPenalty = input.ownerOccupied ? 0.05 : 0;
  const confidence =
    intelligenceConfidence * 0.28 +
    taxDataConfidence * 0.26 +
    context.dataCompletenessScore / 100 * 0.22 +
    signalConsistency * 0.14 +
    context.riskQuality / 100 * 0.1 -
    riskPenalty -
    ownerOccupiedPenalty;

  return round(clamp(confidence, 0, 1));
}

function getLegalReviewRequired(input: TaxDealFinderAssessmentInput, mode: TaxDealMode, context: TaxContext) {
  return (
    mode !== "not_tax_focused" ||
    context.countyRulesUncertain ||
    input.auctionDateKnown === true ||
    input.ownerOccupied === true ||
    context.taxBalance > 0 ||
    context.yearsDelinquent > 0
  );
}

function getHumanReviewRequired(legalReviewRequired: boolean, readinessLevel: TaxReadinessLevel, context: TaxContext, input: TaxDealFinderAssessmentInput) {
  return (
    legalReviewRequired ||
    readinessLevel !== "not_ready" ||
    input.ownerOccupied === true ||
    input.auctionDateKnown === true ||
    context.riskScore >= 50 ||
    context.requiredMissingData.length > 0
  );
}

function getIntelligenceInputsUsed(input: TaxDealFinderAssessmentInput) {
  return unique([
    input.buyerDemandProfile ? "provided_buyer_demand_profile" : "buyer_demand_intelligence_agent",
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.marketTargetingProfile ? "provided_market_targeting_profile" : "market_intelligence_agent",
    input.acquisitionZoneProfile ? "provided_acquisition_zone_profile" : "acquisition_zone_intelligence_engine",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_zone_and_market_signals",
    "manual_county_tax_data_required",
  ]);
}

function getReasoning(params: {
  input: TaxDealFinderAssessmentInput;
  context: TaxContext;
  taxSignals: TaxSignals;
  score: number;
  grade: TaxOpportunityGrade;
  mode: TaxDealMode;
  priority: TaxAcquisitionPriority;
  readiness: TaxReadinessLevel;
  confidence: number;
}) {
  const area = [
    params.input.neighborhood,
    params.input.zipCode ? `ZIP ${params.input.zipCode}` : "",
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected tax research area";

  return `${area} is graded ${params.grade} with a ${params.score}/100 tax opportunity score, ${params.mode} mode, ${params.priority} acquisition priority, and ${params.readiness} readiness. The score uses delinquency pressure ${params.taxSignals.delinquencyPressure}/100, auction readiness ${params.taxSignals.auctionReadiness}/100, equity potential ${params.taxSignals.equityPotential}/100, vacancy distress ${params.taxSignals.vacancyDistress}/100, county opportunity ${params.taxSignals.countyOpportunity}/100, investor competition risk ${params.taxSignals.investorCompetitionRisk}/100, risk quality ${params.context.riskQuality}/100, and pricing confidence ${round(params.context.pricingConfidence, 2)}. Confidence is ${params.confidence}. This is informational read-only tax-deal research only; it does not scrape county websites, contact anyone, execute outreach, place bids, generate legal documents, or write to the database.`;
}

export function getTaxDealFinderAssessment(input: TaxDealFinderAssessmentInput = {}): TaxDealFinderAssessment {
  const context = getTaxContext(input);
  const taxSignals = getTaxSignals(input, context);
  const taxOpportunityScore = calculateTaxOpportunityScore(context, taxSignals, input);
  const taxOpportunityGrade = getTaxOpportunityGrade(taxOpportunityScore);
  const taxDealMode = getTaxDealMode(taxOpportunityScore, taxSignals, context, input);
  const acquisitionPriority = getPriority(taxOpportunityScore, taxDealMode, taxSignals, context);
  const legalReviewRequired = getLegalReviewRequired(input, taxDealMode, context);
  const readinessLevel = getReadinessLevel(taxDealMode, context, input, legalReviewRequired);
  const humanReviewRequired = getHumanReviewRequired(legalReviewRequired, readinessLevel, context, input);
  const confidenceScore = calculateConfidence(context, taxSignals, input);

  return {
    taxOpportunityScore,
    taxOpportunityGrade,
    taxDealMode,
    acquisitionPriority,
    legalReviewRequired,
    humanReviewRequired,
    readinessLevel,
    taxSignals,
    opportunitySignals: getOpportunitySignals(taxDealMode, taxSignals, context, input),
    warningSignals: getWarningSignals(taxSignals, context, input, legalReviewRequired),
    riskFlags: getRiskFlags(context, taxSignals, input),
    recommendedResearchSteps: getResearchSteps(taxDealMode, context, input),
    recommendedLeadSources: getLeadSources(taxSignals, taxDealMode),
    recommendedSellerProfiles: getSellerProfiles(taxSignals, input),
    recommendedBuyerProfiles: getBuyerProfiles(taxSignals, taxDealMode),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      taxSignals,
      score: taxOpportunityScore,
      grade: taxOpportunityGrade,
      mode: taxDealMode,
      priority: acquisitionPriority,
      readiness: readinessLevel,
      confidence: confidenceScore,
    }),
    complianceNotice: TAX_COMPLIANCE_NOTICE,
  };
}
