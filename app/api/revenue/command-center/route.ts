import { apiError } from "@/lib/api-response";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { createRevenueCommandCenter, ensureConnectorDefinitions } from "@/lib/revenue-spine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const actor = await getAuthenticatedRequestContext(request);
    if (!actor) {
      return getUnauthorizedApiResponse();
    }

    await ensureConnectorDefinitions();

    return Response.json(await createRevenueCommandCenter(actor.tenantId, await listDbLeads(actor)));
  } catch (error) {
    console.error("GET /api/revenue/command-center failed:", error);

    return apiError("Unable to load revenue command center.", 500);
  }
}
