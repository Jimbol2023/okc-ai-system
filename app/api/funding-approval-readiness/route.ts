import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateFundingApprovalReadiness } from "@/lib/funding-approval-guardrails";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const fundingApprovalSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  portfolioDecision: z.unknown().optional(),
  feasibilityResult: z.unknown().optional(),
  fundingRecommendation: z.unknown().optional(),
  capitalStackComparison: z.unknown().optional(),
  strategyDecision: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  purchasePrice: z.number().nullable().optional(),
  askingPrice: z.number().nullable().optional(),
  arv: z.number().nullable().optional(),
  repairs: z.number().nullable().optional(),
  estimatedRepairs: z.number().nullable().optional(),
  estimatedProfit: z.number().nullable().optional(),
  timelineDays: z.number().nullable().optional(),
  riskScore: z.number().nullable().optional(),
  uncertaintyScore: z.number().nullable().optional(),
  reliabilityScore: z.number().nullable().optional(),
  dataCompletenessScore: z.number().nullable().optional(),
  buyerDemandScore: z.number().nullable().optional(),
  sellerTermsAvailable: z.boolean().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
  titleStatus: z.string().nullable().optional(),
  occupancyStatus: z.string().nullable().optional(),
  docsAvailable: z.array(z.string()).nullable().optional(),
  exitStrategy: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = fundingApprovalSchema.safeParse(payload);

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
    const fundingApprovalReadiness = evaluateFundingApprovalReadiness({
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof evaluateFundingApprovalReadiness>[0]);

    return NextResponse.json({
      success: true,
      fundingApprovalReadiness,
      readOnlySafetyNote:
        "Funding approval readiness is read-only internal scoring. It does not approve real funding, contact lenders, send messages, execute automation, generate contracts, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/funding-approval-readiness failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate funding approval readiness.",
      },
      { status: 500 },
    );
  }
}
