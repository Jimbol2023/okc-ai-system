import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getDbLeadById } from "@/lib/leads-db";
import { generateNegotiationRecommendation } from "@/lib/negotiation-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const negotiationEngineSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  offerRecommendation: z.unknown().optional(),
  fundingApprovalReadiness: z.unknown().optional(),
  portfolioDecision: z.unknown().optional(),
  feasibilityResult: z.unknown().optional(),
  fundingRecommendation: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  askingPrice: z.number().nullable().optional(),
  recommendedOffer: z.number().nullable().optional(),
  openingOffer: z.number().nullable().optional(),
  walkAwayPrice: z.number().nullable().optional(),
  repairs: z.number().nullable().optional(),
  estimatedRepairs: z.number().nullable().optional(),
  arv: z.number().nullable().optional(),
  sellerMotivation: z.string().nullable().optional(),
  sellerTimeline: z.string().nullable().optional(),
  occupancyStatus: z.string().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
  riskScore: z.number().nullable().optional(),
  uncertaintyScore: z.number().nullable().optional(),
  reliabilityScore: z.number().nullable().optional(),
  dataCompletenessScore: z.number().nullable().optional(),
  assetType: z.string().nullable().optional(),
  propertyType: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = negotiationEngineSchema.safeParse(payload);

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
    const existingLead = leadId ? await getDbLeadById(leadId) : null;
    const negotiationRecommendation = generateNegotiationRecommendation({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof generateNegotiationRecommendation>[0]);

    return NextResponse.json({
      success: true,
      negotiationRecommendation,
      readOnlySafetyNote:
        "Negotiation engine output is read-only internal guidance. It does not contact sellers, send messages, generate legal contracts, execute automation, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/negotiation-engine failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate negotiation recommendation.",
      },
      { status: 500 },
    );
  }
}
