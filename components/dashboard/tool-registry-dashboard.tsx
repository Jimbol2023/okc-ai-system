import { ShieldCheck, Wrench } from "lucide-react";

import { getSafeAutoDefaults } from "@/lib/safe-auto-mode";
import { createToolRegistrySummary, listToolCapabilities, selectToolForAction } from "@/lib/tool-capability-manager";

function formatLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function ToolRegistryDashboard() {
  const tools = listToolCapabilities();
  const summary = createToolRegistrySummary();
  const defaults = getSafeAutoDefaults();
  const exampleDecisions = [
    selectToolForAction({ requestedAction: "create_flyer_brief", preferredToolKey: "canva", module: "Executive AI" }),
    selectToolForAction({ requestedAction: "prepare_gbp_post", preferredToolKey: "google_business_profile", module: "Marketing AI" }),
    selectToolForAction({ requestedAction: "verify_ownership", preferredToolKey: "attom", module: "Property Intelligence AI" }),
    selectToolForAction({ requestedAction: "queue_sms_draft", preferredToolKey: "twilio", module: "Revenue Spine" }),
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">AI OS capability layer</p>
            <h1 className="break-words text-3xl font-semibold text-primary md:text-4xl">Tool Registry & Safe Auto Mode</h1>
            <p className="max-w-4xl text-sm leading-6 text-muted md:text-base">
              Central visibility for tools, supported actions, approval requirements, fallback behavior, and safe automation
              decisions. This dashboard does not call providers, send messages, publish content, scrape, or activate connectors.
            </p>
          </div>
          <div className="grid gap-2 text-xs font-bold uppercase tracking-[0.1em] sm:grid-cols-2">
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-blue-950">providerCalled:false</span>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-blue-950">liveExecutionAllowed:false</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-950">safeAutoInternal:true</span>
            <span className="rounded-full border border-red-200 bg-red-50 px-3 py-2 text-red-950">killSwitchEnabled:true</span>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Total tools", summary.totalTools],
          ["Healthy", summary.healthyTools],
          ["Readiness only", summary.readinessOnlyTools],
          ["Blocked/unavailable", summary.blockedOrUnavailableTools],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-primary">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-emerald-700" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Safe Auto Defaults</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Internal summaries, scoring, drafts, relationship health, content repurposing, and macro summaries can be automated.
              External calls, publishing, messaging, calling, calendar invites, and connector activation remain blocked.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(defaults).map(([key, value]) => (
            <div key={key} className="rounded-xl border border-border bg-white p-3 text-sm">
              <p className="break-words font-semibold text-primary">{formatLabel(key)}</p>
              <p className="mt-1 text-muted">{String(value)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-primary">Decision Examples</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {exampleDecisions.map((decision) => (
            <article key={`${decision.requestingModule}-${decision.requestedAction}`} className="rounded-2xl border border-border bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{decision.requestingModule}</p>
              <h3 className="mt-2 text-base font-semibold text-primary">{formatLabel(decision.requestedAction)}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{decision.reason}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                <span className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700">{formatLabel(decision.decision)}</span>
                <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-blue-950">tool:{decision.selectedToolKey ?? "none"}</span>
                <span className="rounded border border-blue-200 bg-blue-50 px-2 py-1 text-blue-950">fallback:{decision.fallbackToolKey ?? "none"}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Wrench className="mt-1 h-5 w-5 text-blue-800" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Registered Tools</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Each tool records purpose, auth method, permissions, health, supported actions, rate limits, cost, retry policy,
              owner, audit notes, approval requirements, and fallback tools.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.toolKey} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(tool.category)}</p>
                  <h3 className="mt-1 text-base font-semibold text-primary">{tool.name}</h3>
                </div>
                <span className="w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold uppercase text-slate-700">
                  {formatLabel(tool.healthStatus)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">{tool.purpose}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Auth:</span> {formatLabel(tool.authenticationMethod)}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Owner:</span> {tool.owner}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Retry:</span> {tool.retryPolicy}</p>
                <p className="text-sm text-muted"><span className="font-semibold text-primary">Fallback:</span> {tool.fallbackToolKeys.join(", ") || "none"}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {tool.supportedActions.map((action) => (
                  <span key={action.actionKey} className="rounded border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-950">
                    {action.label}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
