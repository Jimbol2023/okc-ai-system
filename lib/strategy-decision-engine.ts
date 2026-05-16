import {
  classifyAsset,
  type AssetClassificationInput,
  type AssetClassificationResult,
} from "@/lib/asset-classification";

export type StrategyDecision =
  | "wholesale"
  | "land_flip"
  | "buy_and_hold_rental"
  | "brrrr"
  | "creative_finance"
  | "subject_to"
  | "seller_finance"
  | "luxury_acquisition"
  | "development_or_construction"
  | "portfolio_hold"
  | "pass"
  | "needs_more_data"
  | "manual_review";

export type ScoredStrategy = Exclude<StrategyDecision, "portfolio_hold" | "pass" | "needs_more_data" | "manual_review">;
export type StrategyReadiness = "ready" | "needs_more_data" | "manual_review" | "not_recommended";
export type RiskSeverity = "low" | "medium" | "high";
export type PortfolioFit = "strong" | "moderate" | "weak";

export type StrategyRiskFlag = {
  type: string;
  severity: RiskSeverity;
  impactScore: number;
};

export type RejectedStrategy = {
  strategy: StrategyDecision;
  reason: string;
};

export type StrategyScoreMatrix = Record<ScoredStrategy, number>;
export type StrategyScoreBreakdown = Record<ScoredStrategy, {
  equityScore: number;
  arvScore: number;
  repairImpact: number;
  demandScore: number;
  readinessScore: number;
}>;

export type StrategyDecisionInput = AssetClassificationInput & {
  assetClassification?: AssetClassificationResult | null;
  sellerMotivation?: string | null;
  mortgageBalance?: number | null;
  monthlyRent?: number | null;
  flexibleTerms?: boolean | null;
  knownBuyerDemand?: boolean | null;
};

export type StrategyDecisionResult = {
  recommendedStrategy: StrategyDecision;
  secondaryStrategies: StrategyDecision[];
  strategyConfidence: number;
  strategyReadiness: StrategyReadiness;
  reason: string;
  requiredMissingData: string[];
  riskFlags: StrategyRiskFlag[];
  opportunityFlags: string[];
  assetTypeUsed: string;
  luxurySignal?: boolean;
  developmentSignal?: boolean;
  creativeFinanceSignal?: boolean;
  passReason?: string;
  strategyScores: StrategyScoreMatrix;
  strategyScoreBreakdown: StrategyScoreBreakdown;
  rejectedStrategies: RejectedStrategy[];
  portfolioFit: PortfolioFit;
};

const SCORED_STRATEGIES: ScoredStrategy[] = [
  "wholesale",
  "brrrr",
  "buy_and_hold_rental",
  "creative_finance",
  "subject_to",
  "seller_finance",
  "land_flip",
  "development_or_construction",
  "luxury_acquisition",
];

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getAllInRatio(input: StrategyDecisionInput) {
  if (!hasValue(input.arv) || !hasValue(input.askingPrice) || !hasValue(input.estimatedRepairs) || Number(input.arv) <= 0) {
    return null;
  }

  return (Number(input.askingPrice) + Number(input.estimatedRepairs)) / Number(input.arv);
}

function getPriceToArvRatio(input: StrategyDecisionInput) {
  if (!hasValue(input.arv) || !hasValue(input.askingPrice) || Number(input.arv) <= 0) {
    return null;
  }

  return Number(input.askingPrice) / Number(input.arv);
}

function getEquitySpread(input: StrategyDecisionInput) {
  if (!hasValue(input.arv) || !hasValue(input.askingPrice)) {
    return null;
  }

  return Number(input.arv) - Number(input.askingPrice);
}

function getMissingData(input: StrategyDecisionInput, classification: AssetClassificationResult) {
  const missing = new Set(classification.assetStrategyReadiness.missingInputs);

  if (!hasValue(input.sellerMotivation)) {
    missing.add("seller_motivation");
  }

  if (!hasValue(input.mortgageBalance)) {
    missing.add("mortgage_balance");
  }

  return [...missing];
}

function getRepairScore(input: StrategyDecisionInput) {
  const condition = normalizeText(input.condition);
  const repairRatio =
    hasValue(input.estimatedRepairs) && hasValue(input.arv) && Number(input.arv) > 0
      ? Number(input.estimatedRepairs) / Number(input.arv)
      : null;

  if (hasAny(condition, ["light", "cosmetic", "minor"]) || (repairRatio !== null && repairRatio <= 0.08)) {
    return { light: 20, moderate: 12, heavy: 0 };
  }

  if (hasAny(condition, ["major", "heavy", "foundation", "fire", "mold", "gut"]) || (repairRatio !== null && repairRatio >= 0.25)) {
    return { light: 0, moderate: 8, heavy: 20 };
  }

  return { light: 8, moderate: 14, heavy: 6 };
}

function getLuxurySignal(input: StrategyDecisionInput, classification: AssetClassificationResult) {
  const text = `${normalizeText(input.propertyType)} ${normalizeText(input.notes)}`;

  return (
    hasAny(text, ["luxury", "estate", "high end", "high-end", "custom home"]) ||
    (classification.assetClass === "single_family" && Number(input.arv ?? 0) >= 750000)
  );
}

function getDevelopmentSignal(input: StrategyDecisionInput, classification: AssetClassificationResult) {
  const text = `${normalizeText(input.propertyType)} ${normalizeText(input.notes)}`;

  return classification.assetClass === "land" || hasAny(text, ["development", "buildable", "construction", "infill", "assemblage"]);
}

function getCreativeFinanceSignal(input: StrategyDecisionInput) {
  const motivation = normalizeText(input.sellerMotivation);
  const notes = normalizeText(input.notes);
  const combinedText = `${motivation} ${notes}`;
  const hasFlexibleLanguage = hasAny(combinedText, ["terms", "seller finance", "subject to", "subto", "take over", "low equity", "payment"]);
  const lowEquity =
    hasValue(input.mortgageBalance) &&
    hasValue(input.arv) &&
    Number(input.mortgageBalance) / Math.max(Number(input.arv), 1) >= 0.75;

  return Boolean(input.flexibleTerms || hasFlexibleLanguage || lowEquity);
}

function getAssetTypeScore(classification: AssetClassificationResult, strategy: ScoredStrategy) {
  const assetClass = classification.assetClass;
  const rentalAssets = ["single_family", "duplex", "triplex", "fourplex", "small_multifamily"];
  const residentialAssets = ["single_family", "duplex", "triplex", "fourplex", "townhome", "condo", "mobile_home"];

  if (strategy === "land_flip") {
    return assetClass === "land" ? 25 : 0;
  }

  if (strategy === "development_or_construction") {
    return assetClass === "land" || assetClass === "mixed_use" ? 20 : 0;
  }

  if (strategy === "luxury_acquisition") {
    return assetClass === "single_family" ? 12 : 0;
  }

  if (strategy === "buy_and_hold_rental" || strategy === "brrrr") {
    return rentalAssets.includes(assetClass) ? 18 : 0;
  }

  if (strategy === "wholesale") {
    return assetClass === "land" ? 6 : residentialAssets.includes(assetClass) ? 16 : 8;
  }

  return residentialAssets.includes(assetClass) ? 12 : 5;
}

function buildStrategyScores({
  input,
  classification,
  luxurySignal,
  developmentSignal,
  creativeFinanceSignal,
}: {
  input: StrategyDecisionInput;
  classification: AssetClassificationResult;
  luxurySignal: boolean;
  developmentSignal: boolean;
  creativeFinanceSignal: boolean;
}): StrategyScoreMatrix {
  const readinessScore = classification.assetStrategyReadiness.score;
  const allInRatio = getAllInRatio(input);
  const priceToArvRatio = getPriceToArvRatio(input);
  const equitySpread = getEquitySpread(input);
  const repairScore = getRepairScore(input);
  const rentSignal = hasValue(input.monthlyRent) || hasAny(normalizeText(input.notes), ["rent", "rental", "tenant", "cashflow", "cash flow"]);
  const demandSignalScore = input.knownBuyerDemand ? 15 : classification.opportunityFlags.includes("common_wholesale_asset") ? 8 : 0;
  const discountScore = allInRatio === null ? 0 : allInRatio <= 0.7 ? 25 : allInRatio <= 0.78 ? 20 : allInRatio <= 0.85 ? 10 : 0;
  const priceScore = priceToArvRatio === null ? 0 : priceToArvRatio <= 0.65 ? 18 : priceToArvRatio <= 0.78 ? 12 : priceToArvRatio <= 0.9 ? 5 : 0;
  const lowEquityScore =
    hasValue(input.mortgageBalance) && hasValue(input.arv) && Number(input.mortgageBalance) / Math.max(Number(input.arv), 1) >= 0.75 ? 18 : 0;
  const highEquityScore = equitySpread !== null && equitySpread >= 150000 ? 16 : equitySpread !== null && equitySpread >= 50000 ? 10 : 0;
  const readinessComponent = readinessScore * 0.15;

  return {
    wholesale: clampScore(readinessComponent + discountScore + priceScore + repairScore.heavy * 0.5 + getAssetTypeScore(classification, "wholesale") + demandSignalScore),
    brrrr: clampScore(readinessComponent + discountScore * 0.8 + repairScore.moderate + (rentSignal ? 18 : 0) + getAssetTypeScore(classification, "brrrr")),
    buy_and_hold_rental: clampScore(readinessComponent + (rentSignal ? 25 : 0) + repairScore.light * 0.6 + getAssetTypeScore(classification, "buy_and_hold_rental") + (classification.riskLevel === "low" ? 10 : 0)),
    creative_finance: clampScore(readinessComponent + (creativeFinanceSignal ? 30 : 0) + lowEquityScore + getAssetTypeScore(classification, "creative_finance")),
    subject_to: clampScore(readinessComponent + (creativeFinanceSignal ? 20 : 0) + lowEquityScore + (hasValue(input.mortgageBalance) ? 12 : 0) + getAssetTypeScore(classification, "subject_to")),
    seller_finance: clampScore(readinessComponent + (input.flexibleTerms ? 24 : creativeFinanceSignal ? 16 : 0) + lowEquityScore * 0.5 + getAssetTypeScore(classification, "seller_finance")),
    land_flip: clampScore(readinessComponent + getAssetTypeScore(classification, "land_flip") + discountScore + demandSignalScore),
    development_or_construction: clampScore(readinessComponent + getAssetTypeScore(classification, "development_or_construction") + (developmentSignal ? 25 : 0) + (hasValue(input.zip) ? 8 : 0)),
    luxury_acquisition: clampScore(readinessComponent + getAssetTypeScore(classification, "luxury_acquisition") + (luxurySignal ? 25 : 0) + highEquityScore + (hasValue(input.zip) ? 8 : 0)),
  };
}

function buildStrategyScoreBreakdown({
  input,
  classification,
  luxurySignal,
  developmentSignal,
  creativeFinanceSignal,
}: {
  input: StrategyDecisionInput;
  classification: AssetClassificationResult;
  luxurySignal: boolean;
  developmentSignal: boolean;
  creativeFinanceSignal: boolean;
}): StrategyScoreBreakdown {
  const readinessScore = clampScore(classification.assetStrategyReadiness.score * 0.15);
  const allInRatio = getAllInRatio(input);
  const priceToArvRatio = getPriceToArvRatio(input);
  const equitySpread = getEquitySpread(input);
  const repairScore = getRepairScore(input);
  const rentSignal = hasValue(input.monthlyRent) || hasAny(normalizeText(input.notes), ["rent", "rental", "tenant", "cashflow", "cash flow"]);
  const demandScore = input.knownBuyerDemand ? 15 : classification.opportunityFlags.includes("common_wholesale_asset") ? 8 : 0;
  const equityScore = allInRatio === null ? 0 : allInRatio <= 0.7 ? 25 : allInRatio <= 0.78 ? 20 : allInRatio <= 0.85 ? 10 : 0;
  const arvScore = priceToArvRatio === null ? 0 : priceToArvRatio <= 0.65 ? 18 : priceToArvRatio <= 0.78 ? 12 : priceToArvRatio <= 0.9 ? 5 : 0;
  const lowEquityScore =
    hasValue(input.mortgageBalance) && hasValue(input.arv) && Number(input.mortgageBalance) / Math.max(Number(input.arv), 1) >= 0.75 ? 18 : 0;
  const highEquityScore = equitySpread !== null && equitySpread >= 150000 ? 16 : equitySpread !== null && equitySpread >= 50000 ? 10 : 0;

  return {
    wholesale: {
      equityScore,
      arvScore,
      repairImpact: clampScore(repairScore.heavy * 0.5),
      demandScore,
      readinessScore,
    },
    brrrr: {
      equityScore: clampScore(equityScore * 0.8),
      arvScore,
      repairImpact: repairScore.moderate,
      demandScore: rentSignal ? 18 : 0,
      readinessScore,
    },
    buy_and_hold_rental: {
      equityScore: 0,
      arvScore,
      repairImpact: clampScore(repairScore.light * 0.6),
      demandScore: rentSignal ? 25 : 0,
      readinessScore,
    },
    creative_finance: {
      equityScore: lowEquityScore,
      arvScore: 0,
      repairImpact: 0,
      demandScore: creativeFinanceSignal ? 30 : 0,
      readinessScore,
    },
    subject_to: {
      equityScore: lowEquityScore,
      arvScore: hasValue(input.mortgageBalance) ? 12 : 0,
      repairImpact: 0,
      demandScore: creativeFinanceSignal ? 20 : 0,
      readinessScore,
    },
    seller_finance: {
      equityScore: clampScore(lowEquityScore * 0.5),
      arvScore: 0,
      repairImpact: 0,
      demandScore: input.flexibleTerms ? 24 : creativeFinanceSignal ? 16 : 0,
      readinessScore,
    },
    land_flip: {
      equityScore,
      arvScore: 0,
      repairImpact: 0,
      demandScore,
      readinessScore,
    },
    development_or_construction: {
      equityScore: 0,
      arvScore: 0,
      repairImpact: 0,
      demandScore: (developmentSignal ? 25 : 0) + (hasValue(input.zip) ? 8 : 0),
      readinessScore,
    },
    luxury_acquisition: {
      equityScore: highEquityScore,
      arvScore,
      repairImpact: 0,
      demandScore: (luxurySignal ? 25 : 0) + (hasValue(input.zip) ? 8 : 0),
      readinessScore,
    },
  };
}

function getStructuredRiskFlags(input: StrategyDecisionInput, classification: AssetClassificationResult): StrategyRiskFlag[] {
  const flags: StrategyRiskFlag[] = classification.riskFlags.map((flag) => {
    if (flag === "price_at_or_above_arv" || flag === "low_classification_confidence") {
      return { type: flag, severity: "high", impactScore: 20 };
    }

    if (flag === "heavy_repair_risk" || flag === "specialized_buyer_pool") {
      return { type: flag, severity: "medium", impactScore: 12 };
    }

    return { type: flag, severity: "low", impactScore: 6 };
  });

  if (classification.assetStrategyReadiness.score < 80) {
    flags.push({
      type: "strategy_readiness_below_ready",
      severity: classification.assetStrategyReadiness.score < 60 ? "high" : "medium",
      impactScore: classification.assetStrategyReadiness.score < 60 ? 18 : 10,
    });
  }

  if (!hasValue(input.arv) || !hasValue(input.askingPrice)) {
    flags.push({ type: "missing_core_valuation", severity: "high", impactScore: 20 });
  }

  return [...new Map(flags.map((flag) => [flag.type, flag])).values()];
}

function getConfidence({
  winningScore,
  runnerUpScore,
  dataCompleteness,
  riskFlags,
}: {
  winningScore: number;
  runnerUpScore: number;
  dataCompleteness: number;
  riskFlags: StrategyRiskFlag[];
}) {
  const gap = Math.max(0, winningScore - runnerUpScore);
  const gapBonus = Math.min(gap, 20);
  const riskPenalty = riskFlags.reduce((total, flag) => total + flag.impactScore, 0);

  return clampScore(winningScore * 0.55 + dataCompleteness * 0.25 + gapBonus - riskPenalty);
}

function getPortfolioFit(input: StrategyDecisionInput, classification: AssetClassificationResult, riskFlags: StrategyRiskFlag[]): PortfolioFit {
  const stableAsset = ["single_family", "duplex", "triplex", "fourplex", "small_multifamily"].includes(classification.assetClass);
  const cashflow = hasValue(input.monthlyRent) || hasAny(normalizeText(input.notes), ["rent", "cashflow", "cash flow"]);
  const scalable = ["duplex", "triplex", "fourplex", "small_multifamily", "large_multifamily"].includes(classification.assetClass);
  const highRisk = riskFlags.some((flag) => flag.severity === "high");
  const score = (stableAsset ? 30 : 0) + (cashflow ? 30 : 0) + (scalable ? 25 : 0) + (!highRisk ? 15 : 0);

  if (score >= 75) {
    return "strong";
  }

  if (score >= 45) {
    return "moderate";
  }

  return "weak";
}

function getRejectedStrategies(strategyScores: StrategyScoreMatrix, recommendedStrategy: StrategyDecision): RejectedStrategy[] {
  return SCORED_STRATEGIES
    .filter((strategy) => strategy !== recommendedStrategy)
    .map((strategy) => {
      const score = strategyScores[strategy];

      return {
        strategy,
        reason: score < 40
          ? "Score was too low based on asset type, economics, readiness, and demand signals."
          : "Scored below the selected strategy after risk and confidence comparison.",
      };
    });
}

function getReadinessFromAssetReadiness(classification: AssetClassificationResult): StrategyReadiness {
  switch (classification.assetStrategyReadiness.level) {
    case "ready":
      return "ready";
    case "needs_data":
      return "needs_more_data";
    case "review":
      return "manual_review";
    case "not_viable":
      return "not_recommended";
  }
}

function getPlainReason(strategy: StrategyDecision, score: number) {
  if (strategy === "wholesale") {
    return "Wholesale is strongest because the asset, discount spread, repair profile, readiness, and demand signals produce the best score.";
  }

  if (strategy === "brrrr") {
    return "BRRRR is strongest because rental signal, rehab spread, and residential asset fit score highest.";
  }

  if (strategy === "buy_and_hold_rental") {
    return "Buy-and-hold rental is strongest because the property shows rental/cashflow fit with manageable risk.";
  }

  if (strategy === "creative_finance" || strategy === "subject_to" || strategy === "seller_finance") {
    return "Creative finance is strongest because flexible terms, low-equity, or seller-finance signals are present. Terms still need verification.";
  }

  if (strategy === "land_flip" || strategy === "development_or_construction") {
    return "Land/development strategy is strongest because the asset type and development signal fit better than residential exit strategies.";
  }

  if (strategy === "luxury_acquisition") {
    return "Luxury acquisition is strongest because luxury signal, upside, and location support the strategy.";
  }

  return `Manual review is recommended because the highest strategy score is ${score}, which is not strong enough for a clean recommendation.`;
}

export function decideStrategy(input: StrategyDecisionInput): StrategyDecisionResult {
  const classification = input.assetClassification ?? classifyAsset(input);
  const requiredMissingData = getMissingData(input, classification);
  const opportunityFlags = [...new Set([...classification.opportunityFlags])];
  const luxurySignal = getLuxurySignal(input, classification);
  const developmentSignal = getDevelopmentSignal(input, classification);
  const creativeFinanceSignal = getCreativeFinanceSignal(input);
  const strategyScores = buildStrategyScores({
    input,
    classification,
    luxurySignal,
    developmentSignal,
    creativeFinanceSignal,
  });
  const strategyScoreBreakdown = buildStrategyScoreBreakdown({
    input,
    classification,
    luxurySignal,
    developmentSignal,
    creativeFinanceSignal,
  });
  const riskFlags = getStructuredRiskFlags(input, classification);
  const portfolioFit = getPortfolioFit(input, classification, riskFlags);
  const rankedStrategies = (Object.entries(strategyScores) as Array<[ScoredStrategy, number]>).sort((a, b) => b[1] - a[1]);

  if (!classification.canProceedToStrategySelection) {
    const strategyConfidence = getConfidence({
      winningScore: classification.assetStrategyReadiness.score,
      runnerUpScore: rankedStrategies[0]?.[1] ?? 0,
      dataCompleteness: classification.assetStrategyReadiness.score,
      riskFlags,
    });

    return {
      recommendedStrategy: "needs_more_data",
      secondaryStrategies: [],
      strategyConfidence,
      strategyReadiness: getReadinessFromAssetReadiness(classification),
      reason: `Strategy selection is paused because asset readiness is ${classification.assetStrategyReadiness.level}. ${classification.assetStrategyReadiness.recommendedNextStep}.`,
      requiredMissingData,
      riskFlags,
      opportunityFlags,
      assetTypeUsed: classification.assetClass,
      luxurySignal,
      developmentSignal,
      creativeFinanceSignal,
      passReason: classification.assetStrategyReadiness.level === "not_viable" ? "insufficient_asset_data" : undefined,
      strategyScores,
      strategyScoreBreakdown,
      rejectedStrategies: getRejectedStrategies(strategyScores, "needs_more_data"),
      portfolioFit,
    };
  }

  const [winner, winningScore] = rankedStrategies[0];
  const runnerUpScore = rankedStrategies[1]?.[1] ?? 0;
  const highRiskPenalty = riskFlags.some((flag) => flag.severity === "high");
  const recommendedStrategy: StrategyDecision =
    highRiskPenalty && winningScore < 70 ? "manual_review" : winningScore < 35 ? "pass" : winner;
  const strategyConfidence = getConfidence({
    winningScore,
    runnerUpScore,
    dataCompleteness: classification.assetStrategyReadiness.score,
    riskFlags,
  });
  const strategyReadiness: StrategyReadiness =
    recommendedStrategy === "pass" ? "not_recommended" : recommendedStrategy === "manual_review" ? "manual_review" : "ready";
  const secondaryStrategies = rankedStrategies
    .slice(1)
    .filter(([, score]) => score >= 50)
    .map(([strategy]) => strategy)
    .slice(0, 3);

  return {
    recommendedStrategy,
    secondaryStrategies,
    strategyConfidence,
    strategyReadiness,
    reason: getPlainReason(recommendedStrategy, winningScore),
    requiredMissingData,
    riskFlags,
    opportunityFlags,
    assetTypeUsed: classification.assetClass,
    luxurySignal,
    developmentSignal,
    creativeFinanceSignal,
    passReason: recommendedStrategy === "pass" ? "risk_or_weak_strategy_signal" : undefined,
    strategyScores,
    strategyScoreBreakdown,
    rejectedStrategies: getRejectedStrategies(strategyScores, recommendedStrategy),
    portfolioFit,
  };
}
