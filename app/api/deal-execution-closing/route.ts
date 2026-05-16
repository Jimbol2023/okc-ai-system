import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { generateDealExecutionClosingRecommendation } from "@/lib/deal-execution-closing-engine";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const dealExecutionClosingSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  dispositionRecommendation: z.unknown().optional(),
  followUpRecommendation: z.unknown().optional(),
  negotiationRecommendation: z.unknown().optional(),
  offerRecommendation: z.unknown().optional(),
  fundingApprovalReadiness: z.unknown().optional(),
  capitalStackComparison: z.unknown().optional(),
  fundingRecommendation: z.unknown().optional(),
  portfolioDecision: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  sellerContractStatus: z.string().nullable().optional(),
  buyerContractStatus: z.string().nullable().optional(),
  assignmentStatus: z.string().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
  escrowStatus: z.string().nullable().optional(),
  earnestMoneyStatus: z.string().nullable().optional(),
  buyerProofOfFundsStatus: z.string().nullable().optional(),
  inspectionStatus: z.string().nullable().optional(),
  occupancyStatus: z.string().nullable().optional(),
  accessStatus: z.string().nullable().optional(),
  closingDate: z.string().nullable().optional(),
  closingTimeline: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  propertyAddress: z.string().nullable().optional(),
  assetType: z.string().nullable().optional(),
  selectedBuyer: z.unknown().optional(),
  dispositionPath: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = dealExecutionClosingSchema.safeParse(payload);

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
    const dealExecutionClosingRecommendation = generateDealExecutionClosingRecommendation({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof generateDealExecutionClosingRecommendation>[0]);

    return NextResponse.json({
      success: true,
      dealExecutionClosingRecommendation,
      readOnlySafetyNote:
        "Deal execution and closing output is read-only internal guidance. It does not contact sellers, contact buyers, send SMS, send email, touch Twilio, execute automation, generate contracts, create assignment agreements, send contracts, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/deal-execution-closing failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate deal execution closing recommendation.",
      },
      { status: 500 },
    );
  }
}
