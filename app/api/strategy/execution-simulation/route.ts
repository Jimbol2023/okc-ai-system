import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { simulateExecutionFlow } from "@/lib/execution-simulation-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const executionSimulationSchema = z.object({
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
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = executionSimulationSchema.safeParse(payload);

    if (!parsedInput.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsedInput.error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      executionSimulation: simulateExecutionFlow(parsedInput.data),
    });
  } catch (error) {
    console.error("POST /api/strategy/execution-simulation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to simulate execution flow.",
      },
      { status: 500 },
    );
  }
}
