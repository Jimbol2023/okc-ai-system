export const operationalEvidenceStates = ["real", "synthetic", "demo", "test", "certification"] as const;
export const operationalVerificationStates = ["verified", "unverified", "rejected"] as const;

export type OperationalEvidence = {
  tenantId: string | null | undefined;
  source: string | null | undefined;
  sourceType: string | null | undefined;
  sourceReference: string | null | undefined;
  observedAt: Date | string | null | undefined;
  evidenceState: (typeof operationalEvidenceStates)[number] | null | undefined;
  verificationState: (typeof operationalVerificationStates)[number] | null | undefined;
  certificationApproved?: boolean;
  identityValues?: Array<string | null | undefined>;
};

export type OperationalEvidenceDecision = {
  allowed: boolean;
  reasonCodes: string[];
  providerCalled: false;
  providerWrite: false;
  sent: false;
  published: false;
  outreach: false;
  skipTracePerformed: false;
  directMailSent: false;
  crmMutated: false;
  externalExecutionAllowed: false;
  liveExecutionAllowed: false;
};

const prohibitedSource = /jsonplaceholder(?:\.typicode)?\.com|jsonplaceholder|ai[-_\s]?generated|lead[-_\s]?generator|faker|fixture|placeholder|mock[-_\s]?provider|demo[-_\s]?provider/i;
const prohibitedIdentity = /\b(leanne graham|ervin howell|clementine bauch|patricia leblanc|chelsey dietrich|mrs\. dennis schulist|kurtis weissnat|nicholas runolfsdottir|glenna reichert|clementina dubuque|kulas light|victor plains|douglas extension|hoeger mall|skiles walk|norberto crossing|rex trail|dayna park)\b/i;
const syntheticMarker = /(^|[^a-z0-9])(acceptance|test|synthetic|demo|fixture|sample|seed|seeded|fake|generated)([^a-z0-9]|$)/i;

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

export function evaluateOperationalEvidence(input: OperationalEvidence): OperationalEvidenceDecision {
  const reasonCodes: string[] = [];
  const provenanceText = [input.source, input.sourceType, input.sourceReference, ...(input.identityValues ?? [])]
    .filter((value): value is string => typeof value === "string")
    .join(" ");

  if (!hasText(input.tenantId)) reasonCodes.push("tenant_missing");
  if (!hasText(input.source)) reasonCodes.push("source_missing");
  if (!hasText(input.sourceType)) reasonCodes.push("source_type_missing");
  if (!hasText(input.sourceReference)) reasonCodes.push("source_reference_missing");
  const observedAt = input.observedAt instanceof Date ? input.observedAt : new Date(input.observedAt ?? "");
  if (Number.isNaN(observedAt.getTime())) reasonCodes.push("observation_timestamp_missing_or_invalid");
  if (!input.evidenceState) reasonCodes.push("evidence_state_missing");
  if (!input.verificationState) reasonCodes.push("verification_state_missing");
  if (input.verificationState === "rejected") reasonCodes.push("verification_rejected");
  if (input.evidenceState && input.evidenceState !== "real") reasonCodes.push(`evidence_${input.evidenceState}`);
  if (input.evidenceState === "certification" && input.certificationApproved !== true) reasonCodes.push("certification_not_approved");
  if (prohibitedSource.test(provenanceText)) reasonCodes.push("known_demo_provider");
  if (prohibitedIdentity.test(provenanceText)) reasonCodes.push("known_demo_identity");
  if (syntheticMarker.test(provenanceText)) reasonCodes.push("synthetic_marker");

  return {
    allowed: reasonCodes.length === 0,
    reasonCodes: Array.from(new Set(reasonCodes)),
    providerCalled: false,
    providerWrite: false,
    sent: false,
    published: false,
    outreach: false,
    skipTracePerformed: false,
    directMailSent: false,
    crmMutated: false,
    externalExecutionAllowed: false,
    liveExecutionAllowed: false,
  };
}

export function operationalEvidenceFromLead(lead: {
  tenantId: string;
  source: string;
  createdAt: Date | string;
  name?: string | null;
  propertyAddress?: string | null;
  revenueLeadSources?: Array<{ source: string; sourceType: string; sourceDetail: string; sourceRecordId?: string | null; verified: boolean; createdAt: Date | string }>;
}): OperationalEvidence {
  const provenance = lead.revenueLeadSources?.[0];
  return {
    tenantId: lead.tenantId,
    source: provenance?.source ?? lead.source,
    sourceType: provenance?.sourceType,
    sourceReference: provenance?.sourceRecordId ?? provenance?.sourceDetail,
    observedAt: provenance?.createdAt ?? lead.createdAt,
    evidenceState: "real",
    verificationState: provenance ? (provenance.verified ? "verified" : "unverified") : undefined,
    identityValues: [lead.name, lead.propertyAddress, provenance?.sourceDetail],
  };
}
