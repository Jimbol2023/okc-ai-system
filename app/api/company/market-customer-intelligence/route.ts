import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createAiWorkforceReport } from "@/lib/ai-workforce";
import { createConnectorActivationGate } from "@/lib/connector-activation-gate";
import { assertConnectorSignalFoundationSafety, createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
import {
  assertMarketCustomerIntelligenceFoundationSafety,
  createMarketCustomerIntelligenceFoundationReportFromInputs,
} from "@/lib/market-customer-intelligence-foundation";
import { createReadOnlyConnectorAdapterReport } from "@/lib/read-only-connector-adapters";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [gate, workforce, dailyLoop] = await Promise.all([
      createConnectorActivationGate(),
      createAiWorkforceReport(),
      createDailyRevenueOperatingLoop(),
    ]);
    const adapterReport = await createReadOnlyConnectorAdapterReport(gate);
    const connectorSignals = createConnectorSignalFoundationReportFromInputs({
      snapshots: adapterReport.snapshots,
      workforce,
      dailyLoop,
      generatedAt: gate.generatedAt,
    });
    assertConnectorSignalFoundationSafety(connectorSignals);
    const report = createMarketCustomerIntelligenceFoundationReportFromInputs({
      workforce,
      dailyLoop,
      connectorSignals,
      generatedAt: gate.generatedAt,
    });
    assertMarketCustomerIntelligenceFoundationSafety(report);

    return NextResponse.json({
      ...report,
      connectorAdapterSafety: adapterReport.safety,
    });
  } catch (error) {
    console.error("GET /api/company/market-customer-intelligence failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load market/customer intelligence foundation.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
