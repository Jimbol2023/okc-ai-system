import type { AiWorkforceDepartmentName, AiWorkforceReport } from "@/lib/ai-workforce";
import type { ConnectorSignalFoundationReport, ConnectorSignalFreshness, RoutedConnectorSignal } from "@/lib/connector-signal-normalization";
import type { DailyRevenueOperatingLoopReport, DailyRevenueWorkOrder } from "@/lib/daily-revenue-operating-loop";
import { createDemandDiscoveryReport, createMarketIntelligenceReport } from "@/lib/phase2-intelligence";

export const marketCustomerIntelligenceObjectTypes = [
  "market_trend",
  "customer_segment",
  "neighborhood_opportunity",
  "lead_quality_signal",
  "conversion_signal",
  "content_opportunity",
  "local_trust_signal",
  "department_intelligence_packet",
] as const;

export type MarketCustomerIntelligenceObjectType = (typeof marketCustomerIntelligenceObjectTypes)[number];
export type MarketCustomerIntelligenceSourceType = "crm_internal" | "read_only_connector_snapshot" | "manual_import_ready_market" | "internal_knowledge";
export type MarketCustomerFreshness = ConnectorSignalFreshness | "manual_import_ready" | "data_gap";
export type MarketCustomerIntelligenceScore = {
  confidence: number;
  freshness: MarketCustomerFreshness;
  revenueRelevance: number;
  urgency: number;
  dataCompleteness: number;
  governanceRisk: number;
  recommendedDepartment: AiWorkforceDepartmentName;
  safeNextAction: string;
};

export type MarketCustomerIntelligenceObject = {
  id: string;
  objectType: Exclude<MarketCustomerIntelligenceObjectType, "department_intelligence_packet">;
  title: string;
  summary: string;
  sourceLabel: string;
  sourceType: MarketCustomerIntelligenceSourceType;
  confidence: number;
  freshness: MarketCustomerFreshness;
  missingData: string[];
  assumptions: string[];
  score: MarketCustomerIntelligenceScore;
  recommendedDepartment: AiWorkforceDepartmentName;
  safeNextAction: string;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type DepartmentIntelligencePacket = {
  packetType: "department_intelligence_packet";
  department: AiWorkforceDepartmentName;
  aiManager: string;
  aiEmployees: string[];
  intelligenceObjectIds: string[];
  topRecommendation: string;
  sprint11ReadinessNote: string;
  missingData: string[];
  score: MarketCustomerIntelligenceScore;
  requiresHumanReview: true;
  advisoryOnly: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalWritesAllowed: false;
};

export type MarketCustomerIntelligenceFoundationReport = {
  ok: true;
  sprint: "10E";
  generatedAt: string;
  executiveSummary: {
    title: "Market & Customer Intelligence Foundation";
    summary: string;
    sourcePriorityModel: [
      "crm_internal",
      "read_only_connector_snapshot",
      "manual_import_ready_market",
      "internal_knowledge",
    ];
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  intelligenceObjects: MarketCustomerIntelligenceObject[];
  departmentPackets: DepartmentIntelligencePacket[];
  sourceFreshnessMap: Array<{
    sourceLabel: string;
    sourceType: MarketCustomerIntelligenceSourceType;
    freshness: MarketCustomerFreshness;
    confidence: number;
    dataGap: boolean;
  }>;
  missingDataRegister: Array<{
    sourceLabel: string;
    missingData: string[];
    safeResolution: string;
    providerCalled: false;
    liveExecutionAllowed: false;
  }>;
  advisoryRecommendations: string[];
  sprint11ReadinessNotes: string[];
  safety: {
    readOnly: true;
    advisoryOnly: true;
    requiresHumanReview: true;
    rawPayloadsBlocked: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalWritesAllowed: false;
    crmMutationAllowed: false;
    leadCreationAllowed: false;
    outreachAllowed: false;
    publishingAllowed: false;
    scrapingAllowed: false;
    autonomousWorkOrdersAllowed: false;
    memoryPersistenceAllowed: false;
    kpiPersistenceAllowed: false;
    connectorActivationAllowed: false;
  };
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type MarketCustomerIntelligenceInput = {
  workforce: AiWorkforceReport;
  dailyLoop: DailyRevenueOperatingLoopReport;
  connectorSignals: ConnectorSignalFoundationReport;
  generatedAt?: string;
};

const sprint11Departments: AiWorkforceDepartmentName[] = [
  "CEO Office",
  "AI COO",
  "Lead Generation",
  "Seller Acquisition",
  "SEO",
  "Marketing",
  "Content",
  "Operations",
  "Knowledge / Memory",
  "Approval / Safety",
];

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "intelligence";
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function freshnessCompleteness(freshness: MarketCustomerFreshness) {
  if (freshness === "fresh") return 90;
  if (freshness === "partial" || freshness === "manual_import_ready") return 65;
  if (freshness === "stale") return 45;
  if (freshness === "rate_limited") return 25;

  return 20;
}

function riskForSource(sourceType: MarketCustomerIntelligenceSourceType, missingData: string[]) {
  const base = sourceType === "crm_internal" ? 20 : sourceType === "read_only_connector_snapshot" ? 35 : 30;

  return clampScore(base + missingData.length * 8);
}

function score(input: {
  confidence: number;
  freshness: MarketCustomerFreshness;
  revenueRelevance: number;
  urgency: number;
  missingData: string[];
  sourceType: MarketCustomerIntelligenceSourceType;
  recommendedDepartment: AiWorkforceDepartmentName;
  safeNextAction: string;
}): MarketCustomerIntelligenceScore {
  return {
    confidence: clampScore(input.confidence),
    freshness: input.freshness,
    revenueRelevance: clampScore(input.revenueRelevance),
    urgency: clampScore(input.urgency),
    dataCompleteness: clampScore(freshnessCompleteness(input.freshness) - input.missingData.length * 8),
    governanceRisk: riskForSource(input.sourceType, input.missingData),
    recommendedDepartment: input.recommendedDepartment,
    safeNextAction: input.safeNextAction,
  };
}

function createObject(input: {
  generatedAt: string;
  objectType: MarketCustomerIntelligenceObject["objectType"];
  title: string;
  summary: string;
  sourceLabel: string;
  sourceType: MarketCustomerIntelligenceSourceType;
  confidence: number;
  freshness: MarketCustomerFreshness;
  revenueRelevance: number;
  urgency: number;
  missingData?: string[];
  assumptions?: string[];
  recommendedDepartment: AiWorkforceDepartmentName;
  safeNextAction: string;
}): MarketCustomerIntelligenceObject {
  const missingData = [...new Set(input.missingData ?? [])].slice(0, 8);

  return {
    id: ["market-customer-intelligence", input.generatedAt.slice(0, 10), input.objectType, slug(input.sourceLabel)].join("-"),
    objectType: input.objectType,
    title: input.title.slice(0, 180),
    summary: input.summary.slice(0, 360),
    sourceLabel: input.sourceLabel,
    sourceType: input.sourceType,
    confidence: clampScore(input.confidence),
    freshness: input.freshness,
    missingData,
    assumptions: (input.assumptions ?? ["Advisory intelligence only; human review required before action."]).slice(0, 6),
    score: score({
      confidence: input.confidence,
      freshness: input.freshness,
      revenueRelevance: input.revenueRelevance,
      urgency: input.urgency,
      missingData,
      sourceType: input.sourceType,
      recommendedDepartment: input.recommendedDepartment,
      safeNextAction: input.safeNextAction,
    }),
    recommendedDepartment: input.recommendedDepartment,
    safeNextAction: input.safeNextAction,
    requiresHumanReview: true,
    advisoryOnly: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalWritesAllowed: false,
  };
}

function objectTypeForConnectorSignal(signal: RoutedConnectorSignal): MarketCustomerIntelligenceObject["objectType"] {
  if (signal.signalType === "seo_opportunity_signal") return "content_opportunity";
  if (signal.signalType === "conversion_signal") return "conversion_signal";
  if (signal.signalType === "local_trust_signal") return "local_trust_signal";
  if (signal.signalType === "inbound_lead_signal") return "lead_quality_signal";

  return "market_trend";
}

function departmentForConnectorSignal(signal: RoutedConnectorSignal): AiWorkforceDepartmentName {
  if (signal.signalType === "connector_blocker_signal") return "Operations";
  if (sprint11Departments.includes(signal.department)) return signal.department;

  return "AI COO";
}

function objectsFromConnectorSignals(signals: RoutedConnectorSignal[], generatedAt: string): MarketCustomerIntelligenceObject[] {
  return signals.map((signal) => createObject({
    generatedAt,
    objectType: objectTypeForConnectorSignal(signal),
    title: `${signal.connectorId} ${signal.signalType.replaceAll("_", " ")}`,
    summary: signal.summary,
    sourceLabel: signal.sourceLabel,
    sourceType: "read_only_connector_snapshot",
    confidence: signal.confidence,
    freshness: signal.missingData.length > 0 ? "data_gap" : signal.freshness,
    revenueRelevance: signal.signalType === "conversion_signal" || signal.signalType === "inbound_lead_signal" ? 82 : 64,
    urgency: signal.freshness === "fresh" ? 70 : signal.freshness === "partial" ? 55 : 35,
    missingData: signal.missingData,
    assumptions: ["Connector signal was normalized from a read-only snapshot; no raw provider payload is included."],
    recommendedDepartment: departmentForConnectorSignal(signal),
    safeNextAction: signal.safeNextAction,
  }));
}

function objectsFromDailyLoop(dailyLoop: DailyRevenueOperatingLoopReport, generatedAt: string): MarketCustomerIntelligenceObject[] {
  const leadObjects = dailyLoop.todaysRevenueOpportunities.slice(0, 4).map((lead) => createObject({
    generatedAt,
    objectType: "lead_quality_signal",
    title: `Lead quality signal for ${lead.leadId}`,
    summary: `${lead.priority} priority lead from ${lead.source}; score ${lead.score}.`,
    sourceLabel: `crm_internal:${lead.leadId}`,
    sourceType: "crm_internal",
    confidence: Math.max(55, Math.min(90, lead.score)),
    freshness: "fresh",
    revenueRelevance: lead.priority.toLowerCase() === "high" ? 90 : 68,
    urgency: lead.priority.toLowerCase() === "high" ? 84 : 55,
    missingData: lead.propertyAddress === "property address missing" ? ["property address"] : [],
    assumptions: ["CRM/internal operating signal has source attribution but still requires human review."],
    recommendedDepartment: "Lead Generation",
    safeNextAction: "Prepare internal lead review guidance only; do not create leads, contact sellers, or mutate CRM.",
  }));
  const workOrderObjects = dailyLoop.workOrders
    .filter((order: DailyRevenueWorkOrder) => sprint11Departments.includes(order.department))
    .slice(0, 6)
    .map((order) => createObject({
      generatedAt,
      objectType: order.department === "SEO" || order.department === "Content" ? "content_opportunity" : "conversion_signal",
      title: `Department operating signal for ${order.department}`,
      summary: order.recommendedAction,
      sourceLabel: `daily_loop:${order.id}`,
      sourceType: "crm_internal",
      confidence: order.revenueImpact === "high" ? 76 : order.revenueImpact === "medium" ? 64 : 52,
      freshness: "fresh",
      revenueRelevance: order.revenueImpact === "high" ? 86 : order.revenueImpact === "medium" ? 68 : 45,
      urgency: order.status === "needs_ceo_approval" ? 78 : order.status === "blocked" ? 70 : 52,
      missingData: order.missingData,
      assumptions: ["Daily work order is an internal operating signal and cannot become autonomous execution."],
      recommendedDepartment: order.department,
      safeNextAction: order.recommendedAction,
    }));

  return [...leadObjects, ...workOrderObjects];
}

function objectsFromManualMarket(generatedAt: string): MarketCustomerIntelligenceObject[] {
  const market = createMarketIntelligenceReport().signals.map((signal) => createObject({
    generatedAt,
    objectType: "market_trend",
    title: signal.title,
    summary: signal.businessImplication,
    sourceLabel: signal.sourceLabel,
    sourceType: "manual_import_ready_market",
    confidence: signal.confidence,
    freshness: "manual_import_ready",
    revenueRelevance: signal.marketImpact === "opportunity" ? 74 : 58,
    urgency: signal.marketImpact === "risk" ? 70 : 48,
    missingData: signal.missingData,
    assumptions: [signal.provenance],
    recommendedDepartment: "CEO Office",
    safeNextAction: "Prepare an internal market review packet for CEO review; do not publish claims or call external data providers.",
  }));
  const demand = createDemandDiscoveryReport().opportunities.map((opportunity) => createObject({
    generatedAt,
    objectType: "customer_segment",
    title: opportunity.audience,
    summary: opportunity.explanation,
    sourceLabel: opportunity.sourceLabel,
    sourceType: "internal_knowledge",
    confidence: opportunity.confidence,
    freshness: "manual_import_ready",
    revenueRelevance: opportunity.opportunityScore,
    urgency: opportunity.revenuePotential === "high" ? 72 : 48,
    missingData: opportunity.requiredReview,
    assumptions: ["Demand opportunity is explainable advisory intelligence only."],
    recommendedDepartment: "Marketing",
    safeNextAction: "Prepare an internal customer segment brief; do not publish content or contact prospects.",
  }));
  const neighborhood = createObject({
    generatedAt,
    objectType: "neighborhood_opportunity",
    title: "Oklahoma City neighborhood opportunity review",
    summary: "Combine CRM source patterns, manual market watches, and read-only connector data gaps into a neighborhood review queue for Sprint 11 departments.",
    sourceLabel: "internal_knowledge:neighborhood_opportunity_foundation",
    sourceType: "internal_knowledge",
    confidence: 58,
    freshness: "manual_import_ready",
    revenueRelevance: 70,
    urgency: 52,
    missingData: ["Verified neighborhood demand by source", "Approved market source timestamps"],
    assumptions: ["Neighborhood opportunity is an advisory review concept and cannot create leads or trigger scraping."],
    recommendedDepartment: "Seller Acquisition",
    safeNextAction: "Prepare manual neighborhood review prompts for department planning only.",
  });

  return [...market, ...demand, neighborhood];
}

function buildDepartmentPackets(input: {
  workforce: AiWorkforceReport;
  objects: MarketCustomerIntelligenceObject[];
}): DepartmentIntelligencePacket[] {
  return sprint11Departments.map((department) => {
    const departmentObjects = input.objects.filter((object) => object.recommendedDepartment === department);
    const employees = input.workforce.employees.filter((employee) => employee.department === department).slice(0, 4);
    const missingData = [...new Set(departmentObjects.flatMap((object) => object.missingData))].slice(0, 8);
    const average = (values: number[], fallback: number) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : fallback;
    const topObject = [...departmentObjects].sort((a, b) => b.score.revenueRelevance + b.score.urgency - (a.score.revenueRelevance + a.score.urgency))[0];
    const safeNextAction = topObject?.safeNextAction ?? "Monitor Sprint 10E advisory intelligence until department-specific signals are available.";

    return {
      packetType: "department_intelligence_packet",
      department,
      aiManager: employees[0]?.manager ?? `${department} Manager`,
      aiEmployees: employees.map((employee) => employee.name),
      intelligenceObjectIds: departmentObjects.map((object) => object.id),
      topRecommendation: safeNextAction,
      sprint11ReadinessNote: `${department} can consume Sprint 10E intelligence as advisory daily context only; autonomous execution remains blocked.`,
      missingData,
      score: score({
        confidence: average(departmentObjects.map((object) => object.score.confidence), 50),
        freshness: departmentObjects.some((object) => object.freshness === "data_gap") ? "data_gap" : "manual_import_ready",
        revenueRelevance: average(departmentObjects.map((object) => object.score.revenueRelevance), 45),
        urgency: average(departmentObjects.map((object) => object.score.urgency), 35),
        missingData,
        sourceType: "internal_knowledge",
        recommendedDepartment: department,
        safeNextAction,
      }),
      requiresHumanReview: true,
      advisoryOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
    };
  });
}

export function createMarketCustomerIntelligenceFoundationReportFromInputs(input: MarketCustomerIntelligenceInput): MarketCustomerIntelligenceFoundationReport {
  const generatedAt = input.generatedAt ?? input.connectorSignals.generatedAt ?? input.dailyLoop.generatedAt ?? input.workforce.generatedAt ?? new Date().toISOString();
  const intelligenceObjects = [
    ...objectsFromDailyLoop(input.dailyLoop, generatedAt),
    ...objectsFromConnectorSignals(input.connectorSignals.routedSignals, generatedAt),
    ...objectsFromManualMarket(generatedAt),
  ];
  const departmentPackets = buildDepartmentPackets({ workforce: input.workforce, objects: intelligenceObjects });
  const sourceFreshnessMap = intelligenceObjects.map((object) => ({
    sourceLabel: object.sourceLabel,
    sourceType: object.sourceType,
    freshness: object.freshness,
    confidence: object.confidence,
    dataGap: object.freshness === "data_gap" || object.missingData.length > 0,
  }));
  const missingDataRegister = intelligenceObjects
    .filter((object) => object.missingData.length > 0)
    .map((object) => ({
      sourceLabel: object.sourceLabel,
      missingData: object.missingData,
      safeResolution: `Resolve manually or through separately approved read-only evidence for ${object.recommendedDepartment}; do not activate providers or mutate systems.`,
      providerCalled: false as const,
      liveExecutionAllowed: false as const,
    }));
  const advisoryRecommendations = departmentPackets
    .filter((packet) => packet.intelligenceObjectIds.length > 0)
    .map((packet) => `${packet.department}: ${packet.topRecommendation}`)
    .slice(0, 10);
  const report: MarketCustomerIntelligenceFoundationReport = {
    ok: true,
    sprint: "10E",
    generatedAt,
    executiveSummary: {
      title: "Market & Customer Intelligence Foundation",
      summary: "Read-only advisory intelligence packets are ready to inform Sprint 11 department operating rhythm without executing provider, CRM, outreach, publishing, scraping, memory, or KPI writes.",
      sourcePriorityModel: [
        "crm_internal",
        "read_only_connector_snapshot",
        "manual_import_ready_market",
        "internal_knowledge",
      ],
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    intelligenceObjects,
    departmentPackets,
    sourceFreshnessMap,
    missingDataRegister,
    advisoryRecommendations,
    sprint11ReadinessNotes: departmentPackets.map((packet) => packet.sprint11ReadinessNote),
    safety: {
      readOnly: true,
      advisoryOnly: true,
      requiresHumanReview: true,
      rawPayloadsBlocked: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalWritesAllowed: false,
      crmMutationAllowed: false,
      leadCreationAllowed: false,
      outreachAllowed: false,
      publishingAllowed: false,
      scrapingAllowed: false,
      autonomousWorkOrdersAllowed: false,
      memoryPersistenceAllowed: false,
      kpiPersistenceAllowed: false,
      connectorActivationAllowed: false,
    },
    providerCalled: false,
    liveExecutionAllowed: false,
  };
  assertMarketCustomerIntelligenceFoundationSafety(report);

  return report;
}

export function assertMarketCustomerIntelligenceFoundationSafety(report: MarketCustomerIntelligenceFoundationReport) {
  const serialized = JSON.stringify(report);
  const unsafe = [
    report.providerCalled,
    report.liveExecutionAllowed,
    !report.safety.readOnly,
    !report.safety.advisoryOnly,
    !report.safety.requiresHumanReview,
    !report.safety.rawPayloadsBlocked,
    report.safety.providerCalled,
    report.safety.liveExecutionAllowed,
    report.safety.externalWritesAllowed,
    report.safety.crmMutationAllowed,
    report.safety.leadCreationAllowed,
    report.safety.outreachAllowed,
    report.safety.publishingAllowed,
    report.safety.scrapingAllowed,
    report.safety.autonomousWorkOrdersAllowed,
    report.safety.memoryPersistenceAllowed,
    report.safety.kpiPersistenceAllowed,
    report.safety.connectorActivationAllowed,
    report.intelligenceObjects.some((object) => !object.advisoryOnly || !object.requiresHumanReview || object.providerCalled || object.liveExecutionAllowed || object.externalWritesAllowed),
    report.departmentPackets.some((packet) => !packet.advisoryOnly || !packet.requiresHumanReview || packet.providerCalled || packet.liveExecutionAllowed || packet.externalWritesAllowed),
    report.missingDataRegister.some((item) => item.providerCalled || item.liveExecutionAllowed),
  ];

  if (unsafe.some(Boolean)) {
    throw new Error("Market/customer intelligence foundation safety contract failed.");
  }
  if (/ya29\.|GOCSPX-|refresh-token|client-secret|BEGIN PRIVATE KEY|authorization|bearer\s+|https:\/\/www\.googleapis\.com|gmail\.googleapis\.com|drive\.googleapis\.com|analytics\.googleapis\.com|searchconsole\.googleapis\.com|businessprofileperformance\.googleapis\.com/iu.test(serialized)) {
    throw new Error("Market/customer intelligence foundation exposed secret-like values or provider endpoints.");
  }
  if (/send_email|send_sms|publish_post|reply_to_review|create_lead|crm_mutation|autonomous_work_order|drive\.files\.create|drafts\.send|calendar\.events\.insert/iu.test(serialized)) {
    throw new Error("Market/customer intelligence foundation exposed blocked execution actions.");
  }

  return true;
}
