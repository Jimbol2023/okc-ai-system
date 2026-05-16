import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { evaluateExecutionReadiness } from "@/lib/strategy-execution-readiness";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const executionReadinessSchema = z.object({
  lead: z.unknown().optional(),
  assetClassification: z.unknown().optional(),
  strategyReadiness: z.unknown().optional(),
  strategyDecision: z.unknown().optional(),
  strategyComparison: z.unknown().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = executionReadinessSchema.safeParse(payload);

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
      executionReadiness: evaluateExecutionReadiness(parsedInput.data),
    });
  } catch (error) {
    console.error("POST /api/strategy-execution-readiness failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate execution readiness.",
      },
      { status: 500 },
    );
  }
}
