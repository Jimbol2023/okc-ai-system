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
    const snapshotLoadGaps: string[] = [];
    const snapshots = await getLatestTenantBusinessSnapshots(actor.tenantId, 200).catch(() => {
      snapshotLoadGaps.push("Normalized tenant snapshot store is unavailable for operator review; no provider read was attempted.");
      return [];
    });
    const contracted = snapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    const packet = createCrossConnectorCertificationPacket({ tenantId: actor.tenantId, snapshots: contracted });
    const packetWithGaps = {
      ...packet,
      dataGaps: [...snapshotLoadGaps, ...packet.intelligence.dataGaps],
      readinessFailures: [...snapshotLoadGaps, ...packet.readinessFailures],
      ceoReviewNotes: [...snapshotLoadGaps, ...packet.ceoReviewNotes],
      intelligence: {
        ...packet.intelligence,
        dataGaps: [...snapshotLoadGaps, ...packet.intelligence.dataGaps],
      },
    };

    return NextResponse.json({
      ok: true,
      ...packetWithGaps,
      packet: packetWithGaps,
    });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "cross_connector_certification_unavailable";
    return NextResponse.json({ ok: false, error: message, providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status: 400 });
  }
}
