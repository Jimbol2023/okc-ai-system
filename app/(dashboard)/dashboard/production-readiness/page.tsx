import {
  getProductionReadinessScore,
  getProductionReadinessStatus,
  productionHardeningChecklist
} from "@/lib/production-readiness";

export default function DashboardProductionReadinessPage() {
  const readinessStatus = getProductionReadinessStatus();
  const readinessScore = getProductionReadinessScore();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Production Readiness</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          Read-only visibility into the main hardening steps required before this lead system moves from prototype mode toward production-safe use.
        </p>
      </div>

      <section className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Readiness Status" value={readinessStatus} />
          <SummaryCard label="Checklist Items" value={String(productionHardeningChecklist.length)} />
          <SummaryCard label="Readiness Score" value={`${readinessScore}%`} />
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-white px-4 py-4">
          <p className="text-sm font-semibold text-primary">Current Assessment</p>
          <p className="mt-2 text-sm leading-6 text-[#40576b]">
            The current system is feature-rich for internal prototyping, but it still depends heavily on client-side storage and unauthenticated internal workflows.
            Production readiness requires database migration, authentication, server-side protection for sensitive actions, and stronger input/security controls.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        {productionHardeningChecklist.map((item) => (
          <article
            key={item.title}
            className="rounded-[1.5rem] border border-border bg-surface p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] md:p-6"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-primary">{item.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={item.priority}>{item.priority}</Badge>
                  <Badge tone={item.status}>{item.status}</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-white px-4 py-4">
              <p className="text-sm font-semibold text-primary">Recommended Action</p>
              <p className="mt-2 text-sm leading-6 text-[#40576b]">{item.recommendedAction}</p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-white px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-primary">{value}</p>
    </div>
  );
}

function Badge({
  children,
  tone
}: {
  children: string;
  tone: "high" | "medium" | "low" | "not started" | "in progress" | "planned";
}) {
  const className =
    tone === "high"
      ? "bg-[#f7ddd7] text-[#9f3a22]"
      : tone === "medium"
        ? "bg-[#f6e8cc] text-[#9a6a1a]"
        : tone === "low"
          ? "bg-[#e7eef5] text-[#355066]"
          : tone === "in progress"
            ? "bg-[#dcefe3] text-[#2d6a4f]"
            : tone === "planned"
              ? "bg-[#e7eef5] text-[#355066]"
              : "bg-[#f7ddd7] text-[#9f3a22]";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${className}`}>{children}</span>;
}
