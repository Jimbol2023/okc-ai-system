import { Prisma } from "@/generated/prisma";

import { getActiveDistressFlags } from "@/lib/distress-flags";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";
import { prisma } from "@/lib/prisma";

const DEFAULT_TENANT_ID = "default";
const SECRET_FIELD_PATTERN = /(secret|token|password|credential|api[_-]?key|auth|cookie|session|provider[_-]?response|raw[_-]?response|message[_-]?body|sms[_-]?body|email[_-]?body|phone|recipient)/i;

export type RevenueScoreInput = Pick<
  StoredLead,
  | "id"
  | "source"
  | "propertyAddress"
  | "phone"
  | "email"
  | "ownerName"
  | "parcelId"
  | "county"
  | "situationDetails"
  | "status"
  | "score"
  | "priority"
  | "distressFlags"
  | "lastSellerReply"
  | "lastContactedAt"
  | "nextFollowUpAt"
  | "doNotContact"
  | "approvalStatus"
  | "isHot"
>;

export type RevenueLeadScoreSummary = {
  score: number;
  confidence: number;
  priority: "High" | "Medium" | "Low";
  explanation: string;
  recommendedNextAction: string;
  missingData: string[];
  scoreBreakdown: Record<string, number>;
  assumptions: string[];
  dataUsed: string[];
};

export type DuplicateCandidate = {
  leadId: string;
  reason: string;
  confidence: number;
  matchedReasons: string[];
  matchedFields: string[];
};

export type RevenueInboxItem = {
  lead: StoredLead;
  latestScore: RevenueLeadScoreSummary | null;
  duplicateWarnings: DuplicateCandidate[];
  followUpFlags: string[];
  recommendedAction: string;
};

export type RevenueCommandCenterTask = Prisma.RevenueTaskGetPayload<Record<string, never>>;
export type RevenueCommandCenterAuditEvent = Prisma.RevenueAuditEventGetPayload<Record<string, never>>;
export type RevenueCommandCenterConnector = Prisma.ConnectorDefinitionGetPayload<Record<string, never>>;
export type RevenueCommandCenterDecisionLog = Prisma.RevenueDecisionLogGetPayload<Record<string, never>>;
export type RevenueSourcePerformance = {
  source: string;
  leads: number;
  qualified: number;
  avgScore: number;
  conversionSignal: number;
};
export type RevenueConnectorHealthSummary = {
  total: number;
  active: number;
  readinessOnly: number;
  inactive: number;
  providerCallsAllowed: number;
  approvalRequired: number;
};
export type RevenueDecisionFeedbackSummary = {
  total: number;
  pending: number;
  accepted: number;
  modified: number;
  ignored: number;
  unknownOutcome: number;
};
export type RevenueAgentGovernanceReport = {
  providerCalled: false;
  outreachSent: false;
  scrapingEnabled: false;
  browserAutomationEnabled: false;
  executionRequiresApproval: true;
  advisoryOnly: true;
  supportedDataSources: string[];
  disabledByDefaultSources: string[];
  aiAgentRoles: string[];
};
export type RevenueCommandCenterReport = {
  ok: true;
  providerCalled: false;
  outreachSent: false;
  summary: {
    totalLeads: number;
    qualifiedLeads: number;
    openTasks: number;
    followUpDue: number;
    duplicateWarnings: number;
    missingDataRecords: number;
    inactiveConnectors: number;
  };
  inbox: RevenueInboxItem[];
  sourcePerformance: RevenueSourcePerformance[];
  tasks: RevenueCommandCenterTask[];
  auditEvents: RevenueCommandCenterAuditEvent[];
  connectors: RevenueCommandCenterConnector[];
  decisionLogs: RevenueCommandCenterDecisionLog[];
  connectorHealth: RevenueConnectorHealthSummary;
  decisionFeedback: RevenueDecisionFeedbackSummary;
  agentGovernance: RevenueAgentGovernanceReport;
  executiveBriefing: {
    title: string;
    summary: string;
    risks: string[];
    recommendedActions: string[];
  };
};

type AuditInput = {
  action: string;
  targetType: string;
  targetId?: string | null;
  source: string;
  result?: string;
  metadata?: Record<string, unknown>;
  actorId?: string | null;
  requestId?: string | null;
  tenantId?: string;
};

type DecisionLogInput = {
  recommendationType: string;
  recommendation: string;
  confidence: number;
  supportingEvidence: string[];
  assumptions: string[];
  missingData: string[];
  leadId?: string | null;
  taskId?: string | null;
  auditEventId?: string | null;
  aiMemoryEventId?: string | null;
  connectorKey?: string | null;
  pipelineEventId?: string | null;
  userDecision?: "pending" | "accepted" | "modified" | "ignored";
  modifiedAction?: string | null;
  outcome?: "unknown" | "successful" | "unsuccessful" | "needs_follow_up";
  createdBy?: string | null;
  tenantId?: string;
  metadata?: Record<string, unknown>;
};

export const inactiveConnectorDefinitions = [
  ["website_forms", "Website Forms", "owned_intake", "active"],
  ["landing_pages", "Landing Pages", "owned_intake", "active"],
  ["user_imports", "User Imports", "manual_import", "active"],
  ["manual_entry", "Manual Lead Entry", "manual_intake", "active"],
  ["csv_imports", "CSV Imports", "manual_import", "active"],
  ["chat_intake", "Chat Intake", "owned_intake", "readiness_only"],
  ["referrals", "Referral Intake", "relationship_source", "active"],
  ["resend", "Resend Email", "communication", "readiness_only"],
  ["twilio", "Twilio SMS/Voice", "communication", "readiness_only"],
  ["google_maps", "Google Maps", "market_reference", "readiness_only"],
  ["attom", "ATTOM", "property_data", "inactive"],
  ["rentcast", "RentCast", "property_data", "inactive"],
  ["estated", "Estated", "property_data", "inactive"],
  ["county_public_records", "County/Public Record Importer", "government_data", "readiness_only"],
  ["county_gis", "County GIS", "government_data", "readiness_only"],
  ["social_ads", "Social Advertising", "marketing_data", "inactive"],
  ["mls_idx", "MLS/IDX Authorized Feeds", "authorized_real_estate_data", "inactive"],
  ["browser_automation", "Browser Automation Allowlist", "automation", "inactive"],
] as const;

export function createRevenueAgentGovernanceReport(): RevenueAgentGovernanceReport {
  return {
    providerCalled: false,
    outreachSent: false,
    scrapingEnabled: false,
    browserAutomationEnabled: false,
    executionRequiresApproval: true,
    advisoryOnly: true,
    supportedDataSources: [
      "manual entry",
      "CSV imports",
      "website forms",
      "chat intake",
      "referrals",
      "owned landing pages",
      "licensed API connectors after approval",
      "authorized MLS/IDX feeds after approval",
    ],
    disabledByDefaultSources: [
      "unauthorized scraping",
      "browser automation without allowlist",
      "provider calls without credentials and terms review",
      "Zillow as primary source of truth",
      "MLS/IDX without authorized feed",
    ],
    aiAgentRoles: [
      "Executive AI Advisor",
      "Revenue Performance AI",
      "Lead Scoring AI",
      "Marketing AI",
      "Sales AI",
      "Research AI",
      "Knowledge AI",
    ],
  };
}

export function assertRevenueAgentGovernance(report: RevenueAgentGovernanceReport): void {
  if (report.providerCalled || report.outreachSent || report.scrapingEnabled || report.browserAutomationEnabled) {
    throw new Error("Revenue agent governance must remain advisory-only without provider calls, outreach, scraping, or browser automation.");
  }

  if (!report.executionRequiresApproval || !report.advisoryOnly) {
    throw new Error("Revenue agent governance must require human approval and remain advisory-only.");
  }
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getTime(value?: Date | string | null) {
  if (!value) return 0;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
}

function inferSourceType(source: string) {
  const normalizedSource = normalize(source);

  if (/(website|contact|cash offer|valuation|landing|form)/i.test(normalizedSource)) return "online_marketing";
  if (/(facebook|instagram|linkedin|youtube|tiktok|twitter|x|pinterest|social)/i.test(normalizedSource)) return "social_media";
  if (/(google ads|meta ads|adwords|paid|ppc)/i.test(normalizedSource)) return "advertising";
  if (/(referral|realtor|attorney|contractor|investor|partner|past client)/i.test(normalizedSource)) return "referral";
  if (/(county|assessor|clerk|recorder|gis|tax|probate|permit|code|public record|import)/i.test(normalizedSource)) return "off_market";
  if (/(chat|ai chat|widget)/i.test(normalizedSource)) return "chat";

  return "manual";
}

function getMissingData(lead: RevenueScoreInput) {
  const missing: string[] = [];

  if (!hasText(lead.source)) missing.push("source");
  if (!hasText(lead.propertyAddress)) missing.push("property address");
  if (!hasText(lead.phone) && !hasText(lead.email)) missing.push("seller contact");
  if (!hasText(lead.ownerName)) missing.push("owner name");
  if (!hasText(lead.situationDetails) && !hasText(lead.lastSellerReply)) missing.push("motivation context");
  if (!hasText(lead.parcelId) && !hasText(lead.county)) missing.push("parcel or county reference");

  return missing;
}

function isFollowUpDue(lead: RevenueScoreInput) {
  const nextFollowUpTime = getTime(lead.nextFollowUpAt);

  return nextFollowUpTime > 0 && nextFollowUpTime <= Date.now() && lead.status !== "closed" && !lead.doNotContact;
}

function getRecommendedAction(lead: RevenueScoreInput, missingData: string[], score: number) {
  if (lead.doNotContact) return "Pause external communication and review DNC or opt-out status.";
  if (missingData.includes("seller contact")) return "Find or validate seller contact before any outreach workflow.";
  if (missingData.includes("motivation context")) return "Capture seller motivation and timeline before offer work.";
  if (isFollowUpDue(lead)) return "Review overdue follow-up and approve the next manual action.";
  if (lead.status === "under_contract") return "Review due diligence, documents, and closing blockers.";
  if (lead.status === "negotiating") return "Review offer response and negotiation next step.";
  if (score >= 75) return "Assign owner and prioritize manual acquisition review today.";
  if (score >= 55) return "Validate missing data and prepare follow-up plan.";

  return "Keep in nurture queue until stronger motivation or property signals appear.";
}

export function calculateRevenueLeadScore(lead: RevenueScoreInput): RevenueLeadScoreSummary {
  const missingData = getMissingData(lead);
  const distressFlags = getActiveDistressFlags(lead.distressFlags);
  const sourceType = inferSourceType(lead.source);
  const sourceQuality = sourceType === "referral" || sourceType === "online_marketing" ? 72 : sourceType === "off_market" ? 62 : 50;
  const motivation = hasText(lead.lastSellerReply) ? 80 : hasText(lead.situationDetails) ? 62 : 30;
  const equityPotential = lead.score >= 70 ? 78 : lead.score >= 45 ? 58 : distressFlags.length > 0 ? 52 : 35;
  const propertyFit = hasText(lead.propertyAddress) ? 65 : 20;
  const sellerEngagement = lead.status === "negotiating" ? 82 : lead.status === "contacted" ? 65 : hasText(lead.lastSellerReply) ? 72 : 35;
  const dataCompleteness = clampScore(100 - missingData.length * 14);
  const followUpUrgency = isFollowUpDue(lead) ? 82 : lead.status === "new" ? 58 : 42;
  const statusMomentum = lead.status === "closed" ? 100 : lead.status === "under_contract" ? 88 : lead.status === "negotiating" ? 76 : lead.status === "contacted" ? 58 : 44;
  const blockedPenalty = lead.doNotContact || lead.approvalStatus === "rejected" ? 28 : 0;
  const hotBonus = lead.isHot ? 8 : 0;
  const scoreBreakdown = {
    motivation,
    equityPotential,
    propertyFit,
    sellerEngagement,
    sourceQuality,
    dataCompleteness,
    followUpUrgency,
    statusMomentum,
  };
  const weightedScore =
    motivation * 0.16 +
    equityPotential * 0.18 +
    propertyFit * 0.12 +
    sellerEngagement * 0.15 +
    sourceQuality * 0.12 +
    dataCompleteness * 0.11 +
    followUpUrgency * 0.08 +
    statusMomentum * 0.08 +
    hotBonus -
    blockedPenalty;
  const score = clampScore(weightedScore);
  const confidence = clampScore(82 - missingData.length * 8 + (hasText(lead.parcelId) ? 4 : 0) + (hasText(lead.lastSellerReply) ? 5 : 0));
  const priority = score >= 72 || lead.priority === "High" ? "High" : score >= 50 || lead.priority === "Medium" ? "Medium" : "Low";
  const assumptions = [
    ...(!hasText(lead.parcelId) ? ["No parcel ID is available; property confidence is limited."] : []),
    ...(!hasText(lead.ownerName) ? ["Owner identity is not verified in the current record."] : []),
    ...(!hasText(lead.situationDetails) && !hasText(lead.lastSellerReply) ? ["Seller motivation is unknown."] : []),
  ];
  const dataUsed = [
    "stored lead source",
    "stored pipeline status",
    "stored distress flags",
    "stored score and priority",
    ...(hasText(lead.lastSellerReply) ? ["stored seller reply"] : []),
    ...(isFollowUpDue(lead) ? ["stored follow-up due date"] : []),
  ];
  const recommendedNextAction = getRecommendedAction(lead, missingData, score);

  return {
    score,
    confidence,
    priority,
    explanation: `Advisory acquisition score ${score}/100 with ${confidence}/100 confidence. Main drivers: motivation ${motivation}, equity potential ${equityPotential}, source quality ${sourceQuality}, data completeness ${dataCompleteness}, and follow-up urgency ${followUpUrgency}.`,
    recommendedNextAction,
    missingData,
    scoreBreakdown,
    assumptions,
    dataUsed,
  };
}

type DuplicateMatch = {
  reason: string;
  field: string;
  confidence: number;
  rank: number;
};

const DUPLICATE_MATCH_ORDER: DuplicateMatch[] = [
  { reason: "matching parcel ID", field: "parcelId", confidence: 96, rank: 1 },
  { reason: "matching phone", field: "phone", confidence: 94, rank: 2 },
  { reason: "matching owner and address", field: "ownerName+propertyAddress", confidence: 92, rank: 3 },
  { reason: "matching email", field: "email", confidence: 90, rank: 4 },
  { reason: "matching property address", field: "propertyAddress", confidence: 88, rank: 5 },
];

function sortDuplicateMatches(matches: DuplicateMatch[]): DuplicateMatch[] {
  return [...matches].sort((a, b) => b.confidence - a.confidence || a.rank - b.rank || a.reason.localeCompare(b.reason));
}

function getDuplicateReasonRank(reason: string): number {
  return DUPLICATE_MATCH_ORDER.find((match) => match.reason === reason)?.rank ?? 999;
}

export function findDuplicateCandidates(lead: StoredLead, leads: StoredLead[]): DuplicateCandidate[] {
  const currentId = lead.id;
  const phone = normalize(lead.phone);
  const email = normalize(lead.email);
  const address = normalize(lead.propertyAddress);
  const ownerName = normalize(lead.ownerName);
  const parcelId = normalize(lead.parcelId);

  return leads
    .filter((candidate) => candidate.id !== currentId)
    .map((candidate) => {
      const matches: DuplicateMatch[] = [];

      if (parcelId && normalize(candidate.parcelId) === parcelId) matches.push(DUPLICATE_MATCH_ORDER[0]);
      if (phone && normalize(candidate.phone) === phone) matches.push(DUPLICATE_MATCH_ORDER[1]);
      if (ownerName && address && normalize(candidate.ownerName) === ownerName && normalize(candidate.propertyAddress) === address) {
        matches.push(DUPLICATE_MATCH_ORDER[2]);
      }
      if (email && normalize(candidate.email) === email) matches.push(DUPLICATE_MATCH_ORDER[3]);
      if (address && normalize(candidate.propertyAddress) === address) matches.push(DUPLICATE_MATCH_ORDER[4]);

      const sortedMatches = sortDuplicateMatches(matches);
      const strongestMatch = sortedMatches[0];

      return strongestMatch
        ? {
            leadId: candidate.id,
            reason: strongestMatch.reason,
            confidence: strongestMatch.confidence,
            matchedReasons: sortedMatches.map((match) => match.reason),
            matchedFields: sortedMatches.map((match) => match.field),
          }
        : null;
    })
    .filter((candidate): candidate is DuplicateCandidate => candidate !== null)
    .sort((a, b) => b.confidence - a.confidence || getDuplicateReasonRank(a.reason) - getDuplicateReasonRank(b.reason) || a.leadId.localeCompare(b.leadId))
    .slice(0, 5);
}

export function getFollowUpFlags(lead: RevenueScoreInput) {
  const flags: string[] = [];

  if (lead.doNotContact) flags.push("DNC or opt-out review required");
  if (isFollowUpDue(lead)) flags.push("Follow-up due or overdue");
  if (lead.status === "new" && !lead.lastContactedAt) flags.push("No contact captured");
  if (!hasText(lead.propertyAddress)) flags.push("Incomplete property record");
  if (!hasText(lead.phone) && !hasText(lead.email)) flags.push("Missing seller contact");
  if ((lead.isHot || lead.priority === "High") && lead.status === "new") flags.push("High-potential lead needs owner review");

  return flags;
}

type SanitizedAuditValue = string | number | boolean | null | SanitizedAuditValue[] | { [key: string]: SanitizedAuditValue };
export type SanitizedAuditMetadata = Record<string, SanitizedAuditValue>;

function sanitizeAuditValue(key: string, value: unknown): SanitizedAuditValue {
  if (SECRET_FIELD_PATTERN.test(key)) return "[redacted]";
  if (Array.isArray(value)) return value.map((item) => sanitizeAuditValue(key, item));
  if (value && typeof value === "object") return sanitizeAuditMetadata(value as Record<string, unknown>);
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) return value;

  return String(value);
}

export function sanitizeAuditMetadata(metadata: Record<string, unknown> = {}): SanitizedAuditMetadata {
  return Object.fromEntries(
    Object.entries(metadata).map(([key, value]) => {
      return [key, sanitizeAuditValue(key, value)];
    }),
  );
}

export function createRevenueDecisionLogData(input: DecisionLogInput): Prisma.RevenueDecisionLogUncheckedCreateInput {
  return {
    tenantId: input.tenantId ?? DEFAULT_TENANT_ID,
    leadId: input.leadId ?? null,
    taskId: input.taskId ?? null,
    auditEventId: input.auditEventId ?? null,
    aiMemoryEventId: input.aiMemoryEventId ?? null,
    connectorKey: input.connectorKey ?? null,
    pipelineEventId: input.pipelineEventId ?? null,
    recommendationType: input.recommendationType,
    recommendation: input.recommendation,
    confidence: clampScore(input.confidence),
    supportingEvidence: input.supportingEvidence as Prisma.InputJsonArray,
    assumptions: input.assumptions as Prisma.InputJsonArray,
    missingData: input.missingData as Prisma.InputJsonArray,
    userDecision: input.userDecision ?? "pending",
    modifiedAction: input.modifiedAction ?? null,
    outcome: input.outcome ?? "unknown",
    advisoryOnly: true,
    providerCalled: false,
    outreachSent: false,
    requiresApproval: true,
    safeMetadata: sanitizeAuditMetadata(input.metadata ?? {}) as Prisma.InputJsonObject,
    createdBy: input.createdBy ?? null,
  };
}

export function summarizeDecisionFeedback(decisionLogs: Array<Pick<RevenueCommandCenterDecisionLog, "userDecision" | "outcome">>): RevenueDecisionFeedbackSummary {
  return {
    total: decisionLogs.length,
    pending: decisionLogs.filter((decision) => decision.userDecision === "pending").length,
    accepted: decisionLogs.filter((decision) => decision.userDecision === "accepted").length,
    modified: decisionLogs.filter((decision) => decision.userDecision === "modified").length,
    ignored: decisionLogs.filter((decision) => decision.userDecision === "ignored").length,
    unknownOutcome: decisionLogs.filter((decision) => decision.outcome === "unknown").length,
  };
}

export function summarizeConnectorHealth(connectors: Array<Pick<RevenueCommandCenterConnector, "status" | "providerCallsAllowed">>): RevenueConnectorHealthSummary {
  return {
    total: connectors.length,
    active: connectors.filter((connector) => connector.status === "active").length,
    readinessOnly: connectors.filter((connector) => connector.status === "readiness_only").length,
    inactive: connectors.filter((connector) => connector.status === "inactive").length,
    providerCallsAllowed: connectors.filter((connector) => connector.providerCallsAllowed).length,
    approvalRequired: connectors.filter((connector) => !connector.providerCallsAllowed || connector.status !== "active").length,
  };
}

export function isRevenueDecisionLogUnavailableError(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError && (error.code === "P2021" || error.code === "P2022")) return true;

  const message = error instanceof Error ? error.message : String(error);

  return /RevenueDecisionLog|revenue decision log|table .*does not exist|column .*does not exist/i.test(message);
}

async function listRevenueDecisionLogsSafe(): Promise<RevenueCommandCenterDecisionLog[]> {
  try {
    return await prisma.revenueDecisionLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
    });
  } catch (error) {
    if (!isRevenueDecisionLogUnavailableError(error)) throw error;

    console.warn("RevenueDecisionLog unavailable; decision feedback is degraded until the revenue decision log migration is applied.");

    return [];
  }
}

export async function logRevenueAuditEvent(input: AuditInput) {
  return prisma.revenueAuditEvent.create({
    data: {
      tenantId: input.tenantId ?? DEFAULT_TENANT_ID,
      actorId: input.actorId ?? null,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId ?? null,
      requestId: input.requestId ?? null,
      source: input.source,
      result: input.result ?? "success",
      safeMetadata: sanitizeAuditMetadata(input.metadata ?? {}) as Prisma.InputJsonObject,
    },
  });
}

export async function logRevenueDecision(input: DecisionLogInput) {
  try {
    return await prisma.revenueDecisionLog.create({
      data: createRevenueDecisionLogData(input),
    });
  } catch (error) {
    if (!isRevenueDecisionLogUnavailableError(error)) throw error;

    console.warn("RevenueDecisionLog unavailable; advisory recommendation was not persisted until the revenue decision log migration is applied.");

    return null;
  }
}

export async function ensureConnectorDefinitions() {
  await Promise.all(
    inactiveConnectorDefinitions.map(([connectorKey, label, category, status]) =>
      prisma.connectorDefinition.upsert({
        where: { connectorKey },
        update: {
          label,
          category,
          status,
          providerCallsAllowed: false,
          supportsDryRun: true,
          requiredApprovals: ["credentials_review", "terms_review", "operator_approval"] as Prisma.InputJsonArray,
          safetyNotes: "Provider calls remain disabled until credentials, terms, rate limits, audit logging, and approval gates are confirmed.",
        },
        create: {
          connectorKey,
          label,
          category,
          status,
          providerCallsAllowed: false,
          supportsDryRun: true,
          requiredApprovals: ["credentials_review", "terms_review", "operator_approval"] as Prisma.InputJsonArray,
          safetyNotes: "Provider calls remain disabled until credentials, terms, rate limits, audit logging, and approval gates are confirmed.",
        },
      }),
    ),
  );
}

export async function syncLeadRevenueSpine({
  lead,
  action,
  previousStatus,
  source = "revenue_spine",
}: {
  lead: StoredLead;
  action: "lead_created" | "lead_imported" | "lead_updated" | "status_changed" | "score_refreshed";
  previousStatus?: LeadStatus;
  source?: string;
}) {
  const score = calculateRevenueLeadScore(lead);
  const sourceType = inferSourceType(lead.source);
  const sourceDetail = lead.source.trim() || "unknown_source";

  await prisma.revenueLeadSource.upsert({
    where: {
      leadId_source_sourceDetail: {
        leadId: lead.id,
        source: lead.source || "unknown",
        sourceDetail,
      },
    },
    update: {
      sourceType,
      confidence: score.confidence,
      verified: sourceType === "online_marketing" || sourceType === "referral",
    },
    create: {
      tenantId: DEFAULT_TENANT_ID,
      leadId: lead.id,
      source: lead.source || "unknown",
      sourceType,
      sourceDetail,
      confidence: score.confidence,
      verified: sourceType === "online_marketing" || sourceType === "referral",
      importedBy: source,
    },
  });

  const scoreRecord = await prisma.revenueLeadScore.create({
    data: {
      tenantId: DEFAULT_TENANT_ID,
      leadId: lead.id,
      score: score.score,
      confidence: score.confidence,
      priority: score.priority,
      explanation: score.explanation,
      recommendedNextAction: score.recommendedNextAction,
      missingData: score.missingData as Prisma.InputJsonArray,
      scoreBreakdown: score.scoreBreakdown as Prisma.InputJsonObject,
      assumptions: score.assumptions as Prisma.InputJsonArray,
      dataUsed: score.dataUsed as Prisma.InputJsonArray,
      advisoryOnly: true,
    },
  });

  await logRevenueDecision({
    recommendationType: "lead_scoring",
    recommendation: score.recommendedNextAction,
    confidence: score.confidence,
    supportingEvidence: score.dataUsed,
    assumptions: score.assumptions,
    missingData: score.missingData,
    leadId: lead.id,
    userDecision: "pending",
    outcome: "unknown",
    createdBy: source,
    metadata: {
      source: lead.source,
      sourceType,
      revenueScoreId: scoreRecord.id,
      score: score.score,
      priority: score.priority,
      advisoryOnly: true,
      providerCalled: false,
      outreachSent: false,
      requiresApproval: true,
    },
  });

  if (action === "lead_created" || action === "lead_imported") {
    await prisma.revenuePipelineEvent.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        leadId: lead.id,
        fromStage: null,
        toStage: lead.status,
        reason: "Lead entered unified revenue pipeline.",
        source,
      },
    });
  }

  if (action === "status_changed") {
    await prisma.revenuePipelineEvent.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        leadId: lead.id,
        fromStage: previousStatus ?? null,
        toStage: lead.status,
        reason: "Lead pipeline status changed by authenticated operator.",
        source,
        revenueOutcome: lead.status === "closed" ? "closed_transaction_candidate" : null,
      },
    });
  }

  const followUpFlags = getFollowUpFlags(lead);

  if (followUpFlags.length > 0 && !lead.doNotContact && lead.status !== "closed") {
    const existingOpenTask = await prisma.revenueTask.findFirst({
      where: {
        leadId: lead.id,
        taskType: "manual_follow_up_review",
        status: "open",
      },
    });

    if (!existingOpenTask) {
      await prisma.revenueTask.create({
        data: {
          tenantId: DEFAULT_TENANT_ID,
          leadId: lead.id,
          title: "Review revenue follow-up",
          taskType: "manual_follow_up_review",
          priority: score.priority,
          recommendedAction: score.recommendedNextAction,
          reason: followUpFlags.join("; "),
          dueAt: lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt) : new Date(),
          requiresApproval: true,
          source,
        },
      });
    }
  }

  await logRevenueAuditEvent({
    action,
    targetType: "lead",
    targetId: lead.id,
    source,
    metadata: {
      source: lead.source,
      sourceType,
      score: score.score,
      confidence: score.confidence,
      priority: score.priority,
      previousStatus,
      nextStatus: lead.status,
      missingData: score.missingData,
      providerCalled: false,
      outreachSent: false,
    },
  });

  return score;
}

export async function buildUnifiedLeadInbox(leads: StoredLead[]): Promise<RevenueInboxItem[]> {
  const latestScores = await prisma.revenueLeadScore.findMany({
    where: {
      leadId: {
        in: leads.map((lead) => lead.id),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const latestScoreByLead = new Map<string, (typeof latestScores)[number]>();

  latestScores.forEach((score) => {
    if (!latestScoreByLead.has(score.leadId)) latestScoreByLead.set(score.leadId, score);
  });

  return leads
    .map((lead) => {
      const storedScore = latestScoreByLead.get(lead.id);
      const calculatedScore = calculateRevenueLeadScore(lead);
      const latestScore = storedScore
        ? {
            score: storedScore.score,
            confidence: storedScore.confidence,
            priority: storedScore.priority as RevenueLeadScoreSummary["priority"],
            explanation: storedScore.explanation,
            recommendedNextAction: storedScore.recommendedNextAction,
            missingData: Array.isArray(storedScore.missingData) ? (storedScore.missingData as string[]) : calculatedScore.missingData,
            scoreBreakdown:
              storedScore.scoreBreakdown && typeof storedScore.scoreBreakdown === "object" && !Array.isArray(storedScore.scoreBreakdown)
                ? (storedScore.scoreBreakdown as Record<string, number>)
                : calculatedScore.scoreBreakdown,
            assumptions: Array.isArray(storedScore.assumptions) ? (storedScore.assumptions as string[]) : calculatedScore.assumptions,
            dataUsed: Array.isArray(storedScore.dataUsed) ? (storedScore.dataUsed as string[]) : calculatedScore.dataUsed,
          }
        : calculatedScore;

      return {
        lead,
        latestScore,
        duplicateWarnings: findDuplicateCandidates(lead, leads),
        followUpFlags: getFollowUpFlags(lead),
        recommendedAction: latestScore.recommendedNextAction,
      };
    })
    .sort((a, b) => (b.latestScore?.score ?? 0) - (a.latestScore?.score ?? 0) || (b.latestScore?.confidence ?? 0) - (a.latestScore?.confidence ?? 0));
}

export async function createRevenueCommandCenter(leads: StoredLead[]): Promise<RevenueCommandCenterReport> {
  const inbox = await buildUnifiedLeadInbox(leads);
  const tasks = await prisma.revenueTask.findMany({
    where: {
      status: "open",
    },
    orderBy: [{ priority: "desc" }, { dueAt: "asc" }],
    take: 20,
  });
  const auditEvents = await prisma.revenueAuditEvent.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });
  const connectors = await prisma.connectorDefinition.findMany({
    orderBy: [{ status: "asc" }, { label: "asc" }],
  });
  const decisionLogs = await listRevenueDecisionLogsSafe();
  const qualified = inbox.filter((item) => (item.latestScore?.score ?? 0) >= 55 || item.lead.priority !== "Low");
  const followUpDue = inbox.filter((item) => item.followUpFlags.some((flag) => /follow-up/i.test(flag)));
  const duplicateWarnings = inbox.reduce((total, item) => total + item.duplicateWarnings.length, 0);
  const missingData = inbox.filter((item) => (item.latestScore?.missingData.length ?? 0) > 0);
  const connectorHealth = summarizeConnectorHealth(connectors);
  const decisionFeedback = summarizeDecisionFeedback(decisionLogs);
  const agentGovernance = createRevenueAgentGovernanceReport();
  const risks = [
    ...(followUpDue.length > 0 ? [`${followUpDue.length} follow-up gap${followUpDue.length === 1 ? "" : "s"} need manual review.`] : []),
    ...(duplicateWarnings > 0 ? [`${duplicateWarnings} duplicate warning${duplicateWarnings === 1 ? "" : "s"} need human verification.`] : []),
    ...(missingData.length > 0 ? [`${missingData.length} lead record${missingData.length === 1 ? "" : "s"} have missing data that limits confidence.`] : []),
    ...(connectorHealth.approvalRequired > 0 ? `${connectorHealth.approvalRequired} connector${connectorHealth.approvalRequired === 1 ? "" : "s"} still require approval before provider calls.` : []),
    ...(decisionFeedback.pending > 0 ? `${decisionFeedback.pending} AI recommendation${decisionFeedback.pending === 1 ? "" : "s"} await operator feedback.` : []),
  ];
  const bySource = new Map<string, { source: string; leads: number; qualified: number; avgScore: number }>();

  inbox.forEach((item) => {
    const source = item.lead.source || "Unknown source";
    const existing = bySource.get(source) ?? { source, leads: 0, qualified: 0, avgScore: 0 };
    const score = item.latestScore?.score ?? 0;
    existing.leads += 1;
    existing.qualified += score >= 55 ? 1 : 0;
    existing.avgScore += score;
    bySource.set(source, existing);
  });

  const sourcePerformance = [...bySource.values()]
    .map((source) => ({
      ...source,
      avgScore: source.leads > 0 ? Math.round(source.avgScore / source.leads) : 0,
      conversionSignal: source.leads > 0 ? Math.round((source.qualified / source.leads) * 100) : 0,
    }))
    .sort((a, b) => b.qualified - a.qualified || b.avgScore - a.avgScore);

  return {
    ok: true,
    providerCalled: false,
    outreachSent: false,
    summary: {
      totalLeads: leads.length,
      qualifiedLeads: qualified.length,
      openTasks: tasks.length,
      followUpDue: followUpDue.length,
      duplicateWarnings,
      missingDataRecords: missingData.length,
      inactiveConnectors: connectors.filter((connector) => connector.status !== "active").length,
    },
    inbox: inbox.slice(0, 25),
    sourcePerformance,
    tasks,
    auditEvents,
    connectors,
    decisionLogs,
    connectorHealth,
    decisionFeedback,
    agentGovernance,
    executiveBriefing: {
      title: "Revenue growth briefing",
      summary:
        qualified.length > 0
          ? `${qualified.length} qualified opportunities are visible. Work the highest-score leads first, clear ${followUpDue.length} follow-up gaps, and review ${duplicateWarnings} duplicate warnings before expanding connector volume.`
          : "No qualified opportunities are visible yet. Improve source quality, data completeness, and manual follow-up capture before adding more automation.",
      risks: risks.length > 0 ? risks : ["No critical revenue governance risks are visible in the current command-center snapshot."],
      recommendedActions: [
        "Work the highest ranked unified inbox items first.",
        "Clear overdue follow-up tasks before importing more low-confidence records.",
        "Review duplicate warnings manually instead of silently merging records.",
        "Activate only connectors with confirmed credentials, terms, and approval gates.",
      ],
    },
  };
}
