import { ManualD4dCaptureUiDraft } from "@/components/dashboard/manual-d4d-capture-ui-draft";

export default function DashboardDrivingForDollarsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-primary">Driving For Dollars</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          Use this section for manual property observation review. The A3.6 draft below is screen-only and does not
          create leads, write storage, use maps or GPS, trigger outreach, or automate acquisition work.
        </p>
      </div>

      <ManualD4dCaptureUiDraft />
    </div>
  );
}
