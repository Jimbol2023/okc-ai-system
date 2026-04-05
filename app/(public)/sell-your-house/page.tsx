import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function SellYourHousePage() {
  return (
    <div className="container-shell py-10 md:py-14">
      <div className="grid gap-8 md:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <SectionHeading
            eyebrow="Seller Intake"
            title="Fast homeowner intake form"
            description="This route is prepared for motivated seller conversion. Inputs are validated and every submission includes a tracked source."
          />
          <div className="rounded-[1.5rem] border border-border bg-surface p-6">
            <h2 className="text-xl font-semibold text-primary">What this page is designed for</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <li>Simple mobile-first lead submission for homeowners.</li>
              <li>Clear source attribution for direct mail, PPC, referrals, and organic traffic.</li>
              <li>Future handoff to acquisitions follow-up and CRM automation.</li>
            </ul>
          </div>
        </div>
        <LeadCaptureForm source="seller-page" />
      </div>
    </div>
  );
}
