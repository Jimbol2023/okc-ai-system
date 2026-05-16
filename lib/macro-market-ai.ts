export type MacroOpportunityLevel = "low" | "medium" | "high" | "elite";

export type MacroRiskLevel = "low" | "medium" | "high";

export type MacroMarketProfileInput = {
  market?: string;
  state?: string;
  assetType?: string;
};

export type MacroDemandSignals = {
  populationGrowth: number;
  jobGrowth: number;
  affordabilityScore: number;
  rentalDemand: number;
  investorActivity: number;
  distressOpportunity: number;
};

export type MacroMarketProfile = {
  marketName: string;
  state: string;
  macroScore: number;
  opportunityLevel: MacroOpportunityLevel;
  riskLevel: MacroRiskLevel;
  demandSignals: MacroDemandSignals;
  strengths: string[];
  risks: string[];
  recommendedFocus: string[];
  confidenceScore: number;
  reasoning: string;
};

type SyntheticMarketRecord = MacroDemandSignals & {
  marketName: string;
  state: string;
  economicMomentum: number;
  marketRisk: number;
  riskFactors: string[];
};

const syntheticMarkets: SyntheticMarketRecord[] = [
  {
    marketName: "Oklahoma City",
    state: "OK",
    populationGrowth: 74,
    jobGrowth: 70,
    affordabilityScore: 78,
    rentalDemand: 76,
    investorActivity: 72,
    distressOpportunity: 68,
    economicMomentum: 73,
    marketRisk: 36,
    riskFactors: ["Insurance and repair-cost sensitivity can affect margins.", "Investor competition can tighten discounts in stronger submarkets."],
  },
  {
    marketName: "Tulsa",
    state: "OK",
    populationGrowth: 62,
    jobGrowth: 64,
    affordabilityScore: 80,
    rentalDemand: 69,
    investorActivity: 63,
    distressOpportunity: 71,
    economicMomentum: 65,
    marketRisk: 42,
    riskFactors: ["Block-by-block demand variation requires careful neighborhood validation.", "Older housing stock can increase rehab uncertainty."],
  },
  {
    marketName: "Dallas",
    state: "TX",
    populationGrowth: 84,
    jobGrowth: 86,
    affordabilityScore: 48,
    rentalDemand: 83,
    investorActivity: 88,
    distressOpportunity: 52,
    economicMomentum: 87,
    marketRisk: 58,
    riskFactors: ["Affordability pressure can reduce entry-level buyer depth.", "High investor competition can compress spreads."],
  },
  {
    marketName: "Kansas City",
    state: "MO",
    populationGrowth: 66,
    jobGrowth: 67,
    affordabilityScore: 72,
    rentalDemand: 73,
    investorActivity: 68,
    distressOpportunity: 64,
    economicMomentum: 68,
    marketRisk: 40,
    riskFactors: ["Submarket quality varies materially across the metro.", "Exit demand may be slower outside core investor zones."],
  },
  {
    marketName: "Little Rock",
    state: "AR",
    populationGrowth: 48,
    jobGrowth: 52,
    affordabilityScore: 82,
    rentalDemand: 61,
    investorActivity: 49,
    distressOpportunity: 74,
    economicMomentum: 51,
    marketRisk: 55,
    riskFactors: ["Lower investor liquidity can slow disposition.", "Economic momentum is more moderate than larger regional metros."],
  },
];

function normalize(value?: string) {
  return value?.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_") ?? "";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function findMarket(input?: MacroMarketProfileInput) {
  const market = normalize(input?.market);
  const state = normalize(input?.state);
  const exactMatch = syntheticMarkets.find((record) =>
    (!market || normalize(record.marketName) === market) &&
    (!state || normalize(record.state) === state),
  );

  if (exactMatch) {
    return {
      record: exactMatch,
      matchQuality: market ? 1 : 0.86,
    };
  }

  const stateMatch = syntheticMarkets.find((record) => state && normalize(record.state) === state);

  if (stateMatch) {
    return {
      record: stateMatch,
      matchQuality: 0.76,
    };
  }

  return {
    record: syntheticMarkets[0],
    matchQuality: 0.68,
  };
}

function calculateMacroScore(record: SyntheticMarketRecord) {
  const rawScore =
    record.populationGrowth * 0.17 +
    record.jobGrowth * 0.16 +
    record.affordabilityScore * 0.16 +
    record.rentalDemand * 0.17 +
    record.investorActivity * 0.14 +
    record.distressOpportunity * 0.12 +
    record.economicMomentum * 0.08 -
    record.marketRisk * 0.12;

  return clamp(Math.round(rawScore), 0, 100);
}

function getOpportunityLevel(score: number): MacroOpportunityLevel {
  if (score >= 85) return "elite";
  if (score >= 70) return "high";
  if (score >= 50) return "medium";

  return "low";
}

function getRiskLevel(record: SyntheticMarketRecord): MacroRiskLevel {
  if (record.marketRisk >= 65) return "high";
  if (record.marketRisk >= 40) return "medium";

  return "low";
}

function getStrengths(record: SyntheticMarketRecord) {
  return [
    ...(record.populationGrowth >= 70 ? ["Population growth supports broader housing demand."] : []),
    ...(record.jobGrowth >= 70 ? ["Job growth supports household formation and buyer/renter stability."] : []),
    ...(record.affordabilityScore >= 70 ? ["Relative affordability may preserve investor and end-buyer liquidity."] : []),
    ...(record.rentalDemand >= 70 ? ["Rental demand supports hold, BRRRR, and landlord-buyer exits."] : []),
    ...(record.investorActivity >= 70 ? ["Investor activity suggests stronger disposition depth."] : []),
    ...(record.distressOpportunity >= 70 ? ["Distress pressure may create off-market acquisition opportunities."] : []),
    ...(record.economicMomentum >= 70 ? ["Economic momentum supports more resilient deal flow."] : []),
  ];
}

function getRisks(record: SyntheticMarketRecord) {
  return [
    ...record.riskFactors,
    ...(record.affordabilityScore < 55 ? ["Affordability pressure may limit buyer depth at higher price points."] : []),
    ...(record.investorActivity < 55 ? ["Lower investor activity may slow resale or assignment exits."] : []),
    ...(record.marketRisk >= 55 ? ["Market risk requires tighter underwriting and stronger verification before targeting."] : []),
  ];
}

function getRecommendedFocus(record: SyntheticMarketRecord, assetType?: string) {
  const normalizedAssetType = normalize(assetType);
  const focus = [
    ...(record.rentalDemand >= 70 ? ["Prioritize rental-friendly neighborhoods with verified rent support."] : []),
    ...(record.distressOpportunity >= 68 ? ["Target distress-driven seller situations where discounts can offset repair and holding risk."] : []),
    ...(record.affordabilityScore >= 70 ? ["Favor entry-level and workforce-housing price bands with broad buyer depth."] : []),
    ...(record.investorActivity >= 70 ? ["Prepare disposition paths early because active investor demand may support faster exits."] : []),
  ];

  if (normalizedAssetType === "single_family") {
    focus.unshift("Focus on single-family properties with clear spread, verified repairs, and multiple exit paths.");
  } else if (normalizedAssetType === "land") {
    focus.unshift("Focus on infill or utility-access land where buyer depth and entitlement risk can be verified.");
  } else if (normalizedAssetType.includes("multifamily")) {
    focus.unshift("Focus on small multifamily assets where rent roll, NOI, and deferred maintenance can be verified.");
  } else if (normalizedAssetType) {
    focus.unshift(`Focus on ${normalizedAssetType} opportunities only after buyer demand and exit liquidity are confirmed.`);
  }

  return focus.length > 0 ? focus : ["Collect deeper market and buyer-demand data before prioritizing lead targeting."];
}

function calculateConfidenceScore(record: SyntheticMarketRecord, matchQuality: number) {
  const signalSpread = Math.max(
    record.populationGrowth,
    record.jobGrowth,
    record.affordabilityScore,
    record.rentalDemand,
    record.investorActivity,
    record.distressOpportunity,
  ) - Math.min(
    record.populationGrowth,
    record.jobGrowth,
    record.affordabilityScore,
    record.rentalDemand,
    record.investorActivity,
    record.distressOpportunity,
  );
  const consistencyScore = 1 - clamp(signalSpread / 100, 0, 1);

  return round(clamp(matchQuality * 0.55 + consistencyScore * 0.3 + 0.15, 0, 1));
}

export function getMacroMarketProfile(input?: MacroMarketProfileInput): MacroMarketProfile {
  const { record, matchQuality } = findMarket(input);
  const macroScore = calculateMacroScore(record);
  const opportunityLevel = getOpportunityLevel(macroScore);
  const riskLevel = getRiskLevel(record);
  const strengths = getStrengths(record);
  const risks = getRisks(record);
  const recommendedFocus = getRecommendedFocus(record, input?.assetType);
  const confidenceScore = calculateConfidenceScore(record, matchQuality);

  return {
    marketName: record.marketName,
    state: record.state,
    macroScore,
    opportunityLevel,
    riskLevel,
    demandSignals: {
      populationGrowth: record.populationGrowth,
      jobGrowth: record.jobGrowth,
      affordabilityScore: record.affordabilityScore,
      rentalDemand: record.rentalDemand,
      investorActivity: record.investorActivity,
      distressOpportunity: record.distressOpportunity,
    },
    strengths,
    risks,
    recommendedFocus,
    confidenceScore,
    reasoning:
      `Synthetic macro market analysis selected ${record.marketName}, ${record.state} with a ${macroScore}/100 macro score. ` +
      `The score weights population growth, job growth, affordability, rental demand, investor activity, distress opportunity, and economic momentum, then subtracts a market-risk penalty. ` +
      `Opportunity is ${opportunityLevel} and risk is ${riskLevel}. ` +
      `This is read-only mock intelligence for pre-lead-targeting prioritization and requires human verification before use in live acquisition decisions.`,
  };
}
