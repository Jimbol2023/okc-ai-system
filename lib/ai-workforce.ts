import type { ConnectorActivationReport, ConnectorActivationReportItem } from "@/lib/connector-activation-report";
import { createConnectorActivationReport } from "@/lib/connector-activation-report";
import { getToolReadiness, listToolCapabilities, type ToolDefinition } from "@/lib/tool-capability-manager";

export type AiWorkforceReadinessStatus = "ready" | "partial" | "installed_but_idle" | "blocked";
export type AiWorkforceApprovalLevel =
  | "none_internal_only"
  | "manager_review"
  | "ceo_approval_required"
  | "external_action_prohibited";

export type AiWorkforceToolStatus = "ready" | "connected" | "missing" | "data_gap" | "readiness_only" | "blocked";

export type AiWorkforceToolRequirement = {
  toolKey: string;
  label: string;
  purpose: string;
  requiredForDailyWork: boolean;
  externalProvider: boolean;
  approvedUse: "internal_only" | "read_only" | "manual_only" | "blocked_external";
};

export type AiWorkforceResponsibilityMatrix = {
  primaryResponsibilities: string[];
  secondaryResponsibilities: string[];
  cannotDo: string[];
  handoffTo: string[];
  handoffTriggers: string[];
  requiredEvidenceBeforeWork: string[];
  approvalEscalationTrigger: string;
};

export type AiWorkforceDailyOperatingContract = {
  dailyInput: string[];
  dailyOutput: string[];
  successKpi: string[];
  handoffTarget: string[];
  approvalRule: string;
};

export type AiWorkforceEmployee = {
  id: string;
  name: string;
  department: AiWorkforceDepartmentName;
  manager: string;
  role: string;
  mission: string;
  dailyResponsibilities: string[];
  requiredTools: AiWorkforceToolRequirement[];
  kpisAffected: string[];
  approvalLevel: AiWorkforceApprovalLevel;
  outputTypes: string[];
  responsibilityMatrix: AiWorkforceResponsibilityMatrix;
  dailyOperatingContract: AiWorkforceDailyOperatingContract;
  revenueImpact: "high" | "medium" | "low";
  costReductionImpact: "high" | "medium" | "low";
};

export type AiWorkforceDepartmentName =
  | "CEO Office"
  | "AI COO"
  | "Lead Generation"
  | "Seller Acquisition"
  | "CRM"
  | "Marketing"
  | "Design"
  | "Content"
  | "SEO"
  | "Social Media"
  | "County Intelligence"
  | "Acquisitions"
  | "Finance"
  | "Operations"
  | "Knowledge / Memory"
  | "Approval / Safety";

export type AiWorkforceDepartment = {
  id: string;
  name: AiWorkforceDepartmentName;
  division: string;
  manager: string;
  mission: string;
  dailyResponsibilities: string[];
  kpisAffected: string[];
};

export type AiWorkforceToolReadiness = AiWorkforceToolRequirement & {
  status: AiWorkforceToolStatus;
  connected: boolean;
  missing: boolean;
  blocker: string | null;
  safeNextAction: string;
};

export type AiWorkforceEmployeeReadiness = AiWorkforceEmployee & {
  tools: AiWorkforceToolReadiness[];
  readinessStatus: AiWorkforceReadinessStatus;
  readinessPercent: number;
  blockers: string[];
  missingConnectors: string[];
  safeNextAction: string;
  canProduceInternalOutputToday: boolean;
  externalExecutionAllowed: false;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AiWorkforceDepartmentReadiness = AiWorkforceDepartment & {
  employees: AiWorkforceEmployeeReadiness[];
  readinessStatus: AiWorkforceReadinessStatus;
  readinessPercent: number;
  blockers: string[];
  missingConnectors: string[];
  safeNextAction: string;
  canProduceInternalOutputToday: boolean;
  providerCalled: false;
  liveExecutionAllowed: false;
};

export type AiWorkforceReport = {
  ok: true;
  company: "J Capital Property Group";
  generatedAt: string;
  divisions: string[];
  departments: AiWorkforceDepartmentReadiness[];
  employees: AiWorkforceEmployeeReadiness[];
  totals: {
    departments: number;
    employees: number;
    ready: number;
    partial: number;
    installedButIdle: number;
    blocked: number;
    internalOutputAvailableToday: number;
  };
  topMissingConnectors: string[];
  safeNextActions: string[];
  safety: {
    readOnly: true;
    providerCalled: false;
    liveExecutionAllowed: false;
    externalActionsBlocked: true;
    approvalRequiredForExternalActions: true;
    sendsBlocked: true;
    publishingBlocked: true;
    scrapingBlocked: true;
    smsBlocked: true;
    schedulingBlocked: true;
  };
};

const externalActionProhibitions = [
  "Send email, SMS, DM, or any external message.",
  "Publish, post, schedule, reply, advertise, scrape, call, or mutate an external provider.",
  "Invent property facts, seller facts, business metrics, reviews, testimonials, or legal conclusions.",
] as const;

const internalTools: Record<string, { label: string; purpose: string }> = {
  daily_mission: { label: "Daily Mission", purpose: "Read internal daily priorities and executive decisions." },
  company_orchestrator: { label: "Company Orchestrator", purpose: "Route internal department work through AI COO." },
  approval_queue: { label: "Approval Queue", purpose: "Track CEO review, approval state, and blocked execution." },
  ai_memory: { label: "AI Memory", purpose: "Read and write internal lessons and outcome memory." },
  knowledge_base: { label: "Knowledge Base", purpose: "Use approved internal knowledge items and source labels." },
  revenue_command_center: { label: "Revenue Command Center", purpose: "Read internal revenue, task, and lead priority signals." },
  lead_database: { label: "Lead Database", purpose: "Read stored leads and source attribution." },
  crm: { label: "CRM", purpose: "Read internal lead and pipeline state." },
  property_pipeline: { label: "Property Pipeline", purpose: "Read internal property pipeline and acquisition blockers." },
  finance_entries: { label: "Finance Entries", purpose: "Read internal revenue and expense entries." },
  connector_activation_report: { label: "Connector Activation Report", purpose: "Review connector data gaps and safe next actions." },
  provider_readiness: { label: "Provider Readiness", purpose: "Review provider readiness without starting OAuth or live calls." },
  manual_follow_up_task: { label: "Manual Follow-Up Task", purpose: "Prepare internal follow-up task drafts only." },
  manual_marketing_draft: { label: "Manual Marketing Draft", purpose: "Prepare internal marketing and social draft copy only." },
  manual_design_brief: { label: "Manual Design Brief", purpose: "Prepare internal design briefs only." },
};

function internalTool(toolKey: keyof typeof internalTools): AiWorkforceToolRequirement {
  return {
    toolKey,
    label: internalTools[toolKey].label,
    purpose: internalTools[toolKey].purpose,
    requiredForDailyWork: true,
    externalProvider: false,
    approvedUse: "internal_only",
  };
}

function providerTool(toolKey: string, label: string, purpose: string): AiWorkforceToolRequirement {
  return {
    toolKey,
    label,
    purpose,
    requiredForDailyWork: true,
    externalProvider: true,
    approvedUse: "read_only",
  };
}

function manualTool(toolKey: keyof typeof internalTools): AiWorkforceToolRequirement {
  return {
    ...internalTool(toolKey),
    approvedUse: "manual_only",
  };
}

function blockedExternalTool(toolKey: string, label: string, purpose: string): AiWorkforceToolRequirement {
  return {
    toolKey,
    label,
    purpose,
    requiredForDailyWork: true,
    externalProvider: true,
    approvedUse: "blocked_external",
  };
}

export const aiWorkforceDepartments: AiWorkforceDepartment[] = [
  {
    id: "ceo-office",
    name: "CEO Office",
    division: "Executive",
    manager: "CEO Executive Assistant AI",
    mission: "Keep the CEO focused on the highest-value decisions, blockers, and daily revenue priorities.",
    dailyResponsibilities: ["Prepare CEO decision context", "Summarize daily operating posture", "Escalate approval needs"],
    kpisAffected: ["CEO time saved", "approval cycle time", "daily revenue focus"],
  },
  {
    id: "ai-coo",
    name: "AI COO",
    division: "Executive",
    manager: "Company Orchestrator AI",
    mission: "Coordinate departments through internal-only assignments, handoffs, and blocker visibility.",
    dailyResponsibilities: ["Route work to departments", "Track blockers", "Keep external execution blocked"],
    kpisAffected: ["work order throughput", "blocked work reduction", "operating cadence"],
  },
  {
    id: "lead-generation",
    name: "Lead Generation",
    division: "Revenue",
    manager: "Lead Research Analyst AI",
    mission: "Identify and qualify safe, source-labeled lead opportunities.",
    dailyResponsibilities: ["Review inbound/internal lead signals", "Check source quality", "Flag missing lead data"],
    kpisAffected: ["new qualified leads", "source quality", "lead data completeness"],
  },
  {
    id: "seller-acquisition",
    name: "Seller Acquisition",
    division: "Revenue",
    manager: "Seller Lead Prioritization AI",
    mission: "Prioritize seller opportunities and prepare human-safe follow-up plans.",
    dailyResponsibilities: ["Rank sellers", "Prepare follow-up guidance", "Protect DNC and approval boundaries"],
    kpisAffected: ["seller follow-up velocity", "appointment readiness", "offer readiness"],
  },
  {
    id: "crm",
    name: "CRM",
    division: "Revenue",
    manager: "CRM Manager AI",
    mission: "Keep lead, pipeline, task, and source records clean enough for daily revenue work.",
    dailyResponsibilities: ["Review pipeline state", "Find duplicates and stale records", "Prepare internal CRM task candidates"],
    kpisAffected: ["CRM completeness", "follow-up due count", "pipeline movement"],
  },
  {
    id: "marketing",
    name: "Marketing",
    division: "Growth",
    manager: "Marketing Director AI",
    mission: "Turn approved signals into draft-only campaigns and manual publishing packages.",
    dailyResponsibilities: ["Plan campaigns", "Prepare drafts", "Coordinate attribution with CRM"],
    kpisAffected: ["campaign drafts ready", "lead-source attribution", "brand-safe content volume"],
  },
  {
    id: "design",
    name: "Design",
    division: "Growth",
    manager: "Creative Director AI",
    mission: "Prepare brand-safe internal creative briefs and asset requirements.",
    dailyResponsibilities: ["Create design briefs", "Check brand consistency", "Prepare Canva/manual asset handoff"],
    kpisAffected: ["asset readiness", "brand consistency", "creative turnaround"],
  },
  {
    id: "content",
    name: "Content",
    division: "Growth",
    manager: "Content Director AI",
    mission: "Plan source-labeled seller education and repurposing work without publishing.",
    dailyResponsibilities: ["Create content briefs", "Draft blog/video scripts", "Route review to SEO and compliance"],
    kpisAffected: ["content backlog", "seller education output", "reuse potential"],
  },
  {
    id: "seo",
    name: "SEO",
    division: "Growth",
    manager: "SEO Director AI",
    mission: "Turn search, local, and GBP signals into internal optimization recommendations.",
    dailyResponsibilities: ["Review search/local readiness", "Prepare SEO refresh tasks", "Surface GBP blockers"],
    kpisAffected: ["organic visibility", "local trust", "page improvement backlog"],
  },
  {
    id: "social-media",
    name: "Social Media",
    division: "Growth",
    manager: "Social Media Manager AI",
    mission: "Create platform-specific draft plans while preventing posting and scheduling.",
    dailyResponsibilities: ["Prepare channel drafts", "Track manual platform readiness", "Handoff claims for approval"],
    kpisAffected: ["social draft coverage", "manual channel readiness", "repurpose velocity"],
  },
  {
    id: "county-intelligence",
    name: "County Intelligence",
    division: "Property Intelligence",
    manager: "County Records Analyst AI",
    mission: "Prepare compliant county/property research tasks without scraping or ingestion.",
    dailyResponsibilities: ["Review county capability metadata", "Flag manual source needs", "Prepare property signal checklists"],
    kpisAffected: ["county source readiness", "property signal confidence", "manual review burden"],
  },
  {
    id: "acquisitions",
    name: "Acquisitions",
    division: "Revenue",
    manager: "Deal Analyst AI",
    mission: "Prepare deal analysis and offer recommendation context from verified internal facts.",
    dailyResponsibilities: ["Rank acquisition opportunities", "Prepare deal review packets", "List missing property facts"],
    kpisAffected: ["offer-ready leads", "deal review throughput", "missing property facts"],
  },
  {
    id: "finance",
    name: "Finance",
    division: "Operations",
    manager: "Revenue Analyst AI",
    mission: "Summarize revenue, ROI, and finance data gaps for better operating decisions.",
    dailyResponsibilities: ["Review finance entries", "Flag missing deal economics", "Prepare ROI notes"],
    kpisAffected: ["revenue visibility", "ROI confidence", "finance data completeness"],
  },
  {
    id: "operations",
    name: "Operations",
    division: "Operations",
    manager: "Connector Health Monitor AI",
    mission: "Monitor system, connector, and workflow blockers without changing infrastructure.",
    dailyResponsibilities: ["Review connector health", "Summarize system blockers", "Prepare safe next actions"],
    kpisAffected: ["connector readiness", "blocked system count", "operating uptime visibility"],
  },
  {
    id: "knowledge-memory",
    name: "Knowledge / Memory",
    division: "AI Core",
    manager: "Memory Curator AI",
    mission: "Preserve approved knowledge, lessons, and outcome memory for future recommendations.",
    dailyResponsibilities: ["Curate knowledge", "Record lessons", "Connect outcomes to tomorrow's priorities"],
    kpisAffected: ["memory quality", "repeat blocker reduction", "recommendation quality"],
  },
  {
    id: "approval-safety",
    name: "Approval / Safety",
    division: "Governance",
    manager: "Approval Gatekeeper AI",
    mission: "Keep approvals, compliance checks, and external execution prohibitions visible.",
    dailyResponsibilities: ["Review approval requirements", "Block unsafe actions", "Escalate compliance risks"],
    kpisAffected: ["approval safety", "compliance risk reduction", "external action prevention"],
  },
];

type EmployeeSeed = Omit<AiWorkforceEmployee, "responsibilityMatrix" | "dailyOperatingContract"> & {
  primary: string;
  secondary: string[];
  handoffTo: string[];
  evidence: string[];
};

function responsibility(seed: EmployeeSeed): AiWorkforceResponsibilityMatrix {
  return {
    primaryResponsibilities: [seed.primary],
    secondaryResponsibilities: seed.secondary,
    cannotDo: [...externalActionProhibitions],
    handoffTo: seed.handoffTo,
    handoffTriggers: [
      "Required evidence is missing or conflicts with existing records.",
      "The next step requires external execution or public-facing content.",
      "The work affects legal, compliance, seller contact, property facts, or spend decisions.",
    ],
    requiredEvidenceBeforeWork: seed.evidence,
    approvalEscalationTrigger: "Escalate to CEO approval before any external action, public output, seller contact, spend, or provider write.",
  };
}

function approvalRuleFor(level: AiWorkforceApprovalLevel) {
  if (level === "none_internal_only") return "Internal-only output may be produced; external execution remains prohibited.";
  if (level === "manager_review") return "Manager review is required before the work is used outside the department.";
  if (level === "ceo_approval_required") return "CEO approval is required before execution, spend, seller contact, or public use.";

  return "External action is prohibited; produce draft/checklist output only.";
}

function dailyOperatingContract(seed: EmployeeSeed): AiWorkforceDailyOperatingContract {
  return {
    dailyInput: [...seed.evidence],
    dailyOutput: [...seed.outputTypes],
    successKpi: [...seed.kpisAffected],
    handoffTarget: [...seed.handoffTo],
    approvalRule: approvalRuleFor(seed.approvalLevel),
  };
}

function employee(seed: EmployeeSeed): AiWorkforceEmployee {
  return {
    ...seed,
    responsibilityMatrix: responsibility(seed),
    dailyOperatingContract: dailyOperatingContract(seed),
  };
}

export const aiWorkforceEmployees: AiWorkforceEmployee[] = [
  employee({
    id: "ceo-executive-assistant",
    name: "CEO Executive Assistant AI",
    department: "CEO Office",
    manager: "CEO Executive Assistant AI",
    role: "Executive coordination manager",
    mission: "Prepare CEO decisions, approvals, and daily focus without taking external action.",
    dailyResponsibilities: ["Summarize CEO decisions", "Prioritize approvals", "Escalate blockers"],
    requiredTools: [internalTool("daily_mission"), internalTool("approval_queue"), internalTool("company_orchestrator")],
    kpisAffected: ["CEO time saved", "approval cycle time"],
    approvalLevel: "manager_review",
    outputTypes: ["CEO decision brief", "approval summary"],
    primary: "ceo_decision_coordination",
    secondary: ["daily agenda support", "approval context preparation"],
    handoffTo: ["Company Orchestrator AI", "Approval Gatekeeper AI"],
    evidence: ["Daily mission summary", "approval queue status", "source labels"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "daily-briefing-analyst",
    name: "Daily Briefing Analyst AI",
    department: "CEO Office",
    manager: "CEO Executive Assistant AI",
    role: "Morning intelligence analyst",
    mission: "Turn read-only business snapshots into a concise internal morning brief.",
    dailyResponsibilities: ["Review overnight summary", "Identify data gaps", "Prepare priorities"],
    requiredTools: [internalTool("daily_mission"), internalTool("connector_activation_report"), providerTool("gmail", "Gmail", "Read inbox metadata only")],
    kpisAffected: ["daily revenue focus", "data gap visibility"],
    approvalLevel: "none_internal_only",
    outputTypes: ["morning brief", "data gap summary"],
    primary: "daily_briefing_preparation",
    secondary: ["overnight signal review", "connector gap visibility"],
    handoffTo: ["Operations Coordinator AI", "CEO Executive Assistant AI"],
    evidence: ["Business snapshots", "connector health", "internal lead counts"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "company-orchestrator",
    name: "Company Orchestrator AI",
    department: "AI COO",
    manager: "Company Orchestrator AI",
    role: "AI COO manager",
    mission: "Assign internal work to departments and keep cross-functional handoffs clear.",
    dailyResponsibilities: ["Assign department work", "Track blockers", "Prepare draft queue handoffs"],
    requiredTools: [internalTool("company_orchestrator"), internalTool("daily_mission"), internalTool("approval_queue")],
    kpisAffected: ["work order throughput", "blocked work reduction"],
    approvalLevel: "manager_review",
    outputTypes: ["department assignment", "handoff note"],
    primary: "company_work_routing",
    secondary: ["cross-department blocker review", "draft queue coordination"],
    handoffTo: ["Operations Coordinator AI", "Approval Gatekeeper AI"],
    evidence: ["Executive directive", "department registry", "approval state"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "operations-coordinator",
    name: "Operations Coordinator AI",
    department: "AI COO",
    manager: "Company Orchestrator AI",
    role: "Operating cadence coordinator",
    mission: "Keep internal work moving through the daily operating cycle.",
    dailyResponsibilities: ["Review work blockers", "Prepare safe next actions", "Coordinate department handoffs"],
    requiredTools: [internalTool("company_orchestrator"), internalTool("connector_activation_report"), internalTool("ai_memory")],
    kpisAffected: ["operating cadence", "blocker aging"],
    approvalLevel: "manager_review",
    outputTypes: ["operations note", "blocker handoff"],
    primary: "operating_cadence_coordination",
    secondary: ["safe next action preparation", "handoff hygiene"],
    handoffTo: ["Connector Health Monitor AI", "System Blocker Analyst AI"],
    evidence: ["Work assignment status", "connector activation status", "memory lessons"],
    revenueImpact: "medium",
    costReductionImpact: "high",
  }),
  employee({
    id: "lead-research-analyst",
    name: "Lead Research Analyst AI",
    department: "Lead Generation",
    manager: "Lead Research Analyst AI",
    role: "Lead generation manager",
    mission: "Find and prepare internal lead research opportunities from safe sources.",
    dailyResponsibilities: ["Review stored leads", "Identify research gaps", "Prepare lead research tasks"],
    requiredTools: [internalTool("lead_database"), internalTool("revenue_command_center"), providerTool("gmail", "Gmail", "Read inbound metadata only")],
    kpisAffected: ["new qualified leads", "lead research backlog"],
    approvalLevel: "manager_review",
    outputTypes: ["lead research task", "lead gap note"],
    primary: "lead_research_task_preparation",
    secondary: ["inbound signal review", "manual source review"],
    handoffTo: ["Source Quality Analyst AI", "CRM Manager AI"],
    evidence: ["Lead source", "property address", "contact safety state"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "source-quality-analyst",
    name: "Source Quality Analyst AI",
    department: "Lead Generation",
    manager: "Lead Research Analyst AI",
    role: "Source quality specialist",
    mission: "Protect lead source attribution and confidence before revenue work begins.",
    dailyResponsibilities: ["Check source labels", "Flag unverified sources", "Prepare attribution fixes"],
    requiredTools: [internalTool("lead_database"), internalTool("crm"), internalTool("knowledge_base")],
    kpisAffected: ["source attribution completeness", "lead confidence"],
    approvalLevel: "none_internal_only",
    outputTypes: ["source quality note", "attribution fix task"],
    primary: "lead_source_quality_review",
    secondary: ["duplicate source detection", "provenance cleanup"],
    handoffTo: ["CRM Manager AI", "Pipeline Coordinator AI"],
    evidence: ["Source label", "campaign/source detail", "lead record"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "seller-lead-prioritization",
    name: "Seller Lead Prioritization AI",
    department: "Seller Acquisition",
    manager: "Seller Lead Prioritization AI",
    role: "Seller acquisition manager",
    mission: "Rank sellers for human review using internal lead and pipeline evidence.",
    dailyResponsibilities: ["Rank seller leads", "Identify motivation gaps", "Prepare acquisition priority notes"],
    requiredTools: [internalTool("revenue_command_center"), internalTool("lead_database"), internalTool("property_pipeline")],
    kpisAffected: ["seller priority accuracy", "appointment readiness"],
    approvalLevel: "manager_review",
    outputTypes: ["seller priority list", "acquisition review note"],
    primary: "seller_priority_ranking",
    secondary: ["motivation gap review", "property context review"],
    handoffTo: ["Follow-Up Coordinator AI", "Deal Analyst AI"],
    evidence: ["Lead score", "seller context", "DNC status", "pipeline status"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "follow-up-coordinator",
    name: "Follow-Up Coordinator AI",
    department: "Seller Acquisition",
    manager: "Seller Lead Prioritization AI",
    role: "Follow-up planning specialist",
    mission: "Prepare human-safe follow-up plans without contacting sellers.",
    dailyResponsibilities: ["Review follow-ups due", "Prepare message guidance", "Flag DNC/approval blockers"],
    requiredTools: [internalTool("manual_follow_up_task"), internalTool("crm"), blockedExternalTool("twilio", "Twilio", "SMS sending remains blocked")],
    kpisAffected: ["follow-up velocity", "seller response readiness"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["manual follow-up task", "seller script"],
    primary: "seller_follow_up_task_preparation",
    secondary: ["message guidance", "contact safety review"],
    handoffTo: ["Approval Gatekeeper AI", "CRM Manager AI"],
    evidence: ["DNC status", "last contact date", "seller context", "approval state"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "crm-manager",
    name: "CRM Manager AI",
    department: "CRM",
    manager: "CRM Manager AI",
    role: "CRM department manager",
    mission: "Keep the internal CRM work-ready for revenue operations.",
    dailyResponsibilities: ["Review lead status", "Identify stale records", "Prepare task candidates"],
    requiredTools: [internalTool("crm"), internalTool("lead_database"), internalTool("revenue_command_center")],
    kpisAffected: ["CRM hygiene", "task readiness"],
    approvalLevel: "manager_review",
    outputTypes: ["CRM hygiene summary", "internal task candidate"],
    primary: "crm_operating_state_review",
    secondary: ["lead status review", "task candidate preparation"],
    handoffTo: ["Data Quality Specialist AI", "Pipeline Coordinator AI"],
    evidence: ["Lead status", "follow-up date", "approval status"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "data-quality-specialist",
    name: "Data Quality Specialist AI",
    department: "CRM",
    manager: "CRM Manager AI",
    role: "CRM data quality specialist",
    mission: "Find missing and conflicting CRM fields before work is assigned.",
    dailyResponsibilities: ["Flag missing contact data", "Flag duplicate risk", "Prepare cleanup notes"],
    requiredTools: [internalTool("crm"), internalTool("lead_database"), internalTool("knowledge_base")],
    kpisAffected: ["data completeness", "duplicate reduction"],
    approvalLevel: "none_internal_only",
    outputTypes: ["data quality report", "cleanup checklist"],
    primary: "crm_data_quality_review",
    secondary: ["duplicate warning review", "missing field triage"],
    handoffTo: ["CRM Manager AI", "Source Quality Analyst AI"],
    evidence: ["Lead record", "source label", "required lead fields"],
    revenueImpact: "medium",
    costReductionImpact: "high",
  }),
  employee({
    id: "pipeline-coordinator",
    name: "Pipeline Coordinator AI",
    department: "CRM",
    manager: "CRM Manager AI",
    role: "Pipeline movement specialist",
    mission: "Coordinate pipeline state, next actions, and blockers across revenue work.",
    dailyResponsibilities: ["Review pipeline stage", "Prepare next-action notes", "Surface closing blockers"],
    requiredTools: [internalTool("property_pipeline"), internalTool("revenue_command_center"), internalTool("crm")],
    kpisAffected: ["pipeline movement", "blocked deal count"],
    approvalLevel: "manager_review",
    outputTypes: ["pipeline movement note", "blocker summary"],
    primary: "pipeline_next_action_coordination",
    secondary: ["closing blocker review", "stage consistency review"],
    handoffTo: ["Deal Analyst AI", "System Blocker Analyst AI"],
    evidence: ["Pipeline status", "next money action", "blocker list"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "marketing-director",
    name: "Marketing Director AI",
    department: "Marketing",
    manager: "Marketing Director AI",
    role: "Marketing department manager",
    mission: "Coordinate draft-only campaigns from revenue and brand signals.",
    dailyResponsibilities: ["Plan campaigns", "Review draft backlog", "Route work to content/design/approval"],
    requiredTools: [internalTool("manual_marketing_draft"), providerTool("google_analytics", "GA4", "Read analytics only"), internalTool("approval_queue")],
    kpisAffected: ["campaign readiness", "source attribution"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["campaign plan", "draft package"],
    primary: "marketing_campaign_coordination",
    secondary: ["draft backlog review", "channel planning"],
    handoffTo: ["Campaign Planner AI", "Approval Gatekeeper AI"],
    evidence: ["Lead source signals", "approved topic", "brand safety note"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "campaign-planner",
    name: "Campaign Planner AI",
    department: "Marketing",
    manager: "Marketing Director AI",
    role: "Campaign planning specialist",
    mission: "Prepare source-labeled campaign briefs for manual review.",
    dailyResponsibilities: ["Create campaign briefs", "Prepare channel notes", "Track manual attribution"],
    requiredTools: [internalTool("manual_marketing_draft"), internalTool("knowledge_base"), providerTool("google_search_console", "Search Console", "Read SEO demand only")],
    kpisAffected: ["campaign briefs ready", "qualified lead support"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["campaign brief", "manual attribution plan"],
    primary: "campaign_brief_preparation",
    secondary: ["channel recommendation", "manual attribution planning"],
    handoffTo: ["Content Director AI", "Creative Director AI"],
    evidence: ["Campaign source label", "target channel", "approved offer/category"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "email-marketing",
    name: "Email Marketing AI",
    department: "Marketing",
    manager: "Marketing Director AI",
    role: "Email draft specialist",
    mission: "Prepare internal email copy drafts without sending.",
    dailyResponsibilities: ["Draft educational email copy", "Flag consent requirements", "Prepare approval notes"],
    requiredTools: [internalTool("manual_marketing_draft"), providerTool("gmail", "Gmail", "Read-only context only")],
    kpisAffected: ["email draft readiness", "nurture preparation"],
    approvalLevel: "external_action_prohibited",
    outputTypes: ["email draft", "consent checklist"],
    primary: "email_draft_preparation",
    secondary: ["consent checklist", "nurture topic planning"],
    handoffTo: ["Compliance Reviewer AI", "Approval Gatekeeper AI"],
    evidence: ["Approved topic", "source label", "consent status"],
    revenueImpact: "medium",
    costReductionImpact: "medium",
  }),
  employee({
    id: "creative-director",
    name: "Creative Director AI",
    department: "Design",
    manager: "Creative Director AI",
    role: "Design department manager",
    mission: "Coordinate brand-safe creative direction for manual asset production.",
    dailyResponsibilities: ["Review creative needs", "Prepare design briefs", "Route brand checks"],
    requiredTools: [internalTool("manual_design_brief"), internalTool("knowledge_base"), internalTool("approval_queue")],
    kpisAffected: ["asset readiness", "brand consistency"],
    approvalLevel: "manager_review",
    outputTypes: ["creative brief", "brand review note"],
    primary: "creative_direction_coordination",
    secondary: ["brand-safe visual planning", "asset brief review"],
    handoffTo: ["Canva Designer AI", "Brand Asset Manager AI"],
    evidence: ["Campaign brief", "brand note", "approved copy"],
    revenueImpact: "medium",
    costReductionImpact: "medium",
  }),
  employee({
    id: "canva-designer",
    name: "Canva Designer AI",
    department: "Design",
    manager: "Creative Director AI",
    role: "Canva brief specialist",
    mission: "Prepare manual Canva design instructions without creating or exporting assets.",
    dailyResponsibilities: ["Prepare Canva briefs", "List copy blocks", "Flag asset approvals"],
    requiredTools: [manualTool("manual_design_brief"), providerTool("canva", "Canva", "Read design metadata only")],
    kpisAffected: ["design brief readiness", "creative turnaround"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["Canva design brief", "asset checklist"],
    primary: "canva_design_brief_preparation",
    secondary: ["copy block planning", "manual asset handoff"],
    handoffTo: ["Brand Asset Manager AI", "Approval Gatekeeper AI"],
    evidence: ["Approved copy", "target platform", "brand safety notes"],
    revenueImpact: "medium",
    costReductionImpact: "medium",
  }),
  employee({
    id: "brand-asset-manager",
    name: "Brand Asset Manager AI",
    department: "Design",
    manager: "Creative Director AI",
    role: "Brand asset governance specialist",
    mission: "Keep creative assets aligned with J Capital brand and source rules.",
    dailyResponsibilities: ["Review asset needs", "Flag unapproved imagery", "Prepare brand asset notes"],
    requiredTools: [internalTool("manual_design_brief"), internalTool("knowledge_base")],
    kpisAffected: ["brand consistency", "approval rework reduction"],
    approvalLevel: "manager_review",
    outputTypes: ["brand asset note", "asset approval checklist"],
    primary: "brand_asset_governance",
    secondary: ["approved image review", "brand consistency check"],
    handoffTo: ["Creative Director AI", "Compliance Reviewer AI"],
    evidence: ["Asset source", "brand usage context", "approval status"],
    revenueImpact: "medium",
    costReductionImpact: "medium",
  }),
  employee({
    id: "content-director",
    name: "Content Director AI",
    department: "Content",
    manager: "Content Director AI",
    role: "Content department manager",
    mission: "Coordinate source-labeled content planning and review-only draft production.",
    dailyResponsibilities: ["Prioritize topics", "Prepare content briefs", "Route SEO/compliance review"],
    requiredTools: [internalTool("knowledge_base"), internalTool("manual_marketing_draft"), providerTool("youtube", "YouTube", "Read channel metadata only")],
    kpisAffected: ["content backlog", "seller education output"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["content brief", "repurpose plan"],
    primary: "content_strategy_coordination",
    secondary: ["topic prioritization", "repurpose planning"],
    handoffTo: ["Blog Writer AI", "Video Script Writer AI"],
    evidence: ["Approved topic", "source label", "target audience"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "blog-writer",
    name: "Blog Writer AI",
    department: "Content",
    manager: "Content Director AI",
    role: "Blog draft specialist",
    mission: "Draft internal blog outlines and copy for approval review.",
    dailyResponsibilities: ["Prepare blog outlines", "Label assumptions", "Route factual claims to review"],
    requiredTools: [internalTool("knowledge_base"), internalTool("manual_marketing_draft"), providerTool("google_search_console", "Search Console", "Read SEO signals only")],
    kpisAffected: ["blog draft readiness", "organic lead support"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["blog outline", "draft article"],
    primary: "blog_draft_preparation",
    secondary: ["source-labeled outline", "CTA draft"],
    handoffTo: ["SEO Director AI", "Compliance Reviewer AI"],
    evidence: ["Approved source", "topic brief", "claim support"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "video-script-writer",
    name: "Video Script Writer AI",
    department: "Content",
    manager: "Content Director AI",
    role: "Video script specialist",
    mission: "Prepare educational video scripts and repurposing notes without uploading.",
    dailyResponsibilities: ["Draft scripts", "Prepare shot notes", "Route platform-specific repurpose ideas"],
    requiredTools: [internalTool("manual_marketing_draft"), providerTool("youtube", "YouTube", "Read channel metadata only")],
    kpisAffected: ["video script backlog", "content reuse"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["video script", "repurpose notes"],
    primary: "video_script_preparation",
    secondary: ["shot list planning", "short-form repurpose notes"],
    handoffTo: ["Social Media Manager AI", "Compliance Reviewer AI"],
    evidence: ["Approved content brief", "source label", "platform target"],
    revenueImpact: "medium",
    costReductionImpact: "medium",
  }),
  employee({
    id: "seo-director",
    name: "SEO Director AI",
    department: "SEO",
    manager: "SEO Director AI",
    role: "SEO department manager",
    mission: "Coordinate organic search and local SEO recommendations from read-only signals.",
    dailyResponsibilities: ["Review SEO gaps", "Prioritize page refreshes", "Route local SEO work"],
    requiredTools: [providerTool("google_search_console", "Search Console", "Read search data only"), providerTool("google_analytics", "GA4", "Read traffic only"), internalTool("knowledge_base")],
    kpisAffected: ["organic visibility", "seller page improvement"],
    approvalLevel: "manager_review",
    outputTypes: ["SEO task", "page refresh recommendation"],
    primary: "seo_priority_coordination",
    secondary: ["internal link planning", "search demand review"],
    handoffTo: ["Search Console Analyst AI", "Blog Writer AI"],
    evidence: ["Search Console signal", "page/topic", "source label"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "search-console-analyst",
    name: "Search Console Analyst AI",
    department: "SEO",
    manager: "SEO Director AI",
    role: "Search performance analyst",
    mission: "Translate Search Console read-only data into internal SEO work.",
    dailyResponsibilities: ["Review impressions/clicks", "Flag indexing gaps", "Prepare page recommendations"],
    requiredTools: [providerTool("google_search_console", "Search Console", "Read search data only"), internalTool("knowledge_base")],
    kpisAffected: ["search clicks", "index visibility"],
    approvalLevel: "none_internal_only",
    outputTypes: ["Search Console note", "SEO data gap"],
    primary: "search_console_signal_review",
    secondary: ["indexing gap review", "top page triage"],
    handoffTo: ["SEO Director AI", "Content Director AI"],
    evidence: ["GSC property", "query/page signal", "snapshot freshness"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "local-seo-gbp-specialist",
    name: "Local SEO / GBP Specialist AI",
    department: "SEO",
    manager: "SEO Director AI",
    role: "Local SEO and GBP specialist",
    mission: "Prepare local SEO and GBP trust tasks without posting or replying.",
    dailyResponsibilities: ["Review GBP readiness", "Prepare local SEO tasks", "Flag review/profile blockers"],
    requiredTools: [providerTool("google_business_profile", "Google Business Profile", "Read performance and reviews only"), internalTool("manual_marketing_draft")],
    kpisAffected: ["local trust", "GBP readiness"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["GBP draft task", "local SEO note"],
    primary: "local_seo_gbp_task_preparation",
    secondary: ["review signal review", "local trust checklist"],
    handoffTo: ["Approval Gatekeeper AI", "Marketing Director AI"],
    evidence: ["GBP location status", "review/profile signal", "approved local claim"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "social-media-manager",
    name: "Social Media Manager AI",
    department: "Social Media",
    manager: "Social Media Manager AI",
    role: "Social media department manager",
    mission: "Coordinate social drafts and platform handoffs without posting.",
    dailyResponsibilities: ["Review social draft needs", "Assign platform adaptations", "Route approval blockers"],
    requiredTools: [internalTool("manual_marketing_draft"), internalTool("approval_queue")],
    kpisAffected: ["social draft coverage", "repurpose velocity"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["social draft plan", "platform handoff"],
    primary: "social_draft_coordination",
    secondary: ["repurpose calendar planning", "platform readiness review"],
    handoffTo: ["Facebook Specialist AI", "Instagram Specialist AI", "LinkedIn Specialist AI", "TikTok Specialist AI"],
    evidence: ["Approved content brief", "target platform", "brand safety note"],
    revenueImpact: "medium",
    costReductionImpact: "medium",
  }),
  employee({
    id: "facebook-specialist",
    name: "Facebook Specialist AI",
    department: "Social Media",
    manager: "Social Media Manager AI",
    role: "Facebook draft specialist",
    mission: "Prepare Facebook-specific draft copy and manual posting checklist.",
    dailyResponsibilities: ["Adapt draft for Facebook", "Prepare manual checklist", "Flag claims"],
    requiredTools: [internalTool("manual_marketing_draft"), blockedExternalTool("facebook_business", "Facebook Business", "Posting remains blocked")],
    kpisAffected: ["Facebook draft readiness", "manual channel coverage"],
    approvalLevel: "external_action_prohibited",
    outputTypes: ["Facebook draft", "manual posting checklist"],
    primary: "facebook_draft_adaptation",
    secondary: ["manual posting checklist", "claim review handoff"],
    handoffTo: ["Compliance Reviewer AI", "Approval Gatekeeper AI"],
    evidence: ["Approved content", "source label", "platform copy limits"],
    revenueImpact: "medium",
    costReductionImpact: "low",
  }),
  employee({
    id: "instagram-specialist",
    name: "Instagram Specialist AI",
    department: "Social Media",
    manager: "Social Media Manager AI",
    role: "Instagram draft specialist",
    mission: "Prepare Instagram caption and visual brief without posting.",
    dailyResponsibilities: ["Adapt captions", "Prepare visual notes", "Route brand review"],
    requiredTools: [internalTool("manual_marketing_draft"), manualTool("manual_design_brief"), blockedExternalTool("instagram_business", "Instagram Business", "Posting remains blocked")],
    kpisAffected: ["Instagram draft readiness", "creative repurpose"],
    approvalLevel: "external_action_prohibited",
    outputTypes: ["Instagram caption", "visual brief"],
    primary: "instagram_caption_adaptation",
    secondary: ["visual brief handoff", "hashtag/CTA review"],
    handoffTo: ["Creative Director AI", "Compliance Reviewer AI"],
    evidence: ["Approved copy", "approved image source", "brand note"],
    revenueImpact: "medium",
    costReductionImpact: "low",
  }),
  employee({
    id: "linkedin-specialist",
    name: "LinkedIn Specialist AI",
    department: "Social Media",
    manager: "Social Media Manager AI",
    role: "LinkedIn draft specialist",
    mission: "Prepare LinkedIn company page drafts without using LinkedIn APIs.",
    dailyResponsibilities: ["Adapt professional post copy", "Prepare company page note", "Route approvals"],
    requiredTools: [internalTool("manual_marketing_draft"), providerTool("linkedin_company_page", "LinkedIn Company Page", "Planning metadata only")],
    kpisAffected: ["LinkedIn draft readiness", "professional trust"],
    approvalLevel: "external_action_prohibited",
    outputTypes: ["LinkedIn post draft", "company page note"],
    primary: "linkedin_company_post_adaptation",
    secondary: ["professional tone review", "manual company page checklist"],
    handoffTo: ["Approval Gatekeeper AI", "Compliance Reviewer AI"],
    evidence: ["Approved content", "source label", "company page context"],
    revenueImpact: "medium",
    costReductionImpact: "low",
  }),
  employee({
    id: "tiktok-specialist",
    name: "TikTok Specialist AI",
    department: "Social Media",
    manager: "Social Media Manager AI",
    role: "TikTok draft specialist",
    mission: "Prepare short-form script ideas without platform access or posting.",
    dailyResponsibilities: ["Create short-form script angles", "Flag claims", "Route video handoff"],
    requiredTools: [internalTool("manual_marketing_draft"), blockedExternalTool("tiktok_business", "TikTok", "Connector missing and posting blocked")],
    kpisAffected: ["short-form idea backlog", "repurpose coverage"],
    approvalLevel: "external_action_prohibited",
    outputTypes: ["TikTok script idea", "short-form checklist"],
    primary: "tiktok_script_angle_preparation",
    secondary: ["short-form hook planning", "video handoff"],
    handoffTo: ["Video Script Writer AI", "Compliance Reviewer AI"],
    evidence: ["Approved topic", "source label", "claim support"],
    revenueImpact: "low",
    costReductionImpact: "low",
  }),
  employee({
    id: "county-records-analyst",
    name: "County Records Analyst AI",
    department: "County Intelligence",
    manager: "County Records Analyst AI",
    role: "County intelligence manager",
    mission: "Prepare manual county source review plans without scraping or ingestion.",
    dailyResponsibilities: ["Review county capability", "Prepare manual source checklist", "Flag legal/title review needs"],
    requiredTools: [providerTool("county_assessor", "County Assessor Records", "Manual/public source review only"), internalTool("knowledge_base")],
    kpisAffected: ["county source readiness", "property source confidence"],
    approvalLevel: "manager_review",
    outputTypes: ["county source checklist", "manual research plan"],
    primary: "county_source_review_planning",
    secondary: ["manual source checklist", "county capability review"],
    handoffTo: ["Property Signal Analyst AI", "Compliance Reviewer AI"],
    evidence: ["County name", "source format", "manual verification note"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "property-signal-analyst",
    name: "Property Signal Analyst AI",
    department: "County Intelligence",
    manager: "County Records Analyst AI",
    role: "Property signal specialist",
    mission: "Prepare property signal summaries from verified internal/manual data only.",
    dailyResponsibilities: ["Review property signal gaps", "Prepare verification checklist", "Flag missing facts"],
    requiredTools: [internalTool("property_pipeline"), providerTool("county_assessor", "County Assessor Records", "Manual/public source review only"), blockedExternalTool("attom", "ATTOM", "Commercial data not activated")],
    kpisAffected: ["property signal confidence", "missing property facts"],
    approvalLevel: "manager_review",
    outputTypes: ["property signal note", "verification checklist"],
    primary: "property_signal_verification_planning",
    secondary: ["property fact gap review", "manual verification handoff"],
    handoffTo: ["Deal Analyst AI", "Compliance Reviewer AI"],
    evidence: ["Property address", "source label", "manual verification status"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "deal-analyst",
    name: "Deal Analyst AI",
    department: "Acquisitions",
    manager: "Deal Analyst AI",
    role: "Acquisitions manager",
    mission: "Prepare acquisition review packets from verified lead and property facts.",
    dailyResponsibilities: ["Rank deals", "List missing facts", "Prepare analysis packets"],
    requiredTools: [internalTool("property_pipeline"), internalTool("revenue_command_center"), internalTool("crm")],
    kpisAffected: ["offer-ready leads", "deal review throughput"],
    approvalLevel: "manager_review",
    outputTypes: ["deal review packet", "missing facts checklist"],
    primary: "deal_review_packet_preparation",
    secondary: ["deal ranking", "missing data checklist"],
    handoffTo: ["Offer Recommendation AI", "Compliance Reviewer AI"],
    evidence: ["Lead record", "property facts", "source labels", "analysis assumptions"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "offer-recommendation",
    name: "Offer Recommendation AI",
    department: "Acquisitions",
    manager: "Deal Analyst AI",
    role: "Offer support specialist",
    mission: "Prepare internal offer recommendation context without presenting offers.",
    dailyResponsibilities: ["Review offer assumptions", "Flag legal/title requirements", "Prepare offer readiness notes"],
    requiredTools: [internalTool("property_pipeline"), internalTool("knowledge_base"), internalTool("approval_queue")],
    kpisAffected: ["offer readiness", "risk reduction"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["offer readiness note", "approval packet"],
    primary: "offer_context_preparation",
    secondary: ["risk assumption review", "approval packet support"],
    handoffTo: ["Approval Gatekeeper AI", "Compliance Reviewer AI"],
    evidence: ["Verified ARV/repairs if available", "seller context", "legal/title warning"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "revenue-analyst",
    name: "Revenue Analyst AI",
    department: "Finance",
    manager: "Revenue Analyst AI",
    role: "Finance department manager",
    mission: "Summarize revenue visibility and finance gaps from internal records.",
    dailyResponsibilities: ["Review revenue entries", "Summarize pipeline value", "Flag finance gaps"],
    requiredTools: [internalTool("finance_entries"), internalTool("revenue_command_center"), internalTool("property_pipeline")],
    kpisAffected: ["revenue visibility", "pipeline value confidence"],
    approvalLevel: "none_internal_only",
    outputTypes: ["revenue summary", "finance data gap"],
    primary: "revenue_visibility_summary",
    secondary: ["pipeline value summary", "finance gap review"],
    handoffTo: ["ROI Analyst AI", "CEO Executive Assistant AI"],
    evidence: ["Finance entry", "pipeline summary", "deal reference"],
    revenueImpact: "high",
    costReductionImpact: "medium",
  }),
  employee({
    id: "roi-analyst",
    name: "ROI Analyst AI",
    department: "Finance",
    manager: "Revenue Analyst AI",
    role: "ROI analysis specialist",
    mission: "Prepare ROI notes and missing cost/revenue data requirements.",
    dailyResponsibilities: ["Review campaign/deal economics", "Flag missing cost data", "Prepare ROI assumptions"],
    requiredTools: [internalTool("finance_entries"), internalTool("manual_marketing_draft"), internalTool("crm")],
    kpisAffected: ["ROI confidence", "cost visibility"],
    approvalLevel: "manager_review",
    outputTypes: ["ROI note", "cost data checklist"],
    primary: "roi_assumption_review",
    secondary: ["cost gap analysis", "campaign ROI preparation"],
    handoffTo: ["Marketing Director AI", "Revenue Analyst AI"],
    evidence: ["Cost entry", "lead source", "campaign/deal reference"],
    revenueImpact: "medium",
    costReductionImpact: "high",
  }),
  employee({
    id: "connector-health-monitor",
    name: "Connector Health Monitor AI",
    department: "Operations",
    manager: "Connector Health Monitor AI",
    role: "Operations manager",
    mission: "Monitor connector readiness and data gaps without starting live actions.",
    dailyResponsibilities: ["Review connector activation", "Rank missing connectors", "Prepare safe next actions"],
    requiredTools: [internalTool("connector_activation_report"), internalTool("provider_readiness"), internalTool("daily_mission")],
    kpisAffected: ["connector readiness", "data freshness"],
    approvalLevel: "none_internal_only",
    outputTypes: ["connector status report", "safe next action"],
    primary: "connector_readiness_monitoring",
    secondary: ["data gap ranking", "feature flag visibility"],
    handoffTo: ["System Blocker Analyst AI", "CEO Executive Assistant AI"],
    evidence: ["Connector activation report", "provider readiness report", "daily mission connector health"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "system-blocker-analyst",
    name: "System Blocker Analyst AI",
    department: "Operations",
    manager: "Connector Health Monitor AI",
    role: "System blocker specialist",
    mission: "Turn system, workflow, and data blockers into internal safe next actions.",
    dailyResponsibilities: ["Review blocker list", "Prepare recovery paths", "Escalate production/deploy restrictions"],
    requiredTools: [internalTool("connector_activation_report"), internalTool("ai_memory"), internalTool("approval_queue")],
    kpisAffected: ["blocked work reduction", "operating reliability"],
    approvalLevel: "manager_review",
    outputTypes: ["blocker report", "recovery plan"],
    primary: "system_blocker_triage",
    secondary: ["recovery path planning", "deployment restriction visibility"],
    handoffTo: ["Operations Coordinator AI", "Approval Gatekeeper AI"],
    evidence: ["Blocker source", "affected department", "safe next action"],
    revenueImpact: "medium",
    costReductionImpact: "high",
  }),
  employee({
    id: "memory-curator",
    name: "Memory Curator AI",
    department: "Knowledge / Memory",
    manager: "Memory Curator AI",
    role: "Knowledge and memory manager",
    mission: "Maintain approved knowledge and memory for future recommendations.",
    dailyResponsibilities: ["Review memory events", "Curate knowledge items", "Flag stale lessons"],
    requiredTools: [internalTool("ai_memory"), internalTool("knowledge_base")],
    kpisAffected: ["memory quality", "recommendation quality"],
    approvalLevel: "none_internal_only",
    outputTypes: ["memory curation note", "knowledge gap"],
    primary: "memory_curation",
    secondary: ["knowledge freshness review", "source label hygiene"],
    handoffTo: ["Lessons Learned Analyst AI", "Content Director AI"],
    evidence: ["Memory event", "knowledge item", "outcome/source label"],
    revenueImpact: "medium",
    costReductionImpact: "high",
  }),
  employee({
    id: "lessons-learned-analyst",
    name: "Lessons Learned Analyst AI",
    department: "Knowledge / Memory",
    manager: "Memory Curator AI",
    role: "Outcome learning specialist",
    mission: "Translate completed or blocked work into tomorrow's internal recommendations.",
    dailyResponsibilities: ["Review outcomes", "Summarize lessons", "Prepare next-day recommendation inputs"],
    requiredTools: [internalTool("ai_memory"), internalTool("daily_mission"), internalTool("company_orchestrator")],
    kpisAffected: ["repeat blocker reduction", "daily recommendation quality"],
    approvalLevel: "none_internal_only",
    outputTypes: ["lesson summary", "next-day recommendation"],
    primary: "lessons_learned_analysis",
    secondary: ["outcome pattern review", "next-day input preparation"],
    handoffTo: ["Company Orchestrator AI", "CEO Executive Assistant AI"],
    evidence: ["Completed task outcome", "blocker reason", "source labels"],
    revenueImpact: "medium",
    costReductionImpact: "high",
  }),
  employee({
    id: "approval-gatekeeper",
    name: "Approval Gatekeeper AI",
    department: "Approval / Safety",
    manager: "Approval Gatekeeper AI",
    role: "Approval and safety manager",
    mission: "Ensure every risky or external action remains blocked until exact approval exists.",
    dailyResponsibilities: ["Review approval queue", "Block unsafe actions", "Prepare CEO approval packets"],
    requiredTools: [internalTool("approval_queue"), internalTool("company_orchestrator"), internalTool("ai_memory")],
    kpisAffected: ["approval safety", "external action prevention"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["approval packet", "blocked action notice"],
    primary: "approval_gatekeeping",
    secondary: ["exact-action approval review", "execution boundary enforcement"],
    handoffTo: ["Compliance Reviewer AI", "CEO Executive Assistant AI"],
    evidence: ["Approval item", "risk level", "required approvals", "safety flags"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
  employee({
    id: "compliance-reviewer",
    name: "Compliance Reviewer AI",
    department: "Approval / Safety",
    manager: "Approval Gatekeeper AI",
    role: "Compliance and claim review specialist",
    mission: "Review claims, contact safety, property fact risk, and platform policy risk before approval.",
    dailyResponsibilities: ["Review claim support", "Flag legal/platform risk", "Prepare compliance notes"],
    requiredTools: [internalTool("knowledge_base"), internalTool("approval_queue"), internalTool("ai_memory")],
    kpisAffected: ["compliance risk reduction", "brand trust"],
    approvalLevel: "ceo_approval_required",
    outputTypes: ["compliance note", "claim review checklist"],
    primary: "compliance_claim_review",
    secondary: ["contact safety review", "platform policy review"],
    handoffTo: ["Approval Gatekeeper AI", "CEO Executive Assistant AI"],
    evidence: ["Source support", "claim text", "platform/action context"],
    revenueImpact: "high",
    costReductionImpact: "high",
  }),
];

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function connectorById(report: ConnectorActivationReport | null) {
  return new Map((report?.connectors ?? []).map((connector) => [connector.connectorId, connector]));
}

function toolById() {
  return new Map(listToolCapabilities().map((tool) => [tool.toolKey, tool]));
}

function statusFromConnector(connector: ConnectorActivationReportItem): Pick<AiWorkforceToolReadiness, "status" | "connected" | "missing" | "blocker" | "safeNextAction"> {
  if (connector.status === "connected" || connector.status === "internal_ready") {
    return {
      status: connector.status === "connected" ? "connected" : "ready",
      connected: true,
      missing: false,
      blocker: null,
      safeNextAction: connector.nextRevenueAction,
    };
  }

  const status: AiWorkforceToolStatus =
    connector.status === "credentials_missing"
      ? "missing"
      : connector.status === "data_gap" || connector.status === "incomplete"
        ? "data_gap"
        : "readiness_only";

  return {
    status,
    connected: false,
    missing: status === "missing" || status === "data_gap",
    blocker: connector.blockingRevenueData[0] ?? connector.lastFailure ?? connector.nextRequiredAction,
    safeNextAction: connector.nextRequiredAction,
  };
}

function statusFromTool(tool: ToolDefinition): Pick<AiWorkforceToolReadiness, "status" | "connected" | "missing" | "blocker" | "safeNextAction"> {
  if (tool.healthStatus === "healthy") {
    return {
      status: "ready",
      connected: true,
      missing: false,
      blocker: null,
      safeNextAction: "Use for internal-only output; keep external execution blocked.",
    };
  }

  if (tool.healthStatus === "readiness_only") {
    return {
      status: "readiness_only",
      connected: false,
      missing: false,
      blocker: "Tool is registered for readiness or manual planning only.",
      safeNextAction: tool.retryPolicy,
    };
  }

  return {
    status: "blocked",
    connected: false,
    missing: true,
    blocker: `${tool.name} is ${tool.healthStatus}.`,
    safeNextAction: tool.retryPolicy,
  };
}

function assessTool(
  requirement: AiWorkforceToolRequirement,
  connectors: Map<string, ConnectorActivationReportItem>,
  tools: Map<string, ToolDefinition>,
): AiWorkforceToolReadiness {
  const internal = internalTools[requirement.toolKey];
  if (internal && !requirement.externalProvider) {
    return {
      ...requirement,
      status: "ready",
      connected: true,
      missing: false,
      blocker: null,
      safeNextAction: "Use for internal-only output today.",
    };
  }

  const connector = connectors.get(requirement.toolKey);
  const tool = tools.get(requirement.toolKey) ?? getToolReadiness(requirement.toolKey);
  const assessment = connector ? statusFromConnector(connector) : tool ? statusFromTool(tool) : {
    status: "missing" as const,
    connected: false,
    missing: true,
    blocker: `${requirement.label} is not registered as an active internal tool or connector.`,
    safeNextAction: `Register or configure ${requirement.label} for read-only/internal use before assigning daily work.`,
  };

  if (requirement.approvedUse === "blocked_external") {
    return {
      ...requirement,
      ...assessment,
      status: assessment.status === "ready" || assessment.status === "connected" ? "readiness_only" : assessment.status,
      connected: false,
      blocker: assessment.blocker ?? `${requirement.label} is intentionally blocked for external execution in Sprint 0.`,
      safeNextAction: "Prepare internal draft/checklist only; do not execute externally.",
    };
  }

  return {
    ...requirement,
    ...assessment,
  };
}

function statusForEmployee(percent: number, tools: AiWorkforceToolReadiness[], canProduceInternalOutputToday: boolean): AiWorkforceReadinessStatus {
  const blocked = tools.filter((tool) => tool.status === "blocked").length;
  const missing = tools.filter((tool) => tool.status === "missing" || tool.status === "data_gap").length;
  const idle = tools.filter((tool) => tool.status === "readiness_only").length;

  if (blocked > 0 && !canProduceInternalOutputToday) return "blocked";
  if (missing === 0 && idle === 0 && blocked === 0 && percent >= 85) return "ready";
  if (canProduceInternalOutputToday && percent >= 50) return "partial";
  if (idle > 0 || missing > 0) return "installed_but_idle";

  return "blocked";
}

function employeeReadiness(
  employeeRecord: AiWorkforceEmployee,
  connectors: Map<string, ConnectorActivationReportItem>,
  tools: Map<string, ToolDefinition>,
): AiWorkforceEmployeeReadiness {
  const assessedTools = employeeRecord.requiredTools.map((tool) => assessTool(tool, connectors, tools));
  const missingTools = assessedTools.filter((tool) => tool.missing || tool.status === "readiness_only");
  const blockedTools = assessedTools.filter((tool) => tool.status === "blocked");
  const readyTools = assessedTools.filter((tool) => tool.status === "ready" || tool.status === "connected");
  const hasInternalReadyTool = readyTools.some((tool) => !tool.externalProvider || tool.approvedUse === "manual_only" || tool.approvedUse === "internal_only");
  const canProduceInternalOutputToday = hasInternalReadyTool && employeeRecord.outputTypes.length > 0;
  const readinessPercent = clampPercent(100 - missingTools.length * 16 - blockedTools.length * 20 - (canProduceInternalOutputToday ? 0 : 18));
  const readinessStatus = statusForEmployee(readinessPercent, assessedTools, canProduceInternalOutputToday);
  const blockers = assessedTools.map((tool) => tool.blocker).filter((blocker): blocker is string => Boolean(blocker));
  const missingConnectors = missingTools.map((tool) => tool.label);
  const safeNextAction =
    blockers[0] ??
    (canProduceInternalOutputToday
      ? "Produce internal-only output today and keep external execution blocked."
      : "Assign an internal fallback tool or resolve the missing connector before daily work.");

  return {
    ...employeeRecord,
    tools: assessedTools,
    readinessStatus,
    readinessPercent,
    blockers,
    missingConnectors,
    safeNextAction,
    canProduceInternalOutputToday,
    externalExecutionAllowed: false,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

function departmentReadiness(
  department: AiWorkforceDepartment,
  employees: AiWorkforceEmployeeReadiness[],
): AiWorkforceDepartmentReadiness {
  const departmentEmployees = employees.filter((employeeItem) => employeeItem.department === department.name);
  const readinessPercent = clampPercent(
    departmentEmployees.length === 0
      ? 0
      : departmentEmployees.reduce((sum, employeeItem) => sum + employeeItem.readinessPercent, 0) / departmentEmployees.length,
  );
  const statusCounts = new Map<AiWorkforceReadinessStatus, number>();
  for (const employeeItem of departmentEmployees) {
    statusCounts.set(employeeItem.readinessStatus, (statusCounts.get(employeeItem.readinessStatus) ?? 0) + 1);
  }
  const readinessStatus: AiWorkforceReadinessStatus =
    (statusCounts.get("blocked") ?? 0) === departmentEmployees.length
      ? "blocked"
      : (statusCounts.get("ready") ?? 0) === departmentEmployees.length
        ? "ready"
        : (statusCounts.get("installed_but_idle") ?? 0) > 0
          ? "installed_but_idle"
          : "partial";
  const blockers = [...new Set(departmentEmployees.flatMap((employeeItem) => employeeItem.blockers))];
  const missingConnectors = [...new Set(departmentEmployees.flatMap((employeeItem) => employeeItem.missingConnectors))];

  return {
    ...department,
    employees: departmentEmployees,
    readinessStatus,
    readinessPercent,
    blockers,
    missingConnectors,
    safeNextAction: blockers[0] ?? "Use ready employees for internal-only output and keep external execution blocked.",
    canProduceInternalOutputToday: departmentEmployees.some((employeeItem) => employeeItem.canProduceInternalOutputToday),
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function createAiWorkforceReportFromInputs(input: {
  connectorActivationReport?: ConnectorActivationReport | null;
  generatedAt?: string;
} = {}): AiWorkforceReport {
  const connectors = connectorById(input.connectorActivationReport ?? null);
  const tools = toolById();
  const generatedAt = input.generatedAt ?? new Date().toISOString();
  const employees = aiWorkforceEmployees.map((employeeItem) => employeeReadiness(employeeItem, connectors, tools));
  const departments = aiWorkforceDepartments.map((department) => departmentReadiness(department, employees));
  const topMissingConnectors = [...new Set(employees.flatMap((employeeItem) => employeeItem.missingConnectors))]
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 12);
  const safeNextActions = [...new Set(departments.map((department) => `${department.name}: ${department.safeNextAction}`))];

  return {
    ok: true,
    company: "J Capital Property Group",
    generatedAt,
    divisions: [...new Set(aiWorkforceDepartments.map((department) => department.division))],
    departments,
    employees,
    totals: {
      departments: departments.length,
      employees: employees.length,
      ready: employees.filter((employeeItem) => employeeItem.readinessStatus === "ready").length,
      partial: employees.filter((employeeItem) => employeeItem.readinessStatus === "partial").length,
      installedButIdle: employees.filter((employeeItem) => employeeItem.readinessStatus === "installed_but_idle").length,
      blocked: employees.filter((employeeItem) => employeeItem.readinessStatus === "blocked").length,
      internalOutputAvailableToday: employees.filter((employeeItem) => employeeItem.canProduceInternalOutputToday).length,
    },
    topMissingConnectors,
    safeNextActions,
    safety: {
      readOnly: true,
      providerCalled: false,
      liveExecutionAllowed: false,
      externalActionsBlocked: true,
      approvalRequiredForExternalActions: true,
      sendsBlocked: true,
      publishingBlocked: true,
      scrapingBlocked: true,
      smsBlocked: true,
      schedulingBlocked: true,
    },
  };
}

export async function createAiWorkforceReport(): Promise<AiWorkforceReport> {
  const connectorActivationReport = await createConnectorActivationReport().catch(() => null);

  return createAiWorkforceReportFromInputs({ connectorActivationReport });
}
