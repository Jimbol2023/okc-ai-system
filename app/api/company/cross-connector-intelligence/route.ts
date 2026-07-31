import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createCrossConnectorIntelligenceReport } from "@/lib/cross-connector-intelligence";
import { getLatestTenantBusinessSnapshots } from "@/lib/read-only-business-connections";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();

  try {
    const snapshots = await getLatestTenantBusinessSnapshots(actor.tenantId, 200);
    const contracted = snapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    const report = createCrossConnectorIntelligenceReport({ tenantId: actor.tenantId, snapshots: contracted });

    return NextResponse.json({ ok: true, ...report });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "cross_connector_intelligence_unavailable";
    return NextResponse.json({ ok: false, error: message, providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status: 400 });
  }
}
