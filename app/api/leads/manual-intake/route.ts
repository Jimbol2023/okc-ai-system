import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createManualLeadIntake, listManualLeadIntakes, manualLeadIntakeSchema } from "@/lib/manual-lead-intake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const intakes = await listManualLeadIntakes();

    return NextResponse.json({
      success: true,
      intakes,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to load manual lead intake records right now.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = manualLeadIntakeSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await createManualLeadIntake(parsed.data);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Manual lead intake error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to save manual lead intake right now.",
      },
      { status: 500 }
    );
  }
}
