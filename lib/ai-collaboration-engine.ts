import type { AiWorkforceDepartmentName } from "@/lib/ai-workforce";
import { createAiWorkforceReport, type AiWorkforceReport } from "@/lib/ai-workforce";
import {
  createAiEmployeeToolboxReadiness,
  type AiEmployeeToolboxReadiness,
  type AiEmployeeToolboxReadinessReport,
} from "@/lib/ai-employee-toolbox-readiness";
import { createAiCompanyReadinessScore, type AiCompanyReadinessScore } from "@/lib/ai-company-readiness-score";
import {
  createDailyRevenueOperatingLoop,
  type DailyRevenueOperatingLoopReport,
  type DailyRevenueWorkOrder,
} from "@/lib/daily-revenue-operating-loop";

export type AiCollaborationRequestStatus =
  | "requested"
  | "accepted"
  | "working"
  | "waiting_on_dependency"
  | "completed"
  | "blocked"
  | "needs_ceo_approval"
  | "deferred";

export type AiEmployeeWorkStatus = "working" | "waiting" | "blocked" | "needs_approval" | "idle";

export type AiCollaborationRequest = {
  id: string;
  fromDepartment: AiWorkforceDepartmentName;
  fromEmployee: string;
  toDepartment: AiWorkforceDepartmentName;
  toEmployee: string;
  requestType: "handoff" | "dependency" | "blocker_escalation" | "approval_escalation";
  title: string;
  description: string;
  neededOutput: string;
  dependencyOf: string | null;
  status: AiCollaborationRequestStatus;
  priority: "high" | "medium" | "low";
  blocker: string | null;
  dueDate: string;
  approvalRequired: boolean;
  safeNextAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AiEmployeeCommandCenterState = {
  department: AiWorkforceDepartmentName;
  manager: string;
  employee: string;
  employeeId: string;
  status: AiEmployeeWorkStatus;
  currentAssignment: string;
  requestedBy: string | null;
  waitingOn: string | null;
  blocker: string | null;
  dueDate: string | null;
  handoffTarget: string | null;
  nextSafeAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AiWorkforceCommandCenterReport = {
  ok: true;
  company: "J Capital Property Group";
  generatedAt: string;
  employees: AiEmployeeCommandCenterState[];
  requests: AiCollaborationRequest[];
  dependencyChains: Array<{
    id: string;
    employees: string[];
    status: AiCollaborationRequestStatus;
    blocker: string | null;
  }>;
  managerEscalations: AiCollaborationRequest[];
  ceoEscalations: AiCollaborationRequest[];
  readiness: AiCompanyReadinessScore;
  totals: {
    employees: number;
    working: number;
    waiting: number;
    blocked: number;
    needsApproval: number;
    idle: number;
    requests: number;
  };
  safety: {
    readOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalExecutionAllowed: false;
    connectorActivationAllowed: false;
  };
};

export type AiWorkforceCommandCenterInputs = {
  workforce: AiWorkforceReport;
  toolbox: AiEmployeeToolboxReadinessReport;
  dailyRevenueOperatingLoop: DailyRevenueOperatingLoopReport;
  generatedAt?: string;
};

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "item";
}

function priorityFromImpact(impact: "high" | "medium" | "low"): "high" | "medium" | "low" {
  return impact;
}

function employeeByName(workforce: AiWorkforceReport) {
  return new Map(workforce.employees.map((employee) => [employee.name, employee]));
}

function employeeByDepartment(toolbox: AiEmployeeToolboxReadinessReport) {
  const map = new Map<AiWorkforceDepartmentName, AiEmployeeToolboxReadiness[]>();
  for (const employee of toolbox.employees) {
    map.set(employee.department, [...(map.get(employee.department) ?? []), employee]);
  }

  return map;
}

function resolveTargetEmployee(
  target: string,
  workOrder: DailyRevenueWorkOrder,
  input: AiWorkforceCommandCenterInputs,
) {
  const employees = employeeByName(input.workforce);
  const exact = employees.get(target);
  if (exact) return exact;

  const byDepartment = employeeByDepartment(input.toolbox);
  const department = input.workforce.departments.find((item) => item.manager === target || item.name === target);
  if (department) return byDepartment.get(department.name)?.[0] ?? input.workforce.employees.find((employee) => employee.department === department.name) ?? null;

  if (/approval|compliance|CEO approval/i.test(target)) {
    return employees.get("Approval Gatekeeper AI") ?? employees.get("Compliance Reviewer AI") ?? null;
  }

  if (/connector|blocker|system|operations/i.test(target)) {
    return employees.get("Connector Health Monitor AI") ?? employees.get("System Blocker Analyst AI") ?? null;
  }

  return input.workforce.employees.find((employee) => employee.department !== workOrder.department) ?? null;
}

function requestStatus(workOrder: DailyRevenueWorkOrder, targetBlocked: boolean): AiCollaborationRequestStatus {
  if (targetBlocked || workOrder.status === "blocked") return "blocked";
  if (workOrder.status === "needs_ceo_approval") return "needs_ceo_approval";
  if (workOrder.status === "waiting") return "waiting_on_dependency";
  if (workOrder.status === "completed") return "completed";
  if (workOrder.status === "deferred") return "deferred";

  return "requested";
}

function createHandoffRequests(input: AiWorkforceCommandCenterInputs): AiCollaborationRequest[] {
  const requests: AiCollaborationRequest[] = [];
  for (const workOrder of input.dailyRevenueOperatingLoop.workOrders) {
    const targets = workOrder.handoffTarget.length > 0 ? workOrder.handoffTarget : [workOrder.aiManager];
    for (const target of targets.slice(0, 2)) {
      const targetEmployee = resolveTargetEmployee(target, workOrder, input);
      if (!targetEmployee) continue;
      const targetToolbox = input.toolbox.employees.find((employee) => employee.id === targetEmployee.id);
      const blocker = targetToolbox?.toolbox.blockedTools[0]?.label ?? targetToolbox?.toolbox.missingTools[0]?.label ?? workOrder.missingData[0] ?? null;
      const status = requestStatus(workOrder, Boolean(targetToolbox?.toolbox.blockedTools.length));

      requests.push({
        id: `acr-${slug(workOrder.id)}-${slug(targetEmployee.id)}`,
        fromDepartment: workOrder.department,
        fromEmployee: workOrder.aiEmployee,
        toDepartment: targetEmployee.department,
        toEmployee: targetEmployee.name,
        requestType: status === "needs_ceo_approval" ? "approval_escalation" : "handoff",
        title: `${workOrder.aiEmployee} requests ${targetEmployee.name}`,
        description: workOrder.reason,
        neededOutput: workOrder.dailyOutput[0] ?? workOrder.outputType,
        dependencyOf: workOrder.id,
        status,
        priority: priorityFromImpact(workOrder.revenueImpact),
        blocker,
        dueDate: workOrder.dueDate,
        approvalRequired: status === "needs_ceo_approval" || /approval/i.test(workOrder.approvalRule),
        safeNextAction: workOrder.recommendedAction,
        providerCalled: false,
        liveExecutionAllowed: false,
      });
    }
  }

  return requests;
}

function createBlockerRequests(input: AiWorkforceCommandCenterInputs): AiCollaborationRequest[] {
  const operationsEmployee = input.workforce.employees.find((employee) => employee.name === "Connector Health Monitor AI")
    ?? input.workforce.employees.find((employee) => employee.department === "Operations");
  if (!operationsEmployee) return [];

  return input.toolbox.employees
    .filter((employee) => employee.toolbox.blockedTools.length > 0 || employee.toolbox.missingTools.length > 0)
    .slice(0, 20)
    .map((employee) => {
      const blocker = employee.toolbox.blockedTools[0]?.label ?? employee.toolbox.missingTools[0]?.label ?? "Tool readiness gap";

      return {
        id: `acr-tool-${slug(employee.id)}-${slug(blocker)}`,
        fromDepartment: employee.department,
        fromEmployee: employee.name,
        toDepartment: operationsEmployee.department,
        toEmployee: operationsEmployee.name,
        requestType: "blocker_escalation" as const,
        title: `${employee.name} needs tool readiness support`,
        description: `${blocker} prevents full operational maturity for ${employee.name}.`,
        neededOutput: "Tool readiness blocker triage",
        dependencyOf: employee.id,
        status: employee.toolbox.blockedTools.length > 0 ? "blocked" as const : "waiting_on_dependency" as const,
        priority: employee.revenueImpact,
        blocker,
        dueDate: input.dailyRevenueOperatingLoop.generatedAt,
        approvalRequired: false,
        safeNextAction: employee.toolbox.connectorHealth[0]?.nextSafeAction ?? "Keep readiness visible and do not activate providers.",
        providerCalled: false as const,
        liveExecutionAllowed: false as const,
      };
    });
}

function createApprovalEscalations(input: AiWorkforceCommandCenterInputs): AiCollaborationRequest[] {
  const approvalEmployee = input.workforce.employees.find((employee) => employee.name === "Approval Gatekeeper AI")
    ?? input.workforce.employees.find((employee) => employee.department === "Approval / Safety");
  if (!approvalEmployee) return [];

  return input.dailyRevenueOperatingLoop.workOrders
    .filter((workOrder) => workOrder.status === "needs_ceo_approval" || /CEO approval/i.test(workOrder.approvalRule))
    .slice(0, 20)
    .map((workOrder) => ({
      id: `acr-approval-${slug(workOrder.id)}`,
      fromDepartment: workOrder.department,
      fromEmployee: workOrder.aiEmployee,
      toDepartment: approvalEmployee.department,
      toEmployee: approvalEmployee.name,
      requestType: "approval_escalation" as const,
      title: `${workOrder.aiEmployee} needs approval review`,
      description: workOrder.approvalRule,
      neededOutput: "CEO approval packet or blocked-action note",
      dependencyOf: workOrder.id,
      status: "needs_ceo_approval" as const,
      priority: workOrder.revenueImpact,
      blocker: "CEO approval required before external or approval-sensitive use.",
      dueDate: workOrder.dueDate,
      approvalRequired: true,
      safeNextAction: "Prepare exact approval context; do not execute externally.",
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
    }));
}

function dedupeRequests(requests: AiCollaborationRequest[]) {
  return [...new Map(requests.map((request) => [request.id, request])).values()];
}

function employeeStatus(employee: AiWorkforceReport["employees"][number], requests: AiCollaborationRequest[], toolbox: AiEmployeeToolboxReadiness | undefined): AiEmployeeWorkStatus {
  const assigned = requests.filter((request) => request.toEmployee === employee.name || request.fromEmployee === employee.name);
  if (assigned.some((request) => request.status === "blocked")) return "blocked";
  if (assigned.some((request) => request.status === "needs_ceo_approval")) return "needs_approval";
  if (assigned.some((request) => request.status === "waiting_on_dependency")) return "waiting";
  if (assigned.length > 0 || toolbox?.toolbox.canProduceInternalWork) return "working";

  return "idle";
}

function createEmployeeStates(input: AiWorkforceCommandCenterInputs, requests: AiCollaborationRequest[]): AiEmployeeCommandCenterState[] {
  return input.workforce.employees.map((employee) => {
    const assignedTo = requests.find((request) => request.toEmployee === employee.name);
    const assignedFrom = requests.find((request) => request.fromEmployee === employee.name);
    const assigned = assignedTo ?? assignedFrom ?? null;
    const toolbox = input.toolbox.employees.find((item) => item.id === employee.id);
    const status = employeeStatus(employee, requests, toolbox);
    const blocker = assigned?.blocker ?? toolbox?.toolbox.blockedTools[0]?.label ?? toolbox?.toolbox.missingTools[0]?.label ?? null;

    return {
      department: employee.department,
      manager: employee.manager,
      employee: employee.name,
      employeeId: employee.id,
      status,
      currentAssignment: assigned?.title ?? employee.dailyOperatingContract.dailyOutput[0] ?? "Available for internal work",
      requestedBy: assignedTo?.fromEmployee ?? null,
      waitingOn: assignedFrom?.toEmployee ?? (status === "waiting" ? blocker : null),
      blocker,
      dueDate: assigned?.dueDate ?? null,
      handoffTarget: assigned?.toEmployee ?? employee.dailyOperatingContract.handoffTarget[0] ?? null,
      nextSafeAction: assigned?.safeNextAction ?? employee.safeNextAction,
      providerCalled: false,
      liveExecutionAllowed: false,
    };
  });
}

function createDependencyChains(requests: AiCollaborationRequest[]): AiWorkforceCommandCenterReport["dependencyChains"] {
  return requests
    .filter((request) => request.dependencyOf)
    .slice(0, 30)
    .map((request) => ({
      id: `chain-${slug(request.dependencyOf ?? request.id)}-${slug(request.toEmployee)}`,
      employees: [request.fromEmployee, request.toEmployee],
      status: request.status,
      blocker: request.blocker,
    }));
}

export function assertAiCollaborationSafety(report: AiWorkforceCommandCenterReport): void {
  if (report.safety.providerCalled || report.safety.liveExecutionAllowed || report.safety.externalExecutionAllowed || report.safety.connectorActivationAllowed) {
    throw new Error("AI collaboration engine must remain internal-only and must not activate providers.");
  }

  for (const request of report.requests) {
    if (request.providerCalled || request.liveExecutionAllowed) throw new Error(`Collaboration request ${request.id} violates provider safety.`);
  }

  for (const employee of report.employees) {
    if (employee.providerCalled || employee.liveExecutionAllowed) throw new Error(`Command center employee ${employee.employee} violates provider safety.`);
  }
}

export function createAiWorkforceCommandCenterFromInputs(input: AiWorkforceCommandCenterInputs): AiWorkforceCommandCenterReport {
  const generatedAt = input.generatedAt ?? input.dailyRevenueOperatingLoop.generatedAt ?? input.toolbox.generatedAt ?? input.workforce.generatedAt;
  const requests = dedupeRequests([
    ...createHandoffRequests(input),
    ...createBlockerRequests(input),
    ...createApprovalEscalations(input),
  ]);
  const employees = createEmployeeStates(input, requests);
  const readiness = createAiCompanyReadinessScore({
    workforce: input.workforce,
    toolbox: input.toolbox,
    dailyRevenueOperatingLoop: input.dailyRevenueOperatingLoop,
    collaborationRequestCount: requests.length,
    employeesRepresentedInCommandCenter: employees.length,
  });
  const report: AiWorkforceCommandCenterReport = {
    ok: true,
    company: "J Capital Property Group",
    generatedAt,
    employees,
    requests,
    dependencyChains: createDependencyChains(requests),
    managerEscalations: requests.filter((request) => request.requestType === "blocker_escalation"),
    ceoEscalations: requests.filter((request) => request.status === "needs_ceo_approval"),
    readiness,
    totals: {
      employees: employees.length,
      working: employees.filter((employee) => employee.status === "working").length,
      waiting: employees.filter((employee) => employee.status === "waiting").length,
      blocked: employees.filter((employee) => employee.status === "blocked").length,
      needsApproval: employees.filter((employee) => employee.status === "needs_approval").length,
      idle: employees.filter((employee) => employee.status === "idle").length,
      requests: requests.length,
    },
    safety: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
      connectorActivationAllowed: false,
    },
  };
  assertAiCollaborationSafety(report);

  return report;
}

export async function createAiWorkforceCommandCenter(): Promise<AiWorkforceCommandCenterReport> {
  const [workforce, toolbox, dailyRevenueOperatingLoop] = await Promise.all([
    createAiWorkforceReport(),
    createAiEmployeeToolboxReadiness(),
    createDailyRevenueOperatingLoop(),
  ]);

  return createAiWorkforceCommandCenterFromInputs({
    workforce,
    toolbox,
    dailyRevenueOperatingLoop,
  });
}
