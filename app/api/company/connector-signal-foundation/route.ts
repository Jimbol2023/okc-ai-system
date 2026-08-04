import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createAiWorkforceReport } from "@/lib/ai-workforce";
import { createConnectorActivationGate } from "@/lib/connector-activation-gate";
import { assertConnectorSignalFoundationSafety, createConnectorSignalFoundationReportFromInputs } from "@/lib/connector-signal-normalization";
import { createDailyRevenueOperatingLoop } from "@/lib/daily-revenue-operating-loop";
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
    const report = createConnectorSignalFoundationReportFromInputs({
      snapshots: adapterReport.snapshots,
      workforce,
      dailyLoop,
      generatedAt: gate.generatedAt,
    });
    assertConnectorSignalFoundationSafety(report);

    return NextResponse.json({
      ...report,
      adapterSafety: adapterReport.safety,
    });
  } catch (error) {
    console.error("GET /api/company/connector-signal-foundation failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load connector signal foundation.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 500 },
    );
  }
}
