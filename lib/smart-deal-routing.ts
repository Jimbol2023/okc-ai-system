import { evaluateDealDemand, type DealDemandInput } from "@/lib/deal-demand-gate";
import { calculateBuyerActivityScore } from "@/lib/buyer-activity-score";
import { prisma } from "@/lib/prisma";

type RoutingStatus = "ready_to_route" | "needs_review" | "not_enough_buyers" | "do_not_route";
type NextRecommendedAction = "review_and_prepare_buyer_list" | "review_manually" | "build_buyer_demand" | "do_not_route";

type RecommendedBuyer = {
  buyerId: string;
  name: string;
  tier: "A" | "B" | "C" | "D";
  buyerQualityScore: number;
  buyerRoutingScore: number;
  matchReasons: string[];
  riskReasons: string[];
};

export type DealRoutingPreview = {
  routingStatus: RoutingStatus;
  dealPriorityScore: number;
  recommendedBuyerCount: number;
  recommendedBuyers: RecommendedBuyer[];
  routingReasons: string[];
  riskWarnings: string[];
  nextRecommendedAction: NextRecommendedAction;
};

type BuyerRoutingProfile = {
  id: string;
  name: string;
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  financingType: string | null;
  tier: "A" | "B" | "C" | "D";
  buyerQualityScore: number;
  isActive: boolean;
  meaningfulActivityCount: number;
  lastMeaningfulActivityAt: Date | null;
  activities: { eventType: string; createdAt: Date }[];
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
  return (min === null || price >= min) && (max === null || price <= max);
}

function getRecencyScore(lastMeaningfulActivityAt: Date | null, now = new Date()) {
  if (!lastMeaningfulActivityAt) {
    return 0;
  }

  const ageInDays = (now.getTime() - lastMeaningfulActivityAt.getTime()) / (24 * 60 * 60 * 1000);

  if (ageInDays <= 14) {
    return 100;
  }

  if (ageInDays <= 45) {
    return 70;
  }

  if (ageInDays <= 90) {
    return 35;
  }

  return 0;
}

function getMeaningfulActivityScore(buyer: BuyerRoutingProfile) {
  const activityScore = calculateBuyerActivityScore(buyer.activities);
  const hasClosed = buyer.activities.some((activity) => activity.eventType === "deal_closed");
  const hasOffer = buyer.activities.some((activity) => activity.eventType === "offer_made");
  const meaningfulActivityCount = Math.max(buyer.meaningfulActivityCount, activityScore.meaningfulActivityCount);
  const baseScore = Math.min(meaningfulActivityCount * 20, 70);

  return Math.min(100, baseScore + (hasOffer ? 15 : 0) + (hasClosed ? 20 : 0));
}

function getDemandMatchScore(buyer: BuyerRoutingProfile, deal: DealDemandInput) {
  const zips = asStringArray(buyer.preferredLocations);
  const propertyTypes = asStringArray(buyer.propertyTypes);
  let score = 0;

  if (zips.includes(deal.zip.trim().toLowerCase())) {
    score += 35;
  }

  if (priceMatches(deal.price, buyer.priceRangeMin, buyer.priceRangeMax)) {
    score += 35;
  }

  if (propertyTypes.includes(deal.propertyType.trim().toLowerCase())) {
    score += 30;
  }

  return score;
}

function getMatchReasons(buyer: BuyerRoutingProfile, deal: DealDemandInput) {
  const reasons: string[] = [];

  if (asStringArray(buyer.preferredLocations).includes(deal.zip.trim().toLowerCase())) {
    reasons.push("zip_match");
  }

  if (priceMatches(deal.price, buyer.priceRangeMin, buyer.priceRangeMax)) {
    reasons.push("price_range_match");
  }

  if (asStringArray(buyer.propertyTypes).includes(deal.propertyType.trim().toLowerCase())) {
    reasons.push("property_type_match");
  }

  if (buyer.tier === "A" || buyer.tier === "B") {
    reasons.push("strong_buyer_tier");
  }

  if (buyer.meaningfulActivityCount > 0) {
    reasons.push("meaningful_activity");
  }

  return reasons;
}

function getBuyerRiskReasons(buyer: BuyerRoutingProfile) {
  const reasons: string[] = [];

  if (!buyer.isActive) {
    reasons.push("inactive_buyer");
  }

  if (buyer.tier === "D") {
    reasons.push("d_tier_buyer");
  }

  if (Math.max(buyer.meaningfulActivityCount, calculateBuyerActivityScore(buyer.activities).meaningfulActivityCount) === 0) {
    reasons.push("no_meaningful_activity");
  }

  return reasons;
}

function getRoutingStatus(dealRecommendation: string, recommendedBuyers: RecommendedBuyer[]) {
  if (recommendedBuyers.length === 0) {
    return "not_enough_buyers" satisfies RoutingStatus;
  }

  if (dealRecommendation === "drop") {
    return "do_not_route" satisfies RoutingStatus;
  }

  const hasTopTierBuyer = recommendedBuyers.some((buyer) => buyer.tier === "A" || buyer.tier === "B");

  if (recommendedBuyers.length >= 3 && hasTopTierBuyer) {
    return "ready_to_route" satisfies RoutingStatus;
  }

  return "needs_review" satisfies RoutingStatus;
}

function getNextRecommendedAction(routingStatus: RoutingStatus): NextRecommendedAction {
  switch (routingStatus) {
    case "ready_to_route":
      return "review_and_prepare_buyer_list";
    case "needs_review":
      return "review_manually";
    case "not_enough_buyers":
      return "build_buyer_demand";
    case "do_not_route":
      return "do_not_route";
  }
}

export async function routeDealToBestBuyers(deal: DealDemandInput): Promise<DealRoutingPreview> {
  const [dealDemand, buyers] = await Promise.all([
    evaluateDealDemand(deal),
    prisma.buyer.findMany({
      select: {
        id: true,
        name: true,
        preferredLocations: true,
        priceRangeMin: true,
        priceRangeMax: true,
        propertyTypes: true,
        financingType: true,
        tier: true,
        buyerQualityScore: true,
        isActive: true,
        meaningfulActivityCount: true,
        lastMeaningfulActivityAt: true,
        activities: {
          select: {
            eventType: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  const recommendedBuyers = buyers
    .map((buyer) => {
      const demandMatchScore = getDemandMatchScore(buyer, deal);
      const activityScore = calculateBuyerActivityScore(buyer.activities);
      const meaningfulActivityScore = getMeaningfulActivityScore(buyer);
      const recencyScore = getRecencyScore(buyer.lastMeaningfulActivityAt ?? activityScore.lastMeaningfulActivityAt);
      const buyerRoutingScore = Math.round(
        buyer.buyerQualityScore * 0.35 +
          demandMatchScore * 0.3 +
          meaningfulActivityScore * 0.2 +
          recencyScore * 0.15,
      );

      return {
        buyerId: buyer.id,
        name: buyer.name,
        tier: buyer.tier,
        buyerQualityScore: buyer.buyerQualityScore,
        buyerRoutingScore,
        matchReasons: getMatchReasons(buyer, deal),
        riskReasons: getBuyerRiskReasons(buyer),
      };
    })
    .filter((buyer) => buyer.matchReasons.includes("zip_match") && buyer.matchReasons.includes("price_range_match") && buyer.matchReasons.includes("property_type_match"))
    .sort((a, b) => b.buyerRoutingScore - a.buyerRoutingScore)
    .slice(0, 10);
  const routingStatus = getRoutingStatus(dealDemand.recommendation, recommendedBuyers);
  const routingReasons = [
    `deal_priority_${dealDemand.dealPriorityScore}`,
    `matched_buyers_${recommendedBuyers.length}`,
  ];
  const riskWarnings = [...dealDemand.riskReasons];

  if (!recommendedBuyers.some((buyer) => buyer.tier === "A" || buyer.tier === "B")) {
    riskWarnings.push("no_a_b_tier_buyer");
  }

  if (recommendedBuyers.length < 3) {
    riskWarnings.push("limited_recommended_buyer_count");
  }

  return {
    routingStatus,
    dealPriorityScore: dealDemand.dealPriorityScore,
    recommendedBuyerCount: recommendedBuyers.length,
    recommendedBuyers,
    routingReasons,
    riskWarnings: [...new Set(riskWarnings)],
    nextRecommendedAction: getNextRecommendedAction(routingStatus),
  };
}
