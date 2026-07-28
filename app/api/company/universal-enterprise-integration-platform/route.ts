import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createUeipMigrationMatrix } from "@/lib/ueip-provider-surface-inventory";
import { getUeipSearchConsolePilotHealth } from "@/lib/ueip-runtime-gateway";
import { createUeipPortfolioReport } from "@/lib/universal-enterprise-integration-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const context = await getAuthenticatedRequestContext(request);
  if (!context) return getUnauthorizedApiResponse();
  return NextResponse.json({
    ...createUeipPortfolioReport(),
    migrationMatrix: createUeipMigrationMatrix(),
    searchConsolePilot: await getUeipSearchConsolePilotHealth(context.tenantId),
  });
}
