import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";

function getAutomationDryRunBoundary() {
  return {
    ok: true,
    dryRun: true,
    automationExecuted: false,
    providerCalled: false,
    sent: false,
    wouldSendSms: false,
    wouldSendEmail: false,
    wouldMutateLead: false,
    wouldCreateLeads: false,
    reason: "dry_run_boundary",
    safety: {
      authenticated: true,
      readOnly: true,
      smsBlocked: true,
      emailBlocked: true,
      providerBlocked: true,
      dbWritesBlocked: true,
      leadCreationBlocked: true,
      liveAutomationBlocked: true,
    },
    queuedAutomationActions: [],
    summary:
      "Dry-run boundary only. No live automation executed, no leads were created, no records were mutated, and no SMS/email/provider calls were made.",
    ranAt: new Date().toISOString(),
  };
}

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json(getAutomationDryRunBoundary());
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  return NextResponse.json(getAutomationDryRunBoundary());
}
