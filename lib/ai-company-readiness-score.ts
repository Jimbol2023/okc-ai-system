import type { AiWorkforceReport } from "@/lib/ai-workforce";
import type { AiEmployeeToolboxReadinessReport } from "@/lib/ai-employee-toolbox-readiness";
import type { DailyRevenueOperatingLoopReport } from "@/lib/daily-revenue-operating-loop";

export type InternalOperationalReadiness = {
  workforce: number;
  departments: number;
  operatingLoop: number;
  ceoReview: number;
  memory: number;
  collaboration: number;
  overall: number;
};

export type ExternalOperationalReadiness = {
  connectors: number;
  externalApproval: number;
  crmExecution: number;
  publishing: number;
  communications: number;
  automation: number;
  overall: number;
};

export type AiCompanyReadinessScore = {
  internalOperationalReadiness: InternalOperationalReadiness;
  externalOperationalReadiness: ExternalOperationalReadiness;
  overallAiCompanyReadiness: number;
  safety: {
    providerCalled: false;
    liveExecutionAllowed: false;
    externalExecutionAllowed: false;
  };
};

export type AiCompanyReadinessScoreInputs = {
  workforce: AiWorkforceReport;
  toolbox: AiEmployeeToolboxReadinessReport;
  dailyRevenueOperatingLoop: DailyRevenueOperatingLoopReport;
  collaborationRequestCount: number;
  employeesRepresentedInCommandCenter: number;
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function average(values: number[]) {
  if (values.length === 0) return 0;

  return clampPercent(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function createAiCompanyReadinessScore(input: AiCompanyReadinessScoreInputs): AiCompanyReadinessScore {
  const workforce = clampPercent((input.workforce.totals.internalOutputAvailableToday / Math.max(1, input.workforce.totals.employees)) * 100);
  const departments = clampPercent((input.toolbox.departments.filter((department) => department.safeInternalOutput).length / Math.max(1, input.toolbox.departments.length)) * 100);
  const operatingLoop = input.dailyRevenueOperatingLoop.workOrders.length > 0 ? 100 : 0;
  const ceoReview = input.dailyRevenueOperatingLoop.ceoDashboard.approvalsNeeded >= 0 ? 100 : 0;
  const memory = 90;
  const collaboration = clampPercent((input.employeesRepresentedInCommandCenter / Math.max(1, input.workforce.totals.employees)) * 70 + (input.collaborationRequestCount > 0 ? 30 : 0));
  const internalOverall = average([workforce, departments, operatingLoop, ceoReview, memory, collaboration]);
  const connectors = input.toolbox.companyOperationalReadiness.connectorReadiness;
  const externalApproval = input.dailyRevenueOperatingLoop.ceoDashboard.approvalsNeeded > 0 ? 15 : 0;
  const crmExecution = input.dailyRevenueOperatingLoop.ceoDashboard.tasksReady > 0 ? 10 : 0;
  const publishing = 0;
  const communications = 0;
  const automation = 0;
  const externalOverall = average([connectors, externalApproval, crmExecution, publishing, communications, automation]);
  const overallAiCompanyReadiness = clampPercent(internalOverall * 0.6 + externalOverall * 0.4);

  return {
    internalOperationalReadiness: {
      workforce,
      departments,
      operatingLoop,
      ceoReview,
      memory,
      collaboration,
      overall: internalOverall,
    },
    externalOperationalReadiness: {
      connectors,
      externalApproval,
      crmExecution,
      publishing,
      communications,
      automation,
      overall: externalOverall,
    },
    overallAiCompanyReadiness,
    safety: {
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
    },
  };
}
