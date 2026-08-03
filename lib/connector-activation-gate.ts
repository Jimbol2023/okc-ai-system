import { createAiEmployeeToolboxReadiness, type AiEmployeeToolboxReadinessReport } from "@/lib/ai-employee-toolbox-readiness";
import { createConnectorActivationReport, type ConnectorActivationReport, type ConnectorActivationReportItem } from "@/lib/connector-activation-report";
import {
  evaluateConnectorAction,
  getEnterpriseConnector,
  listEnterpriseConnectors,
  type ConnectorAction,
  type EnterpriseConnector,
} from "@/lib/connector-platform";

export type ConnectorActivationGateMode = "read_only" | "approval_gated" | "blocked";
export type ConnectorCredentialStatus = "configured" | "missing" | "invalid" | "unknown";
export type ConnectorScopeStatus = "valid" | "missing" | "excessive" | "unknown";
export type ConnectorGateHealthStatus = "ready" | "partial" | "blocked" | "rate_limited" | "not_configured";
export type ConnectorActionPolicyMode = "read_only" | "approval_gated" | "blocked";

export type ConnectorActionPolicy = {
  connector: string;
  connectorId: string;
  action: string;
  label: string;
  mode: ConnectorActionPolicyMode;
  allowed: boolean;
  requiresApproval: boolean;
  externalWrite: boolean;
  reason: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorActivationGateRecord = {
  connector: string;
  connectorId: string;
  mode: ConnectorActivationGateMode;
  credentialStatus: ConnectorCredentialStatus;
  scopeStatus: ConnectorScopeStatus;
  healthStatus: ConnectorGateHealthStatus;
  allowedActions: string[];
  forbiddenActions: string[];
  actionPolicies: ConnectorActionPolicy[];
  affectedDepartments: string[];
  affectedEmployees: string[];
  certificationImpact: {
    levelUnlocked: 0 | 1 | 2 | 3;
    blockedLevels: [4, 5];
    explanation: string;
  };
  revenueImpact: "high" | "medium" | "low";
  nextSafeAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorActivationGateReport = {
  ok: true;
  company: "J Capital Property Group";
  generatedAt: string;
  summary: {
    connectors: number;
    ready: number;
    partial: number;
    blocked: number;
    rateLimited: number;
    needsCredentials: number;
    readOnlyActionsAllowed: number;
    forbiddenActions: number;
  };
  records: ConnectorActivationGateRecord[];
  googleWorkspaceFoundation: ConnectorActivationGateRecord[];
  highestImpactNext: ConnectorActivationGateRecord[];
  employeeCertificationImpact: {
    level2UnlockedEmployees: string[];
    level3CandidateEmployees: string[];
    level4BlockedEmployees: string[];
    level5BlockedEmployees: string[];
  };
  safety: {
    readOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    oauthStarted: false;
    credentialsChanged: false;
    externalProviderWritesAllowed: false;
    connectorActivationEqualsExecution: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorActivationGateInputs = {
  toolbox: AiEmployeeToolboxReadinessReport;
  connectorActivationReport?: ConnectorActivationReport | null;
  connectors?: EnterpriseConnector[];
  generatedAt?: string;
};

const sprint6GoogleConnectorIds = [
  "gmail",
  "google_drive",
  "google_calendar",
  "google_search_console",
  "google_analytics",
  "google_business_profile",
  "youtube",
] as const;

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function activationById(report?: ConnectorActivationReport | null) {
  return new Map((report?.connectors ?? []).map((connector) => [connector.connectorId, connector]));
}

function employeesByConnector(toolbox: AiEmployeeToolboxReadinessReport, connectorId: string) {
  return toolbox.employees.filter((employee) =>
    employee.toolbox.connectorHealth.some((tool) => tool.toolKey === connectorId) ||
    employee.toolbox.requiredTools.some((tool) => tool.toolKey === connectorId) ||
    employee.toolbox.optionalTools.some((tool) => tool.toolKey === connectorId),
  );
}

function credentialStatus(item: ConnectorActivationReportItem | undefined, connector: EnterpriseConnector): ConnectorCredentialStatus {
  if (connector.authenticationType === "none" || connector.authenticationType === "manual") return "configured";
  if (!item) return connector.credentialReference ? "unknown" : "configured";
  return item.credentialsPresent ? "configured" : "missing";
}

function scopeStatus(input: {
  item: ConnectorActivationReportItem | undefined;
  connector: EnterpriseConnector;
  credentialStatus: ConnectorCredentialStatus;
}): ConnectorScopeStatus {
  if (input.connector.requiredPermissions.length === 0) return "valid";
  if (input.credentialStatus === "missing") return "missing";
  if (!input.item) return "unknown";
  if (input.item.disabledFeatureFlags.length > 0) return "missing";

  return input.item.credentialsPresent ? "valid" : "unknown";
}

function healthStatus(input: {
  item: ConnectorActivationReportItem | undefined;
  connector: EnterpriseConnector;
  credentialStatus: ConnectorCredentialStatus;
}): ConnectorGateHealthStatus {
  if (input.connector.healthStatus === "rate_limited") return "rate_limited";
  if (input.connector.healthStatus === "unavailable" || input.connector.circuitBreakerState === "open") return "blocked";
  if (input.credentialStatus === "missing") return "not_configured";
  if (!input.item) return input.connector.healthStatus === "healthy" ? "ready" : "partial";
  if (input.item.status === "connected" || input.item.status === "internal_ready") return "ready";
  if (input.item.status === "credentials_missing") return "not_configured";
  if (input.item.status === "data_gap" || input.item.status === "incomplete" || input.item.status === "registry_only") return "partial";

  return "partial";
}

function gateMode(health: ConnectorGateHealthStatus): ConnectorActivationGateMode {
  if (health === "blocked" || health === "rate_limited" || health === "not_configured") return "blocked";
  return "read_only";
}

function revenueImpact(item: ConnectorActivationReportItem | undefined, connectorId: string): "high" | "medium" | "low" {
  if (item?.dealFlowImpact === "high") return "high";
  if (item?.dealFlowImpact === "medium") return "medium";
  if (["gmail", "google_search_console", "google_analytics"].includes(connectorId)) return "high";
  if (["google_drive", "google_calendar", "google_business_profile"].includes(connectorId)) return "medium";

  return "low";
}

function actionPolicy(connector: EnterpriseConnector, action: ConnectorAction, activationMode: ConnectorActivationGateMode): ConnectorActionPolicy {
  const plan = evaluateConnectorAction({ connectorId: connector.connectorId, actionKey: action.actionKey, module: "Connector Activation Gate" });
  const isReadOnlyAction = action.type === "read" && action.risk !== "blocked" && activationMode === "read_only";
  const allowed = isReadOnlyAction && plan.decision !== "blocked" && plan.decision !== "fallback_required";
  const mode: ConnectorActionPolicyMode = allowed ? "read_only" : action.type === "prepare" && activationMode !== "blocked" ? "approval_gated" : "blocked";

  return {
    connector: connector.displayName,
    connectorId: connector.connectorId,
    action: action.actionKey,
    label: action.label,
    mode,
    allowed,
    requiresApproval: action.approvalRequired || mode === "approval_gated",
    externalWrite: action.type === "write",
    reason: allowed ? "Read-only action is eligible for governed readiness visibility." : "Sprint 6A blocks provider writes and non-read connector actions.",
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function nextSafeAction(input: {
  item: ConnectorActivationReportItem | undefined;
  connector: EnterpriseConnector;
  credentialStatus: ConnectorCredentialStatus;
  scopeStatus: ConnectorScopeStatus;
  healthStatus: ConnectorGateHealthStatus;
}) {
  if (input.healthStatus === "rate_limited") return `Wait for provider quota cooldown before retrying ${input.connector.displayName} read-only checks.`;
  if (input.healthStatus === "blocked") return input.connector.retryPolicy;
  if (input.credentialStatus === "missing") return input.item?.nextRequiredAction ?? `Configure read-only credentials for ${input.connector.displayName}.`;
  if (input.scopeStatus === "missing") return `Confirm least-privilege read-only scope for ${input.connector.displayName}.`;
  if (input.healthStatus === "partial") return input.item?.nextRequiredAction ?? input.connector.retryPolicy;

  return `Use ${input.connector.displayName} for read-only visibility only; keep all writes blocked.`;
}

function certificationLevelForRecord(input: {
  healthStatus: ConnectorGateHealthStatus;
  allowedReadActions: string[];
  affectedEmployees: string[];
}): 0 | 1 | 2 | 3 {
  if (input.affectedEmployees.length === 0) return 0;
  if (input.allowedReadActions.length > 0 && input.healthStatus === "ready") return 2;
  if (input.allowedReadActions.length > 0) return 1;

  return 0;
}

function createRecord(input: {
  connector: EnterpriseConnector;
  item: ConnectorActivationReportItem | undefined;
  toolbox: AiEmployeeToolboxReadinessReport;
}): ConnectorActivationGateRecord {
  const affected = employeesByConnector(input.toolbox, input.connector.connectorId);
  const credential = credentialStatus(input.item, input.connector);
  const scope = scopeStatus({ item: input.item, connector: input.connector, credentialStatus: credential });
  const health = healthStatus({ item: input.item, connector: input.connector, credentialStatus: credential });
  const mode = gateMode(health);
  const actionPolicies = input.connector.supportedActions.map((action) => actionPolicy(input.connector, action, mode));
  const allowedActions = actionPolicies.filter((policy) => policy.allowed).map((policy) => policy.action);
  const forbiddenActions = actionPolicies.filter((policy) => !policy.allowed).map((policy) => policy.action);
  const levelUnlocked = certificationLevelForRecord({ healthStatus: health, allowedReadActions: allowedActions, affectedEmployees: affected.map((employee) => employee.name) });

  return {
    connector: input.connector.displayName,
    connectorId: input.connector.connectorId,
    mode,
    credentialStatus: credential,
    scopeStatus: scope,
    healthStatus: health,
    allowedActions,
    forbiddenActions,
    actionPolicies,
    affectedDepartments: uniqueSorted(affected.map((employee) => employee.department)),
    affectedEmployees: uniqueSorted(affected.map((employee) => employee.name)),
    certificationImpact: {
      levelUnlocked,
      blockedLevels: [4, 5],
      explanation:
        levelUnlocked >= 2
          ? "Read-only connector readiness can support Level 2 certification; Level 4 and Level 5 remain blocked."
          : "Connector is visible for readiness planning, but it does not unlock read-only certification yet.",
    },
    revenueImpact: revenueImpact(input.item, input.connector.connectorId),
    nextSafeAction: nextSafeAction({ item: input.item, connector: input.connector, credentialStatus: credential, scopeStatus: scope, healthStatus: health }),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createConnectorActivationGateFromInputs(input: ConnectorActivationGateInputs): ConnectorActivationGateReport {
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const activationItems = activationById(input.connectorActivationReport);
  const connectors = (input.connectors ?? listEnterpriseConnectors()).filter((connector) => sprint6GoogleConnectorIds.includes(connector.connectorId as never));
  const records = connectors.map((connector) => createRecord({ connector, item: activationItems.get(connector.connectorId), toolbox: input.toolbox }));
  const level2UnlockedEmployees = uniqueSorted(records.flatMap((record) => (record.certificationImpact.levelUnlocked >= 2 ? record.affectedEmployees : [])));
  const level3CandidateEmployees = uniqueSorted(
    input.toolbox.employees
      .filter((employee) => employee.certification.level >= 3 && records.some((record) => record.affectedEmployees.includes(employee.name)))
      .map((employee) => employee.name),
  );
  const level4BlockedEmployees = uniqueSorted(records.flatMap((record) => record.affectedEmployees));
  const ready = records.filter((record) => record.healthStatus === "ready").length;
  const partial = records.filter((record) => record.healthStatus === "partial").length;
  const blocked = records.filter((record) => record.healthStatus === "blocked").length;
  const rateLimited = records.filter((record) => record.healthStatus === "rate_limited").length;
  const needsCredentials = records.filter((record) => record.credentialStatus === "missing" || record.healthStatus === "not_configured").length;
  const readOnlyActionsAllowed = records.reduce((total, record) => total + record.allowedActions.length, 0);
  const forbiddenActions = records.reduce((total, record) => total + record.forbiddenActions.length, 0);

  return {
    ok: true,
    company: "J Capital Property Group",
    generatedAt,
    summary: {
      connectors: records.length,
      ready,
      partial,
      blocked,
      rateLimited,
      needsCredentials,
      readOnlyActionsAllowed,
      forbiddenActions,
    },
    records,
    googleWorkspaceFoundation: records,
    highestImpactNext: [...records]
      .sort((a, b) => {
        const impactScore = { high: 3, medium: 2, low: 1 };
        return impactScore[b.revenueImpact] - impactScore[a.revenueImpact] || b.affectedEmployees.length - a.affectedEmployees.length;
      })
      .slice(0, 5),
    employeeCertificationImpact: {
      level2UnlockedEmployees,
      level3CandidateEmployees,
      level4BlockedEmployees,
      level5BlockedEmployees: level4BlockedEmployees,
    },
    safety: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      oauthStarted: false,
      credentialsChanged: false,
      externalProviderWritesAllowed: false,
      connectorActivationEqualsExecution: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export async function createConnectorActivationGate(): Promise<ConnectorActivationGateReport> {
  const toolbox = await createAiEmployeeToolboxReadiness();
  const connectorActivationReport = await createConnectorActivationReport().catch(() => null);

  return createConnectorActivationGateFromInputs({ toolbox, connectorActivationReport });
}

export function assertConnectorActivationGateSafety(report: ConnectorActivationGateReport) {
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.oauthStarted,
    report.safety.credentialsChanged,
    report.safety.externalProviderWritesAllowed,
    report.records.some((record) => record.providerCalled || record.liveExecutionAllowed),
    report.records.some((record) => record.certificationImpact.blockedLevels[0] !== 4 || record.certificationImpact.blockedLevels[1] !== 5),
    report.records.some((record) => record.actionPolicies.some((policy) => policy.externalWrite && policy.allowed)),
    report.records.some((record) => record.actionPolicies.some((policy) => policy.liveExecutionAllowed || policy.providerCalled)),
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Connector activation gate safety contract failed.");
  }

  return true;
}

export function getConnectorActivationGateRecord(report: ConnectorActivationGateReport, connectorId: string) {
  const registryConnector = getEnterpriseConnector(connectorId);

  if (!registryConnector) return null;

  return report.records.find((record) => record.connectorId === connectorId) ?? null;
}
