import type { ApprovedExecutionInput } from "@/lib/approved-execution-layer";
import type {
  AiWorkforceDepartmentName,
  AiWorkforceEmployeeReadiness,
  AiWorkforceReport,
  AiWorkforceReadinessStatus,
} from "@/lib/ai-workforce";
import { createAiWorkforceReport } from "@/lib/ai-workforce";
import { logAiMemoryEvent, type AiMemoryLoggerResult } from "@/lib/ai-memory-logger";
import { getDailyMission, type DailyMission } from "@/lib/daily-mission";
import { listDbLeads } from "@/lib/leads-db";
import { createRevenueCommandCenter, ensureConnectorDefinitions, type RevenueCommandCenterReport, type RevenueInboxItem } from "@/lib/revenue-spine";
import { requireTenantId } from "@/lib/tenant-context";

export const dailyWorkOrderOutcomes = [
  "pending",
  "completed",
  "blocked",
  "deferred",
  "needs_ceo_approval",
  "appointment_created",
  "offer_prepared",
  "contract_created",
  "revenue_produced",
  "no_opportunity",
] as const;

export type DailyWorkOrderOutcome = (typeof dailyWorkOrderOutcomes)[number];
export type DailyWorkOrderStatus = "open" | "working" | "waiting" | "blocked" | "needs_ceo_approval" | "completed" | "deferred";

export const dailyOperatingReviewDecisions = [
  "approve_crm_task",
  "defer",
  "block",
  "mark_completed",
  "no_opportunity",
] as const;

export type DailyOperatingReviewDecision = (typeof dailyOperatingReviewDecisions)[number];
export type DailyOperatingReviewStatus = "approval_prepared" | "memory_logged" | "blocked" | "invalid";

export type DailyRevenueLeadReference = {
  leadId: string;
  source: string;
  propertyAddress: string;
  priority: string;
  score: number;
};

export type DailyRevenueWorkOrder = {
  id: string;
  department: AiWorkforceDepartmentName;
  aiManager: string;
  aiEmployee: string;
  aiEmployeeId: string;
  dailyInput: string[];
  dailyOutput: string[];
  revenueObjective: string;
  successKpi: string[];
  lead: DailyRevenueLeadReference | null;
  dealId: string | null;
  recommendedAction: string;
  reason: string;
  revenueImpact: "high" | "medium" | "low";
  missingData: string[];
  approvalRule: string;
  handoffTarget: string[];
  dueDate: string;
  status: DailyWorkOrderStatus;
  outcome: DailyWorkOrderOutcome;
  outputType: string;
  sourceLabels: string[];
  canCreateCrmTask: boolean;
  allowedInternalAction: "create_crm_task" | null;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DailyDepartmentQueue = {
  department: AiWorkforceDepartmentName;
  manager: string;
  status: AiWorkforceReadinessStatus | "working" | "waiting";
  employeesAssigned: string[];
  employeesWorking: string[];
  employeesWaiting: string[];
  workOrders: DailyRevenueWorkOrder[];
  blockers: string[];
  connectorIssues: string[];
  nextSafeAction: string;
};

export type DailyRevenueOperatingLoopReport = {
  ok: true;
  tenantId: string | null;
  company: "J Capital Property Group";
  missionDate: string;
  generatedAt: string;
  revenueGoal: string;
  todaysRevenueOpportunities: DailyRevenueLeadReference[];
  highestPriorityLead: DailyRevenueLeadReference | null;
  departmentQueues: DailyDepartmentQueue[];
  workOrders: DailyRevenueWorkOrder[];
  ceoDashboard: {
    todaysRevenueOpportunities: number;
    highestPriorityLead: DailyRevenueLeadReference | null;
    departmentsWaiting: string[];
    departmentsWorking: string[];
    departmentBlockers: string[];
    connectorIssues: string[];
    aiEmployeesAssigned: number;
    tasksReady: number;
    approvalsNeeded: number;
    revenueRisk: string[];
  };
  tomorrowRecommendations: string[];
  safety: {
    internalOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalProviderWritesAllowed: false;
    onlyAllowedInternalAction: "create_crm_task";
    crmTaskCreationRequiresApproval: true;
    approvalGatesPreserved: true;
  };
};

export type DailyRevenueOperatingLoopInputs = {
  tenantId?: string;
  workforce: AiWorkforceReport;
  dailyMission?: DailyMission | null;
  revenueCommandCenter?: RevenueCommandCenterReport | null;
  generatedAt?: string;
};

export type DailyWorkOrderOutcomeInput = {
  workOrderId: string;
  outcome: DailyWorkOrderOutcome;
  note?: string;
};

export type DailyOperatingReviewInput = {
  workOrderId: string;
  decision: DailyOperatingReviewDecision;
  note?: string;
  reviewedBy?: string;
};

export type DailyOperatingReviewResult = {
  ok: boolean;
  decision: DailyOperatingReviewDecision;
  workOrderId: string;
  status: DailyOperatingReviewStatus;
  workOrder: DailyRevenueWorkOrder | null;
  approvalInput?: ApprovedExecutionInput;
  memory?: AiMemoryLoggerResult;
  error?: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

const revenueDepartments = new Set<AiWorkforceDepartmentName>([
  "Lead Generation",
  "Seller Acquisition",
  "CRM",
  "County Intelligence",
  "Acquisitions",
  "Finance",
]);

const crmTaskEligibleDepartments = new Set<AiWorkforceDepartmentName>([
  "Lead Generation",
  "Seller Acquisition",
  "CRM",
  "County Intelligence",
  "Acquisitions",
  "Finance",
  "Operations",
]);

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "work";
}

function todayIso(generatedAt: string) {
  return generatedAt.slice(0, 10);
}

function dueDateFor(generatedAt: string) {
  const date = new Date(generatedAt);
  if (Number.isNaN(date.getTime())) return `${todayIso(generatedAt)}T17:00:00.000Z`;

  date.setHours(17, 0, 0, 0);

  return date.toISOString();
}

function leadReference(item: RevenueInboxItem | null): DailyRevenueLeadReference | null {
  if (!item) return null;

  return {
    leadId: item.lead.id,
    source: item.lead.source || "unknown",
    propertyAddress: item.lead.propertyAddress || "property address missing",
    priority: item.latestScore?.priority ?? item.lead.priority ?? "Low",
    score: item.latestScore?.score ?? item.lead.score ?? 0,
  };
}

function revenueObjectiveFor(employee: AiWorkforceEmployeeReadiness, lead: DailyRevenueLeadReference | null) {
  if (lead && revenueDepartments.has(employee.department)) {
    return `Move lead ${lead.leadId} toward a verified seller appointment, offer decision, or clean CRM next step without external contact.`;
  }

  if (employee.department === "CEO Office") return "Keep the CEO focused on the highest-impact revenue decisions and blockers today.";
  if (employee.department === "AI COO") return "Route department work so revenue-producing teams know their internal next action today.";
  if (employee.department === "Marketing" || employee.department === "Content" || employee.department === "SEO" || employee.department === "Social Media" || employee.department === "Design") {
    return "Prepare approval-ready internal growth assets that support seller lead generation without publishing.";
  }
  if (employee.department === "Operations") return "Remove operational blockers that prevent the AI company from producing revenue work.";
  if (employee.department === "Knowledge / Memory") return "Convert outcomes and blockers into reusable company memory for better tomorrow recommendations.";
  if (employee.department === "Approval / Safety") return "Keep risky revenue actions queued for exact CEO approval and block unsafe execution.";

  return "Produce internal revenue support work that improves daily company throughput.";
}

function recommendedActionFor(employee: AiWorkforceEmployeeReadiness, leadItem: RevenueInboxItem | null) {
  if (leadItem && revenueDepartments.has(employee.department)) return leadItem.recommendedAction;

  if (employee.missingConnectors.length > 0) {
    return `Produce internal fallback output and document connector blocker: ${employee.missingConnectors[0]}.`;
  }

  return employee.safeNextAction;
}

function reasonFor(employee: AiWorkforceEmployeeReadiness, leadItem: RevenueInboxItem | null, dailyMission?: DailyMission | null) {
  if (leadItem && revenueDepartments.has(employee.department)) {
    return leadItem.latestScore?.explanation ?? "Revenue command center ranked this lead for manual internal review.";
  }

  if (dailyMission?.summary) return dailyMission.summary;

  return employee.mission;
}

function statusFor(employee: AiWorkforceEmployeeReadiness): DailyWorkOrderStatus {
  if (employee.readinessStatus === "blocked") return "blocked";
  if (employee.approvalLevel === "ceo_approval_required") return "needs_ceo_approval";
  if (employee.readinessStatus === "installed_but_idle") return "waiting";

  return "open";
}

function missingDataFor(employee: AiWorkforceEmployeeReadiness, leadItem: RevenueInboxItem | null) {
  return [
    ...(leadItem?.latestScore?.missingData ?? []),
    ...employee.missingConnectors.map((connector) => `${connector} connector/readiness gap`),
  ];
}

function sourceLabelsFor(employee: AiWorkforceEmployeeReadiness, leadItem: RevenueInboxItem | null, dailyMission?: DailyMission | null) {
  return [
    `ai-workforce:${employee.id}`,
    `department:${slug(employee.department)}`,
    ...(leadItem ? [`lead:${leadItem.lead.id}`, `lead-source:${slug(leadItem.lead.source || "unknown")}`] : []),
    ...(dailyMission?.sourceLabels.slice(0, 3) ?? []),
  ];
}

function createWorkOrder(input: {
  employee: AiWorkforceEmployeeReadiness;
  generatedAt: string;
  dailyMission?: DailyMission | null;
  leadItem: RevenueInboxItem | null;
}): DailyRevenueWorkOrder {
  const lead = leadReference(input.leadItem);
  const recommendedAction = recommendedActionFor(input.employee, input.leadItem);
  const status = statusFor(input.employee);
  const canCreateCrmTask =
    crmTaskEligibleDepartments.has(input.employee.department) &&
    status !== "blocked" &&
    input.employee.canProduceInternalOutputToday;
  const id = [
    "dw",
    todayIso(input.generatedAt),
    slug(input.employee.department),
    slug(input.employee.id),
    lead?.leadId ? slug(lead.leadId) : "company",
    slug(recommendedAction),
  ].join("-");

  return {
    id,
    department: input.employee.department,
    aiManager: input.employee.manager,
    aiEmployee: input.employee.name,
    aiEmployeeId: input.employee.id,
    dailyInput: input.employee.dailyOperatingContract.dailyInput,
    dailyOutput: input.employee.dailyOperatingContract.dailyOutput,
    revenueObjective: revenueObjectiveFor(input.employee, lead),
    successKpi: input.employee.dailyOperatingContract.successKpi,
    lead,
    dealId: null,
    recommendedAction,
    reason: reasonFor(input.employee, input.leadItem, input.dailyMission),
    revenueImpact: input.employee.revenueImpact,
    missingData: missingDataFor(input.employee, input.leadItem),
    approvalRule: input.employee.dailyOperatingContract.approvalRule,
    handoffTarget: input.employee.dailyOperatingContract.handoffTarget,
    dueDate: dueDateFor(input.generatedAt),
    status,
    outcome: "pending",
    outputType: input.employee.dailyOperatingContract.dailyOutput[0] ?? "internal work order",
    sourceLabels: sourceLabelsFor(input.employee, input.leadItem, input.dailyMission),
    canCreateCrmTask,
    allowedInternalAction: canCreateCrmTask ? "create_crm_task" : null,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createDepartmentQueues(workOrders: DailyRevenueWorkOrder[], workforce: AiWorkforceReport): DailyDepartmentQueue[] {
  return workforce.departments.map((department) => {
    const queueOrders = workOrders.filter((order) => order.department === department.name);
    const employeesWorking = queueOrders.filter((order) => order.status === "open" || order.status === "needs_ceo_approval").map((order) => order.aiEmployee);
    const employeesWaiting = queueOrders.filter((order) => order.status === "waiting" || order.status === "blocked").map((order) => order.aiEmployee);
    const connectorIssues = [...new Set(department.missingConnectors)];
    const blockers = [...new Set([...department.blockers, ...queueOrders.flatMap((order) => order.missingData)])].slice(0, 8);

    return {
      department: department.name,
      manager: department.manager,
      status: employeesWorking.length > 0 ? "working" : employeesWaiting.length > 0 ? "waiting" : department.readinessStatus,
      employeesAssigned: queueOrders.map((order) => order.aiEmployee),
      employeesWorking,
      employeesWaiting,
      workOrders: queueOrders,
      blockers,
      connectorIssues,
      nextSafeAction: department.safeNextAction,
    };
  });
}

function createRevenueGoal(revenue: RevenueCommandCenterReport | null | undefined, mission: DailyMission | null | undefined) {
  const qualified = revenue?.summary.qualifiedLeads ?? 0;
  const followUpDue = revenue?.summary.followUpDue ?? 0;

  if (qualified > 0 || followUpDue > 0) {
    return `Move ${qualified} qualified lead${qualified === 1 ? "" : "s"} and ${followUpDue} due follow-up${followUpDue === 1 ? "" : "s"} into clean internal next actions today.`;
  }

  return mission?.revenuePriorities[0]?.title ?? "Create internal work needed to improve seller lead generation, follow-up readiness, and revenue visibility today.";
}

function createTomorrowRecommendations(report: Pick<DailyRevenueOperatingLoopReport, "departmentQueues" | "workOrders" | "highestPriorityLead">) {
  const blocked = report.departmentQueues.filter((queue) => queue.blockers.length > 0).slice(0, 3);
  const approvalCount = report.workOrders.filter((order) => order.status === "needs_ceo_approval").length;

  return [
    ...(report.highestPriorityLead ? [`Continue internal review on highest-priority lead ${report.highestPriorityLead.leadId}.`] : ["Load or qualify lead data so tomorrow's revenue loop can attach work to real opportunities."]),
    ...(approvalCount > 0 ? [`Review ${approvalCount} approval-sensitive internal work order${approvalCount === 1 ? "" : "s"} before any execution path.`] : []),
    ...blocked.map((queue) => `${queue.department}: resolve ${queue.blockers[0]}.`),
  ].slice(0, 6);
}

export function assertDailyRevenueOperatingLoopSafety(report: DailyRevenueOperatingLoopReport): void {
  if (report.safety.providerCalled || report.safety.liveExecutionAllowed || report.safety.externalProviderWritesAllowed) {
    throw new Error("Daily revenue operating loop must remain internal-only with no provider calls or live execution.");
  }

  for (const order of report.workOrders) {
    if (!order.aiEmployee || !order.aiEmployeeId) throw new Error(`Daily work order ${order.id} is missing an AI employee owner.`);
    if (!order.approvalRule) throw new Error(`Daily work order ${order.id} is missing an approval rule.`);
    if (order.providerCalled || order.liveExecutionAllowed) throw new Error(`Daily work order ${order.id} violates provider execution safety.`);
    if (order.allowedInternalAction && order.allowedInternalAction !== "create_crm_task") {
      throw new Error(`Daily work order ${order.id} has unsupported internal action ${order.allowedInternalAction}.`);
    }
  }
}

export function createDailyRevenueOperatingLoopFromInputs(input: DailyRevenueOperatingLoopInputs): DailyRevenueOperatingLoopReport {
  const tenantId = input.tenantId ? requireTenantId(input.tenantId, "daily_revenue_loop_inputs") : null;
  const generatedAt = input.generatedAt ?? input.dailyMission?.generatedAt ?? input.workforce.generatedAt ?? new Date().toISOString();
  const topLeadItems = input.revenueCommandCenter?.inbox.slice(0, 8) ?? [];
  const highestLeadItem = topLeadItems[0] ?? null;
  const highestPriorityLead = leadReference(highestLeadItem);
  const workOrders = input.workforce.employees.map((employee, index) =>
    createWorkOrder({
      employee,
      generatedAt,
      dailyMission: input.dailyMission,
      leadItem: revenueDepartments.has(employee.department) ? topLeadItems[index % Math.max(topLeadItems.length, 1)] ?? highestLeadItem : null,
    }),
  );
  const departmentQueues = createDepartmentQueues(workOrders, input.workforce);
  const departmentsWorking = departmentQueues.filter((queue) => queue.employeesWorking.length > 0).map((queue) => queue.department);
  const departmentsWaiting = departmentQueues.filter((queue) => queue.employeesWaiting.length > 0).map((queue) => queue.department);
  const report: DailyRevenueOperatingLoopReport = {
    ok: true,
    tenantId,
    company: "J Capital Property Group",
    missionDate: todayIso(generatedAt),
    generatedAt,
    revenueGoal: createRevenueGoal(input.revenueCommandCenter, input.dailyMission),
    todaysRevenueOpportunities: topLeadItems.map((item) => leadReference(item)).filter((lead): lead is DailyRevenueLeadReference => Boolean(lead)),
    highestPriorityLead,
    departmentQueues,
    workOrders,
    ceoDashboard: {
      todaysRevenueOpportunities: topLeadItems.length,
      highestPriorityLead,
      departmentsWaiting,
      departmentsWorking,
      departmentBlockers: [...new Set(departmentQueues.flatMap((queue) => queue.blockers))].slice(0, 12),
      connectorIssues: [...new Set(departmentQueues.flatMap((queue) => queue.connectorIssues))].slice(0, 12),
      aiEmployeesAssigned: new Set(workOrders.map((order) => order.aiEmployeeId)).size,
      tasksReady: workOrders.filter((order) => order.canCreateCrmTask).length,
      approvalsNeeded: workOrders.filter((order) => order.status === "needs_ceo_approval" || /CEO approval/i.test(order.approvalRule)).length,
      revenueRisk: [
        ...(input.revenueCommandCenter?.executiveBriefing.risks ?? []),
        ...(input.dailyMission?.dataGaps.map((gap) => `Daily mission data gap: ${gap}`) ?? []),
      ].slice(0, 8),
    },
    tomorrowRecommendations: [],
    safety: {
      internalOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalProviderWritesAllowed: false,
      onlyAllowedInternalAction: "create_crm_task",
      crmTaskCreationRequiresApproval: true,
      approvalGatesPreserved: true,
    },
  };
  report.tomorrowRecommendations = createTomorrowRecommendations(report);
  assertDailyRevenueOperatingLoopSafety(report);

  return report;
}

export async function createDailyRevenueOperatingLoop(tenantIdValue: string): Promise<DailyRevenueOperatingLoopReport> {
  const tenantId = requireTenantId(tenantIdValue, "daily_revenue_loop");
  const [workforce, dailyMission, leads] = await Promise.all([
    createAiWorkforceReport(),
    getDailyMission(tenantId).catch(() => null),
    listDbLeads({ tenantId }),
  ]);
  await ensureConnectorDefinitions();
  const revenueCommandCenter = await createRevenueCommandCenter(tenantId, leads);

  return createDailyRevenueOperatingLoopFromInputs({
    tenantId,
    workforce,
    dailyMission,
    revenueCommandCenter,
  });
}

export function findDailyWorkOrder(report: DailyRevenueOperatingLoopReport, workOrderId: string) {
  return report.workOrders.find((order) => order.id === workOrderId) ?? null;
}

export function createCrmTaskApprovalInputFromWorkOrder(tenantIdValue: string, workOrder: DailyRevenueWorkOrder): ApprovedExecutionInput {
  const tenantId = requireTenantId(tenantIdValue, "crm_task_approval");
  if (!workOrder.canCreateCrmTask || workOrder.allowedInternalAction !== "create_crm_task") {
    throw new Error("This work order is not eligible for CRM task preparation.");
  }

  return {
    tenantId,
    actionType: "create_crm_task",
    title: workOrder.recommendedAction.slice(0, 180),
    sourceLabel: `daily-revenue-operating-loop:${workOrder.id}`,
    leadId: workOrder.lead?.leadId,
    preparedBy: workOrder.aiEmployee,
    payload: {
      workOrderId: workOrder.id,
      title: workOrder.recommendedAction,
      taskType: "daily_revenue_work_order",
      priority: workOrder.revenueImpact === "high" ? "high" : workOrder.revenueImpact === "medium" ? "medium" : "low",
      status: "open",
      recommendedAction: workOrder.recommendedAction,
      reason: workOrder.reason,
      dueAt: workOrder.dueDate,
      assignedTo: workOrder.aiEmployee,
      requiresApproval: true,
      source: "daily_revenue_operating_loop",
      department: workOrder.department,
      aiManager: workOrder.aiManager,
      approvalRule: workOrder.approvalRule,
      handoffTarget: workOrder.handoffTarget,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  };
}

export function isDailyOperatingReviewDecision(value: unknown): value is DailyOperatingReviewDecision {
  return typeof value === "string" && dailyOperatingReviewDecisions.includes(value as DailyOperatingReviewDecision);
}

function outcomeForReviewDecision(decision: DailyOperatingReviewDecision): Exclude<DailyWorkOrderOutcome, "pending" | "needs_ceo_approval" | "appointment_created" | "offer_prepared" | "contract_created" | "revenue_produced"> {
  if (decision === "defer") return "deferred";
  if (decision === "block") return "blocked";
  if (decision === "mark_completed") return "completed";

  return "no_opportunity";
}

export function createDailyOperatingReviewMemoryPayload(
  workOrder: DailyRevenueWorkOrder,
  input: DailyOperatingReviewInput,
) {
  const outcome = outcomeForReviewDecision(input.decision);

  return {
    eventType: "daily_operating_review_decision",
    source: "daily_revenue_operating_loop",
    leadId: workOrder.lead?.leadId,
    actionId: workOrder.id,
    approvalDecision: input.decision,
    outcome,
    metadata: {
      reviewedBy: input.reviewedBy ?? "CEO",
      note: input.note,
      department: workOrder.department,
      aiManager: workOrder.aiManager,
      aiEmployee: workOrder.aiEmployee,
      recommendedAction: workOrder.recommendedAction,
      revenueObjective: workOrder.revenueObjective,
      revenueImpact: workOrder.revenueImpact,
      sourceLabels: workOrder.sourceLabels,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  };
}

export function assertDailyOperatingReviewSafety(result: DailyOperatingReviewResult): void {
  if (result.providerCalled || result.liveExecutionAllowed) {
    throw new Error("Daily operating review must not call providers or allow live execution.");
  }

  if (!isDailyOperatingReviewDecision(result.decision)) {
    throw new Error("Daily operating review decision is not supported.");
  }

  if (!result.workOrder && result.ok) {
    throw new Error("Daily operating review cannot succeed without a valid work order.");
  }

  if (result.approvalInput) {
    if (result.decision !== "approve_crm_task") {
      throw new Error("Only approve_crm_task may prepare an approved execution item.");
    }
    if (result.approvalInput.actionType !== "create_crm_task") {
      throw new Error("Daily operating review may only prepare create_crm_task.");
    }
    if (!result.workOrder?.canCreateCrmTask || result.workOrder.allowedInternalAction !== "create_crm_task") {
      throw new Error("CRM task preparation requires an eligible daily work order.");
    }
  }
}

export async function reviewDailyWorkOrderFromReport(
  report: DailyRevenueOperatingLoopReport,
  input: DailyOperatingReviewInput,
  options: {
    memoryLogger?: typeof logAiMemoryEvent;
  } = {},
): Promise<DailyOperatingReviewResult> {
  if (!isDailyOperatingReviewDecision(input.decision)) {
    return {
      ok: false,
      decision: input.decision,
      workOrderId: input.workOrderId,
      status: "invalid",
      workOrder: null,
      error: "Unsupported daily operating review decision.",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  const workOrder = findDailyWorkOrder(report, input.workOrderId);

  if (!workOrder) {
    return {
      ok: false,
      decision: input.decision,
      workOrderId: input.workOrderId,
      status: "invalid",
      workOrder: null,
      error: "Daily work order was not found in the current operating loop.",
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  }

  if (input.decision === "approve_crm_task") {
    if (!workOrder.canCreateCrmTask || workOrder.allowedInternalAction !== "create_crm_task") {
      return {
        ok: false,
        decision: input.decision,
        workOrderId: input.workOrderId,
        status: "blocked",
        workOrder,
        error: "This daily work order is not eligible for CRM task preparation.",
        providerCalled: false,
        liveExecutionAllowed: false,
      };
    }

    const result: DailyOperatingReviewResult = {
      ok: true,
      decision: input.decision,
      workOrderId: input.workOrderId,
      status: "approval_prepared",
      workOrder,
      approvalInput: createCrmTaskApprovalInputFromWorkOrder(requireTenantId(report.tenantId, "daily_revenue_review"), workOrder),
      providerCalled: false,
      liveExecutionAllowed: false,
    };
    assertDailyOperatingReviewSafety(result);

    return result;
  }

  const memory = await (options.memoryLogger ?? logAiMemoryEvent)(
    createDailyOperatingReviewMemoryPayload(workOrder, input),
  );
  const result: DailyOperatingReviewResult = {
    ok: memory.logged,
    decision: input.decision,
    workOrderId: input.workOrderId,
    status: "memory_logged",
    workOrder,
    memory,
    error: memory.logged ? undefined : memory.reason,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertDailyOperatingReviewSafety(result);

  return result;
}

export function isDailyWorkOrderOutcome(value: unknown): value is DailyWorkOrderOutcome {
  return typeof value === "string" && dailyWorkOrderOutcomes.includes(value as DailyWorkOrderOutcome);
}

export async function logDailyWorkOrderOutcome(
  workOrder: DailyRevenueWorkOrder,
  input: DailyWorkOrderOutcomeInput,
): Promise<AiMemoryLoggerResult> {
  if (!isDailyWorkOrderOutcome(input.outcome) || input.outcome === "pending") {
    throw new Error("Daily work order outcome must be a completed terminal outcome.");
  }

  return logAiMemoryEvent({
    eventType: "daily_revenue_work_order_outcome",
    source: "daily_revenue_operating_loop",
    leadId: workOrder.lead?.leadId,
    actionId: workOrder.id,
    outcome: input.outcome,
    metadata: {
      department: workOrder.department,
      aiManager: workOrder.aiManager,
      aiEmployee: workOrder.aiEmployee,
      recommendedAction: workOrder.recommendedAction,
      revenueImpact: workOrder.revenueImpact,
      note: input.note,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  });
}
