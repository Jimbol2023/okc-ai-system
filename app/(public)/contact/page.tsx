import { LeadCaptureForm } from "@/components/forms/lead-capture-form";
import { SectionHeading } from "@/components/shared/section-heading";

export default function ContactPage() {
  return (
    <div className="container-shell py-10 md:py-14">
      <div className="mx-auto max-w-3xl space-y-8">
        <SectionHeading
          eyebrow="Contact"
          title="Talk to the acquisitions team"
          description="Use this page for direct outreach or general intake before routing a contact into the CRM."
          align="center"
        />
        <LeadCaptureForm source="contact-page" />
      </div>
    </div>
  );
}
