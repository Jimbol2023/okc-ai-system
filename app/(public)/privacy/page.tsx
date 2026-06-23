import { brandConfig } from "@/lib/brand-config";
import { createPublicPageMetadata } from "@/lib/public-seo";

export const metadata = createPublicPageMetadata({
  path: "/privacy",
  title: "Public Website Privacy Policy",
  description:
    "Privacy policy for the public J Capital Property Group website, including contact information usage and no automated outreach from this website."
});

const policySections = [
  {
    title: "Information You Share",
    body: "If you contact J Capital Property Group by phone or email, the contact information and property questions you choose to share may be used to respond to your inquiry."
  },
  {
    title: "How Information Is Used",
    body: "Information voluntarily shared by phone or email is used to communicate with you about your inquiry, answer questions, and discuss potential real estate solutions."
  },
  {
    title: "No Sale Of Personal Information",
    body: "This website does not sell personal information."
  },
  {
    title: "No Automated Outreach",
    body: "This website does not create automated outreach, autonomous seller messaging, or automated follow-up campaigns."
  },
  {
    title: "Cookies And Browser Storage",
    body:
      "This website may use essential browser storage to remember privacy preferences and support form or site functionality. Optional analytics cookies are loaded only if analytics is configured and you accept optional cookies. Advertising and remarketing cookies are not loaded by this website."
  },
  {
    title: "Lead Source Tracking",
    body:
      "Some website links include a source value so J Capital Property Group can understand which public pages or buttons led to a property inquiry. This source value is submitted with the form when you choose to contact us."
  },
  {
    title: "Contact",
    body: `Questions about this privacy policy may be sent to ${brandConfig.primaryEmail}.`
  }
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <section className="bg-[#02213D] py-18 text-white md:py-24">
        <div className="container-shell">
          <div className="max-w-3xl">
            <p className="font-heading text-xs font-bold uppercase tracking-[0.22em] text-[#D4A017]">
              Privacy
            </p>
            <h1 className="mt-5 font-heading text-4xl font-bold leading-tight md:text-6xl">Privacy Policy</h1>
            <p className="mt-6 text-base leading-8 text-white/82">
              This privacy policy explains the simple public website practices for {brandConfig.companyDisplayName}.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-18 md:py-24">
        <div className="container-shell">
          <div className="mx-auto max-w-3xl space-y-5">
            {policySections.map((section) => (
              <article key={section.title} className="border border-slate-200 bg-[#F2F4F7] p-6">
                <h2 className="font-heading text-xl font-bold text-[#02213D]">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#1F2937]">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
