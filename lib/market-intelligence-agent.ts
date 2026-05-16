import { getBuyerDemandProfile } from "@/lib/buyer-demand-intelligence";
import { getCountyAlphaProfile } from "@/lib/county-alpha-ai";
import { getMacroMarketProfile } from "@/lib/macro-market-ai";

export type AcquisitionGrade = "A+" | "A" | "B" | "C" | "D";

export type MarketTemperature = "cold" | "stable" | "warm" | "hot" | "overheated";

export type TargetRecommendation =
  | "aggressive_acquisition"
  | "target_selectively"
  | "opportunistic_only"
  | "avoid";

export type LeadPriority = "low" | "medium" | "high" | "elite";

export type AcquisitionLanes = {
  luxury: number;
  wholesale: number;
  rental: number;
  multifamily: number;
  land: number;
  development: number;
  creativeFinance: number;
};

export type DistressIndicators = {
  foreclosurePressure: number;
  distressPressure: number;
  investorCompetition: number;
  liquidityPressure: number;
};

export type MarketTargetingAssessmentInput = {
  location?: string;
  county?: string;
  state?: string;
  assetType?: string;
  strategy?: string;
  medianPrice?: number;
  medianRent?: number;
  appreciationTrend?: number;
  rentGrowthTrend?: number;
  foreclosureRate?: number;
  distressRate?: number;
  buyerDemandProfile?: unknown;
  macroMarketProfile?: unknown;
  countyAlphaProfile?: unknown;
  pricingProfile?: unknown;
  riskProfile?: unknown;
};

export type MarketTargetingAssessment = {
  acquisitionScore: number;
  acquisitionGrade: AcquisitionGrade;
  marketTemperature: MarketTemperature;
  targetRecommendation: TargetRecommendation;
  targetAssetTypes: string[];
  targetStrategies: string[];
  leadPriority: LeadPriority;
  marketStrengths: string[];
  marketWeaknesses: string[];
  opportunitySignals: string[];
  warningSignals: string[];
  acquisitionLanes: AcquisitionLanes;
  distressIndicators: DistressIndicators;
  confidenceScore: number;
  recommendedMarketingFocus: string[];
  recommendedSellerProfiles: string[];
  recommendedBuyerProfiles: string[];
  reasoning: string;
  requiredMissingData: string[];
  intelligenceInputsUsed: string[];
};

type JsonRecord = Record<string, unknown>;
type AcquisitionLaneName = keyof AcquisitionLanes;
type MarketContext = ReturnType<typeof getMarketContext>;

const LANE_NAMES: AcquisitionLaneName[] = [
  "luxury",
  "wholesale",
  "rental",
  "multifamily",
  "land",
  "development",
  "creativeFinance",
];

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

function normalize(value?: string) {
  return value?.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_") ?? "";
}

function hasNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function unique(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function average(values: number[]) {
  if (values.length === 0) return 0;

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function getRiskLevelScore(level: string) {
  if (level === "high") return 78;
  if (level === "low") return 26;

  return 50;
}

function getCompetitionLevelScore(level: string) {
  if (level === "high") return 84;
  if (level === "low") return 32;

  return 58;
}

function trendToScore(value: number | undefined, neutral = 50) {
  if (!hasNumber(value)) return neutral;

  return clampScore(50 + value * 4.25);
}

function rateToPressure(value: number | undefined, multiplier: number, baseline: number) {
  if (!hasNumber(value)) return 48;

  return clampScore(baseline + value * multiplier);
}

function getRentYieldScore(medianPrice?: number, medianRent?: number) {
  if (!hasNumber(medianPrice) || !hasNumber(medianRent) || !medianPrice || !medianRent) return 50;

  const grossYield = medianRent * 12 / medianPrice;

  return clampScore(42 + (grossYield - 0.045) * 950);
}

function getProfiles(input: MarketTargetingAssessmentInput) {
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

  return {
    buyerDemandProfile,
    macroMarketProfile,
    countyAlphaProfile,
  };
}

function getRequiredMissingData(input: MarketTargetingAssessmentInput) {
  return unique([
    ...(!input.location ? ["location"] : []),
    ...(!input.county ? ["county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.assetType ? ["asset type"] : []),
    ...(!input.strategy ? ["strategy"] : []),
    ...(!hasNumber(input.medianPrice) ? ["median price"] : []),
    ...(!hasNumber(input.medianRent) ? ["median rent"] : []),
    ...(!hasNumber(input.appreciationTrend) ? ["appreciation trend"] : []),
    ...(!hasNumber(input.rentGrowthTrend) ? ["rent growth trend"] : []),
    ...(!hasNumber(input.foreclosureRate) ? ["foreclosure rate"] : []),
    ...(!hasNumber(input.distressRate) ? ["distress rate"] : []),
  ]);
}

function getAssetLaneFit(assetType: string, lane: AcquisitionLaneName) {
  const asset = normalize(assetType);
  const singleFamily = ["single_family", "house", "residential", "townhome", "condo"].includes(asset);
  const land = asset.includes("land") || asset.includes("lot") || asset.includes("acre");
  const multifamily = asset.includes("multifamily") || asset.includes("multi_family") || asset.includes("duplex") || asset.includes("triplex") || asset.includes("fourplex");
  const commercial = asset.includes("commercial") || asset.includes("retail") || asset.includes("office");
  const luxury = asset.includes("luxury") || asset.includes("high_end");

  if (!asset) return 52;
  if (lane === "wholesale") return singleFamily ? 90 : multifamily ? 72 : land ? 54 : 45;
  if (lane === "rental") return singleFamily ? 88 : multifamily ? 86 : commercial ? 58 : 36;
  if (lane === "multifamily") return multifamily ? 95 : singleFamily ? 42 : commercial ? 58 : 28;
  if (lane === "land") return land ? 95 : singleFamily ? 34 : commercial ? 46 : 26;
  if (lane === "development") return land ? 88 : commercial ? 66 : singleFamily ? 48 : multifamily ? 54 : 32;
  if (lane === "luxury") return luxury ? 95 : singleFamily ? 54 : land ? 42 : 28;
  if (lane === "creativeFinance") return singleFamily ? 82 : multifamily ? 78 : commercial ? 42 : land ? 28 : 50;

  return 50;
}

function getStrategyLaneFit(strategy: string, lane: AcquisitionLaneName) {
  const normalizedStrategy = normalize(strategy);

  if (!normalizedStrategy) return 0;
  if (lane === "wholesale" && ["wholesale", "wholetail", "fix_and_flip"].includes(normalizedStrategy)) return 8;
  if (lane === "rental" && ["rental", "buy_and_hold", "brrrr"].includes(normalizedStrategy)) return 8;
  if (lane === "multifamily" && normalizedStrategy === "multifamily") return 8;
  if (lane === "land" && normalizedStrategy === "land_flip") return 8;
  if (lane === "development" && normalizedStrategy === "development") return 8;
  if (lane === "luxury" && normalizedStrategy === "luxury") return 8;
  if (lane === "creativeFinance" && ["creative_finance", "subject_to", "seller_finance"].includes(normalizedStrategy)) return 8;

  return 0;
}

function getPricingConfidence(pricingProfile: unknown, input: MarketTargetingAssessmentInput) {
  const providedConfidence = getOptionalNumber(pricingProfile, ["pricingConfidenceScore", "confidenceScore"]);

  if (providedConfidence !== undefined) return clamp(providedConfidence, 0, 1);

  const marketInputs =
    (hasNumber(input.medianPrice) ? 0.08 : 0) +
    (hasNumber(input.medianRent) ? 0.06 : 0) +
    (hasNumber(input.appreciationTrend) ? 0.04 : 0) +
    (hasNumber(input.rentGrowthTrend) ? 0.04 : 0);

  return round(clamp(0.52 + marketInputs, 0, 0.72));
}

function getPricingRiskScore(pricingProfile: unknown) {
  const directRisk = getOptionalNumber(pricingProfile, ["pricingRiskScore", "riskScore"]);

  if (directRisk !== undefined) return clampScore(directRisk);

  return getRiskLevelScore(normalize(getString(pricingProfile, ["pricingRiskLevel", "riskLevel"], "medium")));
}

function getExternalRiskScore(riskProfile: unknown) {
  const directRisk = getOptionalNumber(riskProfile, ["riskScore", "overallRiskScore", "marketRiskScore", "volatilityScore"]);

  if (directRisk !== undefined) return clampScore(directRisk);

  return getRiskLevelScore(normalize(getString(riskProfile, ["riskLevel", "overallRiskLevel"], "medium")));
}

function getMarketContext(input: MarketTargetingAssessmentInput) {
  const profiles = getProfiles(input);
  const requiredMissingData = getRequiredMissingData(input);
  const buyerDemandScore = getNumber(profiles.buyerDemandProfile, ["demandScore"], 55);
  const buyerConfidence = getNumber(profiles.buyerDemandProfile, ["confidenceScore"], 0.55);
  const macroScore = getNumber(profiles.macroMarketProfile, ["macroScore"], 55);
  const macroConfidence = getNumber(profiles.macroMarketProfile, ["confidenceScore"], 0.55);
  const macroRiskLevel = normalize(getString(profiles.macroMarketProfile, ["riskLevel"], "medium"));
  const macroRiskScore = getRiskLevelScore(macroRiskLevel);
  const macroSignals = asRecord(getPath(profiles.macroMarketProfile, ["demandSignals"]));
  const populationGrowth = getNumber(macroSignals, ["populationGrowth"], 55);
  const jobGrowth = getNumber(macroSignals, ["jobGrowth"], 55);
  const affordabilityScore = getNumber(macroSignals, ["affordabilityScore"], 55);
  const macroRentalDemand = getNumber(macroSignals, ["rentalDemand"], 55);
  const macroInvestorActivity = getNumber(macroSignals, ["investorActivity"], 55);
  const macroDistressOpportunity = getNumber(macroSignals, ["distressOpportunity"], 55);
  const countyAlphaScore = getNumber(profiles.countyAlphaProfile, ["alphaScore"], 55);
  const countyConfidence = getNumber(profiles.countyAlphaProfile, ["confidenceScore"], 0.55);
  const countyCompetitionLevel = normalize(getString(profiles.countyAlphaProfile, ["competitionLevel"], "medium"));
  const countyCompetitionScore = getCompetitionLevelScore(countyCompetitionLevel);
  const countyDistressLevel = getNumber(profiles.countyAlphaProfile, ["distressLevel"], 55);
  const rentalStrength = getNumber(profiles.countyAlphaProfile, ["rentalStrength"], macroRentalDemand);
  const acquisitionDifficulty = getNumber(profiles.countyAlphaProfile, ["acquisitionDifficulty"], 55);
  const demandAlignment = getNumber(profiles.countyAlphaProfile, ["demandAlignment"], buyerDemandScore);
  const investorFriendliness = getNumber(profiles.countyAlphaProfile, ["investorFriendliness"], 55);
  const pricingConfidence = getPricingConfidence(input.pricingProfile, input);
  const pricingRiskScore = getPricingRiskScore(input.pricingProfile);
  const externalRiskScore = getExternalRiskScore(input.riskProfile);
  const appreciationScore = trendToScore(input.appreciationTrend);
  const rentGrowthScore = trendToScore(input.rentGrowthTrend);
  const rentYieldScore = getRentYieldScore(input.medianPrice, input.medianRent);
  const foreclosurePressure = rateToPressure(input.foreclosureRate, 18, 12);
  const distressPressure = rateToPressure(input.distressRate, 11, 10);
  const investorCompetition = clampScore(countyCompetitionScore * 0.42 + acquisitionDifficulty * 0.25 + macroInvestorActivity * 0.22 + (100 - affordabilityScore) * 0.11);
  const liquidityStrength = clampScore(buyerDemandScore * 0.34 + macroInvestorActivity * 0.22 + demandAlignment * 0.2 + pricingConfidence * 100 * 0.12 + macroScore * 0.12);
  const liquidityPressure = clampScore(100 - liquidityStrength + Math.max(0, pricingRiskScore - 55) * 0.25);
  const riskScore = clampScore(
    macroRiskScore * 0.24 +
    pricingRiskScore * 0.22 +
    externalRiskScore * 0.2 +
    acquisitionDifficulty * 0.14 +
    investorCompetition * 0.1 +
    Math.max(0, liquidityPressure - 55) * 0.1,
  );
  const riskQuality = 100 - riskScore;
  const affordabilityPressure = 100 - affordabilityScore;
  const saturationPressure = clampScore(investorCompetition * 0.52 + affordabilityPressure * 0.26 + macroInvestorActivity * 0.22);
  const dataCompletenessScore = clampScore(100 - requiredMissingData.length * 8);

  return {
    ...profiles,
    buyerDemandScore,
    buyerConfidence,
    macroScore,
    macroConfidence,
    macroRiskLevel,
    macroRiskScore,
    populationGrowth,
    jobGrowth,
    affordabilityScore,
    macroRentalDemand,
    macroInvestorActivity,
    macroDistressOpportunity,
    countyAlphaScore,
    countyConfidence,
    countyCompetitionLevel,
    countyCompetitionScore,
    countyDistressLevel,
    rentalStrength,
    acquisitionDifficulty,
    demandAlignment,
    investorFriendliness,
    pricingConfidence,
    pricingRiskScore,
    externalRiskScore,
    appreciationScore,
    rentGrowthScore,
    rentYieldScore,
    foreclosurePressure,
    distressPressure,
    investorCompetition,
    liquidityPressure,
    riskScore,
    riskQuality,
    affordabilityPressure,
    saturationPressure,
    dataCompletenessScore,
    requiredMissingData,
  };
}

function calculateAcquisitionLanes(input: MarketTargetingAssessmentInput, context: MarketContext): AcquisitionLanes {
  const wholesale = clampScore(
    context.buyerDemandScore * 0.16 +
    context.distressPressure * 0.18 +
    context.foreclosurePressure * 0.12 +
    context.countyDistressLevel * 0.14 +
    context.countyAlphaScore * 0.1 +
    getAssetLaneFit(input.assetType ?? "", "wholesale") * 0.12 +
    context.riskQuality * 0.08 +
    (100 - context.investorCompetition) * 0.06 +
    (100 - context.liquidityPressure) * 0.04 +
    getStrategyLaneFit(input.strategy ?? "", "wholesale"),
  );
  const rental = clampScore(
    context.rentalStrength * 0.19 +
    context.macroRentalDemand * 0.13 +
    context.rentGrowthScore * 0.16 +
    context.rentYieldScore * 0.16 +
    context.investorFriendliness * 0.1 +
    context.buyerDemandScore * 0.08 +
    getAssetLaneFit(input.assetType ?? "", "rental") * 0.1 +
    context.riskQuality * 0.08 +
    getStrategyLaneFit(input.strategy ?? "", "rental"),
  );
  const multifamily = clampScore(
    context.rentalStrength * 0.18 +
    context.macroRentalDemand * 0.14 +
    context.rentGrowthScore * 0.12 +
    context.rentYieldScore * 0.12 +
    context.countyAlphaScore * 0.1 +
    context.demandAlignment * 0.08 +
    getAssetLaneFit(input.assetType ?? "", "multifamily") * 0.14 +
    context.riskQuality * 0.08 +
    (100 - context.acquisitionDifficulty) * 0.04 +
    getStrategyLaneFit(input.strategy ?? "", "multifamily"),
  );
  const land = clampScore(
    context.countyAlphaScore * 0.17 +
    context.appreciationScore * 0.12 +
    context.populationGrowth * 0.12 +
    context.jobGrowth * 0.08 +
    context.affordabilityScore * 0.1 +
    getAssetLaneFit(input.assetType ?? "", "land") * 0.22 +
    context.riskQuality * 0.08 +
    (100 - context.acquisitionDifficulty) * 0.06 +
    (100 - context.liquidityPressure) * 0.05 +
    getStrategyLaneFit(input.strategy ?? "", "land"),
  );
  const development = clampScore(
    context.populationGrowth * 0.13 +
    context.jobGrowth * 0.12 +
    context.appreciationScore * 0.17 +
    context.countyAlphaScore * 0.14 +
    context.macroScore * 0.1 +
    getAssetLaneFit(input.assetType ?? "", "development") * 0.16 +
    context.riskQuality * 0.08 +
    (100 - context.investorCompetition) * 0.05 +
    (100 - context.liquidityPressure) * 0.05 +
    getStrategyLaneFit(input.strategy ?? "", "development"),
  );
  const luxury = clampScore(
    context.appreciationScore * 0.18 +
    context.populationGrowth * 0.12 +
    context.jobGrowth * 0.12 +
    context.macroScore * 0.12 +
    context.buyerDemandScore * 0.1 +
    getAssetLaneFit(input.assetType ?? "", "luxury") * 0.15 +
    context.riskQuality * 0.11 +
    (100 - context.affordabilityPressure) * 0.05 +
    (100 - context.liquidityPressure) * 0.05 -
    Math.max(0, context.saturationPressure - 70) * 0.18 +
    getStrategyLaneFit(input.strategy ?? "", "luxury"),
  );
  const creativeFinance = clampScore(
    context.affordabilityPressure * 0.15 +
    context.distressPressure * 0.14 +
    context.foreclosurePressure * 0.1 +
    context.rentalStrength * 0.1 +
    context.investorFriendliness * 0.12 +
    context.buyerDemandScore * 0.1 +
    getAssetLaneFit(input.assetType ?? "", "creativeFinance") * 0.12 +
    context.riskQuality * 0.08 +
    (100 - context.liquidityPressure) * 0.05 +
    context.acquisitionDifficulty * 0.04 +
    getStrategyLaneFit(input.strategy ?? "", "creativeFinance"),
  );

  return {
    luxury,
    wholesale,
    rental,
    multifamily,
    land,
    development,
    creativeFinance,
  };
}

function getMarketTemperature(context: MarketContext): MarketTemperature {
  const heatScore = clampScore(
    context.buyerDemandScore * 0.15 +
    context.macroInvestorActivity * 0.18 +
    context.countyAlphaScore * 0.13 +
    context.appreciationScore * 0.14 +
    context.rentGrowthScore * 0.1 +
    context.saturationPressure * 0.16 +
    context.macroScore * 0.14,
  );

  if (heatScore >= 82 && context.saturationPressure >= 76) return "overheated";
  if (heatScore >= 75) return "hot";
  if (heatScore >= 60) return "warm";
  if (heatScore >= 42) return "stable";

  return "cold";
}

function calculateAcquisitionScore(context: MarketContext, lanes: AcquisitionLanes, marketTemperature: MarketTemperature) {
  const laneScores = LANE_NAMES.map((lane) => lanes[lane]);
  const topLaneScore = Math.max(...laneScores);
  const trendScore = average([context.appreciationScore, context.rentGrowthScore]);
  const distressLiquidityFit = clampScore(context.distressPressure * 0.48 + (100 - context.liquidityPressure) * 0.34 + context.buyerDemandScore * 0.18);
  const overheatedPenalty = marketTemperature === "overheated" ? 10 : marketTemperature === "hot" && context.saturationPressure >= 78 ? 5 : 0;
  const riskPenalty = context.riskScore >= 72 ? 8 : context.riskScore >= 60 ? 4 : 0;
  const missingPenalty = Math.max(0, context.requiredMissingData.length - 2) * 2.5;
  const rawScore =
    context.buyerDemandScore * 0.15 +
    context.macroScore * 0.14 +
    context.countyAlphaScore * 0.16 +
    context.pricingConfidence * 100 * 0.09 +
    context.riskQuality * 0.11 +
    topLaneScore * 0.13 +
    trendScore * 0.08 +
    distressLiquidityFit * 0.07 +
    context.demandAlignment * 0.04 +
    context.dataCompletenessScore * 0.03 -
    overheatedPenalty -
    riskPenalty -
    missingPenalty;

  return clampScore(rawScore);
}

function getAcquisitionGrade(score: number): AcquisitionGrade {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 68) return "B";
  if (score >= 52) return "C";

  return "D";
}

function getTargetRecommendation(score: number, context: MarketContext, marketTemperature: MarketTemperature): TargetRecommendation {
  const strongIntelligence = context.buyerDemandScore >= 70 && context.countyAlphaScore >= 70 && context.pricingConfidence >= 0.64 && context.riskScore < 58;

  if (context.riskScore >= 78 || score < 38 || context.dataCompletenessScore < 45) return "avoid";
  if (score >= 82 && strongIntelligence && marketTemperature !== "overheated") return "aggressive_acquisition";
  if (score >= 65 && context.riskScore < 68 && marketTemperature !== "overheated") return "target_selectively";
  if (score >= 45) return "opportunistic_only";

  return "avoid";
}

function getLeadPriority(score: number, recommendation: TargetRecommendation): LeadPriority {
  if (recommendation === "avoid" || score < 45) return "low";
  if (score >= 85 && recommendation === "aggressive_acquisition") return "elite";
  if (score >= 70) return "high";
  if (score >= 52) return "medium";

  return "low";
}

function getTopLanes(lanes: AcquisitionLanes) {
  return [...LANE_NAMES].sort((left, right) => lanes[right] - lanes[left]);
}

function getTargetStrategies(lanes: AcquisitionLanes) {
  const strategyMap: Record<AcquisitionLaneName, string[]> = {
    luxury: ["luxury"],
    wholesale: ["wholesale", "wholetail", "fix_and_flip"],
    rental: ["buy_and_hold", "BRRRR", "rental"],
    multifamily: ["multifamily"],
    land: ["land_flip"],
    development: ["development"],
    creativeFinance: ["creative_finance", "subject_to", "seller_finance"],
  };

  const selectedStrategies = getTopLanes(lanes)
    .filter((lane) => lanes[lane] >= 58)
    .flatMap((lane) => strategyMap[lane]);

  return unique(selectedStrategies.length > 0 ? selectedStrategies : strategyMap[getTopLanes(lanes)[0]]).slice(0, 6);
}

function getTargetAssetTypes(input: MarketTargetingAssessmentInput, lanes: AcquisitionLanes) {
  const assetTypes = new Set<string>();
  const normalizedAssetType = normalize(input.assetType);

  if (normalizedAssetType) assetTypes.add(normalizedAssetType);
  if (lanes.wholesale >= 60) assetTypes.add("single_family");
  if (lanes.rental >= 60) assetTypes.add("rental_ready_single_family");
  if (lanes.multifamily >= 58) assetTypes.add("small_multifamily");
  if (lanes.land >= 58) assetTypes.add("land");
  if (lanes.development >= 62) assetTypes.add("infill_development_lots");
  if (lanes.luxury >= 62) assetTypes.add("luxury_single_family");

  return [...assetTypes].slice(0, 6);
}

function getMarketStrengths(context: MarketContext, lanes: AcquisitionLanes) {
  return unique([
    ...(context.buyerDemandScore >= 70 ? ["Buyer demand is strong enough to support targeted acquisition."] : []),
    ...(context.macroScore >= 70 ? ["Macro fundamentals support market-level opportunity."] : []),
    ...(context.countyAlphaScore >= 70 ? ["County alpha score indicates attractive hyper-local opportunity."] : []),
    ...(context.rentGrowthScore >= 68 || context.rentYieldScore >= 68 ? ["Rental economics support landlord and rental-buyer demand."] : []),
    ...(context.distressPressure >= 60 && context.buyerDemandScore >= 65 ? ["Distress pressure plus buyer demand supports wholesale lead targeting."] : []),
    ...(context.investorCompetition >= 45 && context.investorCompetition <= 68 && context.macroScore >= 62 ? ["Moderate competition with improving fundamentals suggests hidden opportunity pockets."] : []),
    ...(Math.max(...LANE_NAMES.map((lane) => lanes[lane])) >= 72 ? ["At least one acquisition lane scores strongly enough to prioritize."] : []),
  ]);
}

function getMarketWeaknesses(context: MarketContext, marketTemperature: MarketTemperature) {
  return unique([
    ...(context.requiredMissingData.length > 0 ? [`Missing targeting inputs: ${context.requiredMissingData.join(", ")}.`] : []),
    ...(context.macroRiskLevel === "high" ? ["Macro risk is elevated and should reduce aggressive acquisition."] : []),
    ...(context.investorCompetition >= 75 ? ["Investor competition appears high and may compress margins."] : []),
    ...(context.liquidityPressure >= 68 ? ["Liquidity pressure may slow disposition or reduce buyer depth."] : []),
    ...(context.pricingConfidence < 0.58 ? ["Pricing confidence is limited without stronger pricing support."] : []),
    ...(context.riskScore >= 68 ? ["Composite market risk is elevated."] : []),
    ...(marketTemperature === "overheated" ? ["Market appears overheated, so acquisition should be more selective."] : []),
    ...(context.rentYieldScore < 45 ? ["Rent-to-price relationship is weak for rental-heavy targeting."] : []),
  ]);
}

function getOpportunitySignals(context: MarketContext, lanes: AcquisitionLanes) {
  return unique([
    ...(lanes.wholesale >= 68 ? ["Wholesale lane is supported by distress, buyer depth, and acquisition spread potential."] : []),
    ...(lanes.rental >= 68 ? ["Rental lane is supported by rent growth, rent yield, and rental demand."] : []),
    ...(lanes.multifamily >= 66 ? ["Small multifamily lane deserves review where rent roll and deferred maintenance can be verified."] : []),
    ...(lanes.land >= 66 ? ["Land lane may work where access, utilities, and buyer depth are verified."] : []),
    ...(lanes.development >= 68 ? ["Development lane is supported by population, job, and appreciation signals."] : []),
    ...(lanes.creativeFinance >= 64 ? ["Creative finance lane may fit affordability pressure or seller flexibility scenarios."] : []),
    ...(context.investorCompetition >= 45 && context.investorCompetition <= 68 && context.rentGrowthScore >= 62 ? ["Hidden opportunity zone: competition is not extreme while demand signals are improving."] : []),
  ]);
}

function getWarningSignals(context: MarketContext, lanes: AcquisitionLanes, marketTemperature: MarketTemperature) {
  return unique([
    ...(marketTemperature === "overheated" ? ["Overheated acquisition zone detected; require tighter underwriting and stronger discounts."] : []),
    ...(context.investorCompetition >= 75 ? ["High investor saturation may reduce assignment or flip margins."] : []),
    ...(context.liquidityPressure >= 70 ? ["Weak liquidity may require slower exit assumptions."] : []),
    ...(context.riskScore >= 70 ? ["High volatility/risk signal should prevent aggressive acquisition."] : []),
    ...(lanes.land >= 60 && context.pricingConfidence < 0.65 ? ["Land targeting requires stronger pricing confidence before prioritization."] : []),
    ...(lanes.development >= 60 && context.dataCompletenessScore < 80 ? ["Development targeting requires stronger market and entitlement inputs."] : []),
    ...(lanes.luxury >= 60 && context.saturationPressure >= 68 ? ["Luxury targeting is sensitive to market saturation and exit timing."] : []),
  ]);
}

function getRecommendedMarketingFocus(context: MarketContext, lanes: AcquisitionLanes, recommendation: TargetRecommendation) {
  if (recommendation === "avoid") {
    return ["Do not prioritize new acquisition marketing here until missing data, risk, and liquidity signals improve."];
  }

  return unique([
    ...(lanes.wholesale >= 62 ? ["Distress-driven seller lists with verified equity and repair spread."] : []),
    ...(lanes.rental >= 62 ? ["Rental-friendly neighborhoods with verified rent support and landlord-buyer exits."] : []),
    ...(lanes.creativeFinance >= 62 ? ["Seller situations where payment relief, timeline pressure, or flexible terms may matter."] : []),
    ...(lanes.land >= 62 ? ["Infill land, utility-access lots, and parcels with clear buyer demand."] : []),
    ...(lanes.multifamily >= 62 ? ["Small multifamily owners with deferred maintenance, rent upside, or management fatigue."] : []),
    ...(lanes.development >= 64 ? ["Growth corridors where entitlement, access, and resale demand can be verified."] : []),
    ...(context.investorCompetition >= 70 ? ["Narrow targeting to submarkets where competition is lower than the county average."] : []),
  ]).slice(0, 6);
}

function getRecommendedSellerProfiles(context: MarketContext, lanes: AcquisitionLanes) {
  return unique([
    ...(lanes.wholesale >= 62 ? ["equity-rich absentee owners", "deferred-maintenance owners", "tax-delinquent or distress-adjacent owners"] : []),
    ...(lanes.rental >= 62 ? ["tired landlords", "small rental portfolio owners", "owners with below-market rents"] : []),
    ...(lanes.creativeFinance >= 62 ? ["owners needing flexible terms", "sellers with payment or timeline pressure"] : []),
    ...(lanes.land >= 62 || lanes.development >= 62 ? ["landowners with underused parcels", "owners near growth corridors"] : []),
    ...(context.requiredMissingData.length > 0 ? ["seller profiles require validation after missing market inputs are collected"] : []),
  ]).slice(0, 7);
}

function getRecommendedBuyerProfiles(lanes: AcquisitionLanes) {
  return unique([
    ...(lanes.wholesale >= 62 ? ["cash buyers", "fix-and-flip investors"] : []),
    ...(lanes.rental >= 62 ? ["rental buyers", "BRRRR investors"] : []),
    ...(lanes.multifamily >= 62 ? ["small multifamily buyers"] : []),
    ...(lanes.land >= 62 ? ["land investors"] : []),
    ...(lanes.development >= 62 ? ["builders and developers"] : []),
    ...(lanes.luxury >= 62 ? ["luxury-focused investors"] : []),
    ...(lanes.creativeFinance >= 62 ? ["creative finance buyers"] : []),
  ]).slice(0, 7);
}

function calculateConfidenceScore(context: MarketContext, marketTemperature: MarketTemperature) {
  const intelligenceConfidence = average([context.buyerConfidence, context.macroConfidence, context.countyConfidence, context.pricingConfidence]);
  const signalScores = [
    context.buyerDemandScore,
    context.macroScore,
    context.countyAlphaScore,
    context.riskQuality,
    context.demandAlignment,
    context.rentalStrength,
  ];
  const signalSpread = Math.max(...signalScores) - Math.min(...signalScores);
  const consistencyScore = 1 - clamp(signalSpread / 100, 0, 1);
  const riskPenalty = context.riskScore >= 72 ? 0.12 : context.riskScore >= 62 ? 0.06 : 0;
  const temperaturePenalty = marketTemperature === "overheated" ? 0.08 : marketTemperature === "hot" && context.saturationPressure >= 78 ? 0.04 : 0;
  const missingPenalty = Math.min(0.18, context.requiredMissingData.length * 0.025);
  const confidence =
    intelligenceConfidence * 0.42 +
    consistencyScore * 0.2 +
    context.dataCompletenessScore / 100 * 0.26 +
    context.riskQuality / 100 * 0.12 -
    riskPenalty -
    temperaturePenalty -
    missingPenalty;

  return round(clamp(confidence, 0, 1));
}

function getReasoning(params: {
  input: MarketTargetingAssessmentInput;
  context: MarketContext;
  acquisitionScore: number;
  acquisitionGrade: AcquisitionGrade;
  marketTemperature: MarketTemperature;
  targetRecommendation: TargetRecommendation;
  leadPriority: LeadPriority;
  lanes: AcquisitionLanes;
}) {
  const topLanes = getTopLanes(params.lanes)
    .slice(0, 3)
    .map((lane) => `${lane} ${params.lanes[lane]}/100`)
    .join(", ");
  const marketLabel = [params.input.location, params.input.county, params.input.state].filter(Boolean).join(", ") || "the selected market";

  return `${marketLabel} is graded ${params.acquisitionGrade} with a ${params.acquisitionScore}/100 acquisition score, ${params.marketTemperature} market temperature, and ${params.leadPriority} lead priority. The recommendation is ${params.targetRecommendation} because buyer demand is ${params.context.buyerDemandScore}/100, macro market strength is ${params.context.macroScore}/100, county alpha is ${params.context.countyAlphaScore}/100, pricing confidence is ${round(params.context.pricingConfidence, 2)}, risk quality is ${params.context.riskQuality}/100, and the strongest acquisition lanes are ${topLanes}. This read-only assessment uses deterministic intelligence inputs and does not execute outreach, automation, buyer routing, or database updates.`;
}

function getIntelligenceInputsUsed(input: MarketTargetingAssessmentInput) {
  return unique([
    input.buyerDemandProfile ? "provided_buyer_demand_profile" : "buyer_demand_intelligence_agent",
    input.macroMarketProfile ? "provided_macro_market_profile" : "macro_market_ai_agent",
    input.countyAlphaProfile ? "provided_county_alpha_profile" : "county_alpha_ai_agent",
    input.pricingProfile ? "provided_pricing_profile" : "market_pricing_proxy_from_median_values",
    input.riskProfile ? "provided_risk_profile" : "risk_proxy_from_market_county_pricing_signals",
  ]);
}

export function getMarketTargetingAssessment(input: MarketTargetingAssessmentInput = {}): MarketTargetingAssessment {
  const context = getMarketContext(input);
  const acquisitionLanes = calculateAcquisitionLanes(input, context);
  const marketTemperature = getMarketTemperature(context);
  const acquisitionScore = calculateAcquisitionScore(context, acquisitionLanes, marketTemperature);
  const acquisitionGrade = getAcquisitionGrade(acquisitionScore);
  const targetRecommendation = getTargetRecommendation(acquisitionScore, context, marketTemperature);
  const leadPriority = getLeadPriority(acquisitionScore, targetRecommendation);
  const distressIndicators: DistressIndicators = {
    foreclosurePressure: context.foreclosurePressure,
    distressPressure: context.distressPressure,
    investorCompetition: context.investorCompetition,
    liquidityPressure: context.liquidityPressure,
  };

  return {
    acquisitionScore,
    acquisitionGrade,
    marketTemperature,
    targetRecommendation,
    targetAssetTypes: getTargetAssetTypes(input, acquisitionLanes),
    targetStrategies: getTargetStrategies(acquisitionLanes),
    leadPriority,
    marketStrengths: getMarketStrengths(context, acquisitionLanes),
    marketWeaknesses: getMarketWeaknesses(context, marketTemperature),
    opportunitySignals: getOpportunitySignals(context, acquisitionLanes),
    warningSignals: getWarningSignals(context, acquisitionLanes, marketTemperature),
    acquisitionLanes,
    distressIndicators,
    confidenceScore: calculateConfidenceScore(context, marketTemperature),
    recommendedMarketingFocus: getRecommendedMarketingFocus(context, acquisitionLanes, targetRecommendation),
    recommendedSellerProfiles: getRecommendedSellerProfiles(context, acquisitionLanes),
    recommendedBuyerProfiles: getRecommendedBuyerProfiles(acquisitionLanes),
    reasoning: getReasoning({
      input,
      context,
      acquisitionScore,
      acquisitionGrade,
      marketTemperature,
      targetRecommendation,
      leadPriority,
      lanes: acquisitionLanes,
    }),
    requiredMissingData: context.requiredMissingData,
    intelligenceInputsUsed: getIntelligenceInputsUsed(input),
  };
}
