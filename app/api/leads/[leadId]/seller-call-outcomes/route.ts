import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSellerCallOutcome, listSellerCallOutcomesByLeadId, type SellerCallOutcomeRecord } from "@/lib/seller-call-outcomes-db";
import { validateSellerCallOutcomePayload } from "@/lib/seller-call-outcome-validation";

type RouteContext = {
  params: Promise<{
    leadId: string;
  }>;
};

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(error: string, status = 400) {
  return NextResponse.json(
    {
      ok: false,
      error,
      sent: false,
      wouldSend: false,
      automationTriggered: false,
      providerCalled: false,
    },
    { status },
  );
}

function serializeOutcome(outcome: SellerCallOutcomeRecord) {
  return {
    ...outcome,
    callCompletedAt: outcome.callCompletedAt.toISOString(),
    createdAt: outcome.createdAt.toISOString(),
  };
}

async function ensureLeadExists(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
    select: {
      id: true,
    },
  });

  return Boolean(lead);
}

export async function GET(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;

    if (!(await ensureLeadExists(leadId))) {
      return jsonError("Lead not found.", 404);
    }

    const outcomes = await listSellerCallOutcomesByLeadId(leadId);

    return NextResponse.json({
      ok: true,
      outcomes: outcomes.map(serializeOutcome),
      sent: false,
      wouldSend: false,
      automationTriggered: false,
      providerCalled: false,
    });
  } catch (error) {
    console.error("GET /api/leads/[leadId]/seller-call-outcomes failed:", error);

    return jsonError("Unable to load seller call outcomes right now.", 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    if (!(await isAuthenticatedRequest(request))) {
      return getUnauthorizedApiResponse();
    }

    const { leadId } = await context.params;

    if (!(await ensureLeadExists(leadId))) {
      return jsonError("Lead not found.", 404);
    }

    const validation = validateSellerCallOutcomePayload(await request.json());

    if (!validation.ok) {
      return NextResponse.json(
        {
          ok: false,
          errors: validation.errors,
          sent: false,
          wouldSend: false,
          automationTriggered: false,
          providerCalled: false,
        },
        { status: 400 },
      );
    }

    const outcome = await createSellerCallOutcome(leadId, validation.data);

    return NextResponse.json({
      ok: true,
      outcome: serializeOutcome(outcome),
      sent: false,
      wouldSend: false,
      automationTriggered: false,
      providerCalled: false,
      safetyCopy: [
        "Seller call outcome captured for human review only.",
        "No SMS or email was sent.",
        "No provider was called.",
        "No automation was triggered.",
        "No DNC, approval, follow-up, or lead execution state was changed.",
      ],
    });
  } catch (error) {
    console.error("POST /api/leads/[leadId]/seller-call-outcomes failed:", error);

    return jsonError("Unable to save seller call outcome right now.", 500);
  }
}
