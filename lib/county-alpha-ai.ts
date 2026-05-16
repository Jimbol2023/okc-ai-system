export type CountyAlphaOpportunityLevel = "low" | "medium" | "high" | "elite";

export type CountyAlphaCompetitionLevel = "low" | "medium" | "high";

export type CountyAlphaStrategy =
  | "wholesale"
  | "land_flip"
  | "buy_and_hold"
  | "BRRRR"
  | "creative_finance"
  | "luxury"
  | "multifamily"
  | "rental"
  | "development";

export type CountyAlphaProfileInput = {
  county?: string;
  state?: string;
  assetType?: string;
};

export type CountyAlphaProfile = {
  countyName: string;
  state: string;
  alphaScore: number;
  opportunityLevel: CountyAlphaOpportunityLevel;
  competitionLevel: CountyAlphaCompetitionLevel;
  investorFriendliness: number;
  distressLevel: number;
  rentalStrength: number;
  acquisitionDifficulty: number;
  demandAlignment: number;
  strengths: string[];
  risks: string[];
  recommendedStrategies: CountyAlphaStrategy[];
  confidenceScore: number;
  reasoning: string;
};

type SyntheticCountyRecord = {
  countyName: string;
  state: string;
  investorCompetition: number;
  distressScore: number;
  rentalDemand: number;
  landlordFriendliness: number;
  acquisitionDifficulty: number;
  appreciationTrend: number;
  inventoryPressure: number;
  investorSaturation: number;
  populationMovement: number;
  affordabilityPressure: number;
  assetDemand: Record<string, number>;
  riskFactors: string[];
};

const syntheticCountyData: SyntheticCountyRecord[] = [
  {
    countyName: "Oklahoma County",
    state: "OK",
    investorCompetition: 66,
    distressScore: 74,
    rentalDemand: 78,
    landlordFriendliness: 76,
    acquisitionDifficulty: 52,
    appreciationTrend: 64,
    inventoryPressure: 69,
    investorSaturation: 62,
    populationMovement: 72,
    affordabilityPressure: 42,
    assetDemand: {
      single_family: 84,
      small_multifamily: 72,
      land: 50,
      rental: 80,
      commercial: 48,
    },
    riskFactors: ["Investor competition can compress wholesale spreads.", "Older housing stock can create repair estimate variance."],
  },
  {
    countyName: "Tulsa County",
    state: "OK",
    investorCompetition: 58,
    distressScore: 76,
    rentalDemand: 72,
    landlordFriendliness: 74,
    acquisitionDifficulty: 48,
    appreciationTrend: 58,
    inventoryPressure: 71,
    investorSaturation: 55,
    populationMovement: 61,
    affordabilityPressure: 38,
    assetDemand: {
      single_family: 76,
      small_multifamily: 68,
      land: 54,
      rental: 73,
      commercial: 45,
    },
    riskFactors: ["Neighborhood-level demand varies sharply.", "Some older properties may require deeper rehab diligence."],
  },
  {
    countyName: "Cleveland County",
    state: "OK",
    investorCompetition: 61,
    distressScore: 55,
    rentalDemand: 74,
    landlordFriendliness: 72,
    acquisitionDifficulty: 57,
    appreciationTrend: 70,
    inventoryPressure: 58,
    investorSaturation: 59,
    populationMovement: 76,
    affordabilityPressure: 50,
    assetDemand: {
      single_family: 78,
      small_multifamily: 58,
      land: 60,
      rental: 72,
      development: 66,
    },
    riskFactors: ["Stronger owner-occupant demand can make discounts harder to find.", "University and commuter submarkets require localized rent validation."],
  },
  {
    countyName: "Canadian County",
    state: "OK",
    investorCompetition: 64,
    distressScore: 45,
    rentalDemand: 69,
    landlordFriendliness: 70,
    acquisitionDifficulty: 63,
    appreciationTrend: 78,
    inventoryPressure: 50,
    investorSaturation: 61,
    populationMovement: 84,
    affordabilityPressure: 56,
    assetDemand: {
      single_family: 74,
      land: 75,
      development: 78,
      luxury: 64,
      rental: 65,
    },
    riskFactors: ["Lower distress levels may reduce deep-discount lead volume.", "Growth submarkets may price quickly when quality inventory appears."],
  },
  {
    countyName: "Dallas County",
    state: "TX",
    investorCompetition: 86,
    distressScore: 53,
    rentalDemand: 86,
    landlordFriendliness: 58,
    acquisitionDifficulty: 78,
    appreciationTrend: 76,
    inventoryPressure: 48,
    investorSaturation: 88,
    populationMovement: 82,
    affordabilityPressure: 74,
    assetDemand: {
      single_family: 78,
      small_multifamily: 82,
      rental: 86,
      luxury: 72,
      development: 68,
    },
    riskFactors: ["High investor saturation can reduce assignment margins.", "Affordability pressure raises exit-price sensitivity."],
  },
  {
    countyName: "Johnson County",
    state: "KS",
    investorCompetition: 68,
    distressScore: 39,
    rentalDemand: 71,
    landlordFriendliness: 66,
    acquisitionDifficulty: 70,
    appreciationTrend: 74,
    inventoryPressure: 44,
    investorSaturation: 64,
    populationMovement: 79,
    affordabilityPressure: 62,
    assetDemand: {
      single_family: 70,
      luxury: 76,
      rental: 68,
      development: 72,
      small_multifamily: 60,
    },
    riskFactors: ["Lower distress levels can limit wholesale acquisition volume.", "Higher acquisition difficulty requires sharper direct-to-seller targeting."],
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

function findCounty(input?: CountyAlphaProfileInput) {
  const county = normalize(input?.county).replace("_county", "");
  const state = normalize(input?.state);
  const exactMatch = syntheticCountyData.find((record) => {
    const recordCounty = normalize(record.countyName).replace("_county", "");
    const countyMatches = !county || recordCounty === county;
    const stateMatches = !state || normalize(record.state) === state;

    return countyMatches && stateMatches;
  });

  if (exactMatch) {
    return {
      record: exactMatch,
      matchQuality: county ? 1 : 0.84,
    };
  }

  const stateMatch = syntheticCountyData.find((record) => state && normalize(record.state) === state);

  if (stateMatch) {
    return {
      record: stateMatch,
      matchQuality: 0.72,
    };
  }

  return {
    record: syntheticCountyData[0],
    matchQuality: 0.65,
  };
}

function getDemandAlignment(record: SyntheticCountyRecord, assetType?: string) {
  const normalizedAssetType = normalize(assetType);

  if (!normalizedAssetType) {
    const values = Object.values(record.assetDemand);

    return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
  }

  return record.assetDemand[normalizedAssetType] ?? record.assetDemand.single_family ?? 60;
}

function calculateCompetitionPressure(record: SyntheticCountyRecord) {
  return Math.round(record.investorCompetition * 0.58 + record.investorSaturation * 0.42);
}

function calculateAcquisitionDifficulty(record: SyntheticCountyRecord) {
  const competitionPressure = calculateCompetitionPressure(record);
  const affordabilityFriction = record.affordabilityPressure;

  return clamp(
    Math.round(record.acquisitionDifficulty * 0.5 + competitionPressure * 0.28 + affordabilityFriction * 0.22),
    0,
    100,
  );
}

function calculateAlphaScore(record: SyntheticCountyRecord, demandAlignment: number, acquisitionDifficulty: number) {
  const affordabilityOpportunity = 100 - record.affordabilityPressure;
  const competitionPenalty = calculateCompetitionPressure(record);
  const rawScore =
    record.distressScore * 0.18 +
    record.rentalDemand * 0.14 +
    record.landlordFriendliness * 0.11 +
    record.appreciationTrend * 0.1 +
    record.inventoryPressure * 0.08 +
    record.populationMovement * 0.1 +
    affordabilityOpportunity * 0.1 +
    demandAlignment * 0.15 -
    competitionPenalty * 0.08 -
    acquisitionDifficulty * 0.08 +
    12;

  return clamp(Math.round(rawScore), 0, 100);
}

function getOpportunityLevel(alphaScore: number): CountyAlphaOpportunityLevel {
  if (alphaScore >= 85) return "elite";
  if (alphaScore >= 70) return "high";
  if (alphaScore >= 50) return "medium";

  return "low";
}

function getCompetitionLevel(record: SyntheticCountyRecord): CountyAlphaCompetitionLevel {
  const competitionPressure = calculateCompetitionPressure(record);

  if (competitionPressure >= 75) return "high";
  if (competitionPressure >= 50) return "medium";

  return "low";
}

function getStrengths(record: SyntheticCountyRecord, demandAlignment: number) {
  return [
    ...(record.distressScore >= 70 ? ["Distress levels support off-market acquisition opportunities."] : []),
    ...(record.rentalDemand >= 70 ? ["Rental demand supports landlord, BRRRR, and buy-and-hold exits."] : []),
    ...(record.landlordFriendliness >= 70 ? ["Landlord friendliness improves rental strategy viability."] : []),
    ...(record.appreciationTrend >= 70 ? ["Appreciation trend supports longer-term portfolio upside."] : []),
    ...(record.populationMovement >= 70 ? ["Population movement supports housing demand and exit liquidity."] : []),
    ...(record.inventoryPressure >= 65 ? ["Inventory pressure may create motivated-seller targeting angles."] : []),
    ...(demandAlignment >= 75 ? ["Asset-type demand alignment is strong for the selected focus."] : []),
  ];
}

function getRisks(record: SyntheticCountyRecord, acquisitionDifficulty: number) {
  return [
    ...record.riskFactors,
    ...(calculateCompetitionPressure(record) >= 75 ? ["Investor competition is high and may compress spreads."] : []),
    ...(record.distressScore < 50 ? ["Lower distress pressure may reduce deep-discount volume."] : []),
    ...(acquisitionDifficulty >= 70 ? ["Acquisition difficulty is elevated and requires sharper targeting discipline."] : []),
    ...(record.affordabilityPressure >= 70 ? ["Affordability pressure may limit end-buyer depth at higher prices."] : []),
  ];
}

function getRecommendedStrategies(record: SyntheticCountyRecord, demandAlignment: number, assetType?: string): CountyAlphaStrategy[] {
  const normalizedAssetType = normalize(assetType);
  const strategies = new Set<CountyAlphaStrategy>();

  if (record.distressScore >= 65 && calculateCompetitionPressure(record) < 78) strategies.add("wholesale");
  if (record.rentalDemand >= 70 && record.landlordFriendliness >= 65) strategies.add("buy_and_hold");
  if (record.rentalDemand >= 72 && record.distressScore >= 60) strategies.add("BRRRR");
  if (record.affordabilityPressure >= 58 || record.acquisitionDifficulty >= 65) strategies.add("creative_finance");
  if ((record.assetDemand.land ?? 0) >= 70 || normalizedAssetType === "land") strategies.add("land_flip");
  if ((record.assetDemand.development ?? 0) >= 70 || normalizedAssetType === "development") strategies.add("development");
  if ((record.assetDemand.luxury ?? 0) >= 70 || normalizedAssetType === "luxury") strategies.add("luxury");
  if ((record.assetDemand.small_multifamily ?? 0) >= 68 || normalizedAssetType.includes("multifamily")) strategies.add("multifamily");
  if ((record.assetDemand.rental ?? 0) >= 70 || demandAlignment >= 75) strategies.add("rental");

  return strategies.size > 0 ? [...strategies] : ["wholesale"];
}

function calculateConfidenceScore(record: SyntheticCountyRecord, demandAlignment: number, matchQuality: number) {
  const signalValues = [
    record.distressScore,
    record.rentalDemand,
    record.landlordFriendliness,
    record.appreciationTrend,
    record.populationMovement,
    demandAlignment,
  ];
  const signalSpread = Math.max(...signalValues) - Math.min(...signalValues);
  const consistencyScore = 1 - clamp(signalSpread / 100, 0, 1);

  return round(clamp(matchQuality * 0.52 + consistencyScore * 0.32 + 0.16, 0, 1));
}

export function getCountyAlphaProfile(input?: CountyAlphaProfileInput): CountyAlphaProfile {
  const { record, matchQuality } = findCounty(input);
  const demandAlignment = getDemandAlignment(record, input?.assetType);
  const acquisitionDifficulty = calculateAcquisitionDifficulty(record);
  const alphaScore = calculateAlphaScore(record, demandAlignment, acquisitionDifficulty);
  const opportunityLevel = getOpportunityLevel(alphaScore);
  const competitionLevel = getCompetitionLevel(record);
  const strengths = getStrengths(record, demandAlignment);
  const risks = getRisks(record, acquisitionDifficulty);
  const recommendedStrategies = getRecommendedStrategies(record, demandAlignment, input?.assetType);
  const confidenceScore = calculateConfidenceScore(record, demandAlignment, matchQuality);

  return {
    countyName: record.countyName,
    state: record.state,
    alphaScore,
    opportunityLevel,
    competitionLevel,
    investorFriendliness: record.landlordFriendliness,
    distressLevel: record.distressScore,
    rentalStrength: record.rentalDemand,
    acquisitionDifficulty,
    demandAlignment,
    strengths,
    risks,
    recommendedStrategies,
    confidenceScore,
    reasoning:
      `Synthetic county alpha analysis selected ${record.countyName}, ${record.state} with a ${alphaScore}/100 alpha score. ` +
      `The score balances distress opportunity, rental strength, landlord friendliness, appreciation trend, population movement, inventory pressure, affordability opportunity, selected-asset demand alignment, competition pressure, and acquisition difficulty. ` +
      `Opportunity is ${opportunityLevel}, competition is ${competitionLevel}, and recommended strategy focus is ${recommendedStrategies.join(", ")}. ` +
      `This is deterministic read-only county intelligence for pre-lead-generation targeting and requires human verification before live acquisition decisions.`,
  };
}
