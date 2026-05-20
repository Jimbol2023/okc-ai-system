"use client";

import { getApprovalStateLabel } from "@/components/dashboard/approval-state-badge";

export type ApprovalQueueAction =
  | "approve"
  | "reject"
  | "pending_review"
  | "needs_human_review"
  | "follow_up_only";

type ApprovalLeadSummary = {
  firstName?: string | null;
  lastName?: string | null;
  ownerName?: string | null;
  propertyAddress?: string | null;
  approvalStatus?: string | null;
  doNotContact?: boolean | null;
};

type ApprovalConfirmationModalProps = {
  lead: ApprovalLeadSummary;
  action: ApprovalQueueAction;
  messagePreview?: string;
  note: string;
  isSubmitting: boolean;
  error?: string | null;
  onNoteChange: (note: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const actionCopy: Record<
  ApprovalQueueAction,
  {
    title: string;
    button: string;
    targetState: string;
    noteLabel: string;
    notePlaceholder: string;
    requiresNote: boolean;
  }
> = {
  approve: {
    title: "Approve for Outreach",
    button: "Approve, Not Sent",
    targetState: "approved_for_outreach",
    noteLabel: "Approval note",
    notePlaceholder: "Why is this lead approved for future controlled outreach?",
    requiresNote: false,
  },
  reject: {
    title: "Reject Lead",
    button: "Reject Lead",
    targetState: "rejected",
    noteLabel: "Rejection note",
    notePlaceholder: "Why is this lead being rejected?",
    requiresNote: true,
  },
  needs_human_review: {
    title: "Mark Needs Human Review",
    button: "Needs Human Review",
    targetState: "needs_human_review",
    noteLabel: "Review note",
    notePlaceholder: "What should the next operator review?",
    requiresNote: false,
  },
  follow_up_only: {
    title: "Mark Follow-Up Only",
    button: "Follow-Up Only",
    targetState: "follow_up_only",
    noteLabel: "Follow-up note",
    notePlaceholder: "What follow-up should be planned?",
    requiresNote: false,
  },
  pending_review: {
    title: "Return to Pending Review",
    button: "Return to Pending",
    targetState: "pending_review",
    noteLabel: "Pending review note",
    notePlaceholder: "Why is this lead returning to pending review?",
    requiresNote: false,
  },
};

function getLeadName(lead: ApprovalLeadSummary) {
  const name = `${lead.firstName} ${lead.lastName}`.trim();

  return name || lead.ownerName || "Unknown Lead";
}

export function getApprovalActionLabel(action: ApprovalQueueAction) {
  return actionCopy[action]?.button ?? action.replaceAll("_", " ");
}

export function getApprovalActionTargetState(action: ApprovalQueueAction) {
  return actionCopy[action]?.targetState ?? "pending_review";
}

export function isApprovalNoteRequired(action: ApprovalQueueAction) {
  return Boolean(actionCopy[action]?.requiresNote);
}

export function ApprovalConfirmationModal({
  lead,
  action,
  messagePreview,
  note,
  isSubmitting,
  error,
  onNoteChange,
  onCancel,
  onConfirm,
}: ApprovalConfirmationModalProps) {
  const copy = actionCopy[action];
  const noteIsMissing = copy.requiresNote && !note.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3 sm:items-center">
      <div className="w-full max-w-xl rounded border bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-gray-500">Confirm state change</p>
            <h2 className="mt-1 text-xl font-bold text-gray-950">{copy.title}</h2>
          </div>
          <button type="button" onClick={onCancel} className="rounded border px-3 py-1 text-sm font-semibold text-gray-600">
            Cancel
          </button>
        </div>

        <div className="mt-4 rounded border bg-gray-50 p-3 text-sm">
          <p className="font-semibold text-gray-950">{getLeadName(lead)}</p>
          <p className="mt-1 text-gray-600">{lead.propertyAddress}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p>
              <span className="font-semibold">Current state:</span> {getApprovalStateLabel(lead.approvalStatus)}
            </p>
            <p>
              <span className="font-semibold">Target state:</span> {getApprovalStateLabel(copy.targetState)}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded border border-blue-100 bg-blue-50 p-3 text-sm font-semibold text-blue-900">
          State change only. No SMS or email will be sent. Outreach remains disabled.
        </div>

        {lead.doNotContact && action === "approve" ? (
          <div className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            This lead is marked Do Not Contact. Approval for outreach is blocked.
          </div>
        ) : null}

        {messagePreview && action === "approve" ? (
          <div className="mt-3 rounded border bg-white p-3 text-sm text-gray-700">
            <p className="text-xs font-semibold uppercase text-gray-500">Message saved for future controlled outreach</p>
            <p className="mt-2 line-clamp-3">{messagePreview}</p>
          </div>
        ) : null}

        <label className="mt-4 block">
          <span className="text-sm font-semibold text-gray-700">
            {copy.noteLabel}
            {copy.requiresNote ? " required" : " optional"}
          </span>
          <textarea
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={4}
            maxLength={500}
            className="mt-2 w-full rounded border p-3 text-sm"
            placeholder={copy.notePlaceholder}
          />
        </label>

        {error ? <p className="mt-3 rounded border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2 text-sm font-semibold text-gray-700">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting || noteIsMissing || (Boolean(lead.doNotContact) && action === "approve")}
            className="rounded bg-gray-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : copy.button}
          </button>
        </div>
      </div>
    </div>
  );
}
