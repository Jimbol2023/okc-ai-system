import { getOpenAiEmbeddingConfig } from "@/lib/openai-embeddings";
import { createProviderReadinessReport } from "@/lib/provider-readiness";
import { createWorkflowOrchestrationReadinessReport } from "@/lib/workflow-orchestration-readiness";

export type OperationalSafetyStatus = "blocked" | "readiness_only" | "simulation_only" | "advisory_only";

export type OperationalSafetyCard = {
  id: string;
  title: string;
  status: OperationalSafetyStatus;
  summary: string;
  flags: string[];
  blockedCapabilities: string[];
  safeNextStep: string;
};

export type OperationalSafetyCenterReport = {
  ok: true;
  title: "Operational Safety Center";
  summary: string;
  cards: OperationalSafetyCard[];
  globalFlags: {
    providerCalled: false;
    outreachSent: false;
    workflowTriggered: false;
    desktopAutomationAuthorized: false;
    terminalCommandAuthorized: false;
    fileSystemWriteAuthorized: false;
    generatedPropertyFacts: false;
  };
};

function countProviderStatus(status: "configured" | "partial" | "missing" | "no_credentials_required") {
  const providerReadiness = createProviderReadinessReport();

  return providerReadiness.providers.filter((provider) => provider.status === status).length;
}

export function createOperationalSafetyCenterReport(): OperationalSafetyCenterReport {
  const providerReadiness = createProviderReadinessReport();
  const workflowReadiness = createWorkflowOrchestrationReadinessReport();
  const openAiConfig = getOpenAiEmbeddingConfig();
  const n8n = workflowReadiness.capabilities.find((capability) => capability.id === "n8n");
  const configuredProviders = countProviderStatus("configured");
  const partialProviders = countProviderStatus("partial");
  const missingProviders = countProviderStatus("missing");

  return {
    ok: true,
    title: "Operational Safety Center",
    summary:
      "Central read-only view of what the system may display, what remains advisory, and what is explicitly blocked from execution.",
    cards: [
      {
        id: "provider-readiness",
        title: "Provider Readiness",
        status: "readiness_only",
        summary: `${configuredProviders} configured, ${partialProviders} partial, and ${missingProviders} missing provider readiness record(s). Readiness does not authorize activation.`,
        flags: ["providerCalled:false", "liveCallsAllowed:false", "oauthStarted:false", "enrichmentWritten:false"],
        blockedCapabilities: ["Live external fetches", "OAuth starts", "Ads", "Posting", "Scraping", "Enrichment writes"],
        safeNextStep: providerReadiness.recommendedNextActions.at(-1) ?? "Keep provider activation blocked until governance exists.",
      },
      {
        id: "workflow-orchestration",
        title: "Workflow Orchestration",
        status: "readiness_only",
        summary: workflowReadiness.summary,
        flags: ["preferred:n8n", "workflowTriggered:false", "desktopAutomation:false", "terminalExecution:false", "fileSystemWrites:false"],
        blockedCapabilities: ["Live n8n triggers", "Power Automate Desktop execution", "Dashboard shell access", "Dashboard file writes"],
        safeNextStep: workflowReadiness.suggestedSequence[0],
      },
      {
        id: "ai-memory",
        title: "AI Memory Governance",
        status: "advisory_only",
        summary:
          "AI Memory uses governed internal events for deterministic recommendation confidence. It does not call LLMs or trigger actions.",
        flags: ["advisoryOnly:true", "llmCalled:false", "autonomousActions:false", "sampleWindowDays:90"],
        blockedCapabilities: ["Autonomous lead actions", "Provider calls", "Outreach", "CRM mutation from recommendations"],
        safeNextStep: "Keep AI Memory as explainable recommendation context tied to manual review.",
      },
      {
        id: "openai-semantic-search",
        title: "OpenAI + Semantic Search Gates",
        status: openAiConfig.enabled ? "readiness_only" : "blocked",
        summary: openAiConfig.enabled
          ? `Embeddings are configured for server-side semantic search with ${openAiConfig.model}; keyword fallback remains available.`
          : `Semantic search is disabled or incomplete (${openAiConfig.reason ?? "openai_embeddings_disabled"}); internal keyword search remains active.`,
        flags: ["clientProviderCalls:false", "textGeneration:false", "generatedPropertyFacts:false", `embeddingModel:${openAiConfig.model}`],
        blockedCapabilities: ["Client-side OpenAI calls", "Text generation", "Lead enrichment writes", "Generated property facts"],
        safeNextStep: "Use internal keyword search first; keep embeddings optional, server-only, and fail-closed.",
      },
      {
        id: "twilio-sms",
        title: "Twilio + SMS Boundary",
        status: "simulation_only",
        summary: "SMS routes return simulation/readiness envelopes only. Live sends and provider execution remain blocked.",
        flags: ["simulationOnly:true", "sent:false", "providerCalled:false", "liveExecutionEnabled:false"],
        blockedCapabilities: ["Live SMS send", "Automated outreach", "Auto-dialing", "Provider execution"],
        safeNextStep: "Keep SMS behavior in simulation mode until allowlists, confirmations, kill switches, and audits are approved.",
      },
      {
        id: "n8n-readiness",
        title: "n8n Readiness",
        status: "readiness_only",
        summary: n8n?.recommendedUse ?? "n8n is readiness-only and must not run live triggers yet.",
        flags: ["n8nPreferred:true", "triggersEnabled:false", "webhookExecution:false", "providerCalled:false"],
        blockedCapabilities: ["Enabled production triggers", "Webhook execution", "Credentialed provider nodes", "CRM writes"],
        safeNextStep: n8n?.blockedUntil[0] ?? "Add approval gates before enabling any workflow.",
      },
    ],
    globalFlags: {
      providerCalled: false,
      outreachSent: false,
      workflowTriggered: false,
      desktopAutomationAuthorized: false,
      terminalCommandAuthorized: false,
      fileSystemWriteAuthorized: false,
      generatedPropertyFacts: false,
    },
  };
}

export function assertOperationalSafetyCenter(report: OperationalSafetyCenterReport) {
  const unsafeGlobalFlags = Object.entries(report.globalFlags).filter(([, value]) => value !== false);

  if (unsafeGlobalFlags.length > 0) {
    throw new Error(`Operational Safety Center has unsafe global flags: ${unsafeGlobalFlags.map(([key]) => key).join(", ")}`);
  }
}
