import { AssetClassificationPanel } from "@/components/dashboard/asset-classification-panel";

export default function DashboardAnalyzerPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold text-primary">Deal Analyzer</h1>
      <p className="max-w-2xl text-sm leading-6 text-muted md:text-base">
        This route is reserved for underwriting inputs, repair estimates, MAO calculations, and assignment fee analysis.
      </p>
      <AssetClassificationPanel />
    </div>
  );
}
