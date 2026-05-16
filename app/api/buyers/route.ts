import { NextResponse, type NextRequest } from "next/server";

import { calculateBuyerScore, getBuyerStatusFromLastActivity, getBuyerTierFromActivities } from "@/lib/buyer-score";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { buyerCreateSchema, createBuyer } from "@/lib/buyer-intake";
import { calculateBuyerQuality } from "@/lib/buyer-quality";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function serializeBuyer(buyer: {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  financingType: string | null;
  tier: "A" | "B" | "C" | "D";
  preferredDealSize: number | null;
  preferredCondition: string | null;
  source: string | null;
  tags: unknown;
  buyerQualityScore: number;
  lastActiveAt: Date | null;
  activityCount: number;
  meaningfulActivityCount: number;
  lastMeaningfulActivityAt: Date | null;
  isActive: boolean;
  qualityReasons: unknown;
  createdAt: Date;
  updatedAt: Date;
  activities: { id?: string; eventType: string; dealId?: string | null; metadata?: unknown; createdAt: Date }[];
}) {
  const lastActivityAt = buyer.activities[0]?.createdAt ?? null;
  const calculatedTier = getBuyerTierFromActivities(buyer.activities);

  return {
    id: buyer.id,
    name: buyer.name,
    phone: buyer.phone,
    email: buyer.email,
    preferredLocations: buyer.preferredLocations,
    priceRangeMin: buyer.priceRangeMin,
    priceRangeMax: buyer.priceRangeMax,
    propertyTypes: buyer.propertyTypes,
    financingType: buyer.financingType,
    tier: calculatedTier,
    storedTier: buyer.tier,
    preferredDealSize: buyer.preferredDealSize,
    preferredCondition: buyer.preferredCondition,
    source: buyer.source,
    tags: buyer.tags,
    buyerQualityScore: buyer.buyerQualityScore,
    lastActiveAt: buyer.lastActiveAt?.toISOString() ?? null,
    activityCount: buyer.activityCount,
    meaningfulActivityCount: buyer.meaningfulActivityCount,
    lastMeaningfulActivityAt: buyer.lastMeaningfulActivityAt?.toISOString() ?? null,
    isActive: buyer.isActive,
    persistedQualityReasons: buyer.qualityReasons,
    status: getBuyerStatusFromLastActivity(lastActivityAt),
    lastActivityAt: lastActivityAt?.toISOString() ?? null,
    recentActivities: buyer.activities.slice(0, 5).map((activity) => ({
      id: activity.id,
      eventType: activity.eventType,
      dealId: activity.dealId ?? null,
      metadata: activity.metadata ?? null,
      createdAt: activity.createdAt.toISOString(),
    })),
    createdAt: buyer.createdAt.toISOString(),
    updatedAt: buyer.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [buyers, demandSignals] = await Promise.all([
      prisma.buyer.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          activities: {
            orderBy: { createdAt: "desc" },
            select: { id: true, eventType: true, dealId: true, metadata: true, createdAt: true },
          },
        },
      }),
      getBuyerDemandSignals(),
    ]);

    const buyersWithScores = await Promise.all(
      buyers.map(async (buyer) => {
        const [score, quality] = await Promise.all([
          calculateBuyerScore(buyer.id, demandSignals),
          calculateBuyerQuality(buyer.id),
        ]);

        return {
          ...serializeBuyer({
            ...buyer,
            activities: buyer.activities,
          }),
          tier: quality.tier,
          buyerQualityScore: quality.buyerQualityScore,
          lastActiveAt: quality.lastActiveAt?.toISOString() ?? null,
          activityCount: quality.activityCount,
          meaningfulActivityCount: quality.meaningfulActivityCount,
          lastMeaningfulActivityAt: quality.lastMeaningfulActivityAt?.toISOString() ?? null,
          isActive: quality.isActive,
          qualityReasons: quality.reasons,
          score,
          matchReadinessScore: score.matchReadinessScore,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      buyers: buyersWithScores,
    });
  } catch (error) {
    console.error("GET /api/buyers failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load buyers.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedBuyer = buyerCreateSchema.safeParse(payload);

    if (!parsedBuyer.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedBuyer.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await createBuyer(parsedBuyer.data);

    if (!result.created) {
      return NextResponse.json(
        {
          success: false,
          error: "duplicate_buyer",
          duplicateBuyer: result.duplicateBuyer,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      success: true,
      buyer: {
        ...result.buyer,
        lastActiveAt: result.buyer.lastActiveAt?.toISOString() ?? null,
        createdAt: result.buyer.createdAt.toISOString(),
        updatedAt: result.buyer.updatedAt.toISOString(),
        quality: result.quality,
      },
    });
  } catch (error) {
    console.error("POST /api/buyers failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create buyer.",
      },
      { status: 500 },
    );
  }
}
