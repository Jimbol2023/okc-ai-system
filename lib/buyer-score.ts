import { prisma } from "@/lib/prisma";
import type { BuyerDemandSignals } from "@/lib/buyer-demand";

export type BuyerStatus = "active" | "warm" | "cold" | "dead";
export type BuyerTier = "A" | "B" | "C" | "D";

export type BuyerScore = {
  score: number;
  responseRate: number;
  offerRate: number;
  closeRate: number;
  recentActivityScore: number;
  avgDealSizeScore: number;
  demandAlignmentScore: number;
  matchReadinessScore: number;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const RECENT_ACTIVITY_WINDOW_DAYS = 14;

type BuyerActivitySnapshot = {
  eventType: string;
  createdAt: Date;
};

type BuyerScoringProfile = {
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  preferredDealSize: number | null;
  activities: BuyerActivitySnapshot[];
};

function toPercent(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

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

function calculateRecentActivityScore(activities: BuyerActivitySnapshot[], now = new Date()) {
  const recentActivityWeight = activities
    .filter((activity) => now.getTime() - activity.createdAt.getTime() <= RECENT_ACTIVITY_WINDOW_DAYS * DAY_IN_MS)
    .reduce((total, activity) => {
      switch (activity.eventType) {
        case "deal_closed":
          return total + 100;
        case "offer_made":
          return total + 70;
        case "responded":
          return total + 35;
        case "deal_opened":
          return total + 15;
        case "deal_sent":
          return total + 10;
        case "requested_details":
          return total + 50;
        case "replied":
          return total + 35;
        case "link_clicked":
          return total + 20;
        case "deal_viewed":
          return total + 10;
        case "deal_passed":
          return total - 5;
        case "unsubscribed_or_inactive":
          return total - 25;
        default:
          return total;
      }
    }, 0);

  return Math.min(100, recentActivityWeight);
}

function calculateAvgDealSizeScore(preferredDealSize: number | null) {
  if (!preferredDealSize || preferredDealSize <= 0) {
    return 0;
  }

  if (preferredDealSize >= 250000) {
    return 100;
  }

  if (preferredDealSize >= 150000) {
    return 80;
  }

  if (preferredDealSize >= 75000) {
    return 60;
  }

  return 40;
}

function calculateDemandAlignmentScore(
  buyer: Pick<BuyerScoringProfile, "preferredLocations" | "priceRangeMin" | "priceRangeMax" | "propertyTypes">,
  demandSignals?: BuyerDemandSignals,
) {
  if (!demandSignals) {
    return 0;
  }

  const buyerZips = new Set(asStringArray(buyer.preferredLocations));
  const buyerPropertyTypes = new Set(asStringArray(buyer.propertyTypes));
  const buyerPriceRange = formatPriceRange(buyer.priceRangeMin, buyer.priceRangeMax);

  const zipScore = demandSignals.hotZips.some((signal) => buyerZips.has(signal.label)) ? 8 : 0;
  const propertyTypeScore = demandSignals.hotPropertyTypes.some((signal) => buyerPropertyTypes.has(signal.label)) ? 6 : 0;
  const priceRangeScore = buyerPriceRange && demandSignals.hotPriceRanges.some((signal) => signal.label === buyerPriceRange) ? 6 : 0;

  return zipScore + propertyTypeScore + priceRangeScore;
}

export function getBuyerTierFromActivities(activities: Pick<BuyerActivitySnapshot, "eventType">[]): BuyerTier {
  if (activities.some((activity) => activity.eventType === "deal_closed")) {
    return "A";
  }

  if (activities.some((activity) => activity.eventType === "offer_made")) {
    return "B";
  }

  if (activities.some((activity) => activity.eventType === "responded" || activity.eventType === "replied" || activity.eventType === "requested_details")) {
    return "C";
  }

  return "D";
}

function calculateBuyerScoreFromProfile(
  buyer: BuyerScoringProfile,
  demandSignals?: BuyerDemandSignals,
): BuyerScore {
  const activities = buyer.activities;
  const sentCount = activities.filter((activity) => activity.eventType === "deal_sent").length;
  const responseCount = activities.filter((activity) => activity.eventType === "responded" || activity.eventType === "replied").length;
  const offerCount = activities.filter((activity) => activity.eventType === "offer_made").length;
  const closeCount = activities.filter((activity) => activity.eventType === "deal_closed").length;

  const responseRate = toPercent(responseCount, sentCount);
  const offerRate = toPercent(offerCount, sentCount);
  const closeRate = toPercent(closeCount, sentCount);
  const recentActivityScore = calculateRecentActivityScore(activities);
  const avgDealSizeScore = calculateAvgDealSizeScore(buyer.preferredDealSize);
  const demandAlignmentScore = calculateDemandAlignmentScore(buyer, demandSignals);

  const score = Math.min(
    100,
    Math.round(
      responseRate * 0.25 +
        offerRate * 0.25 +
        closeRate * 0.25 +
        recentActivityScore * 0.15 +
        avgDealSizeScore * 0.1,
    ),
  );
  const matchReadinessScore = Math.min(100, score + demandAlignmentScore);

  return {
    score,
    responseRate,
    offerRate,
    closeRate,
    recentActivityScore,
    avgDealSizeScore,
    demandAlignmentScore,
    matchReadinessScore,
  };
}

export async function calculateBuyerScore(
  buyerId: string,
  demandSignals?: BuyerDemandSignals,
): Promise<BuyerScore> {
  const buyer = await prisma.buyer.findUnique({
    where: { id: buyerId },
    select: {
      preferredLocations: true,
      priceRangeMin: true,
      priceRangeMax: true,
      propertyTypes: true,
      preferredDealSize: true,
      activities: {
        select: {
          eventType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!buyer) {
    return calculateBuyerScoreFromProfile(
      {
        preferredLocations: [],
        priceRangeMin: null,
        priceRangeMax: null,
        propertyTypes: [],
        preferredDealSize: null,
        activities: [],
      },
      demandSignals,
    );
  }

  return calculateBuyerScoreFromProfile(buyer, demandSignals);
}

export function getBuyerStatusFromLastActivity(lastActivityAt: Date | null, now = new Date()): BuyerStatus {
  if (!lastActivityAt) {
    return "dead";
  }

  const ageInDays = (now.getTime() - lastActivityAt.getTime()) / DAY_IN_MS;

  if (ageInDays <= 14) {
    return "active";
  }

  if (ageInDays <= 45) {
    return "warm";
  }

  if (ageInDays <= 90) {
    return "cold";
  }

  return "dead";
}

export async function getBuyerStatus(buyerId: string): Promise<BuyerStatus> {
  const lastActivity = await prisma.buyerActivity.findFirst({
    where: { buyerId },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  return getBuyerStatusFromLastActivity(lastActivity?.createdAt ?? null);
}
