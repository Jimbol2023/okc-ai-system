import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { calculateBuyerScore, getBuyerTierFromActivities, type BuyerTier } from "@/lib/buyer-score";
import { calculateBuyerQuality } from "@/lib/buyer-quality";
import { prisma } from "@/lib/prisma";

type ForecastStatus = "ready" | "not_enough_data";
type ConfidenceLevel = "low" | "medium" | "high";

type RankedForecastSignal = {
  label: string;
  score: number;
  buyerCount: number;
};

type DataSufficiency = {
  enoughData: boolean;
  buyerCount: number;
  activeBuyerCount: number;
  activityCount: number;
  reason: string;
};

type BuyerTierSignal = {
  activeCount: number;
  topZips: RankedForecastSignal[];
  topPropertyTypes: RankedForecastSignal[];
  priceRangeDemand: RankedForecastSignal[];
};

export type BuyerDemandForecast = {
  forecastStatus: ForecastStatus;
  confidenceLevel: ConfidenceLevel;
  dataSufficiency: DataSufficiency;
  predictedHotZips: RankedForecastSignal[];
  predictedHotPropertyTypes: RankedForecastSignal[];
  predictedPriceRanges: RankedForecastSignal[];
  buyerTierSignals: Record<BuyerTier, BuyerTierSignal>;
  riskWarnings: string[];
  recommendedNextActions: string[];
};

const EMPTY_TIER_SIGNALS: Record<BuyerTier, BuyerTierSignal> = {
  A: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
  B: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
  C: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
  D: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
};

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return String(item).trim();
      }

      if (item && typeof item === "object" && "zip" in item) {
        return String(item.zip).trim();
      }

      return "";
    })
    .filter(Boolean);
}

function formatPriceRange(min: number | null, max: number | null) {
  if (min === null && max === null) {
    return null;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "USD",
  });

  if (min !== null && max !== null) {
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  }

  if (min !== null) {
    return `${formatter.format(min)}+`;
  }

  return `Up to ${formatter.format(max ?? 0)}`;
}

function addSignal(map: Map<string, { score: number; buyers: Set<string> }>, label: string, buyerId: string, score: number) {
  const current = map.get(label) ?? { score: 0, buyers: new Set<string>() };

  current.score += score;
  current.buyers.add(buyerId);
  map.set(label, current);
}

function rankSignals(map: Map<string, { score: number; buyers: Set<string> }>, limit = 5): RankedForecastSignal[] {
  return [...map.entries()]
    .map(([label, value]) => ({
      label,
      score: Math.round(value.score),
      buyerCount: value.buyers.size,
    }))
    .sort((a, b) => b.score - a.score || b.buyerCount - a.buyerCount || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function getTierWeight(tier: BuyerTier) {
  switch (tier) {
    case "A":
      return 2;
    case "B":
      return 1.5;
    case "C":
      return 1;
    case "D":
      return 0.5;
  }
}

function getDataSufficiency({
  buyerCount,
  activeBuyerCount,
  activityCount,
  abTierBuyerCount,
}: {
  buyerCount: number;
  activeBuyerCount: number;
  activityCount: number;
  abTierBuyerCount: number;
}): DataSufficiency {
  if (buyerCount < 5) {
    return {
      enoughData: false,
      buyerCount,
      activeBuyerCount,
      activityCount,
      reason: "not_enough_buyers",
    };
  }

  if (activityCount < 10) {
    return {
      enoughData: false,
      buyerCount,
      activeBuyerCount,
      activityCount,
      reason: "not_enough_activity",
    };
  }

  if (abTierBuyerCount < 2) {
    return {
      enoughData: false,
      buyerCount,
      activeBuyerCount,
      activityCount,
      reason: "weak_a_b_tier_signal",
    };
  }

  if (activeBuyerCount < 2) {
    return {
      enoughData: false,
      buyerCount,
      activeBuyerCount,
      activityCount,
      reason: "not_enough_active_buyers",
    };
  }

  return {
    enoughData: true,
    buyerCount,
    activeBuyerCount,
    activityCount,
    reason: "enough_data",
  };
}

function getConfidenceLevel(dataSufficiency: DataSufficiency, abTierBuyerCount: number, activityCount: number) {
  if (!dataSufficiency.enoughData) {
    return "low" satisfies ConfidenceLevel;
  }

  if (abTierBuyerCount >= 4 && activityCount >= 25) {
    return "high" satisfies ConfidenceLevel;
  }

  return "medium" satisfies ConfidenceLevel;
}

function getRiskWarnings({
  dataSufficiency,
  abTierBuyerCount,
  predictedHotZips,
  predictedHotPropertyTypes,
  predictedPriceRanges,
}: {
  dataSufficiency: DataSufficiency;
  abTierBuyerCount: number;
  predictedHotZips: RankedForecastSignal[];
  predictedHotPropertyTypes: RankedForecastSignal[];
  predictedPriceRanges: RankedForecastSignal[];
}) {
  const warnings: string[] = [];

  if (dataSufficiency.buyerCount < 5) {
    warnings.push("not_enough_buyers");
  }

  if (dataSufficiency.activityCount < 10) {
    warnings.push("not_enough_activity");
  }

  if (abTierBuyerCount < 2) {
    warnings.push("weak_a_tier_signal");
  }

  if (predictedHotZips.length > 3 && predictedHotZips[0]?.score - predictedHotZips[2]?.score < 10) {
    warnings.push("demand_too_spread_out");
  }

  if (predictedPriceRanges.length === 0) {
    warnings.push("price_range_unclear");
  }

  if (predictedHotPropertyTypes.length === 0) {
    warnings.push("property_type_unclear");
  }

  return warnings;
}

function getRecommendedNextActions(dataSufficiency: DataSufficiency, riskWarnings: string[]) {
  if (!dataSufficiency.enoughData) {
    return [
      "Add more buyers",
      "Track buyer activity",
      "Collect buyer preferences",
    ];
  }

  const actions = ["Prioritize zip codes with repeated A/B-tier demand"];

  if (riskWarnings.includes("weak_a_tier_signal")) {
    actions.push("Add more A-tier buyers in OKC");
  }

  if (riskWarnings.includes("price_range_unclear")) {
    actions.push("Collect buyer price preferences");
  }

  if (riskWarnings.includes("not_enough_activity")) {
    actions.push("Track buyer responses before relying on prediction");
  }

  return actions;
}

function cloneEmptyTierSignals(): Record<BuyerTier, BuyerTierSignal> {
  return {
    A: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
    B: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
    C: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
    D: { activeCount: 0, topZips: [], topPropertyTypes: [], priceRangeDemand: [] },
  };
}

export async function generateBuyerDemandForecast(): Promise<BuyerDemandForecast> {
  const [buyers, demandSignals] = await Promise.all([
    prisma.buyer.findMany({
      select: {
        id: true,
        preferredLocations: true,
        priceRangeMin: true,
        priceRangeMax: true,
        propertyTypes: true,
        buyerQualityScore: true,
        tier: true,
        isActive: true,
        activityCount: true,
        lastActiveAt: true,
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          select: {
            eventType: true,
            createdAt: true,
          },
        },
      },
    }),
    getBuyerDemandSignals(),
  ]);
  const buyerScores = await Promise.all(
    buyers.map(async (buyer) => ({
      buyerId: buyer.id,
      score: await calculateBuyerScore(buyer.id, demandSignals),
      quality: await calculateBuyerQuality(buyer.id),
    })),
  );
  const buyerScoreMap = new Map(buyerScores.map((buyerScore) => [buyerScore.buyerId, buyerScore.score]));
  const buyerQualityMap = new Map(buyerScores.map((buyerScore) => [buyerScore.buyerId, buyerScore.quality]));
  const buyerTiers = buyers.map((buyer) => ({
    buyer,
    tier: buyerQualityMap.get(buyer.id)?.tier ?? getBuyerTierFromActivities(buyer.activities),
    score: buyerScoreMap.get(buyer.id)?.score ?? 0,
    quality: buyerQualityMap.get(buyer.id),
  }));
  const buyerCount = buyers.length;
  const activeBuyerCount = buyerTiers.filter((buyerTier) => buyerTier.quality?.isActive).length;
  const activityCount = buyerTiers.reduce((total, buyerTier) => total + (buyerTier.quality?.activityCount ?? 0), 0);
  const abTierBuyerCount = buyerTiers.filter((buyerTier) => buyerTier.tier === "A" || buyerTier.tier === "B").length;
  const dataSufficiency = getDataSufficiency({
    buyerCount,
    activeBuyerCount,
    activityCount,
    abTierBuyerCount,
  });
  const zipSignals = new Map<string, { score: number; buyers: Set<string> }>();
  const propertyTypeSignals = new Map<string, { score: number; buyers: Set<string> }>();
  const priceRangeSignals = new Map<string, { score: number; buyers: Set<string> }>();
  const tierMaps: Record<BuyerTier, {
    zips: Map<string, { score: number; buyers: Set<string> }>;
    propertyTypes: Map<string, { score: number; buyers: Set<string> }>;
    priceRanges: Map<string, { score: number; buyers: Set<string> }>;
  }> = {
    A: { zips: new Map(), propertyTypes: new Map(), priceRanges: new Map() },
    B: { zips: new Map(), propertyTypes: new Map(), priceRanges: new Map() },
    C: { zips: new Map(), propertyTypes: new Map(), priceRanges: new Map() },
    D: { zips: new Map(), propertyTypes: new Map(), priceRanges: new Map() },
  };
  const buyerTierSignals = cloneEmptyTierSignals();

  for (const { buyer, tier, score, quality } of buyerTiers) {
    const preferencesComplete = quality?.reasons.includes("complete_preferences") ?? false;
    const isInactiveDTier = tier === "D" && !quality?.isActive;
    const activeMultiplier = quality?.isActive ? 1 : 0.25;
    const preferenceMultiplier = preferencesComplete ? 1 : 0.5;
    const hasOfferOrClosedActivity = buyer.activities.some(
      (activity) => activity.eventType === "offer_made" || activity.eventType === "deal_closed",
    );
    const strongActivityMultiplier = hasOfferOrClosedActivity ? 1.5 : 1;
    const weight = isInactiveDTier
      ? 0
      : getTierWeight(tier) *
        Math.max(1, score / 25) *
        Math.max(1, quality?.activityCount ?? buyer.activityCount) *
        activeMultiplier *
        preferenceMultiplier *
        strongActivityMultiplier;
    const priceRange = formatPriceRange(buyer.priceRangeMin, buyer.priceRangeMax);

    if (quality?.isActive) {
      buyerTierSignals[tier].activeCount += 1;
    }

    if (weight === 0) {
      continue;
    }

    for (const zip of asStringArray(buyer.preferredLocations)) {
      addSignal(zipSignals, zip, buyer.id, weight);
      addSignal(tierMaps[tier].zips, zip, buyer.id, weight);
    }

    for (const propertyType of asStringArray(buyer.propertyTypes)) {
      addSignal(propertyTypeSignals, propertyType, buyer.id, weight);
      addSignal(tierMaps[tier].propertyTypes, propertyType, buyer.id, weight);
    }

    if (priceRange) {
      addSignal(priceRangeSignals, priceRange, buyer.id, weight);
      addSignal(tierMaps[tier].priceRanges, priceRange, buyer.id, weight);
    }
  }

  const predictedHotZips = rankSignals(zipSignals);
  const predictedHotPropertyTypes = rankSignals(propertyTypeSignals);
  const predictedPriceRanges = rankSignals(priceRangeSignals);

  for (const tier of ["A", "B", "C", "D"] as const) {
    buyerTierSignals[tier].topZips = rankSignals(tierMaps[tier].zips, 3);
    buyerTierSignals[tier].topPropertyTypes = rankSignals(tierMaps[tier].propertyTypes, 3);
    buyerTierSignals[tier].priceRangeDemand = rankSignals(tierMaps[tier].priceRanges, 3);
  }

  const riskWarnings = getRiskWarnings({
    dataSufficiency,
    abTierBuyerCount,
    predictedHotZips,
    predictedHotPropertyTypes,
    predictedPriceRanges,
  });
  const confidenceLevel = getConfidenceLevel(dataSufficiency, abTierBuyerCount, activityCount);

  if (!dataSufficiency.enoughData) {
    return {
      forecastStatus: "not_enough_data",
      confidenceLevel,
      dataSufficiency,
      predictedHotZips,
      predictedHotPropertyTypes,
      predictedPriceRanges,
      buyerTierSignals: EMPTY_TIER_SIGNALS,
      riskWarnings,
      recommendedNextActions: getRecommendedNextActions(dataSufficiency, riskWarnings),
    };
  }

  return {
    forecastStatus: "ready",
    confidenceLevel,
    dataSufficiency,
    predictedHotZips,
    predictedHotPropertyTypes,
    predictedPriceRanges,
    buyerTierSignals,
    riskWarnings,
    recommendedNextActions: getRecommendedNextActions(dataSufficiency, riskWarnings),
  };
}
