"use client";

type SystemHealthSafetyBarProps = {
  leadCount: number;
  pendingFollowUpCount: number;
  isLoadingLeads: boolean;
  isAutomationRunning: boolean;
};

function StatusPill({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "safe" | "warn" | "blocked";
}) {
  const toneClass = {
    neutral: "border-slate-200 bg-white text-slate-700",
    safe: "border-emerald-200 bg-emerald-50 text-emerald-800",
    warn: "border-amber-200 bg-amber-50 text-amber-800",
    blocked: "border-red-200 bg-red-50 text-red-800",
  }[tone];

  return (
    <div className={`min-w-0 rounded border px-3 py-2 ${toneClass}`}>
      <p className="text-[0.68rem] font-bold uppercase tracking-[0.08em] opacity-75">{label}</p>
      <p className="truncate text-sm font-bold">{value}</p>
    </div>
  );
}

export function SystemHealthSafetyBar({
  leadCount,
  pendingFollowUpCount,
  isLoadingLeads,
  isAutomationRunning,
}: SystemHealthSafetyBarProps) {
  return (
    <section className="sticky top-0 z-30 border-b border-border bg-[#f8fafc]/95 py-3 backdrop-blur">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
        <StatusPill label="Environment" value="Staging" tone="warn" />
        <StatusPill label="Database" value={isLoadingLeads ? "Checking" : "Connected"} tone={isLoadingLeads ? "neutral" : "safe"} />
        <StatusPill label="Auth" value="Active" tone="safe" />
        <StatusPill label="Automation" value={isAutomationRunning ? "Dry Run Only" : "Stopped"} tone={isAutomationRunning ? "warn" : "safe"} />
        <StatusPill label="Providers" value="Disabled" tone="safe" />
        <StatusPill label="Production" value="Blocked" tone="blocked" />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
        <span>Lead count: {leadCount}</span>
        <span aria-hidden="true">|</span>
        <span>Pending follow-ups: {pendingFollowUpCount}</span>
        <span aria-hidden="true">|</span>
        <span>No SMS, email, provider, or live automation execution.</span>
      </div>
    </section>
  );
}
