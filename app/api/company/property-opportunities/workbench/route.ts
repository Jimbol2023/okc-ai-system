import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { createPrismaPropertyOpportunityDb } from "@/lib/property-opportunity-db";
import {
  createPropertyOpportunityWorkbenchReport,
  previewCountyRecordImportScore,
  type CountyRecordImportInput,
} from "@/lib/property-opportunity-workbench";
import {
  listPropertyOpportunities,
  listPropertyOpportunityFilters,
  upsertManualDfdPropertyOpportunity,
  type PropertyOpportunityRecord,
  type PropertyOpportunitySavedFilterRecord,
} from "@/lib/property-opportunity-engine";
import { createPropertyProviderSourcePriorityReport } from "@/lib/property-provider-source-priority";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isMissingPropertyOpportunityTableError(error: unknown) {
  return error instanceof Error && /PropertyOpportunity|relation .* does not exist|table .* does not exist|does not exist/i.test(error.message);
}

async function loadWorkbenchInputs(tenantId: string) {
  const leads = await listDbLeads({ tenantId });
  const propertyDb = createPrismaPropertyOpportunityDb(prisma);
  const dataAccessGaps: string[] = [];
  let opportunities: PropertyOpportunityRecord[] = [];
  let filters: PropertyOpportunitySavedFilterRecord[] = [];

  try {
    const result = await listPropertyOpportunities(propertyDb, tenantId);
    opportunities = result.opportunities;
  } catch (error) {
    if (!isMissingPropertyOpportunityTableError(error)) throw error;
    dataAccessGaps.push("PropertyOpportunity persisted evidence is not readable yet; workbench is using real leads only.");
  }

  try {
    const result = await listPropertyOpportunityFilters(propertyDb, tenantId);
    filters = result.filters;
  } catch (error) {
    if (!isMissingPropertyOpportunityTableError(error)) throw error;
    dataAccessGaps.push("PropertyOpportunity saved filters are not readable yet.");
  }

  const sourcePriority = createPropertyProviderSourcePriorityReport({
    leads,
    opportunities,
    opportunityDataAccessIssue: dataAccessGaps[0] ?? null,
  });

  return { leads, opportunities, filters, sourcePriority, dataAccessGaps };
}

export async function GET(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const inputs = await loadWorkbenchInputs(context.tenantId);
    const report = createPropertyOpportunityWorkbenchReport(inputs);

    return NextResponse.json(
      {
        ok: true,
        report,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("GET /api/company/property-opportunities/workbench failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to load property opportunity workbench.",
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

export async function POST(request: Request) {
  try {
    const context = await getAuthenticatedRequestContext(request);
    if (!context) return getUnauthorizedApiResponse();

    const payload = await request.json() as CountyRecordImportInput & { previewOnly?: boolean };
    const preview = previewCountyRecordImportScore(payload);

    if (payload.previewOnly === true) {
      return NextResponse.json(
        {
          ok: true,
          preview,
          persisted: false,
          providerCalled: false,
          sent: false,
          published: false,
          crmMutated: false,
          liveExecutionAllowed: false,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const result = await upsertManualDfdPropertyOpportunity(createPrismaPropertyOpportunityDb(prisma), preview.opportunityInput, {
      tenantId: context.tenantId,
      actorId: context.actorId,
    });

    return NextResponse.json(
      {
        ok: true,
        preview,
        result,
        persisted: true,
        providerCalled: false,
        sent: false,
        published: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("POST /api/company/property-opportunities/workbench failed:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Unable to import county property evidence.",
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
