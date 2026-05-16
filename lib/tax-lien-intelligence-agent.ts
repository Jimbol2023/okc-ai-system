import { getAcquisitionZoneAssessment } from "@/lib/acquisition-zone-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getTaxDealFinderAssessment } from "@/lib/tax-deal-finder-mode";

export type LienOpportunityGrade = "A+" | "A" | "B" | "C" | "D";

export type LienSuitability =
  | "strong_candidate"
  | "research_candidate"
  | "watchlist"
  | "weak_candidate"
  | "avoid";

export type LienInvestorProfileFit =
  | "conservative"
  | "balanced"
  | "aggressive"
  | "institutional_review"
  | "not_recommended";

export type LienReadinessLevel =
  | "not_ready"
  | "research_only"
  | "watchlist"
  | "review_ready";

export type LienSignals = {
  delinquencyStrength: number;
  equityProtection: number;
  yieldPotential: number;
  redemptionRisk: number;
  ownerOccupancyRisk: number;
  investorCompetitionRisk: number;
  countyProcessConfidence: number;
};

export type TaxLienIntelligenceInput = {
  location?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  assetType?: string;
  assessedValue?: number;
  estimatedValue?: number;
  arv?: number;
  taxBalance?: number;
  lienAmount?: number;
  yearsDelinquent?: number;
  interestRateKnown?: boolean;
  redemptionPeriodKnown?: boolean;
  auctionDateKnown?: boolean;
  ownerOccupied?: boolean;
  vacant?: boolean;
  foreclosureRate?: number;
  distressRate?: number;
  investorActivity?: number;
  taxDealProfile?: unknown;
  countyAlphaProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
  acquisitionZoneProfile?: unknown;
};

export type TaxLienIntelligenceAssessment = {
  lienOpportunityScore: number;
  lienOpportunityGrade: LienOpportunityGrade;
  lienSuitability: LienSuitability;
  investorProfileFit: LienInvestorProfileFit;
  readinessLevel: LienReadinessLevel;
  legalReviewRequired: boolean;
  humanReviewRequired: boolean;
  lienSignals: LienSignals;
  opportunitySignals: string[];
  warningSignals: string[];
  riskFlags: string[];
  recommendedResearchSteps: string[];
  recommendedDueDiligenceItems: string[];
  confidenceScore: number;
  requiredMissingData: string[];
  intelligenceInputsUsed: string[];
  reasoning: string;
  complianceNotice: string;
};

type JsonRecord = Record<string, unknown>;
type LienContext = ReturnType<typeof getLienContext>;

const TAX_LIEN_COMPLIANCE_NOTICE =
  "This is internal read-only tax lien intelligence, not legal, tax, title, lien-priority, redemption, bidding, or investment advice. Verify all county/state tax lien, redemption, interest/penalty, notice, owner-occupancy, auction, priority, title, escrow, disclosure, marketing, and closing requirements with a qualified local real estate attorney, tax professional, and title company before any contact, bid, purchase, assignment, marketing, signing, or closing activity.";

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

function getRequiredMissingData(input: TaxLienIntelligenceInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.zipCode && !input.neighborhood ? ["ZIP code or neighborhood"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!hasNumber(input.lienAmount) && !hasNumber(input.taxBalance) ? ["lien amount or tax balance"] : []),
    ...(!hasNumber(input.yearsDelinquent) ? ["years delinquent"] : []),
    ...(!hasNumber(input.assessedValue) ? ["assessed value"] : []),
    ...(!hasNumber(input.estimatedValue) && !hasNumber(input.arv) ? ["estimated value or ARV"] : []),
    ...(typeof input.interestRateKnown !== "boolean" ? ["interest rate known flag"] : []),
    ...(typeof input.redemptionPeriodKnown !== "boolean" ? ["redemption period known flag"] : []),
    ...(typeof input.auctionDateKnown !== "boolean" ? ["auction date known flag"] : []),
    ...(typeof input.ownerOccupied !== "boolean" ? ["owner occupancy flag"] : []),
    ...(typeof input.vacant !== "boolean" ? ["vacancy flag"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
  ]);
}

function getProfiles(input: TaxLienIntelligenceInput) {
  const countyAlphaProfile = input.countyAlphaProfile ?? getCountyAlphaProfile({
    county: input.county,
    state: input.state,
    assetType: input.assetType,
  });
  const acquisitionZoneProfile = input.acquisitionZoneProfile ?? getAcquisitionZoneAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    zipCode: input.zipCode,
    neighborhood: input.neighborhood,
    assetType: input.assetType,
    strategy: "tax_lien_research",
    medianPrice: input.estimatedValue ?? input.assessedValue,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    countyAlphaProfile,
    pricingProfile: input.pricingProfile,
    riskProfile: input.riskProfile,
  });
  const taxDealProfile = input.taxDealProfile ?? getTaxDealFinderAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    zipCode: input.zipCode,
    neighborhood: input.neighborhood,
    assetType: input.assetType,
    strategy: "tax_lien_research",
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance ?? input.lienAmount,
    yearsDelinquent: input.yearsDelinquent,
    auctionDateKnown: input.auctionDateKnown,
    ownerOccupied: input.ownerOccupied,
    vacant: input.vacant,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    countyAlphaProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
    acquisitionZoneProfile,
  });

  return {
    countyAlphaProfile,
    acquisitionZoneProfile,
    taxDealProfile,
  };
}

function getRiskScore(input: TaxLienIntelligenceInput, profiles: ReturnType<typeof getProfiles>) {
  const directRisk = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return clampScore(directRisk);

  const readinessRisk = riskLevelToScore(getString(input.riskProfile, ["riskReadiness", "readinessLevel"], "medium"));
  const taxFlags = stringArray(getPath(profiles.taxDealProfile, ["riskFlags"])).length;
  const zoneWarnings = stringArray(getPath(profiles.acquisitionZoneProfile, ["warningSignals"])).length;
  const taxReadiness = normalize(getString(profiles.taxDealProfile, ["readinessLevel"], "research_only"));
  const readinessPenalty = taxReadiness === "not_ready" ? 22 : taxReadiness === "research_only" ? 12 : taxReadiness === "watchlist" ? 7 : 0;

  return clampScore(readinessRisk * 0.36 + taxFlags * 5 + zoneWarnings * 6 + readinessPenalty + 8);
}

function getLienContext(input: TaxLienIntelligenceInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const value = input.estimatedValue ?? input.arv ?? input.assessedValue ?? 0;
  const assessedValue = input.assessedValue ?? 0;
  const lienAmount = input.lienAmount ?? input.taxBalance ?? 0;
  const taxBalance = input.taxBalance ?? lienAmount;
  const yearsDelinquent = input.yearsDelinquent ?? 0;
  const lienToValueRatio = value > 0 ? lienAmount / value : 0;
  const lienToAssessedRatio = assessedValue > 0 ? lienAmount / assessedValue : lienToValueRatio;
  const equityProtectionRatio = value > 0 ? Math.max(0, value - lienAmount) / value : 0;
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = getNumber(profiles.countyAlphaProfile, ["confidenceScore"], 0.55);
  const countyCompetitionLevel = getString(profiles.countyAlphaProfile, ["competitionLevel"], "medium");
  const countyAcquisitionDifficulty = getNumber(profiles.countyAlphaProfile, ["acquisitionDifficulty"], 55);
  const zoneScore = getNumber(profiles.acquisitionZoneProfile, ["zoneScore"], 55);
  const zoneConfidence = getNumber(profiles.acquisitionZoneProfile, ["confidenceScore"], 0.58);
  const zoneMode = normalize(getString(profiles.acquisitionZoneProfile, ["recommendedAcquisitionMode"], "opportunistic"));
  const corridorSignals = asRecord(getPath(profiles.acquisitionZoneProfile, ["corridorSignals"]));
  const zoneInvestorSaturation = getNumber(corridorSignals, ["investorSaturation"], scaleSignal(input.investorActivity, 55));
  const zoneDistressCorridor = getNumber(corridorSignals, ["distressCorridor"], 55);
  const taxOpportunityScore = getNumber(profiles.taxDealProfile, ["taxOpportunityScore"], 55);
  const taxDealMode = normalize(getString(profiles.taxDealProfile, ["taxDealMode"], "tax_delinquency_watch"));
  const taxReadiness = normalize(getString(profiles.taxDealProfile, ["readinessLevel"], "research_only"));
  const taxConfidence = getNumber(profiles.taxDealProfile, ["confidenceScore"], 0.58);
  const taxSignals = asRecord(getPath(profiles.taxDealProfile, ["taxSignals"]));
  const taxDelinquencyPressure = getNumber(taxSignals, ["delinquencyPressure"], 55);
  const taxEquityPotential = getNumber(taxSignals, ["equityPotential"], 55);
  const taxInvestorCompetitionRisk = getNumber(taxSignals, ["investorCompetitionRisk"], zoneInvestorSaturation);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const investorActivityScore = scaleSignal(input.investorActivity, zoneInvestorSaturation);
  const pricingConfidence = clamp(getNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"], taxConfidence), 0, 1);
  const riskScore = getRiskScore(input, profiles);
  const riskQuality = 100 - riskScore;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 6);
  const countyRulesUncertain = !input.county || !input.state;
  const lienRuleDataMissing = input.interestRateKnown !== true || input.redemptionPeriodKnown !== true;
  const lienDataMissing = !hasNumber(input.lienAmount) && !hasNumber(input.taxBalance);

  return {
    ...profiles,
    requiredMissingData,
    value,
    assessedValue,
    lienAmount,
    taxBalance,
    yearsDelinquent,
    lienToValueRatio,
    lienToAssessedRatio,
    equityProtectionRatio,
    countyAlphaScore,
    countyConfidence,
    countyCompetitionLevel,
    countyAcquisitionDifficulty,
    zoneScore,
    zoneConfidence,
    zoneMode,
    zoneInvestorSaturation,
    zoneDistressCorridor,
    taxOpportunityScore,
    taxDealMode,
    taxReadiness,
    taxConfidence,
    taxDelinquencyPressure,
    taxEquityPotential,
    taxInvestorCompetitionRisk,
    foreclosurePressure,
    distressPressure,
    investorActivityScore,
    pricingConfidence,
    riskScore,
    riskQuality,
    dataCompletenessScore,
    countyRulesUncertain,
    lienRuleDataMissing,
    lienDataMissing,
  };
}

function getLienSignals(input: TaxLienIntelligenceInput, context: LienContext): LienSignals {
  const delinquencyStrength = clampScore(
    Math.min(context.yearsDelinquent, 5) * 14 +
    Math.min(context.lienToValueRatio * 430, 30) +
    Math.min(context.lienToAssessedRatio * 360, 24) +
    context.taxDelinquencyPressure * 0.18 +
    context.distressPressure * 0.12,
  );
  const equityProtection = clampScore(
    context.equityProtectionRatio * 92 +
    (context.value > 0 ? 8 : 0) -
    Math.max(0, context.lienToValueRatio - 0.16) * 120,
  );
  const yieldPotential = clampScore(
    (input.interestRateKnown ? 28 : 10) +
    Math.min(context.lienToValueRatio * 520, 36) +
    Math.min(context.yearsDelinquent, 4) * 7 +
    context.taxDelinquencyPressure * 0.14 +
    (context.taxBalance > 0 ? 8 : 0),
  );
  const redemptionRisk = clampScore(
    (input.redemptionPeriodKnown ? 22 : 66) +
    (input.ownerOccupied ? 18 : 0) +
    (input.auctionDateKnown ? 8 : 0) +
    Math.max(0, 55 - context.pricingConfidence * 100) * 0.24 +
    context.riskScore * 0.16,
  );
  const ownerOccupancyRisk = clampScore(
    (input.ownerOccupied ? 72 : 24) +
    (input.vacant ? -8 : 0) +
    (input.redemptionPeriodKnown ? -6 : 8),
  );
  const investorCompetitionRisk = clampScore(
    context.investorActivityScore * 0.3 +
    context.zoneInvestorSaturation * 0.28 +
    context.taxInvestorCompetitionRisk * 0.2 +
    riskLevelToScore(context.countyCompetitionLevel) * 0.12 +
    (input.auctionDateKnown ? 8 : 0) +
    context.countyAcquisitionDifficulty * 0.1,
  );
  const countyProcessConfidence = clampScore(
    context.countyAlphaScore * 0.22 +
    context.zoneScore * 0.2 +
    context.taxOpportunityScore * 0.18 +
    context.countyConfidence * 100 * 0.14 +
    context.zoneConfidence * 100 * 0.12 +
    context.taxConfidence * 100 * 0.1 +
    (input.interestRateKnown ? 3 : -7) +
    (input.redemptionPeriodKnown ? 4 : -12) +
    (context.countyRulesUncertain ? -12 : 0),
  );

  return {
    delinquencyStrength,
    equityProtection,
    yieldPotential,
    redemptionRisk,
    ownerOccupancyRisk,
    investorCompetitionRisk,
    countyProcessConfidence,
  };
}

function calculateLienOpportunityScore(context: LienContext, signals: LienSignals, input: TaxLienIntelligenceInput) {
  const legalUncertaintyPenalty = input.redemptionPeriodKnown ? 0 : 8;
  const ownerOccupiedPenalty = input.ownerOccupied ? 8 : 0;
  const competitionPenalty = signals.investorCompetitionRisk >= 75 ? 8 : signals.investorCompetitionRisk >= 65 ? 4 : 0;
  const riskPenalty = context.riskScore >= 70 ? 8 : context.riskScore >= 58 ? 4 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 3) * 1.8;

  return clampScore(
    signals.equityProtection * 0.24 +
    signals.delinquencyStrength * 0.18 +
    signals.yieldPotential * 0.16 +
    signals.countyProcessConfidence * 0.15 +
    context.taxOpportunityScore * 0.1 +
    context.riskQuality * 0.08 +
    context.pricingConfidence * 100 * 0.05 +
    (100 - signals.redemptionRisk) * 0.04 -
    legalUncertaintyPenalty -
    ownerOccupiedPenalty -
    competitionPenalty -
    riskPenalty -
    missingPenalty,
  );
}

function getLienOpportunityGrade(score: number): LienOpportunityGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getLienSuitability(score: number, signals: LienSignals, context: LienContext): LienSuitability {
  if (score < 35 || context.riskScore >= 82 || signals.equityProtection < 35) return "avoid";
  if (score >= 82 && signals.equityProtection >= 78 && signals.redemptionRisk < 46 && signals.countyProcessConfidence >= 70) return "strong_candidate";
  if (score >= 65 && signals.equityProtection >= 62) return "research_candidate";
  if (score >= 50) return "watchlist";
  if (score >= 38) return "weak_candidate";

  return "avoid";
}

function getReadinessLevel(suitability: LienSuitability, context: LienContext, input: TaxLienIntelligenceInput): LienReadinessLevel {
  if (suitability === "avoid" || context.riskScore >= 82) return "not_ready";
  if (context.requiredMissingData.length >= 6 || context.lienDataMissing || context.countyRulesUncertain) return "research_only";
  if (!input.redemptionPeriodKnown || !input.interestRateKnown || input.ownerOccupied || context.riskScore >= 58) return "watchlist";

  return "review_ready";
}

function getInvestorProfileFit(suitability: LienSuitability, readiness: LienReadinessLevel, signals: LienSignals, context: LienContext, input: TaxLienIntelligenceInput): LienInvestorProfileFit {
  if (suitability === "avoid" || readiness === "not_ready") return "not_recommended";
  if (!input.redemptionPeriodKnown || context.countyRulesUncertain || signals.redemptionRisk >= 68 || context.riskScore >= 68) return "institutional_review";
  if (context.requiredMissingData.length > 0 || signals.investorCompetitionRisk >= 68 || input.ownerOccupied) return "conservative";
  if (signals.yieldPotential >= 72 && signals.equityProtection >= 70 && signals.redemptionRisk < 52) return "aggressive";

  return "balanced";
}

function getLegalReviewRequired(input: TaxLienIntelligenceInput, context: LienContext) {
  return (
    !input.redemptionPeriodKnown ||
    !input.interestRateKnown ||
    context.countyRulesUncertain ||
    input.ownerOccupied === true ||
    input.auctionDateKnown === true ||
    context.lienAmount > 0 ||
    context.taxBalance > 0
  );
}

function getHumanReviewRequired(legalReviewRequired: boolean, readiness: LienReadinessLevel, context: LienContext) {
  return legalReviewRequired || readiness !== "not_ready" || context.requiredMissingData.length > 0 || context.riskScore >= 50;
}

function getOpportunitySignals(signals: LienSignals, context: LienContext, suitability: LienSuitability) {
  return unique([
    ...(signals.equityProtection >= 70 ? ["Equity protection is strong relative to lien amount and estimated value."] : []),
    ...(signals.delinquencyStrength >= 65 ? ["Delinquency strength supports tax lien research priority."] : []),
    ...(signals.yieldPotential >= 62 ? ["Lien amount and known/assumed maturity may support yield-oriented research."] : []),
    ...(signals.countyProcessConfidence >= 65 ? ["County alpha, zone quality, and tax deal profile support county process confidence."] : []),
    ...(context.taxDealMode === "tax_lien_candidate" ? ["Tax Deal Finder already classifies this as an informational tax lien candidate."] : []),
    ...(context.zoneDistressCorridor >= 62 ? ["Acquisition zone distress corridor supports future tax lien watchlist compatibility."] : []),
    ...(suitability === "strong_candidate" ? ["Strong candidate classification is informational only and still requires human/legal review."] : []),
  ]);
}

function getWarningSignals(input: TaxLienIntelligenceInput, context: LienContext, signals: LienSignals, legalReviewRequired: boolean) {
  return unique([
    ...(legalReviewRequired ? ["Legal review is required before any tax lien action or interpretation."] : []),
    ...(!input.interestRateKnown ? ["Interest rate or penalty terms are unknown, reducing confidence."] : []),
    ...(!input.redemptionPeriodKnown ? ["Redemption period is unknown, creating legal and timing uncertainty."] : []),
    ...(input.ownerOccupied ? ["Owner-occupied property increases compliance and consumer-protection caution."] : []),
    ...(input.auctionDateKnown ? ["Known auction date increases urgency and competition risk."] : []),
    ...(signals.redemptionRisk >= 65 ? ["Redemption/timing risk is elevated."] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["Investor competition risk is high."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is weak for lien underwriting."] : []),
    ...(context.riskScore >= 65 ? ["Risk profile is weak and downgrades readiness."] : []),
  ]);
}

function getRiskFlags(input: TaxLienIntelligenceInput, context: LienContext, signals: LienSignals) {
  return unique([
    ...(context.lienDataMissing ? ["missing_lien_amount_or_tax_balance"] : []),
    ...(!input.interestRateKnown ? ["interest_rate_unknown"] : []),
    ...(!input.redemptionPeriodKnown ? ["redemption_period_unknown"] : []),
    ...(context.countyRulesUncertain ? ["county_state_rules_uncertain"] : []),
    ...(input.ownerOccupied ? ["owner_occupied_compliance_caution"] : []),
    ...(input.auctionDateKnown ? ["known_auction_date_urgency"] : []),
    ...(signals.redemptionRisk >= 65 ? ["high_redemption_risk"] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["high_investor_competition"] : []),
    ...(signals.equityProtection < 45 ? ["weak_equity_protection"] : []),
    ...(context.riskScore >= 65 ? ["weak_risk_profile"] : []),
  ]);
}

function getResearchSteps(input: TaxLienIntelligenceInput, context: LienContext) {
  return unique([
    "Verify lien amount, tax balance, parcel number, owner name, assessed value, and delinquency years from official county records manually.",
    "Review county/state tax lien statutes, redemption period, interest or penalty rules, notice requirements, priority, and sale process with qualified counsel.",
    "Confirm whether the county sells liens, deeds, certificates, or another tax-sale instrument before classifying the opportunity.",
    "Verify title, mortgage priority, municipal liens, code violations, probate/heirship risk, bankruptcy risk, and title insurability with qualified professionals.",
    "Validate estimated value, assessed value, ARV, and equity protection before any investor-facing review.",
    ...(input.auctionDateKnown ? ["Confirm auction date, bidder eligibility, deposit, payment deadlines, and cancellation/redemption windows manually."] : ["Research whether an auction date, sale date, certificate sale date, or redemption deadline exists."] ),
    ...(context.requiredMissingData.length > 0 ? [`Collect missing lien inputs: ${context.requiredMissingData.join(", ")}.`] : []),
  ]);
}

function getDueDiligenceItems(input: TaxLienIntelligenceInput) {
  return unique([
    "county tax lien sale rules",
    "redemption period and redemption payoff rules",
    "interest rate, penalty rate, or premium bid rules",
    "lien priority and surviving lien review",
    "title search and ownership verification",
    "assessed value and independent value support",
    "occupancy and owner-occupancy status",
    "bankruptcy, probate, code enforcement, and municipal lien checks",
    ...(input.auctionDateKnown ? ["auction registration, deposit, funding, and payment deadline review"] : []),
  ]);
}

function calculateConfidence(context: LienContext, signals: LienSignals, input: TaxLienIntelligenceInput) {
  const rulesConfidence =
    (input.interestRateKnown ? 0.2 : 0) +
    (input.redemptionPeriodKnown ? 0.24 : 0) +
    (typeof input.auctionDateKnown === "boolean" ? 0.12 : 0) +
    (typeof input.ownerOccupied === "boolean" ? 0.12 : 0) +
    (typeof input.vacant === "boolean" ? 0.08 : 0) +
    (hasNumber(input.lienAmount) || hasNumber(input.taxBalance) ? 0.14 : 0) +
    (hasNumber(input.estimatedValue) || hasNumber(input.arv) ? 0.1 : 0);
  const intelligenceConfidence = average([
    context.countyConfidence,
    context.zoneConfidence,
    context.taxConfidence,
    context.pricingConfidence,
  ]);
  const signalValues = Object.values(signals);
  const signalConsistency = 1 - clamp((Math.max(...signalValues) - Math.min(...signalValues)) / 100, 0, 1);
  const confidence =
    intelligenceConfidence * 0.3 +
    rulesConfidence * 0.28 +
    context.dataCompletenessScore / 100 * 0.22 +
    signalConsistency * 0.1 +
    context.riskQuality / 100 * 0.1 -
    (input.ownerOccupied ? 0.04 : 0) -
    (context.riskScore >= 70 ? 0.1 : context.riskScore >= 58 ? 0.05 : 0);

  return round(clamp(confidence, 0, 1));
}

function getIntelligenceInputsUsed(input: TaxLienIntelligenceInput) {
  return unique([
    input.taxDealProfile ? "provided_tax_deal_profile" : "tax_deal_finder_mode",
    input.acquisitionZoneProfile ? "provided_acquisition_zone_profile" : "acquisition_zone_intelligence_engine",
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_tax_deal_and_zone_signals",
    "manual_county_tax_lien_rules_required",
  ]);
}

function getReasoning(params: {
  input: TaxLienIntelligenceInput;
  context: LienContext;
  signals: LienSignals;
  score: number;
  grade: LienOpportunityGrade;
  suitability: LienSuitability;
  investorFit: LienInvestorProfileFit;
  readiness: LienReadinessLevel;
  confidence: number;
}) {
  const area = [
    params.input.neighborhood,
    params.input.zipCode ? `ZIP ${params.input.zipCode}` : "",
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected tax lien research area";

  return `${area} is graded ${params.grade} with a ${params.score}/100 lien opportunity score, ${params.suitability} suitability, ${params.investorFit} investor fit, and ${params.readiness} readiness. The score uses delinquency strength ${params.signals.delinquencyStrength}/100, equity protection ${params.signals.equityProtection}/100, yield potential ${params.signals.yieldPotential}/100, redemption risk ${params.signals.redemptionRisk}/100, owner occupancy risk ${params.signals.ownerOccupancyRisk}/100, investor competition risk ${params.signals.investorCompetitionRisk}/100, county process confidence ${params.signals.countyProcessConfidence}/100, and risk quality ${params.context.riskQuality}/100. Confidence is ${params.confidence}. This is informational read-only tax lien intelligence only; it does not scrape county websites, contact anyone, execute outreach, bid, generate legal documents, or write to the database.`;
}

export function getTaxLienIntelligenceAssessment(input: TaxLienIntelligenceInput = {}): TaxLienIntelligenceAssessment {
  const context = getLienContext(input);
  const lienSignals = getLienSignals(input, context);
  const lienOpportunityScore = calculateLienOpportunityScore(context, lienSignals, input);
  const lienOpportunityGrade = getLienOpportunityGrade(lienOpportunityScore);
  const lienSuitability = getLienSuitability(lienOpportunityScore, lienSignals, context);
  const readinessLevel = getReadinessLevel(lienSuitability, context, input);
  const investorProfileFit = getInvestorProfileFit(lienSuitability, readinessLevel, lienSignals, context, input);
  const legalReviewRequired = getLegalReviewRequired(input, context);
  const humanReviewRequired = getHumanReviewRequired(legalReviewRequired, readinessLevel, context);
  const confidenceScore = calculateConfidence(context, lienSignals, input);

  return {
    lienOpportunityScore,
    lienOpportunityGrade,
    lienSuitability,
    investorProfileFit,
    readinessLevel,
    legalReviewRequired,
    humanReviewRequired,
    lienSignals,
    opportunitySignals: getOpportunitySignals(lienSignals, context, lienSuitability),
    warningSignals: getWarningSignals(input, context, lienSignals, legalReviewRequired),
    riskFlags: getRiskFlags(input, context, lienSignals),
    recommendedResearchSteps: getResearchSteps(input, context),
    recommendedDueDiligenceItems: getDueDiligenceItems(input),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      signals: lienSignals,
      score: lienOpportunityScore,
      grade: lienOpportunityGrade,
      suitability: lienSuitability,
      investorFit: investorProfileFit,
      readiness: readinessLevel,
      confidence: confidenceScore,
    }),
    complianceNotice: TAX_LIEN_COMPLIANCE_NOTICE,
  };
}
