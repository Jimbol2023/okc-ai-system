"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { LayoutList, Table2 } from "lucide-react";

import { getActiveDistressFlags } from "@/lib/distress-flags";
import { deleteLead, fetchLeads } from "@/lib/leads-api";
import { formatLeadSourceTag } from "@/lib/lead-source";
import type { LeadStatus, StoredLead } from "@/lib/leads-storage";
import { createManualFollowUpWorkspaceModel, type ManualFollowUpWorkspaceModel } from "@/lib/manual-follow-up-workspace-usability";
import { createRealManualLeadDecision, type RealManualLeadDecision } from "@/lib/real-manual-lead-operations-decision-adapter";
import { analyzeRevenuePipelineLead } from "@/lib/revenue-pipeline";

const PIPELINE_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "negotiating",
  "under_contract",
  "closed",
];

/* =====================================================
   STEP 2B.8C — PIPELINE AI BADGE LAYER
   -----------------------------------------------------
   PURPOSE:
   - Show AI/seller status directly on pipeline + table
   - Make AI replies visible before opening lead detail
   - Keep cards linked to detail page
   - Do NOT auto-send anything
===================================================== */

type LeadWithAIStatus = StoredLead & {
  requiresHumanApproval?: boolean | null;
  lastSellerReply?: string | null;
  doNotContact?: boolean | null;
  isHot?: boolean | null;
  approvalStatus?: string | null;
  nextFollowUpAt?: string | null;
  automationStatus?: string | null;
};

type AIBadgeData = {
  label: string;
  className: string;
};

type LeadFilter =
  | "all"
  | "high_score"
  | "hot"
  | "needs_review"
  | "overdue_high_score"
  | "approved_not_contacted"
  | "blocked_dnc"
  | "low_quality";

type LeadSort = "score_desc" | "newest" | "follow_up_due" | "priority";

const LEAD_FILTERS: Array<{ value: LeadFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "high_score", label: "High Score" },
  { value: "hot", label: "Hot" },
  { value: "needs_review", label: "Needs Review" },
  { value: "overdue_high_score", label: "Overdue High Score" },
  { value: "approved_not_contacted", label: "Approved Not Contacted" },
  { value: "blocked_dnc", label: "Blocked / DNC" },
  { value: "low_quality", label: "Low Quality" },
];

const LEAD_SORTS: Array<{ value: LeadSort; label: string }> = [
  { value: "score_desc", label: "Score Descending" },
  { value: "newest", label: "Newest" },
  { value: "follow_up_due", label: "Follow-Up Due" },
  { value: "priority", label: "Priority" },
];

function getAIStatusBadges(lead: StoredLead): AIBadgeData[] {
  const l = lead as LeadWithAIStatus;
  const badges: AIBadgeData[] = [];

  if (l.doNotContact) {
    badges.push({
      label: "DNC",
      className: "border-red-300 bg-red-100 text-red-700",
    });
  }

  if (l.requiresHumanApproval) {
    badges.push({
      label: "Needs AI Reply",
      className: "border-orange-300 bg-orange-100 text-orange-800",
    });
  }

  if (l.lastSellerReply) {
    badges.push({
      label: "Seller Replied",
      className: "border-green-300 bg-green-100 text-green-700",
    });
  }

  if (l.isHot) {
    badges.push({
      label: "Hot Lead",
      className: "border-purple-300 bg-purple-100 text-purple-700",
    });
  }

  if (l.approvalStatus === "approved_for_outreach") {
    badges.push({
      label: "Approved",
      className: "border-blue-300 bg-blue-100 text-blue-700",
    });
  }

  if (l.approvalStatus === "rejected") {
    badges.push({
      label: "Rejected",
      className: "border-gray-300 bg-gray-100 text-gray-700",
    });
  }

  return badges;
}

/* =====================================================
   PIPELINE HELPERS
===================================================== */

function getPipelineButtonLabel(status: LeadStatus) {
  if (status === "new") return "Mark Contacted";
  if (status === "contacted") return "Start Negotiation";
  if (status === "negotiating") return "Mark Under Contract";
  if (status === "under_contract") return "Mark Closed";
  return "Closed";
}

function getNextPipelineStatus(status: LeadStatus): LeadStatus {
  if (status === "new") return "contacted";
  if (status === "contacted") return "negotiating";
  if (status === "negotiating") return "under_contract";
  if (status === "under_contract") return "closed";
  return "closed";
}

function getNextAction(status: LeadStatus) {
  if (status === "new") return "Manual seller review";
  if (status === "contacted") return "Manual follow-up review";
  if (status === "negotiating") return "Manual offer review";
  if (status === "under_contract") return "Manual closing review";
  return "No active review";
}

function isFollowUpDue(lead: StoredLead) {
  const leadWithDates = lead as StoredLead & {
    lastContactedAt?: Date | string | null;
    nextFollowUpAt?: Date | string | null;
    updatedAt?: string | null;
  };

  if (leadWithDates.nextFollowUpAt) {
    const nextFollowUp = new Date(leadWithDates.nextFollowUpAt).getTime();

    return !Number.isNaN(nextFollowUp) && nextFollowUp <= Date.now();
  }

  const dateToCheck = leadWithDates.lastContactedAt ?? leadWithDates.updatedAt;

  if (!dateToCheck || lead.status !== "contacted") return false;

  const last = new Date(dateToCheck).getTime();
  if (Number.isNaN(last)) return false;

  const hoursSince = (Date.now() - last) / (1000 * 60 * 60);

  return hoursSince > 24;
}

function needsReview(lead: StoredLead) {
  return lead.approvalStatus === "pending_review" || lead.approvalStatus === "needs_human_review" || Boolean(lead.requiresHumanApproval);
}

function isOutreachBlocked(lead: StoredLead) {
  return Boolean(lead.doNotContact) || lead.automationStatus === "idle" || lead.approvalStatus === "rejected";
}

function isHighScore(lead: StoredLead) {
  return lead.score >= 70 || lead.priority === "High";
}

function isLowQuality(lead: StoredLead) {
  return lead.score < 40 && lead.priority === "Low";
}

function isApprovedNotContacted(lead: StoredLead) {
  return lead.approvalStatus === "approved_for_outreach" && lead.status === "new";
}

function shouldWorkFirst(lead: StoredLead) {
  return !isOutreachBlocked(lead) && (isHighScore(lead) || Boolean(lead.isHot)) && (needsReview(lead) || isFollowUpDue(lead) || lead.status === "new");
}

function getPriorityRank(lead: StoredLead) {
  if (lead.priority === "High") return 3;
  if (lead.priority === "Medium") return 2;
  return 1;
}

function getTime(value?: Date | string | null) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getScoreTone(lead: StoredLead) {
  if (lead.score >= 70) return "border-red-200 bg-red-50 text-red-700";
  if (lead.score >= 40) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-slate-600";
}

function getCompactScoreExplanation(lead: StoredLead) {
  const flags = getActiveDistressFlags(lead.distressFlags);

  if (flags.length > 0) {
    return flags.slice(0, 3).map((flag) => flag.label).join(", ");
  }

  return lead.scoreBreakdown || "No distress signals captured yet.";
}

function getMissingDataLabels(lead: StoredLead) {
  return [
    !lead.phone ? "phone" : "",
    !lead.propertyAddress ? "address" : "",
    !lead.city ? "city" : "",
    !lead.zipCode ? "ZIP" : "",
    !lead.source ? "source" : "",
  ].filter(Boolean);
}

function matchesFilter(lead: StoredLead, filter: LeadFilter) {
  if (filter === "high_score") return isHighScore(lead);
  if (filter === "hot") return lead.priority === "High" || Boolean(lead.isHot);
  if (filter === "needs_review") return needsReview(lead);
  if (filter === "overdue_high_score") return isHighScore(lead) && isFollowUpDue(lead);
  if (filter === "approved_not_contacted") return isApprovedNotContacted(lead);
  if (filter === "blocked_dnc") return Boolean(lead.doNotContact) || isOutreachBlocked(lead);
  if (filter === "low_quality") return isLowQuality(lead);

  return true;
}

function sortLeads(leads: StoredLead[], sort: LeadSort) {
  return [...leads].sort((a, b) => {
    if (sort === "newest") return getTime(b.timestamp) - getTime(a.timestamp);
    if (sort === "follow_up_due") return getTime(a.nextFollowUpAt) - getTime(b.nextFollowUpAt);
    if (sort === "priority") return getPriorityRank(b) - getPriorityRank(a) || b.score - a.score;

    return b.score - a.score;
  });
}

function formatStatus(status: LeadStatus) {
  return status.replace("_", " ");
}

/* =====================================================
   UI BADGES
===================================================== */

function StatusBadge({ status }: { status: LeadStatus }) {
  const color =
    status === "closed"
      ? "bg-green-100 text-green-700"
      : status === "under_contract"
        ? "bg-blue-100 text-blue-700"
        : status === "negotiating"
          ? "bg-purple-100 text-purple-700"
          : status === "contacted"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700";

  return (
    <span className={`rounded border px-2 py-1 text-xs font-bold ${color}`}>
      {formatStatus(status)}
    </span>
  );
}

function AIBadge({ badge }: { badge: AIBadgeData }) {
  return (
    <span className={`rounded border px-2 py-1 text-xs font-bold ${badge.className}`}>
      {badge.label}
    </span>
  );
}

function ScoreBadge({ lead }: { lead: StoredLead }) {
  return (
    <span className={`rounded border px-2 py-1 text-xs font-bold ${getScoreTone(lead)}`}>
      Lead Score {lead.score}
    </span>
  );
}

function RevenueActionSummary({ lead }: { lead: StoredLead }) {
  const revenueLead = analyzeRevenuePipelineLead(lead);

  return (
    <div className="rounded border border-blue-100 bg-blue-50 px-3 py-2 text-xs leading-5 text-blue-950">
      <p className="font-bold">Next money action: {revenueLead.nextMoneyAction.label}</p>
      <p className="mt-1">{revenueLead.bucket.replaceAll("_", " ")} | Rank {revenueLead.monetizationRank}</p>
      {revenueLead.blockers.length > 0 ? (
        <p className="mt-1 font-semibold text-[#9f3a22]">Blocked: {revenueLead.blockers.slice(0, 2).join(", ")}</p>
      ) : null}
    </div>
  );
}

function getDecisionTone(decisionLane: RealManualLeadDecision["decisionLane"]) {
  if (decisionLane === "stop_do_not_work") return "border-red-200 bg-red-50 text-red-800";
  if (decisionLane === "cleanup_before_decision") return "border-amber-200 bg-amber-50 text-amber-800";
  if (decisionLane === "review_risk_first") return "border-orange-200 bg-orange-50 text-orange-800";
  if (decisionLane === "review_revenue_now" || decisionLane === "review_revenue_today") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (decisionLane === "terminal_no_decision") return "border-slate-200 bg-slate-50 text-slate-600";
  if (decisionLane === "consolidate_instead_of_expand") return "border-indigo-200 bg-indigo-50 text-indigo-800";
  return "border-gray-200 bg-gray-50 text-gray-700";
}

function formatDecisionLabel(label: string) {
  return label.replaceAll("_", " ");
}

function LeadDecisionSummary({ decision }: { decision: RealManualLeadDecision }) {
  return (
    <div className={`rounded border px-3 py-2 text-xs leading-5 ${getDecisionTone(decision.decisionLane)}`}>
      <p className="font-bold">Manual decision: {formatDecisionLabel(decision.decisionLane)}</p>
      <p className="mt-1">{decision.safeManualNextReview}</p>
      <p className="mt-1 font-semibold">Source: {decision.sourceVisible}</p>
      {decision.missingData.length > 0 ? (
        <p className="mt-1 font-semibold">Cleanup: {decision.missingData.slice(0, 3).join(", ")}</p>
      ) : null}
    </div>
  );
}

function getFollowUpWorkspaceTone(lane: ManualFollowUpWorkspaceModel["lane"]) {
  if (lane === "blocked_no_follow_up") return "border-red-200 bg-red-50 text-red-800";
  if (lane === "cleanup_before_follow_up") return "border-amber-200 bg-amber-50 text-amber-800";
  if (lane === "overdue_manual_review") return "border-orange-200 bg-orange-50 text-orange-800";
  if (lane === "due_soon_manual_review" || lane === "ready_for_manual_follow_up_review") return "border-cyan-200 bg-cyan-50 text-cyan-900";
  if (lane === "terminal_no_follow_up") return "border-slate-200 bg-slate-50 text-slate-600";
  if (lane === "pause_low_value") return "border-gray-200 bg-gray-50 text-gray-700";
  return "border-teal-200 bg-teal-50 text-teal-900";
}

function getFollowUpWorkspaceLabel(lane: ManualFollowUpWorkspaceModel["lane"]) {
  if (lane === "blocked_no_follow_up") return "Blocked / do not contact";
  if (lane === "cleanup_before_follow_up") return "Cleanup before follow-up";
  if (lane === "overdue_manual_review") return "Overdue manual review";
  if (lane === "due_soon_manual_review") return "Due soon";
  if (lane === "ready_for_manual_follow_up_review") return "Ready for manual review";
  if (lane === "pause_low_value") return "Pause low value";
  if (lane === "terminal_no_follow_up") return "Terminal";
  return "Monitor only";
}

function getCompactFollowUpReviewCue(lane: ManualFollowUpWorkspaceModel["lane"]) {
  if (lane === "blocked_no_follow_up") return "No follow-up work.";
  if (lane === "cleanup_before_follow_up") return "Clean up data first.";
  if (lane === "overdue_manual_review") return "Review timing today.";
  if (lane === "due_soon_manual_review") return "Review upcoming timing.";
  if (lane === "ready_for_manual_follow_up_review") return "Ready for operator review.";
  if (lane === "pause_low_value") return "Consider pause or nurture.";
  if (lane === "terminal_no_follow_up") return "No active follow-up.";
  return "Monitor only.";
}

function FollowUpWorkspaceSummary({ followUp }: { followUp: ManualFollowUpWorkspaceModel }) {
  return (
    <div className={`rounded border px-3 py-2 text-xs leading-5 ${getFollowUpWorkspaceTone(followUp.lane)}`}>
      <p className="font-bold">Follow-up: {getFollowUpWorkspaceLabel(followUp.lane)}</p>
      <p className="mt-1">{followUp.timingLabel}</p>
      <p className="mt-1 font-semibold">{getCompactFollowUpReviewCue(followUp.lane)}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em]">Source: {followUp.sourceVisible}</p>
      {followUp.missingData.length > 0 ? (
        <p className="mt-1 font-semibold">Before follow-up: {followUp.missingData.slice(0, 3).join(", ")}</p>
      ) : null}
    </div>
  );
}

function LeadMobileCard({
  lead,
  isUpdating,
  isClosed,
  aiBadges,
  missingData,
  decision,
  followUp,
  onAdvance,
  onDelete,
}: {
  lead: StoredLead;
  isUpdating: boolean;
  isClosed: boolean;
  aiBadges: AIBadgeData[];
  missingData: string[];
  decision: RealManualLeadDecision;
  followUp: ManualFollowUpWorkspaceModel;
  onAdvance: (lead: StoredLead) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/dashboard/leads/${lead.id}` as Route}
            className="block truncate font-semibold hover:underline"
          >
            {lead.firstName} {lead.lastName}
          </Link>
          <Link
            href={`/dashboard/leads/${lead.id}` as Route}
            className="mt-1 block text-sm text-gray-600 hover:underline"
          >
            {lead.propertyAddress}
          </Link>
        </div>
        <ScoreBadge lead={lead} />
      </div>

      <div className="mt-3 grid gap-2 text-sm text-gray-700">
        <p>{lead.phone || "No phone on file"}</p>
        <p className="text-xs font-semibold text-gray-500">{formatLeadSourceTag(lead.source)}</p>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <StatusBadge status={lead.status} />
        <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-600">
          {lead.priority} Priority
        </span>
        {aiBadges.map((badge) => (
          <AIBadge key={`${lead.id}-${badge.label}`} badge={badge} />
        ))}
      </div>

      <p className="mt-3 text-xs leading-5 text-gray-600">{getCompactScoreExplanation(lead)}</p>
      {missingData.length > 0 ? (
        <p className="mt-1 text-xs font-semibold text-gray-500">Missing: {missingData.join(", ")}</p>
      ) : null}

      <div className="mt-3">
        <LeadDecisionSummary decision={decision} />
      </div>

      <div className="mt-3">
        <FollowUpWorkspaceSummary followUp={followUp} />
      </div>

      <div className="mt-3">
        <RevenueActionSummary lead={lead} />
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold text-blue-700">{getNextAction(lead.status)}</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onAdvance(lead)}
            disabled={isUpdating || isClosed}
            className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : getPipelineButtonLabel(lead.status)}
          </button>
          <button
            type="button"
            onClick={() => onDelete(lead.id)}
            className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

/* =====================================================
   API HELPERS
===================================================== */

async function patchLeadStatus(id: string, status: LeadStatus) {
  const res = await fetch(`/api/leads/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    credentials: "include",
  });

  if (!res.ok) {
    let message = "Failed to update lead status.";

    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  const data = await res.json();
  return data.lead as StoredLead;
}

/* =====================================================
   PAGE COMPONENT
===================================================== */

export default function DashboardLeadsPage() {
  const [leads, setLeads] = useState<StoredLead[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "pipeline">("table");
  const [activeFilter, setActiveFilter] = useState<LeadFilter>("all");
  const [activeSort, setActiveSort] = useState<LeadSort>("score_desc");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await fetchLeads();
        setLeads(data);
      } catch {
        setError("Failed to load leads.");
      } finally {
        setIsLoading(false);
      }
    }

    void load();
  }, []);

  async function handleDelete(id: string) {
    try {
      setLeads(await deleteLead(id));
    } catch {
      alert("Delete failed");
    }
  }

  async function handleAdvance(lead: StoredLead) {
    const next = getNextPipelineStatus(lead.status);

    try {
      setUpdatingId(lead.id);
      const updated = await patchLeadStatus(lead.id, next);

      setLeads((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const nextStatus = result.destination.droppableId as LeadStatus;

    const lead = leads.find((item) => item.id === leadId);
    if (!lead || lead.status === nextStatus) return;

    try {
      setUpdatingId(leadId);
      const updated = await patchLeadStatus(leadId, nextStatus);

      setLeads((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch {
      alert("Drag update failed.");
    } finally {
      setUpdatingId(null);
    }
  }

  const visibleLeads = sortLeads(
    leads.filter((lead) => matchesFilter(lead, activeFilter)),
    activeSort,
  );
  const groupedLeads = PIPELINE_STATUSES.map((status) => ({
    status,
    leads: visibleLeads.filter((lead) => lead.status === status),
  }));
  const newLeadCount = leads.filter((lead) => lead.status === "new").length;
  const overdueLeadCount = leads.filter(isFollowUpDue).length;
  const hotLeadCount = leads.filter((lead) => lead.priority === "High" || lead.isHot).length;
  const needsReviewCount = leads.filter(needsReview).length;
  const blockedOutreachCount = leads.filter(isOutreachBlocked).length;
  const approvalPendingCount = leads.filter((lead) => lead.approvalStatus === "pending_review").length;
  const workFirstCount = leads.filter(shouldWorkFirst).length;
  const highPriorityCount = leads.filter(isHighScore).length;
  const dncCount = leads.filter((lead) => lead.doNotContact).length;
  const leadDecisions = leads.map(createRealManualLeadDecision);
  const reviewNowCount = leadDecisions.filter((decision) => decision.decisionLane === "review_revenue_now").length;
  const cleanupDecisionCount = leadDecisions.filter((decision) => decision.decisionLane === "cleanup_before_decision").length;
  const stopDecisionCount = leadDecisions.filter((decision) => decision.decisionLane === "stop_do_not_work").length;

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      {/* =====================================================
          PAGE HEADER / VIEW TOGGLE
      ===================================================== */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">{visibleLeads.length} visible of {leads.length} total</p>
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${
              viewMode === "table" ? "bg-gray-900 text-white shadow-sm" : "text-gray-700"
            }`}
          >
            <Table2 className="h-4 w-4" />
            Table View
          </button>

          <button
            type="button"
            onClick={() => setViewMode("pipeline")}
            className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold ${
              viewMode === "pipeline" ? "bg-gray-900 text-white shadow-sm" : "text-gray-700"
            }`}
          >
            <LayoutList className="h-4 w-4" />
            Pipeline View
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        {[
          ["Work First", workFirstCount],
          ["Review Now", reviewNowCount],
          ["Cleanup First", cleanupDecisionCount],
          ["Stop / DNC", stopDecisionCount],
          ["High Priority", highPriorityCount],
          ["New", newLeadCount],
          ["Overdue", overdueLeadCount],
          ["Hot", hotLeadCount],
          ["Needs Review", needsReviewCount],
          ["Blocked", blockedOutreachCount],
          ["DNC", dncCount],
          ["Approval Pending", approvalPendingCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 grid gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm lg:grid-cols-[1fr_240px]">
        <div className="flex flex-wrap gap-2">
          {LEAD_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
              className={`min-h-10 rounded-md border px-3 py-2 text-xs font-semibold ${
                activeFilter === filter.value ? "border-gray-900 bg-gray-900 text-white" : "bg-white text-gray-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase text-gray-500">Sort</span>
          <select
            value={activeSort}
            onChange={(event) => setActiveSort(event.target.value as LeadSort)}
            className="min-h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {LEAD_SORTS.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {leads.length === 0 ? (
        <div>No leads yet.</div>
      ) : visibleLeads.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-500">No leads match the current filter.</div>
      ) : viewMode === "pipeline" ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {groupedLeads.map((group) => (
              <Droppable droppableId={group.status} key={group.status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-w-[260px] rounded border bg-gray-50 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h2 className="text-sm font-bold capitalize">
                        {formatStatus(group.status)}
                      </h2>

                      <span className="rounded bg-white px-2 py-1 text-xs font-semibold">
                        {group.leads.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {group.leads.length === 0 ? (
                        <div className="rounded border border-dashed bg-white p-3 text-xs text-gray-400">
                          No leads
                        </div>
                      ) : null}

                      {group.leads.map((lead, index) => {
                        const isUpdating = updatingId === lead.id;
                        const isClosed = lead.status === "closed";
                        const aiBadges = getAIStatusBadges(lead);
                        const decision = createRealManualLeadDecision(lead);
                        const followUp = createManualFollowUpWorkspaceModel(lead);

                        return (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                          >
                            {(dragProvided) => (
                              <div
                                ref={dragProvided.innerRef}
                                {...dragProvided.draggableProps}
                                {...dragProvided.dragHandleProps}
                                className={`rounded border bg-white p-3 shadow-sm ${
                                  lead.priority === "High"
                                    ? "border-red-500"
                                    : ""
                                }`}
                              >
                                {/* CLICKABLE LEAD DETAIL LINKS */}

                                <Link
                                  href={`/dashboard/leads/${lead.id}` as Route}
                                  className="block font-semibold hover:underline"
                                >
                                  {lead.firstName} {lead.lastName}
                                </Link>

                                <Link
                                  href={`/dashboard/leads/${lead.id}` as Route}
                                  className="mt-1 block text-xs text-gray-500 hover:underline"
                                >
                                  {lead.propertyAddress}
                                </Link>

                                {/* STATUS + AI BADGES */}

                                <div className="mt-3 flex flex-wrap gap-2">
                                  <ScoreBadge lead={lead} />
                                  <span className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-gray-700">
                                    {lead.priority} Priority
                                  </span>
                                  <StatusBadge status={lead.status} />
                                  <span className="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-gray-600">
                                    {formatLeadSourceTag(lead.source)}
                                  </span>

                                  {aiBadges.map((badge) => (
                                    <AIBadge
                                      key={`${lead.id}-${badge.label}`}
                                      badge={badge}
                                    />
                                  ))}
                                </div>

                                {aiBadges.length > 0 ? (
                                  <p className="mt-2 text-[11px] font-semibold text-orange-700">
                                    AI attention needed
                                  </p>
                                ) : null}

                                <p className="mt-2 text-xs leading-5 text-gray-600">
                                  {getCompactScoreExplanation(lead)}
                                </p>

                                {getMissingDataLabels(lead).length > 0 ? (
                                  <p className="mt-2 text-[11px] font-semibold text-gray-500">
                                    Missing: {getMissingDataLabels(lead).join(", ")}
                                  </p>
                                ) : null}

                                <p className="mt-2 text-xs font-semibold text-blue-600">
                                  Next: {getNextAction(lead.status)}
                                </p>

                                <div className="mt-2">
                                  <LeadDecisionSummary decision={decision} />
                                </div>

                                <div className="mt-2">
                                  <FollowUpWorkspaceSummary followUp={followUp} />
                                </div>

                                <div className="mt-2">
                                  <RevenueActionSummary lead={lead} />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAdvance(lead)}
                                  disabled={isUpdating || isClosed}
                                  className="mt-3 w-full rounded border px-2 py-1 text-xs disabled:opacity-50"
                                >
                                  {isUpdating
                                    ? "Updating..."
                                    : getPipelineButtonLabel(lead.status)}
                                </button>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <>
          <div className="grid gap-3 lg:hidden">
            {visibleLeads.map((lead) => {
              const isUpdating = updatingId === lead.id;
              const isClosed = lead.status === "closed";
              const aiBadges = getAIStatusBadges(lead);
              const missingData = getMissingDataLabels(lead);
              const decision = createRealManualLeadDecision(lead);
              const followUp = createManualFollowUpWorkspaceModel(lead);

              return (
                <LeadMobileCard
                  key={lead.id}
                  lead={lead}
                  isUpdating={isUpdating}
                  isClosed={isClosed}
                  aiBadges={aiBadges}
                  missingData={missingData}
                  decision={decision}
                  followUp={followUp}
                  onAdvance={handleAdvance}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-lg border border-gray-200 bg-white lg:block">
            <table className="min-w-[1480px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b text-xs uppercase text-gray-500">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Lead Score</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Approval</th>
              <th className="p-3 text-left">Score Explanation</th>
              <th className="p-3 text-left">AI Status</th>
              <th className="p-3 text-left">Next Action</th>
              <th className="p-3 text-left">Manual Decision</th>
              <th className="p-3 text-left">Follow-Up Review</th>
              <th className="p-3 text-left">Revenue Action</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {visibleLeads.map((lead) => {
              const isUpdating = updatingId === lead.id;
              const isClosed = lead.status === "closed";
              const aiBadges = getAIStatusBadges(lead);
              const missingData = getMissingDataLabels(lead);
              const decision = createRealManualLeadDecision(lead);
              const followUp = createManualFollowUpWorkspaceModel(lead);

              return (
                <tr key={lead.id} className="border-b align-middle last:border-b-0 hover:bg-gray-50/70">
                  <td className="p-3 font-semibold">
                    <Link
                      href={`/dashboard/leads/${lead.id}` as Route}
                      className="hover:underline"
                    >
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </td>

                  <td className="p-3">{lead.phone}</td>

                  <td className="p-3">
                    <Link
                      href={`/dashboard/leads/${lead.id}` as Route}
                      className="hover:underline"
                    >
                      {lead.propertyAddress}
                    </Link>
                  </td>

                  <td className="p-3">
                    <div className="flex flex-col gap-1">
                      <ScoreBadge lead={lead} />
                      <span className="text-xs font-semibold text-gray-500">{lead.priority} Priority</span>
                    </div>
                  </td>

                  <td className="p-3 text-xs font-semibold text-gray-600">
                    {formatLeadSourceTag(lead.source)}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={lead.status} />
                  </td>

                  <td className="p-3 text-xs font-semibold text-gray-600">
                    {lead.approvalStatus?.replaceAll("_", " ") ?? "pending review"}
                  </td>

                  <td className="max-w-[260px] p-3 text-xs leading-5 text-gray-600">
                    <p>{getCompactScoreExplanation(lead)}</p>
                    {missingData.length > 0 ? (
                      <p className="mt-1 font-semibold text-gray-500">Missing: {missingData.join(", ")}</p>
                    ) : null}
                  </td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {aiBadges.length > 0 ? (
                        aiBadges.map((badge) => (
                          <AIBadge
                            key={`${lead.id}-${badge.label}`}
                            badge={badge}
                          />
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>

                  <td className="p-3 text-xs font-semibold text-blue-600">
                    {getNextAction(lead.status)}
                  </td>

                  <td className="max-w-[280px] p-3">
                    <LeadDecisionSummary decision={decision} />
                  </td>

                  <td className="max-w-[280px] p-3">
                    <FollowUpWorkspaceSummary followUp={followUp} />
                  </td>

                  <td className="max-w-[260px] p-3">
                    <RevenueActionSummary lead={lead} />
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleAdvance(lead)}
                      disabled={isUpdating || isClosed}
                      className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                    >
                      {isUpdating
                        ? "Updating..."
                        : getPipelineButtonLabel(lead.status)}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
