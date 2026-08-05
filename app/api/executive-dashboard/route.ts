import { apiError } from "@/lib/api-response";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { createExecutiveDashboardReport } from "@/lib/executive-dashboard";
import { getCachedValue } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    return Response.json(await getCachedValue(`executive-dashboard-report:${actor.tenantId}`, 15_000, () => createExecutiveDashboardReport(actor.tenantId)));
  } catch (error) {
    console.error("GET /api/executive-dashboard failed:", error);

    return apiError("Unable to load executive dashboard.", 500);
  }
}
