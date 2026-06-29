import { apiError } from "@/lib/api-response";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { buildUnifiedLeadInbox } from "@/lib/revenue-spine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return Response.json({
      ok: true,
      providerCalled: false,
      outreachSent: false,
      inbox: await buildUnifiedLeadInbox(await listDbLeads()),
    });
  } catch (error) {
    console.error("GET /api/revenue/inbox failed:", error);

    return apiError("Unable to load unified lead inbox.", 500);
  }
}
