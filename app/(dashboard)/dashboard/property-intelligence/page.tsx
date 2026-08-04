import { AcquisitionDecisionBriefView } from "@/components/dashboard/acquisition-decision-brief-view";
import { getBuyerDemandSignals } from "@/lib/buyer-demand";
import { createAcquisitionDecisionBrief, createProfessionalWorkforceReport } from "@/lib/enterprise-professional-workforce";
import { getDbLeadById } from "@/lib/leads-db";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export const dynamic = "force-dynamic";

export default async function PropertyIntelligencePage({ searchParams }: { searchParams: Promise<{ leadId?: string }> }) {
  const { leadId } = await searchParams;
  const actor = await requireAuthenticatedServerTenant();
  const workforce = createProfessionalWorkforceReport();
  const lead = leadId ? await getDbLeadById(actor, leadId) : null;
  const buyerDemand = lead ? await getBuyerDemandSignals().catch(() => null) : null;
  const brief = lead ? createAcquisitionDecisionBrief({ lead, buyerDemand }) : null;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
      {!brief && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">Enterprise Professional Workforce</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-950">Property Intelligence Operating Cell</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">Open this page with a valid leadId query parameter to prepare a non-persistent Acquisition Decision Brief from stored evidence.</p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {workforce.profiles.map((profile) => <div key={profile.id} className="rounded-xl border border-slate-200 p-4"><h2 className="font-semibold text-slate-900">{profile.name}</h2><p className="mt-1 text-sm text-slate-600">{profile.rolePurpose}</p></div>)}
          </div>
        </section>
      )}
      {brief && <AcquisitionDecisionBriefView brief={brief} />}
    </main>
  );
}
