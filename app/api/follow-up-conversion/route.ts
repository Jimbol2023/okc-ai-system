import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { generateFollowUpRecommendation } from "@/lib/follow-up-conversion-engine";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const followUpConversionSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  negotiationRecommendation: z.unknown().optional(),
  offerRecommendation: z.unknown().optional(),
  fundingApprovalReadiness: z.unknown().optional(),
  portfolioDecision: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  sellerResponse: z.string().nullable().optional(),
  sellerMotivation: z.string().nullable().optional(),
  sellerTimeline: z.string().nullable().optional(),
  lastContactedAt: z.string().nullable().optional(),
  followUpCount: z.number().nullable().optional(),
  doNotContact: z.boolean().nullable().optional(),
  optOutReason: z.string().nullable().optional(),
  askingPrice: z.number().nullable().optional(),
  recommendedOffer: z.number().nullable().optional(),
  walkAwayPrice: z.number().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
  occupancyStatus: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  riskScore: z.number().nullable().optional(),
  uncertaintyScore: z.number().nullable().optional(),
  dataCompletenessScore: z.number().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = followUpConversionSchema.safeParse(payload);

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
    const followUpRecommendation = generateFollowUpRecommendation({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof generateFollowUpRecommendation>[0]);

    return NextResponse.json({
      success: true,
      followUpRecommendation,
      readOnlySafetyNote:
        "Follow-up conversion output is read-only internal guidance. It does not contact sellers, send SMS, send email, touch Twilio, execute automation, generate contracts, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/follow-up-conversion failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate follow-up recommendation.",
      },
      { status: 500 },
    );
  }
}
