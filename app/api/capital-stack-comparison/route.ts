import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { compareCapitalStacks } from "@/lib/capital-stack-comparison";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const capitalStackSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  fundingRecommendation: z.unknown().optional(),
  portfolioDecision: z.unknown().optional(),
  feasibilityResult: z.unknown().optional(),
  deal: z.unknown().optional(),
  lead: z.unknown().optional(),
  purchasePrice: z.number().nullable().optional(),
  askingPrice: z.number().nullable().optional(),
  arv: z.number().nullable().optional(),
  repairs: z.number().nullable().optional(),
  estimatedRepairs: z.number().nullable().optional(),
  estimatedProfit: z.number().nullable().optional(),
  capitalRequired: z.number().nullable().optional(),
  timelineDays: z.number().nullable().optional(),
  riskScore: z.number().nullable().optional(),
  uncertaintyScore: z.number().nullable().optional(),
  reliabilityScore: z.number().nullable().optional(),
  buyerDemandScore: z.number().nullable().optional(),
  sellerTermsAvailable: z.boolean().nullable().optional(),
  state: z.string().nullable().optional(),
  market: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = capitalStackSchema.safeParse(payload);

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
    const comparisonInput = {
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    } as Parameters<typeof compareCapitalStacks>[0];
    const capitalStackComparison = compareCapitalStacks(comparisonInput);

    return NextResponse.json({
      success: true,
      capitalStackComparison,
      readOnlySafetyNote:
        "Capital stack comparison is read-only. It does not contact lenders, send messages, route deals, execute automation, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/capital-stack-comparison failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to compare capital stacks.",
      },
      { status: 500 },
    );
  }
}
