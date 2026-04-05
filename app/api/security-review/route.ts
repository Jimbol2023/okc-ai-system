import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { runSecurityReview } from "@/lib/security-review-agent";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await runSecurityReview();

    return NextResponse.json({
      ok: true,
      report
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run the security review right now."
      },
      { status: 500 }
    );
  }
}
