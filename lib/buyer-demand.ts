import { prisma } from "@/lib/prisma";
import { getBuyerTierFromActivities, type BuyerTier } from "@/lib/buyer-score";

type RankedSignal = {
  label: string;
  count: number;
};

export type BuyerDemandSignals = {
  hotZips: RankedSignal[];
  hotPriceRanges: RankedSignal[];
  hotPropertyTypes: RankedSignal[];
  byBuyerTier: Record<BuyerTier, number>;
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

function addWeightedCount(map: Map<string, number>, label: string, weight: number) {
  map.set(label, (map.get(label) ?? 0) + weight);
}

function rankSignals(map: Map<string, number>, limit = 5): RankedSignal[] {
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
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

export async function getBuyerDemandSignals(): Promise<BuyerDemandSignals> {
  const buyers = await prisma.buyer.findMany({
    select: {
      preferredLocations: true,
      priceRangeMin: true,
      priceRangeMax: true,
      propertyTypes: true,
      activities: {
        select: { id: true, eventType: true },
      },
    },
  });

  const zipCounts = new Map<string, number>();
  const priceRangeCounts = new Map<string, number>();
  const propertyTypeCounts = new Map<string, number>();
  const byBuyerTier: Record<BuyerTier, number> = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  for (const buyer of buyers) {
    const tier = getBuyerTierFromActivities(buyer.activities);
    byBuyerTier[tier] += 1;

    const weight = buyer.activities.length;

    if (weight === 0) {
      continue;
    }

    for (const zip of asStringArray(buyer.preferredLocations)) {
      addWeightedCount(zipCounts, zip, weight);
    }

    const priceRange = formatPriceRange(buyer.priceRangeMin, buyer.priceRangeMax);

    if (priceRange) {
      addWeightedCount(priceRangeCounts, priceRange, weight);
    }

    for (const propertyType of asStringArray(buyer.propertyTypes)) {
      addWeightedCount(propertyTypeCounts, propertyType, weight);
    }
  }

  return {
    hotZips: rankSignals(zipCounts),
    hotPriceRanges: rankSignals(priceRangeCounts),
    hotPropertyTypes: rankSignals(propertyTypeCounts),
    byBuyerTier,
  };
}
