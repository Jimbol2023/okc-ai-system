import type { AiDepartmentName, CompanyGoal } from "@/lib/company-orchestrator";

export type DepartmentArtifactType =
  | "website_content_draft"
  | "gbp_post_draft"
  | "social_post_draft"
  | "youtube_description"
  | "email_campaign_draft"
  | "seo_handoff_recommendation"
  | "index_coverage_summary"
  | "broken_pages"
  | "missing_metadata"
  | "internal_linking_suggestions"
  | "content_opportunities"
  | "lead_priorities"
  | "follow_up_recommendations"
  | "pipeline_aging"
  | "acquisition_opportunities"
  | "daily_priorities"
  | "open_operational_issues"
  | "meeting_preparation"
  | "outstanding_approvals"
  | "revenue_snapshot"
  | "expenses"
  | "outstanding_invoices"
  | "cash_position_summary"
  | "connector_health"
  | "provider_readiness"
  | "oauth_status"
  | "secret_validation"
  | "expiring_credentials"
  | "audit_anomalies"
  | "compliance_reminders"
  | "policy_updates"
  | "required_document_reviews"
  | "new_lead_analysis"
  | "seller_opportunities"
  | "pipeline_ranking"
  | "follow_up_drafts"
  | "active_property_recommendations"
  | "buyer_follow_ups"
  | "marketing_status"
  | "department_work_item";

export type DepartmentArtifact = {
  title: string;
  body: string;
  messaging: string;
  cta: string;
  artifactType: DepartmentArtifactType;
  sourceConnectors: string[];
  sourceRecords: string[];
  assumptions: string[];
  confidence: number;
  executiveSummary: string;
};

export type DepartmentArtifactInput = {
  output: string;
  ownerDepartment: string;
  directiveTitle: string;
  businessGoal: string;
  expectedBusinessValue?: string | null;
  sourceLabel: string;
};

type ArtifactTemplate = {
  type: DepartmentArtifactType;
  title: string;
  sections: string[];
  connectors: string[];
  confidence: number;
};

const departmentTemplates: Partial<Record<AiDepartmentName, ArtifactTemplate[]>> = {
  "Marketing AI": [
    { type: "website_content_draft", title: "Website content draft", sections: ["Page objective", "Target seller intent", "Draft headline", "Proof points", "Approval notes"], connectors: ["google_analytics", "google_search_console", "google_business_profile"], confidence: 78 },
    { type: "gbp_post_draft", title: "GBP post draft", sections: ["Post angle", "Local trust signal", "Draft copy", "Image/asset note", "Manual publish checklist"], connectors: ["google_business_profile"], confidence: 76 },
    { type: "social_post_draft", title: "Social post draft", sections: ["Channel", "Hook", "Draft copy", "CTA", "Compliance review"], connectors: ["canva", "facebook_page", "instagram_business"], confidence: 74 },
    { type: "youtube_description", title: "YouTube description", sections: ["Video topic", "Description draft", "Local search terms", "Resource links", "Manual upload note"], connectors: ["youtube"], confidence: 72 },
    { type: "email_campaign_draft", title: "Email campaign draft", sections: ["Audience", "Subject line", "Body draft", "Personalization notes", "Send approval checklist"], connectors: ["gmail", "crm"], confidence: 73 },
  ],
  "SEO AI": [
    { type: "index_coverage_summary", title: "Index coverage summary", sections: ["Indexed pages", "Pages needing review", "Coverage gaps", "Recommended next crawl checks"], connectors: ["google_search_console"], confidence: 78 },
    { type: "broken_pages", title: "Broken pages", sections: ["Suspected broken URLs", "Impact", "Recommended redirects", "Owner"], connectors: ["google_search_console"], confidence: 70 },
    { type: "missing_metadata", title: "Missing metadata", sections: ["Page", "Missing field", "Suggested title/meta", "Priority"], connectors: ["google_search_console", "website"], confidence: 72 },
    { type: "internal_linking_suggestions", title: "Internal linking suggestions", sections: ["Source page", "Target page", "Anchor idea", "Reason"], connectors: ["website", "google_search_console"], confidence: 74 },
    { type: "content_opportunities", title: "Content opportunities", sections: ["Keyword/topic", "Search intent", "Draft angle", "Revenue relevance"], connectors: ["google_search_console", "google_analytics"], confidence: 76 },
  ],
  "Revenue AI": [
    { type: "lead_priorities", title: "Lead priorities", sections: ["High-priority leads", "Reason", "Next follow-up", "Risks"], connectors: ["crm", "lead_database"], confidence: 82 },
    { type: "follow_up_recommendations", title: "Follow-up recommendations", sections: ["Due follow-ups", "Suggested message angle", "Approval requirement", "Do-not-contact checks"], connectors: ["crm", "gmail"], confidence: 80 },
    { type: "pipeline_aging", title: "Pipeline aging", sections: ["Aging stage", "Lead count", "Revenue risk", "Recovery action"], connectors: ["crm", "lead_database"], confidence: 78 },
    { type: "acquisition_opportunities", title: "Acquisition opportunities", sections: ["Opportunity", "Value", "Evidence", "Next CEO decision"], connectors: ["lead_database", "crm"], confidence: 79 },
  ],
  "Operations AI": [
    { type: "daily_priorities", title: "Daily priorities", sections: ["Priority", "Owner", "Time block", "Dependency"], connectors: ["google_calendar", "crm"], confidence: 75 },
    { type: "open_operational_issues", title: "Open operational issues", sections: ["Issue", "Impact", "Blocker", "Recovery path"], connectors: ["crm", "google_drive"], confidence: 74 },
    { type: "meeting_preparation", title: "Meeting preparation", sections: ["Meeting", "Context", "Preparation notes", "Decision needed"], connectors: ["google_calendar", "google_drive"], confidence: 76 },
    { type: "outstanding_approvals", title: "Outstanding approvals", sections: ["Approval", "Owner", "Age", "Recommended decision path"], connectors: ["approval_center", "crm"], confidence: 80 },
  ],
  "Security & Governance AI": [
    { type: "connector_health", title: "Connector health", sections: ["Connector", "Health", "Last read", "Required fix"], connectors: ["connector_registry", "provider_readiness"], confidence: 84 },
    { type: "provider_readiness", title: "Provider readiness", sections: ["Provider", "Credential status", "Permissions", "Safe next action"], connectors: ["provider_readiness"], confidence: 82 },
    { type: "oauth_status", title: "OAuth status", sections: ["Provider", "Scope", "Authentication status", "Risk"], connectors: ["provider_readiness"], confidence: 78 },
    { type: "secret_validation", title: "Secret validation", sections: ["Secret group", "Status", "Risk", "Rotation note"], connectors: ["environment"], confidence: 77 },
    { type: "audit_anomalies", title: "Audit anomalies", sections: ["Signal", "Affected workflow", "Evidence", "Action"], connectors: ["audit_log"], confidence: 76 },
  ],
  "Lead Intelligence AI": [
    { type: "new_lead_analysis", title: "New lead analysis", sections: ["Lead", "Source", "Motivation signal", "Missing data", "Recommended route"], connectors: ["lead_database", "crm"], confidence: 79 },
    { type: "seller_opportunities", title: "Seller opportunities", sections: ["Seller segment", "Opportunity", "Risk", "Next draft"], connectors: ["lead_database"], confidence: 77 },
    { type: "pipeline_ranking", title: "Pipeline ranking", sections: ["Rank", "Lead", "Why now", "CEO decision needed"], connectors: ["crm"], confidence: 78 },
    { type: "follow_up_drafts", title: "Follow-up drafts", sections: ["Recipient segment", "Draft angle", "Approval checks", "No-send boundary"], connectors: ["crm", "gmail"], confidence: 76 },
  ],
  "Sales AI": [
    { type: "active_property_recommendations", title: "Active property recommendations", sections: ["Property", "Buyer fit", "Pricing/status", "Next disposition step"], connectors: ["buyer_database", "crm"], confidence: 77 },
    { type: "buyer_follow_ups", title: "Buyer follow-ups", sections: ["Buyer", "Relevant deal", "Draft follow-up angle", "Approval checks"], connectors: ["buyer_database", "gmail"], confidence: 76 },
    { type: "marketing_status", title: "Marketing status", sections: ["Property", "Channel", "Current status", "Recommended update"], connectors: ["crm", "marketing"], confidence: 74 },
  ],
  "Document Intelligence AI": [
    { type: "required_document_reviews", title: "Required document reviews", sections: ["Document", "Reason", "Review owner", "Completion criteria"], connectors: ["google_drive"], confidence: 76 },
    { type: "compliance_reminders", title: "Compliance reminders", sections: ["Reminder", "Scope", "Risk", "Required review"], connectors: ["policy_registry"], confidence: 75 },
  ],
  "Government & Policy AI": [
    { type: "policy_updates", title: "Policy updates", sections: ["Policy area", "Update", "Business impact", "Review required"], connectors: ["policy_registry"], confidence: 72 },
    { type: "compliance_reminders", title: "Compliance reminders", sections: ["Compliance area", "Reminder", "Evidence needed", "Owner"], connectors: ["policy_registry"], confidence: 74 },
  ],
};

const keywordTemplates: Array<[RegExp, ArtifactTemplate]> = [
  [/cash|finance|expense|invoice|revenue snapshot/i, { type: "cash_position_summary", title: "Cash position summary", sections: ["Revenue snapshot", "Expenses", "Outstanding invoices", "Cash position", "Read-only note"], connectors: ["finance_entries", "crm"], confidence: 76 }],
  [/legal|compliance|policy|document review/i, { type: "compliance_reminders", title: "Compliance reminders", sections: ["Compliance reminder", "Policy basis", "Required document review", "Approval note"], connectors: ["policy_registry", "google_drive"], confidence: 74 }],
  [/buyer|disposition/i, { type: "buyer_follow_ups", title: "Buyer follow-ups", sections: ["Buyer segment", "Property fit", "Draft follow-up", "Marketing status"], connectors: ["buyer_database", "crm"], confidence: 75 }],
];

function normalizeDepartment(department: string): AiDepartmentName | null {
  return department as AiDepartmentName;
}

function chooseTemplate(input: DepartmentArtifactInput): ArtifactTemplate {
  for (const [pattern, template] of keywordTemplates) {
    if (pattern.test(input.output)) return template;
  }

  const department = normalizeDepartment(input.ownerDepartment);
  const templates = department ? departmentTemplates[department] : undefined;
  if (!templates?.length) {
    return {
      type: "department_work_item",
      title: "Department work item",
      sections: ["Objective", "Evidence", "Draft output", "CEO review checklist"],
      connectors: ["internal_company_memory"],
      confidence: 70,
    };
  }

  const normalizedOutput = input.output.toLowerCase();
  return templates.find((template) => normalizedOutput.includes(template.type.replaceAll("_", " ").split(" ")[0])) ?? templates[0];
}

export function createDepartmentArtifact(input: DepartmentArtifactInput): DepartmentArtifact {
  const template = chooseTemplate(input);
  const sourceRecords = [`directive:${input.directiveTitle}`, `output:${input.output}`, `source:${input.sourceLabel}`];
  const sectionText = template.sections.map((section) => `- ${section}: Prepared from ${input.sourceLabel}; verify source records before final approval.`).join("\n");
  const body =
    `${template.title} for ${input.directiveTitle}\n\n` +
    `${sectionText}\n\n` +
    `Expected business value: ${input.expectedBusinessValue || "Improve executive decisions and reduce manual operating drag."}\n\n` +
    "Execution boundary: this is an internal CEO draft workspace artifact. It does not publish, send, scrape, mutate CRM records, spend ads, or call write providers.";

  return {
    title: `${template.title}: ${input.output}`,
    body,
    messaging: `${input.ownerDepartment} prepared ${template.title.toLowerCase()} for ${input.businessGoal as CompanyGoal}. CEO review is required before this can become an approved exact action.`,
    cta: "CEO review required. Approve only if this exact artifact should move to the next governed step.",
    artifactType: template.type,
    sourceConnectors: template.connectors,
    sourceRecords,
    assumptions: [
      "Artifact was generated from approved internal work and available read-only/internal source signals.",
      "Missing live connector data must be treated as a data gap, not a fabricated fact.",
      "Approval of this artifact does not authorize external execution.",
    ],
    confidence: template.confidence,
    executiveSummary: `${template.title} is ready for CEO review with ${template.connectors.length} source connector group(s). External execution remains blocked until separate approved execution.`,
  };
}
