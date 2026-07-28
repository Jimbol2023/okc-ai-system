import {
  assertConnectorCredentialScopeVerificationSafety,
  createConnectorCredentialScopeVerification,
  type ConnectorCredentialScopeVerificationReport,
} from "@/lib/connector-credential-scope-verification";

export type ConnectorOperatorEvidenceStatus =
  | "accepted_for_report"
  | "redacted_for_safety"
  | "rejected_secret_like"
  | "incomplete";

export type ConnectorOperatorScopeEvidence = {
  scope: string;
  status: ConnectorOperatorEvidenceStatus;
  connectorIds: string[];
  message: string;
};

export type ConnectorOperatorEvidenceInput = {
  grantedScopes?: string[];
  operatorInitials?: string;
  note?: string;
  generatedAt?: string;
};

export type ConnectorOperatorRunbookStep = {
  connectorId: string;
  connector: string;
  step: string;
  requiredScopes: string[];
  missingConfig: string[];
  missingScopes: string[];
  nextSafeAction: string;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorOperatorEvidencePacket = {
  ok: true;
  company: "J Capital Property Group";
  generatedAt: string;
  mode: "report_only";
  operatorInitials: string | null;
  sanitizedNote: string | null;
  runbookSteps: ConnectorOperatorRunbookStep[];
  scopeEvidence: ConnectorOperatorScopeEvidence[];
  summary: {
    requiredScopes: number;
    acceptedScopes: number;
    missingScopes: number;
    redactedItems: number;
    rejectedItems: number;
  };
  safety: ConnectorOperatorEvidenceSafety;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type ConnectorOperatorEvidenceSafety = {
  readOnly: true;
  reportOnly: true;
  persistenceAttempted: false;
  dbWriteAttempted: false;
  auditWriteAttempted: false;
  memoryWriteAttempted: false;
  fileWriteAttempted: false;
  providerCalled: false;
  liveExecutionAllowed: false;
  oauthStarted: false;
  credentialsChanged: false;
  connectorActivationImplied: false;
  rawSecretValuesExposed: false;
  level4Unlocked: false;
  level5Unlocked: false;
};

const secretLikePattern = /(ya29\.|GOCSPX-|Bearer\b|client_secret|refresh_token|private_key|BEGIN PRIVATE KEY|-----BEGIN)/i;
const renderedSecretLeakPattern = /(ya29\.|GOCSPX-|Bearer\b|private_key|BEGIN PRIVATE KEY|-----BEGIN)/i;
const allowedScopePattern = /^https:\/\/www\.googleapis\.com\/auth\/[a-z0-9._/-]+$/i;

function uniqueSorted(values: string[]) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function sanitizeInitials(value: unknown) {
  if (typeof value !== "string") return null;
  const safe = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

  return safe || null;
}

function sanitizeNote(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, 500);
  if (!trimmed) return null;
  if (secretLikePattern.test(trimmed)) return "[redacted secret-like operator note]";

  return trimmed;
}

function requiredScopeMap(verification: ConnectorCredentialScopeVerificationReport) {
  const map = new Map<string, string[]>();

  for (const item of verification.checklist) {
    for (const scope of item.scopeChecks.map((check) => check.scope)) {
      map.set(scope, uniqueSorted([...(map.get(scope) ?? []), item.connectorId]));
    }
  }

  return map;
}

function createRunbookSteps(verification: ConnectorCredentialScopeVerificationReport): ConnectorOperatorRunbookStep[] {
  return verification.checklist.map((item) => ({
    connectorId: item.connectorId,
    connector: item.connector,
    step: `Verify ${item.connector} local config and read-only OAuth scope evidence before any live connector read is requested.`,
    requiredScopes: item.scopeChecks.map((check) => check.scope),
    missingConfig: item.missingConfig,
    missingScopes: item.missingScopes,
    nextSafeAction: item.nextSafeAction,
    providerCalled: false,
    liveExecutionAllowed: false,
  }));
}

function normalizeGrantedScopes(scopes: unknown): string[] {
  if (!Array.isArray(scopes)) return [];

  return uniqueSorted(scopes.flatMap((scope) => (typeof scope === "string" ? scope.split(/[\s,]+/) : [])).map((scope) => scope.trim()));
}

export function createConnectorOperatorEvidencePacketFromInputs(input: {
  verification: ConnectorCredentialScopeVerificationReport;
  evidence?: ConnectorOperatorEvidenceInput;
}): ConnectorOperatorEvidencePacket {
  assertConnectorCredentialScopeVerificationSafety(input.verification);

  const generatedAt = input.evidence?.generatedAt ?? input.verification.generatedAt ?? new Date().toISOString();
  const requiredScopes = requiredScopeMap(input.verification);
  const submittedScopes = normalizeGrantedScopes(input.evidence?.grantedScopes);
  const scopeEvidence: ConnectorOperatorScopeEvidence[] = [];

  for (const scope of submittedScopes) {
    if (secretLikePattern.test(scope)) {
      scopeEvidence.push({
        scope: "[redacted]",
        status: "rejected_secret_like",
        connectorIds: [],
        message: "Input looked like a token or secret and was rejected from the report.",
      });
      continue;
    }

    if (!allowedScopePattern.test(scope)) {
      scopeEvidence.push({
        scope: scope.slice(0, 160),
        status: "redacted_for_safety",
        connectorIds: [],
        message: "Input was not a recognized Google OAuth scope URL.",
      });
      continue;
    }

    scopeEvidence.push({
      scope,
      status: requiredScopes.has(scope) ? "accepted_for_report" : "incomplete",
      connectorIds: requiredScopes.get(scope) ?? [],
      message: requiredScopes.has(scope) ? "Scope matches Sprint 6 required read-only evidence." : "Scope is safe text but not required by the Sprint 6 Google connector set.",
    });
  }

  for (const [scope, connectorIds] of requiredScopes) {
    if (!scopeEvidence.some((item) => item.scope === scope && item.status === "accepted_for_report")) {
      scopeEvidence.push({
        scope,
        status: "incomplete",
        connectorIds,
        message: "Required scope has not been supplied in the operator evidence preview.",
      });
    }
  }

  const packet: ConnectorOperatorEvidencePacket = {
    ok: true,
    company: "J Capital Property Group",
    generatedAt,
    mode: "report_only",
    operatorInitials: sanitizeInitials(input.evidence?.operatorInitials),
    sanitizedNote: sanitizeNote(input.evidence?.note),
    runbookSteps: createRunbookSteps(input.verification),
    scopeEvidence,
    summary: {
      requiredScopes: requiredScopes.size,
      acceptedScopes: scopeEvidence.filter((item) => item.status === "accepted_for_report").length,
      missingScopes: scopeEvidence.filter((item) => item.status === "incomplete" && requiredScopes.has(item.scope)).length,
      redactedItems: scopeEvidence.filter((item) => item.status === "redacted_for_safety").length,
      rejectedItems: scopeEvidence.filter((item) => item.status === "rejected_secret_like").length,
    },
    safety: {
      readOnly: true,
      reportOnly: true,
      persistenceAttempted: false,
      dbWriteAttempted: false,
      auditWriteAttempted: false,
      memoryWriteAttempted: false,
      fileWriteAttempted: false,
      providerCalled: false,
      liveExecutionAllowed: false,
      oauthStarted: false,
      credentialsChanged: false,
      connectorActivationImplied: false,
      rawSecretValuesExposed: false,
      level4Unlocked: false,
      level5Unlocked: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertConnectorOperatorEvidenceSafety(packet);

  return packet;
}

export async function createConnectorOperatorRunbook() {
  const verification = await createConnectorCredentialScopeVerification();

  return createConnectorOperatorEvidencePacketFromInputs({ verification });
}

export async function previewConnectorOperatorEvidence(evidence: ConnectorOperatorEvidenceInput) {
  const verification = await createConnectorCredentialScopeVerification();

  return createConnectorOperatorEvidencePacketFromInputs({ verification, evidence });
}

export function assertConnectorOperatorEvidenceSafety(packet: ConnectorOperatorEvidencePacket) {
  const serialized = JSON.stringify(packet);
  const unsafe = [
    packet.providerCalled,
    packet.liveExecutionAllowed,
    packet.safety.providerCalled,
    packet.safety.liveExecutionAllowed,
    packet.safety.oauthStarted,
    packet.safety.credentialsChanged,
    packet.safety.persistenceAttempted,
    packet.safety.dbWriteAttempted,
    packet.safety.auditWriteAttempted,
    packet.safety.memoryWriteAttempted,
    packet.safety.fileWriteAttempted,
    packet.safety.connectorActivationImplied,
    packet.safety.rawSecretValuesExposed,
    packet.safety.level4Unlocked,
    packet.safety.level5Unlocked,
    renderedSecretLeakPattern.test(serialized),
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Connector operator evidence safety contract failed.");
  }

  return true;
}
