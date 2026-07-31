import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createCrossConnectorCertificationPacket } from "@/lib/cross-connector-certification";
import { getLatestTenantBusinessSnapshots } from "@/lib/read-only-business-connections";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();

  try {
    const snapshots = await getLatestTenantBusinessSnapshots(actor.tenantId, 200);
    const contracted = snapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    const packet = createCrossConnectorCertificationPacket({ tenantId: actor.tenantId, snapshots: contracted });

    return NextResponse.json({ ok: true, ...packet });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "cross_connector_certification_unavailable";
    return NextResponse.json({ ok: false, error: message, providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status: 400 });
  }
}
