"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, FileText, Pencil, RefreshCw, Save, XCircle } from "lucide-react";

import { ActionButton, DashboardCard, EmptyState, ErrorState, SafetyBadge, StatusBadge } from "@/components/dashboard/dashboard-ui";
import type { CeoDraftWorkspaceReport, DraftWorkspaceItem } from "@/lib/company-draft-workspace";

type WorkspaceResponse = CeoDraftWorkspaceReport | { ok: false; error?: string };
type PreviewResponse = { ok: true; draft: DraftWorkspaceItem } | { ok: false; error?: string };
type Decision = "approve" | "reject" | "request_changes";

type EditForm = {
  title: string;
  body: string;
  messaging: string;
  cta: string;
  metadata: string;
  note: string;
};

const emptyForm: EditForm = {
  title: "",
  body: "",
  messaging: "",
  cta: "",
  metadata: "",
  note: "",
};

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function formatDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function statusTone(status: string) {
  if (status.includes("approved")) return "good";
  if (status.includes("rejected")) return "urgent";
  if (status.includes("changes")) return "watch";

  return "neutral";
}

function listBlock(title: string, items: string[]) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{title}</p>
      {items.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm leading-6 text-primary">
          {items.map((item) => (
            <li key={item} className="break-words">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">None recorded.</p>
      )}
    </div>
  );
}

function fieldLabel(text: string) {
  return <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{text}</span>;
}

function responseError(data: WorkspaceResponse | PreviewResponse, fallback: string) {
  return "error" in data && data.error ? data.error : fallback;
}

function isTerminalApprovalStatus(status: string) {
  return status === "approved_internal" || status === "rejected_internal" || status === "changes_requested";
}

function terminalApprovalLabel(status: string) {
  if (status === "approved_internal") return "Approved by CEO";
  if (status === "rejected_internal") return "Rejected by CEO";
  if (status === "changes_requested") return "Changes requested by CEO";

  return "";
}

export function CeoDraftWorkspaceClient() {
  const [report, setReport] = useState<CeoDraftWorkspaceReport | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [previewDraft, setPreviewDraft] = useState<DraftWorkspaceItem | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm);
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("Loading CEO Draft Workspace...");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const allDrafts = useMemo(() => report?.groups.flatMap((group) => group.drafts) ?? [], [report]);
  const selectedDraft = useMemo(
    () => previewDraft ?? allDrafts.find((draft) => draft.id === selectedDraftId) ?? allDrafts[0] ?? null,
    [allDrafts, previewDraft, selectedDraftId],
  );
  const selectedDraftIsTerminal = selectedDraft ? isTerminalApprovalStatus(selectedDraft.approvalStatus) : false;

  const hydrateForm = useCallback((draft: DraftWorkspaceItem) => {
    setForm({
      title: draft.title,
      body: draft.body,
      messaging: draft.messaging,
      cta: draft.cta,
      metadata: draft.metadata.rawMetadataNote ?? "",
      note: "",
    });
  }, []);

  const loadWorkspace = useCallback(async (nextSelectedId?: string) => {
    const response = await fetch("/api/company/drafts", { headers: { Accept: "application/json" } });
    const data = (await response.json()) as WorkspaceResponse;

    if (!response.ok || !data.ok) {
      throw new Error(responseError(data, "Unable to load CEO Draft Workspace."));
    }

    setReport(data);
    const nextDraft = data.groups.flatMap((group) => group.drafts).find((draft) => draft.id === nextSelectedId) ?? data.groups[0]?.drafts[0] ?? null;
    setSelectedDraftId(nextDraft?.id ?? null);
    setPreviewDraft(null);
    if (nextDraft) hydrateForm(nextDraft);
    setMessage("Workspace loaded. All actions remain internal only.");
  }, [hydrateForm]);

  useEffect(() => {
    loadWorkspace().catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load CEO Draft Workspace."));
  }, [loadWorkspace]);

  async function preview(draft: DraftWorkspaceItem) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/company/drafts/${draft.id}/preview`, { headers: { Accept: "application/json" } });
      const data = (await response.json()) as PreviewResponse;

      if (!response.ok || !data.ok) {
        throw new Error(responseError(data, "Unable to preview draft."));
      }

      setSelectedDraftId(draft.id);
      setPreviewDraft(data.draft);
      hydrateForm(data.draft);
      setMessage("Preview loaded. No revision or execution was created.");
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : "Unable to preview draft.");
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft() {
    if (!selectedDraft) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/company/drafts/${selectedDraft.id}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = (await response.json()) as PreviewResponse;

      if (!response.ok || !data.ok) {
        throw new Error(responseError(data, "Unable to save draft."));
      }

      await loadWorkspace(selectedDraft.id);
      setMessage("Draft saved with version history. Execution remains blocked.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save draft.");
    } finally {
      setBusy(false);
    }
  }

  async function decideDraft(decision: Decision) {
    if (!selectedDraft) return;
    const note = decisionNotes[selectedDraft.id]?.trim() ?? "";

    if ((decision === "reject" || decision === "request_changes") && !note) {
      setError("Add a note before rejecting a draft or requesting changes.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/company/drafts/${selectedDraft.id}/decision`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision, note }),
      });
      const data = (await response.json()) as PreviewResponse;

      if (!response.ok || !data.ok) {
        throw new Error(responseError(data, "Unable to update draft decision."));
      }

      await loadWorkspace(selectedDraft.id);
      setDecisionNotes((current) => ({ ...current, [selectedDraft.id]: "" }));
      setMessage(`${formatLabel(decision)} recorded for internal review only.`);
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : "Unable to update draft decision.");
    } finally {
      setBusy(false);
    }
  }

  function selectDraft(draft: DraftWorkspaceItem) {
    setSelectedDraftId(draft.id);
    setPreviewDraft(null);
    hydrateForm(draft);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Dashboard</p>
          <h1 className="mt-1 break-words text-3xl font-semibold text-primary">CEO Draft Workspace</h1>
          <p className="mt-2 max-w-4xl break-words text-sm leading-6 text-muted">
            Review department work items before any governed execution process. This workspace is generic for marketing, SEO, brand, lead intelligence, acquisitions, dispositions, contracts, and operations drafts.
          </p>
        </div>
        <ActionButton type="button" onClick={() => loadWorkspace(selectedDraft?.id).catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to refresh drafts."))} disabled={busy}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Refresh
        </ActionButton>
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-950">{message}</div>
      {error ? <ErrorState message={error} /> : null}

      {report ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardCard>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Departments</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report.totals.departments}</p>
          </DashboardCard>
          <DashboardCard>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Drafts</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report.totals.drafts}</p>
          </DashboardCard>
          <DashboardCard>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report.totals.pendingReview}</p>
          </DashboardCard>
          <DashboardCard>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Approved</p>
            <p className="mt-2 text-2xl font-semibold text-primary">{report.totals.approved}</p>
          </DashboardCard>
          <DashboardCard>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Execution</p>
            <p className="mt-2 text-sm font-bold text-primary">Blocked</p>
          </DashboardCard>
        </div>
      ) : null}

      {!report ? null : report.groups.length === 0 ? (
        <EmptyState title="No department drafts are visible yet." detail={report.summary} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(280px,0.9fr)_minmax(0,1.4fr)]">
          <div className="space-y-4">
            {report.groups.map((group) => (
              <section key={group.department} className="rounded-lg border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="break-words text-lg font-semibold text-primary">{group.department}</h2>
                  <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted">{group.drafts.length} item(s)</span>
                </div>
                <div className="mt-3 space-y-2">
                  {group.drafts.map((draft) => (
                    <button
                      key={draft.id}
                      type="button"
                      onClick={() => selectDraft(draft)}
                      className={`w-full rounded-lg border p-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        selectedDraft?.id === draft.id ? "border-accent bg-white" : "border-border bg-white/70 hover:bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="break-words text-sm font-semibold text-primary">{draft.title}</p>
                          <p className="mt-1 break-words text-xs text-muted">{draft.output}</p>
                        </div>
                        <StatusBadge status={statusTone(draft.approvalStatus)} label={formatLabel(draft.approvalStatus)} />
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {selectedDraft ? (
            <section className="rounded-lg border border-border bg-surface p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={statusTone(selectedDraft.approvalStatus)} label={formatLabel(selectedDraft.approvalStatus)} />
                    <SafetyBadge tone="good">Internal Only</SafetyBadge>
                    <SafetyBadge tone="neutral">Approval Required</SafetyBadge>
                  </div>
                  <h2 className="mt-3 break-words text-2xl font-semibold text-primary">{selectedDraft.title}</h2>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">{selectedDraft.executiveSummary}</p>
                </div>
                <ActionButton type="button" onClick={() => preview(selectedDraft)} disabled={busy} className="bg-slate-700 hover:bg-slate-800">
                  <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                  Preview
                </ActionButton>
              </div>

              {selectedDraftIsTerminal ? (
                <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950" role="status" aria-live="polite">
                  <p className="font-semibold">{terminalApprovalLabel(selectedDraft.approvalStatus)}</p>
                  <p className="mt-1">This draft is in a terminal internal review state. No provider, publishing, outreach, CRM, or automation action was started.</p>
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <DashboardCard>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Department</p>
                  <p className="mt-2 break-words text-sm font-semibold text-primary">{selectedDraft.department}</p>
                </DashboardCard>
                <DashboardCard>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Created</p>
                  <p className="mt-2 break-words text-sm font-semibold text-primary">{formatDate(selectedDraft.createdAt)}</p>
                </DashboardCard>
                <DashboardCard>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Priority</p>
                  <p className="mt-2 break-words text-sm font-semibold text-primary">{formatLabel(selectedDraft.priority)}</p>
                </DashboardCard>
                <DashboardCard>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Revision Count</p>
                  <p className="mt-2 break-words text-sm font-semibold text-primary">{selectedDraft.revisionCount}</p>
                </DashboardCard>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {listBlock("Knowledge Packs", selectedDraft.knowledgePacks)}
                {listBlock("Source Registry Entries", selectedDraft.sourceRegistryEntries)}
                {listBlock("Assumptions", selectedDraft.assumptions)}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Traceability</p>
                  <dl className="mt-2 space-y-2 text-sm leading-6">
                    <div>
                      <dt className="font-semibold text-primary">Confidence</dt>
                      <dd className="text-muted">{selectedDraft.confidence}%</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-primary">Business Objective</dt>
                      <dd className="break-words text-muted">{selectedDraft.businessGoal}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-primary">Work Item Type</dt>
                      <dd className="break-words text-muted">{formatLabel(selectedDraft.metadata.workItemType)}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-border bg-white p-4">
                <div className="flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-muted" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-primary">Edit Draft</h3>
                </div>
                <fieldset className="mt-4 grid gap-3 disabled:opacity-70" disabled={selectedDraftIsTerminal}>
                  <label className="grid gap-1">
                    {fieldLabel("Title")}
                    <input className="rounded-lg border border-border px-3 py-2 text-sm" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} maxLength={180} required />
                  </label>
                  <label className="grid gap-1">
                    {fieldLabel("Body")}
                    <textarea className="min-h-36 rounded-lg border border-border px-3 py-2 text-sm leading-6" value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} maxLength={8000} required />
                  </label>
                  <label className="grid gap-1">
                    {fieldLabel("Messaging")}
                    <textarea className="min-h-24 rounded-lg border border-border px-3 py-2 text-sm leading-6" value={form.messaging} onChange={(event) => setForm((current) => ({ ...current, messaging: event.target.value }))} maxLength={3000} />
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="grid gap-1">
                      {fieldLabel("CTA")}
                      <textarea className="min-h-24 rounded-lg border border-border px-3 py-2 text-sm leading-6" value={form.cta} onChange={(event) => setForm((current) => ({ ...current, cta: event.target.value }))} maxLength={500} />
                    </label>
                    <label className="grid gap-1">
                      {fieldLabel("Metadata Note")}
                      <textarea className="min-h-24 rounded-lg border border-border px-3 py-2 text-sm leading-6" value={form.metadata} onChange={(event) => setForm((current) => ({ ...current, metadata: event.target.value }))} maxLength={3000} />
                    </label>
                  </div>
                  <label className="grid gap-1">
                    {fieldLabel("Edit Note")}
                    <input className="rounded-lg border border-border px-3 py-2 text-sm" value={form.note} onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))} maxLength={1000} />
                  </label>
                  <ActionButton type="button" onClick={saveDraft} disabled={busy || selectedDraftIsTerminal || !form.title.trim() || !form.body.trim()}>
                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                    {selectedDraftIsTerminal ? "Draft Locked" : "Save Draft"}
                  </ActionButton>
                </fieldset>
              </div>

              <div className="mt-5 rounded-lg border border-border bg-white p-4">
                <h3 className="text-lg font-semibold text-primary">CEO Actions</h3>
                <label className="mt-3 grid gap-1">
                  {fieldLabel("Decision Note")}
                  <textarea
                    className="min-h-24 rounded-lg border border-border px-3 py-2 text-sm leading-6"
                    value={decisionNotes[selectedDraft.id] ?? ""}
                    onChange={(event) => setDecisionNotes((current) => ({ ...current, [selectedDraft.id]: event.target.value }))}
                    maxLength={1000}
                  />
                </label>
                {selectedDraftIsTerminal ? (
                  <div className="mt-3 rounded-lg border border-border bg-surface p-3 text-sm font-semibold text-muted">
                    CEO decision is already recorded. Incompatible actions are disabled.
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <ActionButton type="button" onClick={() => decideDraft("approve")} disabled={busy}>
                      <CheckCircle2 className="mr-2 h-4 w-4" aria-hidden="true" />
                      {busy ? "Recording..." : "Approve Draft"}
                    </ActionButton>
                    <ActionButton type="button" onClick={() => decideDraft("request_changes")} disabled={busy} className="bg-amber-700 hover:bg-amber-800">
                      <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                      Request Changes
                    </ActionButton>
                    <ActionButton type="button" onClick={() => decideDraft("reject")} disabled={busy} className="bg-red-700 hover:bg-red-800">
                      <XCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Reject Draft
                    </ActionButton>
                  </div>
                )}
              </div>

              <div className="mt-5 rounded-lg border border-border bg-white p-4">
                <h3 className="text-lg font-semibold text-primary">Version History</h3>
                <dl className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-primary">Created By Department</dt>
                    <dd className="break-words text-muted">{selectedDraft.department}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-primary">Last Modified</dt>
                    <dd className="break-words text-muted">{selectedDraft.lastModifiedAt ? `${formatDate(selectedDraft.lastModifiedAt)} by ${selectedDraft.lastModifiedBy ?? "CEO"}` : "Not modified yet"}</dd>
                  </div>
                </dl>
                <div className="mt-3 space-y-2">
                  {selectedDraft.revisions.length > 0 ? (
                    selectedDraft.revisions.map((revision) => (
                      <div key={revision.id} className="rounded-lg border border-border bg-surface p-3 text-sm">
                        <p className="font-semibold text-primary">{formatLabel(revision.action)}</p>
                        <p className="mt-1 text-muted">{formatDate(revision.createdAt)} by {revision.reviewer ?? "CEO"}</p>
                        {revision.note ? <p className="mt-2 break-words leading-6 text-muted">{revision.note}</p> : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No revisions recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
                providerCalled:false liveExecutionAllowed:false externalExecutionAllowed:false published:false sent:false workflowStarted:false
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
