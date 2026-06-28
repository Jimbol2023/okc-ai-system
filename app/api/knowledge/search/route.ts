import { apiError } from "@/lib/api-response";
import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { normalizeKnowledgeSearchQuery, searchKnowledge } from "@/lib/knowledge-search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const url = new URL(request.url);
    const query = normalizeKnowledgeSearchQuery(url.searchParams.get("q") ?? "");

    if (query.length < 2) {
      return apiError("Search query must be at least 2 characters.", 400);
    }

    return Response.json(await searchKnowledge({ query }));
  } catch (error) {
    console.error("GET /api/knowledge/search failed:", error);

    return apiError("Unable to search internal knowledge.", 500);
  }
}
