import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { defaultExecutiveDirectives } from "@/lib/executive-directives";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    directiveKey: string;
  }>;
};

type DecisionAction = "approve" | "reject" | "request_changes" | "defer";

const actionState: Record<DecisionAction, { decision: string; status: string; approvalStatus: string; workflowState: string }> = {
  approve: {
    decision: "approved",
    status: "approved",
    approvalStatus: "approved",
    workflowState: "approved_assignment_ready",
  },
  reject: {
    decision: "rejected",
    status: "rejected",
    approvalStatus: "rejected",
    workflowState: "blocked_rejected_by_ceo",
  },
  request_changes: {
    decision: "request_changes",
    status: "changes_requested",
    approvalStatus: "changes_requested",
    workflowState: "blocked_changes_requested",
  },
  defer: {
    decision: "deferred",
    status: "deferred",
    approvalStatus: "deferred",
    workflowState: "blocked_deferred_by_ceo",
  },
};

function jsonError(error: string, status = 400) {
  return NextResponse.json({ ok: false, error, providerCalled: false, liveExecutionAllowed: false }, { status });
}

export async function POST(request: Request, { params }: RouteContext) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const { directiveKey } = await params;
  const seed = defaultExecutiveDirectives.find((directive) => directive.directiveKey === directiveKey);
  if (!seed) {
    return jsonError("Executive directive not found.", 404);
  }

  const body = (await request.json().catch(() => ({}))) as {
    action?: DecisionAction;
    decisionNote?: string;
    deferReminderAt?: string;
  };
  const action = body.action;
  if (!action || !(action in actionState)) {
    return jsonError("A valid decision action is required.");
  }

  const decisionNote = String(body.decisionNote ?? "").trim();
  if ((action === "reject" || action === "request_changes") && decisionNote.length < 3) {
    return jsonError("Decision note is required for reject or request changes.");
  }

  const deferReminderAt = body.deferReminderAt ? new Date(body.deferReminderAt) : null;
  if (body.deferReminderAt && Number.isNaN(deferReminderAt?.getTime())) {
    return jsonError("Defer reminder date is invalid.");
  }

  const now = new Date();
  const state = actionState[action];
  const directive = await prisma.aiCompanyExecutiveDirective.upsert({
    where: {
      tenantId_directiveKey: {
        tenantId: "default",
        directiveKey,
      },
    },
    create: {
      tenantId: "default",
      directiveKey,
      title: seed.title,
      summary: seed.summary,
      objective: seed.objective,
      businessGoal: seed.businessGoal,
      sourceDepartment: seed.sourceDepartment,
      assignedDepartments: [...seed.assignedDepartments],
      requestedOutputs: [...seed.requestedOutputs],
      status: state.status,
      approvalStatus: state.approvalStatus,
      workflowState: state.workflowState,
      riskLevel: seed.riskLevel,
      priority: seed.priority,
      decision: state.decision,
      decisionNote: decisionNote || `CEO marked this directive as ${state.decision}.`,
      decidedBy: "CEO",
      decidedAt: now,
      approvedBy: action === "approve" ? "CEO" : null,
      approvedAt: action === "approve" ? now : null,
      deferReminderAt: action === "defer" ? deferReminderAt : null,
      expectedBusinessValue: seed.expectedBusinessValue,
      governanceNotes: [...seed.governanceNotes],
      tags: [...seed.tags],
      source: seed.source,
      assumptions: [...seed.assumptions],
      safeMetadata: {
        decisionAction: action,
        metadataOnly: true,
        providerCalled: false,
        published: false,
        sent: false,
        scraped: false,
        outreachSent: false,
        liveExecutionAllowed: false,
      },
      providerCalled: false,
      published: false,
      sent: false,
      scraped: false,
      outreachSent: false,
      workflowStarted: false,
      liveExecutionAllowed: false,
    },
    update: {
      status: state.status,
      approvalStatus: state.approvalStatus,
      workflowState: state.workflowState,
      decision: state.decision,
      decisionNote: decisionNote || `CEO marked this directive as ${state.decision}.`,
      decidedBy: "CEO",
      decidedAt: now,
      approvedBy: action === "approve" ? "CEO" : null,
      approvedAt: action === "approve" ? now : null,
      deferReminderAt: action === "defer" ? deferReminderAt : null,
      safeMetadata: {
        decisionAction: action,
        metadataOnly: true,
        providerCalled: false,
        published: false,
        sent: false,
        scraped: false,
        outreachSent: false,
        liveExecutionAllowed: false,
      },
      providerCalled: false,
      published: false,
      sent: false,
      scraped: false,
      outreachSent: false,
      workflowStarted: false,
      liveExecutionAllowed: false,
    },
  });

  return NextResponse.json({
    ok: true,
    directive: {
      ...directive,
      decidedAt: directive.decidedAt?.toISOString() ?? null,
      approvedAt: directive.approvedAt?.toISOString() ?? null,
      deferReminderAt: directive.deferReminderAt?.toISOString() ?? null,
    },
    safetyFlags: {
      metadataOnly: true,
      providerCalled: false,
      published: false,
      sent: false,
      scraped: false,
      outreachSent: false,
      workflowStarted: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
