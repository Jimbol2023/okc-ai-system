import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { createBuyerDemandOpportunityPrioritization } from "@/lib/buyer-demand-opportunity-prioritization";
import { createCrossConnectorCertificationPacket } from "@/lib/cross-connector-certification";
import { getLatestTenantBusinessSnapshots } from "@/lib/read-only-business-connections";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();

  try {
    const snapshotLoadGaps: string[] = [];
    const [snapshots, buyerDemandSignals] = await Promise.all([
      getLatestTenantBusinessSnapshots(actor.tenantId, 200).catch(() => {
        snapshotLoadGaps.push("Normalized tenant snapshot store is unavailable for buyer-demand review; no provider read was attempted.");
        return [];
      }),
      getBuyerDemandSignals().catch(() => null),
    ]);
    const contracted = snapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    const certification = createCrossConnectorCertificationPacket({ tenantId: actor.tenantId, snapshots: contracted });
    const certificationWithSnapshotGaps =
      snapshotLoadGaps.length === 0
        ? certification
        : {
            ...certification,
            readinessFailures: [...snapshotLoadGaps, ...certification.readinessFailures],
            ceoReviewNotes: [...snapshotLoadGaps, ...certification.ceoReviewNotes],
            intelligence: {
              ...certification.intelligence,
              dataGaps: [...snapshotLoadGaps, ...certification.intelligence.dataGaps],
            },
          };
    const prioritization = createBuyerDemandOpportunityPrioritization({ tenantId: actor.tenantId, certification: certificationWithSnapshotGaps, buyerDemandSignals });

    return NextResponse.json({ ok: true, ...prioritization, report: prioritization });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "buyer_demand_prioritization_unavailable";
    return NextResponse.json({ ok: false, error: message, providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status: 400 });
  }
}
