import { PropertyOpportunityWorkbenchClient } from "@/components/dashboard/property-opportunity-workbench-client";

export default function DashboardPropertyOpportunityWorkbenchPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase text-muted">Property Opportunity Engine</p>
        <h1 className="text-3xl font-semibold text-primary">Opportunity Workbench</h1>
        <p className="max-w-3xl text-sm leading-6 text-muted md:text-base">
          Review real leads, manual map pins, DFD routes, county evidence, saved filters, opportunity scoring, and approval-required acquisition review candidates.
        </p>
      </div>
      <PropertyOpportunityWorkbenchClient />
    </div>
  );
}
