import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  compareExecutionScenarios,
  type ExecutionScenarioComparisonInput,
} from "@/lib/execution-scenario-comparison-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const executionScenarioComparisonSchema = z.object({
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
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = executionScenarioComparisonSchema.safeParse(payload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    const comparisonInput = parsedInput.data as ExecutionScenarioComparisonInput;

    return NextResponse.json({
      success: true,
      executionScenarioComparison: compareExecutionScenarios(comparisonInput),
      readOnlySafetyNote:
        "Execution scenario comparison is read-only. It does not send SMS, use Twilio, trigger outreach, route deals, execute automation, or mutate records.",
    });
  } catch (error) {
    console.error("POST /api/strategy/execution-scenario-comparison failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to compare execution scenarios.",
      },
      { status: 500 },
    );
  }
}
