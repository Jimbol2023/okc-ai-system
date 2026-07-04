import { NextResponse } from "next/server";

import { getUnauthorizedApiResponse, isAuthenticatedRequest } from "@/lib/auth";
import { defaultExecutiveDirectives, type DefaultExecutiveDirective } from "@/lib/executive-directives";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function serializeDirective(directive: {
  directiveKey: string;
  title: string;
  summary: string;
  objective: string;
  businessGoal: string;
  sourceDepartment: string;
  assignedDepartments: unknown;
  requestedOutputs: unknown;
  status: string;
  approvalStatus: string;
  workflowState: string;
  riskLevel: string;
  priority: string;
  decision: string | null;
  decisionNote: string | null;
  decidedBy: string | null;
  decidedAt: Date | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  deferReminderAt: Date | null;
  expectedBusinessValue: string;
  governanceNotes: unknown;
  tags: unknown;
  source: string;
  assumptions: unknown;
  providerCalled: boolean;
  published: boolean;
  sent: boolean;
  scraped: boolean;
  outreachSent: boolean;
  workflowStarted: boolean;
  liveExecutionAllowed: boolean;
}) {
  return {
    ...directive,
    decidedAt: directive.decidedAt?.toISOString() ?? null,
    approvedAt: directive.approvedAt?.toISOString() ?? null,
    deferReminderAt: directive.deferReminderAt?.toISOString() ?? null,
  };
}

function pendingDirective(seed: DefaultExecutiveDirective) {
  return serializeDirective({
    ...seed,
    status: "awaiting_ceo_approval",
    approvalStatus: "awaiting_ceo_approval",
    workflowState: "blocked_awaiting_ceo_approval",
    decision: null,
    decisionNote: null,
    decidedBy: null,
    decidedAt: null,
    approvedBy: null,
    approvedAt: null,
    deferReminderAt: null,
    providerCalled: false,
    published: false,
    sent: false,
    scraped: false,
    outreachSent: false,
    workflowStarted: false,
    liveExecutionAllowed: false,
  });
}

export async function GET(request: Request) {
  if (!(await isAuthenticatedRequest(request))) {
    return getUnauthorizedApiResponse();
  }

  const stored = await prisma.aiCompanyExecutiveDirective.findMany({
    where: {
      tenantId: "default",
      directiveKey: { in: defaultExecutiveDirectives.map((directive) => directive.directiveKey) },
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
  });
  const byKey = new Map(stored.map((directive) => [directive.directiveKey, directive]));

  return NextResponse.json({
    ok: true,
    directives: defaultExecutiveDirectives.map((seed) => {
      const storedDirective = byKey.get(seed.directiveKey);
      return storedDirective ? serializeDirective(storedDirective) : pendingDirective(seed);
    }),
    safetyFlags: {
      metadataOnly: true,
      providerCalled: false,
      published: false,
      sent: false,
      scraped: false,
      outreachSent: false,
      liveExecutionAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  });
}
