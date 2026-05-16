import { NextResponse, type NextRequest } from "next/server";

import { calculateBuyerScore, getBuyerStatusFromLastActivity, getBuyerTierFromActivities } from "@/lib/buyer-score";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { calculateBuyerQuality } from "@/lib/buyer-quality";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function serializeActivity(activity: {
  id: string;
  dealId: string | null;
  eventType: string;
  metadata: unknown;
  createdAt: Date;
}) {
  return {
    ...activity,
    createdAt: activity.createdAt.toISOString(),
  };
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { id } = await context.params;

    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        activities: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!buyer) {
      return NextResponse.json(
        {
          success: false,
          error: "Buyer not found.",
        },
        { status: 404 },
      );
    }

    const lastActivityAt = buyer.activities[0]?.createdAt ?? null;
    const demandSignals = await getBuyerDemandSignals();
    const [score, quality] = await Promise.all([
      calculateBuyerScore(buyer.id, demandSignals),
      calculateBuyerQuality(buyer.id),
    ]);
    const tier = quality.tier ?? getBuyerTierFromActivities(buyer.activities);

    return NextResponse.json({
      success: true,
      buyer: {
        id: buyer.id,
        name: buyer.name,
        phone: buyer.phone,
        email: buyer.email,
        preferredLocations: buyer.preferredLocations,
        priceRangeMin: buyer.priceRangeMin,
        priceRangeMax: buyer.priceRangeMax,
        propertyTypes: buyer.propertyTypes,
        financingType: buyer.financingType,
        tier,
        storedTier: buyer.tier,
        preferredDealSize: buyer.preferredDealSize,
        preferredCondition: buyer.preferredCondition,
        source: buyer.source,
        tags: buyer.tags,
        buyerQualityScore: quality.buyerQualityScore,
        lastActiveAt: quality.lastActiveAt?.toISOString() ?? null,
        activityCount: quality.activityCount,
        meaningfulActivityCount: quality.meaningfulActivityCount,
        lastMeaningfulActivityAt: quality.lastMeaningfulActivityAt?.toISOString() ?? null,
        isActive: quality.isActive,
        qualityReasons: quality.reasons,
        persistedQualityReasons: buyer.qualityReasons,
        score,
        matchReadinessScore: score.matchReadinessScore,
        status: getBuyerStatusFromLastActivity(lastActivityAt),
        lastActivityAt: lastActivityAt?.toISOString() ?? null,
        activities: buyer.activities.map(serializeActivity),
        createdAt: buyer.createdAt.toISOString(),
        updatedAt: buyer.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("GET /api/buyers/[id] failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load buyer.",
      },
      { status: 500 },
    );
  }
}
