import { NextResponse, type NextRequest } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createR49GovernanceStatus } from "@/lib/r49-governance-status";
import {
  evaluateRevenueReadiness,
  generateNextActions,
  generateRiskFlags,
} from "@/lib/system-readiness";
import { getSystemHealth } from "@/lib/system-health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [systemHealth, revenueReadiness] = await Promise.all([
      getSystemHealth(),
      evaluateRevenueReadiness(),
    ]);
    const riskFlags = await generateRiskFlags(systemHealth, revenueReadiness);
    const recommendedNextActions = generateNextActions(
      revenueReadiness,
      riskFlags,
    );
    const { governanceStatus } = createR49GovernanceStatus({
      status: systemHealth.status === "critical" ? "remediation_required" : "simulation_stack_complete",
      conclusion:
        systemHealth.status === "critical"
          ? "Read-only governance visibility is blocked by critical system health. No execution is authorized."
          : "R49 read-only governance visibility is available. R47/R48 governance remains advisory and simulation-only.",
      remainingBlockers: systemHealth.status === "critical" ? ["System health is critical."] : [],
      requiredOperatorActions: riskFlags.map((flag) => flag.recommendedAction),
      reasonCodes: [
        "system_readiness_advisory_metadata",
        `system_health_${systemHealth.status}`,
        `database_${systemHealth.database}`,
      ],
      activationExecuted: false,
      providerActivationAllowed: false,
      liveExecutionAllowed: false,
      sent: false,
      providerCalled: false,
      canSendNow: false,
      simulationOnly: true,
      liveTestReady: false,
      persistenceAllowedNow: false,
    });

    return NextResponse.json({
      success: true,
      systemHealth,
      revenueReadiness,
      riskFlags,
      recommendedNextActions,
      governanceStatus,
    });
  } catch (error) {
    console.error("GET /api/system-readiness failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load system readiness.",
      },
      { status: 500 },
    );
  }
}
