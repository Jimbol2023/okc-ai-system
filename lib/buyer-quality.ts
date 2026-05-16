import { prisma } from "@/lib/prisma";
import { calculateBuyerActivityScore } from "@/lib/buyer-activity-score";
import type { BuyerTier } from "@/lib/buyer-score";

export type BuyerQuality = {
  buyerQualityScore: number;
  tier: BuyerTier;
  lastActiveAt: Date | null;
  activityCount: number;
  meaningfulActivityCount: number;
  lastMeaningfulActivityAt: Date | null;
  isActive: boolean;
  reasons: string[];
};

type BuyerQualityProfile = {
  phone: string | null;
  email: string | null;
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  financingType: string | null;
  preferredDealSize: number | null;
  preferredCondition: string | null;
  activities: {
    eventType: string;
    createdAt: Date;
  }[];
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function hasCompletePreferences(buyer: BuyerQualityProfile) {
  return (
    asArray(buyer.preferredLocations).length > 0 &&
    asArray(buyer.propertyTypes).length > 0 &&
    buyer.priceRangeMin !== null &&
    buyer.priceRangeMax !== null
  );
}

function getLastActiveAt(activities: BuyerQualityProfile["activities"]) {
  return activities[0]?.createdAt ?? null;
}

function isRecent(date: Date | null, now = new Date()) {
  if (!date) {
    return false;
  }

  return now.getTime() - date.getTime() <= 45 * DAY_IN_MS;
}

function getTier({
  responseCount,
  requestedDetailsCount,
  offerCount,
  closedCount,
  activityScore,
  activityCount,
  preferencesComplete,
}: {
  responseCount: number;
  requestedDetailsCount: number;
  offerCount: number;
  closedCount: number;
  activityScore: number;
  activityCount: number;
  preferencesComplete: boolean;
}): BuyerTier {
  if (closedCount > 0 || (offerCount >= 2 && activityScore >= 50 && activityCount >= 4)) {
    return "A";
  }

  if (offerCount > 0 || requestedDetailsCount > 0 || responseCount >= 3 || activityScore >= 35) {
    return "B";
  }

  if (responseCount > 0) {
    return "C";
  }

  if (!preferencesComplete || activityCount === 0) {
    return "D";
  }

  return "D";
}

export function calculateBuyerQualityFromProfile(buyer: BuyerQualityProfile): BuyerQuality {
  const activities = [...buyer.activities].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const activityCount = activities.length;
  const activityScoreResult = calculateBuyerActivityScore(activities);
  const lastActiveAt = activityScoreResult.lastMeaningfulActivityAt ?? getLastActiveAt(activities);
  const responseCount = activities.filter((activity) => activity.eventType === "responded" || activity.eventType === "replied").length;
  const requestedDetailsCount = activities.filter((activity) => activity.eventType === "requested_details").length;
  const offerCount = activities.filter((activity) => activity.eventType === "offer_made").length;
  const closedCount = activities.filter((activity) => activity.eventType === "deal_closed").length;
  const openedCount = activities.filter((activity) => activity.eventType === "deal_opened" || activity.eventType === "deal_viewed").length;
  const clickCount = activities.filter((activity) => activity.eventType === "link_clicked").length;
  const inactiveEventCount = activities.filter((activity) => activity.eventType === "unsubscribed_or_inactive").length;
  const preferencesComplete = hasCompletePreferences(buyer);
  const contactComplete = Boolean(buyer.phone && buyer.email);
  const hasContactMethod = Boolean(buyer.phone || buyer.email);
  const active = inactiveEventCount === 0 && (isRecent(lastActiveAt) || responseCount > 0 || requestedDetailsCount > 0 || offerCount > 0 || closedCount > 0);
  const reasons: string[] = [];

  let buyerQualityScore = 0;

  if (hasContactMethod) {
    buyerQualityScore += 10;
    reasons.push("has_contact_method");
  }

  if (contactComplete) {
    buyerQualityScore += 10;
    reasons.push("complete_contact_info");
  }

  if (preferencesComplete) {
    buyerQualityScore += 20;
    reasons.push("complete_preferences");
  }

  buyerQualityScore += Math.min(responseCount * 10, 20);
  buyerQualityScore += Math.min(requestedDetailsCount * 12, 24);
  buyerQualityScore += Math.min(offerCount * 15, 30);
  buyerQualityScore += Math.min(closedCount * 25, 35);
  buyerQualityScore += Math.min(openedCount * 3, 9);
  buyerQualityScore += Math.min(clickCount * 4, 12);
  buyerQualityScore += Math.max(-25, Math.min(20, activityScoreResult.activityScore * 0.2));

  if (isRecent(lastActiveAt)) {
    buyerQualityScore += 10;
    reasons.push("recent_activity");
  }

  if (activityCount === 0) {
    reasons.push("no_activity");
  }

  if (activityScoreResult.activityScore > 0) {
    reasons.push("positive_weighted_activity");
  }

  if (inactiveEventCount > 0) {
    reasons.push("inactive_or_unsubscribed");
  }

  if (!preferencesComplete) {
    reasons.push("incomplete_preferences");
  }

  if (!contactComplete) {
    reasons.push("incomplete_contact_info");
  }

  const tier = getTier({
    responseCount,
    requestedDetailsCount,
    offerCount,
    closedCount,
    activityScore: activityScoreResult.activityScore,
    activityCount,
    preferencesComplete,
  });

  if (tier === "A") {
    reasons.push("a_tier_activity");
  } else if (tier === "B") {
    reasons.push("b_tier_activity");
  } else if (tier === "C") {
    reasons.push("responded_no_offer");
  } else {
    reasons.push("d_tier_unproven");
  }

  return {
    buyerQualityScore: Math.max(0, Math.min(100, Math.round(buyerQualityScore))),
    tier,
    lastActiveAt,
    activityCount,
    meaningfulActivityCount: activityScoreResult.meaningfulActivityCount,
    lastMeaningfulActivityAt: activityScoreResult.lastMeaningfulActivityAt,
    isActive: active,
    reasons,
  };
}

export async function calculateBuyerQuality(buyerId: string): Promise<BuyerQuality> {
  const buyer = await prisma.buyer.findUnique({
    where: { id: buyerId },
    select: {
      phone: true,
      email: true,
      preferredLocations: true,
      priceRangeMin: true,
      priceRangeMax: true,
      propertyTypes: true,
      financingType: true,
      preferredDealSize: true,
      preferredCondition: true,
      activities: {
        orderBy: { createdAt: "desc" },
        select: {
          eventType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!buyer) {
    return {
      buyerQualityScore: 0,
      tier: "D",
      lastActiveAt: null,
      activityCount: 0,
      meaningfulActivityCount: 0,
      lastMeaningfulActivityAt: null,
      isActive: false,
      reasons: ["buyer_not_found"],
    };
  }

  return calculateBuyerQualityFromProfile(buyer);
}

export async function refreshBuyerQuality(buyerId: string) {
  const quality = await calculateBuyerQuality(buyerId);

  await prisma.buyer.update({
    where: { id: buyerId },
    data: {
      buyerQualityScore: quality.buyerQualityScore,
      tier: quality.tier,
      lastActiveAt: quality.lastActiveAt,
      activityCount: quality.activityCount,
      meaningfulActivityCount: quality.meaningfulActivityCount,
      lastMeaningfulActivityAt: quality.lastMeaningfulActivityAt,
      isActive: quality.isActive,
      qualityReasons: quality.reasons,
    },
  });

  return quality;
}
