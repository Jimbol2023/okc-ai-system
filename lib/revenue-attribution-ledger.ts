import { Prisma } from "@/generated/prisma";

import { prisma } from "@/lib/prisma";

export const revenueAttributionLedgerVersion = "lead-roi-revenue-attribution-ledger/1.0.0";

export const revenueAttributionLedgerSafety = Object.freeze({
  readOnly: true,
  advisoryOnly: true,
  internalOnly: true,
  providerCalled: false,
  providerWrite: false,
  sent: false,
  published: false,
  outreach: false,
  scraping: false,
  paidPropertyEnrichment: false,
  adSpendMutation: false,
  campaignMutation: false,
  contractSent: false,
  moneyMovement: false,
  liveExecutionAllowed: false,
  externalExecutionAllowed: false,
});

export const revenueAttributionAuditActions = [
  "source_spend_recorded",
  "lead_outcome_recorded",
  "appointment_outcome_recorded",
  "contract_outcome_recorded",
  "closed_revenue_recorded",
  "attribution_link_created",
  "attribution_conflict_detected",
  "roi_recalculated",
  "outcome_corrected",
] as const;

export type RevenueLedgerWindow = "daily" | "weekly" | "monthly" | "all_time";
export type RevenueDataQualityStatus = "VERIFIED" | "PARTIAL" | "ESTIMATED" | "INSUFFICIENT_DATA" | "CONFLICT" | "UNKNOWN";
export type LeadOutcomeKind =
  | "received"
  | "qualified"
  | "disqualified"
  | "human_review_required"
  | "contact_attempt_pending"
  | "appointment_scheduled"
  | "appointment_completed"
  | "no_show"
  | "offer_prepared"
  | "contract_pending"
  | "contract_signed"
  | "lost"
  | "closed";
export type AppointmentOutcomeKind = "appointmentScheduled" | "appointmentCompleted" | "appointmentNoShow" | "appointmentCancelled";
export type ContractOutcomeKind = "contractPrepared" | "contractSentForReview" | "contractSigned" | "contractCancelled" | "contractFailed";
export type ClosedRevenueType = "assignment_fee" | "wholesale_spread" | "referral_fee" | "other_governed_real_estate_revenue";

type AttributionFields = {
  tenantId: string;
  sourceType: string;
  sourceDetail: string;
  campaignId?: string | null;
  referralCode?: string | null;
  landingPage?: string | null;
};

export type SourceSpendLedgerRecord = {
  tenantId: string;
  source: string;
  campaign?: string | null;
  periodStart: Date | string;
  periodEnd: Date | string;
  spendCents: number;
  creditsConsumed?: number;
  providerFeesCents?: number;
  mailSpendCents?: number;
  adSpendCents?: number;
  otherSpendCents?: number;
  currency?: string;
  recordedBy: string;
  evidenceSource: string;
  verificationStatus: RevenueDataQualityStatus;
  businessContext?: string;
  isTestRecord?: boolean;
  idempotencyKey?: string;
};

export type LeadOutcomeLedgerRecord = AttributionFields & {
  leadId: string;
  propertyCandidateId?: string | null;
  propertyOpportunityId?: string | null;
  outcome: LeadOutcomeKind;
  occurredAt: Date | string;
  actorId: string;
  evidence: unknown;
  attributionChainKey: string;
  businessOutcomeEventId?: string | null;
  verificationStatus: RevenueDataQualityStatus;
  businessContext?: string;
  isTestRecord?: boolean;
  idempotencyKey?: string;
};

export type AppointmentOutcomeLedgerRecord = AttributionFields & {
  leadId: string;
  propertyOpportunityId?: string | null;
  appointmentReference: string;
  scheduledAt?: Date | string | null;
  completedAt?: Date | string | null;
  outcome: AppointmentOutcomeKind;
  actorId: string;
  evidence: unknown;
  attributionChainKey: string;
  businessOutcomeEventId?: string | null;
  verificationStatus: RevenueDataQualityStatus;
  businessContext?: string;
  isTestRecord?: boolean;
  idempotencyKey?: string;
};

export type ContractOutcomeLedgerRecord = AttributionFields & {
  leadId: string;
  propertyOpportunityId?: string | null;
  contractReference: string;
  outcome: ContractOutcomeKind;
  signedAt?: Date | string | null;
  expectedValueCents?: number | null;
  actorId: string;
  evidence: unknown;
  attributionChainKey: string;
  businessOutcomeEventId?: string | null;
  verificationStatus: RevenueDataQualityStatus;
  businessContext?: string;
  isTestRecord?: boolean;
  idempotencyKey?: string;
};

export type ClosedRevenueOutcomeLedgerRecord = AttributionFields & {
  leadId?: string | null;
  propertyOpportunityId?: string | null;
  contractReference?: string | null;
  closingReference: string;
  revenueType: ClosedRevenueType;
  grossRevenueCents: number;
  directCostCents: number;
  netRevenueCents: number;
  closedAt: Date | string;
  verificationSource: string;
  financeEntryId?: string | null;
  businessOutcomeEventId?: string | null;
  attributionChainKey: string;
  verificationStatus: RevenueDataQualityStatus;
  businessContext?: string;
  isTestRecord?: boolean;
  idempotencyKey?: string;
};

export type RevenueAttributionLedgerInput = {
  tenantId: string;
  window: RevenueLedgerWindow;
  asOf?: Date | string;
  sourceSpend: SourceSpendLedgerRecord[];
  leadOutcomes: LeadOutcomeLedgerRecord[];
  appointmentOutcomes: AppointmentOutcomeLedgerRecord[];
  contractOutcomes: ContractOutcomeLedgerRecord[];
  closedRevenueOutcomes: ClosedRevenueOutcomeLedgerRecord[];
};

export type RevenueAttributionLedgerRow = {
  source: string;
  campaign: string | null;
  spendCents: number;
  leadCount: number;
  qualifiedLeadCount: number;
  appointmentCount: number;
  completedAppointmentCount: number;
  contractCount: number;
  closedDealCount: number;
  grossRevenueCents: number;
  netRevenueCents: number;
  costPerLeadCents: number | null;
  costPerQualifiedLeadCents: number | null;
  costPerAppointmentCents: number | null;
  costPerContractCents: number | null;
  costPerClosedDealCents: number | null;
  revenuePerLeadCents: number | null;
  revenuePerQualifiedLeadCents: number | null;
  revenuePerContractCents: number | null;
  closeRate: number | null;
  leadToAppointmentRate: number | null;
  appointmentToContractRate: number | null;
  contractToCloseRate: number | null;
  roas: number | null;
  roi: number | null;
  dataQuality: RevenueDataQualityStatus;
  sampleSize: number;
  confidence: number;
  lastOutcomeDate: string | null;
  insufficientDataReasons: string[];
};

export type RevenueAttributionLedgerReport = {
  ok: true;
  tenantId: string;
  generatedAt: string;
  window: RevenueLedgerWindow;
  rows: RevenueAttributionLedgerRow[];
  summary: {
    sourceCount: number;
    totalSpendCents: number;
    totalGrossRevenueCents: number;
    totalNetRevenueCents: number;
    totalClosedDeals: number;
    topRevenueSource: string | null;
    bestRoiSource: string | null;
    lowestCostPerContractSource: string | null;
    highestCloseRateSource: string | null;
    spendNoContracts: string[];
    highQualityLowVolume: string[];
    insufficientDataSources: string[];
    baselineState: "READY_FOR_FIRST_REAL_OUTCOME" | "INSUFFICIENT_REAL_OUTCOME_DATA" | "REAL_OUTCOME_DATA_AVAILABLE";
  };
  aiEmployeeUse: Array<{ role: string; capability: string; executionAuthority: "none" }>;
  futureCloseProbabilityInputs: string[];
  safety: typeof revenueAttributionLedgerSafety;
  providerCalled: false;
  liveExecutionAllowed: false;
};

function normalizeKey(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/\s+/g, "_") || "none";
}

function sourceKey(source: string, campaign: string | null | undefined) {
  return `${normalizeKey(source)}::${normalizeKey(campaign)}`;
}

function dateValue(value: Date | string | null | undefined) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function inWindow(value: Date | string | null | undefined, start: Date | null, end: Date) {
  const date = dateValue(value);
  if (!date) return false;
  if (start && date < start) return false;
  return date <= end;
}

function windowStart(window: RevenueLedgerWindow, asOf: Date) {
  if (window === "all_time") return null;
  const start = new Date(asOf);
  start.setHours(0, 0, 0, 0);
  if (window === "weekly") start.setDate(start.getDate() - 6);
  if (window === "monthly") start.setDate(start.getDate() - 29);
  return start;
}

function safeRate(numerator: number, denominator: number) {
  return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : null;
}

function safeCents(numerator: number, denominator: number) {
  return denominator > 0 ? Math.round(numerator / denominator) : null;
}

function safeMoneyRatio(numerator: number, denominator: number) {
  return denominator > 0 ? Number((numerator / denominator).toFixed(4)) : null;
}

function isReal(record: { tenantId: string; businessContext?: string; isTestRecord?: boolean }, tenantId: string) {
  return record.tenantId === tenantId && !record.isTestRecord && (record.businessContext ?? "real_business") === "real_business";
}

function qualityFrom(
  rows: Array<{ verificationStatus: RevenueDataQualityStatus }>,
  sampleSize: number,
  spendCents: number,
  closedDeals: number,
  contracts: number,
): RevenueDataQualityStatus {
  if (sampleSize === 0 && spendCents === 0) return "INSUFFICIENT_DATA";
  if (rows.some((row) => row.verificationStatus === "CONFLICT")) return "CONFLICT";
  if (contracts === 0 || closedDeals === 0) return "INSUFFICIENT_DATA";
  if (rows.length > 0 && rows.every((row) => row.verificationStatus === "VERIFIED")) return "VERIFIED";
  if (rows.some((row) => row.verificationStatus === "ESTIMATED")) return "ESTIMATED";
  if (rows.length > 0) return "PARTIAL";
  return "UNKNOWN";
}

function confidenceFor(sampleSize: number, quality: RevenueDataQualityStatus, hasRevenue: boolean) {
  const qualityBase = quality === "VERIFIED" ? 74 : quality === "PARTIAL" ? 54 : quality === "ESTIMATED" ? 42 : quality === "CONFLICT" ? 20 : 30;
  return Math.max(0, Math.min(100, qualityBase + Math.min(18, sampleSize * 3) + (hasRevenue ? 8 : 0)));
}

export function createAttributionChainKey(input: AttributionFields & {
  leadId?: string | null;
  propertyOpportunityId?: string | null;
  appointmentReference?: string | null;
  contractReference?: string | null;
  closingReference?: string | null;
}) {
  return [
    input.tenantId,
    normalizeKey(input.sourceType),
    normalizeKey(input.sourceDetail),
    normalizeKey(input.campaignId),
    normalizeKey(input.referralCode),
    normalizeKey(input.landingPage),
    normalizeKey(input.leadId),
    normalizeKey(input.propertyOpportunityId),
    normalizeKey(input.appointmentReference),
    normalizeKey(input.contractReference),
    normalizeKey(input.closingReference),
  ].join(":");
}

export function createSourceSpendIdempotencyKey(input: Pick<SourceSpendLedgerRecord, "tenantId" | "source" | "campaign" | "periodStart" | "periodEnd" | "evidenceSource">) {
  return [
    input.tenantId,
    normalizeKey(input.source),
    normalizeKey(input.campaign),
    dateValue(input.periodStart)?.toISOString() ?? "invalid_start",
    dateValue(input.periodEnd)?.toISOString() ?? "invalid_end",
    normalizeKey(input.evidenceSource),
  ].join(":");
}

export function createRevenueAttributionLedgerReport(input: RevenueAttributionLedgerInput): RevenueAttributionLedgerReport {
  const asOf = dateValue(input.asOf) ?? new Date();
  const start = windowStart(input.window, asOf);
  const spend = input.sourceSpend.filter((item) => isReal(item, input.tenantId) && inWindow(item.periodEnd, start, asOf));
  const leadOutcomes = input.leadOutcomes.filter((item) => isReal(item, input.tenantId) && inWindow(item.occurredAt, start, asOf));
  const appointments = input.appointmentOutcomes.filter((item) => isReal(item, input.tenantId) && inWindow(item.completedAt ?? item.scheduledAt, start, asOf));
  const contracts = input.contractOutcomes.filter((item) => isReal(item, input.tenantId) && inWindow(item.signedAt ?? new Date(), start, asOf));
  const revenue = input.closedRevenueOutcomes.filter((item) => isReal(item, input.tenantId) && inWindow(item.closedAt, start, asOf));
  const keys = new Set<string>();

  spend.forEach((item) => keys.add(sourceKey(item.source, item.campaign)));
  leadOutcomes.forEach((item) => keys.add(sourceKey(item.sourceDetail, item.campaignId)));
  appointments.forEach((item) => keys.add(sourceKey(item.sourceDetail, item.campaignId)));
  contracts.forEach((item) => keys.add(sourceKey(item.sourceDetail, item.campaignId)));
  revenue.forEach((item) => keys.add(sourceKey(item.sourceDetail, item.campaignId)));

  const rows = [...keys].map((key): RevenueAttributionLedgerRow => {
    const [sourcePart, campaignPart] = key.split("::");
    const sourceName = sourcePart === "none" ? "unknown" : sourcePart;
    const campaign = campaignPart === "none" ? null : campaignPart;
    const sourceSpend = spend.filter((item) => sourceKey(item.source, item.campaign) === key);
    const sourceLeadOutcomes = leadOutcomes.filter((item) => sourceKey(item.sourceDetail, item.campaignId) === key);
    const sourceAppointments = appointments.filter((item) => sourceKey(item.sourceDetail, item.campaignId) === key);
    const sourceContracts = contracts.filter((item) => sourceKey(item.sourceDetail, item.campaignId) === key);
    const sourceRevenue = revenue.filter((item) => sourceKey(item.sourceDetail, item.campaignId) === key);
    const leadIds = new Set(sourceLeadOutcomes.map((item) => item.leadId));
    const qualifiedLeadIds = new Set(sourceLeadOutcomes.filter((item) => item.outcome === "qualified").map((item) => item.leadId));
    const appointmentIds = new Set(sourceAppointments.filter((item) => item.outcome === "appointmentScheduled" || item.outcome === "appointmentCompleted").map((item) => item.appointmentReference));
    const completedAppointmentIds = new Set(sourceAppointments.filter((item) => item.outcome === "appointmentCompleted").map((item) => item.appointmentReference));
    const contractIds = new Set(sourceContracts.filter((item) => item.outcome === "contractSigned").map((item) => item.contractReference));
    const closedIds = new Set(sourceRevenue.map((item) => `${item.closingReference}:${item.revenueType}`));
    const spendCents = sourceSpend.reduce((sum, item) => sum + item.spendCents, 0);
    const grossRevenueCents = sourceRevenue.reduce((sum, item) => sum + item.grossRevenueCents, 0);
    const netRevenueCents = sourceRevenue.reduce((sum, item) => sum + item.netRevenueCents, 0);
    const sampleSize = leadIds.size + appointmentIds.size + contractIds.size + closedIds.size;
    const qualityRows = [...sourceSpend, ...sourceLeadOutcomes, ...sourceAppointments, ...sourceContracts, ...sourceRevenue];
    const dataQuality = qualityFrom(qualityRows, sampleSize, spendCents, closedIds.size, contractIds.size);
    const lastOutcomeDate = [
      ...sourceLeadOutcomes.map((item) => dateValue(item.occurredAt)),
      ...sourceAppointments.map((item) => dateValue(item.completedAt ?? item.scheduledAt)),
      ...sourceContracts.map((item) => dateValue(item.signedAt)),
      ...sourceRevenue.map((item) => dateValue(item.closedAt)),
    ].filter((date): date is Date => Boolean(date)).sort((a, b) => b.getTime() - a.getTime())[0]?.toISOString() ?? null;
    const insufficientDataReasons = [
      leadIds.size === 0 ? "no_real_lead_outcomes" : "",
      contractIds.size === 0 ? "no_verified_contracts" : "",
      closedIds.size === 0 ? "no_verified_closed_revenue" : "",
      spendCents === 0 ? "no_verified_source_spend" : "",
    ].filter(Boolean);

    return {
      source: sourceName,
      campaign,
      spendCents,
      leadCount: leadIds.size,
      qualifiedLeadCount: qualifiedLeadIds.size,
      appointmentCount: appointmentIds.size,
      completedAppointmentCount: completedAppointmentIds.size,
      contractCount: contractIds.size,
      closedDealCount: closedIds.size,
      grossRevenueCents,
      netRevenueCents,
      costPerLeadCents: safeCents(spendCents, leadIds.size),
      costPerQualifiedLeadCents: safeCents(spendCents, qualifiedLeadIds.size),
      costPerAppointmentCents: safeCents(spendCents, appointmentIds.size),
      costPerContractCents: safeCents(spendCents, contractIds.size),
      costPerClosedDealCents: safeCents(spendCents, closedIds.size),
      revenuePerLeadCents: safeCents(grossRevenueCents, leadIds.size),
      revenuePerQualifiedLeadCents: safeCents(grossRevenueCents, qualifiedLeadIds.size),
      revenuePerContractCents: safeCents(grossRevenueCents, contractIds.size),
      closeRate: safeRate(closedIds.size, leadIds.size),
      leadToAppointmentRate: safeRate(appointmentIds.size, leadIds.size),
      appointmentToContractRate: safeRate(contractIds.size, completedAppointmentIds.size),
      contractToCloseRate: safeRate(closedIds.size, contractIds.size),
      roas: safeMoneyRatio(grossRevenueCents, spendCents),
      roi: spendCents > 0 ? Number(((netRevenueCents - spendCents) / spendCents).toFixed(4)) : null,
      dataQuality,
      sampleSize,
      confidence: confidenceFor(sampleSize, dataQuality, grossRevenueCents > 0),
      lastOutcomeDate,
      insufficientDataReasons,
    };
  }).sort((a, b) => b.netRevenueCents - a.netRevenueCents || (b.roi ?? -999) - (a.roi ?? -999) || b.qualifiedLeadCount - a.qualifiedLeadCount);

  const withContracts = rows.filter((row) => row.contractCount > 0);
  const withClosedDeals = rows.filter((row) => row.closedDealCount > 0);
  const topRevenue = [...rows].sort((a, b) => b.netRevenueCents - a.netRevenueCents)[0];
  const bestRoi = [...rows].filter((row) => row.roi !== null && row.closedDealCount > 0).sort((a, b) => (b.roi ?? -999) - (a.roi ?? -999))[0];
  const lowestCostContract = [...withContracts].filter((row) => row.costPerContractCents !== null).sort((a, b) => (a.costPerContractCents ?? Infinity) - (b.costPerContractCents ?? Infinity))[0];
  const highestCloseRate = [...withClosedDeals].filter((row) => row.closeRate !== null).sort((a, b) => (b.closeRate ?? 0) - (a.closeRate ?? 0))[0];

  const report: RevenueAttributionLedgerReport = {
    ok: true,
    tenantId: input.tenantId,
    generatedAt: asOf.toISOString(),
    window: input.window,
    rows,
    summary: {
      sourceCount: rows.length,
      totalSpendCents: rows.reduce((sum, row) => sum + row.spendCents, 0),
      totalGrossRevenueCents: rows.reduce((sum, row) => sum + row.grossRevenueCents, 0),
      totalNetRevenueCents: rows.reduce((sum, row) => sum + row.netRevenueCents, 0),
      totalClosedDeals: rows.reduce((sum, row) => sum + row.closedDealCount, 0),
      topRevenueSource: topRevenue && topRevenue.netRevenueCents > 0 ? topRevenue.source : null,
      bestRoiSource: bestRoi?.source ?? null,
      lowestCostPerContractSource: lowestCostContract?.source ?? null,
      highestCloseRateSource: highestCloseRate?.source ?? null,
      spendNoContracts: rows.filter((row) => row.spendCents > 0 && row.contractCount === 0).map((row) => row.source),
      highQualityLowVolume: rows.filter((row) => row.qualifiedLeadCount > 0 && row.leadCount < 5 && (row.qualifiedLeadCount / Math.max(1, row.leadCount)) >= 0.5).map((row) => row.source),
      insufficientDataSources: rows.filter((row) => row.dataQuality === "INSUFFICIENT_DATA" || row.sampleSize < 3).map((row) => row.source),
      baselineState: rows.length === 0 || rows.every((row) => row.closedDealCount === 0) ? "INSUFFICIENT_REAL_OUTCOME_DATA" : "REAL_OUTCOME_DATA_AVAILABLE",
    },
    aiEmployeeUse: [
      { role: "Marketing Director AI", capability: "compare source and campaign outcome quality", executionAuthority: "none" },
      { role: "Revenue Operations AI", capability: "identify stale or missing lead outcome records", executionAuthority: "none" },
      { role: "Deal Analyst AI", capability: "compare property opportunity quality against contracts and closings", executionAuthority: "none" },
      { role: "Finance Analyst AI", capability: "compare verified source spend and realized revenue without double counting", executionAuthority: "none" },
      { role: "Autonomous Operations Supervisor AI", capability: "prepare internal review tasks only when separately policy-authorized", executionAuthority: "none" },
    ],
    futureCloseProbabilityInputs: [
      "seller qualification and motivation",
      "PropertyOpportunity score, confidence, and missing evidence",
      "buyer-demand ZIP, price range, and property type signals",
      "contract history by source and campaign",
      "historical lead-to-close conversion",
      "verified spend and net revenue by source",
    ],
    safety: revenueAttributionLedgerSafety,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertRevenueAttributionLedgerSafety(report);
  return report;
}

export function assertRevenueAttributionLedgerSafety(report: RevenueAttributionLedgerReport) {
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    !report.safety.readOnly,
    !report.safety.advisoryOnly,
    !report.safety.internalOnly,
    report.safety.providerCalled,
    report.safety.providerWrite,
    report.safety.sent,
    report.safety.published,
    report.safety.outreach,
    report.safety.scraping,
    report.safety.paidPropertyEnrichment,
    report.safety.adSpendMutation,
    report.safety.campaignMutation,
    report.safety.contractSent,
    report.safety.moneyMovement,
    report.safety.liveExecutionAllowed,
    report.safety.externalExecutionAllowed,
  ];

  if (unsafe.some(Boolean)) throw new Error("Revenue Attribution Ledger safety contract failed.");
  return true;
}

function unavailableLedgerReport(tenantId: string, window: RevenueLedgerWindow): RevenueAttributionLedgerReport {
  return createRevenueAttributionLedgerReport({
    tenantId,
    window,
    sourceSpend: [],
    leadOutcomes: [],
    appointmentOutcomes: [],
    contractOutcomes: [],
    closedRevenueOutcomes: [],
  });
}

function isLedgerUnavailable(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? error.code : null;
  if (code === "P2021" || code === "P2022") return true;
  const message = error instanceof Error ? error.message : String(error);
  return /SourceSpend|LeadOutcomeEvent|AppointmentOutcomeEvent|ContractOutcomeEvent|ClosedRevenueOutcomeEvent|RevenueAttributionChain|does not exist|column .* does not exist/i.test(message);
}

export async function createRevenueAttributionLedgerReportFromDb(input: {
  tenantId?: string;
  window?: RevenueLedgerWindow;
} = {}): Promise<RevenueAttributionLedgerReport> {
  const tenantId = input.tenantId ?? "default";
  const window = input.window ?? "all_time";

  try {
    const [sourceSpend, leadOutcomes, appointmentOutcomes, contractOutcomes, closedRevenueOutcomes] = await Promise.all([
      prisma.$queryRaw<SourceSpendLedgerRecord[]>(Prisma.sql`SELECT * FROM "SourceSpend" WHERE "tenantId" = ${tenantId}`),
      prisma.$queryRaw<LeadOutcomeLedgerRecord[]>(Prisma.sql`SELECT * FROM "LeadOutcomeEvent" WHERE "tenantId" = ${tenantId}`),
      prisma.$queryRaw<AppointmentOutcomeLedgerRecord[]>(Prisma.sql`SELECT * FROM "AppointmentOutcomeEvent" WHERE "tenantId" = ${tenantId}`),
      prisma.$queryRaw<ContractOutcomeLedgerRecord[]>(Prisma.sql`SELECT * FROM "ContractOutcomeEvent" WHERE "tenantId" = ${tenantId}`),
      prisma.$queryRaw<ClosedRevenueOutcomeLedgerRecord[]>(Prisma.sql`SELECT * FROM "ClosedRevenueOutcomeEvent" WHERE "tenantId" = ${tenantId}`),
    ]);

    return createRevenueAttributionLedgerReport({
      tenantId,
      window,
      sourceSpend,
      leadOutcomes,
      appointmentOutcomes,
      contractOutcomes,
      closedRevenueOutcomes,
    });
  } catch (error) {
    if (!isLedgerUnavailable(error)) throw error;
    return unavailableLedgerReport(tenantId, window);
  }
}
