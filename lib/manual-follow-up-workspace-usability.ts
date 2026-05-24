import type { StoredLead } from "./leads-storage";
import { z10ManualRevenueDecisionFlags } from "./z10-manual-revenue-decision-policy";

export const manualFollowUpWorkspaceFlags = {
  ...z10ManualRevenueDecisionFlags,
  followUpMessageSent: false,
  followUpProviderCalled: false,
  followUpTaskCreated: false,
  followUpReminderCreated: false,
  followUpCalendarItemCreated: false,
  followUpQueueCreated: false,
  followUpAutomationTriggered: false,
  followUpContactExecuted: false,
  followUpOutboundContactAllowed: false,
} as const;

export const manualFollowUpWorkspaceLanes = [
  "blocked_no_follow_up",
  "cleanup_before_follow_up",
  "overdue_manual_review",
  "due_soon_manual_review",
  "ready_for_manual_follow_up_review",
  "monitor_follow_up",
  "pause_low_value",
  "terminal_no_follow_up",
] as const;

export type ManualFollowUpWorkspaceLane = (typeof manualFollowUpWorkspaceLanes)[number];

export type ManualFollowUpWorkspaceModel = {
  leadId: string;
  leadLabel: string;
  lane: ManualFollowUpWorkspaceLane;
  timingLabel: string;
  blockerFlags: string[];
  cleanupFlags: string[];
  missingData: string[];
  safeManualNextReview: string;
  sourceVisible: string;
  dueAt: string | null;
  advisoryOnly: true;
  flags: typeof manualFollowUpWorkspaceFlags;
};

export type ManualFollowUpWorkspaceList = {
  leads: ManualFollowUpWorkspaceModel[];
  laneCounts: Record<ManualFollowUpWorkspaceLane, number>;
  advisoryOnly: true;
  flags: typeof manualFollowUpWorkspaceFlags;
};

const oneDayMs = 24 * 60 * 60 * 1000;

function getLeadLabel(lead: StoredLead) {
  const name = `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();
  return name || lead.propertyAddress || lead.id;
}

function getDateTime(value?: Date | string | null) {
  if (!value) return null;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function getPendingFollowUpTimes(lead: StoredLead) {
  return (lead.followUps ?? [])
    .filter((followUp) => followUp.status === "pending")
    .map((followUp) => getDateTime(followUp.date))
    .filter((time): time is number => typeof time === "number")
    .sort((a, b) => a - b);
}

function getNextManualFollowUpTime(lead: StoredLead) {
  const explicitNext = getDateTime(lead.nextFollowUpAt);
  const pendingTimes = getPendingFollowUpTimes(lead);
  const candidates = [explicitNext, ...pendingTimes].filter((time): time is number => typeof time === "number");

  if (candidates.length === 0) return null;

  return Math.min(...candidates);
}

export function getManualFollowUpWorkspaceMissingData(lead: StoredLead) {
  return [
    !lead.source ? "source" : "",
    !lead.phone && !lead.email ? "contact" : "",
    !lead.propertyAddress ? "property address" : "",
  ].filter(Boolean);
}

function isFollowUpBlocked(lead: StoredLead) {
  return Boolean(lead.doNotContact) || lead.approvalStatus === "rejected";
}

function isLowValueRepeatedFollowUp(lead: StoredLead) {
  const visibleFollowUpCount = lead.followUpCount ?? lead.followUps?.length ?? 0;
  return lead.priority === "Low" && lead.score < 40 && visibleFollowUpCount >= 3;
}

function getTimingLabel(lane: ManualFollowUpWorkspaceLane, dueAt: number | null, now: Date) {
  if (lane === "blocked_no_follow_up") return "Follow-up blocked";
  if (lane === "terminal_no_follow_up") return "Terminal lead";
  if (lane === "cleanup_before_follow_up") return "Cleanup required before follow-up review";
  if (lane === "pause_low_value") return "Low-value repeated follow-up";
  if (!dueAt) return "No follow-up time captured";

  const dueDate = new Date(dueAt).toISOString();
  if (dueAt <= now.getTime()) return `Overdue since ${dueDate}`;
  if (dueAt - now.getTime() <= oneDayMs) return `Due soon at ${dueDate}`;

  return `Next follow-up at ${dueDate}`;
}

function getSafeManualNextReview(lane: ManualFollowUpWorkspaceLane) {
  if (lane === "blocked_no_follow_up") return "Do not follow up. Manually review DNC, rejected, or contact-safety state.";
  if (lane === "terminal_no_follow_up") return "No active follow-up review for this terminal lead.";
  if (lane === "cleanup_before_follow_up") return "Complete missing lead data before any manual follow-up review.";
  if (lane === "overdue_manual_review") return "Review overdue follow-up manually; no message, call, reminder, or task is created.";
  if (lane === "due_soon_manual_review") return "Review upcoming follow-up timing manually; no schedule or reminder is written.";
  if (lane === "ready_for_manual_follow_up_review") return "Review seller context and decide the next manual follow-up outside automation.";
  if (lane === "pause_low_value") return "Consider low-frequency nurture or pause after manual review; no automated follow-up is triggered.";

  return "Monitor follow-up context; no active follow-up pressure is detected.";
}

function classifyManualFollowUpLane(lead: StoredLead, now: Date): ManualFollowUpWorkspaceLane {
  if (isFollowUpBlocked(lead)) return "blocked_no_follow_up";
  if (lead.status === "closed") return "terminal_no_follow_up";

  const missingData = getManualFollowUpWorkspaceMissingData(lead);
  if (missingData.length > 0) return "cleanup_before_follow_up";

  const dueAt = getNextManualFollowUpTime(lead);
  if (dueAt && dueAt <= now.getTime()) return "overdue_manual_review";
  if (dueAt && dueAt - now.getTime() <= oneDayMs) return "due_soon_manual_review";

  if (lead.status === "contacted" && (lead.priority === "High" || lead.score >= 70)) {
    return "ready_for_manual_follow_up_review";
  }

  if (isLowValueRepeatedFollowUp(lead)) return "pause_low_value";

  return "monitor_follow_up";
}

export function createManualFollowUpWorkspaceModel(lead: StoredLead, now = new Date()): ManualFollowUpWorkspaceModel {
  const lane = classifyManualFollowUpLane(lead, now);
  const missingData = getManualFollowUpWorkspaceMissingData(lead);
  const dueAtTime = getNextManualFollowUpTime(lead);
  const blockerFlags = [
    lead.doNotContact ? "do not contact" : "",
    lead.approvalStatus === "rejected" ? "approval rejected" : "",
  ].filter(Boolean);
  const cleanupFlags = missingData.map((item) => `missing ${item}`);

  return {
    leadId: lead.id,
    leadLabel: getLeadLabel(lead),
    lane,
    timingLabel: getTimingLabel(lane, dueAtTime, now),
    blockerFlags,
    cleanupFlags,
    missingData,
    safeManualNextReview: getSafeManualNextReview(lane),
    sourceVisible: lead.source || "missing source",
    dueAt: dueAtTime ? new Date(dueAtTime).toISOString() : null,
    advisoryOnly: true,
    flags: manualFollowUpWorkspaceFlags,
  };
}

function createEmptyLaneCounts(): Record<ManualFollowUpWorkspaceLane, number> {
  return manualFollowUpWorkspaceLanes.reduce(
    (counts, lane) => ({ ...counts, [lane]: 0 }),
    {} as Record<ManualFollowUpWorkspaceLane, number>,
  );
}

export function createManualFollowUpWorkspaceList(leads: StoredLead[], now = new Date()): ManualFollowUpWorkspaceList {
  const lanePriority: Record<ManualFollowUpWorkspaceLane, number> = {
    blocked_no_follow_up: 100,
    cleanup_before_follow_up: 90,
    overdue_manual_review: 80,
    due_soon_manual_review: 70,
    ready_for_manual_follow_up_review: 60,
    monitor_follow_up: 40,
    pause_low_value: 30,
    terminal_no_follow_up: 10,
  };
  const models = leads.map((lead) => createManualFollowUpWorkspaceModel(lead, now));
  const laneCounts = models.reduce((counts, model) => {
    counts[model.lane] += 1;
    return counts;
  }, createEmptyLaneCounts());

  return {
    leads: [...models].sort(
      (a, b) =>
        lanePriority[b.lane] - lanePriority[a.lane] ||
        a.lane.localeCompare(b.lane) ||
        a.leadId.localeCompare(b.leadId),
    ),
    laneCounts,
    advisoryOnly: true,
    flags: manualFollowUpWorkspaceFlags,
  };
}

export function createManualFollowUpWorkspaceUsabilitySummary(leads: StoredLead[] = [], now = new Date()) {
  const workspace = createManualFollowUpWorkspaceList(leads, now);

  return {
    phase: "Manual Follow-Up Workspace Usability" as const,
    followUpWorkspaceUsabilityReady: true,
    z10ConsolidationControlsDecisionLayer: true,
    advisoryOnly: true,
    laneCounts: workspace.laneCounts,
    unresolvedUiUsabilityBlockers: [
      "Lead detail page follow-up review is not yet consolidated around this workspace model.",
      "No follow-up workspace actions are created because this pass is read-only and advisory.",
    ],
    untouchedExecutionBoundaries: [
      "No provider calls, SMS, email, calls, reminders, calendar items, queues, task creation, storage writes, audit writes, CRM mutation expansion, autonomous status movement, or outbound communication behavior is authorized.",
    ],
    recommendedNextExactStep: "Lead Detail Manual Review Usability",
    flags: manualFollowUpWorkspaceFlags,
  };
}
