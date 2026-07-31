import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { createBuyerDemandCertificationPacket } from "@/lib/buyer-demand-certification";
import { createBuyerDemandOpportunityPrioritization } from "@/lib/buyer-demand-opportunity-prioritization";
import { createCrossConnectorCertificationPacket } from "@/lib/cross-connector-certification";
import { getLatestTenantBusinessSnapshots } from "@/lib/read-only-business-connections";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();

  try {
    const dataGaps: string[] = [];
    const [snapshots, buyerDemandSignals] = await Promise.all([
      getLatestTenantBusinessSnapshots(actor.tenantId, 200).catch(() => {
        dataGaps.push("Normalized tenant snapshot store is unavailable for buyer-demand certification; no provider read was attempted.");
        return [];
      }),
      getBuyerDemandSignals().catch(() => {
        dataGaps.push("Internal buyer-demand signal store is unavailable for certification; no external data was requested.");
        return null;
      }),
    ]);
    const contracted = snapshots.filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    const crossConnectorCertification = createCrossConnectorCertificationPacket({ tenantId: actor.tenantId, snapshots: contracted });
    const certificationWithDataGaps =
      dataGaps.length === 0
        ? crossConnectorCertification
        : {
            ...crossConnectorCertification,
            readinessFailures: [...dataGaps, ...crossConnectorCertification.readinessFailures],
            ceoReviewNotes: [...dataGaps, ...crossConnectorCertification.ceoReviewNotes],
            intelligence: {
              ...crossConnectorCertification.intelligence,
              dataGaps: [...dataGaps, ...crossConnectorCertification.intelligence.dataGaps],
            },
          };
    const prioritization = createBuyerDemandOpportunityPrioritization({
      tenantId: actor.tenantId,
      certification: certificationWithDataGaps,
      buyerDemandSignals,
    });
    const packet = createBuyerDemandCertificationPacket({
      tenantId: actor.tenantId,
      prioritization,
      additionalDataGaps: dataGaps,
    });

    return NextResponse.json({
      ok: true,
      packet,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
      crmMutationAllowed: false,
      outreachAllowed: false,
      automationAllowed: false,
    });
  } catch (error) {
    const message = error instanceof Error && /^[a-z0-9_:.-]{1,160}$/.test(error.message) ? error.message : "buyer_demand_certification_unavailable";
    return NextResponse.json({ ok: false, error: message, providerCalled: false, externalWritesAllowed: false, liveExecutionAllowed: false }, { status: 400 });
  }
}
