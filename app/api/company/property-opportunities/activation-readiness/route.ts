import { NextResponse } from "next/server";
import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { listDbLeads } from "@/lib/leads-db";
import { prisma } from "@/lib/prisma";
import { createRealOperationsReadinessReport } from "@/lib/real-operations-activation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();

  try {
    const leads = await listDbLeads({ tenantId: actor.tenantId });
    const report = await createRealOperationsReadinessReport({
      db: prisma,
      tenantId: actor.tenantId,
      leads,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    });
    return NextResponse.json({ ok: true, report }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Unable to inspect real-operations readiness.", providerCalled: false, liveExecutionAllowed: false },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  }
}
