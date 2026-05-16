import { getBuyerDemandProfile } from "@/lib/buyer-demand-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getMacroMarketProfile } from "@/lib/macro-market-ai";
import { getMarketTargetingAssessment } from "@/lib/market-intelligence-agent";

export type AcquisitionZoneGrade = "A+" | "A" | "B" | "C" | "D";

export type AcquisitionZoneType =
  | "distressed_opportunity"
  | "rental_growth"
  | "luxury_growth"
  | "land_development"
  | "stable_cashflow"
  | "overheated"
  | "low_priority";

export type AcquisitionZonePriority = "elite" | "high" | "medium" | "low" | "avoid";

export type RecommendedAcquisitionMode =
  | "aggressive"
  | "selective"
  | "opportunistic"
  | "monitor_only"
  | "avoid";

export type CorridorSignals = {
  distressCorridor: number;
  rentalGrowthCorridor: number;
  luxuryGrowthCorridor: number;
  developmentCorridor: number;
  affordabilityMigrationCorridor: number;
  investorSaturation: number;
};

export type AcquisitionZoneAssessmentInput = {
  location?: string;
  county?: string;
  state?: string;
  zipCode?: string;
  neighborhood?: string;
  assetType?: string;
  strategy?: string;
  medianPrice?: number;
  medianRent?: number;
  appreciationTrend?: number;
  rentGrowthTrend?: number;
  foreclosureRate?: number;
  distressRate?: number;
  vacancyRate?: number;
  investorActivity?: number;
  affordabilityIndex?: number;
  buyerDemandProfile?: unknown;
  macroMarketProfile?: unknown;
  countyAlphaProfile?: unknown;
  pricingProfile?: unknown;
  riskProfile?: unknown;
  marketTargetingProfile?: unknown;
};

export type AcquisitionZoneAssessment = {
  zoneScore: number;
  zoneGrade: AcquisitionZoneGrade;
  zoneType: AcquisitionZoneType;
  acquisitionPriority: AcquisitionZonePriority;
  recommendedAcquisitionMode: RecommendedAcquisitionMode;
  corridorSignals: CorridorSignals;
  bestFitStrategies: string[];
  bestFitAssetTypes: string[];
  zoneStrengths: string[];
  zoneWeaknesses: string[];
  opportunitySignals: string[];
  warningSignals: string[];
  recommendedLeadSources: string[];
  recommendedSellerProfiles: string[];
  recommendedBuyerProfiles: string[];
  confidenceScore: number;
  requiredMissingData: string[];
  intelligenceInputsUsed: string[];
  reasoning: string;
};

type JsonRecord = Record<string, unknown>;
type ZoneContext = ReturnType<typeof getZoneContext>;

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

function riskLevelToScore(level: string) {
  const normalizedLevel = normalize(level);

  if (normalizedLevel === "high" || normalizedLevel === "critical") return 78;
  if (normalizedLevel === "low") return 24;

  return 50;
}

function trendToScore(value: number | undefined, neutral = 50) {
  if (!hasNumber(value)) return neutral;

  return clampScore(50 + value * 4.25);
}

function rateToPressure(value: number | undefined, multiplier: number, baseline: number) {
  if (!hasNumber(value)) return 48;

  return clampScore(baseline + value * multiplier);
}

function scaleSignal(value: number | undefined, fallback: number) {
  if (!hasNumber(value)) return fallback;

  return clampScore(value <= 10 ? value * 10 : value);
}

function getVacancyStabilityScore(vacancyRate?: number) {
  if (!hasNumber(vacancyRate)) return 55;

  const stability = 100 - Math.abs(vacancyRate - 5.5) * 8;

  return clampScore(stability);
}

function getVacancyPressure(vacancyRate?: number) {
  if (!hasNumber(vacancyRate)) return 48;

  return clampScore(30 + Math.max(0, vacancyRate - 4.5) * 7);
}

function getHyperlocalPrecision(input: AcquisitionZoneAssessmentInput) {
  const hasZip = Boolean(input.zipCode?.trim());
  const hasNeighborhood = Boolean(input.neighborhood?.trim());

  if (hasZip && hasNeighborhood) return 94;
  if (hasZip) return 82;
  if (hasNeighborhood) return 72;

  return 42;
}

function getRequiredMissingData(input: AcquisitionZoneAssessmentInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.zipCode && !input.neighborhood ? ["ZIP code or neighborhood"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!input.strategy ? ["strategy"] : []),
    ...(!hasNumber(input.medianPrice) ? ["median price"] : []),
    ...(!hasNumber(input.medianRent) ? ["median rent"] : []),
    ...(!hasNumber(input.appreciationTrend) ? ["appreciation trend"] : []),
    ...(!hasNumber(input.rentGrowthTrend) ? ["rent growth trend"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
    ...(!hasNumber(input.vacancyRate) ? ["vacancy rate"] : []),
    ...(!hasNumber(input.investorActivity) ? ["investor activity"] : []),
    ...(!hasNumber(input.affordabilityIndex) ? ["affordability index"] : []),
  ]);
}

function getProfiles(input: AcquisitionZoneAssessmentInput) {
  const buyerDemandProfile = input.buyerDemandProfile ?? getBuyerDemandProfile({
    location: input.location,
    assetType: input.assetType,
  });
  const macroMarketProfile = input.macroMarketProfile ?? getMacroMarketProfile({
    market: input.location,
    state: input.state,
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
    medianPrice: input.medianPrice,
    medianRent: input.medianRent,
    appreciationTrend: input.appreciationTrend,
    rentGrowthTrend: input.rentGrowthTrend,
    foreclosureRate: input.foreclosureRate,
    distressRate: input.distressRate,
    buyerDemandProfile,
    macroMarketProfile,
    countyAlphaProfile,
    pricingProfile: input.pricingProfile,
    riskProfile: input.riskProfile,
  });

  return {
    buyerDemandProfile,
    macroMarketProfile,
    countyAlphaProfile,
    marketTargetingProfile,
  };
}

function getRiskScore(input: AcquisitionZoneAssessmentInput, marketTargetingProfile: unknown, macroRiskLevel: string, investorSaturation: number) {
  const providedRiskScore = getOptionalNumber(input.riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (providedRiskScore !== undefined) return clampScore(providedRiskScore);

  const marketWeaknessCount = stringArray(getPath(marketTargetingProfile, ["marketWeaknesses"])).length;
  const warningCount = stringArray(getPath(marketTargetingProfile, ["warningSignals"])).length;
  const targetRecommendation = normalize(getString(marketTargetingProfile, ["targetRecommendation"], ""));
  const recommendationPenalty = targetRecommendation === "avoid" ? 24 : targetRecommendation === "opportunistic_only" ? 10 : 0;

  return clampScore(
    riskLevelToScore(macroRiskLevel) * 0.34 +
    investorSaturation * 0.24 +
    marketWeaknessCount * 5 +
    warningCount * 6 +
    recommendationPenalty +
    8,
  );
}

function getPricingConfidence(input: AcquisitionZoneAssessmentInput, marketTargetingProfile: unknown) {
  const providedPricingConfidence = getOptionalNumber(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"]);

  if (providedPricingConfidence !== undefined) return clamp(providedPricingConfidence, 0, 1);

  return clamp(getNumber(marketTargetingProfile, ["confidenceScore"], 0.58), 0, 1);
}

function getZoneContext(input: AcquisitionZoneAssessmentInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const buyerDemandScore = getNumber(profiles.buyerDemandProfile, ["demandScore"], 55);
  const buyerConfidence = getNumber(profiles.buyerDemandProfile, ["confidenceScore"], 0.55);
  const macroScore = getNumber(profiles.macroMarketProfile, ["macroScore"], 55);
  const macroConfidence = getNumber(profiles.macroMarketProfile, ["confidenceScore"], 0.55);
  const macroRiskLevel = getString(profiles.macroMarketProfile, ["riskLevel"], "medium");
  const macroSignals = asRecord(getPath(profiles.macroMarketProfile, ["demandSignals"]));
  const populationGrowth = getNumber(macroSignals, ["populationGrowth"], 55);
  const jobGrowth = getNumber(macroSignals, ["jobGrowth"], 55);
  const affordabilitySignal = getNumber(macroSignals, ["affordabilityScore"], 55);
  const rentalDemand = getNumber(macroSignals, ["rentalDemand"], 55);
  const macroInvestorActivity = getNumber(macroSignals, ["investorActivity"], 55);
  const distressOpportunity = getNumber(macroSignals, ["distressOpportunity"], 55);
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = getNumber(profiles.countyAlphaProfile, ["confidenceScore"], 0.55);
  const countyCompetitionLevel = getString(profiles.countyAlphaProfile, ["competitionLevel"], "medium");
  const countyCompetitionScore = riskLevelToScore(countyCompetitionLevel);
  const countyDistressLevel = getNumber(profiles.countyAlphaProfile, ["distressLevel"], 55);
  const countyRentalStrength = getNumber(profiles.countyAlphaProfile, ["rentalStrength"], rentalDemand);
  const countyDemandAlignment = getNumber(profiles.countyAlphaProfile, ["demandAlignment"], buyerDemandScore);
  const countyAcquisitionDifficulty = getNumber(profiles.countyAlphaProfile, ["acquisitionDifficulty"], 55);
  const marketAcquisitionScore = getNumber(profiles.marketTargetingProfile, ["acquisitionScore"], 55);
  const marketConfidence = getNumber(profiles.marketTargetingProfile, ["confidenceScore"], 0.58);
  const marketTemperature = normalize(getString(profiles.marketTargetingProfile, ["marketTemperature"], "stable"));
  const marketRecommendation = normalize(getString(profiles.marketTargetingProfile, ["targetRecommendation"], "target_selectively"));
  const acquisitionLanes = asRecord(getPath(profiles.marketTargetingProfile, ["acquisitionLanes"]));
  const marketDistressIndicators = asRecord(getPath(profiles.marketTargetingProfile, ["distressIndicators"]));
  const appreciationScore = trendToScore(input.appreciationTrend);
  const rentGrowthScore = trendToScore(input.rentGrowthTrend);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const vacancyPressure = getVacancyPressure(input.vacancyRate);
  const vacancyStability = getVacancyStabilityScore(input.vacancyRate);
  const investorActivityScore = scaleSignal(input.investorActivity, macroInvestorActivity);
  const affordabilityIndex = scaleSignal(input.affordabilityIndex, affordabilitySignal);
  const affordabilityMigration = clampScore(
    affordabilityIndex * 0.34 +
    populationGrowth * 0.18 +
    jobGrowth * 0.14 +
    appreciationScore * 0.14 +
    (100 - countyAcquisitionDifficulty) * 0.1 +
    (100 - countyCompetitionScore) * 0.1,
  );
  const investorSaturation = clampScore(
    investorActivityScore * 0.28 +
    macroInvestorActivity * 0.16 +
    countyCompetitionScore * 0.2 +
    getNumber(marketDistressIndicators, ["investorCompetition"], countyCompetitionScore) * 0.22 +
    (100 - affordabilityIndex) * 0.14,
  );
  const pricingConfidence = getPricingConfidence(input, profiles.marketTargetingProfile);
  const riskScore = getRiskScore(input, profiles.marketTargetingProfile, macroRiskLevel, investorSaturation);
  const riskQuality = 100 - riskScore;
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 6);
  const hyperlocalPrecision = getHyperlocalPrecision(input);

  return {
    ...profiles,
    requiredMissingData,
    buyerDemandScore,
    buyerConfidence,
    macroScore,
    macroConfidence,
    macroRiskLevel,
    populationGrowth,
    jobGrowth,
    affordabilitySignal,
    rentalDemand,
    macroInvestorActivity,
    distressOpportunity,
    countyAlphaScore,
    countyConfidence,
    countyCompetitionLevel,
    countyCompetitionScore,
    countyDistressLevel,
    countyRentalStrength,
    countyDemandAlignment,
    countyAcquisitionDifficulty,
    marketAcquisitionScore,
    marketConfidence,
    marketTemperature,
    marketRecommendation,
    acquisitionLanes,
    appreciationScore,
    rentGrowthScore,
    foreclosurePressure,
    distressPressure,
    vacancyPressure,
    vacancyStability,
    investorActivityScore,
    affordabilityIndex,
    affordabilityMigration,
    investorSaturation,
    pricingConfidence,
    riskScore,
    riskQuality,
    dataCompletenessScore,
    hyperlocalPrecision,
  };
}

function getCorridorSignals(context: ZoneContext): CorridorSignals {
  const landLane = getNumber(context.acquisitionLanes, ["land"], 50);
  const developmentLane = getNumber(context.acquisitionLanes, ["development"], 50);
  const luxuryLane = getNumber(context.acquisitionLanes, ["luxury"], 50);
  const rentalLane = getNumber(context.acquisitionLanes, ["rental"], 50);

  return {
    distressCorridor: clampScore(
      context.distressPressure * 0.24 +
      context.foreclosurePressure * 0.2 +
      context.countyDistressLevel * 0.18 +
      context.distressOpportunity * 0.13 +
      context.buyerDemandScore * 0.13 +
      (100 - context.investorSaturation) * 0.07 +
      context.hyperlocalPrecision * 0.05,
    ),
    rentalGrowthCorridor: clampScore(
      context.rentGrowthScore * 0.24 +
      context.countyRentalStrength * 0.18 +
      context.rentalDemand * 0.16 +
      context.vacancyStability * 0.16 +
      rentalLane * 0.1 +
      context.affordabilityMigration * 0.08 +
      context.buyerDemandScore * 0.08,
    ),
    luxuryGrowthCorridor: clampScore(
      context.appreciationScore * 0.24 +
      context.populationGrowth * 0.14 +
      context.jobGrowth * 0.14 +
      context.affordabilityMigration * 0.12 +
      luxuryLane * 0.14 +
      context.macroScore * 0.1 +
      context.riskQuality * 0.08 +
      (100 - context.investorSaturation) * 0.04,
    ),
    developmentCorridor: clampScore(
      context.appreciationScore * 0.18 +
      context.populationGrowth * 0.15 +
      context.jobGrowth * 0.12 +
      context.countyAlphaScore * 0.14 +
      context.affordabilityMigration * 0.13 +
      Math.max(landLane, developmentLane) * 0.14 +
      (100 - context.countyAcquisitionDifficulty) * 0.08 +
      context.riskQuality * 0.06,
    ),
    affordabilityMigrationCorridor: context.affordabilityMigration,
    investorSaturation: context.investorSaturation,
  };
}

function calculateZoneScore(context: ZoneContext, corridors: CorridorSignals) {
  const topCorridorScore = Math.max(
    corridors.distressCorridor,
    corridors.rentalGrowthCorridor,
    corridors.luxuryGrowthCorridor,
    corridors.developmentCorridor,
    corridors.affordabilityMigrationCorridor,
  );
  const overheatedPenalty = corridors.investorSaturation >= 78 && context.marketTemperature !== "cold" ? 10 : corridors.investorSaturation >= 70 ? 5 : 0;
  const riskPenalty = context.riskScore >= 70 ? 8 : context.riskScore >= 58 ? 4 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 2) * 1.8;

  return clampScore(
    context.marketAcquisitionScore * 0.18 +
    context.buyerDemandScore * 0.12 +
    context.macroScore * 0.11 +
    context.countyAlphaScore * 0.13 +
    context.pricingConfidence * 100 * 0.08 +
    context.riskQuality * 0.1 +
    topCorridorScore * 0.17 +
    context.hyperlocalPrecision * 0.06 +
    context.dataCompletenessScore * 0.05 -
    overheatedPenalty -
    riskPenalty -
    missingPenalty,
  );
}

function getZoneGrade(score: number): AcquisitionZoneGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getZoneType(score: number, corridors: CorridorSignals, context: ZoneContext): AcquisitionZoneType {
  if ((context.marketTemperature === "overheated" || corridors.investorSaturation >= 82) && context.riskScore >= 42) return "overheated";
  if (score < 45) return "low_priority";

  const entries: Array<[AcquisitionZoneType, number]> = [
    ["distressed_opportunity", corridors.distressCorridor],
    ["rental_growth", corridors.rentalGrowthCorridor],
    ["luxury_growth", corridors.luxuryGrowthCorridor],
    ["land_development", corridors.developmentCorridor],
    ["stable_cashflow", Math.round(corridors.rentalGrowthCorridor * 0.62 + context.vacancyStability * 0.38)],
  ];
  const [type, corridorScore] = entries.sort(([, left], [, right]) => right - left)[0];

  if (corridorScore < 58) return "low_priority";

  return type;
}

function getRecommendedAcquisitionMode(score: number, zoneType: AcquisitionZoneType, context: ZoneContext, corridors: CorridorSignals): RecommendedAcquisitionMode {
  const overheatedButExceptional =
    zoneType === "overheated" &&
    context.riskScore <= 32 &&
    context.buyerDemandScore >= 86 &&
    context.marketAcquisitionScore >= 86 &&
    context.pricingConfidence >= 0.78;

  if (context.marketRecommendation === "avoid" || context.riskScore >= 78 || score < 38) return "avoid";
  if (zoneType === "overheated" && !overheatedButExceptional) return score >= 62 ? "selective" : "monitor_only";
  if (score >= 84 && context.riskScore < 45 && context.pricingConfidence >= 0.7 && context.dataCompletenessScore >= 78 && corridors.investorSaturation < 76) return "aggressive";
  if (score >= 68 && context.riskScore < 62) return "selective";
  if (score >= 52) return "opportunistic";
  if (score >= 38) return "monitor_only";

  return "avoid";
}

function getPriority(score: number, mode: RecommendedAcquisitionMode): AcquisitionZonePriority {
  if (mode === "avoid" || score < 38) return "avoid";
  if (score >= 86 && mode === "aggressive") return "elite";
  if (score >= 72) return "high";
  if (score >= 55) return "medium";

  return "low";
}

function getBestFitStrategies(context: ZoneContext, corridors: CorridorSignals, zoneType: AcquisitionZoneType) {
  const marketStrategies = stringArray(getPath(context.marketTargetingProfile, ["targetStrategies"]));
  const strategies = [
    ...marketStrategies,
    ...(corridors.distressCorridor >= 62 ? ["wholesale", "wholetail", "fix_and_flip"] : []),
    ...(corridors.rentalGrowthCorridor >= 62 ? ["buy_and_hold", "BRRRR", "rental"] : []),
    ...(corridors.developmentCorridor >= 62 ? ["land_flip", "development"] : []),
    ...(corridors.luxuryGrowthCorridor >= 64 ? ["luxury"] : []),
    ...(context.affordabilityMigration >= 62 ? ["creative_finance", "seller_finance"] : []),
    ...(zoneType === "overheated" ? ["selective_wholesale", "conservative_buy_box"] : []),
    ...(corridors.distressCorridor >= 68 && context.foreclosurePressure >= 55 ? ["tax_opportunity_research"] : []),
  ];

  return unique(strategies).slice(0, 8);
}

function getBestFitAssetTypes(input: AcquisitionZoneAssessmentInput, context: ZoneContext, corridors: CorridorSignals) {
  const marketAssetTypes = stringArray(getPath(context.marketTargetingProfile, ["targetAssetTypes"]));
  const normalizedAsset = normalize(input.assetType);
  const assetTypes = [
    ...(normalizedAsset ? [normalizedAsset] : []),
    ...marketAssetTypes,
    ...(corridors.distressCorridor >= 62 ? ["single_family", "value_add_single_family"] : []),
    ...(corridors.rentalGrowthCorridor >= 62 ? ["rental_ready_single_family", "small_multifamily"] : []),
    ...(corridors.developmentCorridor >= 62 ? ["infill_lots", "land", "development_sites"] : []),
    ...(corridors.luxuryGrowthCorridor >= 64 ? ["luxury_single_family", "premium_infill_lots"] : []),
  ];

  return unique(assetTypes).slice(0, 8);
}

function getZoneStrengths(context: ZoneContext, corridors: CorridorSignals) {
  return unique([
    ...(context.buyerDemandScore >= 70 ? ["Buyer demand supports acquisition targeting in this zone."] : []),
    ...(context.countyAlphaScore >= 70 ? ["County alpha is strong enough to support hyper-local targeting."] : []),
    ...(context.marketAcquisitionScore >= 70 ? ["Market targeting profile supports prioritized acquisition."] : []),
    ...(context.hyperlocalPrecision >= 80 ? ["ZIP/neighborhood precision is strong for future map overlays and list segmentation."] : []),
    ...(corridors.distressCorridor >= 65 ? ["Distress corridor signal is strong."] : []),
    ...(corridors.rentalGrowthCorridor >= 65 ? ["Rental growth corridor signal is strong."] : []),
    ...(corridors.affordabilityMigrationCorridor >= 65 ? ["Affordability migration pattern supports strategic expansion."] : []),
  ]);
}

function getZoneWeaknesses(context: ZoneContext, corridors: CorridorSignals) {
  return unique([
    ...(context.requiredMissingData.length > 0 ? [`Missing zone inputs: ${context.requiredMissingData.join(", ")}.`] : []),
    ...(context.pricingConfidence < 0.6 ? ["Pricing confidence is weak for zone-level prioritization."] : []),
    ...(context.riskScore >= 62 ? ["Risk profile is weak enough to downgrade acquisition mode."] : []),
    ...(corridors.investorSaturation >= 72 ? ["Investor saturation may compress acquisition margins."] : []),
    ...(context.vacancyPressure >= 68 ? ["Vacancy pressure may signal weaker block-level stability."] : []),
    ...(context.marketRecommendation === "opportunistic_only" ? ["Market targeting profile recommends opportunistic-only acquisition."] : []),
  ]);
}

function getOpportunitySignals(context: ZoneContext, corridors: CorridorSignals) {
  return unique([
    ...(corridors.distressCorridor >= 64 && context.buyerDemandScore >= 65 ? ["High distress plus healthy buyer demand supports distressed acquisition pockets."] : []),
    ...(corridors.rentalGrowthCorridor >= 64 && context.vacancyStability >= 62 ? ["Rent growth plus stable vacancy supports rental targeting."] : []),
    ...(corridors.luxuryGrowthCorridor >= 66 ? ["Appreciation and migration signals make this compatible with future luxury acquisition intelligence."] : []),
    ...(corridors.developmentCorridor >= 66 ? ["Growth and land/development signals make this compatible with future development-site intelligence."] : []),
    ...(context.foreclosurePressure >= 55 && context.distressPressure >= 60 ? ["Tax and delinquency opportunity compatibility detected for future tax-lien/tax-deed engines."] : []),
    ...(corridors.investorSaturation >= 45 && corridors.investorSaturation <= 68 && context.marketAcquisitionScore >= 65 ? ["Hidden opportunity zone: demand is improving without extreme investor saturation."] : []),
  ]);
}

function getWarningSignals(context: ZoneContext, corridors: CorridorSignals, zoneType: AcquisitionZoneType) {
  return unique([
    ...(zoneType === "overheated" ? ["Overheated acquisition zone detected; aggressive targeting is blocked unless risk is unusually low and demand is exceptional."] : []),
    ...(corridors.investorSaturation >= 76 ? ["Investor saturation pocket detected."] : []),
    ...(context.riskScore >= 70 ? ["Risk score is high; avoid aggressive lead buying or list expansion assumptions."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Weak pricing confidence reduces reliability of zone scoring."] : []),
    ...(corridors.luxuryGrowthCorridor >= 64 && context.pricingConfidence < 0.72 ? ["Luxury zone targeting requires stronger pricing confidence."] : []),
    ...(corridors.developmentCorridor >= 64 && context.dataCompletenessScore < 82 ? ["Land/development targeting requires stronger zone and entitlement data."] : []),
  ]);
}

function getRecommendedLeadSources(context: ZoneContext, corridors: CorridorSignals, zoneType: AcquisitionZoneType) {
  if (zoneType === "low_priority") {
    return ["Monitor public market notes and buyer demand until zone score improves."];
  }

  return unique([
    ...(corridors.distressCorridor >= 60 ? ["county tax delinquency lists", "pre-foreclosure lists", "driving-for-dollars distress routes"] : []),
    ...(context.foreclosurePressure >= 55 ? ["notice-of-default and auction watchlists"] : []),
    ...(context.vacancyPressure >= 56 ? ["vacant property lists"] : []),
    ...(corridors.rentalGrowthCorridor >= 60 ? ["absentee owner lists", "small landlord lists", "expired rental listings"] : []),
    ...(corridors.developmentCorridor >= 62 ? ["underused land parcels", "infill lot lists", "zoning-change watchlists"] : []),
    ...(corridors.luxuryGrowthCorridor >= 64 ? ["high-equity owner lists", "premium infill owner lists"] : []),
    ...(context.affordabilityMigration >= 62 ? ["high-equity owner lists with long ownership tenure"] : []),
  ]).slice(0, 8);
}

function getRecommendedSellerProfiles(context: ZoneContext, corridors: CorridorSignals) {
  return unique([
    ...(corridors.distressCorridor >= 60 ? ["tax-delinquent owners", "pre-foreclosure owners", "deferred-maintenance owners"] : []),
    ...(corridors.rentalGrowthCorridor >= 60 ? ["tired landlords", "small portfolio owners", "owners with below-market rents"] : []),
    ...(corridors.developmentCorridor >= 62 ? ["landowners with underused parcels", "owners near growth corridors"] : []),
    ...(corridors.luxuryGrowthCorridor >= 64 ? ["high-equity owners", "owners of premium infill properties"] : []),
    ...(context.affordabilityMigration >= 62 ? ["long-tenure owners in affordability migration paths"] : []),
  ]).slice(0, 8);
}

function getRecommendedBuyerProfiles(corridors: CorridorSignals, context: ZoneContext) {
  return unique([
    ...(corridors.distressCorridor >= 60 ? ["cash buyers", "fix-and-flip investors", "wholetail buyers"] : []),
    ...(corridors.rentalGrowthCorridor >= 60 ? ["rental buyers", "BRRRR investors", "small multifamily buyers"] : []),
    ...(corridors.developmentCorridor >= 62 ? ["builders", "land investors", "small developers"] : []),
    ...(corridors.luxuryGrowthCorridor >= 64 ? ["luxury-focused investors", "premium infill buyers"] : []),
    ...(context.affordabilityMigration >= 62 ? ["creative finance buyers"] : []),
  ]).slice(0, 8);
}

function calculateConfidence(context: ZoneContext, corridors: CorridorSignals, zoneType: AcquisitionZoneType) {
  const intelligenceConfidence = average([
    context.buyerConfidence,
    context.macroConfidence,
    context.countyConfidence,
    context.marketConfidence,
    context.pricingConfidence,
  ]);
  const corridorScores = [
    corridors.distressCorridor,
    corridors.rentalGrowthCorridor,
    corridors.luxuryGrowthCorridor,
    corridors.developmentCorridor,
    corridors.affordabilityMigrationCorridor,
  ];
  const corridorSpread = Math.max(...corridorScores) - Math.min(...corridorScores);
  const corridorClarity = clamp(corridorSpread / 45, 0, 1);
  const saturationPenalty = corridors.investorSaturation >= 78 ? 0.08 : corridors.investorSaturation >= 70 ? 0.04 : 0;
  const complexityPenalty = ["luxury_growth", "land_development", "overheated"].includes(zoneType) ? 0.04 : 0;
  const confidence =
    intelligenceConfidence * 0.36 +
    context.dataCompletenessScore / 100 * 0.24 +
    context.hyperlocalPrecision / 100 * 0.14 +
    context.riskQuality / 100 * 0.14 +
    corridorClarity * 0.12 -
    saturationPenalty -
    complexityPenalty;

  return round(clamp(confidence, 0, 1));
}

function getIntelligenceInputsUsed(input: AcquisitionZoneAssessmentInput) {
  return unique([
    input.buyerDemandProfile ? "provided_buyer_demand_profile" : "buyer_demand_intelligence_agent",
    input.macroMarketProfile ? "provided_macro_market_profile" : "macro_market_ai_agent",
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.marketTargetingProfile ? "provided_market_targeting_profile" : "market_intelligence_agent",
    input.pricingProfile ? "provided_pricing_profile" : "pricing_confidence_proxy_from_market_targeting",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_market_targeting_and_zone_signals",
    ...(input.zipCode ? ["zip_code_zone_signal"] : []),
    ...(input.neighborhood ? ["neighborhood_zone_signal"] : []),
  ]);
}

function getReasoning(params: {
  input: AcquisitionZoneAssessmentInput;
  context: ZoneContext;
  corridors: CorridorSignals;
  zoneScore: number;
  zoneGrade: AcquisitionZoneGrade;
  zoneType: AcquisitionZoneType;
  acquisitionPriority: AcquisitionZonePriority;
  mode: RecommendedAcquisitionMode;
  confidenceScore: number;
}) {
  const area = [
    params.input.neighborhood,
    params.input.zipCode ? `ZIP ${params.input.zipCode}` : "",
    params.input.location,
    params.input.county,
    params.input.state,
  ].filter(Boolean).join(", ") || "the selected acquisition zone";

  return `${area} is graded ${params.zoneGrade} with a ${params.zoneScore}/100 zone score, ${params.zoneType} zone type, ${params.acquisitionPriority} acquisition priority, and ${params.mode} acquisition mode. The score combines buyer demand ${params.context.buyerDemandScore}/100, macro market ${params.context.macroScore}/100, county alpha ${params.context.countyAlphaScore}/100, market targeting ${params.context.marketAcquisitionScore}/100, risk quality ${params.context.riskQuality}/100, pricing confidence ${round(params.context.pricingConfidence, 2)}, hyper-local precision ${params.context.hyperlocalPrecision}/100, and corridor signals for distress ${params.corridors.distressCorridor}/100, rental growth ${params.corridors.rentalGrowthCorridor}/100, luxury growth ${params.corridors.luxuryGrowthCorridor}/100, development ${params.corridors.developmentCorridor}/100, affordability migration ${params.corridors.affordabilityMigrationCorridor}/100, and investor saturation ${params.corridors.investorSaturation}/100. Confidence is ${params.confidenceScore}. This is deterministic read-only zone intelligence and does not execute outreach, automation, buyer routing, or database updates.`;
}

export function getAcquisitionZoneAssessment(input: AcquisitionZoneAssessmentInput = {}): AcquisitionZoneAssessment {
  const context = getZoneContext(input);
  const corridorSignals = getCorridorSignals(context);
  const zoneScore = calculateZoneScore(context, corridorSignals);
  const zoneGrade = getZoneGrade(zoneScore);
  const zoneType = getZoneType(zoneScore, corridorSignals, context);
  const recommendedAcquisitionMode = getRecommendedAcquisitionMode(zoneScore, zoneType, context, corridorSignals);
  const acquisitionPriority = getPriority(zoneScore, recommendedAcquisitionMode);
  const confidenceScore = calculateConfidence(context, corridorSignals, zoneType);

  return {
    zoneScore,
    zoneGrade,
    zoneType,
    acquisitionPriority,
    recommendedAcquisitionMode,
    corridorSignals,
    bestFitStrategies: getBestFitStrategies(context, corridorSignals, zoneType),
    bestFitAssetTypes: getBestFitAssetTypes(input, context, corridorSignals),
    zoneStrengths: getZoneStrengths(context, corridorSignals),
    zoneWeaknesses: getZoneWeaknesses(context, corridorSignals),
    opportunitySignals: getOpportunitySignals(context, corridorSignals),
    warningSignals: getWarningSignals(context, corridorSignals, zoneType),
    recommendedLeadSources: getRecommendedLeadSources(context, corridorSignals, zoneType),
    recommendedSellerProfiles: getRecommendedSellerProfiles(context, corridorSignals),
    recommendedBuyerProfiles: getRecommendedBuyerProfiles(corridorSignals, context),
    confidenceScore,
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
    reasoning: getReasoning({
      input,
      context,
      corridors: corridorSignals,
      zoneScore,
      zoneGrade,
      zoneType,
      acquisitionPriority,
      mode: recommendedAcquisitionMode,
      confidenceScore,
    }),
  };
}
