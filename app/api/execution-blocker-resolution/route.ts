import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createExecutionBlockerResolutionPlan } from "@/lib/execution-blocker-resolution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const blockerResolutionSchema = z.object({
  executionReadiness: z.unknown().optional(),
  blockers: z.array(z.unknown()).optional(),
  selectedStrategy: z.string().trim().optional(),
  lead: z.unknown().optional(),
});

export async function POST(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsedInput = blockerResolutionSchema.safeParse(payload);

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
      blockerResolution: createExecutionBlockerResolutionPlan(parsedInput.data),
    });
  } catch (error) {
    console.error("POST /api/execution-blocker-resolution failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create execution blocker resolution plan.",
      },
      { status: 500 },
    );
  }
}
