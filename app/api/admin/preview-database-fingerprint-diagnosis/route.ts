import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAdminRequest } from "@/lib/auth";
import { diagnosePreviewDatabaseFingerprint } from "@/lib/preview-database-fingerprint-diagnosis";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const report = await diagnosePreviewDatabaseFingerprint();
  const response = NextResponse.json(report, {
    status: report.classification === "PREVIEW_DATABASE_IDENTITY_CERTIFIED" ? 200 : 409,
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}
