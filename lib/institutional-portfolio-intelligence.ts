export type PortfolioRole =
  | "cash_flow_anchor"
  | "long_term_appreciation"
  | "luxury_hold"
  | "development_upside"
  | "capital_preservation"
  | "strategic_land_bank"
  | "income_growth"
  | "redevelopment_candidate"
  | "opportunistic_acquisition"
  | "portfolio_diversifier";

export type InstitutionalPortfolioRating = "avoid" | "weak" | "watchlist" | "strong" | "elite";

export interface InstitutionalPortfolioExplanation {
  category: string;
  message: string;
  scoreImpact: "positive" | "negative" | "neutral";
  relatedRole?: PortfolioRole;
}

export interface PortfolioRoleAnalysis {
  role: PortfolioRole;
  fitScore: number;
  confidenceScore: number;
  riskScore: number;
  reasons: string[];
  blockers: string[];
  humanReviewRecommended: boolean;
}

export interface PortfolioDiversificationProfile {
  geographicDiversificationScore: number;
  assetTypeDiversificationScore: number;
  luxuryExposureBalanceScore: number;
  developmentExposureBalanceScore: number;
  incomeAppreciationBalanceScore: number;
  strategicOptionalityScore: number;
  concentrationOffsetPotentialScore: number;
}

export interface PortfolioConcentrationAnalysis {
  geographyConcentrationRiskScore: number;
  luxuryConcentrationRiskScore: number;
  developmentConcentrationRiskScore: number;
  liquidityConcentrationRiskScore: number;
  assetUniquenessConcentrationRiskScore: number;
  corridorExposureConcentrationRiskScore: number;
  overallConcentrationRiskScore: number;
}

export interface GeographicPortfolioFit {
  corridorStrengthScore: number;
  marketDurabilityScore: number;
  strategicLocationQualityScore: number;
  expansionPotentialScore: number;
  luxuryCorridorFitScore: number;
  developmentCorridorFitScore: number;
  longTermRegionalAttractivenessScore: number;
}

export interface AssetTypePortfolioFit {
  assetTypeBalanceScore: number;
  incomeAssetFitScore: number;
  appreciationAssetFitScore: number;
  luxuryAssetFitScore: number;
  developmentAssetFitScore: number;
  liquidityAssetFitScore: number;
  diversificationContributionScore: number;
}

export interface InstitutionalHoldQuality {
  longTermStabilityScore: number;
  scarcityScore: number;
  capitalPreservationQualityScore: number;
  institutionalAttractivenessScore: number;
  downsideResilienceProxyScore: number;
  strategicHoldDurabilityScore: number;
}

export interface PortfolioStabilityProfile {
  volatilityProxyScore: number;
  liquidityRiskScore: number;
  stabilityScore: number;
  durabilityScore: number;
  appreciationDurabilityScore: number;
  redevelopmentVolatilityScore: number;
  executionComplexityScore: number;
}

export interface PortfolioRiskProfile {
  overallRiskScore: number;
  concentrationRiskScore: number;
  liquidityRiskScore: number;
  executionRiskScore: number;
  volatilityRiskScore: number;
  dataQualityRiskScore: number;
  humanReviewRecommended: boolean;
}

export interface InstitutionalPortfolioScore {
  overallPortfolioFitScore: number;
  riskAdjustedPortfolioFitScore: number;
  diversificationQualityScore: number;
  concentrationRiskAdjustedScore: number;
  geographicFitScore: number;
  assetTypeFitScore: number;
  institutionalHoldQualityScore: number;
  portfolioStabilityScore: number;
  strategicRoleFitScore: number;
}

export type InstitutionalPortfolioInput = {
  address?: string;
  city?: string;
  county?: string;
  state?: string;
  market?: string;
  corridor?: string;
  assetType?: string;
  propertyType?: string;
  strategy?: string;
  estimatedValue?: number;
  askingPrice?: number;
  arv?: number;
  monthlyRent?: number;
  annualNOI?: number;
  noi?: number;
  capRate?: number;
  occupancyRate?: number;
  units?: number;
  lotSizeAcres?: number;
  acreage?: number;
  squareFeet?: number;
  appreciationTrend?: number;
  rentGrowthTrend?: number;
  marketLiquidity?: string | number;
  luxuryBuyerDemand?: string | number;
  buyerDemandScore?: number;
  corridorPrestige?: string | number;
  corridorGrowthStrength?: string | number;
  marketDurability?: string | number;
  expansionPotential?: string | number;
  scarcityScore?: number;
  developmentPotential?: string | number;
  redevelopmentPotential?: string | number;
  landDevelopmentPotential?: string | number;
  zoningFlexibility?: string | number;
  institutionalInterest?: string | number;
  builderInterest?: string | number;
  uniquenessFactor?: string | number;
  privacyLevel?: string | number;
  titleComplexityRisk?: string | number;
  executionComplexity?: string | number;
  currentPortfolioMarkets?: string[];
  currentPortfolioStates?: string[];
  currentPortfolioAssetTypes?: string[];
  currentPortfolioStrategies?: string[];
  existingLuxuryExposurePercent?: number;
  targetLuxuryExposurePercent?: number;
  existingDevelopmentExposurePercent?: number;
  targetDevelopmentExposurePercent?: number;
  existingMarketExposurePercent?: number;
  existingAssetTypeExposurePercent?: number;
  incomeWeightTarget?: number;
  appreciationWeightTarget?: number;
  currentIncomeWeight?: number;
  currentAppreciationWeight?: number;
  portfolioGoal?: string;
  exitStrategies?: string[];
  luxuryAcquisitionProfile?: unknown;
  luxuryDealProfile?: unknown;
  luxuryLandDevelopmentProfile?: unknown;
  uhnwBuyerProfile?: unknown;
  marketTargetingProfile?: unknown;
  acquisitionZoneProfile?: unknown;
  riskProfile?: unknown;
  pricingProfile?: unknown;
};

export interface InstitutionalPortfolioAnalysis {
  overallPortfolioFitScore: number;
  institutionalPortfolioRating: InstitutionalPortfolioRating;
  primaryPortfolioRole: PortfolioRole;
  rankedPortfolioRoles: PortfolioRoleAnalysis[];
  diversificationProfile: PortfolioDiversificationProfile;
  concentrationAnalysis: PortfolioConcentrationAnalysis;
  geographicPortfolioFit: GeographicPortfolioFit;
  assetTypePortfolioFit: AssetTypePortfolioFit;
  institutionalHoldQuality: InstitutionalHoldQuality;
  stabilityProfile: PortfolioStabilityProfile;
  riskProfile: PortfolioRiskProfile;
  scores: InstitutionalPortfolioScore;
  strengths: string[];
  risks: string[];
  blockers: string[];
  missingData: string[];
  explanations: InstitutionalPortfolioExplanation[];
  explanation: string;
  confidenceScore: number;
  safety: {
    readOnly: true;
    outreachAuthorized: false;
    executionAuthorized: false;
    investmentAdvice: false;
    securitiesAdvice: false;
    legalAdvice: false;
    lendingAdvice: false;
    taxAdvice: false;
    guaranteedReturns: false;
    humanReviewRecommended: true;
  };
  complianceNotice: string;
  readOnly: true;
}

const COMPLIANCE_NOTICE =
  "Institutional portfolio intelligence is deterministic strategic analysis only. It is not investment, securities, fiduciary, legal, lending, tax, or financial advice and does not guarantee returns, appreciation, income, financing, liquidity, or exit outcomes.";

const POSITIVE_TERMS = ["high", "strong", "excellent", "elite", "prime", "durable", "stable", "favorable", "deep", "institutional"];
const MEDIUM_TERMS = ["medium", "moderate", "average", "balanced", "partial", "emerging"];
const NEGATIVE_TERMS = ["low", "weak", "poor", "thin", "limited", "volatile", "constrained", "difficult"];
const LUXURY_TERMS = ["luxury", "estate", "trophy", "custom", "waterfront", "gated", "golf", "ultra", "high_end"];
const DEVELOPMENT_TERMS = ["development", "redevelopment", "land", "teardown", "builder", "subdivision", "infill", "entitlement"];
const INCOME_TERMS = ["rental", "hold", "cash_flow", "income", "multifamily", "brrrr"];

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

function includesAny(value: string | undefined, terms: string[]) {
  const normalized = normalize(value);

  return terms.some((term) => normalized.includes(normalize(term)));
}

function scoreNumber(value: number | undefined, fallback: number) {
  if (!hasNumber(value)) return fallback;

  return clampScore(value <= 1 ? value * 100 : value);
}

function scoreFromText(value: string | number | undefined, fallback: number, map: Record<string, number>) {
  if (typeof value === "number") return scoreNumber(value, fallback);
  const normalized = normalize(value);
  if (!normalized) return fallback;

  for (const [term, score] of Object.entries(map)) {
    if (normalized.includes(normalize(term))) return score;
  }

  if (POSITIVE_TERMS.some((term) => normalized.includes(normalize(term)))) return 82;
  if (MEDIUM_TERMS.some((term) => normalized.includes(normalize(term)))) return 60;
  if (NEGATIVE_TERMS.some((term) => normalized.includes(normalize(term)))) return 30;

  return fallback;
}

function extractScore(profile: unknown, keys: string[], fallback: number) {
  if (!profile || typeof profile !== "object") return fallback;
  const record = profile as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return scoreNumber(value, fallback);
    if (typeof value === "string") return scoreFromText(value, fallback, {});
  }

  return fallback;
}

function getPrimaryValue(input: InstitutionalPortfolioInput) {
  return input.estimatedValue ?? input.arv ?? input.askingPrice ?? 0;
}

function getNOI(input: InstitutionalPortfolioInput) {
  return input.annualNOI ?? input.noi ?? (hasNumber(input.monthlyRent) ? input.monthlyRent * 12 * 0.62 : 0);
}

function getAcreage(input: InstitutionalPortfolioInput) {
  return input.acreage ?? input.lotSizeAcres ?? 0;
}

function getAssetText(input: InstitutionalPortfolioInput) {
  return `${input.assetType ?? ""} ${input.propertyType ?? ""} ${input.strategy ?? ""} ${(input.exitStrategies ?? []).join(" ")}`;
}

function getLocationText(input: InstitutionalPortfolioInput) {
  return `${input.city ?? ""} ${input.county ?? ""} ${input.state ?? ""} ${input.market ?? ""} ${input.corridor ?? ""}`;
}

function getMissingData(input: InstitutionalPortfolioInput) {
  return unique([
    ...(!input.city && !input.market && !input.county ? ["city, market, or county"] : []),
    ...(!input.state ? ["state"] : []),
    ...(!input.assetType && !input.propertyType ? ["asset type or property type"] : []),
    ...(!hasNumber(input.estimatedValue) && !hasNumber(input.arv) ? ["estimated value or ARV"] : []),
    ...(input.marketLiquidity === undefined ? ["market liquidity"] : []),
    ...(input.corridorPrestige === undefined ? ["corridor prestige"] : []),
    ...(input.corridorGrowthStrength === undefined ? ["corridor growth strength"] : []),
    ...(!hasNumber(input.appreciationTrend) ? ["appreciation trend"] : []),
    ...(input.luxuryBuyerDemand === undefined && !hasNumber(input.buyerDemandScore) ? ["luxury or buyer demand"] : []),
    ...(input.scarcityScore === undefined ? ["scarcity score"] : []),
    ...(input.institutionalInterest === undefined ? ["institutional interest"] : []),
    ...(input.currentPortfolioMarkets === undefined && input.currentPortfolioStates === undefined ? ["current portfolio markets or states"] : []),
    ...(input.currentPortfolioAssetTypes === undefined ? ["current portfolio asset types"] : []),
    ...(input.existingLuxuryExposurePercent === undefined ? ["existing luxury exposure percent"] : []),
    ...(input.existingDevelopmentExposurePercent === undefined ? ["existing development exposure percent"] : []),
    ...(input.incomeWeightTarget === undefined && input.appreciationWeightTarget === undefined ? ["income/appreciation portfolio target"] : []),
    ...(!input.exitStrategies || input.exitStrategies.length === 0 ? ["exit strategies"] : []),
  ]);
}

function getIncomeScore(input: InstitutionalPortfolioInput) {
  const value = getPrimaryValue(input);
  const noi = getNOI(input);
  const capRate = hasNumber(input.capRate) ? scoreNumber(input.capRate * 12, 50) : value > 0 && noi > 0 ? clampScore((noi / value) * 1200) : 42;
  const occupancy = hasNumber(input.occupancyRate) ? scoreNumber(input.occupancyRate, 55) : 52;
  const rentGrowth = hasNumber(input.rentGrowthTrend) ? clampScore(input.rentGrowthTrend * 10 + 34) : 50;
  const incomeAssetSignal = includesAny(getAssetText(input), INCOME_TERMS) ? 78 : 42;
  const unitBonus = (input.units ?? 0) >= 3 ? 8 : 0;

  return clampScore(capRate * 0.36 + occupancy * 0.18 + rentGrowth * 0.18 + incomeAssetSignal * 0.18 + unitBonus);
}

function getAppreciationScore(input: InstitutionalPortfolioInput) {
  return clampScore(
    (hasNumber(input.appreciationTrend) ? clampScore(input.appreciationTrend * 10 + 34) : 52) * 0.4 +
      scoreFromText(input.corridorGrowthStrength, 52, { elite: 92, high: 86, strong: 84, rising: 74, moderate: 60, low: 30 }) * 0.22 +
      scoreFromText(input.corridorPrestige, 52, { trophy: 96, prime: 90, elite: 88, luxury: 82, emerging: 66, moderate: 58, low: 30 }) * 0.18 +
      scoreNumber(input.scarcityScore, 55) * 0.2,
  );
}

function getLuxuryScore(input: InstitutionalPortfolioInput) {
  const value = getPrimaryValue(input);
  const valueSignal = value >= 10_000_000 ? 96 : value >= 5_000_000 ? 88 : value >= 2_000_000 ? 74 : value >= 1_000_000 ? 62 : 42;
  const textSignal = includesAny(getAssetText(input), LUXURY_TERMS) ? 82 : 46;

  return clampScore(
    Math.max(extractScore(input.luxuryAcquisitionProfile, ["overallScore", "institutionalViabilityScore"], 0), extractScore(input.luxuryDealProfile, ["overallOpportunityScore", "institutionalAttractivenessScore"], 0), valueSignal) * 0.34 +
      textSignal * 0.16 +
      scoreFromText(input.luxuryBuyerDemand, scoreNumber(input.buyerDemandScore, 52), { elite: 92, high: 86, strong: 84, moderate: 60, low: 30 }) * 0.18 +
      scoreFromText(input.corridorPrestige, 52, { trophy: 96, prime: 90, elite: 88, luxury: 82, emerging: 66, moderate: 58, low: 30 }) * 0.18 +
      scoreNumber(input.scarcityScore, 55) * 0.14,
  );
}

function getDevelopmentScore(input: InstitutionalPortfolioInput) {
  const assetSignal = includesAny(getAssetText(input), DEVELOPMENT_TERMS) ? 78 : 42;
  const landScore = extractScore(input.luxuryLandDevelopmentProfile, ["overallScore", "builderDeveloperAppealScore", "developmentScore"], 52);

  return clampScore(
    Math.max(scoreFromText(input.developmentPotential, 50, { high: 88, strong: 84, moderate: 60, low: 28 }), scoreFromText(input.landDevelopmentPotential, 50, { high: 88, strong: 84, moderate: 60, low: 28 })) * 0.25 +
      scoreFromText(input.redevelopmentPotential, 50, { high: 86, strong: 84, teardown: 88, moderate: 60, low: 28 }) * 0.18 +
      landScore * 0.22 +
      scoreFromText(input.builderInterest, 50, { high: 88, strong: 84, moderate: 60, low: 28 }) * 0.12 +
      scoreFromText(input.zoningFlexibility, 50, { flexible: 78, favorable: 76, moderate: 58, limited: 34 }) * 0.1 +
      assetSignal * 0.13,
  );
}

export function evaluateGeographicPortfolioFit(input: InstitutionalPortfolioInput): GeographicPortfolioFit {
  const corridorStrengthScore = clampScore(
    scoreFromText(input.corridorPrestige, 52, { trophy: 96, prime: 90, elite: 88, luxury: 82, emerging: 66, moderate: 58, low: 30 }) * 0.48 +
      scoreFromText(input.corridorGrowthStrength, 52, { elite: 92, high: 86, strong: 84, rising: 74, moderate: 60, low: 30 }) * 0.52,
  );
  const liquidity = scoreFromText(input.marketLiquidity, 52, { deep: 86, high: 80, moderate: 60, low: 34, weak: 28 });
  const demand = scoreFromText(input.luxuryBuyerDemand, scoreNumber(input.buyerDemandScore, 52), { elite: 92, high: 86, strong: 84, moderate: 60, low: 30 });
  const marketDurabilityScore = clampScore(
    scoreFromText(input.marketDurability, 54, { durable: 88, strong: 84, stable: 78, moderate: 60, volatile: 34, weak: 28 }) * 0.32 +
      liquidity * 0.2 +
      demand * 0.2 +
      corridorStrengthScore * 0.18 +
      getAppreciationScore(input) * 0.1,
  );
  const strategicLocationQualityScore = clampScore(corridorStrengthScore * 0.34 + marketDurabilityScore * 0.26 + scoreFromText(input.institutionalInterest, 50, { institutional: 88, high: 86, strong: 84, moderate: 60, low: 28 }) * 0.18 + demand * 0.22);
  const expansionPotentialScore = clampScore(
    scoreFromText(input.expansionPotential, 52, { high: 86, strong: 84, rising: 76, moderate: 60, low: 30 }) * 0.42 +
      scoreFromText(input.corridorGrowthStrength, 52, { elite: 92, high: 86, strong: 84, rising: 74, moderate: 60, low: 30 }) * 0.3 +
      getDevelopmentScore(input) * 0.14 +
      getAppreciationScore(input) * 0.14,
  );
  const luxuryCorridorFitScore = clampScore(getLuxuryScore(input) * 0.38 + corridorStrengthScore * 0.34 + demand * 0.16 + scoreNumber(input.scarcityScore, 55) * 0.12);
  const developmentCorridorFitScore = clampScore(getDevelopmentScore(input) * 0.42 + expansionPotentialScore * 0.24 + corridorStrengthScore * 0.18 + scoreFromText(input.zoningFlexibility, 50, { flexible: 78, favorable: 76, moderate: 58, limited: 34 }) * 0.16);
  const longTermRegionalAttractivenessScore = clampScore(marketDurabilityScore * 0.3 + strategicLocationQualityScore * 0.24 + expansionPotentialScore * 0.18 + getAppreciationScore(input) * 0.16 + liquidity * 0.12);

  return {
    corridorStrengthScore,
    marketDurabilityScore,
    strategicLocationQualityScore,
    expansionPotentialScore,
    luxuryCorridorFitScore,
    developmentCorridorFitScore,
    longTermRegionalAttractivenessScore,
  };
}

export function evaluateAssetTypePortfolioFit(input: InstitutionalPortfolioInput): AssetTypePortfolioFit {
  const currentAssets = (input.currentPortfolioAssetTypes ?? []).map(normalize);
  const assetText = normalize(getAssetText(input));
  const repeatsAssetType = currentAssets.some((asset) => assetText.includes(asset) && asset !== "");
  const incomeAssetFitScore = getIncomeScore(input);
  const appreciationAssetFitScore = getAppreciationScore(input);
  const luxuryAssetFitScore = getLuxuryScore(input);
  const developmentAssetFitScore = getDevelopmentScore(input);
  const liquidityAssetFitScore = scoreFromText(input.marketLiquidity, 52, { deep: 86, high: 80, moderate: 60, low: 34, weak: 28 });
  const assetTypeBalanceScore = clampScore((repeatsAssetType ? 46 : 76) * 0.42 + incomeAssetFitScore * 0.16 + appreciationAssetFitScore * 0.16 + liquidityAssetFitScore * 0.14 + Math.max(luxuryAssetFitScore, developmentAssetFitScore) * 0.12);
  const balanceContribution = Math.abs(incomeAssetFitScore - appreciationAssetFitScore) <= 18 ? 78 : 58;
  const diversificationContributionScore = clampScore(assetTypeBalanceScore * 0.46 + balanceContribution * 0.54);

  return {
    assetTypeBalanceScore,
    incomeAssetFitScore,
    appreciationAssetFitScore,
    luxuryAssetFitScore,
    developmentAssetFitScore,
    liquidityAssetFitScore,
    diversificationContributionScore,
  };
}

export function evaluatePortfolioConcentration(input: InstitutionalPortfolioInput, assetFit = evaluateAssetTypePortfolioFit(input), geographicFit = evaluateGeographicPortfolioFit(input)): PortfolioConcentrationAnalysis {
  const locationText = normalize(getLocationText(input));
  const marketRepeats = [...(input.currentPortfolioMarkets ?? []), ...(input.currentPortfolioStates ?? [])].map(normalize).some((location) => location !== "" && locationText.includes(location));
  const geographyConcentrationRiskScore = clampScore((marketRepeats ? 72 : 34) * 0.48 + scoreNumber(input.existingMarketExposurePercent, marketRepeats ? 68 : 36) * 0.34 + (100 - geographicFit.longTermRegionalAttractivenessScore) * 0.18);
  const luxuryConcentrationRiskScore = clampScore(scoreNumber(input.existingLuxuryExposurePercent, 45) * 0.46 + (assetFit.luxuryAssetFitScore >= 70 ? 68 : 34) * 0.34 + (100 - assetFit.liquidityAssetFitScore) * 0.2);
  const developmentConcentrationRiskScore = clampScore(scoreNumber(input.existingDevelopmentExposurePercent, 40) * 0.48 + (assetFit.developmentAssetFitScore >= 70 ? 72 : 34) * 0.34 + (100 - scoreFromText(input.zoningFlexibility, 50, { flexible: 78, favorable: 76, moderate: 58, limited: 34 })) * 0.18);
  const liquidityConcentrationRiskScore = clampScore((100 - assetFit.liquidityAssetFitScore) * 0.58 + scoreNumber(input.existingAssetTypeExposurePercent, 45) * 0.22 + (assetFit.luxuryAssetFitScore >= 75 ? 62 : 40) * 0.2);
  const assetUniquenessConcentrationRiskScore = clampScore(scoreFromText(input.uniquenessFactor, 52, { trophy: 86, unique: 82, rare: 84, high: 78, moderate: 58, low: 30 }) * 0.5 + (100 - assetFit.liquidityAssetFitScore) * 0.26 + assetFit.luxuryAssetFitScore * 0.24);
  const corridorExposureConcentrationRiskScore = clampScore((marketRepeats ? 70 : 36) * 0.38 + scoreNumber(input.existingMarketExposurePercent, 44) * 0.24 + geographicFit.corridorStrengthScore * 0.22 + scoreFromText(input.corridorPrestige, 52, { trophy: 80, prime: 72, elite: 70, luxury: 66, moderate: 52 }) * 0.16);
  const overallConcentrationRiskScore = clampScore(geographyConcentrationRiskScore * 0.2 + luxuryConcentrationRiskScore * 0.16 + developmentConcentrationRiskScore * 0.16 + liquidityConcentrationRiskScore * 0.18 + assetUniquenessConcentrationRiskScore * 0.14 + corridorExposureConcentrationRiskScore * 0.16);

  return {
    geographyConcentrationRiskScore,
    luxuryConcentrationRiskScore,
    developmentConcentrationRiskScore,
    liquidityConcentrationRiskScore,
    assetUniquenessConcentrationRiskScore,
    corridorExposureConcentrationRiskScore,
    overallConcentrationRiskScore,
  };
}

export function evaluatePortfolioDiversification(input: InstitutionalPortfolioInput, concentration = evaluatePortfolioConcentration(input), assetFit = evaluateAssetTypePortfolioFit(input), geographicFit = evaluateGeographicPortfolioFit(input)): PortfolioDiversificationProfile {
  const targetLuxury = input.targetLuxuryExposurePercent ?? 35;
  const luxuryGap = Math.abs((input.existingLuxuryExposurePercent ?? targetLuxury) - targetLuxury);
  const targetDevelopment = input.targetDevelopmentExposurePercent ?? 25;
  const developmentGap = Math.abs((input.existingDevelopmentExposurePercent ?? targetDevelopment) - targetDevelopment);
  const incomeTarget = input.incomeWeightTarget ?? 50;
  const appreciationTarget = input.appreciationWeightTarget ?? 50;
  const incomeGap = hasNumber(input.currentIncomeWeight) ? Math.abs(input.currentIncomeWeight - incomeTarget) : 18;
  const appreciationGap = hasNumber(input.currentAppreciationWeight) ? Math.abs(input.currentAppreciationWeight - appreciationTarget) : 18;
  const geographicDiversificationScore = clampScore(100 - concentration.geographyConcentrationRiskScore * 0.72 + geographicFit.longTermRegionalAttractivenessScore * 0.22);
  const assetTypeDiversificationScore = clampScore(100 - scoreNumber(input.existingAssetTypeExposurePercent, 42) * 0.58 + assetFit.diversificationContributionScore * 0.36);
  const luxuryExposureBalanceScore = clampScore(100 - luxuryGap * 1.1 - (assetFit.luxuryAssetFitScore >= 72 && (input.existingLuxuryExposurePercent ?? 35) > targetLuxury ? 10 : 0));
  const developmentExposureBalanceScore = clampScore(100 - developmentGap * 1.12 - (assetFit.developmentAssetFitScore >= 72 && (input.existingDevelopmentExposurePercent ?? 25) > targetDevelopment ? 12 : 0));
  const incomeAppreciationBalanceScore = clampScore(100 - (incomeGap + appreciationGap) * 0.78 + Math.min(assetFit.incomeAssetFitScore, assetFit.appreciationAssetFitScore) * 0.16);
  const strategicOptionalityScore = clampScore(Math.max(assetFit.luxuryAssetFitScore, assetFit.developmentAssetFitScore, assetFit.incomeAssetFitScore, assetFit.appreciationAssetFitScore) * 0.36 + geographicFit.expansionPotentialScore * 0.22 + assetFit.diversificationContributionScore * 0.2 + scoreFromText(input.institutionalInterest, 50, { high: 86, strong: 84, institutional: 88, moderate: 60, low: 28 }) * 0.22);
  const concentrationOffsetPotentialScore = clampScore((100 - concentration.overallConcentrationRiskScore) * 0.5 + strategicOptionalityScore * 0.28 + geographicDiversificationScore * 0.22);

  return {
    geographicDiversificationScore,
    assetTypeDiversificationScore,
    luxuryExposureBalanceScore,
    developmentExposureBalanceScore,
    incomeAppreciationBalanceScore,
    strategicOptionalityScore,
    concentrationOffsetPotentialScore,
  };
}

export function evaluateInstitutionalHoldQuality(input: InstitutionalPortfolioInput, assetFit = evaluateAssetTypePortfolioFit(input), geographicFit = evaluateGeographicPortfolioFit(input)): InstitutionalHoldQuality {
  const longTermStabilityScore = clampScore(geographicFit.marketDurabilityScore * 0.3 + assetFit.liquidityAssetFitScore * 0.18 + assetFit.incomeAssetFitScore * 0.16 + assetFit.appreciationAssetFitScore * 0.16 + scoreFromText(input.marketDurability, 54, { durable: 88, stable: 78, strong: 84, moderate: 60, volatile: 34 }) * 0.2);
  const scarcityScore = clampScore(scoreNumber(input.scarcityScore, 55) * 0.4 + assetFit.luxuryAssetFitScore * 0.2 + geographicFit.luxuryCorridorFitScore * 0.18 + (getAcreage(input) >= 5 ? 82 : 48) * 0.12 + scoreFromText(input.uniquenessFactor, 52, { trophy: 90, rare: 86, unique: 82, high: 78, moderate: 58 }) * 0.1);
  const capitalPreservationQualityScore = clampScore(longTermStabilityScore * 0.28 + scarcityScore * 0.24 + geographicFit.longTermRegionalAttractivenessScore * 0.18 + assetFit.liquidityAssetFitScore * 0.14 + assetFit.luxuryAssetFitScore * 0.16);
  const institutionalAttractivenessScore = clampScore(scoreFromText(input.institutionalInterest, 50, { institutional: 88, high: 86, strong: 84, moderate: 60, low: 28 }) * 0.26 + extractScore(input.luxuryAcquisitionProfile, ["institutionalViabilityScore", "overallScore"], 55) * 0.18 + extractScore(input.uhnwBuyerProfile, ["overallBuyerFitScore", "institutionalBuyerScore"], 55) * 0.18 + capitalPreservationQualityScore * 0.2 + assetFit.diversificationContributionScore * 0.18);
  const downsideResilienceProxyScore = clampScore(longTermStabilityScore * 0.3 + capitalPreservationQualityScore * 0.28 + assetFit.liquidityAssetFitScore * 0.16 + (100 - Math.max(0, scoreFromText(input.titleComplexityRisk, 32, { high: 78, complex: 82, moderate: 58, low: 28 }) - 32)) * 0.12 + geographicFit.marketDurabilityScore * 0.14);
  const strategicHoldDurabilityScore = clampScore(capitalPreservationQualityScore * 0.28 + institutionalAttractivenessScore * 0.22 + downsideResilienceProxyScore * 0.2 + geographicFit.longTermRegionalAttractivenessScore * 0.18 + assetFit.appreciationAssetFitScore * 0.12);

  return {
    longTermStabilityScore,
    scarcityScore,
    capitalPreservationQualityScore,
    institutionalAttractivenessScore,
    downsideResilienceProxyScore,
    strategicHoldDurabilityScore,
  };
}

export function evaluatePortfolioStability(input: InstitutionalPortfolioInput, concentration = evaluatePortfolioConcentration(input), assetFit = evaluateAssetTypePortfolioFit(input), geographicFit = evaluateGeographicPortfolioFit(input)): PortfolioStabilityProfile {
  const liquidityRiskScore = concentration.liquidityConcentrationRiskScore;
  const redevelopmentVolatilityScore = clampScore(getDevelopmentScore(input) * 0.28 + (100 - scoreFromText(input.zoningFlexibility, 50, { flexible: 78, favorable: 76, moderate: 58, limited: 34 })) * 0.32 + scoreFromText(input.executionComplexity, 42, { high: 84, complex: 82, moderate: 60, low: 28 }) * 0.24 + concentration.developmentConcentrationRiskScore * 0.16);
  const volatilityProxyScore = clampScore(liquidityRiskScore * 0.24 + concentration.assetUniquenessConcentrationRiskScore * 0.2 + redevelopmentVolatilityScore * 0.2 + concentration.corridorExposureConcentrationRiskScore * 0.16 + (100 - geographicFit.marketDurabilityScore) * 0.2);
  const executionComplexityScore = clampScore(scoreFromText(input.executionComplexity, 42, { high: 84, complex: 82, moderate: 60, low: 28 }) * 0.34 + redevelopmentVolatilityScore * 0.24 + concentration.overallConcentrationRiskScore * 0.18 + (100 - assetFit.liquidityAssetFitScore) * 0.14 + scoreFromText(input.titleComplexityRisk, 32, { high: 82, complex: 82, moderate: 58, low: 28 }) * 0.1);
  const appreciationDurabilityScore = clampScore(getAppreciationScore(input) * 0.34 + geographicFit.longTermRegionalAttractivenessScore * 0.26 + scoreNumber(input.scarcityScore, 55) * 0.2 + assetFit.liquidityAssetFitScore * 0.1 + geographicFit.marketDurabilityScore * 0.1);
  const stabilityScore = clampScore(100 - volatilityProxyScore * 0.42 - liquidityRiskScore * 0.2 - executionComplexityScore * 0.16 + geographicFit.marketDurabilityScore * 0.2 + assetFit.incomeAssetFitScore * 0.18);
  const durabilityScore = clampScore(stabilityScore * 0.28 + appreciationDurabilityScore * 0.28 + geographicFit.marketDurabilityScore * 0.22 + assetFit.diversificationContributionScore * 0.12 + (100 - concentration.overallConcentrationRiskScore) * 0.1);

  return {
    volatilityProxyScore,
    liquidityRiskScore,
    stabilityScore,
    durabilityScore,
    appreciationDurabilityScore,
    redevelopmentVolatilityScore,
    executionComplexityScore,
  };
}

function evaluateRiskProfile(missingData: string[], concentration: PortfolioConcentrationAnalysis, stability: PortfolioStabilityProfile): PortfolioRiskProfile {
  const dataQualityRiskScore = clampScore(Math.min(100, missingData.length * 7 + 18));
  const overallRiskScore = clampScore(concentration.overallConcentrationRiskScore * 0.28 + stability.liquidityRiskScore * 0.18 + stability.executionComplexityScore * 0.18 + stability.volatilityProxyScore * 0.18 + dataQualityRiskScore * 0.18);

  return {
    overallRiskScore,
    concentrationRiskScore: concentration.overallConcentrationRiskScore,
    liquidityRiskScore: stability.liquidityRiskScore,
    executionRiskScore: stability.executionComplexityScore,
    volatilityRiskScore: stability.volatilityProxyScore,
    dataQualityRiskScore,
    humanReviewRecommended: true,
  };
}

function roleAnalysis(
  role: PortfolioRole,
  fitScore: number,
  riskScore: number,
  confidenceScore: number,
  reasons: string[],
  blockers: string[],
): PortfolioRoleAnalysis {
  return {
    role,
    fitScore: clampScore(fitScore),
    confidenceScore: round(clamp(confidenceScore, 0, 1)),
    riskScore: clampScore(riskScore),
    reasons: unique(reasons),
    blockers: unique(blockers),
    humanReviewRecommended: true,
  };
}

function roleConfidence(missingData: string[], required: string[]) {
  const missingRequired = required.filter((item) => missingData.includes(item)).length;

  return round(clamp(0.86 - missingData.length * 0.022 - missingRequired * 0.05, 0.16, 0.96));
}

function evaluatePortfolioRoles(
  input: InstitutionalPortfolioInput,
  diversification: PortfolioDiversificationProfile,
  concentration: PortfolioConcentrationAnalysis,
  geographicFit: GeographicPortfolioFit,
  assetFit: AssetTypePortfolioFit,
  holdQuality: InstitutionalHoldQuality,
  stability: PortfolioStabilityProfile,
  missingData: string[],
) {
  const incomeScore = assetFit.incomeAssetFitScore;
  const appreciationScore = assetFit.appreciationAssetFitScore;
  const luxuryScore = assetFit.luxuryAssetFitScore;
  const developmentScore = assetFit.developmentAssetFitScore;
  const roleText = `${input.strategy ?? ""} ${(input.exitStrategies ?? []).join(" ")} ${input.portfolioGoal ?? ""}`;
  const strategicRisk = concentration.overallConcentrationRiskScore * 0.44 + stability.executionComplexityScore * 0.28 + stability.volatilityProxyScore * 0.28;

  return [
    roleAnalysis(
      "cash_flow_anchor",
      incomeScore * 0.38 + stability.stabilityScore * 0.22 + assetFit.liquidityAssetFitScore * 0.16 + diversification.incomeAppreciationBalanceScore * 0.14 + (includesAny(roleText, ["cash_flow", "income", "rental"]) ? 8 : 0),
      stability.liquidityRiskScore * 0.32 + (100 - incomeScore) * 0.34 + concentration.assetUniquenessConcentrationRiskScore * 0.18 + stability.volatilityProxyScore * 0.16,
      roleConfidence(missingData, ["income/appreciation portfolio target", "market liquidity"]),
      [
        ...(incomeScore >= 65 ? ["Income indicators support cash-flow anchor review."] : []),
        ...(stability.stabilityScore >= 65 ? ["Stability profile supports an anchor-style hold role."] : []),
      ],
      ["No income, rent, occupancy, financing, or return guarantee is provided."],
    ),
    roleAnalysis(
      "long_term_appreciation",
      appreciationScore * 0.38 + geographicFit.longTermRegionalAttractivenessScore * 0.24 + holdQuality.scarcityScore * 0.18 + stability.appreciationDurabilityScore * 0.14 + (includesAny(roleText, ["appreciation", "hold"]) ? 6 : 0),
      stability.volatilityProxyScore * 0.28 + concentration.corridorExposureConcentrationRiskScore * 0.22 + (100 - stability.appreciationDurabilityScore) * 0.3 + concentration.geographyConcentrationRiskScore * 0.2,
      roleConfidence(missingData, ["appreciation trend", "corridor growth strength"]),
      [
        ...(appreciationScore >= 65 ? ["Appreciation-quality indicators support long-term appreciation review."] : []),
        ...(holdQuality.scarcityScore >= 70 ? ["Scarcity improves long-term portfolio role quality."] : []),
      ],
      ["No appreciation forecast or return guarantee is provided."],
    ),
    roleAnalysis(
      "luxury_hold",
      luxuryScore * 0.34 + holdQuality.capitalPreservationQualityScore * 0.24 + holdQuality.institutionalAttractivenessScore * 0.16 + geographicFit.luxuryCorridorFitScore * 0.14 + (includesAny(roleText, ["luxury", "estate", "trophy"]) ? 8 : 0),
      concentration.luxuryConcentrationRiskScore * 0.32 + concentration.liquidityConcentrationRiskScore * 0.24 + stability.volatilityProxyScore * 0.18 + (100 - luxuryScore) * 0.26,
      roleConfidence(missingData, ["luxury or buyer demand", "existing luxury exposure percent"]),
      [
        ...(luxuryScore >= 70 ? ["Luxury asset quality supports luxury hold review."] : []),
        ...(holdQuality.capitalPreservationQualityScore >= 70 ? ["Capital-preservation proxy supports institutional luxury hold review."] : []),
      ],
      ["Luxury hold role can increase liquidity and concentration risk; human review required."],
    ),
    roleAnalysis(
      "development_upside",
      developmentScore * 0.34 + geographicFit.developmentCorridorFitScore * 0.22 + diversification.strategicOptionalityScore * 0.16 + scoreFromText(input.builderInterest, 50, { high: 88, strong: 84, moderate: 60, low: 28 }) * 0.12 + (includesAny(roleText, ["development", "builder"]) ? 8 : 0),
      concentration.developmentConcentrationRiskScore * 0.28 + stability.redevelopmentVolatilityScore * 0.26 + stability.executionComplexityScore * 0.24 + (100 - developmentScore) * 0.22,
      roleConfidence(missingData, ["development or redevelopment potential", "existing development exposure percent"]),
      [
        ...(developmentScore >= 65 ? ["Development indicators support upside-oriented portfolio role review."] : []),
        ...(geographicFit.developmentCorridorFitScore >= 65 ? ["Corridor signals improve development upside fit."] : []),
      ],
      ["Development upside is proxy-only and requires legal, title, zoning, engineering, capital, and human review."],
    ),
    roleAnalysis(
      "capital_preservation",
      holdQuality.capitalPreservationQualityScore * 0.34 + holdQuality.downsideResilienceProxyScore * 0.24 + stability.durabilityScore * 0.18 + geographicFit.marketDurabilityScore * 0.14 + (includesAny(roleText, ["preservation", "defensive"]) ? 8 : 0),
      concentration.overallConcentrationRiskScore * 0.24 + stability.liquidityRiskScore * 0.22 + stability.volatilityProxyScore * 0.22 + (100 - holdQuality.downsideResilienceProxyScore) * 0.32,
      roleConfidence(missingData, ["market liquidity", "scarcity score"]),
      [
        ...(holdQuality.capitalPreservationQualityScore >= 68 ? ["Capital-preservation quality is supported by stability, scarcity, and corridor durability proxies."] : []),
        ...(holdQuality.downsideResilienceProxyScore >= 68 ? ["Downside resilience proxy improves defensive portfolio role fit."] : []),
      ],
      ["Capital preservation is a strategic proxy only and does not guarantee principal protection."],
    ),
    roleAnalysis(
      "strategic_land_bank",
      Math.max(developmentScore, luxuryScore) * 0.26 + holdQuality.scarcityScore * 0.24 + geographicFit.expansionPotentialScore * 0.18 + geographicFit.longTermRegionalAttractivenessScore * 0.16 + (getAcreage(input) >= 5 ? 12 : 0),
      concentration.liquidityConcentrationRiskScore * 0.24 + concentration.developmentConcentrationRiskScore * 0.22 + stability.executionComplexityScore * 0.2 + (100 - holdQuality.scarcityScore) * 0.2 + stability.volatilityProxyScore * 0.14,
      roleConfidence(missingData, ["asset type or property type", "corridor growth strength"]),
      [
        ...(getAcreage(input) >= 2 ? ["Acreage improves strategic land-bank review."] : []),
        ...(holdQuality.scarcityScore >= 70 ? ["Scarcity improves land-bank durability."] : []),
      ],
      ["Land-bank role does not imply zoning, entitlement, utility, or appreciation certainty."],
    ),
    roleAnalysis(
      "income_growth",
      incomeScore * 0.28 + (hasNumber(input.rentGrowthTrend) ? clampScore(input.rentGrowthTrend * 10 + 34) : 52) * 0.26 + stability.stabilityScore * 0.16 + diversification.incomeAppreciationBalanceScore * 0.14 + (includesAny(roleText, ["income_growth", "rent_growth"]) ? 8 : 0),
      stability.liquidityRiskScore * 0.22 + stability.volatilityProxyScore * 0.22 + (100 - incomeScore) * 0.28 + concentration.assetUniquenessConcentrationRiskScore * 0.28,
      roleConfidence(missingData, ["income/appreciation portfolio target"]),
      [
        ...(incomeScore >= 62 ? ["Income indicators support income-growth role review."] : []),
        ...(hasNumber(input.rentGrowthTrend) && input.rentGrowthTrend >= 4 ? ["Rent-growth input improves income-growth fit."] : []),
      ],
      ["No rent growth, NOI, occupancy, or cash-flow guarantee is provided."],
    ),
    roleAnalysis(
      "redevelopment_candidate",
      getDevelopmentScore(input) * 0.3 + scoreFromText(input.redevelopmentPotential, 50, { high: 86, strong: 84, teardown: 88, moderate: 60, low: 28 }) * 0.22 + geographicFit.developmentCorridorFitScore * 0.18 + diversification.strategicOptionalityScore * 0.14 + (includesAny(roleText, ["redevelopment", "teardown"]) ? 8 : 0),
      stability.redevelopmentVolatilityScore * 0.32 + stability.executionComplexityScore * 0.28 + concentration.developmentConcentrationRiskScore * 0.2 + (100 - developmentScore) * 0.2,
      roleConfidence(missingData, ["development or redevelopment potential"]),
      [
        ...(scoreFromText(input.redevelopmentPotential, 50, { high: 86, strong: 84, teardown: 88, moderate: 60, low: 28 }) >= 65 ? ["Redevelopment indicators support candidate review."] : []),
        ...(geographicFit.developmentCorridorFitScore >= 65 ? ["Development corridor fit strengthens redevelopment role."] : []),
      ],
      ["Redevelopment role is strategic only and requires full professional diligence."],
    ),
    roleAnalysis(
      "opportunistic_acquisition",
      extractScore(input.pricingProfile, ["pricingConfidenceScore", "confidenceScore"], 56) * 0.16 + extractScore(input.luxuryDealProfile, ["overallOpportunityScore", "hiddenUpsideScore"], 54) * 0.2 + extractScore(input.acquisitionZoneProfile, ["zoneScore", "acquisitionScore"], 52) * 0.16 + diversification.strategicOptionalityScore * 0.18 + Math.max(appreciationScore, developmentScore, luxuryScore) * 0.2 + (includesAny(roleText, ["opportunistic", "discount", "distress"]) ? 8 : 0),
      strategicRisk * 0.38 + concentration.liquidityConcentrationRiskScore * 0.18 + stability.volatilityProxyScore * 0.2 + (100 - diversification.strategicOptionalityScore) * 0.24,
      roleConfidence(missingData, ["estimated value or ARV", "market liquidity"]),
      [
        ...(diversification.strategicOptionalityScore >= 65 ? ["Strategic optionality supports opportunistic acquisition review."] : []),
        ...(extractScore(input.luxuryDealProfile, ["overallOpportunityScore", "hiddenUpsideScore"], 0) >= 65 ? ["Existing luxury deal intelligence supports opportunity review."] : []),
      ],
      ["Opportunistic role requires human diligence and does not guarantee acquisition upside."],
    ),
    roleAnalysis(
      "portfolio_diversifier",
      diversification.concentrationOffsetPotentialScore * 0.34 + diversification.geographicDiversificationScore * 0.2 + diversification.assetTypeDiversificationScore * 0.18 + diversification.incomeAppreciationBalanceScore * 0.14 + assetFit.diversificationContributionScore * 0.14,
      concentration.overallConcentrationRiskScore * 0.34 + stability.volatilityProxyScore * 0.18 + stability.liquidityRiskScore * 0.18 + (100 - diversification.concentrationOffsetPotentialScore) * 0.3,
      roleConfidence(missingData, ["current portfolio markets or states", "current portfolio asset types"]),
      [
        ...(diversification.concentrationOffsetPotentialScore >= 68 ? ["Asset can help offset portfolio concentration based on provided exposure inputs."] : []),
        ...(diversification.assetTypeDiversificationScore >= 68 ? ["Asset type contributes diversification value."] : []),
      ],
      ["Diversification value is deterministic strategy analysis only and not investment advice."],
    ),
  ];
}

function riskAdjustedRoleScore(role: PortfolioRoleAnalysis) {
  return clampScore(role.fitScore - role.riskScore * 0.22 + role.confidenceScore * 7);
}

function calculateConfidence(input: InstitutionalPortfolioInput, missingData: string[], riskProfile: PortfolioRiskProfile) {
  const suppliedSignals = [
    input.city || input.market || input.county,
    input.state,
    input.assetType || input.propertyType,
    hasNumber(input.estimatedValue) || hasNumber(input.arv),
    input.marketLiquidity !== undefined,
    input.corridorPrestige !== undefined,
    input.corridorGrowthStrength !== undefined,
    hasNumber(input.appreciationTrend),
    input.luxuryBuyerDemand !== undefined || hasNumber(input.buyerDemandScore),
    input.scarcityScore !== undefined,
    input.institutionalInterest !== undefined,
    input.currentPortfolioMarkets !== undefined || input.currentPortfolioStates !== undefined,
    input.currentPortfolioAssetTypes !== undefined,
    input.existingLuxuryExposurePercent !== undefined,
    input.existingDevelopmentExposurePercent !== undefined,
    input.incomeWeightTarget !== undefined || input.appreciationWeightTarget !== undefined,
    input.exitStrategies !== undefined && input.exitStrategies.length > 0,
  ].filter(Boolean).length;
  const completeness = suppliedSignals / 17;
  const riskPenalty = Math.max(0, riskProfile.overallRiskScore - 72) * 0.0025 + Math.max(0, riskProfile.dataQualityRiskScore - 58) * 0.002;

  return round(clamp(0.24 + completeness * 0.68 - missingData.length * 0.022 - riskPenalty, 0.12, 0.97));
}

function classifyRating(score: number, confidenceScore: number, riskProfile: PortfolioRiskProfile) {
  if (riskProfile.overallRiskScore >= 84 || confidenceScore < 0.22) return "avoid";
  if (score >= 84 && confidenceScore >= 0.74 && riskProfile.overallRiskScore <= 58) return "elite";
  if (score >= 70 && confidenceScore >= 0.62) return "strong";
  if (score >= 54) return "watchlist";
  if (score >= 38) return "weak";

  return "avoid";
}

function buildStrengths(
  diversification: PortfolioDiversificationProfile,
  geographicFit: GeographicPortfolioFit,
  assetFit: AssetTypePortfolioFit,
  holdQuality: InstitutionalHoldQuality,
  stability: PortfolioStabilityProfile,
  rankedRoles: PortfolioRoleAnalysis[],
) {
  return unique([
    ...(diversification.concentrationOffsetPotentialScore >= 70 ? ["Strong concentration offset potential"] : []),
    ...(diversification.geographicDiversificationScore >= 70 ? ["Geographic diversification value"] : []),
    ...(assetFit.diversificationContributionScore >= 70 ? ["Asset-type diversification contribution"] : []),
    ...(geographicFit.longTermRegionalAttractivenessScore >= 70 ? ["Strong long-term geographic fit"] : []),
    ...(holdQuality.capitalPreservationQualityScore >= 70 ? ["Capital-preservation quality proxy is strong"] : []),
    ...(holdQuality.institutionalAttractivenessScore >= 70 ? ["Institutional hold attractiveness"] : []),
    ...(stability.durabilityScore >= 70 ? ["Portfolio durability profile is strong"] : []),
    ...(rankedRoles[0]?.fitScore >= 72 ? `Primary role fit: ${rankedRoles[0].role.replaceAll("_", " ")}` : []),
  ]);
}

function buildRisks(concentration: PortfolioConcentrationAnalysis, stability: PortfolioStabilityProfile, riskProfile: PortfolioRiskProfile, missingData: string[]) {
  return unique([
    ...(concentration.geographyConcentrationRiskScore >= 68 ? ["Geographic concentration risk is elevated"] : []),
    ...(concentration.luxuryConcentrationRiskScore >= 68 ? ["Luxury exposure concentration risk is elevated"] : []),
    ...(concentration.developmentConcentrationRiskScore >= 68 ? ["Development exposure concentration risk is elevated"] : []),
    ...(concentration.liquidityConcentrationRiskScore >= 68 ? ["Liquidity concentration risk is elevated"] : []),
    ...(stability.redevelopmentVolatilityScore >= 68 ? ["Redevelopment volatility requires human review"] : []),
    ...(stability.executionComplexityScore >= 68 ? ["Execution complexity is elevated"] : []),
    ...(riskProfile.dataQualityRiskScore >= 62 ? ["Data quality risk is elevated"] : []),
    ...(missingData.length >= 8 ? ["Material institutional portfolio inputs are missing"] : []),
  ]);
}

function buildBlockers(rankedRoles: PortfolioRoleAnalysis[], missingData: string[], riskProfile: PortfolioRiskProfile) {
  return unique([
    "Read-only portfolio intelligence only; no investment, securities, fiduciary, legal, lending, tax, execution, or return recommendation is provided.",
    "Human review is required before portfolio allocation, financing, acquisition, disposition, or investment decisions.",
    ...(riskProfile.overallRiskScore >= 84 ? ["Overall institutional portfolio risk is too high for confident prioritization"] : []),
    ...(rankedRoles[0]?.fitScore < 42 ? ["No portfolio role has enough fit for confident institutional prioritization"] : []),
    ...(missingData.length >= 11 ? ["Too many missing inputs for high-confidence institutional portfolio analysis"] : []),
  ]);
}

function buildExplanations(
  diversification: PortfolioDiversificationProfile,
  concentration: PortfolioConcentrationAnalysis,
  geographicFit: GeographicPortfolioFit,
  assetFit: AssetTypePortfolioFit,
  holdQuality: InstitutionalHoldQuality,
  stability: PortfolioStabilityProfile,
  rankedRoles: PortfolioRoleAnalysis[],
  missingData: string[],
) {
  return [
    ...(assetFit.luxuryAssetFitScore >= 70
      ? [{ category: "luxury portfolio fit", message: "Luxury positioning improves institutional luxury hold potential but can raise liquidity and concentration risk.", scoreImpact: "positive" as const, relatedRole: "luxury_hold" as const }]
      : []),
    ...(assetFit.developmentAssetFitScore >= 70
      ? [{ category: "development portfolio fit", message: "Development potential increases upside optionality while adding execution and concentration risk.", scoreImpact: "positive" as const, relatedRole: "development_upside" as const }]
      : []),
    ...(diversification.concentrationOffsetPotentialScore >= 68
      ? [{ category: "diversification", message: "The opportunity may offset concentration based on provided geography, asset type, and exposure inputs.", scoreImpact: "positive" as const, relatedRole: "portfolio_diversifier" as const }]
      : [{ category: "diversification", message: "Diversification value is moderate or unverified because portfolio exposure inputs are incomplete or concentrated.", scoreImpact: "neutral" as const, relatedRole: "portfolio_diversifier" as const }]),
    ...(concentration.overallConcentrationRiskScore >= 68
      ? [{ category: "concentration", message: "High concentration risk reduces institutional portfolio fit and requires human review.", scoreImpact: "negative" as const }]
      : []),
    ...(geographicFit.longTermRegionalAttractivenessScore >= 70
      ? [{ category: "geographic fit", message: "Strong corridor and market durability indicators improve institutional hold attractiveness.", scoreImpact: "positive" as const }]
      : []),
    ...(holdQuality.capitalPreservationQualityScore >= 70
      ? [{ category: "hold quality", message: "Scarcity, durability, and market-depth proxies support capital-preservation review without guaranteeing outcomes.", scoreImpact: "positive" as const, relatedRole: "capital_preservation" as const }]
      : []),
    ...(stability.redevelopmentVolatilityScore >= 68
      ? [{ category: "stability", message: "Redevelopment complexity increases volatility and execution risk within the portfolio.", scoreImpact: "negative" as const }]
      : []),
    ...(rankedRoles[0]
      ? [{ category: "role ranking", message: `${rankedRoles[0].role.replaceAll("_", " ")} is the strongest risk-adjusted strategic portfolio role.`, scoreImpact: "positive" as const, relatedRole: rankedRoles[0].role }]
      : []),
    ...(missingData.length > 0
      ? [{ category: "data quality", message: `Missing ${missingData.length} inputs reduces institutional confidence and requires human verification.`, scoreImpact: "negative" as const }]
      : [{ category: "data quality", message: "Core portfolio and asset inputs are present for higher-confidence strategic analysis.", scoreImpact: "positive" as const }]),
  ];
}

function buildExplanation(primaryRole: PortfolioRole, score: number, confidenceScore: number, missingData: string[]) {
  const confidence = confidenceScore >= 0.72 ? "strong" : confidenceScore >= 0.52 ? "moderate" : "limited";
  const missing = missingData.length > 0 ? ` Missing inputs include ${missingData.slice(0, 4).join(", ")}${missingData.length > 4 ? ", and more" : ""}.` : "";

  return `Institutional portfolio intelligence identifies ${primaryRole.replaceAll("_", " ")} as the strongest strategic role with a ${score}/100 portfolio-fit score and ${confidence} confidence.${missing} This is read-only strategic analysis only and does not provide investment advice, securities advice, fiduciary advice, legal/tax/lending advice, execution authorization, or guaranteed returns.`;
}

export function analyzeInstitutionalPortfolioIntelligence(input: InstitutionalPortfolioInput = {}): InstitutionalPortfolioAnalysis {
  const missingData = getMissingData(input);
  const geographicPortfolioFit = evaluateGeographicPortfolioFit(input);
  const assetTypePortfolioFit = evaluateAssetTypePortfolioFit(input);
  const concentrationAnalysis = evaluatePortfolioConcentration(input, assetTypePortfolioFit, geographicPortfolioFit);
  const diversificationProfile = evaluatePortfolioDiversification(input, concentrationAnalysis, assetTypePortfolioFit, geographicPortfolioFit);
  const institutionalHoldQuality = evaluateInstitutionalHoldQuality(input, assetTypePortfolioFit, geographicPortfolioFit);
  const stabilityProfile = evaluatePortfolioStability(input, concentrationAnalysis, assetTypePortfolioFit, geographicPortfolioFit);
  const riskProfile = evaluateRiskProfile(missingData, concentrationAnalysis, stabilityProfile);
  const rankedPortfolioRoles = evaluatePortfolioRoles(input, diversificationProfile, concentrationAnalysis, geographicPortfolioFit, assetTypePortfolioFit, institutionalHoldQuality, stabilityProfile, missingData)
    .sort((a, b) => riskAdjustedRoleScore(b) - riskAdjustedRoleScore(a));
  const primaryPortfolioRole = rankedPortfolioRoles[0]?.role ?? "portfolio_diversifier";
  const strategicRoleFitScore = rankedPortfolioRoles[0] ? riskAdjustedRoleScore(rankedPortfolioRoles[0]) : 0;
  const diversificationQualityScore = clampScore(
    diversificationProfile.geographicDiversificationScore * 0.18 +
      diversificationProfile.assetTypeDiversificationScore * 0.18 +
      diversificationProfile.luxuryExposureBalanceScore * 0.14 +
      diversificationProfile.developmentExposureBalanceScore * 0.14 +
      diversificationProfile.incomeAppreciationBalanceScore * 0.14 +
      diversificationProfile.strategicOptionalityScore * 0.12 +
      diversificationProfile.concentrationOffsetPotentialScore * 0.1,
  );
  const geographicFitScore = clampScore(
    geographicPortfolioFit.corridorStrengthScore * 0.16 +
      geographicPortfolioFit.marketDurabilityScore * 0.2 +
      geographicPortfolioFit.strategicLocationQualityScore * 0.18 +
      geographicPortfolioFit.expansionPotentialScore * 0.12 +
      geographicPortfolioFit.luxuryCorridorFitScore * 0.12 +
      geographicPortfolioFit.developmentCorridorFitScore * 0.1 +
      geographicPortfolioFit.longTermRegionalAttractivenessScore * 0.12,
  );
  const assetTypeFitScore = clampScore(
    assetTypePortfolioFit.assetTypeBalanceScore * 0.18 +
      assetTypePortfolioFit.incomeAssetFitScore * 0.14 +
      assetTypePortfolioFit.appreciationAssetFitScore * 0.14 +
      assetTypePortfolioFit.luxuryAssetFitScore * 0.14 +
      assetTypePortfolioFit.developmentAssetFitScore * 0.12 +
      assetTypePortfolioFit.liquidityAssetFitScore * 0.14 +
      assetTypePortfolioFit.diversificationContributionScore * 0.14,
  );
  const institutionalHoldQualityScore = clampScore(
    institutionalHoldQuality.longTermStabilityScore * 0.18 +
      institutionalHoldQuality.scarcityScore * 0.16 +
      institutionalHoldQuality.capitalPreservationQualityScore * 0.22 +
      institutionalHoldQuality.institutionalAttractivenessScore * 0.18 +
      institutionalHoldQuality.downsideResilienceProxyScore * 0.14 +
      institutionalHoldQuality.strategicHoldDurabilityScore * 0.12,
  );
  const portfolioStabilityScore = clampScore(
    stabilityProfile.stabilityScore * 0.28 +
      stabilityProfile.durabilityScore * 0.24 +
      stabilityProfile.appreciationDurabilityScore * 0.16 +
      (100 - stabilityProfile.volatilityProxyScore) * 0.12 +
      (100 - stabilityProfile.liquidityRiskScore) * 0.1 +
      (100 - stabilityProfile.executionComplexityScore) * 0.1,
  );
  const concentrationRiskAdjustedScore = clampScore(100 - concentrationAnalysis.overallConcentrationRiskScore);
  const riskAdjustedPortfolioFitScore = clampScore(
    strategicRoleFitScore * 0.26 +
      diversificationQualityScore * 0.18 +
      geographicFitScore * 0.14 +
      assetTypeFitScore * 0.12 +
      institutionalHoldQualityScore * 0.16 +
      portfolioStabilityScore * 0.14 -
      riskProfile.overallRiskScore * 0.12,
  );
  const confidenceScore = calculateConfidence(input, missingData, riskProfile);
  const overallPortfolioFitScore = clampScore(riskAdjustedPortfolioFitScore - (1 - confidenceScore) * 8);
  const institutionalPortfolioRating = classifyRating(overallPortfolioFitScore, confidenceScore, riskProfile);
  const scores: InstitutionalPortfolioScore = {
    overallPortfolioFitScore,
    riskAdjustedPortfolioFitScore,
    diversificationQualityScore,
    concentrationRiskAdjustedScore,
    geographicFitScore,
    assetTypeFitScore,
    institutionalHoldQualityScore,
    portfolioStabilityScore,
    strategicRoleFitScore,
  };
  const strengths = buildStrengths(diversificationProfile, geographicPortfolioFit, assetTypePortfolioFit, institutionalHoldQuality, stabilityProfile, rankedPortfolioRoles);
  const risks = buildRisks(concentrationAnalysis, stabilityProfile, riskProfile, missingData);
  const blockers = buildBlockers(rankedPortfolioRoles, missingData, riskProfile);
  const explanations = buildExplanations(diversificationProfile, concentrationAnalysis, geographicPortfolioFit, assetTypePortfolioFit, institutionalHoldQuality, stabilityProfile, rankedPortfolioRoles, missingData);
  const explanation = buildExplanation(primaryPortfolioRole, overallPortfolioFitScore, confidenceScore, missingData);

  return {
    overallPortfolioFitScore,
    institutionalPortfolioRating,
    primaryPortfolioRole,
    rankedPortfolioRoles,
    diversificationProfile,
    concentrationAnalysis,
    geographicPortfolioFit,
    assetTypePortfolioFit,
    institutionalHoldQuality,
    stabilityProfile,
    riskProfile,
    scores,
    strengths,
    risks,
    blockers,
    missingData,
    explanations,
    explanation,
    confidenceScore,
    safety: {
      readOnly: true,
      outreachAuthorized: false,
      executionAuthorized: false,
      investmentAdvice: false,
      securitiesAdvice: false,
      legalAdvice: false,
      lendingAdvice: false,
      taxAdvice: false,
      guaranteedReturns: false,
      humanReviewRecommended: true,
    },
    complianceNotice: COMPLIANCE_NOTICE,
    readOnly: true,
  };
}
