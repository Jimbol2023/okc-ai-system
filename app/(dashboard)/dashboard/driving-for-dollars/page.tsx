import { DfdOperatingConductorPanel } from "@/components/dashboard/dfd-operating-conductor-panel";
import { ManualD4dCaptureUiDraft } from "@/components/dashboard/manual-d4d-capture-ui-draft";
import { createDfdOperatingReport } from "@/lib/dfd-operating-conductor";
import { requireAuthenticatedServerTenant } from "@/lib/server-tenant-context";

export default async function DashboardDrivingForDollarsPage() {
  const actor = await requireAuthenticatedServerTenant();
  const dfdOperating = await createDfdOperatingReport(actor.tenantId);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Driving For Dollars</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          DFD AI conducts internal property review work from stored lead, CRM, and pipeline data. It does not create
          leads, write storage, use maps or GPS, trigger outreach, scrape, or automate acquisition work.
        </p>
      </div>

      <DfdOperatingConductorPanel report={dfdOperating} />
      <ManualD4dCaptureUiDraft />
    </div>
  );
}
