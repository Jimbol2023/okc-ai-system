"use client";

import { useCallback, useEffect, useState } from "react";

import { ActionButton, DashboardCard, EmptyState, ErrorState, SafetyBadge } from "@/components/dashboard/dashboard-ui";

type KnowledgeSource = {
  id: string;
  title: string;
  sourceType: string;
  owner: string;
  approvalStatus: string;
  trustScore: number;
  qualityScore: number;
  license: string;
  businessModule: string;
  visibility: string;
  sensitivity: string;
  freshnessStatus: string;
  providerCalled: boolean;
  liveExecutionAllowed: boolean;
};

type KnowledgePack = {
  packKey: string;
  name: string;
  description: string;
  categories: string[];
  minTrustScore: number;
  minQualityScore: number;
};

type KnowledgeRecommendation = {
  recommendationType: string;
  title: string;
  why: string;
  confidence: number;
};

type ExecutiveDirective = {
  directiveKey: string;
  title: string;
  summary: string;
  objective: string;
  status: string;
  approvalStatus: string;
  workflowState: string;
  riskLevel: string;
  priority: string;
  decision: string | null;
  decisionNote: string | null;
  decidedBy: string | null;
  decidedAt: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  deferReminderAt: string | null;
  expectedBusinessValue: string;
  governanceNotes: string[];
  tags: string[];
  source: string;
  assumptions: string[];
  providerCalled: boolean;
  published: boolean;
  sent: boolean;
  scraped: boolean;
  outreachSent: boolean;
  workflowStarted: boolean;
  liveExecutionAllowed: boolean;
};

type ExecutiveDirectivesResponse = {
  ok: boolean;
  directives?: ExecutiveDirective[];
  error?: string;
};

type KnowledgePlatformReport = {
  ok: boolean;
  subsystem: string;
  mode: string;
  registry: {
    totalSources: number;
    approvedSources: number;
    pendingSources: number;
    githubSources: number;
    recentlyUpdatedSources: KnowledgeSource[];
  };
  quality: {
    averageTrust: number;
    averageQuality: number;
    staleSources: number;
    restrictedSources: number;
  };
  packs: KnowledgePack[];
  learning: {
    artifactCount: number;
    versionCount: number;
    researchBriefCount: number;
  };
  graph: {
    nodeCount: number;
    edgeCount: number;
  };
  enterpriseGraph?: {
    name: string;
    nodeCount: number;
    edgeCount: number;
    preview: Array<{
      from: { label: string; nodeType: string };
      to: { label: string; nodeType: string };
      relationshipType: string;
      confidence: number;
      qualityScore: number;
      approvalStatus: string;
      domainNames?: string[];
    }>;
    ontology: string[];
    relationships: string[];
    compatibilityAliases: string[];
  };
  recommendations: {
    storedCount: number;
    preview: KnowledgeRecommendation[];
  };
  conflicts: {
    openCount: number;
    reviewRequired: boolean;
  };
  highRoi?: {
    revenueGraph: {
      preview: Array<{
        from: { label: string; nodeType: string };
        to: { label: string; nodeType: string };
        relationshipType: string;
        confidence: number;
        qualityScore: number;
        approvalStatus: string;
      }>;
    };
    revenueKnowledgePack: KnowledgePack;
    semanticRetrieval: {
      excerptCount: number;
      defaultTopResults: number;
      mode: string;
    };
    researchLifecycle: {
      stages: string[];
      eventCount: number;
      rule: string;
    };
    executiveMemory: {
      decisionCount: number;
      preview: {
        title: string;
        rationale: string;
        expectedOutcome: string;
        followUpRecommendation: string;
      };
    };
    learningLoop: {
      eventCount: number;
      preview: {
        actionLabel: string;
        outcomeSummary: string;
        performanceSummary: string;
        lesson: string;
      };
    };
    operatorCards: string[];
  } | null;
  domains?: {
    taxonomy: Array<{ domainKey: string; name: string; description: string }>;
    coverage: Array<{ domainKey: string; name: string; assignedCount: number; inferredSourceCount: number; totalSignals: number }>;
    assignmentCount: number;
    restrictedKnowledgeExposed: boolean;
  } | null;
  lineage?: {
    eventCount: number;
    eventCounts: Record<string, number>;
    supportedLineage: string[];
  } | null;
  health?: {
    snapshotCount: number;
    calculatedCount: number;
    averages: {
      freshness: number;
      citationCompleteness: number;
      confidence: number;
      coverage: number;
    };
    reviewSignals: {
      staleKnowledge: number;
      unusedKnowledge: number;
      underCitedKnowledge: number;
      lowConfidenceKnowledge: number;
    };
  } | null;
  executiveInsights?: {
    topReferencedKnowledge: Array<{ title: string; qualityScore: number; usageCount: number }>;
    mostValuableKnowledgePacks: Array<{ packKey: string; name: string; valueSignals: number; minQualityScore: number }>;
    knowledgeGaps: Array<{ domainKey: string; name: string; reason: string }>;
    unusedKnowledge: Array<{ targetType: string; targetId: string; reviewSignals: string[] }>;
    staleKnowledge: Array<{ targetType: string; targetId: string; reviewSignals: string[] }>;
    decisionCoverage: { decisionCount: number; lineageDecisionEvents: number; status: string };
    researchBottlenecks: { draftCount: number; approvedCount: number; referenceCount: number; status: string };
    knowledgeGrowth: { totalSources: number; approvedSources: number; storedInsightCount: number };
    advisoryOnly: boolean;
  } | null;
  safetyFlags: {
    sourceApprovalRequired: boolean;
    citationContractRequired: boolean;
    sensitivityFiltered: boolean;
    githubCloneAllowed: boolean;
    scrapingAllowed: boolean;
    providerCalled: boolean;
    liveExecutionAllowed: boolean;
  };
};

type PlatformResponse = KnowledgePlatformReport | { ok: false; error?: string };

const sourceTypes = [
  ["official_documentation", "Official docs"],
  ["approved_github_repository", "Approved GitHub repo"],
  ["internal_company_knowledge", "Internal knowledge"],
  ["user_created_documentation", "User-created docs"],
  ["public_reference_material", "Public reference"],
  ["ai_generated_recommendation", "AI recommendation"],
] as const;

const sensitivities = [
  ["public", "Public"],
  ["internal", "Internal"],
  ["confidential", "Confidential"],
  ["restricted", "Restricted"],
  ["credential_adjacent", "Credential-adjacent"],
  ["prompt_library", "Prompt library"],
  ["strategy_sensitive", "Strategy-sensitive"],
] as const;

async function readJson<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) throw new Error("Unexpected non-JSON response.");
  return response.json() as Promise<T>;
}

function label(value: string) {
  return value.replaceAll("_", " ");
}

export function EnterpriseKnowledgePlatformClient() {
  const [report, setReport] = useState<KnowledgePlatformReport | null>(null);
  const [directives, setDirectives] = useState<ExecutiveDirective[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [recordingExecutiveMemory, setRecordingExecutiveMemory] = useState(false);
  const [actingDirective, setActingDirective] = useState("");
  const [directiveNotes, setDirectiveNotes] = useState<Record<string, string>>({});
  const [deferReminders, setDeferReminders] = useState<Record<string, string>>({});

  const loadReport = useCallback(async () => {
    const response = await fetch("/api/knowledge/platform", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await readJson<PlatformResponse>(response);
    if (!response.ok || !data.ok) throw new Error("error" in data && data.error ? data.error : "Unable to load Enterprise Knowledge Platform.");
    setReport(data);
  }, []);

  const loadDirectives = useCallback(async () => {
    const response = await fetch("/api/knowledge/platform/executive-directives", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    const data = await readJson<ExecutiveDirectivesResponse>(response);
    if (!response.ok || !data.ok) throw new Error(data.error || "Unable to load CEO Decision Agenda.");
    setDirectives(data.directives ?? []);
  }, []);

  useEffect(() => {
    loadReport().catch((err) => setError(err instanceof Error ? err.message : "Unable to load Enterprise Knowledge Platform."));
    loadDirectives().catch((err) => setError(err instanceof Error ? err.message : "Unable to load CEO Decision Agenda."));
  }, [loadDirectives, loadReport]);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const categories = String(data.get("categories") ?? "")
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean);

    const payload = {
      title: String(data.get("title") ?? ""),
      sourceType: String(data.get("sourceType") ?? "internal_company_knowledge"),
      sourceUri: String(data.get("sourceUri") ?? ""),
      owner: String(data.get("owner") ?? ""),
      versionRef: String(data.get("versionRef") ?? "unversioned"),
      trustScore: Number(data.get("trustScore") ?? 50),
      license: String(data.get("license") ?? ""),
      provenance: String(data.get("provenance") ?? ""),
      categories,
      businessModule: String(data.get("businessModule") ?? "enterprise"),
      visibility: String(data.get("visibility") ?? "enterprise_shared"),
      sensitivity: String(data.get("sensitivity") ?? "internal"),
      reviewCadenceDays: Number(data.get("reviewCadenceDays") ?? 90),
      contradictionRisk: Number(data.get("contradictionRisk") ?? 0),
    };

    try {
      const response = await fetch("/api/knowledge/platform/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readJson<{ ok: boolean; error?: string; errors?: unknown }>(response);
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to register knowledge source.");
      form.reset();
      setMessage("Knowledge source registered for review. AI agents cannot use it until approval is complete.");
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register knowledge source.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDirectiveDecision(directiveKey: string, action: "approve" | "reject" | "request_changes" | "defer") {
    setActingDirective(`${directiveKey}:${action}`);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/knowledge/platform/executive-directives/${encodeURIComponent(directiveKey)}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          action,
          decisionNote: directiveNotes[directiveKey] ?? "",
          deferReminderAt: deferReminders[directiveKey] || undefined,
        }),
      });
      const result = await readJson<{ ok: boolean; error?: string }>(response);
      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to update CEO decision.");
      const actionLabel = action === "request_changes" ? "requested changes for" : action === "defer" ? "deferred" : action === "reject" ? "rejected" : "approved";
      setMessage(`CEO ${actionLabel} ${directiveKey}. Internal metadata updated only; no provider, publishing, sending, scraping, outreach, or workflow execution occurred.`);
      await Promise.all([loadDirectives(), loadReport()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update CEO decision.");
    } finally {
      setActingDirective("");
    }
  }

  async function handleRecordExecutiveMemory() {
    setRecordingExecutiveMemory(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/knowledge/platform/executive-memory", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const result = await readJson<{
        ok: boolean;
        status?: "recorded" | "already_recorded";
        message?: string;
        error?: string;
        providerCalled?: boolean;
        liveExecutionAllowed?: boolean;
      }>(response);

      if (!response.ok || !result.ok) throw new Error(result.error || "Unable to record executive memory.");

      setMessage(result.message ?? "Executive memory recorded internally. No provider, publishing, sending, scraping, outreach, or workflow execution occurred.");
      await loadReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record executive memory.");
    } finally {
      setRecordingExecutiveMemory(false);
    }
  }

  const sources = report?.registry.recentlyUpdatedSources ?? [];
  const approvedDirectiveCount = directives.filter((directive) => directive.approvalStatus === "approved").length;
  const pendingDirectiveCount = directives.filter((directive) => directive.approvalStatus === "awaiting_ceo_approval").length;

  return (
    <div className="space-y-6">
      {error ? <ErrorState message={error} /> : null}
      {message ? <p className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">{message}</p> : null}

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Phase 8 AI Core</p>
            <h2 className="mt-1 break-words text-2xl font-semibold text-primary">Enterprise Knowledge Platform</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              Register approved sources, score quality, build citation-ready context, and keep GitHub knowledge metadata-first until connector governance authorizes live reads.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SafetyBadge tone="good">approval required</SafetyBadge>
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge tone="urgent">clone:false</SafetyBadge>
            <SafetyBadge tone="missing">scrape:false</SafetyBadge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Sources", report?.registry.totalSources ?? 0, `${report?.registry.approvedSources ?? 0} approved`],
            ["Quality", report?.quality.averageQuality ?? 0, `trust ${report?.quality.averageTrust ?? 0}`],
            ["Packs", report?.packs.length ?? 0, "agent-loadable"],
            ["Conflicts", report?.conflicts.openCount ?? 0, "human review"],
          ].map(([title, value, detail]) => (
            <div key={title} className="rounded-lg border border-border bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{title}</p>
              <p className="mt-2 text-2xl font-semibold text-primary">{value}</p>
              <p className="mt-1 text-sm text-muted">{detail}</p>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">CEO Decision Agenda</p>
            <h2 className="mt-1 break-words text-xl font-semibold text-primary">Approve Campaign 001</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              These controls update the internal executive directive record only. They do not publish, send, scrape, call providers, create leads, or start external workflow automation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SafetyBadge tone="good">approved:{approvedDirectiveCount}</SafetyBadge>
            <SafetyBadge>pending:{pendingDirectiveCount}</SafetyBadge>
            <SafetyBadge tone="missing">externalExecution:false</SafetyBadge>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {directives.length === 0 ? <EmptyState title="CEO Decision Agenda is loading." detail="No directive actions are available until the agenda is loaded." /> : null}
          {directives.map((directive) => {
            const isCampaign001 = directive.directiveKey === "campaign-001";
            const disabled = Boolean(actingDirective);
            return (
              <article key={directive.directiveKey} className="rounded-lg border border-border bg-white p-4">
                <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-primary">{directive.title}</p>
                    <p className="mt-1 break-words text-sm leading-6 text-muted">{directive.summary}</p>
                    <p className="mt-3 break-words text-sm leading-6 text-primary">{directive.objective}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">
                      Status: {label(directive.approvalStatus)} / Workflow: {label(directive.workflowState)} / Risk: {label(directive.riskLevel)}
                    </p>
                    {directive.decision ? (
                      <p className="mt-2 text-sm font-semibold text-emerald-700">
                        Decision: {label(directive.decision)}{directive.decidedAt ? ` at ${new Date(directive.decidedAt).toLocaleString()}` : ""}
                      </p>
                    ) : null}
                  </div>
                  <SafetyBadge tone={directive.approvalStatus === "approved" ? "good" : "neutral"}>
                    {directive.approvalStatus === "approved" ? "approved" : isCampaign001 ? "ready to approve" : "awaiting CEO"}
                  </SafetyBadge>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {directive.tags.map((tag) => <SafetyBadge key={tag}>{tag}</SafetyBadge>)}
                  <SafetyBadge>providerCalled:{String(directive.providerCalled)}</SafetyBadge>
                  <SafetyBadge>liveExecution:{String(directive.liveExecutionAllowed)}</SafetyBadge>
                </div>

                <label className="mt-4 block text-xs font-bold uppercase tracking-[0.08em] text-muted" htmlFor={`note-${directive.directiveKey}`}>
                  Decision note
                </label>
                <textarea
                  id={`note-${directive.directiveKey}`}
                  className="mt-2 min-h-20 w-full rounded-lg border border-border px-3 py-2 text-sm"
                  placeholder="Required for reject or request changes. Optional for approve."
                  value={directiveNotes[directive.directiveKey] ?? ""}
                  onChange={(event) => setDirectiveNotes((current) => ({ ...current, [directive.directiveKey]: event.target.value }))}
                />

                <label className="mt-3 block text-xs font-bold uppercase tracking-[0.08em] text-muted" htmlFor={`defer-${directive.directiveKey}`}>
                  Defer reminder
                </label>
                <input
                  id={`defer-${directive.directiveKey}`}
                  type="datetime-local"
                  className="mt-2 min-h-11 w-full rounded-lg border border-border px-3 text-sm"
                  value={deferReminders[directive.directiveKey] ?? ""}
                  onChange={(event) => setDeferReminders((current) => ({ ...current, [directive.directiveKey]: event.target.value }))}
                />

                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap">
                  <ActionButton
                    type="button"
                    disabled={disabled || directive.approvalStatus === "approved"}
                    className="w-full min-w-28 lg:w-auto"
                    onClick={() => handleDirectiveDecision(directive.directiveKey, "approve")}
                  >
                    {isCampaign001 ? "Approve 001" : "Approve"}
                  </ActionButton>
                  <ActionButton
                    type="button"
                    disabled={disabled}
                    aria-label={`Reject ${directive.title}`}
                    className="w-full min-w-28 border border-slate-300 bg-slate-50 text-slate-950 hover:bg-slate-100 disabled:text-slate-700 lg:w-auto"
                    onClick={() => handleDirectiveDecision(directive.directiveKey, "reject")}
                  >
                    Reject
                  </ActionButton>
                  <ActionButton
                    type="button"
                    disabled={disabled}
                    aria-label={`Request changes for ${directive.title}`}
                    className="w-full min-w-40 border border-slate-300 bg-slate-50 text-slate-950 hover:bg-slate-100 disabled:text-slate-700 lg:w-auto"
                    onClick={() => handleDirectiveDecision(directive.directiveKey, "request_changes")}
                  >
                    Request Changes
                  </ActionButton>
                  <ActionButton
                    type="button"
                    disabled={disabled}
                    aria-label={`Defer ${directive.title}`}
                    className="w-full min-w-28 border border-slate-300 bg-slate-50 text-slate-950 hover:bg-slate-100 disabled:text-slate-700 lg:w-auto"
                    onClick={() => handleDirectiveDecision(directive.directiveKey, "defer")}
                  >
                    Defer
                  </ActionButton>
                </div>
              </article>
            );
          })}
        </div>
      </DashboardCard>

      <DashboardCard>
        <h2 className="text-xl font-semibold text-primary">Register trusted source</h2>
        <form onSubmit={handleRegister} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" required minLength={3} className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Source title" />
          <select name="sourceType" className="min-h-11 rounded-lg border border-border px-3 text-sm" defaultValue="internal_company_knowledge">
            {sourceTypes.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
          <input name="sourceUri" className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="URL or reference path" />
          <input name="owner" required className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Owner" />
          <input name="versionRef" defaultValue="unversioned" className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Version/ref" />
          <input name="license" required className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="License or usage rights" />
          <input name="categories" required className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Categories, comma separated" />
          <input name="businessModule" defaultValue="enterprise" className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Business module" />
          <select name="visibility" className="min-h-11 rounded-lg border border-border px-3 text-sm" defaultValue="enterprise_shared">
            <option value="enterprise_shared">Enterprise shared</option>
            <option value="business_private">Business private</option>
            <option value="module_scoped">Module scoped</option>
          </select>
          <select name="sensitivity" className="min-h-11 rounded-lg border border-border px-3 text-sm" defaultValue="internal">
            {sensitivities.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
          <input name="trustScore" type="number" min={0} max={100} defaultValue={50} className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Trust score" />
          <input name="contradictionRisk" type="number" min={0} max={100} defaultValue={0} className="min-h-11 rounded-lg border border-border px-3 text-sm" placeholder="Contradiction risk" />
          <textarea name="provenance" required minLength={10} className="min-h-28 rounded-lg border border-border px-3 py-2 text-sm md:col-span-2" placeholder="Provenance and source attribution" />
          <div className="md:col-span-2">
            <ActionButton type="submit" disabled={saving}>{saving ? "Registering..." : "Register source"}</ActionButton>
          </div>
        </form>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardCard>
          <h2 className="text-xl font-semibold text-primary">Knowledge Registry</h2>
          <div className="mt-4 space-y-3">
            {sources.length === 0 ? <EmptyState title="No Phase 8 sources registered yet." detail="Register trusted sources above. They remain pending until approved." /> : null}
            {sources.map((source) => (
              <article key={source.id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-primary">{source.title}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-muted">{label(source.sourceType)} / {label(source.sensitivity)}</p>
                  </div>
                  <SafetyBadge tone={source.approvalStatus === "approved" ? "good" : "neutral"}>{label(source.approvalStatus)}</SafetyBadge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <SafetyBadge>trust:{source.trustScore}</SafetyBadge>
                  <SafetyBadge>quality:{source.qualityScore}</SafetyBadge>
                  <SafetyBadge>{source.license}</SafetyBadge>
                  <SafetyBadge>provider:{String(source.providerCalled)}</SafetyBadge>
                </div>
              </article>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard>
          <h2 className="text-xl font-semibold text-primary">Knowledge Packs</h2>
          <div className="mt-4 grid gap-3">
            {(report?.packs ?? []).slice(0, 6).map((pack) => (
              <article key={pack.packKey} className="rounded-lg border border-border bg-white p-4">
                <p className="font-semibold text-primary">{pack.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted">{pack.description}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">min trust {pack.minTrustScore} / min quality {pack.minQualityScore}</p>
              </article>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">High ROI Intelligence</p>
            <h2 className="mt-1 break-words text-xl font-semibold text-primary">Revenue-grade knowledge layer</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              Prioritizes seller decisions, campaign learning, follow-up guidance, executive memory, and reusable Marketing/Sales insights before broader knowledge infrastructure.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SafetyBadge tone="good">metadata only</SafetyBadge>
            <SafetyBadge>top 8 excerpts</SafetyBadge>
            <SafetyBadge tone="missing">modelTraining:false</SafetyBadge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Revenue Knowledge Pack</p>
            <h3 className="mt-2 font-semibold text-primary">{report?.highRoi?.revenueKnowledgePack.name ?? "Revenue Knowledge Pack"}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{report?.highRoi?.revenueKnowledgePack.description ?? "Seller, campaign, follow-up, and source-attribution knowledge."}</p>
          </article>
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Semantic Retrieval</p>
            <h3 className="mt-2 font-semibold text-primary">Top {report?.highRoi?.semanticRetrieval.defaultTopResults ?? 8} excerpts</h3>
            <p className="mt-2 text-sm leading-6 text-muted">Mode: {label(report?.highRoi?.semanticRetrieval.mode ?? "approved_source_hybrid_lexical_v1")}. Excerpts: {report?.highRoi?.semanticRetrieval.excerptCount ?? 0}.</p>
          </article>
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Executive Memory</p>
            <h3 className="mt-2 font-semibold text-primary">{report?.highRoi?.executiveMemory.preview.title ?? "Decision memory"}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{report?.highRoi?.executiveMemory.preview.followUpRecommendation ?? "Track rationale, assumptions, outcomes, and next recommendation."}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ActionButton type="button" disabled={recordingExecutiveMemory} onClick={handleRecordExecutiveMemory}>
                {recordingExecutiveMemory ? "Recording..." : "Execute Memory"}
              </ActionButton>
              <SafetyBadge tone="good">internal only</SafetyBadge>
              <SafetyBadge>records:{report?.highRoi?.executiveMemory.decisionCount ?? 0}</SafetyBadge>
            </div>
          </article>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Revenue graph preview</h3>
            <div className="mt-3 space-y-2">
              {(report?.highRoi?.revenueGraph.preview ?? []).map((edge) => (
                <div key={`${edge.from.label}-${edge.relationshipType}-${edge.to.label}`} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-primary">{edge.from.label}</span>
                  <span className="px-2 text-muted">{label(edge.relationshipType)}</span>
                  <span className="font-semibold text-primary">{edge.to.label}</span>
                  <span className="ml-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">confidence {edge.confidence} / quality {edge.qualityScore}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Research to execution support</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{report?.highRoi?.researchLifecycle.rule ?? "Approved research can become pack/reference material only after review."}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(report?.highRoi?.researchLifecycle.stages ?? []).map((stage) => (
                <SafetyBadge key={stage}>{label(stage)}</SafetyBadge>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {(report?.highRoi?.operatorCards ?? ["Reuse this in Marketing", "Use this in Sales", "Review for Executive Brief", "Needs more evidence", "Approved Knowledge Pack candidate"]).map((card) => (
            <div key={card} className="rounded-lg border border-border bg-white p-3 text-sm font-semibold text-primary">
              {card}
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-muted">Sprint 13.5 Hardening</p>
            <h2 className="mt-1 break-words text-xl font-semibold text-primary">{report?.enterpriseGraph?.name ?? "Enterprise Knowledge Graph"}</h2>
            <p className="mt-2 max-w-3xl break-words text-sm leading-6 text-muted">
              Generalized intelligence layer for Real Estate, Mortgage, Insurance, Accounting, Construction, Marketing, Law, Healthcare, and future business modules.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SafetyBadge tone="good">domains governed</SafetyBadge>
            <SafetyBadge>lineage tracked</SafetyBadge>
            <SafetyBadge tone="missing">autonomy:false</SafetyBadge>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Domain Coverage</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report?.domains?.coverage.filter((domain) => domain.totalSignals > 0).length ?? 0}</p>
            <p className="mt-1 text-sm text-muted">{report?.domains?.taxonomy.length ?? 0} governed domains</p>
          </article>
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Lineage Events</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report?.lineage?.eventCount ?? 0}</p>
            <p className="mt-1 text-sm text-muted">created, approved, referenced, used</p>
          </article>
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Health Average</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report?.health?.averages.confidence ?? 0}</p>
            <p className="mt-1 text-sm text-muted">confidence score</p>
          </article>
          <article className="rounded-lg border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Executive Insights</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report?.executiveInsights?.knowledgeGrowth.storedInsightCount ?? 0}</p>
            <p className="mt-1 text-sm text-muted">stored advisory insights</p>
          </article>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Enterprise graph preview</h3>
            <div className="mt-3 space-y-2">
              {(report?.enterpriseGraph?.preview ?? []).map((edge) => (
                <div key={`${edge.from.label}-${edge.relationshipType}-${edge.to.label}`} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm">
                  <span className="font-semibold text-primary">{edge.from.label}</span>
                  <span className="px-2 text-muted">{label(edge.relationshipType)}</span>
                  <span className="font-semibold text-primary">{edge.to.label}</span>
                  <span className="ml-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">quality {edge.qualityScore}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(edge.domainNames ?? []).map((domain) => <SafetyBadge key={domain}>{domain}</SafetyBadge>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Health review signals</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {[
                ["Stale", report?.health?.reviewSignals.staleKnowledge ?? 0],
                ["Unused", report?.health?.reviewSignals.unusedKnowledge ?? 0],
                ["Under-cited", report?.health?.reviewSignals.underCitedKnowledge ?? 0],
                ["Low confidence", report?.health?.reviewSignals.lowConfidenceKnowledge ?? 0],
              ].map(([name, count]) => (
                <div key={name} className="rounded border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{name}</p>
                  <p className="mt-1 text-lg font-semibold text-primary">{count}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Top domains</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(report?.domains?.coverage ?? []).filter((domain) => domain.totalSignals > 0).slice(0, 8).map((domain) => (
                <SafetyBadge key={domain.domainKey}>{domain.name}:{domain.totalSignals}</SafetyBadge>
              ))}
              {(report?.domains?.coverage ?? []).filter((domain) => domain.totalSignals > 0).length === 0 ? <p className="text-sm text-muted">No domain coverage signals yet.</p> : null}
            </div>
          </section>
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Knowledge gaps</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(report?.executiveInsights?.knowledgeGaps ?? []).slice(0, 6).map((gap) => (
                <SafetyBadge key={gap.domainKey} tone="neutral">{gap.name}</SafetyBadge>
              ))}
            </div>
          </section>
          <section className="rounded-lg border border-border bg-white p-4">
            <h3 className="font-semibold text-primary">Executive decision coverage</h3>
            <p className="mt-2 text-sm leading-6 text-muted">
              Decisions: {report?.executiveInsights?.decisionCoverage.decisionCount ?? 0}. Lineage: {report?.executiveInsights?.decisionCoverage.lineageDecisionEvents ?? 0}. Status: {label(report?.executiveInsights?.decisionCoverage.status ?? "needs_decision_memory")}.
            </p>
            <p className="mt-2 text-sm leading-6 text-muted">
              Research bottleneck: {label(report?.executiveInsights?.researchBottlenecks.status ?? "no_lifecycle_events_yet")}.
            </p>
          </section>
        </div>
      </DashboardCard>

      <div className="grid gap-4 xl:grid-cols-3">
        <DashboardCard>
          <h2 className="text-xl font-semibold text-primary">Learning</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Artifacts: {report?.learning.artifactCount ?? 0}. Versions: {report?.learning.versionCount ?? 0}. Research briefs: {report?.learning.researchBriefCount ?? 0}.</p>
        </DashboardCard>
        <DashboardCard>
          <h2 className="text-xl font-semibold text-primary">Knowledge Graph</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Nodes: {report?.graph.nodeCount ?? 0}. Edges: {report?.graph.edgeCount ?? 0}. Relationships remain metadata-only in V1.</p>
        </DashboardCard>
        <DashboardCard>
          <h2 className="text-xl font-semibold text-primary">Recommendations</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{report?.recommendations.preview[0]?.title ?? "Recommendations require evidence and citations."}</p>
        </DashboardCard>
      </div>
    </div>
  );
}
