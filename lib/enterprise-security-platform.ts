import { getPhase4GovernanceStatus } from "@/lib/phase4-production";
import { evaluateSafeAutomation } from "@/lib/safe-auto-mode";
import { createToolRegistrySummary } from "@/lib/tool-capability-manager";

export type SecuritySeverity = "critical" | "high" | "medium" | "low" | "info";
export type SecurityAction = "allow" | "warn" | "block" | "escalate" | "request_approval";
export type SecurityMode = "zero_trust" | "sandbox" | "test" | "production";

export type SecurityControlStatus = {
  id: string;
  title: string;
  status: "ready" | "partial" | "blocked" | "planned";
  severity: SecuritySeverity;
  summary: string;
  requiredForProduction: boolean;
  evidence: string[];
  recommendations: string[];
};

export type AiSecurityEventInput = {
  prompt?: string;
  requestedAction?: string;
  requestedToolKey?: string;
  userRole?: string;
  dataClasses?: string[];
  sourceLabel?: string;
};

export type AiSecurityDecision = {
  action: SecurityAction;
  severity: SecuritySeverity;
  reason: string;
  detectedSignals: string[];
  approvalRequired: boolean;
  providerCalled: false;
  liveExecutionAllowed: false;
  auditRequired: true;
};

export type ThreatSignal = {
  id: string;
  category:
    | "identity"
    | "ai_security"
    | "connector_security"
    | "api_security"
    | "data_protection"
    | "workflow_security"
    | "backup_recovery";
  severity: SecuritySeverity;
  summary: string;
  monitored: true;
  containmentAvailable: boolean;
};

export type IncidentResponsePlan = {
  incidentId: string;
  severity: SecuritySeverity;
  status: "contained" | "monitoring" | "manual_review_required";
  timeline: string[];
  containmentActions: string[];
  recoveryRecommendations: string[];
  manualApprovalRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type EnterpriseSecurityPlatformReport = {
  ok: true;
  subsystem: "Enterprise Security Platform";
  mode: SecurityMode;
  zeroTrustEnabled: true;
  summary: string;
  securityHealthScore: number;
  threatLevel: SecuritySeverity;
  controls: SecurityControlStatus[];
  threatSignals: ThreatSignal[];
  incidentPlan: IncidentResponsePlan;
  productionActivationGate: {
    allowed: false;
    blockers: string[];
    requiredChecks: string[];
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  aiSecurityAgent: {
    enabled: true;
    supportedActions: SecurityAction[];
    monitoredRisks: string[];
    learningInputs: string[];
    autonomousHistoricalMutationAllowed: false;
  };
  dashboardSections: string[];
  providerCalled: false;
  liveExecutionAllowed: false;
};

const suspiciousPromptPatterns = [
  /ignore (all )?((previous|system|developer)\s+){0,3}instructions/i,
  /reveal (the )?(secret|api key|token|credential|password)/i,
  /bypass (approval|safe auto|governance|permission|feature flag)/i,
  /jailbreak|developer mode|DAN\b/i,
  /exfiltrate|dump database|disable audit/i,
];

const unsafeActionPatterns = [
  /send|publish|post|call|scrape|crawl|spend|change_budget|activate_connector|execute_workflow|trigger_workflow|share_publicly|public_share|export/i,
];

function severityRank(severity: SecuritySeverity) {
  return { info: 0, low: 1, medium: 2, high: 3, critical: 4 }[severity];
}

function highestSeverity(severities: SecuritySeverity[]): SecuritySeverity {
  return severities.sort((a, b) => severityRank(b) - severityRank(a))[0] ?? "info";
}

export function evaluateAiSecurityEvent(input: AiSecurityEventInput): AiSecurityDecision {
  const detectedSignals: string[] = [];
  const prompt = input.prompt ?? "";
  const requestedAction = input.requestedAction ?? "";
  const unsafeActionRequested = unsafeActionPatterns.some((pattern) => pattern.test(requestedAction));

  for (const pattern of suspiciousPromptPatterns) {
    if (pattern.test(prompt)) detectedSignals.push("suspicious_prompt_pattern");
  }

  if (unsafeActionRequested) {
    detectedSignals.push("external_or_high_risk_action_requested");
  }

  if ((input.dataClasses ?? []).some((dataClass) => /secret|credential|token|financial|customer|restricted/i.test(dataClass))) {
    detectedSignals.push("sensitive_data_context");
  }

  if (input.userRole && !/admin|operator|security/i.test(input.userRole)) {
    detectedSignals.push("least_privilege_review_required");
  }

  const safeDecision = requestedAction && unsafeActionRequested
    ? evaluateSafeAutomation({
        requestedAction,
        preferredToolKey: input.requestedToolKey,
        module: "AI Security Agent",
      })
    : null;

  if (safeDecision?.status === "blocked") {
    detectedSignals.push("safe_auto_mode_blocked");
  }

  if (detectedSignals.includes("suspicious_prompt_pattern") || detectedSignals.includes("safe_auto_mode_blocked")) {
    return {
      action: "block",
      severity: "high",
      reason: "AI Security Agent blocked the request because it matched prompt-abuse or Safe Auto Mode risk signals.",
      detectedSignals: Array.from(new Set(detectedSignals)),
      approvalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  if (detectedSignals.length > 0) {
    return {
      action: "escalate",
      severity: detectedSignals.includes("sensitive_data_context") ? "medium" : "low",
      reason: "AI Security Agent escalated the request for human review before any external or sensitive action.",
      detectedSignals: Array.from(new Set(detectedSignals)),
      approvalRequired: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      auditRequired: true,
    };
  }

  return {
    action: "allow",
    severity: "info",
    reason: "No prompt-abuse, privilege, sensitive-data, or unsafe automation signal was detected.",
    detectedSignals: [],
    approvalRequired: false,
    providerCalled: false,
    liveExecutionAllowed: false,
    auditRequired: true,
  };
}

export function createIncidentResponsePlan(input: {
  incidentId?: string;
  severity: SecuritySeverity;
  signals: string[];
}): IncidentResponsePlan {
  const incidentId = input.incidentId ?? `incident-${Date.now()}`;
  const containmentActions = [
    "Freeze the affected AI action, connector, workflow, or API route.",
    "Require administrator review before recovery.",
    "Preserve audit evidence and incident timeline.",
  ];

  if (severityRank(input.severity) >= severityRank("high")) {
    containmentActions.push("Isolate affected connector or session until root cause is reviewed.");
  }

  return {
    incidentId,
    severity: input.severity,
    status: severityRank(input.severity) >= severityRank("high") ? "manual_review_required" : "monitoring",
    timeline: [
      "Detection signal received.",
      `Signals classified: ${input.signals.length > 0 ? input.signals.join(", ") : "none"}.`,
      "Containment recommendation prepared.",
      "Manual recovery approval required before resuming affected capability.",
    ],
    containmentActions,
    recoveryRecommendations: [
      "Review identity, permission, connector, API, audit, and data-protection evidence.",
      "Validate backup and rollback readiness before production reactivation.",
      "Document root cause and administrator decision.",
    ],
    manualApprovalRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createEnterpriseSecurityPlatformReport(): EnterpriseSecurityPlatformReport {
  const toolSummary = createToolRegistrySummary();
  const phase4 = getPhase4GovernanceStatus();
  const controls: SecurityControlStatus[] = [
    {
      id: "identity-access",
      title: "Enterprise Identity & Access",
      status: "partial",
      severity: "high",
      summary: "Secure login and signed sessions exist; MFA, RBAC, ABAC, device trust, account lockout, and SSO are required for enterprise readiness.",
      requiredForProduction: true,
      evidence: ["signed session cookie", "admin authentication gate", "secure logout route"],
      recommendations: ["Add MFA enrollment", "Add role and attribute policy tables", "Add account lockout and login notification events"],
    },
    {
      id: "ai-security-agent",
      title: "AI Security Agent",
      status: "ready",
      severity: "high",
      summary: "AI requests can be checked for prompt injection, jailbreaks, tool abuse, unsafe automation, privilege risk, and data leakage before execution.",
      requiredForProduction: true,
      evidence: ["prompt-abuse pattern detection", "Safe Auto Mode validation", "audit-required decisions"],
      recommendations: ["Persist AI security events to the audit timeline in a future migration"],
    },
    {
      id: "connector-security",
      title: "Connector Security",
      status: toolSummary.blockedOrUnavailableTools > 0 ? "partial" : "ready",
      severity: "high",
      summary: "Connector health, rate-limit, approval, fallback, and live-execution flags are enforced through existing connector and tool registry policy.",
      requiredForProduction: true,
      evidence: [`readinessOnlyTools:${toolSummary.readinessOnlyTools}`, `blockedOrUnavailableTools:${toolSummary.blockedOrUnavailableTools}`],
      recommendations: ["Add encrypted credential vault integration", "Add rotation evidence", "Keep sandbox/test/production modes isolated"],
    },
    {
      id: "api-security",
      title: "API Security",
      status: "partial",
      severity: "high",
      summary: "Dashboard APIs are authenticated by default, but full API versioning, output schemas, CSRF coverage, replay mitigation, and abuse analytics need expansion.",
      requiredForProduction: true,
      evidence: ["authenticated dashboard APIs", "zod input validation patterns", "rate-limit helper"],
      recommendations: ["Standardize secure response envelopes", "Add request IDs", "Add replay nonce checks for mutating routes"],
    },
    {
      id: "data-protection",
      title: "Data Protection",
      status: "planned",
      severity: "high",
      summary: "Source attribution and redaction patterns exist; encryption-at-rest evidence, retention policy enforcement, secure deletion, and restore testing are required.",
      requiredForProduction: true,
      evidence: ["source attribution rules", "audit metadata redaction", "server-only secrets boundary"],
      recommendations: ["Define retention schedules", "Add backup validation", "Add secure deletion workflow"],
    },
    {
      id: "backup-disaster-recovery",
      title: "Backup & Disaster Recovery",
      status: "planned",
      severity: "medium",
      summary: "Production activation must remain blocked until backup, restore, configuration backup, and recovery readiness are validated.",
      requiredForProduction: true,
      evidence: ["production readiness gate", "manual deployment blockers"],
      recommendations: ["Add scheduled backup job", "Add restore-test hook", "Back up connector and AI configuration"],
    },
  ];
  const threatSignals: ThreatSignal[] = [
    {
      id: "failed-login-monitoring",
      category: "identity",
      severity: "medium",
      summary: "Failed login, lockout, session, device, and geographic anomaly monitoring must feed security alerts.",
      monitored: true,
      containmentAvailable: true,
    },
    {
      id: "ai-agent-misuse",
      category: "ai_security",
      severity: "high",
      summary: "Prompt injection, jailbreak, tool abuse, hallucination risk, privilege escalation, and data leakage signals are monitored before AI action.",
      monitored: true,
      containmentAvailable: true,
    },
    {
      id: "connector-failure-isolation",
      category: "connector_security",
      severity: "high",
      summary: "Connector failures, credential misuse, rate limits, retry exhaustion, and circuit breaker state must isolate the connector instead of cascading.",
      monitored: true,
      containmentAvailable: true,
    },
    {
      id: "api-abuse-detection",
      category: "api_security",
      severity: "high",
      summary: "API abuse, excessive requests, injection attempts, replay risk, and unauthorized access attempts require audit and alert routing.",
      monitored: true,
      containmentAvailable: true,
    },
  ];
  const threatLevel = highestSeverity([
    ...controls.filter((control) => control.status !== "ready").map((control) => control.severity),
    ...threatSignals.map((signal) => signal.severity),
  ]);
  const blockers = controls
    .filter((control) => control.requiredForProduction && control.status !== "ready")
    .map((control) => `${control.title} is ${control.status}.`);

  if (phase4.governanceBlockers.length > 0) blockers.push(...phase4.governanceBlockers);

  return {
    ok: true,
    subsystem: "Enterprise Security Platform",
    mode: "zero_trust",
    zeroTrustEnabled: true,
    summary:
      "Permanent AI Core subsystem for Zero Trust identity, AI defense, connector security, API protection, data protection, threat detection, incident response, monitoring, and recovery readiness.",
    securityHealthScore: Math.max(0, 100 - blockers.length * 8),
    threatLevel,
    controls,
    threatSignals,
    incidentPlan: createIncidentResponsePlan({
      severity: threatLevel,
      signals: threatSignals.map((signal) => signal.id),
    }),
    productionActivationGate: {
      allowed: false,
      blockers,
      requiredChecks: [
        "Authentication",
        "Authorization",
        "Encryption",
        "Audit logging",
        "Feature flags",
        "Approval workflows",
        "Safe Auto Mode",
        "Connector health",
        "Rate limiting",
        "Backup readiness",
        "Recovery readiness",
        "AI governance compliance",
      ],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    aiSecurityAgent: {
      enabled: true,
      supportedActions: ["allow", "warn", "block", "escalate", "request_approval"],
      monitoredRisks: [
        "prompt injection",
        "jailbreak",
        "tool abuse",
        "unauthorized tool access",
        "hallucination risk",
        "unsafe automation",
        "privilege escalation",
        "data leakage",
      ],
      learningInputs: ["previous attacks", "failed logins", "blocked prompts", "connector failures", "security incidents", "administrator decisions"],
      autonomousHistoricalMutationAllowed: false,
    },
    dashboardSections: [
      "System Health",
      "Security Health",
      "Threat Level",
      "Authentication Events",
      "Active Sessions",
      "Connector Security",
      "API Health",
      "Audit Events",
      "Security Alerts",
      "Risk Score",
      "AI Security Events",
      "Credential Health",
      "Incident Timeline",
      "Recommendations",
    ],
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}
