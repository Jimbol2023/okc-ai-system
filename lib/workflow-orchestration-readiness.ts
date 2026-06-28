export type WorkflowOrchestrationToolId =
  | "n8n"
  | "microsoft_power_automate_desktop"
  | "playwright"
  | "terminal_access"
  | "file_system_access";

export type WorkflowOrchestrationStatus = "recommended_readiness_only" | "manual_review_required" | "blocked_until_governed";

export type WorkflowOrchestrationCapability = {
  id: WorkflowOrchestrationToolId;
  label: string;
  status: WorkflowOrchestrationStatus;
  role: string;
  recommendedUse: string;
  blockedUntil: string[];
  riskNotes: string[];
  safetyFlags: {
    providerCalled: false;
    workflowTriggered: false;
    externalNetworkCalled: false;
    fileSystemWriteAuthorized: false;
    terminalCommandAuthorized: false;
    desktopAutomationAuthorized: false;
    outreachSent: false;
    crmMutated: false;
  };
};

export type WorkflowOrchestrationReadinessReport = {
  ok: true;
  preferredOrchestrator: "n8n";
  summary: string;
  capabilities: WorkflowOrchestrationCapability[];
  suggestedSequence: string[];
  testChecklist: string[];
  safety: {
    readinessOnly: true;
    advisoryOnly: true;
    noLiveWorkflowTriggers: true;
    noDesktopAutomation: true;
    noTerminalExecutionFromUi: true;
    noFileSystemWritesFromUi: true;
    noProviderCalls: true;
    noOutreach: true;
  };
};

const blockedUntilGoverned = [
  "Operator approval gate exists.",
  "Dry-run mode exists.",
  "Kill switch exists.",
  "Audit log exists.",
  "Secrets are stored outside git.",
  "Rollback plan is documented.",
];

function baseSafetyFlags(): WorkflowOrchestrationCapability["safetyFlags"] {
  return {
    providerCalled: false,
    workflowTriggered: false,
    externalNetworkCalled: false,
    fileSystemWriteAuthorized: false,
    terminalCommandAuthorized: false,
    desktopAutomationAuthorized: false,
    outreachSent: false,
    crmMutated: false,
  };
}

export function createWorkflowOrchestrationReadinessReport(): WorkflowOrchestrationReadinessReport {
  const capabilities: WorkflowOrchestrationCapability[] = [
    {
      id: "n8n",
      label: "n8n workflow orchestration",
      status: "recommended_readiness_only",
      role: "Preferred future workflow designer for governed internal processes.",
      recommendedUse: "Design disabled draft workflows first, then review trigger scope, approval gates, credentials, and audit logging before activation.",
      blockedUntil: blockedUntilGoverned,
      riskNotes: [
        "Webhook triggers can become live execution paths if enabled too early.",
        "Credential nodes must never store secrets in source control.",
        "CRM writes, outreach, scraping, and provider actions remain blocked.",
      ],
      safetyFlags: baseSafetyFlags(),
    },
    {
      id: "microsoft_power_automate_desktop",
      label: "Microsoft Power Automate Desktop",
      status: "blocked_until_governed",
      role: "Possible future attended desktop assistant for repetitive operator tasks.",
      recommendedUse: "Keep desktop flows out of production until attended-only mode, screen safety checks, and manual confirmation steps are documented.",
      blockedUntil: [...blockedUntilGoverned, "Attended-only desktop execution policy exists.", "No hidden UI clicking or credential capture is possible."],
      riskNotes: [
        "Desktop automation can click real apps and create irreversible side effects.",
        "Screen-driven flows can drift when UI layouts change.",
        "No desktop automation is authorized from the web dashboard.",
      ],
      safetyFlags: baseSafetyFlags(),
    },
    {
      id: "playwright",
      label: "Playwright browser testing",
      status: "manual_review_required",
      role: "Recommended for local end-to-end UI testing and accessibility checks.",
      recommendedUse: "Use Playwright only against local/dev URLs with seeded safe data, screenshots, and no provider accounts.",
      blockedUntil: [...blockedUntilGoverned, "Test-only environment is isolated from production.", "Provider domains are blocked or mocked."],
      riskNotes: [
        "Browser automation must not log into real provider accounts.",
        "Tests should verify UI behavior without sending outreach or creating records outside the test scope.",
      ],
      safetyFlags: baseSafetyFlags(),
    },
    {
      id: "terminal_access",
      label: "Terminal access",
      status: "manual_review_required",
      role: "Developer-only validation and maintenance channel.",
      recommendedUse: "Keep terminal operations outside dashboard UI; use explicit operator approval for commands that write, deploy, migrate, or access external systems.",
      blockedUntil: [...blockedUntilGoverned, "Command allowlist exists.", "Dangerous commands require explicit approval."],
      riskNotes: [
        "Terminal commands can mutate files, databases, deployments, and credentials.",
        "Dashboard users must not receive a generic shell execution surface.",
      ],
      safetyFlags: baseSafetyFlags(),
    },
    {
      id: "file_system_access",
      label: "File system access",
      status: "manual_review_required",
      role: "Developer-only source, document, and test artifact access.",
      recommendedUse: "Keep dashboard file access read-only unless a future document workflow has path allowlists, validation, and audit logging.",
      blockedUntil: [...blockedUntilGoverned, "Path allowlist exists.", "Write operations are scoped and audited."],
      riskNotes: [
        "Unscoped file writes can expose secrets or corrupt source data.",
        ".env.local and provider credentials must never be exposed through UI or logs.",
      ],
      safetyFlags: baseSafetyFlags(),
    },
  ];

  return {
    ok: true,
    preferredOrchestrator: "n8n",
    summary: "n8n is the recommended future workflow orchestration layer, but this audit keeps every workflow, desktop, browser, terminal, and filesystem capability readiness-only until governance is implemented.",
    capabilities,
    suggestedSequence: [
      "Document draft n8n workflows with all triggers disabled.",
      "Add approval gates, kill switches, audit logs, and dry-run previews before any workflow can run.",
      "Use Playwright for local UI testing only, with provider domains mocked or blocked.",
      "Keep Power Automate Desktop attended-only and outside the web dashboard until a desktop automation policy exists.",
      "Never expose terminal or filesystem execution through dashboard UI without path and command allowlists.",
    ],
    testChecklist: [
      "Confirm every capability returns providerCalled:false.",
      "Confirm every capability returns workflowTriggered:false.",
      "Confirm terminalCommandAuthorized:false and fileSystemWriteAuthorized:false.",
      "Confirm desktopAutomationAuthorized:false for Power Automate Desktop.",
      "Confirm no outreach, CRM mutation, provider calls, or external network calls are authorized.",
    ],
    safety: {
      readinessOnly: true,
      advisoryOnly: true,
      noLiveWorkflowTriggers: true,
      noDesktopAutomation: true,
      noTerminalExecutionFromUi: true,
      noFileSystemWritesFromUi: true,
      noProviderCalls: true,
      noOutreach: true,
    },
  };
}

export function assertWorkflowOrchestrationSafety(report: WorkflowOrchestrationReadinessReport) {
  if (!report.safety.readinessOnly || !report.safety.advisoryOnly) {
    throw new Error("Workflow orchestration readiness must remain advisory-only.");
  }

  report.capabilities.forEach((capability) => {
    const unsafeFlags = Object.entries(capability.safetyFlags).filter(([, value]) => value !== false);

    if (unsafeFlags.length > 0) {
      throw new Error(`${capability.label} has unsafe enabled flags: ${unsafeFlags.map(([key]) => key).join(", ")}`);
    }
  });
}
