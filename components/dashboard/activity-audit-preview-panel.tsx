"use client";

type ActivityAuditPreviewPanelProps = {
  leadCount: number;
  pendingFollowUpCount: number;
  isLoadingLeads: boolean;
};

type PreviewEvent = {
  label: string;
  status: string;
  timestamp: string;
};

function buildPreviewEvents({
  leadCount,
  pendingFollowUpCount,
  isLoadingLeads,
}: ActivityAuditPreviewPanelProps): PreviewEvent[] {
  const leadStatus = isLoadingLeads ? "Lead inventory checking" : `${leadCount} lead${leadCount === 1 ? "" : "s"} visible`;
  const followUpStatus =
    pendingFollowUpCount > 0
      ? `${pendingFollowUpCount} follow-up${pendingFollowUpCount === 1 ? "" : "s"} pending human review`
      : "No pending follow-up tasks detected";

  return [
    {
      label: "Login/session viewed",
      status: "Authenticated dashboard session",
      timestamp: "Preview",
    },
    {
      label: "Lead created",
      status: leadStatus,
      timestamp: "Preview",
    },
    {
      label: "Lead updated",
      status: followUpStatus,
      timestamp: "Preview",
    },
    {
      label: "Seller call outcome saved",
      status: "Append-only capture available",
      timestamp: "Preview",
    },
    {
      label: "Buyer added",
      status: "Buyer activity preview only",
      timestamp: "Preview",
    },
  ];
}

export function ActivityAuditPreviewPanel(props: ActivityAuditPreviewPanelProps) {
  const previewEvents = buildPreviewEvents(props);

  return (
    <section className="rounded-[1.5rem] border border-border bg-surface p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Activity / Audit Preview</h2>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted">
            Read-only operational activity preview derived from already loaded dashboard state. No audit log writes, provider calls, or automation execution occurs here.
          </p>
        </div>
        <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-800">
          Read-only
        </span>
      </div>

      <div className="mt-4 divide-y divide-border overflow-hidden rounded border border-border bg-white">
        {previewEvents.map((event) => (
          <div key={event.label} className="grid gap-2 px-4 py-3 text-sm md:grid-cols-[1.2fr_1.4fr_auto] md:items-center">
            <p className="font-semibold text-primary">{event.label}</p>
            <p className="text-muted">{event.status}</p>
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{event.timestamp}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs font-semibold text-slate-600">
        Read-only preview. No SMS, email, provider, or automation execution.
      </p>
    </section>
  );
}
