import { NextResponse } from "next/server";
import { z } from "zod";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { createDocumentIntelligencePlatformReport, reviewDocumentWorkflow } from "@/lib/document-intelligence-platform";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const documentWorkflowReviewSchema = z.object({
  workflowType: z.enum([
    "generate_document",
    "understand_document",
    "classify_document",
    "extract_structured_data",
    "transform_document",
    "document_search",
    "document_qa",
    "productivity_workflow",
  ]),
  businessModule: z.string().trim().min(2).max(80).optional(),
  documentType: z.enum([
    "contract",
    "proposal",
    "investor_deck",
    "sales_deck",
    "financial_model",
    "marketing_report",
    "business_plan",
    "product_catalog",
    "email_draft",
    "spreadsheet",
    "presentation",
    "pdf",
    "knowledge_document",
  ]),
  templateKey: z.string().trim().min(2).max(120).optional(),
  sourceRecordLabels: z.array(z.string().trim().min(2).max(120)).min(1).max(20),
  targetSuite: z.enum(["microsoft_365", "google_workspace", "canva", "adobe", "internal"]).optional(),
  connectorKeys: z.array(z.string().trim().min(2).max(120)).max(20).optional(),
  requestedTransformations: z.array(z.string().trim().min(2).max(120)).max(20).optional(),
  externalActionIntent: z.string().trim().min(2).max(120).optional(),
  containsSensitiveData: z.boolean().optional(),
});

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json({
    ok: true,
    report: createDocumentIntelligencePlatformReport(),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const payload = await request.json().catch(() => null);
  const parsed = documentWorkflowReviewSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid document intelligence workflow review request.",
        providerCalled: false,
        liveExecutionAllowed: false,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    review: reviewDocumentWorkflow(parsed.data),
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
