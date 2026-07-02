import { prisma } from "@/lib/prisma";
import {
  getCompanyDepartmentRegistry,
  ownerForOutput,
  type AiDepartmentName,
  type CeoDecisionType,
  type ExecutiveDirective,
} from "@/lib/company-orchestrator";

const tenantId = "default";

export const departmentIntelligenceSafety = {
  providerCalled: false,
  liveExecutionAllowed: false,
  published: false,
  sent: false,
  outreachBlocked: true,
  workflowExecutionBlocked: true,
  scrapingBlocked: true,
  adsBlocked: true,
  emailBlocked: true,
  smsBlocked: true,
  approvalRequired: true,
} as const;

export const decisionReasonTemplates = {
  approve: ["High ROI", "Strong brand value", "Urgent revenue opportunity", "Low risk"],
  request_changes: ["Brand risk", "Weak CTA", "Insufficient source data", "Unclear owner"],
  reject: ["Low revenue value", "Too risky", "Duplicate work", "Not aligned"],
  defer: ["Timing", "Dependency missing", "Awaiting outcome data"],
} as const;

export type DepartmentMemoryEventInput = {
  memoryKey: string;
  department: AiDepartmentName;
  directiveId?: string;
  assignmentId?: string;
  draftQueueItemId?: string;
  eventType: "ceo_decision" | "department_assignment" | "draft_queue_item" | "revision_requested";
  summary: string;
  lesson: string;
  recommendation: string;
  metrics: Record<string, string | number | boolean>;
  evidenceLabels: string[];
  confidence: number;
  outcome: "insufficient_outcome_data" | "outcome_pending" | "approved_internal_workflow" | "rejected" | "deferred" | "changes_requested";
  assumptions: string[];
};

export type DepartmentRecommendation = {
  id: string;
  title: string;
  summary: string;
  score: number;
  expectedBusinessValue: string;
  sourceLabel: string;
  assumption: string;
  approvalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DepartmentIntelligenceSummary = {
  department: AiDepartmentName;
  memoryStatus: "no_memory" | "memory_started" | "outcome_pending" | "outcome_supported";
  eventCount: number;
  latestLesson: string;
  highRoiFocus: string;
  recommendations: DepartmentRecommendation[];
  lessonsLearned: string[];
  sourceLabels: string[];
  assumptions: string[];
  confidence: number;
  safety: typeof departmentIntelligenceSafety;
};

export type DepartmentIntelligenceReport = {
  generatedAt: string;
  summary: string;
  departments: DepartmentIntelligenceSummary[];
  topRecommendations: DepartmentRecommendation[];
  decisionReasonTemplates: typeof decisionReasonTemplates;
  safety: typeof departmentIntelligenceSafety;
};

type DepartmentMemoryRecord = DepartmentMemoryEventInput & {
  id?: string;
  createdAt?: Date;
};

type DepartmentMemoryDelegate<TRecord extends { id?: string }> = {
  upsert(args: unknown): Promise<TRecord>;
  findMany(args?: unknown): Promise<TRecord[]>;
  create(args: unknown): Promise<TRecord>;
};

export type DepartmentMemoryWritableTx = {
  aiDepartmentMemoryEvent: DepartmentMemoryDelegate<DepartmentMemoryRecord>;
  aiDepartmentIntelligenceSnapshot: DepartmentMemoryDelegate<{ id?: string }>;
};

type DepartmentMemoryDb = Omit<typeof prisma, "$transaction"> & DepartmentMemoryWritableTx;

const db = prisma as unknown as DepartmentMemoryDb;

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreRecommendation(params: { eventCount: number; confidence: number; hasOutcomeData: boolean }) {
  const base = params.hasOutcomeData ? 72 : 58;
  const memoryDepth = Math.min(params.eventCount * 4, 16);

  return clampScore(base + memoryDepth + params.confidence * 0.12);
}

function departmentFocus(department: AiDepartmentName) {
  if (department === "Marketing AI") return "Turn approved seller-education directives into complete draft campaign packages.";
  if (department === "SEO AI") return "Support campaigns with keyword, refresh, and internal-linking recommendations.";
  if (department === "Design AI") return "Prepare manual creative briefs that strengthen trust and conversion.";
  if (department === "Sales AI") return "Prepare manual follow-up scripts and seller conversation support.";
  if (department === "Lead Intelligence AI") return "Improve seller lead quality assumptions and source attribution.";
  if (department === "Revenue AI") return "Rank department work by qualified lead and pipeline value.";
  if (department === "Executive AI") return "Summarize department outputs and clarify CEO decisions.";
  if (department === "Brand Intelligence AI") return "Protect brand trust before any public-facing draft reaches final approval.";

  return "Contribute evidence-labeled internal recommendations through AI COO only.";
}

function lessonForDecision(decision: CeoDecisionType) {
  if (decision === "approve") return "CEO approval activates internal preparation, not external execution.";
  if (decision === "request_changes") return "CEO requested changes must pause affected work and route revision context to Executive AI.";
  if (decision === "reject") return "Rejected directives become closed learning context, not department work.";

  return "Deferred directives preserve context without activating departments.";
}

function recommendationForDecision(decision: CeoDecisionType) {
  if (decision === "approve") return "Prepare internal assignments and draft queue items, then wait for brand review and CEO final approval.";
  if (decision === "request_changes") return "Revise the directive brief before assigning production work.";
  if (decision === "reject") return "Do not create assignments or drafts; retain rejection reason for future prioritization.";

  return "Hold directive in deferred review until the reminder or dependency is ready.";
}

function outcomeForDecision(decision: CeoDecisionType): DepartmentMemoryEventInput["outcome"] {
  if (decision === "approve") return "approved_internal_workflow";
  if (decision === "request_changes") return "changes_requested";
  if (decision === "reject") return "rejected";

  return "deferred";
}

export function createDepartmentMemoryPlan({
  directive,
  decision,
  note,
}: {
  directive: ExecutiveDirective;
  decision: CeoDecisionType;
  note?: string;
}): DepartmentMemoryEventInput[] {
  const evidenceLabels = [`executive_directive:${directive.id}`, "company_orchestrator", "ceo_decision_log"];
  const assumptions = [
    "Department Memory is internal evidence context only.",
    "No campaign performance is claimed until real lead, source, or outcome data exists.",
  ];
  const events: DepartmentMemoryEventInput[] = [
    {
      memoryKey: `directive:${directive.id}:decision:${decision}`,
      department: "Executive AI",
      directiveId: directive.id,
      eventType: "ceo_decision",
      summary: `${directive.title} received CEO decision: ${decision}.`,
      lesson: lessonForDecision(decision),
      recommendation: recommendationForDecision(decision),
      metrics: {
        assignedDepartmentCount: directive.assigned_departments.length,
        requestedOutputCount: directive.requested_outputs.length,
        hasDecisionNote: Boolean(note?.trim()),
      },
      evidenceLabels,
      confidence: decision === "approve" ? 82 : 74,
      outcome: outcomeForDecision(decision),
      assumptions,
    },
  ];

  if (decision === "approve") {
    for (const department of directive.assigned_departments) {
      events.push({
        memoryKey: `directive:${directive.id}:assignment:${department}`,
        department,
        directiveId: directive.id,
        eventType: "department_assignment",
        summary: `${department} was activated for internal preparation on ${directive.title}.`,
        lesson: "Department work starts only after CEO approval and remains internal until final approval.",
        recommendation: departmentFocus(department),
        metrics: {
          assignedDepartmentCount: directive.assigned_departments.length,
          requestedOutputCount: directive.requested_outputs.length,
        },
        evidenceLabels: [...evidenceLabels, `department:${department}`],
        confidence: 78,
        outcome: "outcome_pending",
        assumptions,
      });
    }

    for (const output of directive.requested_outputs) {
      const ownerDepartment = ownerForOutput(output);

      events.push({
        memoryKey: `directive:${directive.id}:draft:${output}`,
        department: ownerDepartment,
        directiveId: directive.id,
        eventType: "draft_queue_item",
        summary: `${ownerDepartment} owns internal draft item: ${output}.`,
        lesson: "Draft queue population is preparation only; performance outcomes are pending until real business results exist.",
        recommendation: `Prepare ${output} with source labels, assumptions, and approval requirements visible.`,
        metrics: {
          draftCreated: true,
          externalExecutionAllowed: false,
        },
        evidenceLabels: [...evidenceLabels, `draft_output:${output}`],
        confidence: 76,
        outcome: "outcome_pending",
        assumptions,
      });
    }
  }

  if (decision === "request_changes") {
    events.push({
      memoryKey: `directive:${directive.id}:revision:executive-ai`,
      department: "Executive AI",
      directiveId: directive.id,
      eventType: "revision_requested",
      summary: `Executive AI received a revision task for ${directive.title}.`,
      lesson: "Change requests should improve decision quality before departments continue.",
      recommendation: "Clarify the directive, update the executive summary, and return it to CEO review.",
      metrics: {
        hasDecisionNote: Boolean(note?.trim()),
        affectedDepartmentsPaused: directive.assigned_departments.length,
      },
      evidenceLabels: [...evidenceLabels, "revision_task"],
      confidence: 80,
      outcome: "changes_requested",
      assumptions,
    });
  }

  return events;
}

export async function recordDepartmentMemoryEvents(tx: DepartmentMemoryWritableTx, events: DepartmentMemoryEventInput[]) {
  for (const event of events) {
    await tx.aiDepartmentMemoryEvent.upsert({
      where: { memoryKey: event.memoryKey },
      create: {
        tenantId,
        ...event,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      update: {
        summary: event.summary,
        lesson: event.lesson,
        recommendation: event.recommendation,
        metrics: event.metrics,
        evidenceLabels: event.evidenceLabels,
        confidence: event.confidence,
        outcome: event.outcome,
        assumptions: event.assumptions,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  }
}

function normalizeMemoryRecord(record: Partial<DepartmentMemoryRecord>): DepartmentMemoryRecord {
  return {
    memoryKey: record.memoryKey ?? "memory:unknown",
    department: record.department ?? "Executive AI",
    directiveId: record.directiveId,
    assignmentId: record.assignmentId,
    draftQueueItemId: record.draftQueueItemId,
    eventType: record.eventType ?? "ceo_decision",
    summary: record.summary ?? "Department memory event requires review.",
    lesson: record.lesson ?? "No lesson has been recorded yet.",
    recommendation: record.recommendation ?? "Gather more approved internal evidence before changing department behavior.",
    metrics: record.metrics ?? {},
    evidenceLabels: record.evidenceLabels ?? ["department_memory"],
    confidence: record.confidence ?? 0,
    outcome: record.outcome ?? "insufficient_outcome_data",
    assumptions: record.assumptions ?? ["Memory record was normalized from partial data."],
    createdAt: record.createdAt,
  };
}

export function createDepartmentIntelligenceReportFromEvents(
  records: Partial<DepartmentMemoryRecord>[],
  generatedAt = new Date().toISOString(),
): DepartmentIntelligenceReport {
  const events = records.map(normalizeMemoryRecord);
  const departments = getCompanyDepartmentRegistry().map((department) => department.name);
  const departmentSummaries = departments.map((department) => {
    const departmentEvents = events.filter((event) => event.department === department);
    const latest = departmentEvents[0];
    const outcomeEvents = departmentEvents.filter((event) => event.outcome !== "insufficient_outcome_data");
    const hasRealBusinessOutcome = departmentEvents.some((event) => !["insufficient_outcome_data", "outcome_pending"].includes(event.outcome));
    const memoryStatus =
      departmentEvents.length === 0
        ? "no_memory"
        : hasRealBusinessOutcome
          ? "outcome_supported"
          : outcomeEvents.length > 0
            ? "outcome_pending"
            : "memory_started";
    const confidence = departmentEvents.length
      ? clampScore(Math.round(departmentEvents.reduce((sum, event) => sum + event.confidence, 0) / departmentEvents.length))
      : 42;
    const assumption = departmentEvents.length
      ? "Department Intelligence uses internal approved workflow memory only; campaign performance is pending until real outcomes exist."
      : "No approved internal work has created department memory yet.";
    const recommendation: DepartmentRecommendation = {
      id: `department-intelligence-${department.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: `${department} next improvement`,
      summary: latest?.recommendation ?? "Wait for an approved Executive Directive before changing department work.",
      score: scoreRecommendation({
        eventCount: departmentEvents.length,
        confidence,
        hasOutcomeData: hasRealBusinessOutcome,
      }),
      expectedBusinessValue: departmentFocus(department),
      sourceLabel: latest?.evidenceLabels?.[0] ?? "department_memory_registry",
      assumption,
      approvalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
    };

    return {
      department,
      memoryStatus,
      eventCount: departmentEvents.length,
      latestLesson: latest?.lesson ?? "No department lesson has been recorded yet.",
      highRoiFocus: departmentFocus(department),
      recommendations: [recommendation],
      lessonsLearned: [...new Set(departmentEvents.map((event) => event.lesson))].slice(0, 5),
      sourceLabels: [...new Set(departmentEvents.flatMap((event) => event.evidenceLabels))].slice(0, 8),
      assumptions: [assumption, "All Department Intelligence recommendations require CEO approval before work changes."],
      confidence,
      safety: departmentIntelligenceSafety,
    } satisfies DepartmentIntelligenceSummary;
  });
  const topRecommendations = departmentSummaries
    .flatMap((department) => department.recommendations)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    generatedAt,
    summary:
      events.length > 0
        ? `${events.length} internal department memory event(s) are available for AI COO review.`
        : "Department Memory is ready, but no approved internal workflow outcomes have been recorded yet.",
    departments: departmentSummaries,
    topRecommendations,
    decisionReasonTemplates,
    safety: departmentIntelligenceSafety,
  };
}

export async function getDepartmentIntelligenceReport(): Promise<DepartmentIntelligenceReport> {
  const events = await db.aiDepartmentMemoryEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 250,
  });

  return createDepartmentIntelligenceReportFromEvents(events as Partial<DepartmentMemoryRecord>[]);
}

export async function refreshDepartmentIntelligenceSnapshots() {
  const report = await getDepartmentIntelligenceReport();

  for (const department of report.departments) {
    await db.aiDepartmentIntelligenceSnapshot.upsert({
      where: { snapshotKey: `department:${department.department}` },
      create: {
        tenantId,
        snapshotKey: `department:${department.department}`,
        department: department.department,
        summary: department.latestLesson,
        highRoiFocus: department.highRoiFocus,
        lessonsLearned: department.lessonsLearned,
        recommendationQueue: department.recommendations,
        memoryStatus: department.memoryStatus,
        confidence: department.confidence,
        sourceLabels: department.sourceLabels,
        assumptions: department.assumptions,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
      update: {
        summary: department.latestLesson,
        highRoiFocus: department.highRoiFocus,
        lessonsLearned: department.lessonsLearned,
        recommendationQueue: department.recommendations,
        memoryStatus: department.memoryStatus,
        confidence: department.confidence,
        sourceLabels: department.sourceLabels,
        assumptions: department.assumptions,
        providerCalled: false,
        sent: false,
        published: false,
        liveExecutionAllowed: false,
      },
    });
  }

  return report;
}
