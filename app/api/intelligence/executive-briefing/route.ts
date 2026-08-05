import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getDailyMission } from "@/lib/daily-mission";
import { createExecutiveBriefing } from "@/lib/phase2-intelligence";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) {
    return getUnauthorizedApiResponse();
  }

  const { searchParams } = new URL(request.url);
  const cadence = searchParams.get("cadence");
  const includeLegacy = searchParams.get("legacy") === "true";

  if (!includeLegacy && (!cadence || cadence === "daily")) {
    const dailyMission = await getDailyMission(actor.tenantId);
    const morningBrief = dailyMission.morningBrief;

    return NextResponse.json({
      ok: true,
      cadence: "daily",
      generatedAt: morningBrief.generatedAt,
      morningBrief,
      dailyMission,
      priorities: morningBrief.todayPriorities.map((title, index) => ({
        title,
        reason: morningBrief.departmentRecommendations[index]?.recommendation ?? "Review live business data snapshot.",
        confidence: morningBrief.departmentRecommendations[index]?.confidence ?? 60,
        requiredAction: "review",
        safeAutoStatus: "auto_allowed_internal",
      })),
      connectorHealth: morningBrief.connectorHealth,
      featureFlags: morningBrief.featureFlags,
      dataGaps: dailyMission.dataGaps,
      providerCalled: false,
      liveExecutionAllowed: false,
      safetyFlags: dailyMission.safetyFlags,
    });
  }

  return NextResponse.json(createExecutiveBriefing(cadence === "weekly" || cadence === "monthly" ? cadence : "daily"));
}
