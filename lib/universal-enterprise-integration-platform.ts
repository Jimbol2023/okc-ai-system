import {
  getEnterpriseConnector,
  listEnterpriseConnectors,
  type ConnectorAction,
  type ConnectorHealthStatus,
  type EnterpriseConnector,
} from "@/lib/connector-platform";
import { isFeatureEnabled } from "@/lib/feature-flags";

export const ueipLifecycleStates = [
  "proposed",
  "sandboxed",
  "read_only",
  "controlled_write",
  "suspended",
  "deprecated",
  "retired",
] as const;

export type UeipLifecycleState = (typeof ueipLifecycleStates)[number];
export type UeipDataClassification = "public" | "internal" | "confidential" | "restricted";
export type UeipCapabilityRisk = "low" | "medium" | "high" | "blocked";

export type UeipCapability = {
  capabilityKey: string;
  providerActionKey: string;
  operation: "read" | "prepare" | "write" | "monitor";
  risk: UeipCapabilityRisk;
  requiredScopes: string[];
  approvalPolicy: "none" | "human_review" | "exact_action_approval" | "blocked";
  dataClassification: UeipDataClassification;
  liveExecutionAllowed: false;
};

export type UniversalConnectorManifest = {
  schemaVersion: "ueip-connector-manifest-v1";
  connectorId: string;
  connectorVersion: string;
  provider: string;
  ownerDepartment: string;
  supportedTenantIds: string[];
  compatibleBusinessModules: string[];
  lifecycleState: UeipLifecycleState;
  authentication: {
    strategy: EnterpriseConnector["authenticationType"];
    credentialReferenceConfigured: boolean;
    credentialReferenceLabel: string | null;
    secretValuesExposed: false;
  };
  capabilities: UeipCapability[];
  environments: EnterpriseConnector["environmentSupport"];
  dependencies: string[];
  reliability: {
    rateLimitPolicy: string;
    quotaPolicy: string;
    timeoutPolicy: string;
    retryPolicy: string;
    circuitBreakerState: EnterpriseConnector["circuitBreakerState"];
  };
  governance: {
    auditRequired: true;
    redactionRequired: true;
    provenanceRequired: true;
    retentionPolicy: "connector-policy-required";
    incidentRunbook: "connector-owner-and-approval-safety-escalation";
  };
};

export type UeipGatewayRequest = {
  tenantId: string;
  actorId: string;
  aiEmployee?: string;
  businessModule: string;
  connectorId: string;
  capabilityKey: string;
  environment: "development" | "preview" | "production";
  approvalId?: string;
  exactApprovedCapability?: string;
  credentialScopes?: string[];
  featureFlagsVerified?: boolean;
  connectorHealth?: ConnectorHealthStatus;
  safeAutoMode?: "manual" | "assisted" | "safe_auto_internal" | "safe_auto_limited";
};

export type UeipPolicyDecision = {
  decision: "allow_read_plan" | "allow_internal_preparation" | "requires_exact_approval" | "blocked";
  reasonCodes: string[];
  connectorId: string;
  capabilityKey: string;
  tenantId: string;
  approvalId: string | null;
  manifestVersion: "ueip-connector-manifest-v1";
  policyVersion: string;
  capabilityVersion: string;
  installationId: string | null;
  scopeDecision: "not_evaluated" | "sufficient" | "insufficient";
  lifecycleDecision: "not_evaluated" | "allowed" | "blocked";
  auditRequired: true;
  traceRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

function semanticCapabilityKey(action: ConnectorAction) {
  const normalized = action.actionKey
    .replace(/^read_/, "")
    .replace(/^prepare_/, "")
    .replace(/^create_/, "")
    .replace(/^external_/, "records_")
    .replace(/_/g, ".");
  const verb = action.type === "prepare" ? "prepare" : action.type;
  return `${normalized}.${verb}`;
}

function mapLifecycle(connector: EnterpriseConnector): UeipLifecycleState {
  if (connector.lifecycleState === "removed") return "retired";
  if (connector.lifecycleState === "disabled") return "suspended";
  if (connector.lifecycleState === "upgrade_available") return "deprecated";
  if (connector.lifecycleState === "available" || connector.healthStatus === "readiness_only") return "proposed";
  if (connector.supportedActions.some((action) => action.type === "read" && action.risk !== "blocked")) return "read_only";
  if (connector.lifecycleState === "tested" || connector.lifecycleState === "authenticated") return "sandboxed";
  return "proposed";
}

function capabilityFromAction(connector: EnterpriseConnector, action: ConnectorAction): UeipCapability {
  return {
    capabilityKey: action.capabilityKey ?? semanticCapabilityKey(action),
    providerActionKey: action.actionKey,
    operation: action.type,
    risk: action.risk,
    requiredScopes: [...connector.requiredPermissions],
    approvalPolicy:
      action.type === "write" || action.risk === "blocked"
        ? "blocked"
        : action.approvalRequired
          ? "human_review"
          : "none",
    dataClassification: connector.riskLevel === "high" ? "confidential" : "internal",
    liveExecutionAllowed: false,
  };
}

export function createUniversalConnectorManifest(
  connector: EnterpriseConnector,
  options: { supportedTenantIds?: string[]; compatibleBusinessModules?: string[] } = {},
): UniversalConnectorManifest {
  return {
    schemaVersion: "ueip-connector-manifest-v1",
    connectorId: connector.connectorId,
    connectorVersion: connector.version,
    provider: connector.provider,
    ownerDepartment: connector.owner,
    supportedTenantIds: options.supportedTenantIds ?? ["default"],
    compatibleBusinessModules: options.compatibleBusinessModules ?? ["ai_core"],
    lifecycleState: mapLifecycle(connector),
    authentication: {
      strategy: connector.authenticationType,
      credentialReferenceConfigured: Boolean(connector.credentialReference),
      credentialReferenceLabel: connector.credentialReference,
      secretValuesExposed: false,
    },
    capabilities: connector.supportedActions.map((action) => capabilityFromAction(connector, action)),
    environments: [...connector.environmentSupport],
    dependencies: [...connector.dependencies],
    reliability: {
      rateLimitPolicy: connector.rateLimits,
      quotaPolicy: connector.usageQuotas,
      timeoutPolicy: connector.timeoutPolicy,
      retryPolicy: connector.retryPolicy,
      circuitBreakerState: connector.circuitBreakerState,
    },
    governance: {
      auditRequired: true,
      redactionRequired: true,
      provenanceRequired: true,
      retentionPolicy: "connector-policy-required",
      incidentRunbook: "connector-owner-and-approval-safety-escalation",
    },
  };
}

export function listUniversalConnectorManifests() {
  return listEnterpriseConnectors().map((connector) => createUniversalConnectorManifest(connector));
}

export function evaluateUeipGatewayRequest(
  request: UeipGatewayRequest,
  options: { manifest?: UniversalConnectorManifest } = {},
): UeipPolicyDecision {
  const connector = getEnterpriseConnector(request.connectorId);
  const manifest = options.manifest ?? (connector ? createUniversalConnectorManifest(connector) : null);
  const base = {
    connectorId: request.connectorId,
    capabilityKey: request.capabilityKey,
    tenantId: request.tenantId,
    approvalId: request.approvalId ?? null,
    manifestVersion: "ueip-connector-manifest-v1" as const,
    policyVersion: "ueip-control-policy-v1",
    capabilityVersion: "1.0.0",
    installationId: null,
    scopeDecision: "not_evaluated" as const,
    lifecycleDecision: "not_evaluated" as const,
    auditRequired: true as const,
    traceRequired: true as const,
    providerCalled: false as const,
    liveExecutionAllowed: false as const,
  };

  if (!manifest) return { ...base, decision: "blocked", reasonCodes: ["connector_not_registered"] };
  if (!manifest.supportedTenantIds.includes(request.tenantId)) {
    return { ...base, decision: "blocked", reasonCodes: ["tenant_not_authorized"] };
  }
  if (!manifest.compatibleBusinessModules.includes(request.businessModule) && !manifest.compatibleBusinessModules.includes("ai_core")) {
    return { ...base, decision: "blocked", reasonCodes: ["business_module_not_authorized"] };
  }
  if (!manifest.environments.includes(request.environment)) {
    return { ...base, decision: "blocked", reasonCodes: ["environment_not_supported"] };
  }
  if (["suspended", "deprecated", "retired"].includes(manifest.lifecycleState)) {
    return { ...base, decision: "blocked", reasonCodes: ["connector_lifecycle_blocked"] };
  }

  const capability = manifest.capabilities.find((candidate) => candidate.capabilityKey === request.capabilityKey);
  if (!capability) return { ...base, decision: "blocked", reasonCodes: ["capability_not_registered"] };

  const health = request.connectorHealth ?? connector?.healthStatus ?? "unavailable";
  if (health === "unavailable" || health === "rate_limited" || manifest.reliability.circuitBreakerState === "open") {
    return { ...base, decision: "blocked", reasonCodes: ["connector_unhealthy_fail_closed"] };
  }

  const missingScopes = capability.requiredScopes.filter((scope) => !(request.credentialScopes ?? []).includes(scope));
  if (capability.requiredScopes.length > 0 && missingScopes.length > 0) {
    return { ...base, decision: "blocked", reasonCodes: ["credential_scope_insufficient"] };
  }

  const flagsReady = request.featureFlagsVerified ?? connector?.featureFlags.every((flag) => isFeatureEnabled(flag)) ?? false;
  if (!flagsReady) return { ...base, decision: "blocked", reasonCodes: ["feature_flag_gate_closed"] };

  if (capability.operation === "write" || capability.approvalPolicy === "exact_action_approval") {
    const exactApproval = Boolean(request.approvalId) && request.exactApprovedCapability === capability.capabilityKey;
    if (!exactApproval || manifest.lifecycleState !== "controlled_write") {
      return {
        ...base,
        decision: exactApproval ? "blocked" : "requires_exact_approval",
        reasonCodes: [exactApproval ? "controlled_write_lifecycle_not_authorized" : "exact_action_approval_required"],
      };
    }
  }

  if (capability.approvalPolicy === "blocked" || capability.risk === "blocked") {
    return { ...base, decision: "blocked", reasonCodes: ["capability_policy_blocked"] };
  }

  return {
    ...base,
    decision: capability.operation === "read" ? "allow_read_plan" : "allow_internal_preparation",
    reasonCodes: [capability.operation === "read" ? "governed_read_plan_allowed" : "internal_preparation_only"],
  };
}

export function certifyUniversalConnectorManifest(manifest: UniversalConnectorManifest) {
  const failures: string[] = [];
  if (!/^\d+\.\d+\.\d+$/.test(manifest.connectorVersion)) failures.push("semantic_version_required");
  if (manifest.supportedTenantIds.length === 0) failures.push("tenant_scope_required");
  if (manifest.capabilities.length === 0) failures.push("capability_required");
  if (!manifest.governance.auditRequired) failures.push("audit_required");
  if (!manifest.governance.redactionRequired) failures.push("redaction_required");
  if (manifest.authentication.secretValuesExposed) failures.push("secret_exposure_forbidden");
  if (manifest.capabilities.some((capability) => capability.liveExecutionAllowed !== false)) failures.push("live_execution_forbidden");
  if (manifest.capabilities.some((capability) => capability.operation === "write" && capability.approvalPolicy !== "blocked" && capability.approvalPolicy !== "exact_action_approval")) {
    failures.push("write_requires_exact_policy");
  }
  return { certified: failures.length === 0, failures, connectorId: manifest.connectorId };
}

export function createUeipPortfolioReport() {
  const manifests = listUniversalConnectorManifests();
  const certifications = manifests.map(certifyUniversalConnectorManifest);
  return {
    initiative: "Universal Enterprise Integration Platform",
    platformOwner: "Integration Platform Engineering",
    manifestSchemaVersion: "ueip-connector-manifest-v1",
    connectorCount: manifests.length,
    certifiedCount: certifications.filter((result) => result.certified).length,
    lifecycleCounts: Object.fromEntries(ueipLifecycleStates.map((state) => [state, manifests.filter((manifest) => manifest.lifecycleState === state).length])),
    manifests,
    certifications,
    safety: {
      gatewayRequired: true,
      tenantIsolationRequired: true,
      exactActionApprovalRequiredForWrites: true,
      credentialsExposed: false,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
  } as const;
}
