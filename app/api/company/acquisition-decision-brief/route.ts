import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse } from "@/lib/auth";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { createAcquisitionDecisionBrief } from "@/lib/enterprise-professional-workforce";
import { getDbLeadById } from "@/lib/leads-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const requestSchema = z.object({ leadId: z.string().trim().min(1).max(200) }).strict();

export async function POST(request: Request) {
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "A valid leadId is required.", providerCalled: false, liveExecutionAllowed: false }, { status: 400 });
  const lead = await getDbLeadById(actor, parsed.data.leadId);
  if (!lead) return NextResponse.json({ ok: false, error: "Lead not found.", providerCalled: false, liveExecutionAllowed: false }, { status: 404 });
  const buyerDemand = await getBuyerDemandSignals().catch(() => null);
  return NextResponse.json({ ok: true, brief: createAcquisitionDecisionBrief({ lead, buyerDemand }), dataGaps: buyerDemand ? [] : ["Buyer-demand data was unavailable; the brief exposes that gap."], providerCalled: false, liveExecutionAllowed: false });
}
