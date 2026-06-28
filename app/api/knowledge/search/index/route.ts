import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { indexKnowledgeSearchEmbeddings } from "@/lib/knowledge-search";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type IndexPayload = {
  sourceType?: "knowledge_item" | "doc_reference";
  sourceId?: string;
};

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = (await request.json().catch(() => ({}))) as IndexPayload;

    if (payload.sourceType && payload.sourceType !== "knowledge_item" && payload.sourceType !== "doc_reference") {
      return NextResponse.json(
        {
          ok: false,
          error: "sourceType must be knowledge_item or doc_reference.",
          providerCalled: false,
          semanticSearchUsed: false,
        },
        { status: 400 },
      );
    }

    const result = await indexKnowledgeSearchEmbeddings({
      sourceType: payload.sourceType,
      sourceId: typeof payload.sourceId === "string" && payload.sourceId.trim() ? payload.sourceId.trim() : undefined,
    });

    return NextResponse.json({
      ...result,
      generatedPropertyFacts: false,
      outreachSent: false,
      providerActivationAllowed: false,
    });
  } catch (error) {
    console.error("POST /api/knowledge/search/index failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to index knowledge search embeddings.",
        providerCalled: false,
        semanticSearchUsed: false,
      },
      { status: 500 },
    );
  }
}
