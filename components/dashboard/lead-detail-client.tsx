"use client";

/* =====================================================
   LEAD DETAIL CLIENT — SAFE PRO VERSION
   -----------------------------------------------------
   FIXES:
   - Correctly reads API response: { ok: true, lead }
   - Restores LeadDetailClient named export
   - Shows AI Reply Panel when lastSellerReply exists
   - Keeps human approval before sending
   - Keeps DNC protection
   - Approves/rejects AI replies without sending SMS or email
===================================================== */

import Link from "next/link";
import { useEffect, useState } from "react";

import { ApprovalConfirmationModal } from "@/components/dashboard/approval-confirmation-modal";
import { ApprovalHistoryPanel } from "@/components/dashboard/approval-history-panel";
import { ApprovalStateBadge, getApprovalStateLabel } from "@/components/dashboard/approval-state-badge";
import { ClosingReadinessPanel } from "@/components/dashboard/closing-readiness-panel";
import { DispositionReadinessPanel } from "@/components/dashboard/disposition-readiness-panel";
import { MockOutreachPanel } from "@/components/dashboard/mock-outreach-panel";
import { OperatorExecutionBoundaryPanel } from "@/components/dashboard/operator-execution-boundary-panel";
import { OutreachReadinessPanel } from "@/components/dashboard/outreach-readiness-panel";
import { SellerCallOutcomeForm } from "@/components/dashboard/seller-call-outcome-form";
import { SellerCallOutcomeHistory, type SellerCallOutcomeHistoryItem } from "@/components/dashboard/seller-call-outcome-history";
import { SellerCallOutcomePlanPanel } from "@/components/dashboard/seller-call-outcome-plan-panel";
import { getActiveDistressFlags, type DistressFlags } from "@/lib/distress-flags";
import { formatLeadSourceTag } from "@/lib/lead-source";
import { updateLeadApprovalState, type ApprovalQueueAction } from "@/lib/leads-api";
import type { StoredLead } from "@/lib/leads-storage";

/* =============================
   TYPES
============================= */

type Lead = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  phone?: string | null;
  propertyAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  source?: string | null;
  status?: string | null;
  score?: number | null;
  priority?: "High" | "Medium" | "Low" | string | null;
  opportunityScore?: "High" | "Medium" | "Low" | string | null;
  scoreBreakdown?: string | null;
  distressFlags?: DistressFlags | null;
  analyzer?: {
    arv: string;
    estimatedRepairs: string;
    desiredProfit: string;
  };
  followUps?: Array<{
    id: string;
    date: string;
    type: "sms" | "email" | "call";
    message: string;
    status: "pending" | "completed";
    completedAt?: string;
  }>;

  lastSellerReply?: string | null;
  lastSellerReplyAt?: string | null;
  lastSellerReplyIntent?: string | null;
  lastSellerReplyConfidence?: number | null;

  requiresHumanApproval?: boolean | null;
  suggestedReply?: string | null;

  doNotContact?: boolean | null;
  automationStatus?: string | null;
  approvalStatus?: string | null;
  nextFollowUpAt?: Date | string | null;
  followUpCount?: number | null;
  isHot?: boolean | null;
  latestApprovalAction?: string | null;
  latestApprovalNote?: string | null;
  latestApprovalAt?: string | null;
  approvalHistory?: Array<{
    action: string;
    fromStatus: string;
    toStatus: string;
    note?: string;
    at: string;
  }>;
  latestMockOutreachAt?: string | null;
  latestMockOutreachResult?: string | null;
  latestMockOutreachMessage?: string | null;
  latestMockOutreachBlockedReasons?: string[];
  mockOutreachHistory?: Array<{
    id: string;
    at: string;
    provider: "mock" | "not_called";
    mode: "simulation" | "live_disabled";
    simulated: boolean;
    blocked: boolean;
    sent: false;
    wouldSend: false;
    targetPhone?: string | null;
    messagePreview?: string | null;
    reasonCodes: string[];
    reasons: string[];
    missingRequirements: string[];
  }>;
};

type LeadApiResponse = {
  ok: boolean;
  lead?: Lead;
  error?: string;
};

type ApprovalApiResponse = {
  ok: boolean;
  action?: "approve" | "reject";
  sent?: boolean;
  message?: string;
  lead?: Partial<Lead>;
  error?: string;
};

type SellerCallOutcomesApiResponse = {
  ok: boolean;
  outcomes?: SellerCallOutcomeHistoryItem[];
  error?: string;
};

type PendingConfirmation = {
  action: ApprovalQueueAction;
};

/* =============================
   COMPONENT
============================= */

export function LeadDetailClient({ leadId }: { leadId: string }) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [aiReplyText, setAiReplyText] = useState("");
  const [aiReplySendState, setAiReplySendState] =
    useState<"idle" | "saving" | "approved" | "rejected">("idle");
  const [aiReplyError, setAiReplyError] = useState<string | null>(null);
  const [aiReplyStatusMessage, setAiReplyStatusMessage] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [sellerCallOutcomes, setSellerCallOutcomes] = useState<SellerCallOutcomeHistoryItem[]>([]);
  const [sellerCallOutcomeError, setSellerCallOutcomeError] = useState<string | null>(null);

  /* =============================
     FETCH LEAD
  ============================= */

  useEffect(() => {
    async function loadLead() {
      try {
        setLoading(true);
        setLoadError(null);

        const res = await fetch(`/api/leads/${leadId}`, {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as LeadApiResponse;

        if (!res.ok || !data.ok || !data.lead) {
          setLead(null);
          setLoadError(data.error || "Unable to load lead.");
          return;
        }

        setLead(data.lead);
        setAiReplyText(data.lead.suggestedReply ?? "");

        const outcomesResponse = await fetch(`/api/leads/${leadId}/seller-call-outcomes`, {
          method: "GET",
          cache: "no-store",
        });
        const outcomesData = (await outcomesResponse.json()) as SellerCallOutcomesApiResponse;

        if (!outcomesResponse.ok || !outcomesData.ok) {
          setSellerCallOutcomes([]);
          setSellerCallOutcomeError(outcomesData.error || "Unable to load seller call outcomes.");
          return;
        }

        setSellerCallOutcomes(outcomesData.outcomes ?? []);
        setSellerCallOutcomeError(null);
      } catch (error) {
        console.error("Failed to load lead:", error);
        setLead(null);
        setLoadError("Failed to load lead.");
      } finally {
        setLoading(false);
      }
    }

    void loadLead();
  }, [leadId]);

  /* =============================
     APPROVE OR REJECT AI REPLY
  ============================= */

  function requestApproval(action: ApprovalQueueAction) {
    if (!lead) return;

    if (action === "approve" && lead.doNotContact) {
      setAiReplyError("This lead is marked Do Not Contact. Approval was blocked.");
      return;
    }

    if (action === "approve" && !aiReplyText.trim()) {
      setAiReplyError("Approved reply message is empty.");
      return;
    }

    setAiReplyError(null);
    setDecisionNote("");
    setPendingConfirmation({ action });
  }

  async function submitApproval(action: ApprovalQueueAction, note?: string) {
    if (!lead) return;

    try {
      setAiReplySendState("saving");
      setAiReplyError(null);
      setAiReplyStatusMessage(null);

      const data = await updateLeadApprovalState({
        leadId: lead.id,
        action,
        message: aiReplyText.trim(),
        note,
      });

      if (data.lead) {
        setLead((currentLead) =>
          currentLead
            ? {
                ...currentLead,
                ...data.lead,
              }
            : currentLead,
        );
      }

      if (data.lead?.suggestedReply !== undefined) {
        setAiReplyText(data.lead.suggestedReply ?? "");
      }

      setAiReplySendState(action === "approve" ? "approved" : action === "reject" ? "rejected" : "idle");
      setAiReplyStatusMessage("State updated. No SMS or email was sent.");
      setPendingConfirmation(null);
      setDecisionNote("");
    } catch (error) {
      console.error("Failed to update AI reply approval:", error);
      setAiReplyError(
        error instanceof Error ? error.message : "Failed to update approval.",
      );
      setAiReplySendState("idle");
    }
  }

  /* =============================
     HELPERS
  ============================= */

  function formatDate(date?: Date | string | null) {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown";
    }

    return parsedDate.toLocaleString();
  }

  function getLeadName() {
    const fullName = `${lead?.firstName ?? ""} ${lead?.lastName ?? ""}`.trim();

    return fullName || lead?.name || "N/A";
  }

  function getScoreTone(score?: number | null) {
    if (typeof score !== "number") return "border-slate-200 bg-slate-50 text-slate-600";
    if (score >= 70) return "border-red-200 bg-red-50 text-red-700";
    if (score >= 40) return "border-amber-200 bg-amber-50 text-amber-700";
    return "border-slate-200 bg-slate-50 text-slate-600";
  }

  function getMissingDataLabels() {
    if (!lead) return [];

    return [
      !lead.phone ? "phone" : "",
      !lead.propertyAddress ? "address" : "",
      !lead.city ? "city" : "",
      !lead.zipCode ? "ZIP" : "",
      !lead.source ? "source" : "",
    ].filter(Boolean);
  }

  /* =============================
     LOADING STATE
  ============================= */

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex text-sm font-semibold text-primary"
        >
          ← Back to leads
        </Link>

        <div className="rounded-xl border bg-white p-6 text-sm text-muted">
          Loading lead details...
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="space-y-6 p-6">
        <Link
          href="/dashboard/leads"
          className="inline-flex text-sm font-semibold text-primary"
        >
          ← Back to leads
        </Link>

        <div className="rounded-xl border bg-white p-6 text-sm text-red-600">
          {loadError || "Lead not found."}
        </div>
      </div>
    );
  }

  /* =============================
     MAIN UI
  ============================= */

  return (
    <div className="space-y-6 p-6">
      {/* ============================================
          BACK LINK
      ============================================ */}

      <Link
        href="/dashboard/leads"
        className="inline-flex text-sm font-semibold text-primary"
      >
        ← Back to leads
      </Link>

      {/* ============================================
          BASIC LEAD INFO
      ============================================ */}

      <section className="rounded-xl border bg-white p-4">
        <h2 className="mb-2 text-lg font-bold">Lead Info</h2>

        <p>
          <strong>Name:</strong> {getLeadName()}
        </p>
        <p>
          <strong>Phone:</strong> {lead.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {lead.propertyAddress || "N/A"}
        </p>
        <p>
          <strong>Source:</strong> {lead.source ? formatLeadSourceTag(lead.source) : "N/A"}
        </p>
        <p>
          <strong>Approval Status:</strong> {getApprovalStateLabel(lead.approvalStatus)}
        </p>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Lead Score</h2>
            <p className="mt-1 text-sm text-gray-600">
              Deterministic acquisition priority from captured lead facts. This is advisory only.
            </p>
          </div>
          <div className={`w-fit rounded border px-4 py-3 ${getScoreTone(lead.score)}`}>
            <p className="text-xs font-semibold uppercase">Lead Score</p>
            <p className="text-3xl font-black">{typeof lead.score === "number" ? lead.score : "Missing"}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Priority</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{lead.priority ?? "Missing"}</p>
          </div>
          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Opportunity</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{lead.opportunityScore ?? "Missing"}</p>
          </div>
          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Follow-Up Due</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{lead.nextFollowUpAt ? formatDate(lead.nextFollowUpAt) : "Not scheduled"}</p>
          </div>
          <div className="rounded border bg-gray-50 p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Safety</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{lead.doNotContact ? "DNC" : lead.isHot ? "Hot" : "Review"}</p>
          </div>
        </div>

        <div className="mt-4 rounded border bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">Score Explanation</p>
          <p className="mt-2 text-sm leading-6 text-gray-800">
            {lead.scoreBreakdown || "No deterministic score explanation has been captured yet."}
          </p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded border bg-white p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Distress Signals</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {lead.distressFlags && getActiveDistressFlags(lead.distressFlags).length > 0 ? (
                getActiveDistressFlags(lead.distressFlags).map((flag) => (
                  <span key={flag.key} className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                    {flag.label}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">No distress signals captured.</span>
              )}
            </div>
          </div>

          <div className="rounded border bg-white p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">Missing Data</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {getMissingDataLabels().length > 0 ? (
                getMissingDataLabels().map((item) => (
                  <span key={item} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-sm text-gray-500">Core lead fields are present.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Approval Workflow</h2>
            <p className="mt-1 text-sm text-gray-600">
              State changes are human-controlled. No SMS or email is sent from this panel.
            </p>
          </div>
          <ApprovalStateBadge approvalStatus={lead.approvalStatus} />
        </div>

        <div className="mt-4">
          <ApprovalHistoryPanel lead={lead} />
        </div>

        {lead.doNotContact ? (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
            Do Not Contact protection is active. Approval for outreach is blocked.
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => requestApproval("approve")}
            disabled={aiReplySendState === "saving" || !!lead.doNotContact || !aiReplyText.trim()}
            className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve, Not Sent
          </button>
          <button
            type="button"
            onClick={() => requestApproval("reject")}
            disabled={aiReplySendState === "saving"}
            className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:opacity-50"
          >
            Reject Lead
          </button>
          <button
            type="button"
            onClick={() => requestApproval("needs_human_review")}
            disabled={aiReplySendState === "saving"}
            className="rounded border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-800 disabled:opacity-50"
          >
            Needs Human Review
          </button>
          <button
            type="button"
            onClick={() => requestApproval("follow_up_only")}
            disabled={aiReplySendState === "saving"}
            className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 disabled:opacity-50"
          >
            Follow-Up Only
          </button>
          <button
            type="button"
            onClick={() => requestApproval("pending_review")}
            disabled={aiReplySendState === "saving"}
            className="rounded border px-3 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"
          >
            Return to Pending
          </button>
        </div>

        {!aiReplyText.trim() && !lead.doNotContact ? (
          <p className="mt-2 text-xs font-semibold text-gray-500">
            Approve requires a suggested reply or edited message. No send action is available here.
          </p>
        ) : null}
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Outreach Readiness</h2>
        <OutreachReadinessPanel lead={lead} />
      </section>

      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 text-xl font-bold">Mock Outreach Testing</h2>
        <MockOutreachPanel
          lead={lead}
          onLeadUpdate={(updatedLead) => {
            setLead((currentLead) =>
              currentLead
                ? {
                    ...currentLead,
                    ...updatedLead,
                  }
                : currentLead,
            );
          }}
        />
      </section>

      <DispositionReadinessPanel lead={lead as StoredLead} />

      <ClosingReadinessPanel lead={lead as StoredLead} />

      <OperatorExecutionBoundaryPanel lead={lead as StoredLead} />

      <SellerCallOutcomeForm
        leadId={lead.id}
        onOutcomeSaved={(outcome) => {
          setSellerCallOutcomes((currentOutcomes) => [outcome, ...currentOutcomes]);
        }}
      />

      {sellerCallOutcomeError ? (
        <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
          {sellerCallOutcomeError}
        </p>
      ) : null}

      <SellerCallOutcomeHistory outcomes={sellerCallOutcomes} />

      <SellerCallOutcomePlanPanel compact />

      {/* ============================================
          STEP 2B.8 — AI REPLY REVIEW PANEL
      ============================================ */}

      {lead.lastSellerReply ? (
        <section className="rounded-xl border-2 border-blue-300 bg-[#f7fbff] p-5">
          <h2 className="mb-2 text-xl font-bold text-blue-950">
            AI Seller Reply Analysis
          </h2>

          <p className="mb-4 text-sm text-gray-600">
            Human approval is required before any SMS or email can be sent.
          </p>

          {/* Seller Message */}
          <div className="mb-4 rounded border bg-white p-3">
            <p className="mb-1 text-xs text-gray-500">Seller Reply</p>
            <p>{lead.lastSellerReply}</p>
            <p className="mt-2 text-xs text-gray-400">
              {formatDate(lead.lastSellerReplyAt)}
            </p>
          </div>

          {/* AI Insights */}
          <div className="mb-4 grid gap-3 text-sm md:grid-cols-3">
            <div className="rounded border bg-white p-3">
              <strong>Intent:</strong>{" "}
              {lead.lastSellerReplyIntent || "Unknown"}
            </div>

            <div className="rounded border bg-white p-3">
              <strong>Confidence:</strong>{" "}
              {typeof lead.lastSellerReplyConfidence === "number"
                ? `${(lead.lastSellerReplyConfidence * 100).toFixed(0)}%`
                : "Unknown"}
            </div>

            <div className="rounded border bg-white p-3">
              <strong>Approval:</strong>{" "}
              {lead.requiresHumanApproval ? "YES" : "NO"}
            </div>
          </div>

          {/* Editable Reply */}
          <textarea
            value={aiReplyText}
            onChange={(event) => setAiReplyText(event.target.value)}
            rows={5}
            className="mb-3 w-full rounded border p-3"
            placeholder="Edit or approve AI reply..."
          />

          {/* Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => requestApproval("approve")}
              disabled={aiReplySendState === "saving" || !!lead.doNotContact}
              className="rounded bg-orange-500 px-4 py-2 text-white disabled:opacity-50"
            >
              {aiReplySendState === "saving"
                ? "Saving..."
                : "Approve, Not Sent"}
            </button>

            <button
              type="button"
              onClick={() => requestApproval("reject")}
              disabled={aiReplySendState === "saving"}
              className="rounded border border-red-200 px-4 py-2 text-red-700 disabled:opacity-50"
            >
              Reject Lead
            </button>

            <button
              type="button"
              onClick={() => setAiReplyText(lead.suggestedReply || "")}
              className="rounded border px-4 py-2"
            >
              Reset
            </button>
          </div>

          {/* Status Messages */}
          {lead.doNotContact ? (
            <p className="mt-2 text-red-600">
              Do Not Contact — sending disabled
            </p>
          ) : null}

          {aiReplyError ? (
            <p className="mt-2 text-red-600">{aiReplyError}</p>
          ) : null}

          {aiReplyStatusMessage ? (
            <p className="mt-2 text-green-600">
              {aiReplyStatusMessage}
            </p>
          ) : null}
        </section>
      ) : (
        <section className="rounded-xl border bg-white p-5">
          <h2 className="mb-2 text-lg font-bold">AI Seller Reply Analysis</h2>
          <p className="text-sm text-gray-600">
            No seller reply has been captured for this lead yet.
          </p>
        </section>
      )}

      {pendingConfirmation ? (
        <ApprovalConfirmationModal
          lead={lead}
          action={pendingConfirmation.action}
          messagePreview={aiReplyText.trim() || undefined}
          note={decisionNote}
          isSubmitting={aiReplySendState === "saving"}
          error={aiReplyError}
          onNoteChange={setDecisionNote}
          onCancel={() => {
            setPendingConfirmation(null);
            setDecisionNote("");
          }}
          onConfirm={() => submitApproval(pendingConfirmation.action, decisionNote)}
        />
      ) : null}
    </div>
  );
}
