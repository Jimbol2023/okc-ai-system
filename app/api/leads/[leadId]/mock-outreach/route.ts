import { NextResponse } from "next/server";

import { getAuthenticatedRequestContext, getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { dbLeadToStoredLead } from "@/lib/lead-record";
import { simulateMockOutreach, type MockOutreachHistoryItem } from "@/lib/mock-outreach";
import { prisma } from "@/lib/prisma";
import { evaluateOperationalEvidence, operationalEvidenceFromLead } from "@/lib/operational-evidence-guard";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

type LeadPayload = Record<string, unknown> & {
  mockOutreachHistory?: MockOutreachHistoryItem[];
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function parseLeadPayload(rawPayload: string | null): LeadPayload {
  if (!rawPayload) {
    return {};
  }

  try {
    const parsedPayload = JSON.parse(rawPayload) as LeadPayload;

    return parsedPayload && typeof parsedPayload === "object" ? parsedPayload : {};
  } catch {
    return {};
  }
}

export async function POST(request: Request, context: RouteContext) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { leadId } = await context.params;
  const actor = await getAuthenticatedRequestContext(request);
  if (!actor) return getUnauthorizedApiResponse();
  const dbLead = await prisma.lead.findFirst({
    where: { id: leadId, tenantId: actor.tenantId },
    include: { revenueLeadSources: { orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 1 } },
  });

  if (!dbLead) {
    return NextResponse.json(
      {
        ok: false,
        error: "Lead not found.",
      },
      { status: 404 },
    );
  }

  const evidenceDecision = evaluateOperationalEvidence(operationalEvidenceFromLead(dbLead));
  if (!evidenceDecision.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Operational evidence rejected.",
        reasonCodes: evidenceDecision.reasonCodes,
        sent: false,
        providerCalled: false,
        providerWrite: false,
        outreach: false,
        crmMutated: false,
        liveExecutionAllowed: false,
      },
      { status: 422 },
    );
  }

  const storedLead = dbLeadToStoredLead(dbLead);
  const result = simulateMockOutreach(storedLead);
  const payload = parseLeadPayload(dbLead.payload);
  const history = Array.isArray(payload.mockOutreachHistory) ? payload.mockOutreachHistory : [];
  const nextPayload = {
    ...payload,
    latestMockOutreachAt: result.at,
    latestMockOutreachResult: result.blocked ? "blocked" : "simulated",
    latestMockOutreachMessage: result.messagePreview,
    latestMockOutreachBlockedReasons: result.reasonCodes,
    mockOutreachHistory: [
      {
        id: result.id,
        at: result.at,
        provider: result.provider,
        mode: result.mode,
        simulated: result.simulated,
        blocked: result.blocked,
        sent: result.sent,
        wouldSend: result.wouldSend,
        providerCalled: result.providerCalled,
        targetPhone: result.targetPhone,
        messagePreview: result.messagePreview,
        reasonCodes: result.reasonCodes,
        reasons: result.reasons,
        missingRequirements: result.missingRequirements,
      },
      ...history,
    ].slice(0, 8),
  };

  const updatedLead = await prisma.lead.update({
    where: {
      id: leadId,
    },
    data: {
      payload: JSON.stringify(nextPayload),
    },
  });

  return NextResponse.json({
    ok: true,
    lead: dbLeadToStoredLead(updatedLead),
    result,
    sent: false,
    wouldSend: false,
    providerCalled: false,
    simulated: result.simulated,
    provider: result.provider,
    mode: result.mode,
    reasons: result.reasons,
    missingRequirements: result.missingRequirements,
    messagePreview: result.messagePreview,
    safetyCopy: result.safetyCopy,
  });
}
