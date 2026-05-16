import type { PortfolioAction, PortfolioDecision } from "@/types/portfolio";

type JsonRecord = Record<string, unknown>;

type PortfolioBuilderInput = {
  lead?: unknown;
  deal?: unknown;
  strategyDecision?: unknown;
  strategyComparison?: unknown;
  executionDecisionSupport?: unknown;
  executionScenarioComparison?: unknown;
  executionSimulation?: unknown;
  assetClassification?: unknown;
  buyerIntelligence?: unknown;
  marketContext?: unknown;
  portfolioContext?: unknown;
  askingPrice?: number | null;
  arv?: number | null;
  estimatedRepairs?: number | null;
  monthlyRent?: number | null;
  mortgageBalance?: number | null;
  sellerMotivation?: string | null;
  flexibleTerms?: boolean | null;
  knownBuyerDemand?: boolean | null;
  propertyType?: string | null;
  units?: number | null;
  notes?: string | null;
};

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as JsonRecord) : {};
}

function getPath(source: unknown, paths: string[]) {
  for (const path of paths) {
    const value = path.split(".").reduce<unknown>((current, key) => asRecord(current)[key], source);

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function getNumber(source: unknown, paths: string[], fallback = 0) {
  const value = getPath(source, paths);
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;

  return Number.isFinite(parsed) ? parsed : fallback;
}

function getString(source: unknown, paths: string[], fallback = "") {
  const value = getPath(source, paths);

  return typeof value === "string" ? value.trim() : fallback;
}

function getBoolean(source: unknown, paths: string[], fallback = false) {
  const value = getPath(source, paths);

  return typeof value === "boolean" ? value : fallback;
}

function getArray(source: unknown, paths: string[]) {
  const value = getPath(source, paths);

  return Array.isArray(value) ? value : [];
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function hasAny(text: string, terms: string[]) {
  const normalized = text.toLowerCase();

  return terms.some((term) => normalized.includes(term));
}

function getDealMetrics(input: PortfolioBuilderInput) {
  const askingPrice = getNumber(input, ["askingPrice", "deal.askingPrice", "lead.askingPrice", "lead.price"], 0);
  const arv = getNumber(input, ["arv", "deal.arv", "lead.arv"], 0);
  const repairs = getNumber(input, ["estimatedRepairs", "deal.estimatedRepairs", "lead.estimatedRepairs"], 0);
  const monthlyRent = getNumber(input, ["monthlyRent", "deal.monthlyRent", "lead.monthlyRent"], 0);
  const mortgageBalance = getNumber(input, ["mortgageBalance", "deal.mortgageBalance", "lead.mortgageBalance"], 0);
  const grossSpread = arv > 0 && askingPrice > 0 ? arv - askingPrice - repairs : 0;
  const roi = askingPrice + repairs > 0 ? (grossSpread / (askingPrice + repairs)) * 100 : 0;
  const rentPriceRatio = askingPrice > 0 ? (monthlyRent / askingPrice) * 100 : 0;

  return {
    askingPrice,
    arv,
    repairs,
    monthlyRent,
    mortgageBalance,
    grossSpread,
    roi,
    rentPriceRatio,
  };
}

function getRiskContext(input: PortfolioBuilderInput) {
  const decision = asRecord(input.executionDecisionSupport);
  const reliability = asRecord(decision.reliability);
  const confidence = asRecord(decision.confidence);
  const riskScore = getNumber(input, ["executionDecisionSupport.selectedOption.riskScore", "executionDecisionSupport.modelRiskScore"], 50);
  const confidenceScore = getNumber(input, ["executionDecisionSupport.confidenceScore", "strategyDecision.strategyConfidence"], 50);
  const reliabilityScore = getNumber(input, ["executionDecisionSupport.reliabilityScore"], confidenceScore);
  const dataTrustScore = getNumber(input, ["executionDecisionSupport.dataTrustScore", "executionDecisionSupport.reliability.dataTrustScore"], 50);
  const uncertaintyLevel = getString(input, ["executionDecisionSupport.uncertaintyLevel", "executionDecisionSupport.reliability.uncertaintyLevel"], "moderate");
  const overconfidenceDetected = getBoolean(input, ["executionDecisionSupport.reliability.overconfidenceDetected"], false);
  const missingData = getArray(confidence, ["missingData"]);
  const blockReasons = getArray(decision, ["blockReasons"]);
  const reliabilityWarnings = getArray(reliability, ["reliabilityWarnings"]);

  return {
    riskScore,
    confidenceScore,
    reliabilityScore,
    dataTrustScore,
    uncertaintyLevel,
    overconfidenceDetected,
    missingData: missingData.filter((item): item is string => typeof item === "string"),
    blockReasons: blockReasons.filter((item): item is string => typeof item === "string"),
    reliabilityWarnings: reliabilityWarnings.filter((item): item is string => typeof item === "string"),
  };
}

function scoreActions(input: PortfolioBuilderInput) {
  const metrics = getDealMetrics(input);
  const risk = getRiskContext(input);
  const strategy = getString(input, ["strategyDecision.recommendedStrategy", "strategyComparison.bestStrategy"], "");
  const propertyType = getString(input, ["propertyType", "deal.propertyType", "lead.propertyType", "assetClassification.assetClass"], "");
  const notes = getString(input, ["notes", "deal.notes", "lead.notes"], "");
  const sellerMotivation = getString(input, ["sellerMotivation", "deal.sellerMotivation", "lead.sellerMotivation"], "");
  const flexibleTerms = getBoolean(input, ["flexibleTerms", "deal.flexibleTerms", "lead.flexibleTerms"], false);
  const knownBuyerDemand = getBoolean(input, ["knownBuyerDemand", "buyerIntelligence.knownBuyerDemand", "marketContext.knownBuyerDemand"], false);
  const units = getNumber(input, ["units", "deal.units", "lead.units"], 0);
  const hasPortfolioSignal = units >= 3 || hasAny(`${propertyType} ${notes}`, ["portfolio", "package", "bulk", "multi", "multifamily"]);
  const termsSignal = flexibleTerms || hasAny(`${strategy} ${sellerMotivation} ${notes}`, ["seller_finance", "seller finance", "subject_to", "subto", "terms", "low down"]);
  const dataPenalty = Math.max(0, 65 - risk.dataTrustScore) * 0.55 + risk.missingData.length * 2;
  const riskPenalty = Math.max(0, risk.riskScore - 55) * 0.45 + (risk.uncertaintyLevel === "extreme" ? 25 : risk.uncertaintyLevel === "high" ? 12 : 0);

  const wholesale = clampScore(
    45 +
      (metrics.grossSpread > 15000 ? 18 : 0) +
      (knownBuyerDemand ? 12 : 0) +
      (metrics.repairs > 0 ? 4 : 0) +
      (hasAny(strategy, ["wholesale", "assignment"]) ? 12 : 0) -
      dataPenalty * 0.55 -
      riskPenalty * 0.45,
  );
  const flip = clampScore(
    35 +
      (metrics.roi >= 20 ? 22 : metrics.roi >= 12 ? 12 : 0) +
      (metrics.repairs > 0 && metrics.repairs < metrics.arv * 0.22 ? 10 : 0) +
      (hasAny(strategy, ["flip", "rehab"]) ? 12 : 0) -
      dataPenalty * 0.65 -
      riskPenalty * 0.75,
  );
  const hold = clampScore(
    35 +
      (metrics.rentPriceRatio >= 1 ? 22 : metrics.rentPriceRatio >= 0.75 ? 12 : 0) +
      (metrics.monthlyRent > 0 ? 8 : 0) +
      (hasAny(strategy, ["hold", "rental", "brrrr"]) ? 12 : 0) -
      dataPenalty * 0.6 -
      riskPenalty * 0.55,
  );
  const creativeFinance = clampScore(
    30 +
      (termsSignal ? 30 : 0) +
      (metrics.mortgageBalance > 0 ? 8 : 0) +
      (hasAny(strategy, ["seller_finance", "subject_to", "creative"]) ? 14 : 0) -
      dataPenalty * 0.55 -
      riskPenalty * 0.65,
  );
  const packagePortfolio = clampScore(
    28 +
      (hasPortfolioSignal ? 28 : 0) +
      (knownBuyerDemand ? 8 : 0) +
      (metrics.grossSpread > 25000 ? 8 : 0) -
      dataPenalty * 0.5 -
      riskPenalty * 0.45,
  );
  const pass = clampScore(
    25 +
      (risk.reliabilityScore < 50 ? 22 : 0) +
      (risk.dataTrustScore < 45 ? 20 : 0) +
      (risk.riskScore >= 75 ? 18 : 0) +
      (risk.overconfidenceDetected ? 18 : 0) +
      (metrics.grossSpread < 5000 && metrics.rentPriceRatio < 0.75 && !termsSignal ? 12 : 0) +
      risk.blockReasons.length * 4,
  );

  return {
    scores: {
      wholesale,
      flip,
      hold,
      creative_finance: creativeFinance,
      package_portfolio: packagePortfolio,
      pass,
    } satisfies Record<PortfolioAction, number>,
    metrics,
    risk,
    termsSignal,
    hasPortfolioSignal,
    knownBuyerDemand,
  };
}

function getRationale(action: PortfolioAction, context: ReturnType<typeof scoreActions>) {
  const rationale: string[] = [];
  const { metrics, risk } = context;

  if (action === "wholesale") {
    if (metrics.grossSpread > 0) rationale.push(`Projected spread is about ${Math.round(metrics.grossSpread)} before final disposition costs.`);
    if (context.knownBuyerDemand) rationale.push("Known buyer demand supports a faster, lower-capital exit.");
    rationale.push("Wholesale limits capital exposure compared with owning the deal.");
  }

  if (action === "flip") {
    rationale.push(`Projected ROI is about ${Math.round(metrics.roi)}% before financing and holding costs.`);
    rationale.push("Flip is favored when margin is strong and rehab exposure is manageable.");
  }

  if (action === "hold") {
    rationale.push(`Rent-to-price ratio is about ${metrics.rentPriceRatio.toFixed(2)}%.`);
    rationale.push("Hold is favored when income potential supports long-term portfolio wealth.");
  }

  if (action === "creative_finance") {
    rationale.push("Seller terms or debt structure may reduce cash required at entry.");
    rationale.push("Creative finance can preserve capital if consent, documents, and compliance are reviewed.");
  }

  if (action === "package_portfolio") {
    rationale.push("Portfolio or multi-asset signals suggest bundling may improve buyer/investor fit.");
    rationale.push("Packaging can increase strategic value when similar assets share demand.");
  }

  if (action === "pass") {
    rationale.push("Risk, uncertainty, or data quality does not support a portfolio allocation yet.");
    if (metrics.grossSpread <= 5000) rationale.push("Projected spread is not strong enough from current inputs.");
  }

  if (risk.reliabilityScore > 0) rationale.push(`Reliability score considered: ${risk.reliabilityScore}/100.`);

  return rationale.slice(0, 5);
}

function getRisks(action: PortfolioAction, context: ReturnType<typeof scoreActions>) {
  const risks = [
    ...context.risk.blockReasons,
    ...context.risk.reliabilityWarnings,
    ...context.risk.missingData.map((field) => `Missing or weak data: ${field}`),
  ];

  if (action === "flip" && context.metrics.repairs === 0) risks.push("Repair estimate is missing or unverified.");
  if (action === "hold" && context.metrics.monthlyRent === 0) risks.push("Rent estimate is missing.");
  if (action === "creative_finance") risks.push("Legal, seller consent, and document review are required before any execution.");
  if (action === "package_portfolio" && !context.hasPortfolioSignal) risks.push("Portfolio packaging signal is weak.");

  return [...new Set(risks)].slice(0, 6);
}

export function selectPortfolioAction(input: PortfolioBuilderInput): PortfolioDecision {
  const context = scoreActions(input);
  const ranked = (Object.entries(context.scores) as Array<[PortfolioAction, number]>)
    .sort((a, b) => b[1] - a[1]);
  const [action, score] = ranked[0];
  const metrics = context.metrics;

  return {
    action,
    confidence: clampScore(score),
    rationale: getRationale(action, context),
    risks: getRisks(action, context),
    assumptions: [
      "Portfolio action is read-only decision support and does not execute, route, message, or automate anything.",
      "All property facts are assumed to come from the supplied payload or existing lead record.",
      "Return estimates are directional and require human underwriting before action.",
    ],
    estimatedReturn: {
      profit: metrics.grossSpread > 0 ? Math.round(metrics.grossSpread) : undefined,
      roi: metrics.roi > 0 ? Math.round(metrics.roi) : undefined,
    },
    capitalRequired: action === "wholesale"
      ? Math.max(1000, Math.round(metrics.askingPrice * 0.01))
      : action === "creative_finance"
        ? Math.max(2500, Math.round(metrics.askingPrice * 0.03))
        : metrics.askingPrice > 0
          ? Math.round(metrics.askingPrice * 0.2 + metrics.repairs)
          : undefined,
    timelineDays: action === "wholesale" ? 14 : action === "flip" ? 120 : action === "hold" ? 365 : action === "creative_finance" ? 45 : action === "package_portfolio" ? 30 : undefined,
    alternativeRank: ranked.slice(0, 4).map(([rankedAction, rankedScore]) => ({
      action: rankedAction,
      score: rankedScore,
    })),
  };
}
