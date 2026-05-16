import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { calculateBuyerScore, getBuyerTierFromActivities, type BuyerTier } from "@/lib/buyer-score";
import { prisma } from "@/lib/prisma";

export type DealDemandRecommendation = "pursue" | "medium" | "drop";
export type DealDemandRecommendedAction = "fast_track" | "send_to_buyers" | "hold" | "drop";
export type DealDemandGrade = "A" | "B" | "C" | "D";
export type DealPriorityBucket = "high" | "medium" | "low";
export type EstimatedDaysToClose = "3-7" | "7-10" | "10-14" | "14-30" | null;

export type DealDemandInput = {
  zip: string;
  price: number;
  propertyType: string;
};

export type DealDemandEvaluation = {
  demandMatch: boolean;
  matchedBuyerCount: number;
  matchedBuyerTiers: Record<BuyerTier, number>;
  liquidityScore: number;
  estimatedDaysToClose: EstimatedDaysToClose;
  profitConfidenceScore: number;
  executionScore: number;
  dealPriorityScore: number;
  priorityBucket: DealPriorityBucket;
  dealGrade: DealDemandGrade;
  recommendation: DealDemandRecommendation;
  recommendedAction: DealDemandRecommendedAction;
  riskReasons: string[];
  opportunityReasons: string[];
};

type BuyerProfile = {
  id: string;
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  activities: { eventType: string }[];
  buyerScore?: number;
};

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return String(item).trim().toLowerCase();
      }

      if (item && typeof item === "object" && "zip" in item) {
        return String(item.zip).trim().toLowerCase();
      }

      return "";
    })
    .filter(Boolean);
}

function priceMatches(price: number, min: number | null, max: number | null) {
  const aboveMin = min === null || price >= min;
  const belowMax = max === null || price <= max;

  return aboveMin && belowMax;
}

function buyerMatchesDeal(buyer: BuyerProfile, deal: DealDemandInput) {
  const preferredZips = asStringArray(buyer.preferredLocations);
  const propertyTypes = asStringArray(buyer.propertyTypes);
  const normalizedZip = deal.zip.trim().toLowerCase();
  const normalizedPropertyType = deal.propertyType.trim().toLowerCase();

  return (
    preferredZips.includes(normalizedZip) &&
    priceMatches(deal.price, buyer.priceRangeMin, buyer.priceRangeMax) &&
    propertyTypes.includes(normalizedPropertyType)
  );
}

function buyerZipMatchesDeal(buyer: BuyerProfile, deal: DealDemandInput) {
  return asStringArray(buyer.preferredLocations).includes(deal.zip.trim().toLowerCase());
}

function buyerPropertyTypeMatchesDeal(buyer: BuyerProfile, deal: DealDemandInput) {
  return asStringArray(buyer.propertyTypes).includes(deal.propertyType.trim().toLowerCase());
}

function getRecommendation(matchedBuyerCount: number, matchedBuyerTiers: Record<BuyerTier, number>): DealDemandRecommendation {
  if (matchedBuyerTiers.A >= 1 && matchedBuyerCount >= 3) {
    return "pursue";
  }

  if (matchedBuyerCount >= 2) {
    return "medium";
  }

  return "drop";
}

function getEstimatedDaysToClose(matchedBuyerCount: number, matchedBuyerTiers: Record<BuyerTier, number>): EstimatedDaysToClose {
  if (matchedBuyerCount === 0) {
    return null;
  }

  if (matchedBuyerTiers.A >= 2) {
    return "3-7";
  }

  if (matchedBuyerTiers.A >= 1 && matchedBuyerTiers.B >= 1) {
    return "7-10";
  }

  if (matchedBuyerTiers.B >= 1 && matchedBuyerTiers.A === 0) {
    return "10-14";
  }

  return "14-30";
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateProfitConfidenceScore({
  liquidityScore,
  matchedBuyerCount,
  matchedBuyerTiers,
  priceAligned,
  demandMatch,
}: {
  liquidityScore: number;
  matchedBuyerCount: number;
  matchedBuyerTiers: Record<BuyerTier, number>;
  priceAligned: boolean;
  demandMatch: boolean;
}) {
  const tierQualityScore = matchedBuyerCount === 0
    ? 0
    : ((matchedBuyerTiers.A * 100 + matchedBuyerTiers.B * 75 + matchedBuyerTiers.C * 45 + matchedBuyerTiers.D * 20) / matchedBuyerCount);

  return clampScore(
    Math.min(liquidityScore, 100) * 0.35 +
      tierQualityScore * 0.3 +
      (priceAligned ? 20 : 0) +
      (demandMatch ? 15 : 0),
  );
}

function calculateExecutionScore({
  matchedBuyerCount,
  matchedBuyerTiers,
  demandMatch,
  buyerActivityStrength,
}: {
  matchedBuyerCount: number;
  matchedBuyerTiers: Record<BuyerTier, number>;
  demandMatch: boolean;
  buyerActivityStrength: number;
}) {
  const buyerCountScore = Math.min(matchedBuyerCount * 15, 45);
  const topTierScore = Math.min(matchedBuyerTiers.A * 20 + matchedBuyerTiers.B * 10, 35);

  return clampScore(buyerCountScore + topTierScore + (demandMatch ? 10 : 0) + buyerActivityStrength * 0.1);
}

function calculateDealPriorityScore({
  executionScore,
  profitConfidenceScore,
  liquidityScore,
}: {
  executionScore: number;
  profitConfidenceScore: number;
  liquidityScore: number;
}) {
  return clampScore(executionScore * 0.4 + profitConfidenceScore * 0.4 + liquidityScore * 0.2);
}

function getPriorityBucket(dealPriorityScore: number): DealPriorityBucket {
  if (dealPriorityScore >= 80) {
    return "high";
  }

  if (dealPriorityScore >= 60) {
    return "medium";
  }

  return "low";
}

function getDealGrade({
  liquidityScore,
  matchedBuyerCount,
  matchedBuyerTiers,
  estimatedDaysToClose,
  profitConfidenceScore,
  executionScore,
}: {
  liquidityScore: number;
  matchedBuyerCount: number;
  matchedBuyerTiers: Record<BuyerTier, number>;
  estimatedDaysToClose: EstimatedDaysToClose;
  profitConfidenceScore: number;
  executionScore: number;
}): DealDemandGrade {
  if (
    matchedBuyerTiers.A >= 1 &&
    matchedBuyerCount >= 3 &&
    liquidityScore >= 50 &&
    (estimatedDaysToClose === "3-7" || estimatedDaysToClose === "7-10") &&
    profitConfidenceScore >= 70 &&
    executionScore >= 70
  ) {
    return "A";
  }

  if (matchedBuyerCount >= 2 && liquidityScore >= 30 && (matchedBuyerTiers.A + matchedBuyerTiers.B) >= 1) {
    return "B";
  }

  if (matchedBuyerCount >= 2) {
    return "C";
  }

  return "D";
}

function getRecommendedAction(dealGrade: DealDemandGrade, matchedBuyerTiers: Record<BuyerTier, number>): DealDemandRecommendedAction {
  if (dealGrade === "A" && matchedBuyerTiers.A >= 1) {
    return "fast_track";
  }

  if (dealGrade === "B") {
    return "send_to_buyers";
  }

  if (dealGrade === "C") {
    return "hold";
  }

  return "drop";
}

function getRiskReasons({
  matchedBuyerCount,
  matchedBuyerTiers,
  liquidityScore,
  priceAligned,
  propertyTypeInDemand,
}: {
  matchedBuyerCount: number;
  matchedBuyerTiers: Record<BuyerTier, number>;
  liquidityScore: number;
  priceAligned: boolean;
  propertyTypeInDemand: boolean;
}) {
  const reasons: string[] = [];

  if (matchedBuyerCount === 0) {
    reasons.push("no_matching_buyers");
  }

  if (matchedBuyerTiers.A === 0) {
    reasons.push("no_a_tier_buyers");
  }

  if (liquidityScore < 30) {
    reasons.push("low_liquidity");
  }

  if (!priceAligned) {
    reasons.push("price_outside_buyer_range");
  }

  if (!propertyTypeInDemand) {
    reasons.push("property_type_not_in_demand");
  }

  return reasons;
}

function getOpportunityReasons({
  matchedBuyerTiers,
  liquidityScore,
  zipInDemand,
  priceAligned,
  estimatedDaysToClose,
}: {
  matchedBuyerTiers: Record<BuyerTier, number>;
  liquidityScore: number;
  zipInDemand: boolean;
  priceAligned: boolean;
  estimatedDaysToClose: EstimatedDaysToClose;
}) {
  const reasons: string[] = [];

  if (matchedBuyerTiers.A >= 2) {
    reasons.push("multiple_a_tier_buyers");
  }

  if (zipInDemand) {
    reasons.push("strong_zip_demand");
  }

  if (priceAligned) {
    reasons.push("price_aligned_with_buyers");
  }

  if (liquidityScore >= 50) {
    reasons.push("high_liquidity");
  }

  if (estimatedDaysToClose === "3-7" || estimatedDaysToClose === "7-10") {
    reasons.push("fast_close_potential");
  }

  return reasons;
}

export async function evaluateDealDemand(deal: DealDemandInput): Promise<DealDemandEvaluation> {
  const buyers = await prisma.buyer.findMany({
    select: {
      id: true,
      preferredLocations: true,
      priceRangeMin: true,
      priceRangeMax: true,
      propertyTypes: true,
      activities: {
        select: {
          eventType: true,
        },
      },
    },
  });
  const demandSignals = await getBuyerDemandSignals();
  const matchedBuyers = buyers.filter((buyer) => buyerMatchesDeal(buyer, deal));

  const matchedBuyersWithScores = await Promise.all(
    matchedBuyers.map(async (buyer): Promise<BuyerProfile> => ({
      ...buyer,
      buyerScore: (await calculateBuyerScore(buyer.id, demandSignals)).score,
    })),
  );

  return evaluateDealDemandFromBuyerProfiles(deal, matchedBuyersWithScores, buyers);
}

export function evaluateDealDemandFromBuyerProfiles(
  deal: DealDemandInput,
  matchedBuyers: BuyerProfile[],
  allBuyers: BuyerProfile[] = matchedBuyers,
): DealDemandEvaluation {
  const matchedBuyerTiers: Record<BuyerTier, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  for (const buyer of matchedBuyers) {
    const tier = getBuyerTierFromActivities(buyer.activities);

    matchedBuyerTiers[tier] += 1;
  }

  const matchedBuyerCount = matchedBuyers.length;
  const liquidityScore = matchedBuyerCount * 10 + matchedBuyerTiers.A * 20 + matchedBuyerTiers.B * 10;
  const demandMatch = matchedBuyerCount >= 2;
  const estimatedDaysToClose = getEstimatedDaysToClose(matchedBuyerCount, matchedBuyerTiers);
  const priceAligned = allBuyers.some((buyer) => priceMatches(deal.price, buyer.priceRangeMin, buyer.priceRangeMax));
  const propertyTypeInDemand = allBuyers.some((buyer) => buyerPropertyTypeMatchesDeal(buyer, deal));
  const zipInDemand = allBuyers.some((buyer) => buyerZipMatchesDeal(buyer, deal));
  const buyerActivityStrength = matchedBuyerCount === 0
    ? 0
    : matchedBuyers.reduce((total, buyer) => total + (buyer.buyerScore ?? 0), 0) / matchedBuyerCount;
  const profitConfidenceScore = calculateProfitConfidenceScore({
    liquidityScore,
    matchedBuyerCount,
    matchedBuyerTiers,
    priceAligned,
    demandMatch,
  });
  const executionScore = calculateExecutionScore({
    matchedBuyerCount,
    matchedBuyerTiers,
    demandMatch,
    buyerActivityStrength,
  });
  const dealPriorityScore = calculateDealPriorityScore({
    executionScore,
    profitConfidenceScore,
    liquidityScore,
  });
  const dealGrade = getDealGrade({
    liquidityScore,
    matchedBuyerCount,
    matchedBuyerTiers,
    estimatedDaysToClose,
    profitConfidenceScore,
    executionScore,
  });

  return {
    demandMatch,
    matchedBuyerCount,
    matchedBuyerTiers,
    liquidityScore,
    recommendation: getRecommendation(matchedBuyerCount, matchedBuyerTiers),
    estimatedDaysToClose,
    profitConfidenceScore,
    executionScore,
    dealPriorityScore,
    priorityBucket: getPriorityBucket(dealPriorityScore),
    dealGrade,
    recommendedAction: getRecommendedAction(dealGrade, matchedBuyerTiers),
    riskReasons: getRiskReasons({
      matchedBuyerCount,
      matchedBuyerTiers,
      liquidityScore,
      priceAligned,
      propertyTypeInDemand,
    }),
    opportunityReasons: getOpportunityReasons({
      matchedBuyerTiers,
      liquidityScore,
      zipInDemand,
      priceAligned,
      estimatedDaysToClose,
    }),
  };
}
