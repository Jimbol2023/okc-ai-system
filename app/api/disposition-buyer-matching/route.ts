import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { generateDispositionRecommendation } from "@/lib/disposition-buyer-matching-engine";
import { getDbLeadById } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dispositionBuyerMatchingSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  followUpRecommendation: z.unknown().optional(),
  negotiationRecommendation: z.unknown().optional(),
  offerRecommendation: z.unknown().optional(),
  fundingApprovalReadiness: z.unknown().optional(),
  capitalStackComparison: z.unknown().optional(),
  portfolioDecision: z.unknown().optional(),
  strategyDecision: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  existingBuyerList: z.array(z.unknown()).optional(),
  buyers: z.array(z.unknown()).optional(),
  assetType: z.string().nullable().optional(),
  propertyType: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  zip: z.string().nullable().optional(),
  arv: z.number().nullable().optional(),
  repairs: z.number().nullable().optional(),
  estimatedRepairs: z.number().nullable().optional(),
  askingPrice: z.number().nullable().optional(),
  recommendedOffer: z.number().nullable().optional(),
  walkAwayPrice: z.number().nullable().optional(),
  expectedProfit: z.number().nullable().optional(),
  buyerDemandScore: z.number().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
  occupancyStatus: z.string().nullable().optional(),
  closingTimeline: z.string().nullable().optional(),
  propertyCondition: z.string().nullable().optional(),
  condition: z.string().nullable().optional(),
  zoning: z.string().nullable().optional(),
  rent: z.number().nullable().optional(),
  monthlyRent: z.number().nullable().optional(),
  noi: z.number().nullable().optional(),
  acreage: z.number().nullable().optional(),
  access: z.string().nullable().optional(),
  utilities: z.string().nullable().optional(),
  floodplain: z.string().nullable().optional(),
});

function serializeBuyerForMatching(buyer: {
  id: string;
  name: string;
  preferredLocations: unknown;
  priceRangeMin: number | null;
  priceRangeMax: number | null;
  propertyTypes: unknown;
  financingType: string | null;
  tier: string;
  preferredDealSize: number | null;
  preferredCondition: string | null;
  buyerQualityScore: number;
  lastActiveAt: Date | null;
  activityCount: number;
  meaningfulActivityCount: number;
  isActive: boolean;
  activities: { eventType: string }[];
}) {
  return {
    id: buyer.id,
    name: buyer.name,
    preferredLocations: buyer.preferredLocations,
    priceRangeMin: buyer.priceRangeMin,
    priceRangeMax: buyer.priceRangeMax,
    propertyTypes: buyer.propertyTypes,
    financingType: buyer.financingType,
    tier: buyer.tier,
    preferredDealSize: buyer.preferredDealSize,
    preferredCondition: buyer.preferredCondition,
    buyerQualityScore: buyer.buyerQualityScore,
    lastActiveAt: buyer.lastActiveAt?.toISOString() ?? null,
    activityCount: buyer.activityCount,
    meaningfulActivityCount: buyer.meaningfulActivityCount,
    isActive: buyer.isActive,
    recentActivities: buyer.activities,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = dispositionBuyerMatchingSchema.safeParse(payload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    const leadId = parsedInput.data.leadId ?? parsedInput.data.dealId;
    const [existingLead, storedBuyers] = await Promise.all([
      leadId ? getDbLeadById(leadId) : Promise.resolve(null),
      parsedInput.data.buyers || parsedInput.data.existingBuyerList
        ? Promise.resolve([])
        : prisma.buyer.findMany({
            orderBy: { buyerQualityScore: "desc" },
            take: 25,
            select: {
              id: true,
              name: true,
              preferredLocations: true,
              priceRangeMin: true,
              priceRangeMax: true,
              propertyTypes: true,
              financingType: true,
              tier: true,
              preferredDealSize: true,
              preferredCondition: true,
              buyerQualityScore: true,
              lastActiveAt: true,
              activityCount: true,
              meaningfulActivityCount: true,
              isActive: true,
              activities: {
                orderBy: { createdAt: "desc" },
                take: 10,
                select: { eventType: true },
              },
            },
          }),
    ]);
    const buyers =
      parsedInput.data.buyers ??
      parsedInput.data.existingBuyerList ??
      storedBuyers.map((buyer) =>
        serializeBuyerForMatching({
          ...buyer,
          tier: buyer.tier,
          activities: buyer.activities.map((activity) => ({ eventType: activity.eventType })),
        }),
      );

    const dispositionRecommendation = generateDispositionRecommendation({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
      buyers,
    } as Parameters<typeof generateDispositionRecommendation>[0]);

    return NextResponse.json({
      success: true,
      dispositionRecommendation,
      readOnlySafetyNote:
        "Disposition buyer matching output is read-only internal guidance. It does not contact buyers, send SMS, send email, touch Twilio, execute automation, generate contracts, create assignment agreements, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/disposition-buyer-matching failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate disposition recommendation.",
      },
      { status: 500 },
    );
  }
}
