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
    title: "Inherited Property Oklahoma",
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
    approval_status: "approved",
    approved_by: "Moses Adebajo",
    approved_at: "manual-ceo-approval-required-before-real-use",
    risk_level: "medium",
    expected_business_value: "Generate qualified seller leads by educating Oklahoma homeowners about inherited property decisions.",
    governance_notes: ["Template directive for workflow capability validation.", "Real execution still requires current CEO approval and manual publishing."],
  };
}
