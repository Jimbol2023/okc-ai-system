import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  generateExecutionDecisionSupport,
  type ExecutionDecisionSupportInput,
} from "@/lib/execution-decision-support-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const executionDecisionSupportSchema = z.object({
  lead: z.unknown().optional(),
  deal: z.unknown().optional(),
  assetClassification: z.unknown().optional(),
  strategyDecision: z.unknown().optional(),
  strategyComparison: z.unknown().optional(),
  executionReadiness: z.unknown().optional(),
  blockerResolution: z.unknown().optional(),
  buyerIntelligence: z.unknown().optional(),
  marketContext: z.unknown().optional(),
  assetContext: z.unknown().optional(),
  strategies: z.array(z.string()).optional(),
  selectedStrategy: z.string().trim().optional(),
  simulations: z.array(z.unknown()).optional(),
  selectedSimulation: z.unknown().optional(),
  executionScenarioComparison: z.unknown().optional(),
  confidenceResult: z.unknown().optional(),
  reliabilityResult: z.unknown().optional(),
  doNotContact: z.unknown().optional(),
  complianceIssue: z.unknown().optional(),
  legalHold: z.unknown().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = executionDecisionSupportSchema.safeParse(payload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    const decisionInput = parsedInput.data as ExecutionDecisionSupportInput;

    return NextResponse.json({
      success: true,
      executionDecisionSupport: generateExecutionDecisionSupport(decisionInput),
      readOnlySafetyNote:
        "Execution decision support is read-only. It does not send SMS, use Twilio, trigger outreach, route deals, execute automation, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/strategy/execution-decision-support failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate execution decision support.",
      },
      { status: 500 },
    );
  }
}
