import { getAcquisitionZoneAssessment } from "@/lib/acquisition-zone-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getMarketTargetingAssessment } from "@/lib/market-intelligence-agent";
import { getTaxDealFinderAssessment } from "@/lib/tax-deal-finder-mode";
import { getTaxDeedIntelligenceAssessment } from "@/lib/tax-deed-intelligence-agent";
import { getTaxLienIntelligenceAssessment } from "@/lib/tax-lien-intelligence-agent";

export type CountyAuctionGrade = "A+" | "A" | "B" | "C" | "D";

export type CountyAuctionOpportunityType =
  | "tax_lien_heavy"
  | "tax_deed_heavy"
  | "auction_watchlist"
  | "delinquency_research"
  | "mixed_tax_opportunity"
  | "low_priority";

export type CountyAuctionAcquisitionPriority = "elite" | "high" | "medium" | "low" | "avoid";

export type CountyAuctionReadinessLevel =
  | "not_ready"
  | "research_only"
  | "watchlist"
  | "review_ready";

export type CountyAuctionSignals = {
  delinquencyVolumeStrength: number;
  auctionVolumeStrength: number;
  equityPotential: number;
  countyProcessConfidence: number;
  redemptionClarity: number;
  titleProcessClarity: number;
  investorCompetitionRisk: number;
  distressOpportunityStrength: number;
};

export type CountyAuctionTaxOpportunityInput = {
  location?: string;
  county?: string;
  state?: string;
  auctionDateKnown?: boolean;
  auctionFrequencyKnown?: boolean;
  auctionRulesKnown?: boolean;
  redemptionRulesKnown?: boolean;
  titleProcessKnown?: boolean;
  estimatedDelinquentParcelCount?: number;
  estimatedAuctionParcelCount?: number;
  averageTaxBalance?: number;
  averageAssessedValue?: number;
  averageEstimatedValue?: number;
  foreclosureRate?: number;
  distressRate?: number;
  vacancyRate?: number;
  investorActivity?: number;
  taxDealProfile?: unknown;
  taxLienProfile?: unknown;
  taxDeedProfile?: unknown;
  countyAlphaProfile?: unknown;
  acquisitionZoneProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
  marketTargetingProfile?: unknown;
};

export type CountyAuctionTaxOpportunityAssessment = {
  countyAuctionOpportunityScore: number;
  countyAuctionGrade: CountyAuctionGrade;
  opportunityType: CountyAuctionOpportunityType;
  acquisitionPriority: CountyAuctionAcquisitionPriority;
  readinessLevel: CountyAuctionReadinessLevel;
  legalReviewRequired: boolean;
  titleReviewRequired: boolean;
  humanReviewRequired: boolean;
  auctionSignals: CountyAuctionSignals;
  opportunitySignals: string[];
  warningSignals: string[];
  riskFlags: string[];
  recommendedResearchSteps: string[];
  recommendedDueDiligenceItems: string[];
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
type CountyAuctionContext = ReturnType<typeof getCountyAuctionContext>;

const COUNTY_AUCTION_COMPLIANCE_NOTICE =
  "This is internal read-only county auction and delinquent-tax opportunity intelligence, not legal, tax, title, redemption, bidding, auction, foreclosure, possession, outreach, or investment advice. Verify all county/state tax lien, tax deed, delinquency, redemption, notice, auction, title, quiet-title, bidder eligibility, owner-occupancy, escrow, disclosure, marketing, and closing requirements with a qualified local real estate attorney, tax professional, and title company before any contact, bid, purchase, assignment, marketing, signing, possession action, or closing activity.";

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
  const validValues = values.filter((value) => Number.isFinite(value));

  if (validValues.length === 0) return 0;

  return validValues.reduce((total, value) => total + value, 0) / validValues.length;
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

function volumeStrength(count: number | undefined, thresholds: [number, number, number, number, number]) {
  if (!hasNumber(count) || count <= 0) return 24;

  const [elite, high, medium, watch, low] = thresholds;

  if (count >= elite) return 95;
  if (count >= high) return 86;
  if (count >= medium) return 74;
  if (count >= watch) return 62;
  if (count >= low) return 48;

  return 36;
}

function getRequiredMissingData(input: CountyAuctionTaxOpportunityInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(typeof input.auctionDateKnown !== "boolean" ? ["auction date known flag"] : []),
    ...(typeof input.auctionFrequencyKnown !== "boolean" ? ["auction frequency known flag"] : []),
    ...(typeof input.auctionRulesKnown !== "boolean" ? ["auction rules known flag"] : []),
    ...(typeof input.redemptionRulesKnown !== "boolean" ? ["redemption rules known flag"] : []),
    ...(typeof input.titleProcessKnown !== "boolean" ? ["title process known flag"] : []),
    ...(!hasNumber(input.estimatedDelinquentParcelCount) ? ["estimated delinquent parcel count"] : []),
    ...(!hasNumber(input.estimatedAuctionParcelCount) ? ["estimated auction parcel count"] : []),
    ...(!hasNumber(input.averageTaxBalance) ? ["average tax balance"] : []),
    ...(!hasNumber(input.averageAssessedValue) && !hasNumber(input.averageEstimatedValue) ? ["average assessed value or average estimated value"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.vacancyRate) ? ["vacancy rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
  ]);
}

function getProfiles(input: CountyAuctionTaxOpportunityInput) {
  const countyAlphaProfile = input.countyAlphaProfile ?? getCountyAlphaProfile({
    county: input.county,
    state: input.state,
    assetType: "tax_auction",
  });
  const marketTargetingProfile = input.marketTargetingProfile ?? getMarketTargetingAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: "tax_auction",
    strategy: "tax_auction_research",
    medianPrice: input.averageEstimatedValue ?? input.averageAssessedValue,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    buyerDemandProfile: undefined,
    countyAlphaProfile,
    pricingProfile: input.pricingProfile,
    riskProfile: input.riskProfile,
  });
  const acquisitionZoneProfile = input.acquisitionZoneProfile ?? getAcquisitionZoneAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: "tax_auction",
    strategy: "tax_auction_research",
    medianPrice: input.averageEstimatedValue ?? input.averageAssessedValue,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    vacancyRate: input.vacancyRate,
    investorActivity: input.investorActivity,
    countyAlphaProfile,
    pricingProfile: input.pricingProfile,
    riskProfile: input.riskProfile,
    marketTargetingProfile,
  });
  const taxDealProfile = input.taxDealProfile ?? getTaxDealFinderAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: "tax_auction",
    strategy: "county_auction_research",
    assessedValue: input.averageAssessedValue,
    estimatedValue: input.averageEstimatedValue,
    taxBalance: input.averageTaxBalance,
    auctionDateKnown: input.auctionDateKnown,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    vacancyRate: input.vacancyRate,
    investorActivity: input.investorActivity,
    countyAlphaProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
    marketTargetingProfile,
    acquisitionZoneProfile,
  });
  const taxLienProfile = input.taxLienProfile ?? getTaxLienIntelligenceAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: "tax_auction",
    assessedValue: input.averageAssessedValue,
    estimatedValue: input.averageEstimatedValue,
    taxBalance: input.averageTaxBalance,
    lienAmount: input.averageTaxBalance,
    interestRateKnown: false,
    redemptionPeriodKnown: input.redemptionRulesKnown,
    auctionDateKnown: input.auctionDateKnown,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    taxDealProfile,
    countyAlphaProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
    acquisitionZoneProfile,
  });
  const taxDeedProfile = input.taxDeedProfile ?? getTaxDeedIntelligenceAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: "tax_auction",
    assessedValue: input.averageAssessedValue,
    estimatedValue: input.averageEstimatedValue,
    taxBalance: input.averageTaxBalance,
    openingBid: input.averageTaxBalance,
    redemptionPeriodKnown: input.redemptionRulesKnown,
    redemptionRiskLevel: input.redemptionRulesKnown ? 4 : 8,
    titleStatusKnown: input.titleProcessKnown,
    titleComplexityLevel: input.titleProcessKnown ? 4 : 8,
    auctionDateKnown: input.auctionDateKnown,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    taxDealProfile,
    taxLienProfile,
    countyAlphaProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
    acquisitionZoneProfile,
  });

  return {
    countyAlphaProfile,
    marketTargetingProfile,
    acquisitionZoneProfile,
    taxDealProfile,
    taxLienProfile,
    taxDeedProfile,
  };
}

function getRiskScore(input: CountyAuctionTaxOpportunityInput, profiles: ReturnType<typeof getProfiles>) {
  const directRisk = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return scoreFromOptional(directRisk, 50);

  const readinessRisk = riskLevelToScore(getString(input.riskProfile, ["riskReadiness", "readinessLevel"], "medium"));
  const processUnknownCount = [
    input.auctionFrequencyKnown,
    input.auctionRulesKnown,
    input.redemptionRulesKnown,
    input.titleProcessKnown,
  ].filter((value) => value !== true).length;
  const taxFlags = stringArray(getPath(profiles.taxDealProfile, ["riskFlags"])).length;
  const lienFlags = stringArray(getPath(profiles.taxLienProfile, ["riskFlags"])).length;
  const deedFlags = stringArray(getPath(profiles.taxDeedProfile, ["riskFlags"])).length;
  const zoneWarnings = stringArray(getPath(profiles.acquisitionZoneProfile, ["warningSignals"])).length;
  const deedSuitability = normalize(getString(profiles.taxDeedProfile, ["deedSuitability"], "watchlist"));
  const lienSuitability = normalize(getString(profiles.taxLienProfile, ["lienSuitability"], "watchlist"));
  const suitabilityPenalty =
    (deedSuitability === "avoid" ? 16 : deedSuitability === "high_complexity" ? 10 : deedSuitability === "watchlist" ? 6 : 0) +
    (lienSuitability === "avoid" ? 10 : lienSuitability === "weak_candidate" ? 6 : lienSuitability === "watchlist" ? 4 : 0);

  return clampScore(
    readinessRisk * 0.22 +
    processUnknownCount * 6 +
    taxFlags * 2 +
    lienFlags * 1.7 +
    deedFlags * 1.7 +
    zoneWarnings * 2.5 +
    suitabilityPenalty +
    4,
  );
}

function getCountyAuctionContext(input: CountyAuctionTaxOpportunityInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const averageValue = input.averageEstimatedValue ?? input.averageAssessedValue ?? 0;
  const averageAssessedValue = input.averageAssessedValue ?? averageValue;
  const averageTaxBalance = input.averageTaxBalance ?? 0;
  const taxToValueRatio = averageValue > 0 ? averageTaxBalance / averageValue : 0;
  const assessedToEstimatedRatio = averageValue > 0 ? averageAssessedValue / averageValue : 0;
  const equitySpreadRatio = averageValue > 0 ? Math.max(0, averageValue - averageTaxBalance) / averageValue : 0;
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = confidenceFromOptional(getOptionalNumber(profiles.countyAlphaProfile, ["confidenceScore"]), 0.55);
  const countyAcquisitionDifficulty = getNumber(profiles.countyAlphaProfile, ["acquisitionDifficulty"], 55);
  const countyDistressLevel = getNumber(profiles.countyAlphaProfile, ["distressLevel"], 55);
  const marketAcquisitionScore = getNumber(profiles.marketTargetingProfile, ["acquisitionScore"], 55);
  const marketConfidence = confidenceFromOptional(getOptionalNumber(profiles.marketTargetingProfile, ["confidenceScore"]), 0.55);
  const zoneScore = getNumber(profiles.acquisitionZoneProfile, ["zoneScore"], 55);
  const zoneConfidence = confidenceFromOptional(getOptionalNumber(profiles.acquisitionZoneProfile, ["confidenceScore"]), 0.58);
  const corridorSignals = asRecord(getPath(profiles.acquisitionZoneProfile, ["corridorSignals"]));
  const zoneInvestorSaturation = getNumber(corridorSignals, ["investorSaturation"], scaleSignal(input.investorActivity, 55));
  const zoneDistressCorridor = getNumber(corridorSignals, ["distressCorridor"], 55);
  const taxOpportunityScore = getNumber(profiles.taxDealProfile, ["taxOpportunityScore"], 55);
  const taxDealMode = normalize(getString(profiles.taxDealProfile, ["taxDealMode"], "tax_delinquency_watch"));
  const taxConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxDealProfile, ["confidenceScore"]), 0.58);
  const taxSignals = asRecord(getPath(profiles.taxDealProfile, ["taxSignals"]));
  const taxDelinquencyPressure = getNumber(taxSignals, ["delinquencyPressure"], 55);
  const taxAuctionReadiness = getNumber(taxSignals, ["auctionReadiness"], 55);
  const taxEquityPotential = getNumber(taxSignals, ["equityPotential"], 55);
  const taxInvestorCompetitionRisk = getNumber(taxSignals, ["investorCompetitionRisk"], zoneInvestorSaturation);
  const lienOpportunityScore = getNumber(profiles.taxLienProfile, ["lienOpportunityScore"], 55);
  const lienSuitability = normalize(getString(profiles.taxLienProfile, ["lienSuitability"], "watchlist"));
  const lienConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxLienProfile, ["confidenceScore"]), taxConfidence);
  const lienSignals = asRecord(getPath(profiles.taxLienProfile, ["lienSignals"]));
  const lienCountyProcessConfidence = getNumber(lienSignals, ["countyProcessConfidence"], 55);
  const lienInvestorCompetitionRisk = getNumber(lienSignals, ["investorCompetitionRisk"], taxInvestorCompetitionRisk);
  const lienRedemptionRisk = getNumber(lienSignals, ["redemptionRisk"], input.redemptionRulesKnown ? 45 : 68);
  const deedOpportunityScore = getNumber(profiles.taxDeedProfile, ["deedOpportunityScore"], 55);
  const deedSuitability = normalize(getString(profiles.taxDeedProfile, ["deedSuitability"], "watchlist"));
  const deedConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxDeedProfile, ["confidenceScore"]), taxConfidence);
  const deedSignals = asRecord(getPath(profiles.taxDeedProfile, ["deedSignals"]));
  const deedCountyConfidence = getNumber(deedSignals, ["countyConfidence"], 55);
  const deedInvestorCompetitionRisk = getNumber(deedSignals, ["investorCompetitionRisk"], lienInvestorCompetitionRisk);
  const deedRedemptionExposure = getNumber(deedSignals, ["redemptionExposure"], input.redemptionRulesKnown ? 45 : 74);
  const deedTitleComplexityRisk = getNumber(deedSignals, ["titleComplexityRisk"], input.titleProcessKnown ? 45 : 74);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const vacancyPressure = rateToPressure(input.vacancyRate, 8, 12);
  const investorActivityScore = scaleSignal(input.investorActivity, zoneInvestorSaturation);
  const pricingConfidence = confidenceFromOptional(getOptionalNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"]), average([taxConfidence, lienConfidence, deedConfidence]));
  const riskScore = getRiskScore(input, profiles);
  const riskQuality = 100 - riskScore;
  const processUnknownCount = [
    input.auctionDateKnown,
    input.auctionFrequencyKnown,
    input.auctionRulesKnown,
    input.redemptionRulesKnown,
    input.titleProcessKnown,
  ].filter((value) => value !== true).length;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 5);
  const countyRulesUncertain = !input.county || !input.state;
  const countyProcessUnclear = input.auctionRulesKnown !== true || input.auctionFrequencyKnown !== true;
  const taxValueDataMissing = !hasNumber(input.averageTaxBalance) || (!hasNumber(input.averageAssessedValue) && !hasNumber(input.averageEstimatedValue));

  return {
    ...profiles,
    requiredMissingData,
    averageValue,
    averageAssessedValue,
    averageTaxBalance,
    taxToValueRatio,
    assessedToEstimatedRatio,
    equitySpreadRatio,
    countyAlphaScore,
    countyConfidence,
    countyAcquisitionDifficulty,
    countyDistressLevel,
    marketAcquisitionScore,
    marketConfidence,
    zoneScore,
    zoneConfidence,
    zoneInvestorSaturation,
    zoneDistressCorridor,
    taxOpportunityScore,
    taxDealMode,
    taxConfidence,
    taxDelinquencyPressure,
    taxAuctionReadiness,
    taxEquityPotential,
    taxInvestorCompetitionRisk,
    lienOpportunityScore,
    lienSuitability,
    lienConfidence,
    lienCountyProcessConfidence,
    lienInvestorCompetitionRisk,
    lienRedemptionRisk,
    deedOpportunityScore,
    deedSuitability,
    deedConfidence,
    deedCountyConfidence,
    deedInvestorCompetitionRisk,
    deedRedemptionExposure,
    deedTitleComplexityRisk,
    foreclosurePressure,
    distressPressure,
    vacancyPressure,
    investorActivityScore,
    pricingConfidence,
    riskScore,
    riskQuality,
    processUnknownCount,
    dataCompletenessScore,
    countyRulesUncertain,
    countyProcessUnclear,
    taxValueDataMissing,
  };
}

function getCountyAuctionSignals(input: CountyAuctionTaxOpportunityInput, context: CountyAuctionContext): CountyAuctionSignals {
  const delinquencyVolumeStrength = clampScore(
    volumeStrength(input.estimatedDelinquentParcelCount, [1200, 700, 350, 125, 40]) * 0.74 +
    context.taxDelinquencyPressure * 0.16 +
    context.countyDistressLevel * 0.1,
  );
  const auctionVolumeStrength = clampScore(
    volumeStrength(input.estimatedAuctionParcelCount, [250, 125, 65, 25, 8]) * 0.74 +
    context.taxAuctionReadiness * 0.18 +
    (input.auctionDateKnown ? 8 : -4),
  );
  const equityPotential = clampScore(
    context.equitySpreadRatio * 108 +
    (context.averageValue > 0 ? 9 : 0) +
    context.taxEquityPotential * 0.12 -
    Math.max(0, context.taxToValueRatio - 0.16) * 120 -
    Math.max(0, context.assessedToEstimatedRatio - 1.08) * 25,
  );
  const redemptionClarity = clampScore(
    (input.redemptionRulesKnown ? 82 : 18) +
    context.lienConfidence * 100 * 0.08 -
    context.lienRedemptionRisk * 0.1 -
    context.deedRedemptionExposure * 0.08,
  );
  const titleProcessClarity = clampScore(
    (input.titleProcessKnown ? 82 : 16) +
    context.deedConfidence * 100 * 0.1 -
    context.deedTitleComplexityRisk * 0.14 -
    context.riskScore * 0.08,
  );
  const countyProcessConfidence = clampScore(
    context.countyAlphaScore * 0.16 +
    context.zoneScore * 0.14 +
    context.marketAcquisitionScore * 0.1 +
    context.taxOpportunityScore * 0.1 +
    context.lienCountyProcessConfidence * 0.08 +
    context.deedCountyConfidence * 0.08 +
    redemptionClarity * 0.12 +
    titleProcessClarity * 0.12 +
    context.countyConfidence * 100 * 0.05 +
    context.zoneConfidence * 100 * 0.05 -
    (input.auctionRulesKnown ? 0 : 10) -
    (input.auctionFrequencyKnown ? 0 : 7) -
    (context.countyRulesUncertain ? 12 : 0),
  );
  const investorCompetitionRisk = clampScore(
    context.investorActivityScore * 0.32 +
    context.zoneInvestorSaturation * 0.22 +
    context.taxInvestorCompetitionRisk * 0.14 +
    context.lienInvestorCompetitionRisk * 0.12 +
    context.deedInvestorCompetitionRisk * 0.1 +
    context.countyAcquisitionDifficulty * 0.06 +
    (input.auctionDateKnown ? 8 : 0) +
    (auctionVolumeStrength >= 70 ? 4 : 0),
  );
  const distressOpportunityStrength = clampScore(
    delinquencyVolumeStrength * 0.2 +
    context.taxDelinquencyPressure * 0.16 +
    context.zoneDistressCorridor * 0.14 +
    context.foreclosurePressure * 0.14 +
    context.distressPressure * 0.16 +
    context.vacancyPressure * 0.1 +
    auctionVolumeStrength * 0.1,
  );

  return {
    delinquencyVolumeStrength,
    auctionVolumeStrength,
    equityPotential,
    countyProcessConfidence,
    redemptionClarity,
    titleProcessClarity,
    investorCompetitionRisk,
    distressOpportunityStrength,
  };
}

function calculateCountyAuctionOpportunityScore(context: CountyAuctionContext, signals: CountyAuctionSignals) {
  const processUncertaintyPenalty = Math.max(0, context.processUnknownCount - 1) * 2.4;
  const competitionPenalty = signals.investorCompetitionRisk >= 78 ? 6 : signals.investorCompetitionRisk >= 68 ? 3 : 0;
  const riskPenalty = context.riskScore >= 72 ? 6 : context.riskScore >= 60 ? 4 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 4) * 1.8;
  const rawScore =
    signals.delinquencyVolumeStrength * 0.16 +
    signals.auctionVolumeStrength * 0.12 +
    signals.equityPotential * 0.16 +
    signals.distressOpportunityStrength * 0.12 +
    signals.countyProcessConfidence * 0.15 +
    signals.redemptionClarity * 0.08 +
    signals.titleProcessClarity * 0.08 +
    context.riskQuality * 0.06 +
    context.pricingConfidence * 100 * 0.03 +
    average([context.taxOpportunityScore, context.lienOpportunityScore, context.deedOpportunityScore]) * 0.06 -
    processUncertaintyPenalty -
    competitionPenalty -
    riskPenalty -
    missingPenalty;
  const researchFloor =
    signals.delinquencyVolumeStrength >= 70 &&
    signals.auctionVolumeStrength >= 60 &&
    signals.equityPotential >= 70
      ? 60 - (context.riskScore >= 72 ? 4 : 0) - (signals.investorCompetitionRisk >= 72 ? 3 : 0) - (context.processUnknownCount >= 4 ? 2 : 0)
      : 0;

  return clampScore(Math.max(rawScore, researchFloor));
}

function getCountyAuctionGrade(score: number): CountyAuctionGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getOpportunityType(score: number, signals: CountyAuctionSignals, context: CountyAuctionContext, input: CountyAuctionTaxOpportunityInput): CountyAuctionOpportunityType {
  if (score < 38 || context.riskScore >= 94) return "low_priority";

  const lienStrong =
    context.lienOpportunityScore >= 66 &&
    ["strong_candidate", "research_candidate"].includes(context.lienSuitability);
  const deedStrong =
    context.deedOpportunityScore >= 62 &&
    ["strong_candidate", "research_candidate", "high_complexity"].includes(context.deedSuitability);

  if (lienStrong && deedStrong) return "mixed_tax_opportunity";
  if (deedStrong && (signals.auctionVolumeStrength >= 58 || context.taxDealMode === "tax_deed_candidate")) return "tax_deed_heavy";
  if (lienStrong && context.taxDealMode !== "tax_deed_candidate") return "tax_lien_heavy";
  if (input.auctionDateKnown && signals.auctionVolumeStrength >= 56) return "auction_watchlist";
  if (signals.delinquencyVolumeStrength >= 54 || context.taxDealMode === "tax_delinquency_watch") return "delinquency_research";

  return "low_priority";
}

function getPriority(score: number, type: CountyAuctionOpportunityType, signals: CountyAuctionSignals, context: CountyAuctionContext): CountyAuctionAcquisitionPriority {
  if (type === "low_priority" || context.riskScore >= 94 || score < 35) return "avoid";
  if (score >= 84 && signals.countyProcessConfidence >= 72 && signals.investorCompetitionRisk < 64 && context.riskScore < 48) return "elite";
  if (score >= 70 && context.riskScore < 64 && signals.countyProcessConfidence >= 54) return "high";
  if (score >= 52) return "medium";

  return "low";
}

function getReadinessLevel(type: CountyAuctionOpportunityType, context: CountyAuctionContext, input: CountyAuctionTaxOpportunityInput): CountyAuctionReadinessLevel {
  if (type === "low_priority" || context.riskScore >= 94) return "not_ready";
  if (context.requiredMissingData.length >= 7 || context.countyRulesUncertain || context.taxValueDataMissing || context.processUnknownCount >= 3) return "research_only";
  if (
    input.auctionRulesKnown !== true ||
    input.redemptionRulesKnown !== true ||
    input.titleProcessKnown !== true ||
    input.auctionDateKnown === true ||
    context.riskScore >= 58
  ) {
    return "watchlist";
  }

  return "review_ready";
}

function getLegalReviewRequired(input: CountyAuctionTaxOpportunityInput, context: CountyAuctionContext, type: CountyAuctionOpportunityType) {
  return (
    type !== "low_priority" ||
    input.redemptionRulesKnown !== true ||
    input.auctionRulesKnown !== true ||
    context.countyRulesUncertain ||
    context.averageTaxBalance > 0 ||
    (input.estimatedAuctionParcelCount ?? 0) > 0 ||
    (input.estimatedDelinquentParcelCount ?? 0) > 0
  );
}

function getTitleReviewRequired(input: CountyAuctionTaxOpportunityInput, context: CountyAuctionContext, type: CountyAuctionOpportunityType) {
  return (
    type !== "low_priority" ||
    input.titleProcessKnown !== true ||
    context.deedTitleComplexityRisk >= 48 ||
    context.averageTaxBalance > 0 ||
    (input.estimatedAuctionParcelCount ?? 0) > 0
  );
}

function getHumanReviewRequired(legalReviewRequired: boolean, titleReviewRequired: boolean, readiness: CountyAuctionReadinessLevel, context: CountyAuctionContext) {
  return legalReviewRequired || titleReviewRequired || readiness !== "not_ready" || context.requiredMissingData.length > 0 || context.riskScore >= 45;
}

function getOpportunitySignals(type: CountyAuctionOpportunityType, signals: CountyAuctionSignals, context: CountyAuctionContext) {
  return unique([
    ...(signals.delinquencyVolumeStrength >= 66 ? ["Estimated delinquent parcel volume supports county-level delinquency research."] : []),
    ...(signals.auctionVolumeStrength >= 62 ? ["Estimated auction parcel volume supports auction watchlist research."] : []),
    ...(signals.equityPotential >= 68 ? ["Average tax-balance-to-value spread supports equity-oriented research."] : []),
    ...(signals.distressOpportunityStrength >= 62 ? ["Foreclosure, distress, vacancy, and zone signals support delinquent-tax opportunity research."] : []),
    ...(signals.countyProcessConfidence >= 62 ? ["County alpha, acquisition zone, and tax profiles support county process confidence."] : []),
    ...(type === "tax_lien_heavy" ? ["Tax lien profile appears stronger than deed profile for informational county targeting."] : []),
    ...(type === "tax_deed_heavy" ? ["Tax deed profile appears stronger than lien profile for informational county targeting."] : []),
    ...(type === "mixed_tax_opportunity" ? ["Lien and deed signals are both active, suggesting mixed tax-opportunity research."] : []),
    ...(context.zoneDistressCorridor >= 60 ? ["Acquisition zone distress corridor supports future pre-foreclosure and delinquency intelligence."] : []),
  ]);
}

function getWarningSignals(input: CountyAuctionTaxOpportunityInput, context: CountyAuctionContext, signals: CountyAuctionSignals, legalReviewRequired: boolean, titleReviewRequired: boolean) {
  return unique([
    ...(legalReviewRequired ? ["Legal review is required before any county auction, delinquent-tax, lien, deed, bidding, outreach, or acquisition action."] : []),
    ...(titleReviewRequired ? ["Title review is required before any auction or tax-sale opportunity conclusion."] : []),
    ...(input.auctionRulesKnown !== true ? ["County auction rules are unknown or unverified, reducing process confidence."] : []),
    ...(input.auctionFrequencyKnown !== true ? ["Auction frequency is unknown, limiting targeting reliability."] : []),
    ...(input.redemptionRulesKnown !== true ? ["Redemption rules are unknown, creating legal and timing uncertainty."] : []),
    ...(input.titleProcessKnown !== true ? ["Title process is unknown, increasing title and quiet-title uncertainty."] : []),
    ...(input.auctionDateKnown ? ["Known auction date increases urgency, competition, and process-risk sensitivity."] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["Investor competition risk is high for county auction opportunities."] : []),
    ...(signals.countyProcessConfidence < 45 ? ["County process confidence is weak and should remain research-only."] : []),
    ...(context.riskScore >= 65 ? ["Risk profile is weak and downgrades readiness."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is weak for county-level tax opportunity targeting."] : []),
  ]);
}

function getRiskFlags(input: CountyAuctionTaxOpportunityInput, context: CountyAuctionContext, signals: CountyAuctionSignals) {
  return unique([
    ...(context.countyRulesUncertain ? ["county_state_rules_uncertain"] : []),
    ...(context.countyProcessUnclear ? ["county_auction_process_unclear"] : []),
    ...(input.redemptionRulesKnown !== true ? ["redemption_rules_unknown"] : []),
    ...(input.titleProcessKnown !== true ? ["title_process_unknown"] : []),
    ...(input.auctionDateKnown ? ["known_auction_date_urgency"] : []),
    ...(context.taxValueDataMissing ? ["missing_average_tax_or_value_data"] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["high_investor_competition"] : []),
    ...(signals.countyProcessConfidence < 45 ? ["weak_county_process_confidence"] : []),
    ...(signals.equityPotential < 45 ? ["thin_or_unclear_average_equity"] : []),
    ...(context.riskScore >= 65 ? ["weak_risk_profile"] : []),
    ...(context.pricingConfidence < 0.58 ? ["weak_pricing_confidence"] : []),
  ]);
}

function getResearchSteps(input: CountyAuctionTaxOpportunityInput, context: CountyAuctionContext) {
  return unique([
    "Manually verify county auction calendar visibility, delinquent-tax list availability, parcel count, sale type, and sale instrument from official county sources.",
    "Review county/state tax lien, tax deed, delinquency, redemption, notice, auction, bidder eligibility, and owner-occupancy rules with qualified counsel.",
    "Verify title process, post-sale deed process, quiet-title requirements, title insurance path, possession limits, and cancellation or set-aside windows with qualified professionals.",
    "Validate estimated delinquent parcel count, estimated auction parcel count, average tax balance, average assessed value, and average estimated value before watchlist decisions.",
    "Compare county alpha, acquisition zone quality, distress pressure, vacancy pressure, investor activity, and pricing confidence before prioritizing lead targeting.",
    ...(input.auctionDateKnown ? ["Confirm auction date, registration rules, deposit, payment deadline, bidder eligibility, and post-sale documentation timeline manually."] : ["Research whether auction dates, sale cadence, redemption deadlines, or delinquent-list publication dates are visible."] ),
    ...(context.requiredMissingData.length > 0 ? [`Collect missing county auction inputs: ${context.requiredMissingData.join(", ")}.`] : []),
  ]);
}

function getDueDiligenceItems(input: CountyAuctionTaxOpportunityInput) {
  return unique([
    "county delinquent-tax list availability and update cadence",
    "auction calendar, sale cadence, and auction format review",
    "tax lien vs tax deed vs certificate sale instrument review",
    "redemption rules, payoff rules, notice rules, and cancellation windows",
    "title process, quiet-title path, title insurance availability, and surviving lien review",
    "bidder eligibility, deposit rules, payment deadlines, and funding proof requirements",
    "owner-occupancy, tenant, possession, bankruptcy, probate, and litigation caution review",
    "average tax balance, assessed value, estimated value, and equity-spread validation",
    ...(input.auctionDateKnown ? ["active auction date and deadline verification"] : []),
  ]);
}

function getLeadSources(signals: CountyAuctionSignals, type: CountyAuctionOpportunityType) {
  if (type === "low_priority") {
    return ["Do not prioritize county auction lead sources until county process and opportunity signals improve."];
  }

  return unique([
    "county tax delinquency list",
    ...(signals.auctionVolumeStrength >= 55 ? ["county auction calendar", "treasurer sale notices", "sheriff sale notices"] : []),
    ...(signals.delinquencyVolumeStrength >= 60 ? ["delinquent parcel research queue", "pre-foreclosure research list"] : []),
    ...(signals.distressOpportunityStrength >= 60 ? ["vacant property list", "driving-for-dollars distress routes"] : []),
    ...(signals.equityPotential >= 62 ? ["high-equity delinquency research list"] : []),
    "county parcel research queue",
  ]).slice(0, 8);
}

function getSellerProfiles(signals: CountyAuctionSignals) {
  return unique([
    ...(signals.delinquencyVolumeStrength >= 55 ? ["tax-delinquent owners"] : []),
    ...(signals.distressOpportunityStrength >= 55 ? ["vacant property owners", "distressed-property owners"] : []),
    ...(signals.auctionVolumeStrength >= 60 ? ["pre-auction research candidates"] : []),
    ...(signals.equityPotential >= 60 ? ["equity-rich owners with tax pressure"] : []),
    "owners requiring compliance-reviewed human research only",
  ]).slice(0, 7);
}

function getBuyerProfiles(type: CountyAuctionOpportunityType, signals: CountyAuctionSignals) {
  return unique([
    ...(type !== "low_priority" ? ["cash buyers comfortable with title due diligence"] : []),
    ...(type === "tax_lien_heavy" || type === "mixed_tax_opportunity" ? ["tax lien investors"] : []),
    ...(type === "tax_deed_heavy" || type === "mixed_tax_opportunity" ? ["tax deed investors"] : []),
    ...(type === "auction_watchlist" ? ["county auction buyers"] : []),
    ...(signals.equityPotential >= 60 ? ["value-add investors"] : []),
    ...(signals.distressOpportunityStrength >= 58 ? ["rehab buyers", "fix-and-flip investors"] : []),
    ...(signals.titleProcessClarity < 50 || signals.redemptionClarity < 50 ? ["institutional or attorney-guided tax-sale reviewers"] : []),
  ]).slice(0, 7);
}

function calculateConfidence(context: CountyAuctionContext, signals: CountyAuctionSignals, input: CountyAuctionTaxOpportunityInput) {
  const processConfidence =
    (typeof input.auctionDateKnown === "boolean" ? 0.1 : 0) +
    (input.auctionFrequencyKnown ? 0.14 : 0) +
    (input.auctionRulesKnown ? 0.18 : 0) +
    (input.redemptionRulesKnown ? 0.2 : 0) +
    (input.titleProcessKnown ? 0.2 : 0);
  const dataConfidence =
    (hasNumber(input.estimatedDelinquentParcelCount) ? 0.13 : 0) +
    (hasNumber(input.estimatedAuctionParcelCount) ? 0.13 : 0) +
    (hasNumber(input.averageTaxBalance) ? 0.14 : 0) +
    (hasNumber(input.averageAssessedValue) || hasNumber(input.averageEstimatedValue) ? 0.14 : 0) +
    (hasNumber(input.foreclosureRate) ? 0.08 : 0) +
    (hasNumber(input.distressRate) ? 0.08 : 0) +
    (hasNumber(input.vacancyRate) ? 0.08 : 0) +
    (hasNumber(input.investorActivity) ? 0.08 : 0);
  const intelligenceConfidence = average([
    context.countyConfidence,
    context.marketConfidence,
    context.zoneConfidence,
    context.taxConfidence,
    context.lienConfidence,
    context.deedConfidence,
    context.pricingConfidence,
  ]);
  const signalValues = Object.values(signals);
  const signalConsistency = 1 - clamp((Math.max(...signalValues) - Math.min(...signalValues)) / 100, 0, 1);
  const confidence =
    intelligenceConfidence * 0.24 +
    processConfidence * 0.25 +
    dataConfidence * 0.2 +
    context.dataCompletenessScore / 100 * 0.16 +
    signalConsistency * 0.08 +
    context.riskQuality / 100 * 0.07 -
    (context.processUnknownCount >= 3 ? 0.08 : 0) -
    (signals.investorCompetitionRisk >= 75 ? 0.04 : 0) -
    (context.riskScore >= 70 ? 0.09 : context.riskScore >= 58 ? 0.05 : 0);

  return round(clamp(confidence, 0, 1));
}

function getIntelligenceInputsUsed(input: CountyAuctionTaxOpportunityInput) {
  return unique([
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.marketTargetingProfile ? "provided_market_targeting_profile" : "market_intelligence_agent",
    input.acquisitionZoneProfile ? "provided_acquisition_zone_profile" : "acquisition_zone_intelligence_engine",
    input.taxDealProfile ? "provided_tax_deal_profile" : "tax_deal_finder_mode",
    input.taxLienProfile ? "provided_tax_lien_profile" : "tax_lien_intelligence_agent",
    input.taxDeedProfile ? "provided_tax_deed_profile" : "tax_deed_intelligence_agent",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_tax_profiles_process_and_zone_signals",
    "manual_county_auction_rules_required",
  ]);
}

function getReasoning(params: {
  input: CountyAuctionTaxOpportunityInput;
  context: CountyAuctionContext;
  signals: CountyAuctionSignals;
  score: number;
  grade: CountyAuctionGrade;
  type: CountyAuctionOpportunityType;
  priority: CountyAuctionAcquisitionPriority;
  readiness: CountyAuctionReadinessLevel;
  confidence: number;
}) {
  const area = [
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected county auction research area";

  return `${area} is graded ${params.grade} with a ${params.score}/100 county auction opportunity score, ${params.type} opportunity type, ${params.priority} acquisition priority, and ${params.readiness} readiness. The score uses delinquency volume strength ${params.signals.delinquencyVolumeStrength}/100, auction volume strength ${params.signals.auctionVolumeStrength}/100, equity potential ${params.signals.equityPotential}/100, county process confidence ${params.signals.countyProcessConfidence}/100, redemption clarity ${params.signals.redemptionClarity}/100, title process clarity ${params.signals.titleProcessClarity}/100, investor competition risk ${params.signals.investorCompetitionRisk}/100, distress opportunity strength ${params.signals.distressOpportunityStrength}/100, and risk quality ${params.context.riskQuality}/100. Confidence is ${params.confidence}. This is informational read-only county auction and delinquent-tax intelligence only; it does not scrape county websites, contact anyone, execute outreach, place bids, make legal decisions, participate in auctions, or write to the database.`;
}

export function getCountyAuctionTaxOpportunityAssessment(input: CountyAuctionTaxOpportunityInput = {}): CountyAuctionTaxOpportunityAssessment {
  const context = getCountyAuctionContext(input);
  const auctionSignals = getCountyAuctionSignals(input, context);
  const countyAuctionOpportunityScore = calculateCountyAuctionOpportunityScore(context, auctionSignals);
  const countyAuctionGrade = getCountyAuctionGrade(countyAuctionOpportunityScore);
  const opportunityType = getOpportunityType(countyAuctionOpportunityScore, auctionSignals, context, input);
  const acquisitionPriority = getPriority(countyAuctionOpportunityScore, opportunityType, auctionSignals, context);
  const readinessLevel = getReadinessLevel(opportunityType, context, input);
  const legalReviewRequired = getLegalReviewRequired(input, context, opportunityType);
  const titleReviewRequired = getTitleReviewRequired(input, context, opportunityType);
  const humanReviewRequired = getHumanReviewRequired(legalReviewRequired, titleReviewRequired, readinessLevel, context);
  const confidenceScore = calculateConfidence(context, auctionSignals, input);

  return {
    countyAuctionOpportunityScore,
    countyAuctionGrade,
    opportunityType,
    acquisitionPriority,
    readinessLevel,
    legalReviewRequired,
    titleReviewRequired,
    humanReviewRequired,
    auctionSignals,
    opportunitySignals: getOpportunitySignals(opportunityType, auctionSignals, context),
    warningSignals: getWarningSignals(input, context, auctionSignals, legalReviewRequired, titleReviewRequired),
    riskFlags: getRiskFlags(input, context, auctionSignals),
    recommendedResearchSteps: getResearchSteps(input, context),
    recommendedDueDiligenceItems: getDueDiligenceItems(input),
    recommendedLeadSources: getLeadSources(auctionSignals, opportunityType),
    recommendedSellerProfiles: getSellerProfiles(auctionSignals),
    recommendedBuyerProfiles: getBuyerProfiles(opportunityType, auctionSignals),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      signals: auctionSignals,
      score: countyAuctionOpportunityScore,
      grade: countyAuctionGrade,
      type: opportunityType,
      priority: acquisitionPriority,
      readiness: readinessLevel,
      confidence: confidenceScore,
    }),
    complianceNotice: COUNTY_AUCTION_COMPLIANCE_NOTICE,
  };
}
