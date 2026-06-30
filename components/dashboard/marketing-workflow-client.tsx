"use client";

import { useEffect, useMemo, useState } from "react";

import { marketingChannelLabels, marketingChannels, type MarketingChannel } from "@/types/marketing-workflow";

type MarketingApproval = {
  id: string;
  decision: string;
  note: string;
  editedCopy?: string | null;
  reviewer?: string | null;
  createdAt: string;
};

type MarketingPublishAssist = {
  id: string;
  preparedCopy: string;
  status: string;
  sourceLabel: string;
  manualPublishedUrl?: string | null;
  createdAt: string;
};

type MarketingCanvaAssetAssist = {
  id: string;
  recommendedFormat: string;
  designBrief: string;
  brandSafeCopyBlocks: Array<{
    label: string;
    copy: string;
  }>;
  assetNotes?: string | null;
  manualApprovalStatus: string;
  createdAt: string;
};

type MarketingDraft = {
  id: string;
  channel: MarketingChannel;
  topic: string;
  sourceLabel: string;
  referralLink?: string | null;
  status: string;
  draftCopy: string;
  assetNotes?: string | null;
  createdAt: string;
  approvals: MarketingApproval[];
  publishAssists: MarketingPublishAssist[];
  canvaAssetAssists: MarketingCanvaAssetAssist[];
};

type MarketingAccount = {
  id: string;
  platform: MarketingChannel;
  accountName: string;
  handle: string;
  profileUrl: string;
  verificationStatus: string;
  proofNote: string;
  lastVerifiedAt?: string | null;
};

type WorkflowResponse = {
  ok: boolean;
  drafts?: MarketingDraft[];
  accounts?: MarketingAccount[];
  error?: string;
};

const emptyDraftForm = {
  channel: "facebook" as MarketingChannel,
  topic: "",
  sourceLabel: "",
  referralLink: "",
  assetNotes: "",
};

const emptyAccountForm = {
  platform: "facebook" as MarketingChannel,
  accountName: "",
  handle: "",
  profileUrl: "",
  verificationStatus: "manual_setup",
  proofNote: "",
};

function formatStatus(value: string) {
  return value.replaceAll("_", " ");
}

function sectionTitle(label: string, title: string, description: string) {
  return (
    <div className="space-y-2">
      <p className="break-words text-xs font-bold uppercase tracking-[0.16em] text-muted">{label}</p>
      <h2 className="break-words text-xl font-semibold text-primary">{title}</h2>
      <p className="max-w-3xl break-words text-sm leading-6 text-muted">{description}</p>
    </div>
  );
}

export function MarketingWorkflowClient() {
  const [drafts, setDrafts] = useState<MarketingDraft[]>([]);
  const [accounts, setAccounts] = useState<MarketingAccount[]>([]);
  const [draftForm, setDraftForm] = useState(emptyDraftForm);
  const [accountForm, setAccountForm] = useState(emptyAccountForm);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [editedCopies, setEditedCopies] = useState<Record<string, string>>({});
  const [publishedUrls, setPublishedUrls] = useState<Record<string, string>>({});
  const [canvaAssetNotes, setCanvaAssetNotes] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("Loading marketing workflow...");
  const [busy, setBusy] = useState(false);

  const approvedDrafts = useMemo(() => drafts.filter((draft) => draft.status === "approved" || draft.status === "ready_for_manual_publish"), [drafts]);
  const reviewDrafts = useMemo(() => drafts.filter((draft) => draft.status === "pending_approval" || draft.status === "draft"), [drafts]);

  async function loadWorkflow() {
    const response = await fetch("/api/marketing/drafts", {
      headers: {
        Accept: "application/json",
      },
    });
    const data = (await response.json()) as WorkflowResponse;

    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Unable to load marketing workflow.");
    }

    setDrafts(data.drafts ?? []);
    setAccounts(data.accounts ?? []);
    setMessage("Marketing workflow loaded. No provider accounts were called.");
  }

  useEffect(() => {
    loadWorkflow().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load marketing workflow."));
  }, []);

  async function submitJson(url: string, body: unknown) {
    setBusy(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = (await response.json()) as { ok: boolean; error?: string; errors?: unknown };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Request validation failed.");
      }

      await loadWorkflow();
    } finally {
      setBusy(false);
    }
  }

  async function createDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitJson("/api/marketing/drafts", draftForm);
    setDraftForm(emptyDraftForm);
    setMessage("Template draft created for human approval. No post was created.");
  }

  async function saveAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitJson("/api/marketing/accounts", accountForm);
    setAccountForm(emptyAccountForm);
    setMessage("Manual account proof saved. No OAuth or provider check was started.");
  }

  async function reviewDraft(draft: MarketingDraft, decision: "approve" | "reject" | "edit") {
    const note = notes[draft.id]?.trim();
    const editedCopy = editedCopies[draft.id]?.trim();

    if (!note) {
      setMessage("Add a review note before approving, rejecting, or editing.");
      return;
    }

    if (decision === "edit" && !editedCopy) {
      setMessage("Add edited copy before using the edit action.");
      return;
    }

    await submitJson(`/api/marketing/drafts/${draft.id}/approval`, {
      decision,
      note,
      editedCopy,
      reviewer: "operator",
    });
    setMessage(`Draft ${formatStatus(decision)}. No publishing or messaging occurred.`);
  }

  async function preparePublishAssist(draft: MarketingDraft, markManuallyPublished = false) {
    await submitJson(`/api/marketing/drafts/${draft.id}/publish-assist`, {
      manualPublishedUrl: publishedUrls[draft.id] || "",
      markManuallyPublished,
    });
    setMessage(markManuallyPublished ? "Manual published snapshot recorded." : "Manual publish assist prepared. No platform was called.");
  }

  async function prepareCanvaAssetAssist(draft: MarketingDraft) {
    await submitJson(`/api/marketing/drafts/${draft.id}/canva-asset-assist`, {
      assetNotes: canvaAssetNotes[draft.id] || draft.assetNotes || "",
      manualApprovalStatus: "pending_manual_asset_approval",
    });
    setMessage("Canva design brief prepared for manual approval. No Canva API, export, or design creation occurred.");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-950">
        {message}
      </div>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        {sectionTitle("Phase 2A", "Draft Queue", "Create template-first marketing drafts for Facebook, Instagram, and Google Business Profile.")}
        <form onSubmit={createDraft} className="mt-5 grid gap-3 lg:grid-cols-[0.8fr_1fr_1fr]">
          <select
            className="rounded-xl border border-border bg-white px-3 py-3 text-sm"
            value={draftForm.channel}
            onChange={(event) => setDraftForm((current) => ({ ...current, channel: event.target.value as MarketingChannel }))}
          >
            {marketingChannels.map((channel) => (
              <option key={channel} value={channel}>
                {marketingChannelLabels[channel]}
              </option>
            ))}
          </select>
          <input
            required
            minLength={2}
            maxLength={120}
            className="rounded-xl border border-border bg-white px-3 py-3 text-sm"
            placeholder="Seller-intent topic"
            value={draftForm.topic}
            onChange={(event) => setDraftForm((current) => ({ ...current, topic: event.target.value }))}
          />
          <input
            required
            minLength={2}
            maxLength={80}
            className="rounded-xl border border-border bg-white px-3 py-3 text-sm"
            placeholder="Source label"
            value={draftForm.sourceLabel}
            onChange={(event) => setDraftForm((current) => ({ ...current, sourceLabel: event.target.value }))}
          />
          <input
            type="url"
            maxLength={300}
            className="rounded-xl border border-border bg-white px-3 py-3 text-sm lg:col-span-3"
            placeholder="Optional referral link for manual attribution"
            value={draftForm.referralLink}
            onChange={(event) => setDraftForm((current) => ({ ...current, referralLink: event.target.value }))}
          />
          <textarea
            className="min-h-24 rounded-xl border border-border bg-white px-3 py-3 text-sm lg:col-span-3"
            maxLength={1000}
            placeholder="Optional asset notes"
            value={draftForm.assetNotes}
            onChange={(event) => setDraftForm((current) => ({ ...current, assetNotes: event.target.value }))}
          />
          <button disabled={busy} className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
            Create Draft
          </button>
        </form>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {drafts.map((draft) => (
            <article key={draft.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary">{draft.topic}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-muted">{marketingChannelLabels[draft.channel]} | {draft.sourceLabel}</p>
                </div>
                <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-amber-900">
                  {formatStatus(draft.status)}
                </span>
              </div>
              {draft.referralLink ? <p className="mt-2 break-words text-xs font-semibold text-blue-950">Referral Link: {draft.referralLink}</p> : null}
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">{draft.draftCopy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        {sectionTitle("Phase 2B", "Approval Queue", "Approve, reject, or edit drafts. Approval updates internal state only and never publishes.")}
        <div className="mt-5 grid gap-3">
          {reviewDrafts.map((draft) => (
            <article key={draft.id} className="rounded-2xl border border-border bg-white p-4">
              <h3 className="text-sm font-semibold text-primary">{draft.topic}</h3>
              <textarea
                className="mt-3 min-h-24 w-full rounded-xl border border-border px-3 py-3 text-sm"
                placeholder="Optional edited copy for edit action"
                value={editedCopies[draft.id] ?? ""}
                onChange={(event) => setEditedCopies((current) => ({ ...current, [draft.id]: event.target.value }))}
              />
              <input
                className="mt-3 w-full rounded-xl border border-border px-3 py-3 text-sm"
                placeholder="Required review note"
                value={notes[draft.id] ?? ""}
                onChange={(event) => setNotes((current) => ({ ...current, [draft.id]: event.target.value }))}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => reviewDraft(draft, "approve")} disabled={busy} className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  Approve
                </button>
                <button onClick={() => reviewDraft(draft, "edit")} disabled={busy} className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  Save Edit
                </button>
                <button onClick={() => reviewDraft(draft, "reject")} disabled={busy} className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  Reject
                </button>
              </div>
            </article>
          ))}
          {reviewDrafts.length === 0 ? <p className="rounded-2xl border border-border bg-white p-4 text-sm text-muted">No drafts are waiting for approval.</p> : null}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        {sectionTitle("Phase 2C", "Connected Account Verification", "Record manual proof that Facebook, Instagram, or GBP access is available.")}
        <form onSubmit={saveAccount} className="mt-5 grid gap-3 lg:grid-cols-3">
          <select className="rounded-xl border border-border bg-white px-3 py-3 text-sm" value={accountForm.platform} onChange={(event) => setAccountForm((current) => ({ ...current, platform: event.target.value as MarketingChannel }))}>
            {marketingChannels.map((channel) => (
              <option key={channel} value={channel}>{marketingChannelLabels[channel]}</option>
            ))}
          </select>
          <input required minLength={2} className="rounded-xl border border-border bg-white px-3 py-3 text-sm" placeholder="Account name" value={accountForm.accountName} onChange={(event) => setAccountForm((current) => ({ ...current, accountName: event.target.value }))} />
          <input required minLength={2} className="rounded-xl border border-border bg-white px-3 py-3 text-sm" placeholder="Handle" value={accountForm.handle} onChange={(event) => setAccountForm((current) => ({ ...current, handle: event.target.value }))} />
          <input required type="url" className="rounded-xl border border-border bg-white px-3 py-3 text-sm" placeholder="Profile URL" value={accountForm.profileUrl} onChange={(event) => setAccountForm((current) => ({ ...current, profileUrl: event.target.value }))} />
          <select className="rounded-xl border border-border bg-white px-3 py-3 text-sm" value={accountForm.verificationStatus} onChange={(event) => setAccountForm((current) => ({ ...current, verificationStatus: event.target.value }))}>
            <option value="manual_setup">Manual Setup</option>
            <option value="verified">Verified</option>
            <option value="needs_review">Needs Review</option>
          </select>
          <input required minLength={5} className="rounded-xl border border-border bg-white px-3 py-3 text-sm" placeholder="Manual proof note" value={accountForm.proofNote} onChange={(event) => setAccountForm((current) => ({ ...current, proofNote: event.target.value }))} />
          <button disabled={busy} className="rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white disabled:opacity-60">
            Save Verification
          </button>
        </form>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {accounts.map((account) => (
            <article key={account.id} className="rounded-2xl border border-border bg-white p-4">
              <h3 className="text-sm font-semibold text-primary">{marketingChannelLabels[account.platform]}</h3>
              <p className="mt-2 text-sm text-muted">{account.accountName} | {account.handle}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-muted">{formatStatus(account.verificationStatus)}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{account.proofNote}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        {sectionTitle("Phase 2D", "Manual Publish Assist", "Prepare approved copy and checklists for manual posting outside this app.")}
        <div className="mt-5 grid gap-3">
          {approvedDrafts.map((draft) => (
            <article key={draft.id} className="rounded-2xl border border-border bg-white p-4">
              <h3 className="text-sm font-semibold text-primary">{draft.topic}</h3>
              {draft.referralLink ? <p className="mt-2 break-words text-xs font-semibold text-blue-950">Referral Link: {draft.referralLink}</p> : null}
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">{draft.draftCopy}</p>
              <input className="mt-3 w-full rounded-xl border border-border px-3 py-3 text-sm" type="url" placeholder="Optional manual published URL" value={publishedUrls[draft.id] ?? ""} onChange={(event) => setPublishedUrls((current) => ({ ...current, [draft.id]: event.target.value }))} />
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => preparePublishAssist(draft)} disabled={busy} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  Prepare Assist
                </button>
                <button onClick={() => preparePublishAssist(draft, true)} disabled={busy} className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                  Record Manual Publish
                </button>
              </div>
            </article>
          ))}
          {approvedDrafts.length === 0 ? <p className="rounded-2xl border border-border bg-white p-4 text-sm text-muted">Approve a draft before preparing manual publish assist.</p> : null}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        {sectionTitle("Phase 2D.5", "Canva Asset Assist", "Generate Canva-ready design briefs and brand-safe copy blocks for approved drafts only.")}
        <div className="mt-5 grid gap-3">
          {approvedDrafts.map((draft) => (
            <article key={draft.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-primary">{draft.topic}</h3>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.08em] text-muted">{marketingChannelLabels[draft.channel]} | {draft.sourceLabel}</p>
                  {draft.referralLink ? <p className="mt-2 break-words text-xs font-semibold text-blue-950">Referral Link: {draft.referralLink}</p> : null}
                </div>
                <span className="w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-blue-950">
                  Manual Canva only
                </span>
              </div>
              <textarea
                className="mt-3 min-h-20 w-full rounded-xl border border-border px-3 py-3 text-sm"
                maxLength={1000}
                placeholder="Optional Canva asset notes"
                value={canvaAssetNotes[draft.id] ?? ""}
                onChange={(event) => setCanvaAssetNotes((current) => ({ ...current, [draft.id]: event.target.value }))}
              />
              <button onClick={() => prepareCanvaAssetAssist(draft)} disabled={busy} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-60">
                Generate Canva Brief
              </button>

              {draft.canvaAssetAssists.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {draft.canvaAssetAssists.map((assist) => (
                    <div key={assist.id} className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-950">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <p className="text-sm font-bold">{assist.recommendedFormat}</p>
                        <span className="w-fit rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.08em]">
                          {formatStatus(assist.manualApprovalStatus)}
                        </span>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{assist.designBrief}</p>
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {assist.brandSafeCopyBlocks.map((block) => (
                          <div key={`${assist.id}-${block.label}`} className="rounded-lg border border-blue-100 bg-white p-3">
                            <p className="text-xs font-bold uppercase tracking-[0.08em] text-blue-900">{block.label}</p>
                            <p className="mt-1 text-sm leading-6 text-blue-950">{block.copy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
          {approvedDrafts.length === 0 ? <p className="rounded-2xl border border-border bg-white p-4 text-sm text-muted">Approve a draft before generating Canva asset briefs.</p> : null}
        </div>
      </section>
    </div>
  );
}
