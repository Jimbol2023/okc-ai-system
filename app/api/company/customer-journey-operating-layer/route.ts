import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createAiWorkforceReport } from "@/lib/ai-workforce";
import { createConnectorActivationGate } from "@/lib/connector-activation-gate";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import {
  assertCustomerJourneyOperatingLayerSafety,
  createCustomerJourneyOperatingLayerReportFromInputs,
} from "@/lib/customer-journey-operating-layer";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import { createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import { listDbLeads } from "@/lib/leads-db";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { createReadOnlyConnectorAdapterReport } from "@/lib/read-only-connector-adapters";
import { createRevenueIntelligenceOpportunityEngineReportFromInputs } from "@/lib/revenue-intelligence-opportunity-engine";
import { createRevenueCommandCenter } from "@/lib/revenue-spine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

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
    const revenueIntelligence = createRevenueIntelligenceOpportunityEngineReportFromInputs({
      departmentOperatingSystem,
      marketCustomerIntelligence,
      revenueCommandCenter,
      generatedAt: gate.generatedAt,
    });
    const report = createCustomerJourneyOperatingLayerReportFromInputs({
      enterpriseOpportunities: revenueIntelligence.enterpriseOpportunities,
      generatedAt: gate.generatedAt,
    });
    assertCustomerJourneyOperatingLayerSafety(report);

    return NextResponse.json({
      ...report,
      upstreamSprints: ["10E", "11", "12", "12F"],
      connectorAdapterSafety: adapterReport.safety,
    });
  } catch (error) {
    console.error("GET /api/company/customer-journey-operating-layer failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load customer journey operating layer.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
