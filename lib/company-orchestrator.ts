export type CompanyGoal =
  | "generate_revenue"
  | "increase_brand_value"
  | "improve_executive_decisions"
  | "reduce_executive_workload"
  | "reduce_business_risk"
  | "increase_operational_efficiency";

export type AiDepartmentName =
  | "Executive AI"
  | "Revenue AI"
  | "Marketing AI"
  | "SEO AI"
  | "Design AI"
  | "Brand Intelligence AI"
  | "Content Intelligence AI"
  | "Lead Intelligence AI"
  | "Sales AI"
  | "County Records AI"
  | "Driving for Dollars AI"
  | "Google Maps AI"
  | "Government & Policy AI"
  | "News Intelligence AI"
  | "Market Research AI"
  | "Knowledge AI"
  | "Document Intelligence AI"
  | "Provider Readiness AI"
  | "Operations AI"
  | "Approval AI"
  | "Security & Governance AI";

export type CompanyDepartment = {
  key: string;
  name: AiDepartmentName;
  purpose: string;
  responsibilities: string[];
  outputs: string[];
  contributesTo: CompanyGoal[];
  approvalRequired: true;
  executionBoundary: {
    communicatesThroughAiCoo: true;
    advisoryOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    publishingBlocked: true;
    scrapingBlocked: true;
    outreachBlocked: true;
    workflowExecutionBlocked: true;
  };
};

export type ExecutiveDirectiveStatus =
  | "recommended"
  | "awaiting_ceo_approval"
  | "approved"
  | "in_progress"
  | "department_review"
  | "executive_review"
  | "ready_for_final_approval"
  | "approved_for_manual_execution"
  | "completed"
  | "rejected";

export type ExecutiveDirective = {
  id: string;
  title: string;
  business_goal: CompanyGoal;
  source_department: AiDepartmentName;
  assigned_departments: AiDepartmentName[];
  requested_outputs: string[];
  approval_status: ExecutiveDirectiveStatus;
  approved_by?: string;
  approved_at?: string;
  risk_level: "low" | "medium" | "high";
  expected_business_value: string;
  governance_notes: string[];
};

export type OpportunitySource =
  | "Website"
  | "Google Business Profile"
  | "Facebook"
  | "Instagram"
  | "LinkedIn"
  | "Pinterest"
  | "YouTube"
  | "TikTok"
  | "X"
  | "Email"
  | "SMS"
  | "Phone"
  | "County Records"
  | "Driving for Dollars"
  | "Google Maps"
  | "Referrals"
  | "Public Records"
  | "News Intelligence"
  | "Government & Policy"
  | "Manual Import";

export type OpportunityQueueItem = {
  id: string;
  source: OpportunitySource;
  address: string;
  owner_name?: string;
  contact_info?: string;
  lead_score: number;
  confidence: number;
  estimated_value: string;
  opportunity_type: string;
  motivation_signal: string;
  recommended_action: string;
  status: "new" | "triage" | "lead_intelligence_review" | "revenue_review" | "executive_review" | "closed";
  sourceLabel: string;
  assumption: string;
  outreachAllowed: false;
};

export type CompanyOperatingMode = "planning" | "daily_startup_ready" | "ceo_review" | "approved_internal_workflow";

export type CeoDecisionType = "approve" | "reject" | "request_changes" | "defer";

export type CeoDecisionAgendaItem = {
  id: string;
  title: string;
  business_goal: CompanyGoal;
  reason: string;
  expected_business_value: string;
  risk_level: ExecutiveDirective["risk_level"];
  departments_involved: AiDepartmentName[];
  recommended_action: CeoDecisionType;
  approval_required: true;
  status: ExecutiveDirectiveStatus;
  sourceLabel: string;
  assumption: string;
};

export type DailyStartupHealth = {
  score: number;
  status: "good" | "watch" | "urgent" | "missing";
  summary: string;
  sourceLabel: string;
  assumption: string;
};

export type DailyStartupQueueSummary = {
  total: number;
  awaiting_ceo_approval: number;
  ready_for_review: number;
  blocked: number;
  summary: string;
};

export type CompanyOrchestratorWorkflowState =
  | "blocked_awaiting_ceo_approval"
  | "approved_assignment_ready"
  | "department_review"
  | "executive_review"
  | "ready_for_final_approval";

export type CompanyOrchestratorReport = {
  ok: true;
  businessName: "AI Chief Operating Officer (AI COO)";
  internalName: "company-orchestrator";
  summary: string;
  directive: ExecutiveDirective;
  workflowState: CompanyOrchestratorWorkflowState;
  approvalValid: boolean;
  departmentAssignments: Array<{
    department: AiDepartmentName;
    requestedOutputs: string[];
    dependencies: string[];
    status: "blocked" | "assigned_for_preparation";
  }>;
  opportunityQueue: {
    items: OpportunityQueueItem[];
    totals: {
      opportunities: number;
      highConfidence: number;
      readyForLeadIntelligence: number;
    };
  };
  draftQueue: Array<{
    output: string;
    ownerDepartment: AiDepartmentName;
    status: "draft_required" | "blocked_until_directive_approved";
    approvalRequired: true;
  }>;
  reviewRoutes: {
    brandReview: AiDepartmentName;
    governanceReview: AiDepartmentName;
    executiveSummaryOwner: AiDepartmentName;
    finalApprovalOwner: "CEO";
  };
  executiveSummary: string;
  blockedActions: string[];
  safety: {
    approvalFirst: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    noDepartmentDirectCommunication: true;
    publishingBlocked: true;
    outreachBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
    workflowExecutionBlocked: true;
  };
};

export type DailyCompanyOperatingSession = {
  ok: true;
  date: string;
  companyOperatingMode: CompanyOperatingMode;
  company_health: DailyStartupHealth;
  revenue_health: DailyStartupHealth;
  brand_health: DailyStartupHealth;
  marketing_health: DailyStartupHealth;
  seo_health: DailyStartupHealth;
  lead_health: DailyStartupHealth;
  operations_health: DailyStartupHealth;
  security_health: DailyStartupHealth;
  department_health: Array<{
    department: AiDepartmentName;
    status: "ready" | "blocked_awaiting_directive" | "review_only";
    summary: string;
    approval_required: true;
  }>;
  active_executive_directives: ExecutiveDirective[];
  opportunity_queue_summary: DailyStartupQueueSummary;
  campaign_queue_summary: DailyStartupQueueSummary;
  draft_queue_summary: DailyStartupQueueSummary;
  approval_queue_summary: DailyStartupQueueSummary;
  blocked_items: string[];
  provider_readiness: {
    summary: string;
    missing: number;
    ready: number;
    providerCalled: false;
    liveExecutionAllowed: false;
  };
  government_policy_updates: string[];
  news_intelligence_updates: string[];
  engineering_progress: string[];
  executive_brief: string;
  ceo_decision_agenda: CeoDecisionAgendaItem[];
  safety: {
    internalOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    publishingBlocked: true;
    emailBlocked: true;
    smsBlocked: true;
    scrapingBlocked: true;
    adsBlocked: true;
    outreachBlocked: true;
    workflowExecutionBlocked: true;
    recommendationsOnly: true;
  };
};

const executionBoundary = {
  communicatesThroughAiCoo: true,
  advisoryOnly: true,
  providerCalled: false,
  liveExecutionAllowed: false,
  publishingBlocked: true,
  scrapingBlocked: true,
  outreachBlocked: true,
  workflowExecutionBlocked: true,
} as const;

function department(input: Omit<CompanyDepartment, "approvalRequired" | "executionBoundary">): CompanyDepartment {
  return {
    ...input,
    approvalRequired: true,
    executionBoundary,
  };
}

export function getCompanyDepartmentRegistry(): CompanyDepartment[] {
  return [
    department({ key: "executive_ai", name: "Executive AI", purpose: "Acts as Chief of Staff for executive summaries and priorities.", responsibilities: ["daily executive brief", "recommendations", "priority management", "escalation"], outputs: ["executive summary", "priority list", "approval context"], contributesTo: ["improve_executive_decisions", "reduce_executive_workload"] }),
    department({ key: "revenue_ai", name: "Revenue AI", purpose: "Connects opportunities, source quality, and pipeline value to revenue priorities.", responsibilities: ["pipeline review", "offer readiness", "source ROI"], outputs: ["revenue recommendations", "pipeline risk notes"], contributesTo: ["generate_revenue", "improve_executive_decisions"] }),
    department({ key: "marketing_ai", name: "Marketing AI", purpose: "Creates seller-education campaign drafts for review.", responsibilities: ["campaign package drafting", "platform-specific copy", "email/SMS/call script drafts"], outputs: ["website draft", "social drafts", "email draft", "SMS draft", "call script"], contributesTo: ["generate_revenue", "increase_brand_value", "reduce_executive_workload"] }),
    department({ key: "seo_ai", name: "SEO AI", purpose: "Plans organic authority and content discoverability.", responsibilities: ["keyword opportunities", "content gaps", "internal linking"], outputs: ["SEO brief", "content refresh notes"], contributesTo: ["generate_revenue", "increase_brand_value"] }),
    department({ key: "design_ai", name: "Design AI", purpose: "Prepares manual creative briefs and visual concepts.", responsibilities: ["Canva briefs", "Adobe Express briefs", "Firefly prompts", "thumbnail concepts"], outputs: ["Canva brief", "Adobe brief", "Firefly prompt"], contributesTo: ["increase_brand_value", "reduce_executive_workload"] }),
    department({ key: "brand_intelligence_ai", name: "Brand Intelligence AI", purpose: "Protects trust and brand readiness across platforms.", responsibilities: ["brand readiness", "profile completeness", "brand review"], outputs: ["brand review", "platform readiness notes"], contributesTo: ["increase_brand_value", "reduce_business_risk"] }),
    department({ key: "content_intelligence_ai", name: "Content Intelligence AI", purpose: "Turns content and lead-source signals into campaign recommendations.", responsibilities: ["content performance review", "refresh recommendations", "repurposing recommendations"], outputs: ["campaign briefs", "refresh briefs", "repurpose briefs"], contributesTo: ["generate_revenue", "increase_brand_value", "improve_executive_decisions"] }),
    department({ key: "lead_intelligence_ai", name: "Lead Intelligence AI", purpose: "Scores seller opportunity quality and follow-up priority.", responsibilities: ["lead scoring", "motivation signals", "attribution"], outputs: ["lead priority notes", "source quality notes"], contributesTo: ["generate_revenue", "improve_executive_decisions"] }),
    department({ key: "sales_ai", name: "Sales AI", purpose: "Prepares manual sales scripts and objection-handling support.", responsibilities: ["call scripts", "seller conversation prep", "follow-up recommendations"], outputs: ["call script", "sales prep notes"], contributesTo: ["generate_revenue", "reduce_executive_workload"] }),
    department({ key: "county_records_ai", name: "County Records AI", purpose: "Reviews county/public-record opportunity signals without scraping.", responsibilities: ["manual records review", "opportunity signals", "source notes"], outputs: ["county opportunity notes"], contributesTo: ["generate_revenue", "reduce_business_risk"] }),
    department({ key: "driving_for_dollars_ai", name: "Driving for Dollars AI", purpose: "Organizes manual field-observed property opportunities.", responsibilities: ["field lead triage", "condition signal notes", "manual source labels"], outputs: ["D4D opportunity notes"], contributesTo: ["generate_revenue", "increase_operational_efficiency"] }),
    department({ key: "google_maps_ai", name: "Google Maps AI", purpose: "Plans map-based research readiness without provider calls.", responsibilities: ["route planning readiness", "area notes", "map source governance"], outputs: ["map research brief"], contributesTo: ["increase_operational_efficiency", "reduce_business_risk"] }),
    department({ key: "government_policy_ai", name: "Government & Policy AI", purpose: "Summarizes manual policy and government signal relevance.", responsibilities: ["policy monitoring notes", "risk summaries", "local government context"], outputs: ["policy brief"], contributesTo: ["reduce_business_risk", "improve_executive_decisions"] }),
    department({ key: "news_intelligence_ai", name: "News Intelligence AI", purpose: "Turns manually reviewed news signals into business context.", responsibilities: ["news summaries", "market-impact notes", "risk alerts"], outputs: ["news intelligence brief"], contributesTo: ["improve_executive_decisions", "reduce_business_risk"] }),
    department({ key: "market_research_ai", name: "Market Research AI", purpose: "Analyzes local market assumptions and seller education opportunities.", responsibilities: ["market research", "competitor positioning", "area opportunities"], outputs: ["market research brief"], contributesTo: ["generate_revenue", "improve_executive_decisions"] }),
    department({ key: "knowledge_ai", name: "Knowledge AI", purpose: "Maintains reusable company knowledge and source-grounded context.", responsibilities: ["knowledge organization", "SOP reuse", "source labels"], outputs: ["knowledge updates", "SOP notes"], contributesTo: ["reduce_executive_workload", "increase_operational_efficiency"] }),
    department({ key: "document_intelligence_ai", name: "Document Intelligence AI", purpose: "Prepares document drafts and review workflows.", responsibilities: ["document review", "template prep", "sensitive-data warnings"], outputs: ["document brief", "template notes"], contributesTo: ["increase_operational_efficiency", "reduce_business_risk"] }),
    department({ key: "provider_readiness_ai", name: "Provider Readiness AI", purpose: "Tracks future connector readiness without activation.", responsibilities: ["provider readiness", "credential gap notes", "scope planning"], outputs: ["provider readiness summary"], contributesTo: ["reduce_business_risk", "increase_operational_efficiency"] }),
    department({ key: "operations_ai", name: "Operations AI", purpose: "Coordinates workflow state, dependencies, and blockers.", responsibilities: ["dependency tracking", "blocked action tracking", "handoff readiness"], outputs: ["operations summary", "blocker list"], contributesTo: ["increase_operational_efficiency", "reduce_executive_workload"] }),
    department({ key: "approval_ai", name: "Approval AI", purpose: "Maintains approval queues and decision-readiness context.", responsibilities: ["approval status review", "final approval packaging", "decision notes"], outputs: ["approval queue", "approval summary"], contributesTo: ["improve_executive_decisions", "reduce_business_risk"] }),
    department({ key: "security_governance_ai", name: "Security & Governance AI", purpose: "Validates governance rules and blocks unauthorized actions.", responsibilities: ["governance review", "security boundary review", "execution blocking"], outputs: ["governance review", "blocked action report"], contributesTo: ["reduce_business_risk", "improve_executive_decisions"] }),
  ];
}

function isDirectiveApproved(directive: ExecutiveDirective) {
  return directive.approval_status !== "recommended" && directive.approval_status !== "awaiting_ceo_approval" && directive.approval_status !== "rejected";
}

function findDepartment(name: AiDepartmentName) {
  return getCompanyDepartmentRegistry().find((departmentItem) => departmentItem.name === name);
}

function ownerForOutput(output: string): AiDepartmentName {
  const normalized = output.toLowerCase();
  if (normalized.includes("brand")) return "Brand Intelligence AI";
  if (normalized.includes("canva") || normalized.includes("adobe") || normalized.includes("firefly") || normalized.includes("thumbnail")) return "Design AI";
  if (normalized.includes("seo")) return "SEO AI";
  if (normalized.includes("call") || normalized.includes("sms")) return "Sales AI";
  if (normalized.includes("executive")) return "Executive AI";

  return "Marketing AI";
}

export function createOpportunityQueue(items: OpportunityQueueItem[] = []) {
  return {
    items,
    totals: {
      opportunities: items.length,
      highConfidence: items.filter((item) => item.confidence >= 75).length,
      readyForLeadIntelligence: items.filter((item) => item.status === "new" || item.status === "triage").length,
    },
  };
}

export function createBrandReadinessReviewDirective(): ExecutiveDirective {
  return {
    id: "directive-brand-readiness-review",
    title: "Brand Readiness Review",
    business_goal: "increase_brand_value",
    source_department: "Brand Intelligence AI",
    assigned_departments: ["Brand Intelligence AI", "Design AI", "Executive AI"],
    requested_outputs: ["Brand readiness summary", "Platform profile gap notes", "Executive Summary", "CEO Final Approval"],
    approval_status: "awaiting_ceo_approval",
    risk_level: "low",
    expected_business_value: "Improve public trust and brand consistency before larger campaign volume.",
    governance_notes: ["Review-only readiness directive.", "No platform login, provider call, publishing, or profile update is authorized."],
  };
}

export function createContentRefreshReviewDirective(): ExecutiveDirective {
  return {
    id: "directive-content-refresh-review",
    title: "Content Refresh Review",
    business_goal: "generate_revenue",
    source_department: "Content Intelligence AI",
    assigned_departments: ["Content Intelligence AI", "SEO AI", "Marketing AI", "Executive AI"],
    requested_outputs: ["Refresh brief", "SEO opportunity notes", "Campaign recommendation", "Executive Summary", "CEO Final Approval"],
    approval_status: "awaiting_ceo_approval",
    risk_level: "low",
    expected_business_value: "Identify existing educational content that can be refreshed to support qualified seller lead generation.",
    governance_notes: ["Manual/read-only inputs only.", "No analytics API, scraping, publishing, or scheduling is authorized."],
  };
}

export function createLeadSourceQualityReviewDirective(): ExecutiveDirective {
  return {
    id: "directive-lead-source-quality-review",
    title: "Lead Source Quality Review",
    business_goal: "improve_executive_decisions",
    source_department: "Lead Intelligence AI",
    assigned_departments: ["Lead Intelligence AI", "Revenue AI", "Executive AI"],
    requested_outputs: ["Source quality summary", "Qualified lead assumptions", "Revenue priority notes", "Executive Summary", "CEO Final Approval"],
    approval_status: "awaiting_ceo_approval",
    risk_level: "medium",
    expected_business_value: "Help focus operator attention on sources most likely to create qualified seller opportunities.",
    governance_notes: ["Uses internal/manual source labels only.", "No outreach, enrichment provider, skip trace, or CRM mutation is authorized."],
  };
}

export function listExecutiveDirectives(): ExecutiveDirective[] {
  return [
    createInheritedPropertyCampaignDirective(),
    createBrandReadinessReviewDirective(),
    createContentRefreshReviewDirective(),
    createLeadSourceQualityReviewDirective(),
  ];
}

function createHealth(summary: string, status: DailyStartupHealth["status"], score: number, sourceLabel: string): DailyStartupHealth {
  return {
    score,
    status,
    summary,
    sourceLabel,
    assumption: "Daily Startup v1 uses internal/manual platform state and local dashboard summaries only.",
  };
}

function summarizeDirectives(directives: ExecutiveDirective[]): DailyStartupQueueSummary {
  const awaiting = directives.filter((directive) => directive.approval_status === "awaiting_ceo_approval").length;
  const ready = directives.filter((directive) => directive.approval_status === "approved" || directive.approval_status === "department_review" || directive.approval_status === "executive_review").length;

  return {
    total: directives.length,
    awaiting_ceo_approval: awaiting,
    ready_for_review: ready,
    blocked: awaiting,
    summary: `${directives.length} directive(s), ${awaiting} awaiting CEO approval, ${ready} ready for internal review.`,
  };
}

function createDecisionAgenda(directives: ExecutiveDirective[]): CeoDecisionAgendaItem[] {
  return directives.map((directive) => ({
    id: `decision-${directive.id}`,
    title: directive.title,
    business_goal: directive.business_goal,
    reason:
      directive.id === "campaign-001"
        ? "Campaign 001 is the first activation candidate and should be reviewed before any department draft workflow begins."
        : "This directive can improve activation readiness, but it should remain blocked until the CEO chooses the next priority.",
    expected_business_value: directive.expected_business_value,
    risk_level: directive.risk_level,
    departments_involved: directive.assigned_departments,
    recommended_action: directive.id === "campaign-001" ? "approve" : "defer",
    approval_required: true,
    status: directive.approval_status,
    sourceLabel: "company_orchestrator_directive_registry",
    assumption: "Recommendation only; no workflow state changes or external execution are performed.",
  }));
}

export function startDailyCompanyOperatingSession({
  date = new Date().toISOString(),
  companyOperatingMode = "daily_startup_ready",
  directives = listExecutiveDirectives(),
  opportunities = [],
  providerReadiness = { missing: 0, ready: 0 },
  engineeringProgress = ["Executive Workforce and AI COO foundations are available for Daily Startup review."],
}: {
  date?: string;
  companyOperatingMode?: CompanyOperatingMode;
  directives?: ExecutiveDirective[];
  opportunities?: OpportunityQueueItem[];
  providerReadiness?: { missing: number; ready: number };
  engineeringProgress?: string[];
} = {}): DailyCompanyOperatingSession {
  const directiveSummary = summarizeDirectives(directives);
  const decisionAgenda = createDecisionAgenda(directives);
  const opportunityQueue = createOpportunityQueue(opportunities);
  const blockedItems = [
    ...directives.filter((directive) => directive.approval_status === "awaiting_ceo_approval").map((directive) => `${directive.title} is awaiting CEO approval.`),
    "No department work starts without an approved Executive Directive.",
    "External execution remains blocked: providers, publishing, email, SMS, scraping, ads, outreach, and workflow automation.",
  ];
  const departments = getCompanyDepartmentRegistry();

  return {
    ok: true,
    date,
    companyOperatingMode,
    company_health: createHealth("Company is ready for internal Daily Startup review; activation remains approval-gated.", "watch", 72, "daily_startup_internal_model"),
    revenue_health: createHealth("Revenue priorities are ready for CEO review through Campaign 001 and lead-source quality recommendations.", "watch", 70, "revenue_command_center"),
    brand_health: createHealth("Brand Intelligence can review platform readiness after directive approval.", "watch", 68, "marketing_platform_registry"),
    marketing_health: createHealth("Marketing work remains draft-only until the CEO approves an Executive Directive.", "watch", 66, "marketing_draft_queue"),
    seo_health: createHealth("SEO can recommend refresh and education opportunities without provider calls or scraping.", "good", 74, "content_intelligence_manual_inputs"),
    lead_health: createHealth("Lead Intelligence can review source quality from internal/manual source labels only.", "watch", 69, "lead_source_attribution"),
    operations_health: createHealth("AI COO can coordinate departments, dependencies, draft queue, blocked actions, and executive summary.", "good", 82, "company_orchestrator"),
    security_health: createHealth("Security and governance boundaries remain active with external actions blocked.", "good", 90, "safety_flags"),
    department_health: departments.map((departmentItem) => ({
      department: departmentItem.name,
      status: directiveSummary.awaiting_ceo_approval > 0 ? "blocked_awaiting_directive" : "review_only",
      summary: `${departmentItem.name} communicates through AI COO and remains advisory until CEO approval.`,
      approval_required: true,
    })),
    active_executive_directives: directives,
    opportunity_queue_summary: {
      total: opportunityQueue.totals.opportunities,
      awaiting_ceo_approval: 0,
      ready_for_review: opportunityQueue.totals.readyForLeadIntelligence,
      blocked: 0,
      summary: `${opportunityQueue.totals.opportunities} opportunity item(s), ${opportunityQueue.totals.readyForLeadIntelligence} ready for Lead Intelligence review.`,
    },
    campaign_queue_summary: directiveSummary,
    draft_queue_summary: {
      total: 0,
      awaiting_ceo_approval: directiveSummary.awaiting_ceo_approval,
      ready_for_review: 0,
      blocked: directiveSummary.awaiting_ceo_approval,
      summary: "Draft queue is blocked until the CEO approves an Executive Directive.",
    },
    approval_queue_summary: {
      total: decisionAgenda.length,
      awaiting_ceo_approval: decisionAgenda.filter((item) => item.status === "awaiting_ceo_approval").length,
      ready_for_review: decisionAgenda.length,
      blocked: 0,
      summary: `${decisionAgenda.length} CEO decision item(s): approve, reject, request changes, or defer.`,
    },
    blocked_items: blockedItems,
    provider_readiness: {
      summary: `${providerReadiness.ready} provider(s) ready, ${providerReadiness.missing} missing; readiness is informational only.`,
      missing: providerReadiness.missing,
      ready: providerReadiness.ready,
      providerCalled: false,
      liveExecutionAllowed: false,
    },
    government_policy_updates: ["No live government or policy feeds are connected; add manual updates for review."],
    news_intelligence_updates: ["No live news feeds are connected; add manual news intelligence updates for review."],
    engineering_progress: engineeringProgress,
    executive_brief: "Good morning Moses. The AI company is ready to prepare internal work, but Campaign 001 and supporting directives require CEO approval before departments begin.",
    ceo_decision_agenda: decisionAgenda,
    safety: {
      internalOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      publishingBlocked: true,
      emailBlocked: true,
      smsBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      outreachBlocked: true,
      workflowExecutionBlocked: true,
      recommendationsOnly: true,
    },
  };
}

export function runCompanyOrchestrator({ directive, opportunities = [] }: { directive: ExecutiveDirective; opportunities?: OpportunityQueueItem[] }): CompanyOrchestratorReport {
  const approvalValid = isDirectiveApproved(directive);
  const assignedDepartments = directive.assigned_departments.map((departmentName) => findDepartment(departmentName)).filter(Boolean) as CompanyDepartment[];
  const draftQueue = directive.requested_outputs.map((output) => ({
    output,
    ownerDepartment: ownerForOutput(output),
    status: approvalValid ? "draft_required" as const : "blocked_until_directive_approved" as const,
    approvalRequired: true as const,
  }));
  const departmentAssignments = assignedDepartments.map((departmentItem) => ({
    department: departmentItem.name,
    requestedOutputs: directive.requested_outputs.filter((output) => ownerForOutput(output) === departmentItem.name || departmentItem.outputs.some((departmentOutput) => output.toLowerCase().includes(departmentOutput.toLowerCase().split(" ")[0] ?? ""))),
    dependencies: ["Executive Directive", "Opportunity Queue", "Approval Status", "AI COO"],
    status: approvalValid ? "assigned_for_preparation" as const : "blocked" as const,
  }));
  const blockedActions = [
    "No publishing without CEO final approval.",
    "No provider calls, OAuth, scraping, ads, email, SMS, calls, outreach, or workflow execution.",
    "No department-to-department handoff outside the AI COO.",
    ...(!approvalValid ? ["Executive Directive is not approved; company work remains blocked."] : []),
  ];
  const workflowState: CompanyOrchestratorWorkflowState = approvalValid ? "approved_assignment_ready" : "blocked_awaiting_ceo_approval";

  return {
    ok: true,
    businessName: "AI Chief Operating Officer (AI COO)",
    internalName: "company-orchestrator",
    summary: approvalValid
      ? `AI COO accepted directive ${directive.id}, assigned ${departmentAssignments.length} department(s), and prepared ${draftQueue.length} draft queue item(s) for review.`
      : `AI COO blocked directive ${directive.id} because CEO approval is required before departments begin business work.`,
    directive,
    workflowState,
    approvalValid,
    departmentAssignments,
    opportunityQueue: createOpportunityQueue(opportunities),
    draftQueue,
    reviewRoutes: {
      brandReview: "Brand Intelligence AI",
      governanceReview: "Security & Governance AI",
      executiveSummaryOwner: "Executive AI",
      finalApprovalOwner: "CEO",
    },
    executiveSummary: approvalValid
      ? `${directive.title}: departments prepare requested outputs, Brand Intelligence reviews public trust risk, Security & Governance reviews execution boundaries, Executive AI summarizes, and Moses Adebajo makes final decisions.`
      : `${directive.title}: awaiting CEO approval. No department work is authorized.`,
    blockedActions,
    safety: {
      approvalFirst: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      noDepartmentDirectCommunication: true,
      publishingBlocked: true,
      outreachBlocked: true,
      scrapingBlocked: true,
      adsBlocked: true,
      workflowExecutionBlocked: true,
    },
  };
}

export function createInheritedPropertyCampaignDirective(): ExecutiveDirective {
  return {
    id: "campaign-001",
    title: "Campaign 001: Inherited Property in Oklahoma",
    business_goal: "generate_revenue",
    source_department: "Executive AI",
    assigned_departments: ["Executive AI", "Revenue AI", "Marketing AI", "SEO AI", "Design AI", "Brand Intelligence AI", "Lead Intelligence AI", "Sales AI"],
    requested_outputs: [
      "Website draft",
      "Facebook draft",
      "Instagram draft",
      "LinkedIn draft",
      "Pinterest draft",
      "X draft",
      "Google Business Profile draft",
      "YouTube script",
      "TikTok script",
      "Email draft",
      "SMS draft",
      "Call script",
      "Canva brief",
      "Adobe Express brief",
      "Adobe Firefly prompt",
      "Brand Review",
      "Executive Summary",
      "CEO Final Approval",
    ],
    approval_status: "awaiting_ceo_approval",
    risk_level: "medium",
    expected_business_value: "Generate qualified seller leads by educating Oklahoma homeowners about inherited property decisions.",
    governance_notes: [
      "Primary URL: https://jcapitalpropertygroup.com/resources/inherited-property-oklahoma",
      "Awaiting CEO approval before any internal draft workflow begins.",
      "No publishing, outreach, provider execution, scraping, email, SMS, ads, or workflow automation is authorized.",
    ],
  };
}
