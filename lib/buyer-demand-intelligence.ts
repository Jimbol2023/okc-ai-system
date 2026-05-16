export type RehabTolerance = "low" | "medium" | "high";

export type BuyerDemandProfileInput = {
  location?: string;
  assetType?: string;
};

export type BuyerDemandPriceRange = {
  min: number;
  max: number;
};

export type BuyerDemandProfile = {
  targetPropertyTypes: string[];
  targetPriceRanges: BuyerDemandPriceRange[];
  preferredLocations: string[];
  rehabTolerance: RehabTolerance;
  targetROI: number;
  demandScore: number;
  confidenceScore: number;
  reasoning: string;
};

type SyntheticBuyerDemandRecord = {
  preferredPropertyType: string;
  priceRange: BuyerDemandPriceRange;
  location: string;
  rehabTolerance: RehabTolerance;
  roiExpectation: number;
};

type SyntheticDealRecord = {
  propertyType: string;
  price: number;
  location: string;
  rehabLevel: RehabTolerance;
};

const buyers: SyntheticBuyerDemandRecord[] = [
  {
    preferredPropertyType: "single_family",
    priceRange: { min: 70000, max: 160000 },
    location: "oklahoma_city",
    rehabTolerance: "high",
    roiExpectation: 0.22,
  },
  {
    preferredPropertyType: "single_family",
    priceRange: { min: 90000, max: 190000 },
    location: "oklahoma_city",
    rehabTolerance: "medium",
    roiExpectation: 0.19,
  },
  {
    preferredPropertyType: "single_family",
    priceRange: { min: 60000, max: 140000 },
    location: "midwest_city",
    rehabTolerance: "high",
    roiExpectation: 0.24,
  },
  {
    preferredPropertyType: "small_multifamily",
    priceRange: { min: 160000, max: 420000 },
    location: "oklahoma_city",
    rehabTolerance: "medium",
    roiExpectation: 0.16,
  },
  {
    preferredPropertyType: "single_family",
    priceRange: { min: 80000, max: 175000 },
    location: "del_city",
    rehabTolerance: "medium",
    roiExpectation: 0.2,
  },
  {
    preferredPropertyType: "land",
    priceRange: { min: 15000, max: 85000 },
    location: "edmond",
    rehabTolerance: "low",
    roiExpectation: 0.18,
  },
  {
    preferredPropertyType: "small_multifamily",
    priceRange: { min: 180000, max: 500000 },
    location: "midwest_city",
    rehabTolerance: "medium",
    roiExpectation: 0.15,
  },
  {
    preferredPropertyType: "single_family",
    priceRange: { min: 65000, max: 150000 },
    location: "warr_acres",
    rehabTolerance: "high",
    roiExpectation: 0.23,
  },
  {
    preferredPropertyType: "rental_ready_single_family",
    priceRange: { min: 110000, max: 220000 },
    location: "oklahoma_city",
    rehabTolerance: "low",
    roiExpectation: 0.14,
  },
  {
    preferredPropertyType: "single_family",
    priceRange: { min: 75000, max: 170000 },
    location: "del_city",
    rehabTolerance: "high",
    roiExpectation: 0.21,
  },
];

const deals: SyntheticDealRecord[] = [
  {
    propertyType: "single_family",
    price: 120000,
    location: "oklahoma_city",
    rehabLevel: "medium",
  },
  {
    propertyType: "single_family",
    price: 95000,
    location: "midwest_city",
    rehabLevel: "high",
  },
  {
    propertyType: "small_multifamily",
    price: 260000,
    location: "oklahoma_city",
    rehabLevel: "medium",
  },
  {
    propertyType: "land",
    price: 45000,
    location: "edmond",
    rehabLevel: "low",
  },
  {
    propertyType: "single_family",
    price: 145000,
    location: "del_city",
    rehabLevel: "high",
  },
];

function normalize(value?: string) {
  return value?.trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_") ?? "";
}

function countBy<T extends string>(items: T[]) {
  return items.reduce<Record<T, number>>((counts, item) => {
    counts[item] = (counts[item] ?? 0) + 1;

    return counts;
  }, {} as Record<T, number>);
}

function sortCountEntries<T extends string>(counts: Record<T, number>) {
  return Object.entries(counts)
    .sort(([, leftCount], [, rightCount]) => Number(rightCount) - Number(leftCount))
    .map(([value]) => value as T);
}

function average(values: number[]) {
  if (values.length === 0) return 0;

  return values.reduce((total, value) => total + value, 0) / values.length;
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;

  return Math.round(value * multiplier) / multiplier;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function rangesOverlap(left: BuyerDemandPriceRange, right: BuyerDemandPriceRange) {
  return left.min <= right.max && right.min <= left.max;
}

function mergeCommonRanges(records: SyntheticBuyerDemandRecord[]) {
  const groupedRanges = records.reduce<BuyerDemandPriceRange[]>((ranges, buyer) => {
    const existingRange = ranges.find((range) => rangesOverlap(range, buyer.priceRange));

    if (!existingRange) {
      ranges.push({ ...buyer.priceRange });
      return ranges;
    }

    existingRange.min = Math.round((existingRange.min + buyer.priceRange.min) / 2);
    existingRange.max = Math.round((existingRange.max + buyer.priceRange.max) / 2);

    return ranges;
  }, []);

  return groupedRanges
    .sort((left, right) => left.min - right.min)
    .slice(0, 3);
}

function getMode<T extends string>(items: T[], fallback: T) {
  const counts = countBy(items);
  const [mode] = sortCountEntries(counts);

  return mode ?? fallback;
}

function getComparableDealAlignment(records: SyntheticBuyerDemandRecord[]) {
  if (records.length === 0 || deals.length === 0) return 0;

  const alignedDeals = deals.filter((deal) =>
    records.some((buyer) =>
      buyer.preferredPropertyType === deal.propertyType &&
      buyer.location === deal.location &&
      deal.price >= buyer.priceRange.min &&
      deal.price <= buyer.priceRange.max &&
      buyer.rehabTolerance === deal.rehabLevel,
    ),
  );

  return alignedDeals.length / deals.length;
}

function filterBuyers(input?: BuyerDemandProfileInput) {
  const location = normalize(input?.location);
  const assetType = normalize(input?.assetType);
  const filtered = buyers.filter((buyer) => {
    const locationMatches = !location || normalize(buyer.location) === location;
    const assetTypeMatches = !assetType || normalize(buyer.preferredPropertyType) === assetType;

    return locationMatches && assetTypeMatches;
  });

  return filtered.length > 0 ? filtered : buyers;
}

function calculateDemandScore(records: SyntheticBuyerDemandRecord[], input?: BuyerDemandProfileInput) {
  const filteredShare = records.length / buyers.length;
  const propertyCounts = countBy(records.map((buyer) => buyer.preferredPropertyType));
  const locationCounts = countBy(records.map((buyer) => buyer.location));
  const strongestPropertyShare = Math.max(...Object.values(propertyCounts)) / records.length;
  const strongestLocationShare = Math.max(...Object.values(locationCounts)) / records.length;
  const comparableDealAlignment = getComparableDealAlignment(records);
  const inputAlignment =
    (input?.location ? 0.12 : 0) +
    (input?.assetType ? 0.12 : 0);

  return clamp(
    Math.round(
      filteredShare * 30 +
      strongestPropertyShare * 25 +
      strongestLocationShare * 20 +
      comparableDealAlignment * 15 +
      inputAlignment * 100,
    ),
    0,
    100,
  );
}

function calculateConfidenceScore(records: SyntheticBuyerDemandRecord[]) {
  const propertyCounts = countBy(records.map((buyer) => buyer.preferredPropertyType));
  const locationCounts = countBy(records.map((buyer) => buyer.location));
  const rehabCounts = countBy(records.map((buyer) => buyer.rehabTolerance));
  const propertyConsistency = Math.max(...Object.values(propertyCounts)) / records.length;
  const locationConsistency = Math.max(...Object.values(locationCounts)) / records.length;
  const rehabConsistency = Math.max(...Object.values(rehabCounts)) / records.length;
  const sampleSizeConfidence = clamp(records.length / 8, 0, 1);

  return round(
    clamp(
      sampleSizeConfidence * 0.35 +
      propertyConsistency * 0.25 +
      locationConsistency * 0.2 +
      rehabConsistency * 0.2,
      0,
      1,
    ),
  );
}

export function getBuyerDemandProfile(input?: BuyerDemandProfileInput): BuyerDemandProfile {
  const matchingBuyers = filterBuyers(input);
  const propertyTypes = sortCountEntries(countBy(matchingBuyers.map((buyer) => buyer.preferredPropertyType))).slice(0, 4);
  const preferredLocations = sortCountEntries(countBy(matchingBuyers.map((buyer) => buyer.location))).slice(0, 5);
  const rehabTolerance = getMode(matchingBuyers.map((buyer) => buyer.rehabTolerance), "medium");
  const targetROI = round(average(matchingBuyers.map((buyer) => buyer.roiExpectation)));
  const demandScore = calculateDemandScore(matchingBuyers, input);
  const confidenceScore = calculateConfidenceScore(matchingBuyers);
  const targetPriceRanges = mergeCommonRanges(matchingBuyers);
  const inputNotes = [
    input?.assetType ? `asset type filter ${normalize(input.assetType)}` : "",
    input?.location ? `location filter ${normalize(input.location)}` : "",
  ].filter(Boolean);

  return {
    targetPropertyTypes: propertyTypes,
    targetPriceRanges,
    preferredLocations,
    rehabTolerance,
    targetROI,
    demandScore,
    confidenceScore,
    reasoning:
      `Synthetic buyer demand analysis found ${matchingBuyers.length} matching buyer profile(s). ` +
      `${propertyTypes[0] ?? "unknown"} has the strongest property-type demand, ` +
      `${preferredLocations[0] ?? "unknown"} has the strongest location demand, and the dominant rehab tolerance is ${rehabTolerance}. ` +
      `Target ROI is estimated from buyer expectations at ${Math.round(targetROI * 100)}%. ` +
      `Demand score weighs buyer frequency, property/location concentration, comparable synthetic deal alignment, and ${inputNotes.length > 0 ? inputNotes.join(" plus ") : "general market fit"}.`,
  };
}
