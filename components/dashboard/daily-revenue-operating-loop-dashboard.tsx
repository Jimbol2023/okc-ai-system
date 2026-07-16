"use client";

import { useState } from "react";

import type { DailyDepartmentQueue, DailyOperatingReviewDecision, DailyRevenueOperatingLoopReport, DailyRevenueWorkOrder } from "@/lib/daily-revenue-operating-loop";

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "danger" }) {
  const toneClass =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-950"
      : tone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : tone === "danger"
          ? "border-red-200 bg-red-50 text-red-950"
          : "border-slate-200 bg-white text-slate-700";

  return (
    <span className={`inline-flex min-h-7 items-center rounded-full border px-2.5 text-[11px] font-bold uppercase ${toneClass}`}>
      {children}
    </span>
  );
}

function statusTone(status: DailyRevenueWorkOrder["status"]) {
  if (status === "open" || status === "working") return "good";
  if (status === "needs_ceo_approval" || status === "waiting") return "warn";
  if (status === "blocked") return "danger";

  return "neutral";
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-white p-4">
      <p className="text-xs font-bold uppercase text-muted">{label}</p>
      <p className="mt-2 break-words text-3xl font-semibold text-primary">{value}</p>
    </div>
  );
}

function ReviewButton({
  workOrderId,
  decision,
  children,
  disabled,
}: {
  workOrderId: string;
  decision: DailyOperatingReviewDecision;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "failed">("idle");

  async function review() {
    setStatus("pending");
    const response = await fetch("/api/company/daily-revenue-operating-loop/review", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ workOrderId, decision }),
    }).catch(() => null);

    setStatus(response?.ok ? "done" : "failed");
  }

  return (
    <button
      type="button"
      onClick={review}
      disabled={disabled || status === "pending"}
      className="min-h-8 rounded-md border border-slate-200 bg-white px-2.5 text-left text-[11px] font-bold uppercase text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      title={status === "done" ? "Review recorded" : status === "failed" ? "Review failed" : undefined}
    >
      {status === "pending" ? "Reviewing" : status === "done" ? "Recorded" : status === "failed" ? "Failed" : children}
    </button>
  );
}

function ReviewControls({ order }: { order: DailyRevenueWorkOrder }) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <ReviewButton workOrderId={order.id} decision="approve_crm_task" disabled={!order.canCreateCrmTask}>
        Prepare CRM Task Approval
      </ReviewButton>
      <ReviewButton workOrderId={order.id} decision="defer">
        Defer Internal Work
      </ReviewButton>
      <ReviewButton workOrderId={order.id} decision="block">
        Block Internal Work
      </ReviewButton>
      <ReviewButton workOrderId={order.id} decision="mark_completed">
        Mark Completed
      </ReviewButton>
      <ReviewButton workOrderId={order.id} decision="no_opportunity">
        Mark No Opportunity
      </ReviewButton>
    </div>
  );
}

function QueueCard({ queue }: { queue: DailyDepartmentQueue }) {
  const visibleOrders = queue.workOrders.slice(0, 3);

  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-semibold text-primary">{queue.department}</h2>
          <p className="mt-1 break-words text-sm leading-6 text-muted">AI Manager: {queue.manager}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={queue.status === "working" ? "good" : queue.status === "waiting" ? "warn" : "neutral"}>{queue.status}</Badge>
          <Badge>{queue.workOrders.length} orders</Badge>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase text-muted">Employees Working</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {queue.employeesWorking.length === 0 ? <Badge>none</Badge> : queue.employeesWorking.map((employee) => <Badge key={employee} tone="good">{employee}</Badge>)}
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase text-muted">Waiting / Blocked</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {queue.employeesWaiting.length === 0 ? <Badge>none</Badge> : queue.employeesWaiting.map((employee) => <Badge key={employee} tone="warn">{employee}</Badge>)}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {visibleOrders.map((order) => (
          <div key={order.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex min-w-0 flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="break-words text-sm font-semibold text-primary">{order.aiEmployee}</p>
                <p className="mt-1 break-words text-sm leading-6 text-muted">{order.recommendedAction}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                {order.canCreateCrmTask ? <Badge tone="good">crm task ready</Badge> : null}
              </div>
            </div>
            <p className="mt-2 break-words text-xs leading-5 text-muted">KPI: {order.successKpi.slice(0, 2).join(", ")}</p>
            <ReviewControls order={order} />
          </div>
        ))}
      </div>

      {queue.blockers.length > 0 ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs font-bold uppercase text-amber-950">Blockers</p>
          <p className="mt-1 break-words text-sm leading-6 text-amber-950">{queue.blockers.slice(0, 3).join("; ")}</p>
        </div>
      ) : null}
    </article>
  );
}

export function DailyRevenueOperatingLoopDashboard({ report }: { report: DailyRevenueOperatingLoopReport }) {
  const highPriorityLead = report.highestPriorityLead;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-border bg-surface p-5 md:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-2">
            <p className="break-words text-sm font-semibold uppercase text-muted">Daily Revenue Operating Loop</p>
            <h1 className="break-words text-3xl font-semibold text-primary">What should J Capital do today?</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted">{report.revenueGoal}</p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <Badge tone="good">internal only</Badge>
            <Badge>providerCalled:{String(report.safety.providerCalled)}</Badge>
            <Badge tone="danger">liveExecution:{String(report.safety.liveExecutionAllowed)}</Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-5">
          <Stat label="Opportunities" value={report.ceoDashboard.todaysRevenueOpportunities} />
          <Stat label="Employees" value={report.ceoDashboard.aiEmployeesAssigned} />
          <Stat label="Tasks Ready" value={report.ceoDashboard.tasksReady} />
          <Stat label="Approvals" value={report.ceoDashboard.approvalsNeeded} />
          <Stat label="Departments" value={report.departmentQueues.length} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Highest Priority Lead</h2>
          {highPriorityLead ? (
            <div className="mt-3 space-y-2 text-sm leading-6 text-muted">
              <p className="break-words font-semibold text-primary">{highPriorityLead.propertyAddress}</p>
              <p className="break-words">Lead: {highPriorityLead.leadId}</p>
              <p className="break-words">Source: {highPriorityLead.source}</p>
              <div className="flex flex-wrap gap-2">
                <Badge tone="good">{highPriorityLead.priority}</Badge>
                <Badge>score {highPriorityLead.score}</Badge>
              </div>
            </div>
          ) : (
            <p className="mt-3 break-words text-sm leading-6 text-muted">No lead is attached yet. The company should focus on source-labeled lead intake and CRM hygiene today.</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">CEO Decision Queue</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase text-muted">Departments Working</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.ceoDashboard.departmentsWorking.map((department) => <Badge key={department} tone="good">{department}</Badge>)}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted">Departments Waiting</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.ceoDashboard.departmentsWaiting.length === 0 ? <Badge>none</Badge> : report.ceoDashboard.departmentsWaiting.map((department) => <Badge key={department} tone="warn">{department}</Badge>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {report.departmentQueues.map((queue) => <QueueCard key={queue.department} queue={queue} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Connector Issues</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {report.ceoDashboard.connectorIssues.length === 0 ? <Badge tone="good">none</Badge> : report.ceoDashboard.connectorIssues.map((issue) => <Badge key={issue} tone="warn">{issue}</Badge>)}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Revenue Risk</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {report.ceoDashboard.revenueRisk.length === 0 ? <li>No major revenue risk surfaced by the operating loop.</li> : report.ceoDashboard.revenueRisk.map((risk) => <li key={risk} className="break-words">{risk}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <h2 className="break-words text-xl font-semibold text-primary">Tomorrow</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
            {report.tomorrowRecommendations.map((item) => <li key={item} className="break-words">{item}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}
