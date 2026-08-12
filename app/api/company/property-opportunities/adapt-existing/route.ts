import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import { adaptExistingLeadsToPropertyOpportunities } from "@/lib/property-opportunity-engine";
import {
  createRealOperationsExecutiveProjection,
  createRealOperationsReadinessReport,
  parseRealOperationsActivationRequest,
  realOperationsProductionApprovalPhrase,
  realOperationsSafety,
} from "@/lib/real-operations-activation";
import { logRevenueAuditEvent } from "@/lib/revenue-spine";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(contentLength) && contentLength > 4_096) {
      return NextResponse.json({ ok: false, error: "Request body is too large.", ...realOperationsSafety }, { status: 413, headers: { "Cache-Control": "no-store" } });
    }

    const activationRequest = parseRealOperationsActivationRequest(await request.json().catch(() => null));
    if (!activationRequest.ok) return NextResponse.json({ ok: false, error: activationRequest.error, ...realOperationsSafety }, { status: activationRequest.status, headers: { "Cache-Control": "no-store" } });

    const leads = await listDbLeads({ tenantId: context.tenantId });
    const readiness = await createRealOperationsReadinessReport({
      db: prisma,
      tenantId: context.tenantId,
      leads,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    });

    if (activationRequest.mode === "dry_run") {
      return NextResponse.json({ ok: true, persisted: false, readiness }, { headers: { "Cache-Control": "no-store" } });
    }

    if (!readiness.readyForProductionAuthorization) {
      return NextResponse.json({ ok: false, error: "Real-operations readiness gate is not satisfied.", readiness, ...realOperationsSafety }, { status: 409, headers: { "Cache-Control": "no-store" } });
    }

    if (activationRequest.confirmation !== realOperationsProductionApprovalPhrase) {
      return NextResponse.json({ ok: false, error: "Exact single-operation authorization is required.", ...realOperationsSafety }, { status: 403, headers: { "Cache-Control": "no-store" } });
    }

    const report = await adaptExistingLeadsToPropertyOpportunities(createPrismaPropertyOpportunityDb(prisma), leads, context);
    const executiveProjection = createRealOperationsExecutiveProjection(report);
    await logRevenueAuditEvent({
      tenantId: context.tenantId,
      actorId: context.actorId,
      requestId: request.headers.get("x-request-id"),
      action: "existing_real_leads_adapted_to_property_opportunities",
      targetType: "PropertyOpportunity",
      source: "real_operations_activation",
      metadata: {
        scannedLeads: report.scannedLeads,
        eligiblePropertyLeads: report.eligiblePropertyLeads,
        excludedLeads: report.excludedLeads,
        ambiguousLeads: report.ambiguousLeads,
        createdOpportunities: report.createdOpportunities,
        updatedOpportunities: report.updatedOpportunities,
        acquisitionReviewTasksCreated: report.acquisitionReviewTasksCreated,
        acquisitionReviewTasksReused: report.acquisitionReviewTasksReused,
        providerCalled: false,
        outreach: false,
        externalExecutionAllowed: false,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        persisted: true,
        report,
        executiveProjection,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("POST /api/company/property-opportunities/adapt-existing failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to adapt existing leads into property opportunities.",
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
