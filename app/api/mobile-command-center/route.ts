import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getDailyMission } from "@/lib/daily-mission";
import { createMobileCommandCenter, createVerticalSliceSimulation } from "@/lib/phase3-production-execution";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) {
    return getUnauthorizedApiResponse();
  }

  const { searchParams } = new URL(request.url);

  if (searchParams.get("includeVerticalSlice") === "true") {
    return NextResponse.json(createVerticalSliceSimulation());
  }

  const commandCenter = createMobileCommandCenter();
  const dailyMission = await getDailyMission(actor.tenantId);

  return NextResponse.json({
    ...commandCenter,
    panels: {
      ...commandCenter.panels,
      executiveBriefing: dailyMission.urgentCeoDecisions.map((decision) => ({
        title: decision.title,
        reason: decision.reason,
        confidence: decision.riskLevel === "high" ? 60 : 75,
        requiredAction: "review",
        safeAutoStatus: "auto_allowed_internal",
      })),
      connectorHealth: dailyMission.connectorHealth,
      dailyMission,
    },
    morningBrief: dailyMission.morningBrief,
    dailyMission,
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
