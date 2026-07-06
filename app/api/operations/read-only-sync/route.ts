import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { runReadOnlyBusinessSync } from "@/lib/read-only-business-connections";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isCronRequest(request: Request) {
  const configuredSecret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get("authorization") || "";

  return Boolean(configuredSecret) && authorization === `Bearer ${configuredSecret}`;
}

export async function POST(request: Request) {
  try {
    if (!isCronRequest(request) && !(await isAdminRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const report = await runReadOnlyBusinessSync();

    return NextResponse.json(report);
  } catch (error) {
    console.error("POST /api/operations/read-only-sync failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run read-only business sync.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  try {
    if (!isCronRequest(request)) {
      return getUnauthorizedApiResponse();
    }

    const report = await runReadOnlyBusinessSync();

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/operations/read-only-sync failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to run scheduled read-only business sync.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
