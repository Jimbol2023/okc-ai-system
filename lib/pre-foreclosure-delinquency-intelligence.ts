import { getAcquisitionZoneAssessment } from "@/lib/acquisition-zone-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getCountyAuctionTaxOpportunityAssessment } from "@/lib/county-auction-tax-opportunity-agent";
import { getTaxDealFinderAssessment } from "@/lib/tax-deal-finder-mode";

export type PreForeclosureOpportunityGrade = "A+" | "A" | "B" | "C" | "D";

export type DistressStage =
  | "early_delinquency"
  | "tax_delinquency"
  | "pre_foreclosure_watch"
  | "legal_notice_detected"
  | "auction_risk"
  | "complex_distress"
  | "low_distress";

export type PreForeclosureAcquisitionSuitability =
  | "strong_candidate"
  | "research_candidate"
  | "watchlist"
  | "sensitive_review"
  | "avoid";

export type PreForeclosureReadinessLevel =
  | "not_ready"
  | "research_only"
  | "watchlist"
  | "review_ready";

export type ComplianceSensitivity = "low" | "medium" | "high" | "extreme";

export type PreForeclosureDistressSignals = {
  mortgageDelinquencyPressure: number;
  taxDelinquencyPressure: number;
  auctionUrgency: number;
  equityPotential: number;
  ownerSensitivityRisk: number;
  vacancyDistress: number;
  investorCompetitionRisk: number;
  legalComplexityRisk: number;
};

export type PreForeclosureDelinquencyInput = {
  location?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  assetType?: string;
  estimatedValue?: number;
  arv?: number;
  assessedValue?: number;
  mortgageBalance?: number;
  taxBalance?: number;
  arrearsAmount?: number;
  monthsDelinquent?: number;
  yearsTaxDelinquent?: number;
  noticeOfDefaultKnown?: boolean;
  lisPendensKnown?: boolean;
  auctionDateKnown?: boolean;
  bankruptcyKnown?: boolean;
  probateKnown?: boolean;
  ownerOccupied?: boolean;
  vacant?: boolean;
  foreclosureRate?: number;
  distressRate?: number;
  vacancyRate?: number;
  investorActivity?: number;
  taxDealProfile?: unknown;
  countyAuctionProfile?: unknown;
  acquisitionZoneProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
  countyAlphaProfile?: unknown;
};

export type PreForeclosureDelinquencyAssessment = {
  preForeclosureOpportunityScore: number;
  delinquencySeverityScore: number;
  opportunityGrade: PreForeclosureOpportunityGrade;
  distressStage: DistressStage;
  acquisitionSuitability: PreForeclosureAcquisitionSuitability;
  readinessLevel: PreForeclosureReadinessLevel;
  complianceSensitivity: ComplianceSensitivity;
  legalReviewRequired: boolean;
  humanReviewRequired: boolean;
  distressSignals: PreForeclosureDistressSignals;
  opportunitySignals: string[];
  warningSignals: string[];
  riskFlags: string[];
  recommendedResearchSteps: string[];
  recommendedDueDiligenceItems: string[];
  recommendedLeadSources: string[];
  recommendedSellerProfiles: string[];
  confidenceScore: number;
  requiredMissingData: string[];
  intelligenceInputsUsed: string[];
  reasoning: string;
  complianceNotice: string;
};

type JsonRecord = Record<string, unknown>;
type PreForeclosureContext = ReturnType<typeof getPreForeclosureContext>;

const PRE_FORECLOSURE_COMPLIANCE_NOTICE =
  "This is internal read-only pre-foreclosure and delinquency intelligence, not legal, foreclosure, bankruptcy, probate, tax, title, lending, outreach, or investment advice. Verify all foreclosure, delinquency, bankruptcy, probate, redemption, notice, owner-occupancy, consumer-protection, DNC, marketing, title, escrow, contract, and closing requirements with a qualified local real estate attorney, tax professional, and title company before any contact, offer, negotiation, marketing, signing, assignment, purchase, foreclosure-related action, or closing activity.";

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

function getRequiredMissingData(input: PreForeclosureDelinquencyInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.zipCode && !input.neighborhood ? ["ZIP code or neighborhood"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!hasNumber(input.estimatedValue) && !hasNumber(input.arv) && !hasNumber(input.assessedValue) ? ["estimated value, ARV, or assessed value"] : []),
    ...(!hasNumber(input.mortgageBalance) ? ["mortgage balance"] : []),
    ...(!hasNumber(input.taxBalance) ? ["tax balance"] : []),
    ...(!hasNumber(input.arrearsAmount) ? ["arrears amount"] : []),
    ...(!hasNumber(input.monthsDelinquent) ? ["months delinquent"] : []),
    ...(!hasNumber(input.yearsTaxDelinquent) ? ["years tax delinquent"] : []),
    ...(typeof input.noticeOfDefaultKnown !== "boolean" ? ["notice of default known flag"] : []),
    ...(typeof input.lisPendensKnown !== "boolean" ? ["lis pendens known flag"] : []),
    ...(typeof input.auctionDateKnown !== "boolean" ? ["auction date known flag"] : []),
    ...(typeof input.bankruptcyKnown !== "boolean" ? ["bankruptcy known flag"] : []),
    ...(typeof input.probateKnown !== "boolean" ? ["probate known flag"] : []),
    ...(typeof input.ownerOccupied !== "boolean" ? ["owner occupancy flag"] : []),
    ...(typeof input.vacant !== "boolean" ? ["vacancy flag"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.vacancyRate) ? ["vacancy rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
  ]);
}

function getProfiles(input: PreForeclosureDelinquencyInput) {
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
    strategy: "pre_foreclosure_research",
    medianPrice: input.estimatedValue ?? input.arv ?? input.assessedValue,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    vacancyRate: input.vacancyRate,
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
    strategy: "pre_foreclosure_research",
    assessedValue: input.assessedValue,
    estimatedValue: input.estimatedValue,
    arv: input.arv,
    taxBalance: input.taxBalance,
    yearsDelinquent: input.yearsTaxDelinquent,
    auctionDateKnown: input.auctionDateKnown,
    ownerOccupied: input.ownerOccupied,
    vacant: input.vacant,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    vacancyRate: input.vacancyRate,
    investorActivity: input.investorActivity,
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
    auctionRulesKnown: false,
    redemptionRulesKnown: false,
    titleProcessKnown: false,
    averageTaxBalance: input.taxBalance,
    averageAssessedValue: input.assessedValue,
    averageEstimatedValue: input.estimatedValue ?? input.arv,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    vacancyRate: input.vacancyRate,
    investorActivity: input.investorActivity,
    taxDealProfile,
    countyAlphaProfile,
    acquisitionZoneProfile,
    riskProfile: input.riskProfile,
    pricingProfile: input.pricingProfile,
  });

  return {
    countyAlphaProfile,
    acquisitionZoneProfile,
    taxDealProfile,
    countyAuctionProfile,
  };
}

function getRiskScore(input: PreForeclosureDelinquencyInput, profiles: ReturnType<typeof getProfiles>) {
  const directRisk = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return scoreFromOptional(directRisk, 50);

  const readinessRisk = riskLevelToScore(getString(input.riskProfile, ["riskReadiness", "readinessLevel"], "medium"));
  const taxFlags = stringArray(getPath(profiles.taxDealProfile, ["riskFlags"])).length;
  const auctionFlags = stringArray(getPath(profiles.countyAuctionProfile, ["riskFlags"])).length;
  const zoneWarnings = stringArray(getPath(profiles.acquisitionZoneProfile, ["warningSignals"])).length;
  const legalKnownRisk =
    (input.noticeOfDefaultKnown ? 12 : 0) +
    (input.lisPendensKnown ? 18 : 0) +
    (input.auctionDateKnown ? 18 : 0) +
    (input.bankruptcyKnown ? 28 : 0) +
    (input.probateKnown ? 16 : 0) +
    (input.ownerOccupied ? 14 : 0);

  return clampScore(
    readinessRisk * 0.22 +
    legalKnownRisk +
    taxFlags * 2.4 +
    auctionFlags * 2 +
    zoneWarnings * 2.5 +
    5,
  );
}

function getPreForeclosureContext(input: PreForeclosureDelinquencyInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const value = input.estimatedValue ?? input.arv ?? input.assessedValue ?? 0;
  const totalDebt = (input.mortgageBalance ?? 0) + (input.taxBalance ?? 0) + (input.arrearsAmount ?? 0);
  const equitySpread = value > 0 ? Math.max(0, value - totalDebt) : 0;
  const equitySpreadRatio = value > 0 ? equitySpread / value : 0;
  const arrearsToValueRatio = value > 0 ? (input.arrearsAmount ?? 0) / value : 0;
  const taxToValueRatio = value > 0 ? (input.taxBalance ?? 0) / value : 0;
  const debtToValueRatio = value > 0 ? totalDebt / value : 0;
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = confidenceFromOptional(getOptionalNumber(profiles.countyAlphaProfile, ["confidenceScore"]), 0.55);
  const countyDistressLevel = getNumber(profiles.countyAlphaProfile, ["distressLevel"], 55);
  const zoneScore = getNumber(profiles.acquisitionZoneProfile, ["zoneScore"], 55);
  const zoneConfidence = confidenceFromOptional(getOptionalNumber(profiles.acquisitionZoneProfile, ["confidenceScore"]), 0.58);
  const corridorSignals = asRecord(getPath(profiles.acquisitionZoneProfile, ["corridorSignals"]));
  const zoneInvestorSaturation = getNumber(corridorSignals, ["investorSaturation"], scaleSignal(input.investorActivity, 55));
  const zoneDistressCorridor = getNumber(corridorSignals, ["distressCorridor"], 55);
  const taxOpportunityScore = getNumber(profiles.taxDealProfile, ["taxOpportunityScore"], 55);
  const taxConfidence = confidenceFromOptional(getOptionalNumber(profiles.taxDealProfile, ["confidenceScore"]), 0.58);
  const taxSignals = asRecord(getPath(profiles.taxDealProfile, ["taxSignals"]));
  const taxDelinquencyPressure = getNumber(taxSignals, ["delinquencyPressure"], 55);
  const taxEquityPotential = getNumber(taxSignals, ["equityPotential"], 55);
  const taxVacancyDistress = getNumber(taxSignals, ["vacancyDistress"], 55);
  const taxInvestorCompetitionRisk = getNumber(taxSignals, ["investorCompetitionRisk"], zoneInvestorSaturation);
  const auctionOpportunityScore = getNumber(profiles.countyAuctionProfile, ["countyAuctionOpportunityScore"], 55);
  const auctionConfidence = confidenceFromOptional(getOptionalNumber(profiles.countyAuctionProfile, ["confidenceScore"]), taxConfidence);
  const auctionReadiness = normalize(getString(profiles.countyAuctionProfile, ["readinessLevel"], "research_only"));
  const auctionSignals = asRecord(getPath(profiles.countyAuctionProfile, ["auctionSignals"]));
  const auctionEquityPotential = getNumber(auctionSignals, ["equityPotential"], taxEquityPotential);
  const auctionInvestorCompetitionRisk = getNumber(auctionSignals, ["investorCompetitionRisk"], taxInvestorCompetitionRisk);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const vacancyPressure = rateToPressure(input.vacancyRate, 8, 12);
  const investorActivityScore = scaleSignal(input.investorActivity, zoneInvestorSaturation);
  const pricingConfidence = confidenceFromOptional(getOptionalNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"]), taxConfidence);
  const riskScore = getRiskScore(input, profiles);
  const riskQuality = 100 - riskScore;
  const legalFlagCount = [
    input.noticeOfDefaultKnown,
    input.lisPendensKnown,
    input.auctionDateKnown,
    input.bankruptcyKnown,
    input.probateKnown,
  ].filter(Boolean).length;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 4.5);
  const countyRulesUncertain = !input.county || !input.state;
  const legalDataMissing =
    typeof input.noticeOfDefaultKnown !== "boolean" ||
    typeof input.lisPendensKnown !== "boolean" ||
    typeof input.auctionDateKnown !== "boolean" ||
    typeof input.bankruptcyKnown !== "boolean" ||
    typeof input.probateKnown !== "boolean";
  const debtDataMissing = !hasNumber(input.mortgageBalance) || !hasNumber(input.arrearsAmount);

  return {
    ...profiles,
    requiredMissingData,
    value,
    totalDebt,
    equitySpread,
    equitySpreadRatio,
    arrearsToValueRatio,
    taxToValueRatio,
    debtToValueRatio,
    countyAlphaScore,
    countyConfidence,
    countyDistressLevel,
    zoneScore,
    zoneConfidence,
    zoneInvestorSaturation,
    zoneDistressCorridor,
    taxOpportunityScore,
    taxConfidence,
    taxDelinquencyPressure,
    taxEquityPotential,
    taxVacancyDistress,
    taxInvestorCompetitionRisk,
    auctionOpportunityScore,
    auctionConfidence,
    auctionReadiness,
    auctionEquityPotential,
    auctionInvestorCompetitionRisk,
    foreclosurePressure,
    distressPressure,
    vacancyPressure,
    investorActivityScore,
    pricingConfidence,
    riskScore,
    riskQuality,
    legalFlagCount,
    dataCompletenessScore,
    countyRulesUncertain,
    legalDataMissing,
    debtDataMissing,
  };
}

function getDistressSignals(input: PreForeclosureDelinquencyInput, context: PreForeclosureContext): PreForeclosureDistressSignals {
  const mortgageDelinquencyPressure = clampScore(
    Math.min(input.monthsDelinquent ?? 0, 12) * 7 +
    Math.min(context.arrearsToValueRatio * 520, 30) +
    (context.debtDataMissing ? 0 : 12) +
    context.foreclosurePressure * 0.14 +
    context.distressPressure * 0.1,
  );
  const taxDelinquencyPressure = clampScore(
    Math.min(input.yearsTaxDelinquent ?? 0, 5) * 14 +
    Math.min(context.taxToValueRatio * 520, 32) +
    context.taxDelinquencyPressure * 0.2 +
    context.auctionOpportunityScore * 0.08,
  );
  const auctionUrgency = clampScore(
    (input.auctionDateKnown ? 58 : 8) +
    (input.noticeOfDefaultKnown ? 12 : 0) +
    (input.lisPendensKnown ? 14 : 0) +
    Math.min(input.monthsDelinquent ?? 0, 12) * 2.2 +
    Math.min(input.yearsTaxDelinquent ?? 0, 5) * 4 +
    context.foreclosurePressure * 0.08,
  );
  const equityPotential = clampScore(
    context.equitySpreadRatio * 118 +
    (context.value > 0 ? 8 : 0) +
    average([context.taxEquityPotential, context.auctionEquityPotential]) * 0.1 -
    Math.max(0, context.debtToValueRatio - 0.82) * 65,
  );
  const ownerSensitivityRisk = clampScore(
    (input.ownerOccupied ? 62 : 26) +
    (input.auctionDateKnown ? 12 : 0) +
    (input.noticeOfDefaultKnown ? 9 : 0) +
    (input.bankruptcyKnown ? 12 : 0) +
    (input.probateKnown ? 9 : 0) +
    (input.vacant ? -8 : 0),
  );
  const vacancyDistress = clampScore(
    (input.vacant ? 36 : 0) +
    (input.ownerOccupied ? -12 : 6) +
    context.vacancyPressure * 0.24 +
    context.distressPressure * 0.22 +
    context.taxVacancyDistress * 0.18,
  );
  const investorCompetitionRisk = clampScore(
    context.investorActivityScore * 0.32 +
    context.zoneInvestorSaturation * 0.24 +
    context.taxInvestorCompetitionRisk * 0.16 +
    context.auctionInvestorCompetitionRisk * 0.14 +
    (input.auctionDateKnown ? 8 : 0) +
    (equityPotential >= 70 ? 5 : 0),
  );
  const legalComplexityRisk = clampScore(
    (input.noticeOfDefaultKnown ? 18 : 0) +
    (input.lisPendensKnown ? 24 : 0) +
    (input.auctionDateKnown ? 24 : 0) +
    (input.bankruptcyKnown ? 38 : 0) +
    (input.probateKnown ? 26 : 0) +
    (input.ownerOccupied ? 12 : 0) +
    (context.legalDataMissing ? 14 : 0) +
    context.riskScore * 0.12,
  );

  return {
    mortgageDelinquencyPressure,
    taxDelinquencyPressure,
    auctionUrgency,
    equityPotential,
    ownerSensitivityRisk,
    vacancyDistress,
    investorCompetitionRisk,
    legalComplexityRisk,
  };
}

function calculateDelinquencySeverity(signals: PreForeclosureDistressSignals) {
  return clampScore(
    signals.mortgageDelinquencyPressure * 0.24 +
    signals.taxDelinquencyPressure * 0.2 +
    signals.auctionUrgency * 0.18 +
    signals.legalComplexityRisk * 0.14 +
    signals.ownerSensitivityRisk * 0.12 +
    signals.vacancyDistress * 0.08 +
    signals.investorCompetitionRisk * 0.04,
  );
}

function calculateOpportunityScore(context: PreForeclosureContext, signals: PreForeclosureDistressSignals, severity: number) {
  const legalPenalty = signals.legalComplexityRisk >= 78 ? 10 : signals.legalComplexityRisk >= 64 ? 6 : 0;
  const ownerPenalty = signals.ownerSensitivityRisk >= 78 ? 9 : signals.ownerSensitivityRisk >= 62 ? 5 : 0;
  const competitionPenalty = signals.investorCompetitionRisk >= 75 ? 7 : signals.investorCompetitionRisk >= 65 ? 4 : 0;
  const riskPenalty = context.riskScore >= 76 ? 9 : context.riskScore >= 62 ? 5 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 5) * 1.6;

  return clampScore(
    signals.equityPotential * 0.25 +
    severity * 0.14 +
    signals.mortgageDelinquencyPressure * 0.12 +
    signals.taxDelinquencyPressure * 0.1 +
    signals.vacancyDistress * 0.08 +
    context.zoneDistressCorridor * 0.08 +
    context.countyAlphaScore * 0.06 +
    context.taxOpportunityScore * 0.06 +
    context.riskQuality * 0.06 +
    context.pricingConfidence * 100 * 0.05 -
    legalPenalty -
    ownerPenalty -
    competitionPenalty -
    riskPenalty -
    missingPenalty,
  );
}

function getOpportunityGrade(score: number): PreForeclosureOpportunityGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getDistressStage(input: PreForeclosureDelinquencyInput, signals: PreForeclosureDistressSignals, severity: number): DistressStage {
  if (input.bankruptcyKnown || input.probateKnown || (signals.legalComplexityRisk >= 80 && signals.ownerSensitivityRisk >= 65)) return "complex_distress";
  if (input.auctionDateKnown || signals.auctionUrgency >= 78) return "auction_risk";
  if (input.noticeOfDefaultKnown || input.lisPendensKnown || signals.legalComplexityRisk >= 62) return "legal_notice_detected";
  if (signals.mortgageDelinquencyPressure >= 58) return "pre_foreclosure_watch";
  if (signals.taxDelinquencyPressure >= 58) return "tax_delinquency";
  if (severity >= 36) return "early_delinquency";

  return "low_distress";
}

function getComplianceSensitivity(stage: DistressStage, signals: PreForeclosureDistressSignals, input: PreForeclosureDelinquencyInput): ComplianceSensitivity {
  if (input.bankruptcyKnown || input.auctionDateKnown || signals.ownerSensitivityRisk >= 82 || signals.legalComplexityRisk >= 82) return "extreme";
  if (input.ownerOccupied || stage === "legal_notice_detected" || stage === "auction_risk" || stage === "complex_distress") return "high";
  if (signals.ownerSensitivityRisk >= 52 || signals.legalComplexityRisk >= 52) return "medium";

  return "low";
}

function getAcquisitionSuitability(score: number, stage: DistressStage, sensitivity: ComplianceSensitivity, signals: PreForeclosureDistressSignals, context: PreForeclosureContext): PreForeclosureAcquisitionSuitability {
  if (score < 34 || context.riskScore >= 86 || signals.equityPotential < 34) return "avoid";
  if (sensitivity === "extreme" || stage === "complex_distress" || signals.legalComplexityRisk >= 78 || signals.ownerSensitivityRisk >= 78) return "sensitive_review";
  if (score >= 80 && signals.equityPotential >= 74 && context.riskScore < 54 && sensitivity !== "high") return "strong_candidate";
  if (score >= 64 && signals.equityPotential >= 58) return "research_candidate";
  if (score >= 46) return "watchlist";

  return "sensitive_review";
}

function getReadinessLevel(suitability: PreForeclosureAcquisitionSuitability, sensitivity: ComplianceSensitivity, context: PreForeclosureContext): PreForeclosureReadinessLevel {
  if (suitability === "avoid" || context.riskScore >= 86) return "not_ready";
  if (context.requiredMissingData.length >= 8 || context.legalDataMissing || context.countyRulesUncertain || context.debtDataMissing) return "research_only";
  if (suitability === "sensitive_review" || sensitivity === "high" || sensitivity === "extreme" || context.riskScore >= 58) return "watchlist";

  return "review_ready";
}

function getLegalReviewRequired(input: PreForeclosureDelinquencyInput, sensitivity: ComplianceSensitivity, context: PreForeclosureContext) {
  return (
    sensitivity === "high" ||
    sensitivity === "extreme" ||
    input.noticeOfDefaultKnown === true ||
    input.lisPendensKnown === true ||
    input.auctionDateKnown === true ||
    input.bankruptcyKnown === true ||
    input.probateKnown === true ||
    input.ownerOccupied === true ||
    context.countyRulesUncertain
  );
}

function getHumanReviewRequired(legalReviewRequired: boolean, readiness: PreForeclosureReadinessLevel, context: PreForeclosureContext) {
  return legalReviewRequired || readiness !== "not_ready" || context.requiredMissingData.length > 0 || context.riskScore >= 45;
}

function getOpportunitySignals(stage: DistressStage, signals: PreForeclosureDistressSignals, context: PreForeclosureContext, input: PreForeclosureDelinquencyInput) {
  return unique([
    ...(signals.equityPotential >= 68 ? ["Equity potential appears strong relative to debt, tax balance, arrears, and estimated value."] : []),
    ...(signals.mortgageDelinquencyPressure >= 62 ? ["Mortgage delinquency pressure supports pre-foreclosure watchlist research."] : []),
    ...(signals.taxDelinquencyPressure >= 62 ? ["Tax delinquency pressure supports delinquency research priority."] : []),
    ...(signals.vacancyDistress >= 58 && input.vacant ? ["Vacant property signal may improve investor-safe review posture while still requiring caution."] : []),
    ...(context.zoneDistressCorridor >= 62 ? ["Acquisition zone distress corridor supports future lead-targeting review."] : []),
    ...(stage === "pre_foreclosure_watch" ? ["Pre-foreclosure watch classification is active for internal research only."] : []),
    ...(stage === "legal_notice_detected" ? ["Legal notice signal is active and requires compliance-first human review."] : []),
    ...(stage === "auction_risk" ? ["Auction risk signal is active and requires heightened legal/human review."] : []),
  ]);
}

function getWarningSignals(input: PreForeclosureDelinquencyInput, sensitivity: ComplianceSensitivity, signals: PreForeclosureDistressSignals, legalReviewRequired: boolean, context: PreForeclosureContext) {
  return unique([
    ...(legalReviewRequired ? ["Legal review is required before any foreclosure, delinquency, owner-facing, or acquisition action."] : []),
    ...(sensitivity === "extreme" ? ["Compliance sensitivity is extreme; keep this research-only until qualified human/legal review is complete."] : []),
    ...(input.ownerOccupied ? ["Owner-occupied property increases consumer-protection, DNC, and communication-sensitivity caution."] : []),
    ...(input.auctionDateKnown ? ["Known auction date increases urgency and compliance risk."] : []),
    ...(input.noticeOfDefaultKnown ? ["Notice of default signal increases legal complexity and seller sensitivity."] : []),
    ...(input.lisPendensKnown ? ["Lis pendens signal increases litigation/title complexity."] : []),
    ...(input.bankruptcyKnown ? ["Bankruptcy signal requires legal review and downgrades readiness."] : []),
    ...(input.probateKnown ? ["Probate signal requires legal/title review and downgrades readiness."] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["Investor competition risk is high."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is weak for pre-foreclosure underwriting."] : []),
    ...(context.riskScore >= 65 ? ["Risk profile is weak and downgrades readiness."] : []),
  ]);
}

function getRiskFlags(input: PreForeclosureDelinquencyInput, context: PreForeclosureContext, signals: PreForeclosureDistressSignals) {
  return unique([
    ...(context.legalDataMissing ? ["missing_foreclosure_legal_status_data"] : []),
    ...(context.debtDataMissing ? ["missing_mortgage_or_arrears_data"] : []),
    ...(input.ownerOccupied ? ["owner_occupied_compliance_caution"] : []),
    ...(input.noticeOfDefaultKnown ? ["notice_of_default_detected"] : []),
    ...(input.lisPendensKnown ? ["lis_pendens_detected"] : []),
    ...(input.auctionDateKnown ? ["known_auction_date_urgency"] : []),
    ...(input.bankruptcyKnown ? ["bankruptcy_review_required"] : []),
    ...(input.probateKnown ? ["probate_review_required"] : []),
    ...(signals.legalComplexityRisk >= 70 ? ["high_legal_complexity_risk"] : []),
    ...(signals.ownerSensitivityRisk >= 70 ? ["high_owner_sensitivity_risk"] : []),
    ...(signals.investorCompetitionRisk >= 70 ? ["high_investor_competition"] : []),
    ...(signals.equityPotential < 45 ? ["thin_or_unclear_equity"] : []),
    ...(context.riskScore >= 65 ? ["weak_risk_profile"] : []),
    ...(context.pricingConfidence < 0.58 ? ["weak_pricing_confidence"] : []),
  ]);
}

function getResearchSteps(input: PreForeclosureDelinquencyInput, context: PreForeclosureContext) {
  return unique([
    "Verify owner name, property address, occupancy, estimated value, mortgage balance, tax balance, arrears, delinquency timeline, and title status from appropriate human-reviewed sources.",
    "Review foreclosure, notice, lis pendens, bankruptcy, probate, tax delinquency, redemption, owner-occupancy, DNC, and communication rules with qualified counsel before any action.",
    "Confirm whether any notice of default, lis pendens, auction date, bankruptcy, probate, tax delinquency, or title issue exists before classifying outreach readiness.",
    "Validate equity spread, payoff, arrears, tax balance, repair assumptions, and pricing support before any investor-facing review.",
    "Review seller sensitivity, consumer-protection constraints, and human approval requirements before any communication is considered.",
    ...(input.auctionDateKnown ? ["Confirm auction date, cure deadlines, reinstatement/payoff timing, postponement status, and any redemption or cancellation windows manually."] : ["Research whether auction date, cure deadline, notice date, or court/foreclosure timeline exists."] ),
    ...(context.requiredMissingData.length > 0 ? [`Collect missing pre-foreclosure inputs: ${context.requiredMissingData.join(", ")}.`] : []),
  ]);
}

function getDueDiligenceItems(input: PreForeclosureDelinquencyInput) {
  return unique([
    "owner identity and occupancy verification",
    "mortgage balance, payoff, arrears, escrow, and reinstatement amount review",
    "tax balance, years delinquent, redemption, and county delinquency review",
    "notice of default, lis pendens, auction date, and foreclosure timeline review",
    "bankruptcy, probate, litigation, title, lien, and code-enforcement review",
    "DNC, communication consent, consumer-protection, and homeowner-facing compliance review",
    "value support, ARV support, repair assumptions, and equity spread validation",
    ...(input.auctionDateKnown ? ["auction date, cure deadline, reinstatement deadline, and postponement status review"] : []),
  ]);
}

function getLeadSources(stage: DistressStage, signals: PreForeclosureDistressSignals) {
  if (stage === "low_distress") {
    return ["Do not prioritize pre-foreclosure lead sources until distress signals improve."];
  }

  return unique([
    ...(signals.mortgageDelinquencyPressure >= 55 ? ["pre-foreclosure research list", "notice-of-default research queue"] : []),
    ...(signals.taxDelinquencyPressure >= 55 ? ["county tax delinquency list", "delinquent parcel research queue"] : []),
    ...(signals.auctionUrgency >= 55 ? ["auction watchlist", "foreclosure sale calendar research queue"] : []),
    ...(signals.vacancyDistress >= 55 ? ["vacant property list", "driving-for-dollars distress routes"] : []),
    ...(signals.equityPotential >= 60 ? ["high-equity distress research list"] : []),
    "human-reviewed county and title research queue",
  ]).slice(0, 8);
}

function getSellerProfiles(input: PreForeclosureDelinquencyInput, signals: PreForeclosureDistressSignals) {
  return unique([
    ...(signals.mortgageDelinquencyPressure >= 55 ? ["mortgage-delinquent owners"] : []),
    ...(signals.taxDelinquencyPressure >= 55 ? ["tax-delinquent owners"] : []),
    ...(signals.auctionUrgency >= 58 ? ["pre-auction research candidates"] : []),
    ...(signals.equityPotential >= 60 ? ["equity-rich owners with delinquency pressure"] : []),
    ...(input.ownerOccupied ? ["owner-occupied homeowners requiring heightened compliance review"] : ["non-owner-occupied distress owners"] ),
    ...(input.vacant ? ["vacant property owners"] : []),
  ]).slice(0, 7);
}

function calculateConfidence(context: PreForeclosureContext, signals: PreForeclosureDistressSignals, input: PreForeclosureDelinquencyInput) {
  const distressDataConfidence =
    (hasNumber(input.mortgageBalance) ? 0.1 : 0) +
    (hasNumber(input.taxBalance) ? 0.1 : 0) +
    (hasNumber(input.arrearsAmount) ? 0.1 : 0) +
    (hasNumber(input.monthsDelinquent) ? 0.1 : 0) +
    (hasNumber(input.yearsTaxDelinquent) ? 0.08 : 0) +
    (hasNumber(input.estimatedValue) || hasNumber(input.arv) || hasNumber(input.assessedValue) ? 0.12 : 0) +
    (typeof input.noticeOfDefaultKnown === "boolean" ? 0.08 : 0) +
    (typeof input.lisPendensKnown === "boolean" ? 0.07 : 0) +
    (typeof input.auctionDateKnown === "boolean" ? 0.08 : 0) +
    (typeof input.bankruptcyKnown === "boolean" ? 0.07 : 0) +
    (typeof input.probateKnown === "boolean" ? 0.06 : 0) +
    (typeof input.ownerOccupied === "boolean" ? 0.06 : 0) +
    (typeof input.vacant === "boolean" ? 0.06 : 0);
  const intelligenceConfidence = average([
    context.countyConfidence,
    context.zoneConfidence,
    context.taxConfidence,
    context.auctionConfidence,
    context.pricingConfidence,
  ]);
  const signalScores = Object.values(signals);
  const signalConsistency = 1 - clamp((Math.max(...signalScores) - Math.min(...signalScores)) / 100, 0, 1);
  const confidence =
    intelligenceConfidence * 0.26 +
    distressDataConfidence * 0.3 +
    context.dataCompletenessScore / 100 * 0.18 +
    signalConsistency * 0.1 +
    context.riskQuality / 100 * 0.1 -
    (input.ownerOccupied ? 0.04 : 0) -
    (signals.legalComplexityRisk >= 72 ? 0.06 : 0) -
    (signals.ownerSensitivityRisk >= 72 ? 0.05 : 0) -
    (context.riskScore >= 70 ? 0.09 : context.riskScore >= 58 ? 0.05 : 0);

  return round(clamp(confidence, 0, 1));
}

function getIntelligenceInputsUsed(input: PreForeclosureDelinquencyInput) {
  return unique([
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.acquisitionZoneProfile ? "provided_acquisition_zone_profile" : "acquisition_zone_intelligence_engine",
    input.taxDealProfile ? "provided_tax_deal_profile" : "tax_deal_finder_mode",
    input.countyAuctionProfile ? "provided_county_auction_profile" : "county_auction_tax_opportunity_agent",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_distress_legal_tax_and_zone_signals",
    "manual_foreclosure_delinquency_status_required",
  ]);
}

function getReasoning(params: {
  input: PreForeclosureDelinquencyInput;
  context: PreForeclosureContext;
  signals: PreForeclosureDistressSignals;
  score: number;
  severity: number;
  grade: PreForeclosureOpportunityGrade;
  stage: DistressStage;
  suitability: PreForeclosureAcquisitionSuitability;
  readiness: PreForeclosureReadinessLevel;
  sensitivity: ComplianceSensitivity;
  confidence: number;
}) {
  const area = [
    params.input.neighborhood,
    params.input.zipCode ? `ZIP ${params.input.zipCode}` : "",
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected pre-foreclosure research area";

  return `${area} is graded ${params.grade} with a ${params.score}/100 pre-foreclosure opportunity score, ${params.severity}/100 delinquency severity, ${params.stage} distress stage, ${params.suitability} suitability, ${params.readiness} readiness, and ${params.sensitivity} compliance sensitivity. The score uses mortgage delinquency pressure ${params.signals.mortgageDelinquencyPressure}/100, tax delinquency pressure ${params.signals.taxDelinquencyPressure}/100, auction urgency ${params.signals.auctionUrgency}/100, equity potential ${params.signals.equityPotential}/100, owner sensitivity risk ${params.signals.ownerSensitivityRisk}/100, vacancy distress ${params.signals.vacancyDistress}/100, investor competition risk ${params.signals.investorCompetitionRisk}/100, legal complexity risk ${params.signals.legalComplexityRisk}/100, and risk quality ${params.context.riskQuality}/100. Confidence is ${params.confidence}. This is informational read-only pre-foreclosure and delinquency intelligence only; it does not scrape county websites, contact sellers, execute outreach, make legal decisions, run foreclosure actions, place bids, or write to the database.`;
}

export function getPreForeclosureDelinquencyAssessment(input: PreForeclosureDelinquencyInput = {}): PreForeclosureDelinquencyAssessment {
  const context = getPreForeclosureContext(input);
  const distressSignals = getDistressSignals(input, context);
  const delinquencySeverityScore = calculateDelinquencySeverity(distressSignals);
  const preForeclosureOpportunityScore = calculateOpportunityScore(context, distressSignals, delinquencySeverityScore);
  const opportunityGrade = getOpportunityGrade(preForeclosureOpportunityScore);
  const distressStage = getDistressStage(input, distressSignals, delinquencySeverityScore);
  const complianceSensitivity = getComplianceSensitivity(distressStage, distressSignals, input);
  const acquisitionSuitability = getAcquisitionSuitability(preForeclosureOpportunityScore, distressStage, complianceSensitivity, distressSignals, context);
  const readinessLevel = getReadinessLevel(acquisitionSuitability, complianceSensitivity, context);
  const legalReviewRequired = getLegalReviewRequired(input, complianceSensitivity, context);
  const humanReviewRequired = getHumanReviewRequired(legalReviewRequired, readinessLevel, context);
  const confidenceScore = calculateConfidence(context, distressSignals, input);

  return {
    preForeclosureOpportunityScore,
    delinquencySeverityScore,
    opportunityGrade,
    distressStage,
    acquisitionSuitability,
    readinessLevel,
    complianceSensitivity,
    legalReviewRequired,
    humanReviewRequired,
    distressSignals,
    opportunitySignals: getOpportunitySignals(distressStage, distressSignals, context, input),
    warningSignals: getWarningSignals(input, complianceSensitivity, distressSignals, legalReviewRequired, context),
    riskFlags: getRiskFlags(input, context, distressSignals),
    recommendedResearchSteps: getResearchSteps(input, context),
    recommendedDueDiligenceItems: getDueDiligenceItems(input),
    recommendedLeadSources: getLeadSources(distressStage, distressSignals),
    recommendedSellerProfiles: getSellerProfiles(input, distressSignals),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      signals: distressSignals,
      score: preForeclosureOpportunityScore,
      severity: delinquencySeverityScore,
      grade: opportunityGrade,
      stage: distressStage,
      suitability: acquisitionSuitability,
      readiness: readinessLevel,
      sensitivity: complianceSensitivity,
      confidence: confidenceScore,
    }),
    complianceNotice: PRE_FORECLOSURE_COMPLIANCE_NOTICE,
  };
}
