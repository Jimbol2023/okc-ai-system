import { apiError } from "@/lib/api-response";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { createRevenueCommandCenter, ensureConnectorDefinitions } from "@/lib/revenue-spine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    await ensureConnectorDefinitions();

    return Response.json(await createRevenueCommandCenter(await listDbLeads()));
  } catch (error) {
    console.error("GET /api/revenue/command-center failed:", error);

    return apiError("Unable to load revenue command center.", 500);
  }
}
