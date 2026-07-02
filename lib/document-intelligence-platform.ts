import { evaluateConnectorAction, type ConnectorExecutionPlan } from "@/lib/connector-platform";
import { evaluateAiSecurityEvent, type AiSecurityDecision } from "@/lib/enterprise-security-platform";
import { classifyFeatureArchitecture, type FeatureArchitectureReview } from "@/lib/modular-architecture-standard";
import { evaluateSafeAutomation, type AutomationDecision } from "@/lib/safe-auto-mode";

export type DocumentWorkflowType =
  | "generate_document"
  | "understand_document"
  | "classify_document"
  | "extract_structured_data"
  | "transform_document"
  | "document_search"
  | "document_qa"
  | "productivity_workflow";

export type DocumentSuite = "microsoft_365" | "google_workspace" | "canva" | "adobe" | "internal";

export type DocumentType =
  | "contract"
  | "proposal"
  | "investor_deck"
  | "sales_deck"
  | "financial_model"
  | "marketing_report"
  | "business_plan"
  | "product_catalog"
  | "email_draft"
  | "spreadsheet"
  | "presentation"
  | "pdf"
  | "knowledge_document";

export type DocumentWorkflowReviewInput = {
  workflowType: DocumentWorkflowType;
  businessModule?: string;
  documentType: DocumentType;
  templateKey?: string;
  sourceRecordLabels: string[];
  targetSuite?: DocumentSuite;
  connectorKeys?: string[];
  requestedTransformations?: string[];
  externalActionIntent?: string;
  containsSensitiveData?: boolean;
};

export type DocumentWorkflowReview = {
  ok: true;
  platform: "Document Intelligence Platform";
  architecture: FeatureArchitectureReview;
  workflowPlan: string[];
  templateRequirements: string[];
  approvalRequirements: string[];
  governanceNotes: string[];
  sourceRecordLabels: string[];
  assumptions: string[];
  safeAutoDecision: AutomationDecision;
  securityDecision: AiSecurityDecision;
  connectorPlans: ConnectorExecutionPlan[];
  auditRequired: true;
  providerCalled: false;
  liveExecutionAllowed: false;
  externalActionsBlocked: true;
};

export const productivityConnectorFamilies = [
  {
    suite: "microsoft_365",
    connectors: ["word", "excel", "powerpoint", "outlook", "onedrive", "sharepoint", "teams"],
    defaultMode: "readiness_only",
  },
  {
    suite: "google_workspace",
    connectors: ["google_docs", "google_sheets", "google_slides", "gmail", "google_drive", "google_calendar", "google_forms"],
    defaultMode: "readiness_only",
  },
  {
    suite: "creative_documents",
    connectors: ["canva", "adobe_express", "adobe_acrobat", "adobe_creative_cloud"],
    defaultMode: "readiness_only",
  },
] as const;

export const documentIntelligenceCapabilities = [
  "document_generation",
  "document_understanding",
  "document_classification",
  "structured_data_extraction",
  "document_transformation",
  "template_variable_mapping",
  "crm_revenue_spine_linking",
  "semantic_document_search_readiness",
  "document_qa_readiness",
  "approval_gated_productivity_workflows",
] as const;

export const documentSafetyRules = [
  "No document may be sent, published, emailed, exported, or publicly shared without governed approval.",
  "No contracts, offers, legal, tax, financial, healthcare, or regulated documents may be treated as professional advice.",
  "Generated documents must preserve source labels, assumptions, template version, and review status.",
  "Connector writes, public file sharing, email sending, and calendar actions remain blocked by default.",
  "Sensitive documents require security review, least-privilege access, audit logging, and retention controls.",
] as const;

function workflowPlanFor(input: DocumentWorkflowReviewInput) {
  return [
    `Prepare ${input.workflowType.replaceAll("_", " ")} workflow for ${input.documentType.replaceAll("_", " ")}.`,
    "Map source records and template variables before generating or transforming content.",
    "Link document output to CRM, Revenue Engine, Knowledge Base, or Business Module records when approved.",
    "Route draft through approval workflow before external sharing or connector write.",
    "Keep Microsoft, Google, Canva, and Adobe work as readiness/planning unless future connector policy authorizes execution.",
  ];
}

export function createDocumentIntelligencePlatformReport() {
  return {
    ok: true,
    platform: "Document Intelligence Platform" as const,
    layer: "ai_core" as const,
    reusableAcrossBusinessModules: true,
    summary:
      "Reusable AI Core platform for generating, understanding, transforming, searching, and governing business documents across productivity suites.",
    capabilities: documentIntelligenceCapabilities,
    connectorFamilies: productivityConnectorFamilies,
    supportedDocumentTypes: [
      "contracts",
      "proposals",
      "investor decks",
      "sales decks",
      "financial models",
      "marketing reports",
      "business plans",
      "product catalogs",
      "email drafts",
      "spreadsheets",
      "presentations",
      "PDFs",
      "knowledge documents",
    ],
    reusableTemplates: [
      "contracts",
      "proposals",
      "investor_decks",
      "reports",
      "marketing_documents",
      "financial_models",
      "sales_scripts",
      "product_catalogs",
      "business_module_templates",
    ],
    safetyRules: documentSafetyRules,
    approvalRequiredForExternalActions: true,
    auditRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
  };
}

export function reviewDocumentWorkflow(input: DocumentWorkflowReviewInput): DocumentWorkflowReview {
  const externalActionIntent = input.externalActionIntent ?? "internal_document_preparation";
  const architecture = classifyFeatureArchitecture({
    featureName: `Document Intelligence: ${input.workflowType}`,
    description: `Reusable document workflow review for ${input.documentType}.`,
    businessDomain: input.businessModule,
    reusableAcrossIndustries: true,
    requestedExternalActions: [externalActionIntent, ...(input.requestedTransformations ?? [])],
    connectorKeys: input.connectorKeys,
    extensionPoints: ["capability", "workflow", "permission", "ui_surface", "connector", "audit_event", "schema", "document", "notification"],
  });
  const safeAutoDecision = evaluateSafeAutomation({
    requestedAction: externalActionIntent,
    preferredToolKey: input.connectorKeys?.[0],
    module: "Document Intelligence Platform",
  });
  const securityDecision = evaluateAiSecurityEvent({
    prompt: `${input.workflowType} ${input.documentType} ${input.templateKey ?? ""}`,
    requestedAction: externalActionIntent,
    requestedToolKey: input.connectorKeys?.[0],
    userRole: "operator",
    dataClasses: input.containsSensitiveData ? ["customer information", "business records", "restricted document"] : ["business document"],
    sourceLabel: input.sourceRecordLabels.join(", "),
  });
  const connectorPlans = (input.connectorKeys ?? []).map((connectorId) =>
    evaluateConnectorAction({
      connectorId,
      actionKey: externalActionIntent,
      module: "Document Intelligence Platform",
    }),
  );

  return {
    ok: true,
    platform: "Document Intelligence Platform",
    architecture,
    workflowPlan: workflowPlanFor(input),
    templateRequirements: [
      "Template key and version must be tracked before reuse.",
      "Dynamic variables must map to sourced CRM, Revenue Engine, Business Module, or approved AI output fields.",
      "Brand consistency and business-module differences must be represented through configuration, not duplicated logic.",
    ],
    approvalRequirements: [
      "Human approval required before sending, publishing, emailing, exporting, or public sharing.",
      ...(input.containsSensitiveData ? ["Security review required for sensitive document data."] : []),
      "Role permission and audit record required before any future connector write.",
    ],
    governanceNotes: [...documentSafetyRules],
    sourceRecordLabels: input.sourceRecordLabels,
    assumptions: [
      "This review prepares a governed document workflow only.",
      "Source record labels were supplied by the caller and must be verified before external use.",
      "No live productivity connector call, email send, public share, export, or file write is authorized.",
    ],
    safeAutoDecision,
    securityDecision,
    connectorPlans,
    auditRequired: true,
    providerCalled: false,
    liveExecutionAllowed: false,
    externalActionsBlocked: true,
  };
}
