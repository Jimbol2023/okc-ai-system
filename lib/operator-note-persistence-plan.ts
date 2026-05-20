export type NotePersistenceScope = "safe_to_persist" | "future_optional" | "advisory_ephemeral" | "never_persist";

export type PlannedNoteCategory =
  | "acquisition_note"
  | "seller_conversation_note"
  | "disposition_note"
  | "buyer_interest_note"
  | "closing_title_note"
  | "manual_review_note"
  | "data_quality_note"
  | "blocker_note"
  | "internal_strategy_note"
  | "follow_up_context_note";

export type PlannedWorkflowArea =
  | "acquisition"
  | "disposition"
  | "closing"
  | "manual_review"
  | "data_quality"
  | "operations";

export type PlannedVisibilityLevel = "internal_only" | "manual_review" | "operator_summary" | "reporting_context";

export type NotePersistenceField = {
  field: string;
  scope: NotePersistenceScope;
  purpose: string;
  safetyBoundary: string;
};

export type NoteValidationRule = {
  label: string;
  appliesTo: string;
  plannedRule: string;
  failureBehavior: string;
};

export type RestrictedContentRule = {
  category: string;
  examples: string[];
  plannedHandling: string;
};

export type NotePersistenceSection = {
  title: string;
  summary: string;
  items: string[];
};

export type FutureNoteApiBoundary = {
  routeConcept: string;
  allowedResponsibilities: string[];
  forbiddenResponsibilities: string[];
  safetyRequirements: string[];
};

export type OperatorNotePersistencePlan = {
  status: "planning_only";
  safetyLabels: string[];
  plannedCategories: PlannedNoteCategory[];
  plannedWorkflowAreas: PlannedWorkflowArea[];
  plannedVisibilityLevels: PlannedVisibilityLevel[];
  safePersistenceModel: NotePersistenceSection;
  freeTextSafetyControls: NotePersistenceSection;
  executionIsolationRules: NotePersistenceSection;
  auditReadabilityStandards: NotePersistenceSection;
  futureValidationRules: NoteValidationRule[];
  restrictedContentRules: RestrictedContentRule[];
  persistenceClassifications: NotePersistenceField[];
  commandCenterReportingIntegration: NotePersistenceSection;
  futureApiBoundary: FutureNoteApiBoundary;
  nonGoals: string[];
};

const plannedCategories: PlannedNoteCategory[] = [
  "acquisition_note",
  "seller_conversation_note",
  "disposition_note",
  "buyer_interest_note",
  "closing_title_note",
  "manual_review_note",
  "data_quality_note",
  "blocker_note",
  "internal_strategy_note",
  "follow_up_context_note",
];

const plannedWorkflowAreas: PlannedWorkflowArea[] = [
  "acquisition",
  "disposition",
  "closing",
  "manual_review",
  "data_quality",
  "operations",
];

const plannedVisibilityLevels: PlannedVisibilityLevel[] = [
  "internal_only",
  "manual_review",
  "operator_summary",
  "reporting_context",
];

const futureValidationRules: NoteValidationRule[] = [
  {
    label: "Category validation",
    appliesTo: "category",
    plannedRule: "Require one approved note category from the controlled category list.",
    failureBehavior: "Reject the future note write before persistence.",
  },
  {
    label: "Workflow-area validation",
    appliesTo: "workflowArea",
    plannedRule: "Require one approved workflow area and keep it separate from execution state.",
    failureBehavior: "Reject unknown or missing workflow areas.",
  },
  {
    label: "Visibility validation",
    appliesTo: "visibilityLevel",
    plannedRule: "Require a controlled internal visibility level; no public or external visibility.",
    failureBehavior: "Default future writes to rejected until an allowed value is supplied.",
  },
  {
    label: "Safe-summary size validation",
    appliesTo: "safeSummary",
    plannedRule: "Require a concise summary with a future target limit near 240 characters.",
    failureBehavior: "Reject empty, overlong, or whitespace-only summaries.",
  },
  {
    label: "Bounded body size validation",
    appliesTo: "sanitizedBody",
    plannedRule: "Allow optional bounded free text only after trimming and sanitization, with a future target limit near 2,000 characters.",
    failureBehavior: "Reject oversized future note bodies instead of truncating silently.",
  },
  {
    label: "Restricted-content validation",
    appliesTo: "safeSummary and sanitizedBody",
    plannedRule: "Detect credentials, provider payloads, execution commands, approval bypass language, and DNC override language.",
    failureBehavior: "Reject and surface a manual safety review reason.",
  },
];

const restrictedContentRules: RestrictedContentRule[] = [
  {
    category: "Credentials and secrets",
    examples: ["API keys", "database URLs", "provider tokens", "passwords"],
    plannedHandling: "Never persist. Future validators should reject the note and instruct the operator to remove secrets.",
  },
  {
    category: "Execution commands",
    examples: ["send now", "call provider", "run automation", "generate contract"],
    plannedHandling: "Never treat as commands. Future validators should reject explicit execution instructions.",
  },
  {
    category: "Gate override language",
    examples: ["ignore DNC", "bypass approval", "approve outreach anyway", "override preflight"],
    plannedHandling: "Reject as unsafe because notes cannot change DNC, approval, outreach, or preflight controls.",
  },
  {
    category: "Provider payloads",
    examples: ["Twilio payloads", "email provider responses", "webhook request bodies"],
    plannedHandling: "Never persist inside notes. Keep provider data outside annotation storage.",
  },
  {
    category: "Unnecessary sensitive details",
    examples: ["private personal details", "legally risky claims", "raw communication transcripts"],
    plannedHandling: "Avoid overcollection and require a sanitized safe summary instead.",
  },
];

const persistenceClassifications: NotePersistenceField[] = [
  {
    field: "category",
    scope: "safe_to_persist",
    purpose: "Controlled note category for filtering and audit readability.",
    safetyBoundary: "Cannot change scoring, approval, DNC, or execution permissions.",
  },
  {
    field: "workflowArea",
    scope: "safe_to_persist",
    purpose: "Connects context to acquisition, disposition, closing, review, data quality, or operations.",
    safetyBoundary: "Display context only; not a workflow router.",
  },
  {
    field: "safeSummary",
    scope: "safe_to_persist",
    purpose: "Short human-readable context summary.",
    safetyBoundary: "Must be sanitized and must not contain commands, credentials, or unsafe claims.",
  },
  {
    field: "manualReviewFlag",
    scope: "safe_to_persist",
    purpose: "Marks that a human should review context.",
    safetyBoundary: "Does not approve or reject leads by itself.",
  },
  {
    field: "blockerContextMarker",
    scope: "safe_to_persist",
    purpose: "Links the note to an operational blocker explanation.",
    safetyBoundary: "Cannot override blockers or resolve them automatically.",
  },
  {
    field: "operatorOwnerPlaceholder",
    scope: "future_optional",
    purpose: "Future internal ownership context if a real operator model exists.",
    safetyBoundary: "No permissions or assignment engine in R16.",
  },
  {
    field: "sanitizedBody",
    scope: "future_optional",
    purpose: "Optional bounded free text for internal context.",
    safetyBoundary: "Never direct automation input; validate before any future persistence.",
  },
  {
    field: "derivedDisplayRecommendation",
    scope: "advisory_ephemeral",
    purpose: "Contextual display guidance that can be regenerated from current rules.",
    safetyBoundary: "Do not persist unless a future audit need is proven.",
  },
  {
    field: "credentialsOrSecrets",
    scope: "never_persist",
    purpose: "Secrets do not belong in notes.",
    safetyBoundary: "Reject future writes that contain credentials or secrets.",
  },
  {
    field: "executionInstruction",
    scope: "never_persist",
    purpose: "Notes are not commands.",
    safetyBoundary: "Reject future writes that attempt to send, approve, override, schedule, generate, or call providers.",
  },
  {
    field: "providerPayload",
    scope: "never_persist",
    purpose: "Provider payloads are execution-sensitive data.",
    safetyBoundary: "Never store Twilio, email, webhook, or delivery payloads in notes.",
  },
];

export function getOperatorNotePersistencePlan(): OperatorNotePersistencePlan {
  return {
    status: "planning_only",
    safetyLabels: [
      "Planning only",
      "No note persistence",
      "No write API",
      "No database writes",
      "No migrations",
      "Notes are context only",
      "Notes do not trigger automation",
      "Cannot override DNC or approval gates",
    ],
    plannedCategories,
    plannedWorkflowAreas,
    plannedVisibilityLevels,
    safePersistenceModel: {
      title: "Safe note persistence model",
      summary: "Future note persistence should store bounded internal context, not execution instructions.",
      items: [
        "Use controlled category, workflow area, visibility level, safe summary, manual review flag, and blocker/context marker.",
        "Add created and updated timestamps only when future persistence is explicitly approved.",
        "Keep optional free text bounded, sanitized, and internal only.",
        "Do not add Prisma models, migrations, write APIs, or persistence workers in R16.",
      ],
    },
    freeTextSafetyControls: {
      title: "Free-text safety controls",
      summary: "Free text is the highest-risk note surface and must be constrained before any future persistence.",
      items: [
        "Trim and validate all future free text.",
        "Apply conservative length limits to summary and body fields.",
        "Reject credentials, provider payloads, execution commands, automation instructions, DNC override language, and approval bypass language.",
        "Never use free text as direct input to outreach, automation, document generation, or provider execution.",
      ],
    },
    executionIsolationRules: {
      title: "Execution isolation rules",
      summary: "Notes must remain isolated from every execution path.",
      items: [
        "Notes cannot affect send permission, outreach eligibility, live-send preflight, approval status, or DNC state.",
        "Notes cannot approve outreach, call providers, generate documents, schedule jobs, or trigger automation.",
        "Notes cannot mutate execution state or runtime safety settings.",
        "Future note routes must not import send, provider, automation, document, buyer outreach, seller outreach, or title communication modules.",
      ],
    },
    auditReadabilityStandards: {
      title: "Audit readability standards",
      summary: "Future notes should be readable, categorized, and safe to review.",
      items: [
        "Require clear category, workflow area, timestamp, visibility level, and safe summary.",
        "Avoid hidden instructions, ambiguous execution wording, and legal-document substitute language.",
        "Use internal-only labels and manual-review markers where needed.",
        "Label assumptions clearly and never invent property facts.",
      ],
    },
    futureValidationRules,
    restrictedContentRules,
    persistenceClassifications,
    commandCenterReportingIntegration: {
      title: "Command center / reporting integration",
      summary: "Future notes may enrich context but cannot change operational truth or execution permissions.",
      items: [
        "Command center may display note category, workflow area, safe summary, and blocker/manual-review markers.",
        "Reporting may aggregate note categories only after future persistence is approved.",
        "Notes must not mutate R8-R15 scoring, rhythm, reporting, annotation, preflight, or permission helpers.",
        "Notes should explain workflow context without becoming a second source of operational truth.",
      ],
    },
    futureApiBoundary: {
      routeConcept: "Future isolated note route, such as POST /api/leads/[leadId]/notes, only after explicit approval.",
      allowedResponsibilities: [
        "Validate note category, workflow area, visibility, and content.",
        "Persist bounded internal context only after future schema approval.",
        "Return note context with explicit no-execution semantics.",
      ],
      forbiddenResponsibilities: [
        "Calling providers.",
        "Sending SMS or email.",
        "Approving outreach.",
        "Overriding DNC.",
        "Generating documents.",
        "Triggering automation.",
        "Mutating execution permission or preflight state.",
      ],
      safetyRequirements: [
        "No provider imports.",
        "No send-route imports.",
        "No automation imports.",
        "No document/title communication imports.",
        "Strict typed validation before persistence.",
      ],
    },
    nonGoals: [
      "No note persistence.",
      "No write API.",
      "No Prisma model.",
      "No migration.",
      "No scheduler.",
      "No worker.",
      "No provider calls.",
      "No Twilio or email.",
      "No document execution.",
      "No automation execution.",
    ],
  };
}
