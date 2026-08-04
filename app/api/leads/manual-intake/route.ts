import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createManualLeadIntake, listManualLeadIntakes, manualLeadIntakeSchema } from "@/lib/manual-lead-intake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const intakes = await listManualLeadIntakes(actor.tenantId);

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
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
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

    const result = await createManualLeadIntake(actor.tenantId, parsed.data);

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
