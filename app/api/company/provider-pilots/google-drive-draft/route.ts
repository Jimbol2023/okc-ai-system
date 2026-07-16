import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedAdmin, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import {
  executeGoogleDriveDraftPilot,
  googleDriveDraftPilotConfirmationPhrase,
} from "@/lib/google-drive-draft-pilot";
import { clearServerCacheKey } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const googleDriveDraftPilotSchema = z.object({
  actionType: z.literal("create_drive_doc_draft"),
  title: z.string().trim().min(3).max(160),
  body: z.string().trim().min(3).max(4000),
  sourceLabel: z.string().trim().min(3).max(180),
  confirmation: z.literal(googleDriveDraftPilotConfirmationPhrase),
});

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const body = await request.json().catch(() => null);
    const parsed = googleDriveDraftPilotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Invalid Google Drive draft pilot request.",
          errors: parsed.error.flatten(),
          providerCalled: false,
          liveExecutionAllowed: false,
        },
        { status: 400 },
      );
    }

    const admin = await getAuthenticatedAdmin();
    const result = await executeGoogleDriveDraftPilot({
      ...parsed.data,
      approvedBy: admin?.email ?? "CEO",
    });
    clearServerCacheKey("executive-dashboard-report");

    return NextResponse.json(result, { status: result.ok ? 200 : result.providerCalled ? 502 : 409 });
  } catch (error) {
    console.error("POST /api/company/provider-pilots/google-drive-draft failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to run Google Drive draft pilot.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
