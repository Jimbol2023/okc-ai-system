import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { generateOfferRecommendation } from "@/lib/offer-engine";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const offerEngineSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  portfolioDecision: z.unknown().optional(),
  feasibilityResult: z.unknown().optional(),
  fundingRecommendation: z.unknown().optional(),
  capitalStackComparison: z.unknown().optional(),
  fundingApprovalReadiness: z.unknown().optional(),
  strategyDecision: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  purchasePrice: z.number().nullable().optional(),
  askingPrice: z.number().nullable().optional(),
  arv: z.number().nullable().optional(),
  repairs: z.number().nullable().optional(),
  estimatedRepairs: z.number().nullable().optional(),
  rent: z.number().nullable().optional(),
  monthlyRent: z.number().nullable().optional(),
  noi: z.number().nullable().optional(),
  taxes: z.number().nullable().optional(),
  insurance: z.number().nullable().optional(),
  mortgageBalance: z.number().nullable().optional(),
  estimatedProfit: z.number().nullable().optional(),
  timelineDays: z.number().nullable().optional(),
  riskScore: z.number().nullable().optional(),
  uncertaintyScore: z.number().nullable().optional(),
  reliabilityScore: z.number().nullable().optional(),
  dataCompletenessScore: z.number().nullable().optional(),
  buyerDemandScore: z.number().nullable().optional(),
  sellerMotivation: z.string().nullable().optional(),
  sellerTermsAvailable: z.boolean().nullable().optional(),
  assetType: z.string().nullable().optional(),
  propertyType: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = offerEngineSchema.safeParse(payload);

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
    const offerRecommendation = generateOfferRecommendation({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof generateOfferRecommendation>[0]);

    return NextResponse.json({
      success: true,
      offerRecommendation,
      readOnlySafetyNote:
        "Offer engine output is read-only internal guidance. It does not generate legal contracts, send offers, contact sellers, send messages, execute automation, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/offer-engine failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate offer recommendation.",
      },
      { status: 500 },
    );
  }
}
