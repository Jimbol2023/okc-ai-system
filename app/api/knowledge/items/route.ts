import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createKnowledgeItem, knowledgeDocReferences, listKnowledgeItems } from "@/lib/knowledge";
import { createKnowledgeItemSchema } from "@/lib/validations/knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    return NextResponse.json({
      ok: true,
      items: await listKnowledgeItems(),
      docReferences: knowledgeDocReferences,
      providerCalled: false,
      generatedLegalAdvice: false,
    });
  } catch (error) {
    console.error("GET /api/knowledge/items failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to load knowledge items.", providerCalled: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = createKnowledgeItemSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten(), providerCalled: false }, { status: 400 });
    }

    const item = await createKnowledgeItem(parsed.data);

    return NextResponse.json({
      ok: true,
      item,
      providerCalled: false,
      generatedLegalAdvice: false,
    });
  } catch (error) {
    console.error("POST /api/knowledge/items failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to save knowledge item.", providerCalled: false }, { status: 500 });
  }
}
