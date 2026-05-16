export type AssetClass =
  | "single_family"
  | "duplex"
  | "triplex"
  | "fourplex"
  | "small_multifamily"
  | "large_multifamily"
  | "condo"
  | "townhome"
  | "mobile_home"
  | "land"
  | "commercial"
  | "mixed_use"
  | "unknown";

export type AssetStrategy = "wholesale" | "fix_and_flip" | "buy_and_hold" | "wholetail" | "land_bank" | "needs_review";
export type AssetRiskLevel = "low" | "medium" | "high";
export type AssetStrategyReadinessLevel = "ready" | "needs_data" | "review" | "not_viable";

export type AssetClassificationInput = {
  propertyType?: string | null;
  zip?: string | null;
  units?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  lotSizeSqft?: number | null;
  yearBuilt?: number | null;
  occupancy?: string | null;
  condition?: string | null;
  askingPrice?: number | null;
  arv?: number | null;
  estimatedRepairs?: number | null;
  notes?: string | null;
};

export type AssetClassificationResult = {
  assetClass: AssetClass;
  assetSubtype: string;
  confidenceScore: number;
  riskLevel: AssetRiskLevel;
  strategyFit: Record<AssetStrategy, number>;
  recommendedStrategies: AssetStrategy[];
  classificationReasons: string[];
  riskFlags: string[];
  opportunityFlags: string[];
  dataQuality: {
    score: number;
    missingFields: string[];
  };
  assumptions: string[];
  assetStrategyReadiness: {
    score: number;
    level: AssetStrategyReadinessLevel;
    missingInputs: string[];
    recommendedNextStep: string;
  };
  canProceedToStrategySelection: boolean;
};

type AssetSignal = {
  assetClass: AssetClass;
  reason: string;
  weight: number;
};

const ASSET_LABELS: Record<AssetClass, string> = {
  single_family: "Single-family residential",
  duplex: "Duplex",
  triplex: "Triplex",
  fourplex: "Fourplex",
  small_multifamily: "Small multifamily",
  large_multifamily: "Large multifamily",
  condo: "Condo",
  townhome: "Townhome",
  mobile_home: "Mobile home",
  land: "Land",
  commercial: "Commercial",
  mixed_use: "Mixed-use",
  unknown: "Unknown asset type",
};

const REQUIRED_SIGNAL_FIELDS: Array<keyof AssetClassificationInput> = ["propertyType", "units", "condition", "askingPrice"];

function normalizeText(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function hasAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function addSignal(signals: AssetSignal[], assetClass: AssetClass, reason: string, weight: number) {
  signals.push({ assetClass, reason, weight });
}

function collectSignals(input: AssetClassificationInput) {
  const signals: AssetSignal[] = [];
  const propertyType = normalizeText(input.propertyType);
  const notes = normalizeText(input.notes);
  const combinedText = `${propertyType} ${notes}`;
  const units = input.units ?? null;

  if (units !== null) {
    if (units <= 1) {
      addSignal(signals, "single_family", "unit_count_single_family", 35);
    } else if (units === 2) {
      addSignal(signals, "duplex", "unit_count_duplex", 45);
    } else if (units === 3) {
      addSignal(signals, "triplex", "unit_count_triplex", 45);
    } else if (units === 4) {
      addSignal(signals, "fourplex", "unit_count_fourplex", 45);
    } else if (units <= 20) {
      addSignal(signals, "small_multifamily", "unit_count_small_multifamily", 45);
    } else {
      addSignal(signals, "large_multifamily", "unit_count_large_multifamily", 45);
    }
  }

  if (hasAny(combinedText, ["single family", "single-family", "sfh", "house", "residential"])) {
    addSignal(signals, "single_family", "property_type_residential_house", 40);
  }

  if (hasAny(combinedText, ["duplex", "2 unit", "two unit"])) {
    addSignal(signals, "duplex", "property_type_duplex", 50);
  }

  if (hasAny(combinedText, ["triplex", "3 unit", "three unit"])) {
    addSignal(signals, "triplex", "property_type_triplex", 50);
  }

  if (hasAny(combinedText, ["fourplex", "4 unit", "quadplex", "quad"])) {
    addSignal(signals, "fourplex", "property_type_fourplex", 50);
  }

  if (hasAny(combinedText, ["multifamily", "multi family", "apartment", "apartments"])) {
    addSignal(signals, units !== null && units > 20 ? "large_multifamily" : "small_multifamily", "property_type_multifamily", 45);
  }

  if (hasAny(combinedText, ["condo", "condominium"])) {
    addSignal(signals, "condo", "property_type_condo", 50);
  }

  if (hasAny(combinedText, ["townhome", "town house", "townhouse"])) {
    addSignal(signals, "townhome", "property_type_townhome", 50);
  }

  if (hasAny(combinedText, ["mobile home", "manufactured", "trailer"])) {
    addSignal(signals, "mobile_home", "property_type_mobile_home", 50);
  }

  if (hasAny(combinedText, ["land", "lot", "acre", "vacant parcel"])) {
    addSignal(signals, "land", "property_type_land", 50);
  }

  if (hasAny(combinedText, ["commercial", "retail", "office", "warehouse", "industrial"])) {
    addSignal(signals, "commercial", "property_type_commercial", 50);
  }

  if (hasAny(combinedText, ["mixed use", "mixed-use", "storefront with apartment"])) {
    addSignal(signals, "mixed_use", "property_type_mixed_use", 55);
  }

  return signals;
}

function getBestAssetClass(signals: AssetSignal[]) {
  const scores = new Map<AssetClass, number>();

  for (const signal of signals) {
    scores.set(signal.assetClass, (scores.get(signal.assetClass) ?? 0) + signal.weight);
  }

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);

  return ranked[0]?.[0] ?? "unknown";
}

function getConfidenceScore(assetClass: AssetClass, signals: AssetSignal[], dataQualityScore: number) {
  if (assetClass === "unknown") {
    return Math.min(35, dataQualityScore);
  }

  const totalSignalWeight = signals.reduce((total, signal) => total + signal.weight, 0);
  const winningWeight = signals
    .filter((signal) => signal.assetClass === assetClass)
    .reduce((total, signal) => total + signal.weight, 0);
  const signalShare = totalSignalWeight === 0 ? 0 : (winningWeight / totalSignalWeight) * 100;

  return clampScore(signalShare * 0.7 + dataQualityScore * 0.3);
}

function getDataQuality(input: AssetClassificationInput) {
  const missingFields = REQUIRED_SIGNAL_FIELDS.filter((field) => {
    const value = input[field];

    return value === undefined || value === null || value === "";
  }).map(String);

  return {
    score: clampScore(100 - missingFields.length * 18),
    missingFields,
  };
}

function getRiskFlags(input: AssetClassificationInput, assetClass: AssetClass, confidenceScore: number) {
  const flags: string[] = [];
  const condition = normalizeText(input.condition);
  const occupancy = normalizeText(input.occupancy);

  if (assetClass === "unknown" || confidenceScore < 55) {
    flags.push("low_classification_confidence");
  }

  if (hasAny(condition, ["major", "heavy", "fire", "foundation", "mold", "gut", "tear down", "teardown"])) {
    flags.push("heavy_repair_risk");
  }

  if (hasAny(occupancy, ["occupied", "tenant", "rented"])) {
    flags.push("occupancy_complexity");
  }

  if (input.arv !== null && input.arv !== undefined && input.askingPrice !== null && input.askingPrice !== undefined && input.askingPrice >= input.arv) {
    flags.push("price_at_or_above_arv");
  }

  if (assetClass === "commercial" || assetClass === "mixed_use" || assetClass === "large_multifamily") {
    flags.push("specialized_buyer_pool");
  }

  return flags;
}

function getOpportunityFlags(input: AssetClassificationInput, assetClass: AssetClass) {
  const flags: string[] = [];
  const condition = normalizeText(input.condition);
  const occupancy = normalizeText(input.occupancy);

  if (assetClass === "single_family" || assetClass === "duplex" || assetClass === "fourplex") {
    flags.push("common_wholesale_asset");
  }

  if (hasAny(condition, ["light", "cosmetic", "minor"])) {
    flags.push("lighter_rehab_profile");
  }

  if (hasAny(occupancy, ["vacant", "empty"])) {
    flags.push("cleaner_access_for_inspection");
  }

  if (
    input.askingPrice !== null &&
    input.askingPrice !== undefined &&
    input.arv !== null &&
    input.arv !== undefined &&
    input.estimatedRepairs !== null &&
    input.estimatedRepairs !== undefined &&
    input.askingPrice + input.estimatedRepairs <= input.arv * 0.75
  ) {
    flags.push("potential_margin_spread");
  }

  return flags;
}

function getStrategyFit(input: AssetClassificationInput, assetClass: AssetClass, riskFlags: string[]) {
  const condition = normalizeText(input.condition);
  const hasMargin =
    input.askingPrice !== null &&
    input.askingPrice !== undefined &&
    input.arv !== null &&
    input.arv !== undefined &&
    input.estimatedRepairs !== null &&
    input.estimatedRepairs !== undefined &&
    input.askingPrice + input.estimatedRepairs <= input.arv * 0.78;
  const isResidential = ["single_family", "duplex", "triplex", "fourplex", "townhome", "condo", "mobile_home"].includes(assetClass);
  const isMultifamily = ["duplex", "triplex", "fourplex", "small_multifamily", "large_multifamily"].includes(assetClass);

  const scores: Record<AssetStrategy, number> = {
    wholesale: assetClass === "unknown" ? 20 : 55,
    fix_and_flip: isResidential ? 50 : 25,
    buy_and_hold: isMultifamily ? 65 : 40,
    wholetail: isResidential ? 45 : 20,
    land_bank: assetClass === "land" ? 75 : 10,
    needs_review: riskFlags.length >= 2 || assetClass === "unknown" ? 70 : 20,
  };

  if (hasMargin) {
    scores.wholesale += 20;
    scores.fix_and_flip += 15;
  }

  if (hasAny(condition, ["light", "cosmetic", "minor"])) {
    scores.wholetail += 20;
    scores.fix_and_flip += 10;
  }

  if (hasAny(condition, ["major", "heavy", "foundation", "fire", "gut"])) {
    scores.wholesale += 10;
    scores.needs_review += 15;
    scores.wholetail -= 20;
  }

  if (assetClass === "commercial" || assetClass === "mixed_use" || assetClass === "large_multifamily") {
    scores.needs_review += 20;
  }

  return Object.fromEntries(
    Object.entries(scores).map(([strategy, score]) => [strategy, clampScore(score)]),
  ) as Record<AssetStrategy, number>;
}

function getRiskLevel(riskFlags: string[], confidenceScore: number): AssetRiskLevel {
  if (riskFlags.length >= 3 || confidenceScore < 45) {
    return "high";
  }

  if (riskFlags.length >= 1 || confidenceScore < 70) {
    return "medium";
  }

  return "low";
}

function hasValue(value: unknown) {
  return value !== undefined && value !== null && value !== "";
}

function getAssetStrategyReadiness({
  input,
  assetClass,
  confidenceScore,
  strategyFit,
  recommendedStrategies,
}: {
  input: AssetClassificationInput;
  assetClass: AssetClass;
  confidenceScore: number;
  strategyFit: Record<AssetStrategy, number>;
  recommendedStrategies: AssetStrategy[];
}) {
  const missingInputs: string[] = [];
  let score = 0;

  if (assetClass !== "unknown" && confidenceScore >= 70) {
    score += 20;
  } else {
    missingInputs.push("property_type");
  }

  if (hasValue(input.askingPrice)) {
    score += 15;
  } else {
    missingInputs.push("asking_price");
  }

  if (hasValue(input.arv)) {
    score += 20;
  } else {
    missingInputs.push("arv");
  }

  if (hasValue(input.estimatedRepairs) || hasValue(input.condition)) {
    score += 15;
  }

  if (!hasValue(input.estimatedRepairs)) {
    missingInputs.push("repair_estimate");
  }

  if (!hasValue(input.condition)) {
    missingInputs.push("property_condition");
  }

  if (hasValue(input.zip)) {
    score += 15;
  } else {
    missingInputs.push("location_zip");
  }

  const hasStrategySignal =
    recommendedStrategies.some((strategy) => strategy !== "needs_review") ||
    Object.entries(strategyFit).some(([strategy, fitScore]) => strategy !== "needs_review" && fitScore >= 55);

  if (hasStrategySignal) {
    score += 15;
  } else {
    missingInputs.push("demand_alignment");
  }

  const readinessScore = clampScore(score);
  let level: AssetStrategyReadinessLevel = "not_viable";

  if (readinessScore >= 80) {
    level = "ready";
  } else if (readinessScore >= 60) {
    level = "needs_data";
  } else if (readinessScore >= 40) {
    level = "review";
  }

  let recommendedNextStep = "Do not select strategy yet; insufficient asset data";

  if (level === "ready") {
    recommendedNextStep = "Proceed to strategy selection";
  } else if (level === "not_viable") {
    recommendedNextStep = "Do not select strategy yet; insufficient asset data";
  } else if (missingInputs.includes("arv")) {
    recommendedNextStep = "Validate ARV before selecting strategy";
  } else if (missingInputs.includes("repair_estimate") || missingInputs.includes("property_condition")) {
    recommendedNextStep = "Request repair estimate or property condition";
  } else if (level === "needs_data" || level === "review") {
    recommendedNextStep = "Collect seller motivation and missing deal data";
  }

  return {
    score: readinessScore,
    level,
    missingInputs: [...new Set(missingInputs)],
    recommendedNextStep,
  };
}

export function classifyAsset(input: AssetClassificationInput): AssetClassificationResult {
  const dataQuality = getDataQuality(input);
  const signals = collectSignals(input);
  const assetClass = getBestAssetClass(signals);
  const confidenceScore = getConfidenceScore(assetClass, signals, dataQuality.score);
  const riskFlags = getRiskFlags(input, assetClass, confidenceScore);
  const opportunityFlags = getOpportunityFlags(input, assetClass);
  const strategyFit = getStrategyFit(input, assetClass, riskFlags);
  const recommendedStrategies = (Object.entries(strategyFit) as Array<[AssetStrategy, number]>)
    .filter(([, score]) => score >= 55)
    .sort((a, b) => b[1] - a[1])
    .map(([strategy]) => strategy)
    .slice(0, 3);
  const assumptions = [];

  if (assetClass === "unknown") {
    assumptions.push("Asset class could not be safely inferred from the provided fields.");
  }

  if (dataQuality.missingFields.length > 0) {
    assumptions.push(`Missing fields reduce confidence: ${dataQuality.missingFields.join(", ")}.`);
  }
  const finalRecommendedStrategies: AssetStrategy[] = recommendedStrategies.length > 0 ? recommendedStrategies : ["needs_review"];
  const assetStrategyReadiness = getAssetStrategyReadiness({
    input,
    assetClass,
    confidenceScore,
    strategyFit,
    recommendedStrategies: finalRecommendedStrategies,
  });

  return {
    assetClass,
    assetSubtype: ASSET_LABELS[assetClass],
    confidenceScore,
    riskLevel: getRiskLevel(riskFlags, confidenceScore),
    strategyFit,
    recommendedStrategies: finalRecommendedStrategies,
    classificationReasons: signals
      .filter((signal) => signal.assetClass === assetClass)
      .map((signal) => signal.reason),
    riskFlags,
    opportunityFlags,
    dataQuality,
    assumptions,
    assetStrategyReadiness,
    canProceedToStrategySelection: assetStrategyReadiness.level === "ready",
  };
}
