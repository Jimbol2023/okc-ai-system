import { getAcquisitionZoneAssessment } from "@/lib/acquisition-zone-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getCountyAuctionTaxOpportunityAssessment } from "@/lib/county-auction-tax-opportunity-agent";
import { getPreForeclosureDelinquencyAssessment } from "@/lib/pre-foreclosure-delinquency-intelligence";
import { getTaxDealFinderAssessment } from "@/lib/tax-deal-finder-mode";
import { getTaxDeedIntelligenceAssessment } from "@/lib/tax-deed-intelligence-agent";
import { getTaxLienIntelligenceAssessment } from "@/lib/tax-lien-intelligence-agent";

export type AuctionReadinessGrade = "A+" | "A" | "B" | "C" | "D";

export type AuctionReadinessClassification =
  | "institutional_ready"
  | "advanced_review"
  | "research_only"
  | "high_risk"
  | "not_ready";

export type AuctionAcquisitionViability =
  | "strong_candidate"
  | "research_candidate"
  | "watchlist"
  | "high_complexity"
  | "avoid";

export type AuctionReadinessSignals = {
  titleReadiness: number;
  legalReadiness: number;
  diligenceCompleteness: number;
  equityStrength: number;
  auctionClarity: number;
  fundingPreparedness: number;
  buyerDemandStrength: number;
  investorCompetitionRisk: number;
};

export type AuctionReadinessInput = {
  location?: string;
  county?: string;
  state?: string;
  assetType?: string;
  estimatedValue?: number;
  assessedValue?: number;
  arv?: number;
  openingBid?: number;
  lienAmount?: number;
  taxBalance?: number;
  titleStatusKnown?: boolean;
  titleComplexityLevel?: number;
  redemptionRulesKnown?: boolean;
  auctionRulesKnown?: boolean;
  auctionDateKnown?: boolean;
  fundingVerified?: boolean;
  buyerDemandConfirmed?: boolean;
  noticeOfDefaultKnown?: boolean;
  bankruptcyKnown?: boolean;
  probateKnown?: boolean;
  ownerOccupied?: boolean;
  vacant?: boolean;
  foreclosureRate?: number;
  distressRate?: number;
  investorActivity?: number;
  taxDealProfile?: unknown;
  taxLienProfile?: unknown;
  taxDeedProfile?: unknown;
  countyAuctionProfile?: unknown;
  preForeclosureProfile?: unknown;
  acquisitionZoneProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
  countyAlphaProfile?: unknown;
};

export type AuctionReadinessAssessment = {
  auctionReadinessScore: number;
  readinessGrade: AuctionReadinessGrade;
  readinessClassification: AuctionReadinessClassification;
  acquisitionViability: AuctionAcquisitionViability;
  institutionalReviewRequired: boolean;
  legalReviewRequired: boolean;
  titleReviewRequired: boolean;
  humanReviewRequired: boolean;
  readinessSignals: AuctionReadinessSignals;
  opportunitySignals: string[];
  warningSignals: string[];
  riskFlags: string[];
  recommendedResearchSteps: string[];
  recommendedDueDiligenceItems: string[];
  readinessBlockers: string[];
  confidenceScore: number;
  requiredMissingData: string[];
  intelligenceInputsUsed: string[];
  reasoning: string;
  complianceNotice: string;
};

type JsonRecord = Record<string, unknown>;
type AuctionReadinessContext = ReturnType<typeof getAuctionReadinessContext>;

const AUCTION_READINESS_COMPLIANCE_NOTICE =
  "This is internal read-only auction readiness intelligence, not legal, tax, title, redemption, bidding, auction, foreclosure, possession, outreach, financing, or investment advice. Verify all county/state auction, tax lien, tax deed, redemption, notice, title, quiet-title, bidder eligibility, funding, owner-occupancy, escrow, disclosure, marketing, and closing requirements with a qualified local real estate attorney, tax professional, lender/funding partner, and title company before any contact, bid, purchase, assignment, marketing, signing, possession action, or closing activity.";

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

function getRequiredMissingData(input: AuctionReadinessInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!hasNumber(input.estimatedValue) && !hasNumber(input.arv) && !hasNumber(input.assessedValue) ? ["estimated value, ARV, or assessed value"] : []),
    ...(!hasNumber(input.openingBid) && !hasNumber(input.lienAmount) && !hasNumber(input.taxBalance) ? ["opening bid, lien amount, or tax balance"] : []),
    ...(typeof input.titleStatusKnown !== "boolean" ? ["title status known flag"] : []),
    ...(!hasNumber(input.titleComplexityLevel) ? ["title complexity level"] : []),
    ...(typeof input.redemptionRulesKnown !== "boolean" ? ["redemption rules known flag"] : []),
    ...(typeof input.auctionRulesKnown !== "boolean" ? ["auction rules known flag"] : []),
    ...(typeof input.auctionDateKnown !== "boolean" ? ["auction date known flag"] : []),
    ...(typeof input.fundingVerified !== "boolean" ? ["funding verified flag"] : []),
    ...(typeof input.buyerDemandConfirmed !== "boolean" ? ["buyer demand confirmed flag"] : []),
    ...(typeof input.noticeOfDefaultKnown !== "boolean" ? ["notice of default known flag"] : []),
    ...(typeof input.bankruptcyKnown !== "boolean" ? ["bankruptcy known flag"] : []),
    ...(typeof input.probateKnown !== "boolean" ? ["probate known flag"] : []),
    ...(typeof input.ownerOccupied !== "boolean" ? ["owner occupancy flag"] : []),
    ...(typeof input.vacant !== "boolean" ? ["vacancy flag"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
  ]);
}

function getProfiles(input: AuctionReadinessInput) {
  const countyAlphaProfile = input.countyAlphaProfile ?? getCountyAlphaProfile({
    county: input.county,
    state: input.state,
    assetType: input.assetType,
  });
  const acquisitionZoneProfile = input.acquisitionZoneProfile ?? getAcquisitionZoneAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: input.assetType,
    strategy: "auction_readiness_review",
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
    assetType: input.assetType,
    strategy: "auction_readiness_review",
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance ?? input.lienAmount ?? input.openingBid,
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
    assetType: input.assetType,
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance ?? input.lienAmount ?? input.openingBid,
    lienAmount: input.lienAmount ?? input.taxBalance ?? input.openingBid,
    interestRateKnown: false,
    redemptionPeriodKnown: input.redemptionRulesKnown,
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
  const taxDeedProfile = input.taxDeedProfile ?? getTaxDeedIntelligenceAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: input.assetType,
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance ?? input.lienAmount ?? input.openingBid,
    openingBid: input.openingBid ?? input.taxBalance ?? input.lienAmount,
    redemptionPeriodKnown: input.redemptionRulesKnown,
    redemptionRiskLevel: input.redemptionRulesKnown ? 4 : 8,
    titleStatusKnown: input.titleStatusKnown,
    titleComplexityLevel: input.titleComplexityLevel,
    auctionDateKnown: input.auctionDateKnown,
    ownerOccupied: input.ownerOccupied,
    vacant: input.vacant,
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
  const countyAuctionProfile = input.countyAuctionProfile ?? getCountyAuctionTaxOpportunityAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    auctionDateKnown: input.auctionDateKnown,
    auctionFrequencyKnown: false,
    auctionRulesKnown: input.auctionRulesKnown,
    redemptionRulesKnown: input.redemptionRulesKnown,
    titleProcessKnown: input.titleStatusKnown,
    averageTaxBalance: input.taxBalance ?? input.lienAmount ?? input.openingBid,
    averageAssessedValue: input.assessedValue,
    averageEstimatedValue: input.estimatedValue ?? input.arv,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    taxDealProfile,
    taxLienProfile,
    taxDeedProfile,
    countyAlphaProfile,
    acquisitionZoneProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
  });
  const preForeclosureProfile = input.preForeclosureProfile ?? getPreForeclosureDelinquencyAssessment({
    location: input.location,
    county: input.county,
    state: input.state,
    assetType: input.assetType,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    assessedValue: input.assessedValue,
    taxBalance: input.taxBalance ?? input.lienAmount ?? input.openingBid,
    noticeOfDefaultKnown: input.noticeOfDefaultKnown,
    lisPendensKnown: false,
    auctionDateKnown: input.auctionDateKnown,
    bankruptcyKnown: input.bankruptcyKnown,
    probateKnown: input.probateKnown,
    ownerOccupied: input.ownerOccupied,
    vacant: input.vacant,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    investorActivity: input.investorActivity,
    taxDealProfile,
    countyAuctionProfile,
    countyAlphaProfile,
    acquisitionZoneProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
  });

  return {
    countyAlphaProfile,
    acquisitionZoneProfile,
    taxDealProfile,
    taxLienProfile,
    taxDeedProfile,
    countyAuctionProfile,
    preForeclosureProfile,
  };
}

function getRiskScore(input: AuctionReadinessInput, profiles: ReturnType<typeof getProfiles>) {
  const directRisk = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return scoreFromOptional(directRisk, 50);

  const readinessRisk = riskLevelToScore(getString(input.riskProfile, ["riskReadiness", "readinessLevel"], "medium"));
  const taxFlags = stringArray(getPath(profiles.taxDealProfile, ["riskFlags"])).length;
  const lienFlags = stringArray(getPath(profiles.taxLienProfile, ["riskFlags"])).length;
  const deedFlags = stringArray(getPath(profiles.taxDeedProfile, ["riskFlags"])).length;
  const auctionFlags = stringArray(getPath(profiles.countyAuctionProfile, ["riskFlags"])).length;
  const preForeclosureFlags = stringArray(getPath(profiles.preForeclosureProfile, ["riskFlags"])).length;
  const titleComplexity = scaleSignal(input.titleComplexityLevel, input.titleStatusKnown ? 48 : 72);
  const processUnknownCount = [
    input.titleStatusKnown,
    input.redemptionRulesKnown,
    input.auctionRulesKnown,
    input.fundingVerified,
  ].filter((value) => value !== true).length;
  const legalKnownRisk =
    (input.noticeOfDefaultKnown ? 10 : 0) +
    (input.auctionDateKnown ? 12 : 0) +
    (input.bankruptcyKnown ? 28 : 0) +
    (input.probateKnown ? 18 : 0) +
    (input.ownerOccupied ? 14 : 0);

  return clampScore(
    readinessRisk * 0.16 +
    titleComplexity * 0.18 +
    processUnknownCount * 7 +
    legalKnownRisk +
    taxFlags * 1.8 +
    lienFlags * 1.6 +
    deedFlags * 1.6 +
    auctionFlags * 1.8 +
    preForeclosureFlags * 1.7 +
    5,
  );
}

function getAuctionReadinessContext(input: AuctionReadinessInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const value = input.estimatedValue ?? input.arv ?? input.assessedValue ?? 0;
  const auctionExposure = Math.max(input.openingBid ?? 0, input.lienAmount ?? 0, input.taxBalance ?? 0);
  const totalLienTaxExposure = (input.lienAmount ?? 0) + (input.taxBalance ?? 0);
  const underwritingExposure = Math.max(auctionExposure, totalLienTaxExposure);
  const equitySpread = value > 0 ? Math.max(0, value - underwritingExposure) : 0;
  const equitySpreadRatio = value > 0 ? equitySpread / value : 0;
  const bidToValueRatio = value > 0 ? auctionExposure / value : 0;
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = confidenceFromOptional(getOptionalNumber(profiles.countyAlphaProfile, ["confidenceScore"]), 0.55);
  const zoneScore = getNumber(profiles.acquisitionZoneProfile, ["zoneScore"], 55);
  const zoneConfidence = confidenceFromOptional(getOptionalNumber(profiles.acquisitionZoneProfile, ["confidenceScore"]), 0.58);
  const corridorSignals = asRecord(getPath(profiles.acquisitionZoneProfile, ["corridorSignals"]));
  const zoneInvestorSaturation = getNumber(corridorSignals, ["investorSaturation"], scaleSignal(input.investorActivity, 55));
  const taxOpportunityScore = getNumber(profiles.taxDealProfile, ["taxOpportunityScore"], 55);
  const taxConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxDealProfile, ["confidenceScore"]), 0.58);
  const lienOpportunityScore = getNumber(profiles.taxLienProfile, ["lienOpportunityScore"], 55);
  const lienConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxLienProfile, ["confidenceScore"]), taxConfidence);
  const lienSignals = asRecord(getPath(profiles.taxLienProfile, ["lienSignals"]));
  const lienInvestorCompetitionRisk = getNumber(lienSignals, ["investorCompetitionRisk"], zoneInvestorSaturation);
  const deedOpportunityScore = getNumber(profiles.taxDeedProfile, ["deedOpportunityScore"], 55);
  const deedSuitability = normalize(getString(profiles.taxDeedProfile, ["deedSuitability"], "watchlist"));
  const deedConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxDeedProfile, ["confidenceScore"]), taxConfidence);
  const deedSignals = asRecord(getPath(profiles.taxDeedProfile, ["deedSignals"]));
  const deedTitleComplexityRisk = getNumber(deedSignals, ["titleComplexityRisk"], input.titleStatusKnown ? 45 : 74);
  const deedRedemptionExposure = getNumber(deedSignals, ["redemptionExposure"], input.redemptionRulesKnown ? 45 : 74);
  const deedInvestorCompetitionRisk = getNumber(deedSignals, ["investorCompetitionRisk"], lienInvestorCompetitionRisk);
  const countyAuctionScore = getNumber(profiles.countyAuctionProfile, ["countyAuctionOpportunityScore"], 55);
  const countyAuctionConfidence = confidenceFromOptional(getOptionalNumber(profiles.countyAuctionProfile, ["confidenceScore"]), taxConfidence);
  const countyAuctionSignals = asRecord(getPath(profiles.countyAuctionProfile, ["auctionSignals"]));
  const countyProcessConfidence = getNumber(countyAuctionSignals, ["countyProcessConfidence"], 45);
  const redemptionClarity = getNumber(countyAuctionSignals, ["redemptionClarity"], input.redemptionRulesKnown ? 78 : 22);
  const titleProcessClarity = getNumber(countyAuctionSignals, ["titleProcessClarity"], input.titleStatusKnown ? 78 : 22);
  const countyAuctionCompetitionRisk = getNumber(countyAuctionSignals, ["investorCompetitionRisk"], deedInvestorCompetitionRisk);
  const preForeclosureScore = getNumber(profiles.preForeclosureProfile, ["preForeclosureOpportunityScore"], 55);
  const preForeclosureConfidence = confidenceFromOptional(getOptionalNumber(profiles.preForeclosureProfile, ["confidenceScore"]), taxConfidence);
  const preForeclosureSignals = asRecord(getPath(profiles.preForeclosureProfile, ["distressSignals"]));
  const legalComplexityRisk = getNumber(preForeclosureSignals, ["legalComplexityRisk"], 50);
  const ownerSensitivityRisk = getNumber(preForeclosureSignals, ["ownerSensitivityRisk"], input.ownerOccupied ? 68 : 35);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const investorActivityScore = scaleSignal(input.investorActivity, zoneInvestorSaturation);
  const pricingConfidence = confidenceFromOptional(getOptionalNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"]), taxConfidence);
  const titleComplexityInput = scaleSignal(input.titleComplexityLevel, input.titleStatusKnown ? 45 : 72);
  const riskScore = getRiskScore(input, profiles);
  const riskQuality = 100 - riskScore;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 4.8);
  const criticalProcessUnknown =
    input.titleStatusKnown !== true ||
    input.redemptionRulesKnown !== true ||
    input.auctionRulesKnown !== true ||
    input.fundingVerified !== true;
  const countyRulesUncertain = !input.county || !input.state;

  return {
    ...profiles,
    requiredMissingData,
    value,
    auctionExposure,
    totalLienTaxExposure,
    underwritingExposure,
    equitySpread,
    equitySpreadRatio,
    bidToValueRatio,
    countyAlphaScore,
    countyConfidence,
    zoneScore,
    zoneConfidence,
    zoneInvestorSaturation,
    taxOpportunityScore,
    taxConfidence,
    lienOpportunityScore,
    lienConfidence,
    lienInvestorCompetitionRisk,
    deedOpportunityScore,
    deedSuitability,
    deedConfidence,
    deedTitleComplexityRisk,
    deedRedemptionExposure,
    deedInvestorCompetitionRisk,
    countyAuctionScore,
    countyAuctionConfidence,
    countyProcessConfidence,
    redemptionClarity,
    titleProcessClarity,
    countyAuctionCompetitionRisk,
    preForeclosureScore,
    preForeclosureConfidence,
    legalComplexityRisk,
    ownerSensitivityRisk,
    foreclosurePressure,
    distressPressure,
    investorActivityScore,
    pricingConfidence,
    titleComplexityInput,
    riskScore,
    riskQuality,
    dataCompletenessScore,
    criticalProcessUnknown,
    countyRulesUncertain,
  };
}

function getReadinessSignals(input: AuctionReadinessInput, context: AuctionReadinessContext): AuctionReadinessSignals {
  const titleReadiness = clampScore(
    (input.titleStatusKnown ? 58 : 12) +
    (100 - context.titleComplexityInput) * 0.24 +
    (100 - context.deedTitleComplexityRisk) * 0.22 +
    context.titleProcessClarity * 0.16 -
    (input.bankruptcyKnown ? 10 : 0) -
    (input.probateKnown ? 8 : 0),
  );
  const legalReadiness = clampScore(
    (input.redemptionRulesKnown ? 40 : 8) +
    (input.auctionRulesKnown ? 24 : 6) +
    (100 - context.legalComplexityRisk) * 0.2 +
    (100 - context.deedRedemptionExposure) * 0.12 +
    context.redemptionClarity * 0.1 -
    (input.ownerOccupied ? 10 : 0) -
    (input.bankruptcyKnown ? 20 : 0) -
    (input.probateKnown ? 12 : 0) -
    (input.noticeOfDefaultKnown ? 5 : 0),
  );
  const diligenceCompleteness = clampScore(
    context.dataCompletenessScore * 0.45 +
    average([
      context.countyConfidence,
      context.zoneConfidence,
      context.taxConfidence,
      context.lienConfidence,
      context.deedConfidence,
      context.countyAuctionConfidence,
      context.preForeclosureConfidence,
    ]) * 100 * 0.35 +
    (input.titleStatusKnown ? 6 : 0) +
    (input.redemptionRulesKnown ? 5 : 0) +
    (input.auctionRulesKnown ? 5 : 0) +
    (input.fundingVerified ? 4 : 0),
  );
  const equityStrength = clampScore(
    context.equitySpreadRatio * 112 +
    (context.value > 0 ? 8 : 0) +
    average([context.taxOpportunityScore, context.lienOpportunityScore, context.deedOpportunityScore]) * 0.08 -
    Math.max(0, context.bidToValueRatio - 0.28) * 90,
  );
  const auctionClarity = clampScore(
    (input.auctionDateKnown ? 36 : 10) +
    (input.auctionRulesKnown ? 32 : 8) +
    context.countyProcessConfidence * 0.18 +
    context.countyAuctionScore * 0.1 +
    (input.redemptionRulesKnown ? 6 : -8),
  );
  const fundingPreparedness = clampScore(
    (input.fundingVerified ? 78 : 20) +
    (context.auctionExposure > 0 ? 8 : 0) +
    equityStrength * 0.08 +
    context.pricingConfidence * 100 * 0.06 -
    (input.bankruptcyKnown ? 5 : 0),
  );
  const buyerDemandStrength = clampScore(
    (input.buyerDemandConfirmed ? 72 : 28) +
    context.zoneScore * 0.08 +
    average([context.taxOpportunityScore, context.countyAuctionScore, context.preForeclosureScore]) * 0.08 +
    (equityStrength >= 70 ? 6 : 0) -
    (context.riskScore >= 70 ? 6 : 0),
  );
  const investorCompetitionRisk = clampScore(
    context.investorActivityScore * 0.28 +
    context.zoneInvestorSaturation * 0.2 +
    context.lienInvestorCompetitionRisk * 0.12 +
    context.deedInvestorCompetitionRisk * 0.12 +
    context.countyAuctionCompetitionRisk * 0.14 +
    (input.auctionDateKnown ? 8 : 0) +
    (buyerDemandStrength >= 70 ? 5 : 0),
  );

  return {
    titleReadiness,
    legalReadiness,
    diligenceCompleteness,
    equityStrength,
    auctionClarity,
    fundingPreparedness,
    buyerDemandStrength,
    investorCompetitionRisk,
  };
}

function calculateAuctionReadinessScore(context: AuctionReadinessContext, signals: AuctionReadinessSignals, input: AuctionReadinessInput) {
  const processPenalty =
    (input.titleStatusKnown ? 0 : 8) +
    (input.redemptionRulesKnown ? 0 : 7) +
    (input.auctionRulesKnown ? 0 : 6) +
    (input.fundingVerified ? 0 : 6);
  const legalPenalty =
    (input.bankruptcyKnown ? 14 : 0) +
    (input.probateKnown ? 9 : 0) +
    (input.ownerOccupied ? 7 : 0) +
    (input.noticeOfDefaultKnown ? 4 : 0);
  const competitionPenalty = signals.investorCompetitionRisk >= 78 ? 7 : signals.investorCompetitionRisk >= 68 ? 4 : 0;
  const riskPenalty = context.riskScore >= 76 ? 9 : context.riskScore >= 62 ? 5 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 4) * 1.5;

  return clampScore(
    signals.titleReadiness * 0.16 +
    signals.legalReadiness * 0.16 +
    signals.diligenceCompleteness * 0.14 +
    signals.equityStrength * 0.15 +
    signals.auctionClarity * 0.12 +
    signals.fundingPreparedness * 0.12 +
    signals.buyerDemandStrength * 0.08 +
    (100 - signals.investorCompetitionRisk) * 0.07 -
    processPenalty -
    legalPenalty -
    competitionPenalty -
    riskPenalty -
    missingPenalty,
  );
}

function getReadinessGrade(score: number): AuctionReadinessGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getReadinessClassification(score: number, signals: AuctionReadinessSignals, context: AuctionReadinessContext, input: AuctionReadinessInput): AuctionReadinessClassification {
  if (score < 32 || context.riskScore >= 88 || signals.equityStrength < 30) return "not_ready";
  if (
    input.bankruptcyKnown ||
    input.probateKnown ||
    signals.titleReadiness < 38 ||
    signals.legalReadiness < 38 ||
    context.riskScore >= 72 ||
    signals.investorCompetitionRisk >= 82
  ) {
    return "high_risk";
  }
  if (
    score >= 86 &&
    signals.titleReadiness >= 78 &&
    signals.legalReadiness >= 78 &&
    signals.diligenceCompleteness >= 78 &&
    signals.fundingPreparedness >= 76 &&
    context.criticalProcessUnknown === false &&
    context.riskScore < 52
  ) {
    return "institutional_ready";
  }
  if (score >= 68 && signals.titleReadiness >= 58 && signals.legalReadiness >= 58 && signals.diligenceCompleteness >= 64) return "advanced_review";

  return "research_only";
}

function getAcquisitionViability(score: number, classification: AuctionReadinessClassification, signals: AuctionReadinessSignals, context: AuctionReadinessContext): AuctionAcquisitionViability {
  if (classification === "not_ready" || score < 34 || context.riskScore >= 88 || signals.equityStrength < 32) return "avoid";
  if (classification === "high_risk" || signals.titleReadiness < 42 || signals.legalReadiness < 42) return "high_complexity";
  if (score >= 82 && signals.equityStrength >= 74 && signals.fundingPreparedness >= 72 && signals.buyerDemandStrength >= 68) return "strong_candidate";
  if (score >= 64 && signals.equityStrength >= 58) return "research_candidate";
  if (score >= 46) return "watchlist";

  return "high_complexity";
}

function getInstitutionalReviewRequired(classification: AuctionReadinessClassification, signals: AuctionReadinessSignals, context: AuctionReadinessContext, input: AuctionReadinessInput) {
  return (
    classification === "high_risk" ||
    input.titleStatusKnown !== true ||
    scaleSignal(input.titleComplexityLevel, 50) >= 70 ||
    input.redemptionRulesKnown !== true ||
    input.bankruptcyKnown === true ||
    input.probateKnown === true ||
    input.ownerOccupied === true ||
    signals.titleReadiness < 58 ||
    signals.legalReadiness < 58 ||
    context.riskScore >= 64
  );
}

function getLegalReviewRequired(input: AuctionReadinessInput, signals: AuctionReadinessSignals, context: AuctionReadinessContext) {
  return (
    input.redemptionRulesKnown !== true ||
    input.auctionRulesKnown !== true ||
    input.noticeOfDefaultKnown === true ||
    input.bankruptcyKnown === true ||
    input.probateKnown === true ||
    input.ownerOccupied === true ||
    signals.legalReadiness < 72 ||
    context.countyRulesUncertain
  );
}

function getTitleReviewRequired(input: AuctionReadinessInput, signals: AuctionReadinessSignals) {
  return input.titleStatusKnown !== true || signals.titleReadiness < 72 || scaleSignal(input.titleComplexityLevel, 50) >= 55;
}

function getHumanReviewRequired(institutionalReviewRequired: boolean, legalReviewRequired: boolean, titleReviewRequired: boolean, classification: AuctionReadinessClassification, context: AuctionReadinessContext) {
  return (
    institutionalReviewRequired ||
    legalReviewRequired ||
    titleReviewRequired ||
    classification !== "not_ready" ||
    context.requiredMissingData.length > 0 ||
    context.riskScore >= 45
  );
}

function getReadinessBlockers(input: AuctionReadinessInput, context: AuctionReadinessContext, signals: AuctionReadinessSignals) {
  return unique([
    ...(input.titleStatusKnown !== true ? ["Title status is unknown."] : []),
    ...(scaleSignal(input.titleComplexityLevel, 0) >= 70 ? ["Title complexity is elevated."] : []),
    ...(input.redemptionRulesKnown !== true ? ["Redemption rules are unknown or unverified."] : []),
    ...(input.auctionRulesKnown !== true ? ["Auction rules are unknown or unverified."] : []),
    ...(input.fundingVerified !== true ? ["Funding is not verified."] : []),
    ...(input.buyerDemandConfirmed !== true ? ["Buyer demand is not confirmed."] : []),
    ...(input.bankruptcyKnown ? ["Bankruptcy signal requires legal review."] : []),
    ...(input.probateKnown ? ["Probate signal requires legal/title review."] : []),
    ...(input.ownerOccupied ? ["Owner-occupied status requires heightened compliance review."] : []),
    ...(signals.titleReadiness < 45 ? ["Title readiness is weak."] : []),
    ...(signals.legalReadiness < 45 ? ["Legal readiness is weak."] : []),
    ...(signals.diligenceCompleteness < 55 ? ["Diligence completeness is weak."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is weak."] : []),
    ...(context.riskScore >= 65 ? ["Risk profile is weak."] : []),
  ]);
}

function getOpportunitySignals(signals: AuctionReadinessSignals, classification: AuctionReadinessClassification, context: AuctionReadinessContext) {
  return unique([
    ...(signals.equityStrength >= 70 ? ["Equity strength is favorable relative to bid, lien, tax exposure, and estimated value."] : []),
    ...(signals.buyerDemandStrength >= 68 ? ["Buyer demand confirmation and market signals support advanced review potential."] : []),
    ...(signals.auctionClarity >= 65 ? ["Auction date/rules and county auction profile support auction clarity."] : []),
    ...(signals.diligenceCompleteness >= 70 ? ["Diligence completeness is strong enough for structured human review."] : []),
    ...(context.countyAuctionScore >= 62 ? ["County auction profile supports watchlist compatibility."] : []),
    ...(context.deedOpportunityScore >= 62 ? ["Tax deed profile supports deed-oriented review compatibility."] : []),
    ...(context.lienOpportunityScore >= 62 ? ["Tax lien profile supports lien-oriented review compatibility."] : []),
    ...(classification === "advanced_review" ? ["Advanced review classification is active; execution still requires human/legal approval."] : []),
    ...(classification === "institutional_ready" ? ["Institutional-ready classification is informational only and still requires final human, legal, title, and funding approval."] : []),
  ]);
}

function getWarningSignals(input: AuctionReadinessInput, signals: AuctionReadinessSignals, classification: AuctionReadinessClassification, institutionalReviewRequired: boolean, legalReviewRequired: boolean, titleReviewRequired: boolean) {
  return unique([
    ...(institutionalReviewRequired ? ["Institutional review is required before any auction-related action or investor-facing conclusion."] : []),
    ...(legalReviewRequired ? ["Legal review is required before any auction, lien, deed, foreclosure, bidding, purchase, or owner-facing action."] : []),
    ...(titleReviewRequired ? ["Title review is required before any auction readiness conclusion."] : []),
    ...(input.titleStatusKnown !== true ? ["Title status is unknown, reducing title readiness."] : []),
    ...(input.redemptionRulesKnown !== true ? ["Redemption rules are unknown, reducing legal readiness."] : []),
    ...(input.auctionRulesKnown !== true ? ["Auction rules are unknown, reducing auction clarity."] : []),
    ...(input.fundingVerified !== true ? ["Funding is not verified, reducing funding preparedness."] : []),
    ...(input.buyerDemandConfirmed !== true ? ["Buyer demand is not confirmed."] : []),
    ...(input.ownerOccupied ? ["Owner-occupied status increases compliance and consumer-protection caution."] : []),
    ...(input.bankruptcyKnown ? ["Bankruptcy signal creates legal complexity and blocks readiness without counsel review."] : []),
    ...(input.probateKnown ? ["Probate signal creates title/legal complexity and blocks readiness without counsel/title review."] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["Investor competition risk is high."] : []),
    ...(classification === "high_risk" ? ["High-risk classification prevents advanced readiness."] : []),
  ]);
}

function getRiskFlags(input: AuctionReadinessInput, context: AuctionReadinessContext, signals: AuctionReadinessSignals) {
  return unique([
    ...(input.titleStatusKnown !== true ? ["title_status_unknown"] : []),
    ...(scaleSignal(input.titleComplexityLevel, 0) >= 70 ? ["high_title_complexity"] : []),
    ...(input.redemptionRulesKnown !== true ? ["redemption_rules_unknown"] : []),
    ...(input.auctionRulesKnown !== true ? ["auction_rules_unknown"] : []),
    ...(input.fundingVerified !== true ? ["funding_not_verified"] : []),
    ...(input.buyerDemandConfirmed !== true ? ["buyer_demand_not_confirmed"] : []),
    ...(input.noticeOfDefaultKnown ? ["notice_of_default_detected"] : []),
    ...(input.bankruptcyKnown ? ["bankruptcy_review_required"] : []),
    ...(input.probateKnown ? ["probate_review_required"] : []),
    ...(input.ownerOccupied ? ["owner_occupied_compliance_caution"] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["high_investor_competition"] : []),
    ...(signals.titleReadiness < 45 ? ["weak_title_readiness"] : []),
    ...(signals.legalReadiness < 45 ? ["weak_legal_readiness"] : []),
    ...(signals.fundingPreparedness < 45 ? ["weak_funding_preparedness"] : []),
    ...(signals.equityStrength < 45 ? ["thin_or_unclear_equity"] : []),
    ...(context.riskScore >= 65 ? ["weak_risk_profile"] : []),
    ...(context.pricingConfidence < 0.58 ? ["weak_pricing_confidence"] : []),
  ]);
}

function getResearchSteps(input: AuctionReadinessInput, context: AuctionReadinessContext) {
  return unique([
    "Verify auction date, sale type, bidder eligibility, deposit rules, payment deadlines, cancellation windows, and post-sale documentation manually.",
    "Review county/state auction, tax lien, tax deed, redemption, foreclosure, notice, title, quiet-title, owner-occupancy, and possession rules with qualified counsel.",
    "Verify title status, title complexity, lien priority, mortgage position, municipal liens, code violations, probate, bankruptcy, litigation, and title insurability with qualified professionals.",
    "Confirm funding source, available cash, deposit ability, payment deadline readiness, proof-of-funds posture, and holding-cost assumptions before advanced review.",
    "Validate buyer demand, exit path, estimated value, ARV, assessed value, opening bid, lien amount, tax balance, and equity spread before any investor-facing conclusion.",
    ...(input.buyerDemandConfirmed ? ["Confirm buyer demand source, buyer type, price band, proof-of-funds expectations, and exit price support."] : ["Research buyer demand before treating this as an auction-ready opportunity."] ),
    ...(context.requiredMissingData.length > 0 ? [`Collect missing auction readiness inputs: ${context.requiredMissingData.join(", ")}.`] : []),
  ]);
}

function getDueDiligenceItems(input: AuctionReadinessInput) {
  return unique([
    "auction rules, sale instrument, bidder eligibility, registration, deposit, and payment deadline",
    "redemption rules, cancellation windows, set-aside risk, notice compliance, and post-sale challenge risk",
    "title search, lien priority, mortgage, municipal lien, code enforcement, judgment, bankruptcy, probate, and litigation review",
    "quiet-title path, title insurance availability, possession risk, owner-occupancy, and tenant-rights review",
    "funding verification, proof of funds, transactional funding availability, deposit logistics, and closing cash requirements",
    "buyer demand confirmation, exit price support, holding cost, repair assumptions, and resale liquidity review",
    "value support, assessed value, ARV, opening bid, lien amount, tax balance, and equity spread validation",
    ...(input.auctionDateKnown ? ["auction date, bid deadline, deposit deadline, payment deadline, and deed delivery timeline"] : []),
  ]);
}

function calculateConfidence(context: AuctionReadinessContext, signals: AuctionReadinessSignals, input: AuctionReadinessInput) {
  const processConfidence =
    (input.titleStatusKnown ? 0.16 : 0) +
    (hasNumber(input.titleComplexityLevel) ? 0.08 : 0) +
    (input.redemptionRulesKnown ? 0.16 : 0) +
    (input.auctionRulesKnown ? 0.14 : 0) +
    (typeof input.auctionDateKnown === "boolean" ? 0.08 : 0) +
    (input.fundingVerified ? 0.12 : 0) +
    (input.buyerDemandConfirmed ? 0.1 : 0);
  const dataConfidence =
    (hasNumber(input.estimatedValue) || hasNumber(input.arv) || hasNumber(input.assessedValue) ? 0.16 : 0) +
    (hasNumber(input.openingBid) ? 0.11 : 0) +
    (hasNumber(input.lienAmount) || hasNumber(input.taxBalance) ? 0.11 : 0) +
    (typeof input.noticeOfDefaultKnown === "boolean" ? 0.08 : 0) +
    (typeof input.bankruptcyKnown === "boolean" ? 0.08 : 0) +
    (typeof input.probateKnown === "boolean" ? 0.08 : 0) +
    (typeof input.ownerOccupied === "boolean" ? 0.08 : 0) +
    (typeof input.vacant === "boolean" ? 0.06 : 0) +
    (hasNumber(input.foreclosureRate) ? 0.06 : 0) +
    (hasNumber(input.distressRate) ? 0.06 : 0) +
    (hasNumber(input.investorActivity) ? 0.06 : 0);
  const intelligenceConfidence = average([
    context.countyConfidence,
    context.zoneConfidence,
    context.taxConfidence,
    context.lienConfidence,
    context.deedConfidence,
    context.countyAuctionConfidence,
    context.preForeclosureConfidence,
    context.pricingConfidence,
  ]);
  const signalValues = Object.values(signals);
  const signalConsistency = 1 - clamp((Math.max(...signalValues) - Math.min(...signalValues)) / 100, 0, 1);
  const confidence =
    intelligenceConfidence * 0.25 +
    processConfidence * 0.27 +
    dataConfidence * 0.18 +
    context.dataCompletenessScore / 100 * 0.14 +
    signalConsistency * 0.08 +
    context.riskQuality / 100 * 0.08 -
    (signals.titleReadiness < 45 ? 0.05 : 0) -
    (signals.legalReadiness < 45 ? 0.05 : 0) -
    (context.riskScore >= 70 ? 0.08 : context.riskScore >= 58 ? 0.04 : 0);

  return round(clamp(confidence, 0, 1));
}

function getIntelligenceInputsUsed(input: AuctionReadinessInput) {
  return unique([
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.acquisitionZoneProfile ? "provided_acquisition_zone_profile" : "acquisition_zone_intelligence_engine",
    input.taxDealProfile ? "provided_tax_deal_profile" : "tax_deal_finder_mode",
    input.taxLienProfile ? "provided_tax_lien_profile" : "tax_lien_intelligence_agent",
    input.taxDeedProfile ? "provided_tax_deed_profile" : "tax_deed_intelligence_agent",
    input.countyAuctionProfile ? "provided_county_auction_profile" : "county_auction_tax_opportunity_agent",
    input.preForeclosureProfile ? "provided_pre_foreclosure_profile" : "pre_foreclosure_delinquency_intelligence",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_title_legal_tax_auction_and_pre_foreclosure_signals",
    "manual_auction_title_legal_funding_review_required",
  ]);
}

function getReasoning(params: {
  input: AuctionReadinessInput;
  context: AuctionReadinessContext;
  signals: AuctionReadinessSignals;
  score: number;
  grade: AuctionReadinessGrade;
  classification: AuctionReadinessClassification;
  viability: AuctionAcquisitionViability;
  confidence: number;
}) {
  const area = [
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected auction readiness area";

  return `${area} is graded ${params.grade} with a ${params.score}/100 auction readiness score, ${params.classification} readiness classification, and ${params.viability} acquisition viability. The score uses title readiness ${params.signals.titleReadiness}/100, legal readiness ${params.signals.legalReadiness}/100, diligence completeness ${params.signals.diligenceCompleteness}/100, equity strength ${params.signals.equityStrength}/100, auction clarity ${params.signals.auctionClarity}/100, funding preparedness ${params.signals.fundingPreparedness}/100, buyer demand strength ${params.signals.buyerDemandStrength}/100, investor competition risk ${params.signals.investorCompetitionRisk}/100, and risk quality ${params.context.riskQuality}/100. Confidence is ${params.confidence}. This is informational read-only auction readiness intelligence only; it does not scrape county websites, contact anyone, execute outreach, make legal decisions, verify funding, place bids, participate in auctions, or write to the database.`;
}

export function getAuctionReadinessAssessment(input: AuctionReadinessInput = {}): AuctionReadinessAssessment {
  const context = getAuctionReadinessContext(input);
  const readinessSignals = getReadinessSignals(input, context);
  const auctionReadinessScore = calculateAuctionReadinessScore(context, readinessSignals, input);
  const readinessGrade = getReadinessGrade(auctionReadinessScore);
  const readinessClassification = getReadinessClassification(auctionReadinessScore, readinessSignals, context, input);
  const acquisitionViability = getAcquisitionViability(auctionReadinessScore, readinessClassification, readinessSignals, context);
  const institutionalReviewRequired = getInstitutionalReviewRequired(readinessClassification, readinessSignals, context, input);
  const legalReviewRequired = getLegalReviewRequired(input, readinessSignals, context);
  const titleReviewRequired = getTitleReviewRequired(input, readinessSignals);
  const humanReviewRequired = getHumanReviewRequired(institutionalReviewRequired, legalReviewRequired, titleReviewRequired, readinessClassification, context);
  const confidenceScore = calculateConfidence(context, readinessSignals, input);

  return {
    auctionReadinessScore,
    readinessGrade,
    readinessClassification,
    acquisitionViability,
    institutionalReviewRequired,
    legalReviewRequired,
    titleReviewRequired,
    humanReviewRequired,
    readinessSignals,
    opportunitySignals: getOpportunitySignals(readinessSignals, readinessClassification, context),
    warningSignals: getWarningSignals(input, readinessSignals, readinessClassification, institutionalReviewRequired, legalReviewRequired, titleReviewRequired),
    riskFlags: getRiskFlags(input, context, readinessSignals),
    recommendedResearchSteps: getResearchSteps(input, context),
    recommendedDueDiligenceItems: getDueDiligenceItems(input),
    readinessBlockers: getReadinessBlockers(input, context, readinessSignals),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      signals: readinessSignals,
      score: auctionReadinessScore,
      grade: readinessGrade,
      classification: readinessClassification,
      viability: acquisitionViability,
      confidence: confidenceScore,
    }),
    complianceNotice: AUCTION_READINESS_COMPLIANCE_NOTICE,
  };
}
