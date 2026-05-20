"use client";

import { getApprovalActionLabel } from "@/components/dashboard/approval-confirmation-modal";
import { getApprovalStateLabel } from "@/components/dashboard/approval-state-badge";
import type { ApprovalQueueAction } from "@/components/dashboard/approval-confirmation-modal";

type ApprovalHistoryItem = {
  action: string;
  fromStatus?: string;
  toStatus: string;
  note?: string;
  at: string;
};

type ApprovalHistoryLead = {
  approvalStatus?: string | null;
  latestApprovalAction?: string | null;
  latestApprovalNote?: string | null;
  latestApprovalAt?: string | null;
  approvalHistory?: unknown[];
};

type ApprovalHistoryPanelProps = {
  lead: ApprovalHistoryLead;
  compact?: boolean;
};

function formatDate(value?: string | null) {
  if (!value) return "No activity time recorded";
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? "Unknown time" : date.toLocaleString();
}

function formatAction(action?: string | null) {
  if (!action) return "No approval action recorded";

  return getApprovalActionLabel(action as ApprovalQueueAction) || action.replaceAll("_", " ");
}

function isHistoryItem(item: unknown): item is ApprovalHistoryItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  return "action" in item && "toStatus" in item && "at" in item;
}

export function ApprovalHistoryPanel({ lead, compact = false }: ApprovalHistoryPanelProps) {
  const history = Array.isArray(lead.approvalHistory) ? lead.approvalHistory.filter(isHistoryItem).slice(0, compact ? 2 : 5) : [];

  return (
    <div className="rounded border bg-gray-50 p-3 text-sm">
      <p className="text-xs font-semibold uppercase text-gray-500">Latest approval activity</p>
      <div className="mt-2 space-y-1 text-gray-700">
        <p>
          <span className="font-semibold text-gray-950">Current state:</span> {getApprovalStateLabel(lead.approvalStatus)}
        </p>
        <p>
          <span className="font-semibold text-gray-950">Latest action:</span> {formatAction(lead.latestApprovalAction)}
        </p>
        <p>
          <span className="font-semibold text-gray-950">Time:</span> {formatDate(lead.latestApprovalAt)}
        </p>
        {lead.latestApprovalNote ? (
          <p>
            <span className="font-semibold text-gray-950">Note:</span> {lead.latestApprovalNote}
          </p>
        ) : (
          <p className="text-gray-500">No latest note captured.</p>
        )}
      </div>

      {history.length > 0 ? (
        <div className="mt-3 border-t pt-3">
          <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Recent lightweight transitions</p>
          <div className="space-y-2">
            {history.map((item) => (
              <div key={`${item.action}-${item.at}`} className="rounded border bg-white p-2">
                <p className="font-semibold text-gray-900">
                  {formatAction(item.action)} to {getApprovalStateLabel(item.toStatus)}
                </p>
                <p className="text-xs text-gray-500">{formatDate(item.at)}</p>
                {item.note ? <p className="mt-1 text-gray-700">{item.note}</p> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
