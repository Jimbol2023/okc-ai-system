import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { calculateBuyerActivityScore } from "@/lib/buyer-activity-score";
import { refreshBuyerQuality } from "@/lib/buyer-quality";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const supportedBuyerActivityEvents = [
  "deal_viewed",
  "deal_opened",
  "link_clicked",
  "replied",
  "requested_details",
  "offer_made",
  "deal_closed",
  "deal_passed",
  "unsubscribed_or_inactive",
] as const;

const buyerActivitySchema = z.object({
  eventType: z.enum(supportedBuyerActivityEvents),
  dealId: z.string().trim().optional(),
  metadata: z.unknown().optional(),
});

export async function POST(
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
      select: { id: true },
    });

    if (!buyer) {
      return NextResponse.json(
        {
          success: false,
          error: "buyer_not_found",
        },
        { status: 404 },
      );
    }

    const payload = await request.json();
    const parsedActivity = buyerActivitySchema.safeParse(payload);

    if (!parsedActivity.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedActivity.error.flatten(),
        },
        { status: 400 },
      );
    }

    const activity = await prisma.buyerActivity.create({
      data: {
        buyerId: id,
        eventType: parsedActivity.data.eventType,
        dealId: parsedActivity.data.dealId || undefined,
        metadata: parsedActivity.data.metadata ?? undefined,
      },
    });
    const updatedBuyerQuality = await refreshBuyerQuality(id);
    const activityScore = calculateBuyerActivityScore([
      {
        eventType: activity.eventType,
        createdAt: activity.createdAt,
      },
    ]);

    return NextResponse.json({
      success: true,
      activity: {
        ...activity,
        createdAt: activity.createdAt.toISOString(),
      },
      activityScore: {
        activityScore: activityScore.activityScore,
        meaningfulActivityCount: activityScore.meaningfulActivityCount,
        weightedEvents: activityScore.weightedEvents.map((event) => ({
          ...event,
          createdAt: event.createdAt.toISOString(),
        })),
        lastMeaningfulActivityAt: activityScore.lastMeaningfulActivityAt?.toISOString() ?? null,
      },
      updatedBuyerQuality: {
        buyerQualityScore: updatedBuyerQuality.buyerQualityScore,
        tier: updatedBuyerQuality.tier,
        lastActiveAt: updatedBuyerQuality.lastActiveAt?.toISOString() ?? null,
        activityCount: updatedBuyerQuality.activityCount,
        meaningfulActivityCount: updatedBuyerQuality.meaningfulActivityCount,
        lastMeaningfulActivityAt: updatedBuyerQuality.lastMeaningfulActivityAt?.toISOString() ?? null,
        isActive: updatedBuyerQuality.isActive,
        qualityReasons: updatedBuyerQuality.reasons,
      },
    });
  } catch (error) {
    console.error("POST /api/buyers/[id]/activity failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to log buyer activity.",
      },
      { status: 500 },
    );
  }
}
