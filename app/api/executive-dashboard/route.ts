import { apiError } from "@/lib/api-response";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createExecutiveDashboardReport } from "@/lib/executive-dashboard";
import { getCachedValue } from "@/lib/server-cache";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return Response.json(await getCachedValue("executive-dashboard-report", 15_000, createExecutiveDashboardReport));
  } catch (error) {
    console.error("GET /api/executive-dashboard failed:", error);

    return apiError("Unable to load executive dashboard.", 500);
  }
}
