import { apiError } from "@/lib/api-response";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { listKnowledgeItems } from "@/lib/knowledge";
import { listDbLeads } from "@/lib/leads-db";
import { listMarketingWorkflow } from "@/lib/marketing-workflow";
import { normalizeGlobalSearchQuery, searchGlobalRecords } from "@/lib/global-search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const url = new URL(request.url);
    const query = normalizeGlobalSearchQuery(url.searchParams.get("q") ?? "");

    if (query.length < 2) {
      return apiError("Search query must be at least 2 characters.", 400);
    }

    const [leads, knowledgeItems, marketingWorkflow] = await Promise.all([listDbLeads(), listKnowledgeItems(), listMarketingWorkflow()]);

    return Response.json(
      searchGlobalRecords({
        query,
        leads,
        knowledgeItems,
        marketingDrafts: marketingWorkflow.drafts,
      }),
    );
  } catch (error) {
    console.error("GET /api/global-search failed:", error);

    return apiError("Unable to search internal records.", 500);
  }
}
