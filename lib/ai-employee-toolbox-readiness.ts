import type { ConnectorActivationReport, ConnectorActivationReportItem } from "@/lib/connector-activation-report";
import { createConnectorActivationReport } from "@/lib/connector-activation-report";
import { createAiWorkforceReport, type AiWorkforceDepartmentName, type AiWorkforceReport, type AiWorkforceToolReadiness } from "@/lib/ai-workforce";
import { listToolCapabilities, type ToolDefinition } from "@/lib/tool-capability-manager";

export type AiEmployeeCertificationLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type ConnectorMatrixStatus = "ready" | "partial" | "disconnected" | "blocked" | "needs_credentials" | "needs_approval";
export type ConnectorMatrixMode = "internal" | "read" | "manual" | "blocked";

export type AiEmployeeCertification = {
  level: AiEmployeeCertificationLevel;
  label: string;
  explanation: string;
  nextLevelRequirement: string;
  externalExecutionBlocked: true;
};

export type ToolConnectorHealth = {
  toolKey: string;
  label: string;
  status: AiWorkforceToolReadiness["status"];
  connectorStatus: ConnectorActivationReportItem["status"] | "tool_only" | "internal";
  mode: ConnectorMatrixMode;
  nextSafeAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AiEmployeeToolbox = {
  requiredTools: AiWorkforceToolReadiness[];
  optionalTools: AiWorkforceToolReadiness[];
  connectedTools: AiWorkforceToolReadiness[];
  missingTools: AiWorkforceToolReadiness[];
  blockedTools: AiWorkforceToolReadiness[];
  readinessPercent: number;
  canProduceInternalWork: boolean;
  canProduceExternalWork: false;
  connectorHealth: ToolConnectorHealth[];
};

export type AiEmployeeToolboxReadiness = {
  id: string;
  name: string;
  department: AiWorkforceDepartmentName;
  manager: string;
  role: string;
  revenueImpact: "high" | "medium" | "low";
  costReductionImpact: "high" | "medium" | "low";
  toolbox: AiEmployeeToolbox;
  certification: AiEmployeeCertification;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type DepartmentToolboxReadiness = {
  department: AiWorkforceDepartmentName;
  manager: string;
  readinessPercent: number;
  employees: number;
  connectedTools: string[];
  missingTools: string[];
  blockedTools: string[];
  safeInternalOutput: boolean;
  potentialExternalOutput: string[];
  externalExecutionAllowed: false;
};

export type CompanyConnectorMatrixItem = {
  connector: string;
  connectorId: string;
  departments: AiWorkforceDepartmentName[];
  employees: string[];
  status: ConnectorMatrixStatus;
  enablementStatus: "enabled" | "blocked";
  connectorNeeded: boolean;
  safeInternalFallbackAvailable: boolean;
  mode: ConnectorMatrixMode;
  unlocksEmployees: number;
  unlocksDepartments: number;
  revenueImpact: "high" | "medium" | "low";
  nextSafeAction: string;
};

export type CompanyOperationalReadiness = {
  workforce: number;
  departments: number;
  operatingLoop: number;
  ceoReview: number;
  connectorReadiness: number;
  externalReadiness: number;
  overall: number;
};

export type AiEmployeeToolboxReadinessReport = {
  ok: true;
  company: "J Capital Property Group";
  generatedAt: string;
  employees: AiEmployeeToolboxReadiness[];
  departments: DepartmentToolboxReadiness[];
  connectorMatrix: CompanyConnectorMatrixItem[];
  companyOperationalReadiness: CompanyOperationalReadiness;
  certificationDistribution: Record<AiEmployeeCertificationLevel, number>;
  topMissingTools: string[];
  highestRoiConnectorsToActivateNext: CompanyConnectorMatrixItem[];
  safety: {
    readOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalExecutionAllowed: false;
    externalProviderWritesAllowed: false;
    oauthStarted: false;
    credentialsChanged: false;
  };
};

export type AiEmployeeToolboxReadinessInputs = {
  workforce: AiWorkforceReport;
  connectorActivationReport?: ConnectorActivationReport | null;
  tools?: ToolDefinition[];
  generatedAt?: string;
};

const optionalToolsByDepartment: Record<AiWorkforceDepartmentName, string[]> = {
  "CEO Office": ["daily_mission", "approval_queue", "google_calendar", "google_drive"],
  "AI COO": ["company_orchestrator", "connector_activation_report", "ai_memory"],
  "Lead Generation": ["gmail", "lead_database", "crm", "google_analytics"],
  "Seller Acquisition": ["crm", "manual_follow_up_task", "twilio", "gmail"],
  CRM: ["crm", "lead_database", "manual_follow_up_task", "google_calendar"],
  Marketing: ["manual_marketing_draft", "google_analytics", "canva", "google_business_profile"],
  Design: ["manual_design_brief", "canva", "google_drive"],
  Content: ["manual_marketing_draft", "google_drive", "youtube", "google_search_console"],
  SEO: ["google_search_console", "google_analytics", "google_business_profile"],
  "Social Media": ["manual_marketing_draft", "canva", "facebook_business", "instagram_business", "linkedin_company_page", "tiktok_business"],
  "County Intelligence": ["county_assessor", "attom", "property_pipeline"],
  Acquisitions: ["property_pipeline", "crm", "county_assessor", "attom"],
  Finance: ["finance_entries", "revenue_command_center", "crm"],
  Operations: ["connector_activation_report", "provider_readiness", "google_workspace"],
  "Knowledge / Memory": ["ai_memory", "knowledge_base", "google_drive"],
  "Approval / Safety": ["approval_queue", "ai_memory", "knowledge_base"],
};

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function connectorById(report?: ConnectorActivationReport | null) {
  return new Map((report?.connectors ?? []).map((connector) => [connector.connectorId, connector]));
}

function toolById(tools: ToolDefinition[]) {
  return new Map(tools.map((tool) => [tool.toolKey, tool]));
}

function toolReadinessFromDefinition(tool: ToolDefinition): AiWorkforceToolReadiness {
  const status: AiWorkforceToolReadiness["status"] =
    tool.healthStatus === "healthy"
      ? "ready"
      : tool.healthStatus === "readiness_only"
        ? "readiness_only"
        : tool.healthStatus === "unavailable"
          ? "missing"
          : "blocked";

  return {
    toolKey: tool.toolKey,
    label: tool.name,
    purpose: tool.purpose,
    requiredForDailyWork: false,
    externalProvider: tool.authenticationMethod !== "none",
    approvedUse: tool.providerCallsAllowed ? "read_only" : tool.healthStatus === "healthy" ? "manual_only" : "read_only",
    status,
    connected: status === "ready",
    missing: status === "missing" || status === "blocked",
    blocker: status === "ready" ? null : `${tool.name} is ${tool.healthStatus}.`,
    safeNextAction: tool.retryPolicy,
  };
}

function optionalToolsForDepartment(
  department: AiWorkforceDepartmentName,
  existingToolKeys: Set<string>,
  tools: Map<string, ToolDefinition>,
): AiWorkforceToolReadiness[] {
  return (optionalToolsByDepartment[department] ?? [])
    .filter((toolKey) => !existingToolKeys.has(toolKey))
    .map((toolKey) => tools.get(toolKey))
    .filter((tool): tool is ToolDefinition => Boolean(tool))
    .map(toolReadinessFromDefinition);
}

function modeForTool(tool: AiWorkforceToolReadiness): ConnectorMatrixMode {
  if (tool.approvedUse === "blocked_external" || tool.status === "blocked") return "blocked";
  if (tool.approvedUse === "manual_only" || !tool.externalProvider) return "manual";
  if (tool.approvedUse === "read_only") return "read";

  return "internal";
}

function connectorStatusForTool(tool: AiWorkforceToolReadiness, connector: ConnectorActivationReportItem | undefined): ToolConnectorHealth["connectorStatus"] {
  if (!tool.externalProvider) return "internal";
  if (connector) return connector.status;

  return "tool_only";
}

function connectorHealthForTool(
  tool: AiWorkforceToolReadiness,
  connectors: Map<string, ConnectorActivationReportItem>,
): ToolConnectorHealth {
  const connector = connectors.get(tool.toolKey);

  return {
    toolKey: tool.toolKey,
    label: tool.label,
    status: tool.status,
    connectorStatus: connectorStatusForTool(tool, connector),
    mode: modeForTool(tool),
    nextSafeAction: connector?.nextRequiredAction ?? tool.safeNextAction,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createCertification(input: {
  requiredTools: AiWorkforceToolReadiness[];
  connectedTools: AiWorkforceToolReadiness[];
  canProduceInternalWork: boolean;
  approvalRule: string;
  handoffTargets: string[];
}): AiEmployeeCertification {
  const hasReadOnlyConnector = input.requiredTools.some((tool) =>
    tool.externalProvider &&
    tool.approvedUse === "read_only" &&
    tool.status !== "blocked" &&
    tool.status !== "missing",
  );
  const approvalReady = Boolean(input.approvalRule && input.handoffTargets.length > 0);

  if (input.canProduceInternalWork && hasReadOnlyConnector && approvalReady) {
    return {
      level: 3,
      label: "Level 3 - Approval Ready",
      explanation: "Employee can produce internal work, has read-only connector readiness, and has approval/handoff governance.",
      nextLevelRequirement: "Level 4 remains blocked until external execution is explicitly governed and approved.",
      externalExecutionBlocked: true,
    };
  }

  if (input.canProduceInternalWork && hasReadOnlyConnector) {
    return {
      level: 2,
      label: "Level 2 - Read-only Connectors",
      explanation: "Employee can produce internal work and has at least one readiness-valid read-only connector.",
      nextLevelRequirement: "Add explicit approval rule and handoff target for approval-ready operation.",
      externalExecutionBlocked: true,
    };
  }

  if (input.canProduceInternalWork) {
    return {
      level: 1,
      label: "Level 1 - Internal Work",
      explanation: "Employee can produce internal-only work using internal or manual tools.",
      nextLevelRequirement: "Connect or verify a read-only provider/tool for Level 2.",
      externalExecutionBlocked: true,
    };
  }

  return {
    level: 0,
    label: "Level 0 - Installed",
    explanation: "Employee exists in the AI workforce roster but cannot yet produce internal output.",
    nextLevelRequirement: "Assign an internal/manual tool and daily output path.",
    externalExecutionBlocked: true,
  };
}

function createEmployeeToolbox(input: {
  employee: AiWorkforceReport["employees"][number];
  tools: Map<string, ToolDefinition>;
  connectors: Map<string, ConnectorActivationReportItem>;
}): AiEmployeeToolboxReadiness {
  const existingToolKeys = new Set(input.employee.tools.map((tool) => tool.toolKey));
  const optionalTools = optionalToolsForDepartment(input.employee.department, existingToolKeys, input.tools);
  const allTools = [...input.employee.tools, ...optionalTools];
  const connectedTools = allTools.filter((tool) => tool.status === "ready" || tool.status === "connected");
  const missingTools = allTools.filter((tool) => tool.missing || tool.status === "missing" || tool.status === "data_gap" || tool.status === "readiness_only");
  const blockedTools = allTools.filter((tool) => tool.status === "blocked" || tool.approvedUse === "blocked_external");
  const toolbox: AiEmployeeToolbox = {
    requiredTools: input.employee.tools,
    optionalTools,
    connectedTools,
    missingTools,
    blockedTools,
    readinessPercent: input.employee.readinessPercent,
    canProduceInternalWork: input.employee.canProduceInternalOutputToday,
    canProduceExternalWork: false,
    connectorHealth: allTools.map((tool) => connectorHealthForTool(tool, input.connectors)),
  };

  return {
    id: input.employee.id,
    name: input.employee.name,
    department: input.employee.department,
    manager: input.employee.manager,
    role: input.employee.role,
    revenueImpact: input.employee.revenueImpact,
    costReductionImpact: input.employee.costReductionImpact,
    toolbox,
    certification: createCertification({
      requiredTools: input.employee.tools,
      connectedTools,
      canProduceInternalWork: input.employee.canProduceInternalOutputToday,
      approvalRule: input.employee.dailyOperatingContract.approvalRule,
      handoffTargets: input.employee.dailyOperatingContract.handoffTarget,
    }),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function createDepartmentToolboxReadiness(
  workforce: AiWorkforceReport,
  employees: AiEmployeeToolboxReadiness[],
): DepartmentToolboxReadiness[] {
  return workforce.departments.map((department) => {
    const departmentEmployees = employees.filter((employee) => employee.department === department.name);
    const connectedTools = uniqueSorted(departmentEmployees.flatMap((employee) => employee.toolbox.connectedTools.map((tool) => tool.label)));
    const missingTools = uniqueSorted(departmentEmployees.flatMap((employee) => employee.toolbox.missingTools.map((tool) => tool.label)));
    const blockedTools = uniqueSorted(departmentEmployees.flatMap((employee) => employee.toolbox.blockedTools.map((tool) => tool.label)));
    const potentialExternalOutput = uniqueSorted(
      departmentEmployees.flatMap((employee) =>
        employee.toolbox.requiredTools
          .filter((tool) => tool.externalProvider)
          .map((tool) => `${employee.name}: ${tool.label}`),
      ),
    );

    return {
      department: department.name,
      manager: department.manager,
      readinessPercent: department.readinessPercent,
      employees: departmentEmployees.length,
      connectedTools,
      missingTools,
      blockedTools,
      safeInternalOutput: departmentEmployees.some((employee) => employee.toolbox.canProduceInternalWork),
      potentialExternalOutput,
      externalExecutionAllowed: false,
    };
  });
}

function matrixStatus(tools: AiWorkforceToolReadiness[], connector: ConnectorActivationReportItem | undefined): ConnectorMatrixStatus {
  if (tools.some((tool) => tool.status === "blocked" || tool.approvedUse === "blocked_external")) return "blocked";
  if (connector?.status === "credentials_missing") return "needs_credentials";
  if (connector?.status === "connected" || connector?.status === "internal_ready" || tools.every((tool) => tool.status === "ready" || tool.status === "connected")) return "ready";
  if (tools.some((tool) => tool.status === "readiness_only" || tool.status === "data_gap")) return "partial";
  if (tools.some((tool) => tool.status === "missing")) return "disconnected";

  return "needs_approval";
}

function highestImpact(impacts: Array<"high" | "medium" | "low">): "high" | "medium" | "low" {
  if (impacts.includes("high")) return "high";
  if (impacts.includes("medium")) return "medium";

  return "low";
}

function createConnectorMatrix(
  employees: AiEmployeeToolboxReadiness[],
  connectors: Map<string, ConnectorActivationReportItem>,
): CompanyConnectorMatrixItem[] {
  const groups = new Map<string, {
    label: string;
    departments: Set<AiWorkforceDepartmentName>;
    employees: Set<string>;
    tools: AiWorkforceToolReadiness[];
    impacts: Array<"high" | "medium" | "low">;
  }>();

  for (const employee of employees) {
    for (const tool of [...employee.toolbox.requiredTools, ...employee.toolbox.optionalTools]) {
      const group = groups.get(tool.toolKey) ?? {
        label: tool.label,
        departments: new Set<AiWorkforceDepartmentName>(),
        employees: new Set<string>(),
        tools: [],
        impacts: [],
      };
      group.departments.add(employee.department);
      group.employees.add(employee.name);
      group.tools.push(tool);
      group.impacts.push(employee.revenueImpact);
      groups.set(tool.toolKey, group);
    }
  }

  return [...groups.entries()]
    .map(([connectorId, group]) => {
      const connector = connectors.get(connectorId);
      const modePriority: ConnectorMatrixMode[] = ["blocked", "read", "manual", "internal"];
      const modes = group.tools.map(modeForTool);
      const mode = modePriority.find((candidate) => modes.includes(candidate)) ?? "internal";
      const status = matrixStatus(group.tools, connector);
      const enablementStatus: CompanyConnectorMatrixItem["enablementStatus"] =
        status === "ready" ? "enabled" : "blocked";

      return {
        connector: group.label,
        connectorId,
        departments: [...group.departments].sort((a, b) => a.localeCompare(b)),
        employees: [...group.employees].sort((a, b) => a.localeCompare(b)),
        status,
        enablementStatus,
        connectorNeeded: connector?.status === "credentials_missing" || status === "needs_credentials" || status === "disconnected",
        safeInternalFallbackAvailable: employees.some(
          (employee) => group.employees.has(employee.name) && employee.toolbox.canProduceInternalWork,
        ),
        mode,
        unlocksEmployees: group.employees.size,
        unlocksDepartments: group.departments.size,
        revenueImpact: highestImpact(group.impacts),
        nextSafeAction: connector?.nextRevenueAction ?? group.tools[0]?.safeNextAction ?? "Keep readiness visible; do not activate external execution.",
      };
    })
    .sort((a, b) => {
      const impactScore = { high: 3, medium: 2, low: 1 };
      return impactScore[b.revenueImpact] - impactScore[a.revenueImpact] || b.unlocksEmployees - a.unlocksEmployees || a.connector.localeCompare(b.connector);
    });
}

function certificationDistribution(employees: AiEmployeeToolboxReadiness[]): Record<AiEmployeeCertificationLevel, number> {
  return {
    0: employees.filter((employee) => employee.certification.level === 0).length,
    1: employees.filter((employee) => employee.certification.level === 1).length,
    2: employees.filter((employee) => employee.certification.level === 2).length,
    3: employees.filter((employee) => employee.certification.level === 3).length,
    4: 0,
    5: 0,
  };
}

function createCompanyOperationalReadiness(input: {
  workforce: AiWorkforceReport;
  departments: DepartmentToolboxReadiness[];
  connectorMatrix: CompanyConnectorMatrixItem[];
}): CompanyOperationalReadiness {
  const workforce = clampPercent((input.workforce.totals.internalOutputAvailableToday / Math.max(1, input.workforce.totals.employees)) * 100);
  const departments = clampPercent((input.departments.filter((department) => department.safeInternalOutput).length / Math.max(1, input.departments.length)) * 100);
  const operatingLoop = 100;
  const ceoReview = 100;
  const connectorReadiness = clampPercent(
    (input.connectorMatrix.filter((connector) => connector.status === "ready").length / Math.max(1, input.connectorMatrix.length)) * 100,
  );
  const externalReadiness = clampPercent(
    (input.connectorMatrix.filter((connector) => connector.status === "ready" && connector.mode === "read").length / Math.max(1, input.connectorMatrix.length)) * 35,
  );
  const overall = clampPercent(
    workforce * 0.2 +
    departments * 0.15 +
    operatingLoop * 0.2 +
    ceoReview * 0.15 +
    connectorReadiness * 0.2 +
    externalReadiness * 0.1,
  );

  return {
    workforce,
    departments,
    operatingLoop,
    ceoReview,
    connectorReadiness,
    externalReadiness,
    overall,
  };
}

export function createAiEmployeeToolboxReadinessFromInputs(input: AiEmployeeToolboxReadinessInputs): AiEmployeeToolboxReadinessReport {
  const tools = input.tools ?? listToolCapabilities();
  const toolMap = toolById(tools);
  const connectors = connectorById(input.connectorActivationReport);
  const employees = input.workforce.employees.map((employee) => createEmployeeToolbox({ employee, tools: toolMap, connectors }));
  const departments = createDepartmentToolboxReadiness(input.workforce, employees);
  const connectorMatrix = createConnectorMatrix(employees, connectors);
  const topMissingTools = uniqueSorted(employees.flatMap((employee) => employee.toolbox.missingTools.map((tool) => tool.label))).slice(0, 12);
  const highestRoiConnectorsToActivateNext = connectorMatrix
    .filter((connector) => connector.status !== "ready")
    .filter((connector) => connector.revenueImpact === "high" || connector.unlocksEmployees >= 3)
    .slice(0, 12);

  return {
    ok: true,
    company: "J Capital Property Group",
    generatedAt: input.generatedAt ?? input.workforce.generatedAt,
    employees,
    departments,
    connectorMatrix,
    companyOperationalReadiness: createCompanyOperationalReadiness({ workforce: input.workforce, departments, connectorMatrix }),
    certificationDistribution: certificationDistribution(employees),
    topMissingTools,
    highestRoiConnectorsToActivateNext,
    safety: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalExecutionAllowed: false,
      externalProviderWritesAllowed: false,
      oauthStarted: false,
      credentialsChanged: false,
    },
  };
}

export async function createAiEmployeeToolboxReadiness(): Promise<AiEmployeeToolboxReadinessReport> {
  const [workforce, connectorActivationReport] = await Promise.all([
    createAiWorkforceReport(),
    createConnectorActivationReport().catch(() => null),
  ]);

  return createAiEmployeeToolboxReadinessFromInputs({
    workforce,
    connectorActivationReport,
  });
}
