"use client";

import { getApprovalStateLabel } from "@/components/dashboard/approval-state-badge";
import { evaluateOutreachEligibility, type OutreachEligibilityResult, type OutreachLead } from "@/lib/outreach-gating";

type OutreachReadinessPanelProps = {
  lead: OutreachLead;
  compact?: boolean;
};

function getReadinessTone(eligibility: OutreachEligibilityResult) {
  if (eligibility.blocked) return "border-red-200 bg-red-50 text-red-800";
  return "border-blue-200 bg-blue-50 text-blue-900";
}

export function OutreachReadinessPanel({ lead, compact = false }: OutreachReadinessPanelProps) {
  const eligibility = evaluateOutreachEligibility(lead);

  return (
    <div className={`rounded border p-3 text-sm ${getReadinessTone(eligibility)}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase opacity-75">Outreach readiness</p>
          <p className="mt-1 font-bold">
            {eligibility.blocked ? "Blocked for outreach" : "Eligible for future send review"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded border border-current/20 bg-white/60 px-2 py-1 text-xs font-bold">
            {getApprovalStateLabel(lead.approvalStatus)}
          </span>
          <span className="rounded border border-current/20 bg-white/60 px-2 py-1 text-xs font-bold">
            {eligibility.mode === "live_disabled" ? "Live sending disabled" : "Simulation only"}
          </span>
          <span className="rounded border border-current/20 bg-white/60 px-2 py-1 text-xs font-bold">
            Provider: {eligibility.provider}
          </span>
        </div>
      </div>

      <div className="mt-3 rounded border border-current/15 bg-white/60 p-2 font-semibold">
        No SMS or email has been sent. Live outreach remains disabled.
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase opacity-75">Reason codes</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {eligibility.reasonCodes.map((code) => (
              <span key={code} className="rounded border border-current/20 bg-white/70 px-2 py-1 text-xs font-semibold">
                {code}
              </span>
            ))}
          </div>
        </div>

        {!compact ? (
          <div>
            <p className="text-xs font-semibold uppercase opacity-75">Missing requirements</p>
            <div className="mt-2 space-y-1">
              {eligibility.missingRequirements.length > 0 ? (
                eligibility.missingRequirements.map((requirement) => <p key={requirement}>{requirement}</p>)
              ) : (
                <p>No lead data requirements are missing for simulation review.</p>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {!compact ? (
        <div className="mt-3 space-y-1">
          {eligibility.reasons.map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
