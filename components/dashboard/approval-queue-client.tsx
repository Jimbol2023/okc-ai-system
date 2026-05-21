"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ApprovalConfirmationModal, type ApprovalQueueAction } from "@/components/dashboard/approval-confirmation-modal";
import { ApprovalHistoryPanel } from "@/components/dashboard/approval-history-panel";
import { ApprovalStateBadge } from "@/components/dashboard/approval-state-badge";
import { MockOutreachPanel } from "@/components/dashboard/mock-outreach-panel";
import { OutreachReadinessPanel } from "@/components/dashboard/outreach-readiness-panel";
import { getActiveDistressFlags, type DistressFlags } from "@/lib/distress-flags";
import { formatLeadSourceTag } from "@/lib/lead-source";

type ApprovalLane =
  | "all"
  | "pending_review"
  | "needs_human_review"
  | "approved_for_outreach"
  | "follow_up_only"
  | "rejected"
  | "blocked_dnc"
  | "high_score"
  | "overdue";

type ApprovalSort = "score_desc" | "newest" | "follow_up_due" | "priority";

type MockOutreachHistoryItem = {
  id: string;
  at: string;
  provider: "mock" | "not_called";
  mode: "simulation" | "live_disabled";
  simulated: boolean;
  blocked: boolean;
  sent: false;
  wouldSend: false;
  providerCalled?: false;
  targetPhone?: string | null;
  messagePreview?: string | null;
  reasonCodes: string[];
  reasons: string[];
  missingRequirements: string[];
};

type ApprovalQueueLead = {
  id: string;
  timestamp?: Date | string | null;
  firstName?: string | null;
  lastName?: string | null;
  ownerName?: string | null;
  propertyAddress?: string | null;
  source?: string | null;
  status?: string | null;
  score?: number | null;
  priority?: string | null;
  scoreBreakdown?: string | null;
  distressFlags?: DistressFlags | null;
  phone?: string | null;
  approvalStatus?: string | null;
  doNotContact?: boolean | null;
  requiresHumanApproval?: boolean | null;
  suggestedReply?: string | null;
  lastFollowUpMessage?: string | null;
  automationStatus?: string | null;
  nextFollowUpAt?: Date | string | null;
  isHot?: boolean | null;
  latestApprovalAction?: string | null;
  latestApprovalNote?: string | null;
  latestApprovalAt?: string | null;
  approvalHistory?: unknown[];
  latestMockOutreachAt?: string | null;
  latestMockOutreachResult?: string | null;
  latestMockOutreachMessage?: string | null;
  latestMockOutreachBlockedReasons?: string[];
  mockOutreachHistory?: MockOutreachHistoryItem[];
};

type ApprovalRouteResponse = {
  ok: boolean;
  lead?: Partial<ApprovalQueueLead>;
  sent?: boolean;
  error?: string;
};

type LeadsApiResponse = ApprovalQueueLead[] | { leads?: ApprovalQueueLead[] };

const lanes: Array<{ value: ApprovalLane; label: string }> = [
  { value: "pending_review", label: "Pending Review" },
  { value: "needs_human_review", label: "Needs Human Review" },
  { value: "approved_for_outreach", label: "Approved Not Sent" },
  { value: "follow_up_only", label: "Follow-Up Only" },
  { value: "rejected", label: "Rejected" },
  { value: "blocked_dnc", label: "Blocked / DNC" },
  { value: "high_score", label: "High Score" },
  { value: "overdue", label: "Overdue" },
];

const sorts: Array<{ value: ApprovalSort; label: string }> = [
  { value: "score_desc", label: "Score Descending" },
  { value: "newest", label: "Newest" },
  { value: "follow_up_due", label: "Follow-Up Due" },
  { value: "priority", label: "Priority" },
];

type PendingConfirmation = {
  lead: ApprovalQueueLead;
  action: ApprovalQueueAction;
};

type ApprovalQueueObservabilitySummary = {
  totalQueueItems: number;
  reviewBacklogCount: number;
  blockedCount: number;
  governanceReviewRequiredCount: number;
  humanReviewRequiredCount: number;
  missingDataCount: number;
  safetyReasonCount: number;
  workloadSummary: string;
  reviewReasonSummary: string;
  safetyReasonSummary: string;
  queueClassification: string;
};

const emptyDistressFlags: DistressFlags = {
  taxDelinquent: false,
  inheritedProperty: false,
  vacantProperty: false,
  foreclosureRisk: false,
  majorRepairs: false,
  tiredLandlord: false,
  urgentTimeline: false,
  outOfStateOwner: false,
};

async function readJsonResponse<T>(response: Response, fallbackError: string): Promise<T> {
  const data = (await response.json().catch(() => null)) as (T & { error?: string }) | null;

  if (!response.ok || !data) {
    throw new Error(data?.error || fallbackError);
  }

  return data;
}

async function fetchApprovalQueueLeads() {
  const response = await fetch("/api/leads", {
    headers: {
      Accept: "application/json",
    },
  });
  const data = await readJsonResponse<LeadsApiResponse>(response, "Failed to load approval queue.");

  return Array.isArray(data) ? data : data.leads ?? [];
}

async function updateLeadApprovalState({
  leadId,
  action,
  message,
  note,
}: {
  leadId: string;
  action: ApprovalQueueAction;
  message?: string;
  note?: string;
}) {
  const response = await fetch(`/api/leads/${leadId}/approval`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, message, note }),
  });

  return readJsonResponse<ApprovalRouteResponse>(response, "Approval update failed.");
}

function getTime(value?: Date | string | null) {
  if (!value) return 0;
  const time = new Date(value).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function isFollowUpDue(lead: ApprovalQueueLead) {
  const followUpTime = getTime(lead.nextFollowUpAt);

  return followUpTime > 0 && followUpTime <= Date.now();
}

function isBlocked(lead: ApprovalQueueLead) {
  return Boolean(lead.doNotContact) || lead.approvalStatus === "rejected";
}

function isHighScore(lead: ApprovalQueueLead) {
  return (lead.score ?? 0) >= 70 || lead.priority === "High" || Boolean(lead.isHot);
}

function needsReview(lead: ApprovalQueueLead) {
  return lead.approvalStatus === "pending_review" || lead.approvalStatus === "needs_human_review" || Boolean(lead.requiresHumanApproval);
}

function shouldWorkFirst(lead: ApprovalQueueLead) {
  return !isBlocked(lead) && isHighScore(lead) && (needsReview(lead) || isFollowUpDue(lead) || lead.status === "new");
}

function hasMissingApprovalQueueData(lead: ApprovalQueueLead) {
  return !lead.propertyAddress || !lead.phone || !lead.source;
}

function hasSafetyReason(lead: ApprovalQueueLead) {
  return isBlocked(lead) || (lead.latestMockOutreachBlockedReasons?.length ?? 0) > 0;
}

function deriveApprovalQueueObservability(leads: ApprovalQueueLead[]): ApprovalQueueObservabilitySummary {
  const reviewBacklogCount = leads.filter(
    (lead) => needsReview(lead) || lead.approvalStatus === "pending_review" || lead.approvalStatus === "follow_up_only",
  ).length;
  const blockedCount = leads.filter(isBlocked).length;
  const governanceReviewRequiredCount = leads.filter(
    (lead) => lead.approvalStatus === "needs_human_review" || lead.requiresHumanApproval === true,
  ).length;
  const humanReviewRequiredCount = leads.filter(needsReview).length;
  const missingDataCount = leads.filter(hasMissingApprovalQueueData).length;
  const safetyReasonCount = leads.filter(hasSafetyReason).length;
  const workFirstCount = leads.filter(shouldWorkFirst).length;
  const overdueCount = leads.filter(isFollowUpDue).length;

  return {
    totalQueueItems: leads.length,
    reviewBacklogCount,
    blockedCount,
    governanceReviewRequiredCount,
    humanReviewRequiredCount,
    missingDataCount,
    safetyReasonCount,
    workloadSummary:
      leads.length === 0
        ? "No approval queue records are visible."
        : `${reviewBacklogCount} records need manual review across ${leads.length} queue records.`,
    reviewReasonSummary:
      workFirstCount > 0 || overdueCount > 0
        ? `${workFirstCount} work-first records and ${overdueCount} overdue manual follow-ups are visible.`
        : "No work-first or overdue manual follow-up pressure is visible.",
    safetyReasonSummary:
      blockedCount > 0 || safetyReasonCount > 0
        ? `${blockedCount} blocked records and ${safetyReasonCount} safety reason summaries are visible as do-not-proceed signals.`
        : "No blocked or safety reason summary is visible from current queue data.",
    queueClassification:
      blockedCount > 0 || governanceReviewRequiredCount > 0 || missingDataCount > 0
        ? "Non-actionable review workload: resolve blockers, missing data, and governance review manually."
        : "Non-actionable review workload: continue human review before any seller or buyer-facing action.",
  };
}

function ApprovalQueueObservabilityPanel({ leads }: { leads: ApprovalQueueLead[] }) {
  const summary = deriveApprovalQueueObservability(leads);
  const metricItems = [
    ["Review backlog", summary.reviewBacklogCount],
    ["Blocked records", summary.blockedCount],
    ["Governance review", summary.governanceReviewRequiredCount],
    ["Missing data", summary.missingDataCount],
  ];

  return (
    <section
      aria-labelledby="approval-queue-observability-heading"
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            Read-only observability
          </p>
          <h2 id="approval-queue-observability-heading" className="mt-1 text-lg font-bold text-slate-950">
            Approval queue observability
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Approval review does not send messages, activate providers, or grant execution permission.
            Human review remains required before any seller or buyer-facing action.
          </p>
        </div>

        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-950">
          <p className="font-bold">Do-not-proceed visibility</p>
          <p className="mt-2">
            DNC, opt-out, blocked, rejected, incomplete-data, and governance-risk signals remain manual review
            blockers. This panel adds no controls and performs no state changes.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricItems.map(([label, value]) => (
          <div key={label} className="rounded border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 text-sm lg:grid-cols-3">
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800">
          <p className="font-bold">Advisory workload</p>
          <p className="mt-2">{summary.workloadSummary}</p>
          <p className="mt-2">{summary.reviewReasonSummary}</p>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-950">
          <p className="font-bold">Safety reasons</p>
          <p className="mt-2">{summary.safetyReasonSummary}</p>
          <p className="mt-2">{summary.humanReviewRequiredCount} records currently show human-review-required visibility.</p>
        </div>
        <div className="rounded border border-blue-200 bg-blue-50 p-3 text-blue-950">
          <p className="font-bold">Queue classification</p>
          <p className="mt-2">{summary.queueClassification}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-blue-900">
            readOnly:true advisoryOnly:true simulationOnly:true approvalGrantsExecution:false
          </p>
        </div>
      </div>
    </section>
  );
}

function getPriorityRank(lead: ApprovalQueueLead) {
  if (lead.priority === "High") return 3;
  if (lead.priority === "Medium") return 2;
  return 1;
}

function matchesLane(lead: ApprovalQueueLead, lane: ApprovalLane) {
  if (lane === "all") return true;
  if (lane === "blocked_dnc") return Boolean(lead.doNotContact);
  if (lane === "high_score") return isHighScore(lead);
  if (lane === "overdue") return isFollowUpDue(lead);

  return (lead.approvalStatus ?? "pending_review") === lane;
}

function sortLeads(leads: ApprovalQueueLead[], sort: ApprovalSort) {
  return [...leads].sort((a, b) => {
    if (sort === "newest") return getTime(b.timestamp) - getTime(a.timestamp);
    if (sort === "follow_up_due") return getTime(a.nextFollowUpAt) - getTime(b.nextFollowUpAt);
    if (sort === "priority") return getPriorityRank(b) - getPriorityRank(a) || (b.score ?? 0) - (a.score ?? 0);

    return (b.score ?? 0) - (a.score ?? 0);
  });
}

function getLeadName(lead: ApprovalQueueLead) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown Lead";
}

function getScoreTone(lead: ApprovalQueueLead) {
  const score = lead.score ?? 0;

  if (score >= 70) return "border-red-200 bg-red-50 text-red-700";
  if (score >= 40) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getScoreExplanation(lead: ApprovalQueueLead) {
  const flags = getActiveDistressFlags(lead.distressFlags ?? emptyDistressFlags);

  if (flags.length > 0) {
    return flags.slice(0, 4).map((flag) => flag.label).join(", ");
  }

  return lead.scoreBreakdown || "No score explanation captured yet.";
}

function getSuggestedNextAction(lead: ApprovalQueueLead) {
  if (lead.doNotContact) return "Do not approve outreach. Keep blocked.";
  if (lead.approvalStatus === "approved_for_outreach") return "Ready for future controlled send step. Nothing sent in R3.";
  if (lead.approvalStatus === "follow_up_only") return "Plan follow-up. Do not send automatically.";
  if (lead.approvalStatus === "rejected") return "Leave rejected or return to review if facts changed.";
  if (isFollowUpDue(lead)) return "Review overdue follow-up before any approval.";
  if (isHighScore(lead)) return "Review score explanation and decide next state.";

  return "Review lead facts and choose a safe state.";
}

function countByLane(leads: ApprovalQueueLead[], lane: ApprovalLane) {
  return leads.filter((lead) => matchesLane(lead, lane)).length;
}

export function ApprovalQueueClient() {
  const [leads, setLeads] = useState<ApprovalQueueLead[]>([]);
  const [activeLane, setActiveLane] = useState<ApprovalLane>("pending_review");
  const [activeSort, setActiveSort] = useState<ApprovalSort>("score_desc");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadLeads() {
    try {
      setError(null);
      setLeads(await fetchApprovalQueueLeads());
    } catch {
      setError("Failed to load approval queue.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadLeads();
  }, []);

  const visibleLeads = useMemo(
    () => sortLeads(leads.filter((lead) => matchesLane(lead, activeLane)), activeSort),
    [activeLane, activeSort, leads],
  );
  const summaryItems = [
    ["Pending Review", countByLane(leads, "pending_review")],
    ["Needs Human Review", countByLane(leads, "needs_human_review")],
    ["Approved Not Sent", countByLane(leads, "approved_for_outreach")],
    ["Follow-Up Only", countByLane(leads, "follow_up_only")],
    ["Rejected", countByLane(leads, "rejected")],
    ["Blocked / DNC", countByLane(leads, "blocked_dnc")],
    ["Work First", leads.filter(shouldWorkFirst).length],
    ["Overdue", countByLane(leads, "overdue")],
  ];

  function requestAction(lead: ApprovalQueueLead, action: ApprovalQueueAction) {
    setError(null);
    setDecisionNote("");
    setPendingConfirmation({ lead, action });
  }

  async function applyAction(lead: ApprovalQueueLead, action: ApprovalQueueAction, note?: string) {
    const message = lead.suggestedReply || lead.lastFollowUpMessage || undefined;

    try {
      setUpdatingId(lead.id);
      setStatusMessage(null);
      setError(null);
      const result = await updateLeadApprovalState({
        leadId: lead.id,
        action,
        message,
        note,
      });

      if (result.sent !== false) {
        throw new Error("Approval route did not confirm sent:false.");
      }

      setLeads((currentLeads) =>
        currentLeads.map((currentLead) =>
          currentLead.id === lead.id
            ? {
                ...currentLead,
                ...result.lead,
              }
            : currentLead,
        ),
      );
      setStatusMessage("State updated. No SMS or email was sent.");
      setPendingConfirmation(null);
      setDecisionNote("");
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Approval update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (isLoading) {
    return <div className="rounded border bg-white p-4 text-sm text-gray-500">Loading approval queue...</div>;
  }

  return (
    <div className="space-y-6">
      {statusMessage ? <p className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{statusMessage}</p> : null}
      {error ? <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <ApprovalQueueObservabilityPanel leads={leads} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summaryItems.map(([label, value]) => (
          <div key={label} className="rounded border bg-white p-3">
            <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 rounded border bg-white p-3 md:grid-cols-[1fr_240px]">
        <div className="flex flex-wrap gap-2">
          {lanes.map((lane) => (
            <button
              key={lane.value}
              type="button"
              onClick={() => setActiveLane(lane.value)}
              className={`rounded border px-3 py-2 text-xs font-semibold ${
                activeLane === lane.value ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-700"
              }`}
            >
              {lane.label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">Sort</span>
          <select
            value={activeSort}
            onChange={(event) => setActiveSort(event.target.value as ApprovalSort)}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            {sorts.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleLeads.length === 0 ? (
        <div className="rounded border bg-white p-4 text-sm text-gray-500">No leads in this approval lane.</div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visibleLeads.map((lead) => {
            const flags = getActiveDistressFlags(lead.distressFlags ?? emptyDistressFlags);
            const isUpdating = updatingId === lead.id;
            const canApprove = !lead.doNotContact && Boolean(lead.suggestedReply || lead.lastFollowUpMessage);

            return (
              <article key={lead.id} className={`rounded border bg-white p-4 ${shouldWorkFirst(lead) ? "border-red-300" : "border-gray-200"}`}>
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Link href={`/dashboard/leads/${lead.id}` as Route} className="text-lg font-semibold text-gray-950 hover:underline">
                      {getLeadName(lead)}
                    </Link>
                    <p className="mt-1 text-sm text-gray-600">{lead.propertyAddress || "Property address not captured"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ApprovalStateBadge approvalStatus={lead.approvalStatus} />
                    {lead.doNotContact ? <span className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-700">DNC</span> : null}
                    {isFollowUpDue(lead) ? <span className="rounded border border-orange-200 bg-orange-50 px-2 py-1 text-xs font-bold text-orange-800">Overdue</span> : null}
                    {shouldWorkFirst(lead) ? <span className="rounded border border-red-200 bg-red-50 px-2 py-1 text-xs font-bold text-red-700">Work First</span> : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-4">
                  <div className={`rounded border p-3 ${getScoreTone(lead)}`}>
                    <p className="text-xs font-semibold uppercase">Lead Score</p>
                    <p className="mt-1 text-2xl font-black">{lead.score ?? 0}</p>
                  </div>
                  <div className="rounded border bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Priority</p>
                    <p className="mt-1 font-bold text-gray-900">{lead.priority ?? "Low"}</p>
                  </div>
                  <div className="rounded border bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Source</p>
                    <p className="mt-1 font-bold text-gray-900">{formatLeadSourceTag(lead.source ?? "unknown")}</p>
                  </div>
                  <div className="rounded border bg-gray-50 p-3">
                    <p className="text-xs font-semibold uppercase text-gray-500">Automation</p>
                    <p className="mt-1 font-bold text-gray-900">{lead.automationStatus ?? "unknown"}</p>
                  </div>
                </div>

                <div className="mt-4 rounded border bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase text-gray-500">Score Explanation</p>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{getScoreExplanation(lead)}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {flags.length > 0 ? (
                    flags.slice(0, 5).map((flag) => (
                      <span key={flag.key} className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                        {flag.label}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">No distress flags captured.</span>
                  )}
                </div>

                <div className="mt-4 rounded border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                  <span className="font-semibold">Suggested next action:</span> {getSuggestedNextAction(lead)}
                </div>

                <div className="mt-4">
                  <ApprovalHistoryPanel lead={lead} compact />
                </div>

                <div className="mt-4">
                  <OutreachReadinessPanel lead={lead} compact />
                </div>

                <div className="mt-4">
                  <MockOutreachPanel
                    lead={lead}
                    compact
                    onLeadUpdate={(updatedLead) => {
                      setLeads((currentLeads) =>
                        currentLeads.map((currentLead) =>
                          currentLead.id === lead.id
                            ? {
                                ...currentLead,
                                ...updatedLead,
                              }
                            : currentLead,
                        ),
                      );
                    }}
                  />
                </div>

                {lead.doNotContact ? (
                  <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                    Do Not Contact protection is active. Approval for outreach is blocked.
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => requestAction(lead, "approve")}
                    disabled={isUpdating || !canApprove}
                    className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve, Not Sent
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(lead, "needs_human_review")}
                    disabled={isUpdating}
                    className="rounded border border-orange-200 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800 disabled:opacity-50"
                  >
                    Needs Human Review
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(lead, "follow_up_only")}
                    disabled={isUpdating}
                    className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 disabled:opacity-50"
                  >
                    Follow-Up Only
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(lead, "pending_review")}
                    disabled={isUpdating}
                    className="rounded border px-3 py-2 text-xs font-semibold text-gray-700 disabled:opacity-50"
                  >
                    Return to Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => requestAction(lead, "reject")}
                    disabled={isUpdating}
                    className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 disabled:opacity-50"
                  >
                    Reject Lead
                  </button>
                </div>
                {!canApprove && !lead.doNotContact ? (
                  <p className="mt-2 text-xs font-semibold text-gray-500">
                    Approve requires a suggested reply or follow-up message. No send action is available here.
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      )}

      {pendingConfirmation ? (
        <ApprovalConfirmationModal
          lead={pendingConfirmation.lead}
          action={pendingConfirmation.action}
          messagePreview={pendingConfirmation.lead.suggestedReply || pendingConfirmation.lead.lastFollowUpMessage || undefined}
          note={decisionNote}
          isSubmitting={updatingId === pendingConfirmation.lead.id}
          error={error}
          onNoteChange={setDecisionNote}
          onCancel={() => {
            setPendingConfirmation(null);
            setDecisionNote("");
          }}
          onConfirm={() => applyAction(pendingConfirmation.lead, pendingConfirmation.action, decisionNote)}
        />
      ) : null}
    </div>
  );
}
