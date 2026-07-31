import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createAiWorkforceReport } from "@/lib/ai-workforce";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { createBuyerDemandOpportunityPrioritization } from "@/lib/buyer-demand-opportunity-prioritization";
import { createConnectorActivationGate } from "@/lib/connector-activation-gate";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createCrossConnectorCertificationPacket } from "@/lib/cross-connector-certification";
import { createCrossConnectorIntelligenceReport } from "@/lib/cross-connector-intelligence";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import { createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import { listDbLeads } from "@/lib/leads-db";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { createReadOnlyConnectorAdapterReport } from "@/lib/read-only-connector-adapters";
import { getLatestTenantBusinessSnapshots } from "@/lib/read-only-business-connections";
import { createRevenueCommandCenter } from "@/lib/revenue-spine";
import {
  assertRevenueIntelligenceOpportunityEngineSafety,
  createRevenueIntelligenceOpportunityEngineReportFromInputs,
} from "@/lib/revenue-intelligence-opportunity-engine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) return getUnauthorizedApiResponse();

    const [gate, workforce, dailyLoop, leads] = await Promise.all([
      createConnectorActivationGate(),
      createAiWorkforceReport(),
      createDailyRevenueOperatingLoop(),
      listDbLeads(),
    ]);
    const adapterReport = await createReadOnlyConnectorAdapterReport(gate);
    const connectorSignals = createConnectorSignalFoundationReportFromInputs({
      snapshots: adapterReport.snapshots,
      workforce,
      dailyLoop,
      generatedAt: gate.generatedAt,
    });
    const marketCustomerIntelligence = createMarketCustomerIntelligenceFoundationReportFromInputs({
      workforce,
      dailyLoop,
      connectorSignals,
      generatedAt: gate.generatedAt,
    });
    const departmentOperatingSystem = createDepartmentOperatingSystemReportFromInputs({
      intelligence: marketCustomerIntelligence,
      generatedAt: gate.generatedAt,
    });
    const revenueCommandCenter = await createRevenueCommandCenter(leads);
    const contractedSnapshots = (await getLatestTenantBusinessSnapshots(actor.tenantId, 200))
      .filter((snapshot) => snapshot.contractVersion === "business-data-snapshot-v1" && typeof snapshot.evidenceHash === "string" && snapshot.evidenceHash.length > 0);
    const crossConnectorIntelligence = contractedSnapshots.length > 0
      ? createCrossConnectorIntelligenceReport({ tenantId: actor.tenantId, snapshots: contractedSnapshots, generatedAt: gate.generatedAt })
      : null;
    const crossConnectorCertification = crossConnectorIntelligence
      ? createCrossConnectorCertificationPacket({ tenantId: actor.tenantId, intelligence: crossConnectorIntelligence, generatedAt: gate.generatedAt })
      : null;
    const buyerDemandSignals = await getBuyerDemandSignals().catch(() => null);
    const buyerDemandPrioritization = crossConnectorCertification
      ? createBuyerDemandOpportunityPrioritization({ tenantId: actor.tenantId, certification: crossConnectorCertification, buyerDemandSignals, generatedAt: gate.generatedAt })
      : null;
    const report = createRevenueIntelligenceOpportunityEngineReportFromInputs({
      departmentOperatingSystem,
      marketCustomerIntelligence,
      revenueCommandCenter,
      crossConnectorIntelligence,
      buyerDemandPrioritization,
      generatedAt: gate.generatedAt,
    });
    assertRevenueIntelligenceOpportunityEngineSafety(report);

    return NextResponse.json({
      ...report,
      upstreamSprints: ["10E", "11"],
      connectorAdapterSafety: adapterReport.safety,
      crossConnectorIntelligence,
      crossConnectorCertification,
      buyerDemandPrioritization,
    });
  } catch (error) {
    console.error("GET /api/company/revenue-intelligence failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load revenue intelligence opportunity engine.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
