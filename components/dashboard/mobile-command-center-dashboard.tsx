import { Bell, CheckCircle2, ClipboardCheck, Download, Gauge, Megaphone, PlugZap, ShieldCheck, Sparkles } from "lucide-react";

import { createMobileCommandCenter, createVerticalSliceSimulation, getConnectorMarketplace } from "@/lib/phase3-production-execution";
import { getPhase4GovernanceStatus } from "@/lib/phase4-production";

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

function StatusPill({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "green" | "blue" | "red" }) {
  const toneClass = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    blue: "border-blue-200 bg-blue-50 text-blue-950",
    red: "border-red-200 bg-red-50 text-red-900",
  }[tone];

  return <span className={`inline-flex min-h-8 w-fit max-w-full items-center break-words rounded-full border px-3 py-1 text-xs font-bold uppercase leading-5 ${toneClass}`}>{children}</span>;
}

export function MobileCommandCenterDashboard() {
  const commandCenter = createMobileCommandCenter();
  const verticalSlice = createVerticalSliceSimulation();
  const marketplace = getConnectorMarketplace();
  const phase4 = getPhase4GovernanceStatus();

  return (
    <div className="max-w-full space-y-5 overflow-hidden">
      <section className="sticky top-2 z-10 rounded-2xl border border-blue-100 bg-white/95 p-3 shadow-[0_12px_28px_rgba(17,37,52,0.08)] backdrop-blur sm:p-4">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">Morning Brief / Alerts</p>
            <p className="mt-1 break-words text-sm font-semibold text-primary">Review priorities and approvals. External actions remain blocked.</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <StatusPill tone="blue">providerCalled:false</StatusPill>
            <StatusPill tone="red">liveExecutionAllowed:false</StatusPill>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-[0_16px_34px_rgba(17,37,52,0.05)] sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Phase 3 production slice</p>
            <h1 className="mt-2 break-words text-2xl font-semibold text-primary md:text-4xl">Mobile Command Center</h1>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-muted">
              Daily operations view for the seller-lead to approval to execution-plan workflow. It prepares work for
              review while keeping sends, publishes, provider calls, and live connector execution blocked by default.
            </p>
          </div>
          <div className="grid max-w-full gap-2 sm:grid-cols-2 lg:min-w-[360px]">
            <StatusPill tone="blue">providerCalled:false</StatusPill>
            <StatusPill tone="red">liveExecutionAllowed:false</StatusPill>
            <StatusPill tone="blue">outreachSent:false</StatusPill>
            <StatusPill tone="slate">approvalRequired:true</StatusPill>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Download className="mt-1 h-5 w-5 shrink-0 text-blue-800" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Add this to your phone</h2>
            <p className="mt-1 break-words text-sm leading-6 text-muted">
              Install the Mobile Command Center as a lightweight browser app for quick review access.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">iPhone Safari</p>
            <p className="mt-2 text-sm leading-6 text-muted">Open this page in Safari, tap Share, then choose Add to Home Screen.</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Android Chrome</p>
            <p className="mt-2 text-sm leading-6 text-muted">Open this page in Chrome, tap Menu, then choose Add to Home Screen.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Approval items", value: commandCenter.panels.approvalCenter.length, icon: ClipboardCheck },
          { label: "Marketing drafts", value: commandCenter.panels.marketingQueue.length, icon: Megaphone },
          { label: "Connectors", value: marketplace.connectors.length, icon: PlugZap },
          { label: "Audit events", value: verticalSlice.auditTrail.length, icon: ShieldCheck },
        ].map(({ label, value, icon: Icon }) => (
          <article key={label} className="min-w-0 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
              <Icon className="h-4 w-4 text-blue-800" aria-hidden="true" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-primary">{value}</p>
          </article>
        ))}
      </section>

      <section className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Phase 4 Operations</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Controlled live execution is limited to allowlisted Twilio SMS tests.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="min-w-0 rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Live SMS</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">{phase4.twilioReadiness.controlledLiveTestEligible ? "Eligible" : "Blocked"}</p>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Kill Switch</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">{phase4.environment.killSwitchActive ? "Active" : "Off"}</p>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Timeline</p>
            <p className="mt-2 break-words text-lg font-semibold text-primary">/api/operations/timeline</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Gauge className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-primary">Executive Briefing</h2>
              <p className="mt-1 text-sm leading-6 text-muted">Prioritized recommendations with confidence and review posture.</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {commandCenter.panels.executiveBriefing.map((priority) => (
              <article key={priority.title} className="rounded-xl border border-border bg-white p-4">
                <StatusPill tone={priority.safeAutoStatus === "approval_required" ? "blue" : "slate"}>
                  {formatLabel(priority.safeAutoStatus)}
                </StatusPill>
                <h3 className="mt-3 text-base font-semibold text-primary">{priority.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{priority.reason}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-muted">Confidence {priority.confidence}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
            <div>
              <h2 className="text-xl font-semibold text-primary">Vertical Slice</h2>
              <p className="mt-1 text-sm leading-6 text-muted">Website seller lead through score, task, draft, approval, and blocked execution plan.</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-white p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <p className="text-sm text-muted"><span className="font-semibold text-primary">Lead source:</span> {verticalSlice.lead.source}</p>
              <p className="text-sm text-muted"><span className="font-semibold text-primary">Score:</span> {verticalSlice.score.score}</p>
              <p className="text-sm text-muted"><span className="font-semibold text-primary">Confidence:</span> {verticalSlice.score.confidence}</p>
              <p className="text-sm text-muted"><span className="font-semibold text-primary">Execution:</span> {formatLabel(verticalSlice.executionPlan.decision)}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">{verticalSlice.score.explanation}</p>
          </div>
          <div className="mt-4 space-y-2">
            {verticalSlice.auditTrail.map((event) => (
              <div key={event} className="flex items-start gap-2 rounded-lg border border-border bg-white px-3 py-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                <p className="text-sm text-muted">{formatLabel(event)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="text-xl font-semibold text-primary">Approval Center</h2>
          <div className="mt-4 space-y-3">
            {commandCenter.panels.approvalCenter.map((item) => (
              <article key={item.id} className="rounded-xl border border-border bg-white p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(item.itemType)}</p>
                    <h3 className="mt-1 text-base font-semibold text-primary">{item.title}</h3>
                  </div>
                  <StatusPill tone="blue">{formatLabel(item.approvalStatus)}</StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.executionBlockedReason}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="text-xl font-semibold text-primary">Marketing Queue</h2>
          <div className="mt-4 space-y-3">
            {commandCenter.panels.marketingQueue.map((draft) => (
              <article key={draft.id} className="rounded-xl border border-border bg-white p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(draft.platform)}</p>
                    <h3 className="mt-1 text-base font-semibold text-primary">{draft.title}</h3>
                  </div>
                  <StatusPill tone="slate">{formatLabel(draft.contentType)}</StatusPill>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{draft.draftCopy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Bell className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Notifications</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Operational alerts are explicit and never silent.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {commandCenter.panels.notifications.map((notification) => (
            <p key={notification} className="rounded-xl border border-border bg-white p-3 text-sm leading-6 text-muted">
              {notification}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}
