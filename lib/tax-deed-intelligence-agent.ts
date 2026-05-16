import { getAcquisitionZoneAssessment } from "@/lib/acquisition-zone-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getTaxDealFinderAssessment } from "@/lib/tax-deal-finder-mode";
import { getTaxLienIntelligenceAssessment } from "@/lib/tax-lien-intelligence-agent";

export type DeedOpportunityGrade = "A+" | "A" | "B" | "C" | "D";

export type DeedSuitability =
  | "strong_candidate"
  | "research_candidate"
  | "watchlist"
  | "high_complexity"
  | "avoid";

export type DeedInvestorProfileFit =
  | "conservative"
  | "balanced"
  | "aggressive"
  | "institutional_review"
  | "not_recommended";

export type DeedReadinessLevel =
  | "not_ready"
  | "research_only"
  | "watchlist"
  | "review_ready";

export type DeedSignals = {
  equityPotential: number;
  redemptionExposure: number;
  titleComplexityRisk: number;
  auctionReadiness: number;
  countyConfidence: number;
  investorCompetitionRisk: number;
  distressedOpportunityStrength: number;
};

export type TaxDeedIntelligenceInput = {
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
  openingBid?: number;
  yearsDelinquent?: number;
  redemptionPeriodKnown?: boolean;
  redemptionRiskLevel?: number;
  titleStatusKnown?: boolean;
  titleComplexityLevel?: number;
  auctionDateKnown?: boolean;
  ownerOccupied?: boolean;
  vacant?: boolean;
  foreclosureRate?: number;
  distressRate?: number;
  investorActivity?: number;
  taxDealProfile?: unknown;
  taxLienProfile?: unknown;
  countyAlphaProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
  acquisitionZoneProfile?: unknown;
};

export type TaxDeedIntelligenceAssessment = {
  deedOpportunityScore: number;
  deedOpportunityGrade: DeedOpportunityGrade;
  deedSuitability: DeedSuitability;
  investorProfileFit: DeedInvestorProfileFit;
  readinessLevel: DeedReadinessLevel;
  legalReviewRequired: boolean;
  titleReviewRequired: boolean;
  humanReviewRequired: boolean;
  deedSignals: DeedSignals;
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
type DeedContext = ReturnType<typeof getDeedContext>;

const TAX_DEED_COMPLIANCE_NOTICE =
  "This is internal read-only tax deed intelligence, not legal, tax, title, quiet-title, redemption, bidding, possession, or investment advice. Verify all county/state tax deed, redemption, notice, auction, title, quiet-title, possession, owner-occupancy, escrow, disclosure, marketing, and closing requirements with a qualified local real estate attorney, tax professional, and title company before any contact, bid, purchase, assignment, marketing, signing, possession action, or closing activity.";

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

function scoreFromOptional(value: number | undefined, fallback: number) {
  if (!hasNumber(value)) return fallback;

  return clampScore(value <= 1 ? value * 100 : value);
}

function confidenceFromOptional(value: number | undefined, fallback: number) {
  if (!hasNumber(value)) return fallback;

  return round(clamp(value > 1 ? value / 100 : value, 0, 1));
}

function riskLevelToScore(level: string) {
  const normalizedLevel = normalize(level);

  if (normalizedLevel === "high" || normalizedLevel === "critical" || normalizedLevel === "avoid") return 78;
  if (normalizedLevel === "low" || normalizedLevel === "ready") return 24;

  return 50;
}

function getRequiredMissingData(input: TaxDeedIntelligenceInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.zipCode && !input.neighborhood ? ["ZIP code or neighborhood"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!hasNumber(input.openingBid) && !hasNumber(input.taxBalance) ? ["opening bid or tax balance"] : []),
    ...(!hasNumber(input.yearsDelinquent) ? ["years delinquent"] : []),
    ...(!hasNumber(input.assessedValue) ? ["assessed value"] : []),
    ...(!hasNumber(input.estimatedValue) && !hasNumber(input.arv) ? ["estimated value or ARV"] : []),
    ...(typeof input.redemptionPeriodKnown !== "boolean" ? ["redemption period known flag"] : []),
    ...(!hasNumber(input.redemptionRiskLevel) ? ["redemption risk level"] : []),
    ...(typeof input.titleStatusKnown !== "boolean" ? ["title status known flag"] : []),
    ...(!hasNumber(input.titleComplexityLevel) ? ["title complexity level"] : []),
    ...(typeof input.auctionDateKnown !== "boolean" ? ["auction date known flag"] : []),
    ...(typeof input.ownerOccupied !== "boolean" ? ["owner occupancy flag"] : []),
    ...(typeof input.vacant !== "boolean" ? ["vacancy flag"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
  ]);
}

function getProfiles(input: TaxDeedIntelligenceInput) {
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
    strategy: "tax_deed_research",
    medianPrice: input.estimatedValue ?? input.arv ?? input.assessedValue,
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
    strategy: "tax_deed_research",
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance ?? input.openingBid,
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
  const taxLienProfile = input.taxLienProfile ?? getTaxLienIntelligenceAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    zipCode: input.zipCode,
    neighborhood: input.neighborhood,
    assetType: input.assetType,
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance ?? input.openingBid,
    lienAmount: input.taxBalance ?? input.openingBid,
    yearsDelinquent: input.yearsDelinquent,
    interestRateKnown: false,
    redemptionPeriodKnown: input.redemptionPeriodKnown,
    auctionDateKnown: input.auctionDateKnown,
    ownerOccupied: input.ownerOccupied,
    vacant: input.vacant,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    taxDealProfile,
    countyAlphaProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
    acquisitionZoneProfile,
  });

  return {
    countyAlphaProfile,
    acquisitionZoneProfile,
    taxDealProfile,
    taxLienProfile,
  };
}

function getRiskScore(input: TaxDeedIntelligenceInput, profiles: ReturnType<typeof getProfiles>) {
  const directRisk = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return scoreFromOptional(directRisk, 50);

  const readinessRisk = riskLevelToScore(getString(input.riskProfile, ["riskReadiness", "readinessLevel"], "medium"));
  const taxFlags = stringArray(getPath(profiles.taxDealProfile, ["riskFlags"])).length;
  const lienFlags = stringArray(getPath(profiles.taxLienProfile, ["riskFlags"])).length;
  const zoneWarnings = stringArray(getPath(profiles.acquisitionZoneProfile, ["warningSignals"])).length;
  const taxReadiness = normalize(getString(profiles.taxDealProfile, ["readinessLevel"], "research_only"));
  const lienReadiness = normalize(getString(profiles.taxLienProfile, ["readinessLevel"], "research_only"));
  const taxPenalty = taxReadiness === "not_ready" ? 20 : taxReadiness === "research_only" ? 11 : taxReadiness === "watchlist" ? 7 : 0;
  const lienPenalty = lienReadiness === "not_ready" ? 18 : lienReadiness === "research_only" ? 9 : lienReadiness === "watchlist" ? 6 : 0;
  const titleRisk = scaleSignal(input.titleComplexityLevel, input.titleStatusKnown ? 48 : 68);
  const redemptionRisk = scaleSignal(input.redemptionRiskLevel, input.redemptionPeriodKnown ? 46 : 68);

  return clampScore(
    readinessRisk * 0.2 +
    titleRisk * 0.24 +
    redemptionRisk * 0.16 +
    taxFlags * 4 +
    lienFlags * 3 +
    zoneWarnings * 5 +
    taxPenalty +
    lienPenalty +
    6,
  );
}

function getDeedContext(input: TaxDeedIntelligenceInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const value = input.estimatedValue ?? input.arv ?? input.assessedValue ?? 0;
  const assessedValue = input.assessedValue ?? 0;
  const openingBid = input.openingBid ?? input.taxBalance ?? 0;
  const taxBalance = input.taxBalance ?? openingBid;
  const yearsDelinquent = input.yearsDelinquent ?? 0;
  const bidToValueRatio = value > 0 ? openingBid / value : 0;
  const bidToAssessedRatio = assessedValue > 0 ? openingBid / assessedValue : bidToValueRatio;
  const equitySpread = value > 0 ? Math.max(0, value - openingBid) : 0;
  const equitySpreadRatio = value > 0 ? equitySpread / value : 0;
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = confidenceFromOptional(getOptionalNumber(profiles.countyAlphaProfile, ["confidenceScore"]), 0.55);
  const countyCompetitionLevel = getString(profiles.countyAlphaProfile, ["competitionLevel"], "medium");
  const countyAcquisitionDifficulty = getNumber(profiles.countyAlphaProfile, ["acquisitionDifficulty"], 55);
  const zoneScore = getNumber(profiles.acquisitionZoneProfile, ["zoneScore"], 55);
  const zoneConfidence = confidenceFromOptional(getOptionalNumber(profiles.acquisitionZoneProfile, ["confidenceScore"]), 0.58);
  const corridorSignals = asRecord(getPath(profiles.acquisitionZoneProfile, ["corridorSignals"]));
  const zoneInvestorSaturation = getNumber(corridorSignals, ["investorSaturation"], scaleSignal(input.investorActivity, 55));
  const zoneDistressCorridor = getNumber(corridorSignals, ["distressCorridor"], 55);
  const taxOpportunityScore = getNumber(profiles.taxDealProfile, ["taxOpportunityScore"], 55);
  const taxDealMode = normalize(getString(profiles.taxDealProfile, ["taxDealMode"], "tax_delinquency_watch"));
  const taxReadiness = normalize(getString(profiles.taxDealProfile, ["readinessLevel"], "research_only"));
  const taxConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxDealProfile, ["confidenceScore"]), 0.58);
  const taxSignals = asRecord(getPath(profiles.taxDealProfile, ["taxSignals"]));
  const taxDelinquencyPressure = getNumber(taxSignals, ["delinquencyPressure"], 55);
  const taxAuctionReadiness = getNumber(taxSignals, ["auctionReadiness"], 55);
  const taxEquityPotential = getNumber(taxSignals, ["equityPotential"], 55);
  const taxVacancyDistress = getNumber(taxSignals, ["vacancyDistress"], 55);
  const taxCountyOpportunity = getNumber(taxSignals, ["countyOpportunity"], 55);
  const taxInvestorCompetitionRisk = getNumber(taxSignals, ["investorCompetitionRisk"], zoneInvestorSaturation);
  const lienOpportunityScore = getNumber(profiles.taxLienProfile, ["lienOpportunityScore"], 55);
  const lienConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxLienProfile, ["confidenceScore"]), taxConfidence);
  const lienSignals = asRecord(getPath(profiles.taxLienProfile, ["lienSignals"]));
  const lienEquityProtection = getNumber(lienSignals, ["equityProtection"], taxEquityPotential);
  const lienRedemptionRisk = getNumber(lienSignals, ["redemptionRisk"], input.redemptionPeriodKnown ? 45 : 68);
  const lienCountyProcessConfidence = getNumber(lienSignals, ["countyProcessConfidence"], 55);
  const lienInvestorCompetitionRisk = getNumber(lienSignals, ["investorCompetitionRisk"], taxInvestorCompetitionRisk);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const investorActivityScore = scaleSignal(input.investorActivity, zoneInvestorSaturation);
  const pricingConfidence = confidenceFromOptional(getOptionalNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"]), taxConfidence);
  const redemptionRiskInput = scaleSignal(input.redemptionRiskLevel, input.redemptionPeriodKnown ? 45 : 68);
  const titleComplexityInput = scaleSignal(input.titleComplexityLevel, input.titleStatusKnown ? 48 : 72);
  const riskScore = getRiskScore(input, profiles);
  const riskQuality = 100 - riskScore;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 5);
  const countyRulesUncertain = !input.county || !input.state;
  const deedDataMissing = !hasNumber(input.openingBid) && !hasNumber(input.taxBalance);
  const titleUnknown = input.titleStatusKnown !== true;
  const redemptionUnknown = input.redemptionPeriodKnown !== true;

  return {
    ...profiles,
    requiredMissingData,
    value,
    assessedValue,
    openingBid,
    taxBalance,
    yearsDelinquent,
    bidToValueRatio,
    bidToAssessedRatio,
    equitySpread,
    equitySpreadRatio,
    countyAlphaScore,
    countyConfidence,
    countyCompetitionLevel,
    countyAcquisitionDifficulty,
    zoneScore,
    zoneConfidence,
    zoneInvestorSaturation,
    zoneDistressCorridor,
    taxOpportunityScore,
    taxDealMode,
    taxReadiness,
    taxConfidence,
    taxDelinquencyPressure,
    taxAuctionReadiness,
    taxEquityPotential,
    taxVacancyDistress,
    taxCountyOpportunity,
    taxInvestorCompetitionRisk,
    lienOpportunityScore,
    lienConfidence,
    lienEquityProtection,
    lienRedemptionRisk,
    lienCountyProcessConfidence,
    lienInvestorCompetitionRisk,
    foreclosurePressure,
    distressPressure,
    investorActivityScore,
    pricingConfidence,
    redemptionRiskInput,
    titleComplexityInput,
    riskScore,
    riskQuality,
    dataCompletenessScore,
    countyRulesUncertain,
    deedDataMissing,
    titleUnknown,
    redemptionUnknown,
  };
}

function getDeedSignals(input: TaxDeedIntelligenceInput, context: DeedContext): DeedSignals {
  const equityPotential = clampScore(
    context.equitySpreadRatio * 112 +
    (context.value > 0 ? 10 : 0) +
    Math.min(context.yearsDelinquent, 5) * 2 +
    context.taxEquityPotential * 0.12 +
    context.lienEquityProtection * 0.08 -
    Math.max(0, context.bidToValueRatio - 0.28) * 95,
  );
  const redemptionExposure = clampScore(
    (input.redemptionPeriodKnown ? 24 : 70) +
    context.redemptionRiskInput * 0.32 +
    context.lienRedemptionRisk * 0.18 +
    (input.ownerOccupied ? 16 : 0) +
    (input.auctionDateKnown ? 7 : 0) +
    context.riskScore * 0.12,
  );
  const titleComplexityRisk = clampScore(
    (input.titleStatusKnown ? 24 : 72) +
    context.titleComplexityInput * 0.38 +
    context.riskScore * 0.14 +
    Math.max(0, 58 - context.pricingConfidence * 100) * 0.22 +
    (context.taxBalance > 0 ? 5 : 0) +
    (input.ownerOccupied ? 6 : 0),
  );
  const auctionReadiness = clampScore(
    (input.auctionDateKnown ? 36 : 9) +
    Math.min(context.yearsDelinquent, 5) * 8 +
    (context.openingBid > 0 ? 13 : 0) +
    context.taxAuctionReadiness * 0.2 +
    context.dataCompletenessScore * 0.11 -
    (context.titleUnknown ? 4 : 0),
  );
  const countyConfidence = clampScore(
    context.countyAlphaScore * 0.18 +
    context.zoneScore * 0.18 +
    context.taxCountyOpportunity * 0.16 +
    context.taxOpportunityScore * 0.12 +
    context.lienCountyProcessConfidence * 0.12 +
    context.countyConfidence * 100 * 0.1 +
    context.zoneConfidence * 100 * 0.08 +
    context.taxConfidence * 100 * 0.04 +
    context.lienConfidence * 100 * 0.02 -
    (context.countyRulesUncertain ? 12 : 0) -
    (context.redemptionUnknown ? 8 : 0) -
    (context.titleUnknown ? 8 : 0),
  );
  const investorCompetitionRisk = clampScore(
    context.investorActivityScore * 0.32 +
    context.zoneInvestorSaturation * 0.26 +
    context.taxInvestorCompetitionRisk * 0.16 +
    context.lienInvestorCompetitionRisk * 0.12 +
    context.countyAcquisitionDifficulty * 0.08 +
    riskLevelToScore(context.countyCompetitionLevel) * 0.06 +
    (input.auctionDateKnown ? 8 : 0),
  );
  const distressedOpportunityStrength = clampScore(
    Math.min(context.yearsDelinquent, 5) * 10 +
    context.taxDelinquencyPressure * 0.18 +
    context.taxVacancyDistress * 0.15 +
    context.zoneDistressCorridor * 0.14 +
    context.foreclosurePressure * 0.12 +
    context.distressPressure * 0.13 +
    (input.vacant ? 12 : 0) -
    (input.ownerOccupied ? 12 : 0),
  );

  return {
    equityPotential,
    redemptionExposure,
    titleComplexityRisk,
    auctionReadiness,
    countyConfidence,
    investorCompetitionRisk,
    distressedOpportunityStrength,
  };
}

function calculateDeedOpportunityScore(context: DeedContext, signals: DeedSignals, input: TaxDeedIntelligenceInput) {
  const titleUncertaintyPenalty = input.titleStatusKnown ? 0 : 10;
  const redemptionUncertaintyPenalty = input.redemptionPeriodKnown ? 0 : 8;
  const ownerOccupiedPenalty = input.ownerOccupied ? 9 : 0;
  const competitionPenalty = signals.investorCompetitionRisk >= 75 ? 8 : signals.investorCompetitionRisk >= 65 ? 4 : 0;
  const riskPenalty = context.riskScore >= 72 ? 9 : context.riskScore >= 60 ? 5 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 4) * 1.8;

  return clampScore(
    signals.equityPotential * 0.25 +
    signals.distressedOpportunityStrength * 0.15 +
    signals.auctionReadiness * 0.13 +
    signals.countyConfidence * 0.13 +
    context.taxOpportunityScore * 0.09 +
    context.lienOpportunityScore * 0.05 +
    context.riskQuality * 0.08 +
    context.pricingConfidence * 100 * 0.04 +
    (100 - signals.titleComplexityRisk) * 0.06 +
    (100 - signals.redemptionExposure) * 0.02 -
    titleUncertaintyPenalty -
    redemptionUncertaintyPenalty -
    ownerOccupiedPenalty -
    competitionPenalty -
    riskPenalty -
    missingPenalty,
  );
}

function getDeedOpportunityGrade(score: number): DeedOpportunityGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getDeedSuitability(score: number, signals: DeedSignals, context: DeedContext): DeedSuitability {
  if (score < 35 || context.riskScore >= 84 || signals.equityPotential < 35) return "avoid";
  if (signals.titleComplexityRisk >= 76 || signals.redemptionExposure >= 78) return "high_complexity";
  if (score >= 82 && signals.equityPotential >= 78 && signals.titleComplexityRisk < 56 && signals.redemptionExposure < 56 && signals.countyConfidence >= 70) return "strong_candidate";
  if (score >= 65 && signals.equityPotential >= 62) return "research_candidate";
  if (score >= 48) return "watchlist";

  return "high_complexity";
}

function getReadinessLevel(suitability: DeedSuitability, context: DeedContext, input: TaxDeedIntelligenceInput): DeedReadinessLevel {
  if (suitability === "avoid" || context.riskScore >= 84) return "not_ready";
  if (context.requiredMissingData.length >= 7 || context.deedDataMissing || context.countyRulesUncertain) return "research_only";
  if (
    suitability === "high_complexity" ||
    !input.redemptionPeriodKnown ||
    !input.titleStatusKnown ||
    input.ownerOccupied ||
    input.auctionDateKnown ||
    context.riskScore >= 58
  ) {
    return "watchlist";
  }

  return "review_ready";
}

function getInvestorProfileFit(suitability: DeedSuitability, readiness: DeedReadinessLevel, signals: DeedSignals, context: DeedContext, input: TaxDeedIntelligenceInput): DeedInvestorProfileFit {
  if (suitability === "avoid" || readiness === "not_ready") return "not_recommended";
  if (
    suitability === "high_complexity" ||
    !input.titleStatusKnown ||
    !input.redemptionPeriodKnown ||
    context.countyRulesUncertain ||
    signals.titleComplexityRisk >= 70 ||
    signals.redemptionExposure >= 70 ||
    context.riskScore >= 68
  ) {
    return "institutional_review";
  }
  if (context.requiredMissingData.length > 0 || signals.investorCompetitionRisk >= 68 || input.ownerOccupied) return "conservative";
  if (signals.equityPotential >= 78 && signals.titleComplexityRisk < 52 && signals.redemptionExposure < 52 && signals.distressedOpportunityStrength >= 62) return "aggressive";

  return "balanced";
}

function getLegalReviewRequired(input: TaxDeedIntelligenceInput, context: DeedContext) {
  return (
    !input.redemptionPeriodKnown ||
    context.countyRulesUncertain ||
    input.ownerOccupied === true ||
    input.auctionDateKnown === true ||
    context.openingBid > 0 ||
    context.taxBalance > 0 ||
    context.yearsDelinquent > 0
  );
}

function getTitleReviewRequired(input: TaxDeedIntelligenceInput, context: DeedContext, signals: DeedSignals) {
  return (
    !input.titleStatusKnown ||
    signals.titleComplexityRisk >= 48 ||
    context.openingBid > 0 ||
    context.taxBalance > 0 ||
    context.yearsDelinquent > 0
  );
}

function getHumanReviewRequired(legalReviewRequired: boolean, titleReviewRequired: boolean, readiness: DeedReadinessLevel, context: DeedContext) {
  return legalReviewRequired || titleReviewRequired || readiness !== "not_ready" || context.requiredMissingData.length > 0 || context.riskScore >= 45;
}

function getOpportunitySignals(input: TaxDeedIntelligenceInput, signals: DeedSignals, context: DeedContext, suitability: DeedSuitability) {
  return unique([
    ...(signals.equityPotential >= 70 ? ["Equity spread appears strong relative to opening bid and estimated value."] : []),
    ...(signals.distressedOpportunityStrength >= 62 ? ["Delinquency, vacancy, and distress signals support tax deed research priority."] : []),
    ...(signals.auctionReadiness >= 66 ? ["Known auction or mature delinquency supports auction-readiness research."] : []),
    ...(signals.countyConfidence >= 64 ? ["County alpha, acquisition zone, and tax opportunity profiles support county process confidence."] : []),
    ...(context.taxDealMode === "tax_deed_candidate" ? ["Tax Deal Finder already classifies this as an informational tax deed candidate."] : []),
    ...(context.taxDealMode === "county_auction_candidate" ? ["Tax Deal Finder already classifies this as an informational county auction candidate."] : []),
    ...(input.vacant && !input.ownerOccupied ? ["Vacant non-owner-occupied signal improves investor-safe review posture."] : []),
    ...(suitability === "strong_candidate" ? ["Strong candidate classification is informational only and still requires human, legal, and title review."] : []),
  ]);
}

function getWarningSignals(input: TaxDeedIntelligenceInput, context: DeedContext, signals: DeedSignals, legalReviewRequired: boolean, titleReviewRequired: boolean) {
  return unique([
    ...(legalReviewRequired ? ["Legal review is required before any tax deed interpretation, bid, purchase, possession, assignment, or closing action."] : []),
    ...(titleReviewRequired ? ["Title review is required before any tax deed action or investor-facing conclusion."] : []),
    ...(!input.redemptionPeriodKnown ? ["Redemption period is unknown, creating legal, timing, and title uncertainty."] : []),
    ...(!input.titleStatusKnown ? ["Title condition is unknown, reducing confidence and increasing quiet-title risk awareness."] : []),
    ...(input.ownerOccupied ? ["Owner-occupied property increases compliance and consumer-protection caution."] : []),
    ...(input.auctionDateKnown ? ["Known auction date increases urgency, title risk, and competition risk."] : []),
    ...(signals.titleComplexityRisk >= 70 ? ["Title complexity risk is elevated."] : []),
    ...(signals.redemptionExposure >= 70 ? ["Redemption exposure is elevated."] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["Investor competition risk is high."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is weak for tax deed underwriting."] : []),
    ...(context.riskScore >= 65 ? ["Risk profile is weak and downgrades readiness."] : []),
  ]);
}

function getRiskFlags(input: TaxDeedIntelligenceInput, context: DeedContext, signals: DeedSignals) {
  return unique([
    ...(context.deedDataMissing ? ["missing_opening_bid_or_tax_balance"] : []),
    ...(!input.redemptionPeriodKnown ? ["redemption_period_unknown"] : []),
    ...(!input.titleStatusKnown ? ["title_status_unknown"] : []),
    ...(context.countyRulesUncertain ? ["county_state_rules_uncertain"] : []),
    ...(input.ownerOccupied ? ["owner_occupied_compliance_caution"] : []),
    ...(input.auctionDateKnown ? ["known_auction_date_urgency"] : []),
    ...(signals.titleComplexityRisk >= 70 ? ["high_title_complexity_risk"] : []),
    ...(signals.redemptionExposure >= 70 ? ["high_redemption_exposure"] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["high_investor_competition"] : []),
    ...(signals.equityPotential < 45 ? ["thin_or_unclear_equity"] : []),
    ...(context.riskScore >= 65 ? ["weak_risk_profile"] : []),
    ...(context.pricingConfidence < 0.58 ? ["weak_pricing_confidence"] : []),
  ]);
}

function getResearchSteps(input: TaxDeedIntelligenceInput, context: DeedContext) {
  return unique([
    "Verify parcel number, owner name, assessed value, estimated value, tax balance, opening bid, delinquency years, and auction status from official county records manually.",
    "Review county/state tax deed statutes, redemption rights, notice requirements, auction process, owner-occupancy rules, and post-sale possession limits with qualified counsel.",
    "Confirm deed type, sale instrument, bidder eligibility, deposit rules, payment deadline, cancellation windows, and any redemption or set-aside windows manually.",
    "Order or review title search, mortgage and lien priority, municipal liens, code violations, probate/heirship risk, bankruptcy risk, and title insurability with qualified professionals.",
    "Review quiet-title path, title insurance availability, possession risk, occupancy status, and post-sale marketability before any investor-facing conclusion.",
    "Validate estimated value, assessed value, ARV, equity spread, repair assumptions, and pricing support before any acquisition or watchlist decision.",
    ...(input.auctionDateKnown ? ["Confirm auction date, bidding rules, funding proof, deposit, payment deadline, and post-sale deed delivery timeline manually."] : ["Research whether an auction date, sale date, redemption deadline, or deed issuance timeline exists."] ),
    ...(context.requiredMissingData.length > 0 ? [`Collect missing deed inputs: ${context.requiredMissingData.join(", ")}.`] : []),
  ]);
}

function getDueDiligenceItems(input: TaxDeedIntelligenceInput) {
  return unique([
    "county tax deed sale rules and sale instrument type",
    "redemption period, redemption payoff, and set-aside risk review",
    "notice compliance review by qualified counsel",
    "title search, lien priority, mortgage, municipal lien, code enforcement, and judgment review",
    "quiet-title requirement and title insurance availability",
    "occupancy, possession, owner-occupancy, and tenant-rights review",
    "bankruptcy, probate, heirship, military status, and litigation checks",
    "assessed value, estimated value, ARV, opening bid, and independent value support",
    ...(input.auctionDateKnown ? ["auction registration, deposit, bidder eligibility, funding, and payment deadline review"] : []),
  ]);
}

function calculateConfidence(context: DeedContext, signals: DeedSignals, input: TaxDeedIntelligenceInput) {
  const deedDataConfidence =
    (hasNumber(input.openingBid) || hasNumber(input.taxBalance) ? 0.14 : 0) +
    (hasNumber(input.yearsDelinquent) ? 0.12 : 0) +
    (hasNumber(input.assessedValue) ? 0.1 : 0) +
    (hasNumber(input.estimatedValue) || hasNumber(input.arv) ? 0.1 : 0) +
    (typeof input.auctionDateKnown === "boolean" ? 0.08 : 0) +
    (typeof input.ownerOccupied === "boolean" ? 0.08 : 0) +
    (typeof input.vacant === "boolean" ? 0.06 : 0) +
    (input.redemptionPeriodKnown ? 0.14 : 0) +
    (input.titleStatusKnown ? 0.16 : 0) +
    (hasNumber(input.redemptionRiskLevel) ? 0.06 : 0) +
    (hasNumber(input.titleComplexityLevel) ? 0.06 : 0);
  const intelligenceConfidence = average([
    context.countyConfidence,
    context.zoneConfidence,
    context.taxConfidence,
    context.lienConfidence,
    context.pricingConfidence,
  ]);
  const signalScores = Object.values(signals);
  const signalConsistency = 1 - clamp((Math.max(...signalScores) - Math.min(...signalScores)) / 100, 0, 1);
  const confidence =
    intelligenceConfidence * 0.26 +
    deedDataConfidence * 0.28 +
    context.dataCompletenessScore / 100 * 0.2 +
    signalConsistency * 0.1 +
    context.riskQuality / 100 * 0.1 -
    (input.ownerOccupied ? 0.04 : 0) -
    (signals.titleComplexityRisk >= 70 ? 0.06 : 0) -
    (signals.redemptionExposure >= 70 ? 0.05 : 0) -
    (context.riskScore >= 70 ? 0.1 : context.riskScore >= 58 ? 0.05 : 0);

  return round(clamp(confidence, 0, 1));
}

function getIntelligenceInputsUsed(input: TaxDeedIntelligenceInput) {
  return unique([
    input.taxDealProfile ? "provided_tax_deal_profile" : "tax_deal_finder_mode",
    input.taxLienProfile ? "provided_tax_lien_profile" : "tax_lien_intelligence_agent",
    input.acquisitionZoneProfile ? "provided_acquisition_zone_profile" : "acquisition_zone_intelligence_engine",
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_tax_deal_lien_zone_and_title_signals",
    "manual_county_tax_deed_title_rules_required",
  ]);
}

function getReasoning(params: {
  input: TaxDeedIntelligenceInput;
  context: DeedContext;
  signals: DeedSignals;
  score: number;
  grade: DeedOpportunityGrade;
  suitability: DeedSuitability;
  investorFit: DeedInvestorProfileFit;
  readiness: DeedReadinessLevel;
  confidence: number;
}) {
  const area = [
    params.input.neighborhood,
    params.input.zipCode ? `ZIP ${params.input.zipCode}` : "",
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected tax deed research area";

  return `${area} is graded ${params.grade} with a ${params.score}/100 deed opportunity score, ${params.suitability} suitability, ${params.investorFit} investor fit, and ${params.readiness} readiness. The score uses equity potential ${params.signals.equityPotential}/100, redemption exposure ${params.signals.redemptionExposure}/100, title complexity risk ${params.signals.titleComplexityRisk}/100, auction readiness ${params.signals.auctionReadiness}/100, county confidence ${params.signals.countyConfidence}/100, investor competition risk ${params.signals.investorCompetitionRisk}/100, distressed opportunity strength ${params.signals.distressedOpportunityStrength}/100, and risk quality ${params.context.riskQuality}/100. Confidence is ${params.confidence}. This is informational read-only tax deed intelligence only; it does not scrape county websites, contact anyone, execute outreach, place bids, take possession, generate legal documents, or write to the database.`;
}

export function getTaxDeedIntelligenceAssessment(input: TaxDeedIntelligenceInput = {}): TaxDeedIntelligenceAssessment {
  const context = getDeedContext(input);
  const deedSignals = getDeedSignals(input, context);
  const deedOpportunityScore = calculateDeedOpportunityScore(context, deedSignals, input);
  const deedOpportunityGrade = getDeedOpportunityGrade(deedOpportunityScore);
  const deedSuitability = getDeedSuitability(deedOpportunityScore, deedSignals, context);
  const readinessLevel = getReadinessLevel(deedSuitability, context, input);
  const investorProfileFit = getInvestorProfileFit(deedSuitability, readinessLevel, deedSignals, context, input);
  const legalReviewRequired = getLegalReviewRequired(input, context);
  const titleReviewRequired = getTitleReviewRequired(input, context, deedSignals);
  const humanReviewRequired = getHumanReviewRequired(legalReviewRequired, titleReviewRequired, readinessLevel, context);
  const confidenceScore = calculateConfidence(context, deedSignals, input);

  return {
    deedOpportunityScore,
    deedOpportunityGrade,
    deedSuitability,
    investorProfileFit,
    readinessLevel,
    legalReviewRequired,
    titleReviewRequired,
    humanReviewRequired,
    deedSignals,
    opportunitySignals: getOpportunitySignals(input, deedSignals, context, deedSuitability),
    warningSignals: getWarningSignals(input, context, deedSignals, legalReviewRequired, titleReviewRequired),
    riskFlags: getRiskFlags(input, context, deedSignals),
    recommendedResearchSteps: getResearchSteps(input, context),
    recommendedDueDiligenceItems: getDueDiligenceItems(input),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      signals: deedSignals,
      score: deedOpportunityScore,
      grade: deedOpportunityGrade,
      suitability: deedSuitability,
      investorFit: investorProfileFit,
      readiness: readinessLevel,
      confidence: confidenceScore,
    }),
    complianceNotice: TAX_DEED_COMPLIANCE_NOTICE,
  };
}
