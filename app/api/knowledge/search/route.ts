import { NextResponse } from "next/server";

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
      return NextResponse.json(
        {
          ok: false,
          error: "Search query must be at least 2 characters.",
          providerCalled: false,
          semanticSearchUsed: false,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(await searchKnowledge({ query }));
  } catch (error) {
    console.error("GET /api/knowledge/search failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to search internal knowledge.",
        providerCalled: false,
        semanticSearchUsed: false,
      },
      { status: 500 },
    );
  }
}
