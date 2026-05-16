import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { generateGlobalDealScore } from "@/lib/global-deal-scoring-engine";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const globalDealScoreSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  decisionVisualization: z.unknown().optional(),
  executionDecisionOutput: z.unknown().optional(),
  executionDecisionSupport: z.unknown().optional(),
  explainabilityOutput: z.unknown().optional(),
  integrityOutput: z.unknown().optional(),
  portfolioDecision: z.unknown().optional(),
  feasibilityResult: z.unknown().optional(),
  fundingRecommendation: z.unknown().optional(),
  capitalStackComparison: z.unknown().optional(),
  fundingApprovalReadiness: z.unknown().optional(),
  offerRecommendation: z.unknown().optional(),
  negotiationRecommendation: z.unknown().optional(),
  followUpRecommendation: z.unknown().optional(),
  dispositionRecommendation: z.unknown().optional(),
  dealExecutionClosingRecommendation: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  doNotContact: z.boolean().nullable().optional(),
  optOutReason: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  assetType: z.string().nullable().optional(),
  arv: z.number().nullable().optional(),
  repairs: z.number().nullable().optional(),
  expectedProfit: z.number().nullable().optional(),
  riskScore: z.number().nullable().optional(),
  uncertaintyScore: z.number().nullable().optional(),
  reliabilityScore: z.number().nullable().optional(),
  dataCompletenessScore: z.number().nullable().optional(),
  buyerDemandScore: z.number().nullable().optional(),
  sellerMotivation: z.string().nullable().optional(),
  sellerTimeline: z.string().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
  closingTimeline: z.string().nullable().optional(),
  askingPrice: z.number().nullable().optional(),
  walkAwayPrice: z.number().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = globalDealScoreSchema.safeParse(payload);

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
    const globalDealScore = generateGlobalDealScore({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof generateGlobalDealScore>[0]);

    return NextResponse.json({
      success: true,
      globalDealScore,
      readOnlySafetyNote:
        "Global deal score output is read-only internal prioritization guidance. It does not contact sellers, contact buyers, send SMS, send email, touch Twilio, execute automation, generate contracts, create assignment agreements, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/global-deal-score failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate global deal score.",
      },
      { status: 500 },
    );
  }
}
