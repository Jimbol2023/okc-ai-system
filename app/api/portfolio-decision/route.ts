import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { getDbLeadById } from "@/lib/leads-db";
import { selectPortfolioAction } from "@/lib/portfolio-builder";
import { evaluateFeasibility } from "@/lib/portfolio-feasibility";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const portfolioDecisionSchema = z.object({
  dealId: z.string().trim().optional(),
  leadId: z.string().trim().optional(),
  lead: z.unknown().optional(),
  deal: z.unknown().optional(),
  strategyDecision: z.unknown().optional(),
  strategyComparison: z.unknown().optional(),
  executionDecisionSupport: z.unknown().optional(),
  executionScenarioComparison: z.unknown().optional(),
  executionSimulation: z.unknown().optional(),
  assetClassification: z.unknown().optional(),
  buyerIntelligence: z.unknown().optional(),
  marketContext: z.unknown().optional(),
  portfolioContext: z.unknown().optional(),
  askingPrice: z.number().nullable().optional(),
  arv: z.number().nullable().optional(),
  estimatedRepairs: z.number().nullable().optional(),
  monthlyRent: z.number().nullable().optional(),
  mortgageBalance: z.number().nullable().optional(),
  sellerMotivation: z.string().nullable().optional(),
  flexibleTerms: z.boolean().nullable().optional(),
  knownBuyerDemand: z.boolean().nullable().optional(),
  propertyType: z.string().nullable().optional(),
  units: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = portfolioDecisionSchema.safeParse(payload);

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
    const portfolioInput = {
      ...parsedInput.data,
      lead: parsedInput.data.lead ?? existingLead ?? undefined,
    };
    const portfolioDecision = selectPortfolioAction(portfolioInput);
    const feasibility = evaluateFeasibility(portfolioDecision, portfolioInput);
    const decisionWithFeasibility = {
      ...portfolioDecision,
      feasibilityStatus: feasibility.feasibilityStatus,
      feasibilityIssues: feasibility.issues,
      executionBlockers: feasibility.blockers,
      capitalFit: feasibility.capitalFit,
      timelineRisk: feasibility.timelineRisk,
    };

    return NextResponse.json({
      success: true,
      portfolioDecision: decisionWithFeasibility,
      readOnlySafetyNote:
        "Portfolio decision is read-only. It does not send SMS, use Twilio, route deals, execute automation, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/portfolio-decision failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate portfolio decision.",
      },
      { status: 500 },
    );
  }
}
