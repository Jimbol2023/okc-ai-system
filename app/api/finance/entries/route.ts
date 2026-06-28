import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { calculateFinanceKpis, createFinanceEntry, listFinanceEntries } from "@/lib/finance";
import { listDbLeads } from "@/lib/leads-db";
import { createFinanceEntrySchema } from "@/lib/validations/finance";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const [entries, leads] = await Promise.all([listFinanceEntries(), listDbLeads()]);

    return NextResponse.json({
      ok: true,
      entries,
      kpis: calculateFinanceKpis({ entries, leadCount: leads.length }),
      providerCalled: false,
      spendAutomated: false,
    });
  } catch (error) {
    console.error("GET /api/finance/entries failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to load finance entries.", providerCalled: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const payload = await request.json();
    const parsed = createFinanceEntrySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten(), providerCalled: false }, { status: 400 });
    }

    const entry = await createFinanceEntry(parsed.data);

    return NextResponse.json({
      ok: true,
      entry,
      providerCalled: false,
      spendAutomated: false,
      accountingSystem: false,
    });
  } catch (error) {
    console.error("POST /api/finance/entries failed:", error);

    return NextResponse.json({ ok: false, error: "Unable to save finance entry.", providerCalled: false }, { status: 500 });
  }
}
