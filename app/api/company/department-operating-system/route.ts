import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createAiWorkforceReport } from "@/lib/ai-workforce";
import { createConnectorActivationGate } from "@/lib/connector-activation-gate";
import { createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import { assertDepartmentOperatingSystemSafety, createDepartmentOperatingSystemReportFromInputs } from "@/lib/department-operating-system";
import { createMarketCustomerIntelligenceFoundationReportFromInputs } from "@/lib/market-customer-intelligence-foundation";
import { createReadOnlyConnectorAdapterReport } from "@/lib/read-only-connector-adapters";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    const [gate, workforce, dailyLoop] = await Promise.all([
      createConnectorActivationGate(),
      createAiWorkforceReport(),
      createDailyRevenueOperatingLoop(actor.tenantId),
    ]);
    const adapterReport = await createReadOnlyConnectorAdapterReport(gate);
    const connectorSignals = createConnectorSignalFoundationReportFromInputs({
      snapshots: adapterReport.snapshots,
      workforce,
      dailyLoop,
      generatedAt: gate.generatedAt,
    });
    const intelligence = createMarketCustomerIntelligenceFoundationReportFromInputs({
      workforce,
      dailyLoop,
      connectorSignals,
      generatedAt: gate.generatedAt,
    });
    const report = createDepartmentOperatingSystemReportFromInputs({
      intelligence,
      generatedAt: gate.generatedAt,
    });
    assertDepartmentOperatingSystemSafety(report);

    return NextResponse.json({
      ...report,
      upstreamSprint: "10E",
      connectorAdapterSafety: adapterReport.safety,
    });
  } catch (error) {
    console.error("GET /api/company/department-operating-system failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load department operating system.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
