import { Handshake, Link2, ShieldCheck, TrendingUp, Users } from "lucide-react";

import { getReferralDashboard, referralSafetyFlags } from "@/lib/referrals";

function SafetyBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-8 max-w-full items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase leading-5 text-blue-950">
      {children}
    </span>
  );
}

function formatLabel(value: string | null | undefined) {
  return value?.replaceAll("_", " ") || "None";
}

async function loadDashboard() {
  try {
    return await getReferralDashboard();
  } catch {
    return {
      ok: false,
      partners: [],
      links: [],
      events: [],
      topSources: [],
      summary: {
        partners: 0,
        links: 0,
        clickCount: 0,
        leadCount: 0,
        qualifiedLeadCount: 0,
        closedDealCount: 0,
        referralToLeadConversion: 0,
      },
      suggestedRelationshipFollowUps: [],
      ...referralSafetyFlags,
      approvalRequired: true,
    };
  }
}

export async function ReferralPartnershipDashboard() {
  const dashboard = await loadDashboard();
  const summaryCards = [
    { label: "Partners", value: dashboard.summary.partners, icon: Users },
    { label: "Referral links", value: dashboard.summary.links, icon: Link2 },
    { label: "Referral leads", value: dashboard.summary.leadCount, icon: Handshake },
    { label: "Conversion", value: `${dashboard.summary.referralToLeadConversion}%`, icon: TrendingUp },
  ];

  return (
    <div className="max-w-full space-y-6 overflow-hidden">
      <section className="rounded-[1.5rem] border border-border bg-white p-5 shadow-[0_18px_40px_rgba(17,37,52,0.05)] sm:p-6">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="break-words text-sm font-semibold uppercase tracking-[0.18em] text-muted">Phase 4A Growth Engine</p>
            <h1 className="break-words text-3xl font-semibold text-primary md:text-4xl">Referral & Partnership Growth</h1>
            <p className="max-w-4xl break-words text-sm leading-6 text-muted md:text-base">
              Internal attribution command center for referral partners, social referral links, and manual relationship
              follow-up review. No outreach, payouts, provider calls, publishing, scraping, or connector activation.
            </p>
          </div>
          <div className="flex max-w-full flex-wrap gap-2">
            <SafetyBadge>providerCalled:false</SafetyBadge>
            <SafetyBadge>outreachSent:false</SafetyBadge>
            <SafetyBadge>published:false</SafetyBadge>
            <SafetyBadge>liveExecutionAllowed:false</SafetyBadge>
            <SafetyBadge>approvalRequired:true</SafetyBadge>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <article key={label} className="min-w-0 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="break-words text-xs font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
              <Icon className="h-4 w-4 shrink-0 text-blue-800" aria-hidden="true" />
            </div>
            <p className="mt-3 break-words text-3xl font-semibold text-primary">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="break-words text-xl font-semibold text-primary">Referral Partners</h2>
          <div className="mt-4 space-y-3">
            {dashboard.partners.length === 0 ? (
              <p className="rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted">
                No referral partners have been added yet.
              </p>
            ) : (
              dashboard.partners.map((partner) => (
                <article key={partner.id} className="min-w-0 rounded-xl border border-border bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-primary">{partner.name}</h3>
                      <p className="mt-1 break-words text-sm text-muted">{formatLabel(partner.partnerType)}</p>
                    </div>
                    <SafetyBadge>{formatLabel(partner.status)}</SafetyBadge>
                  </div>
                  <p className="mt-3 break-words text-sm leading-6 text-muted">{partner.notes ?? "No internal notes yet."}</p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="break-words text-xl font-semibold text-primary">Referral Links</h2>
          <div className="mt-4 space-y-3">
            {dashboard.links.length === 0 ? (
              <p className="rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted">
                No referral links have been created yet.
              </p>
            ) : (
              dashboard.links.map((link) => (
                <article key={link.id} className="min-w-0 rounded-xl border border-border bg-white p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-base font-semibold text-primary">{link.referralCode}</h3>
                      <p className="mt-1 break-words text-sm text-muted">{link.landingPage}</p>
                    </div>
                    <SafetyBadge>{formatLabel(link.status)}</SafetyBadge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-3">
                    <p>Clicks: {link.clickCount}</p>
                    <p>Leads: {link.leadCount}</p>
                    <p>Qualified: {link.qualifiedLeadCount}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="break-words text-xl font-semibold text-primary">Top Referral Sources</h2>
          <div className="mt-4 space-y-3">
            {dashboard.topSources.length === 0 ? (
              <p className="rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted">
                Referral performance will appear after links receive safe first-party events.
              </p>
            ) : (
              dashboard.topSources.map((source) => (
                <article key={source.referralCode} className="min-w-0 rounded-xl border border-border bg-white p-4">
                  <h3 className="break-words text-base font-semibold text-primary">{source.partnerName}</h3>
                  <p className="mt-1 break-words text-sm text-muted">
                    {source.referralCode} · {formatLabel(source.campaign)}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {source.leadCount} lead(s), {source.conversionRate}% referral-to-lead conversion
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <h2 className="break-words text-xl font-semibold text-primary">Suggested Relationship Follow-ups</h2>
          <div className="mt-4 space-y-3">
            {dashboard.suggestedRelationshipFollowUps.length === 0 ? (
              <p className="rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted">
                Suggestions will appear after referral links collect activity.
              </p>
            ) : (
              dashboard.suggestedRelationshipFollowUps.map((followUp) => (
                <article key={followUp.referralCode} className="min-w-0 rounded-xl border border-border bg-white p-4">
                  <h3 className="break-words text-base font-semibold text-primary">{followUp.partnerName}</h3>
                  <p className="mt-2 break-words text-sm leading-6 text-muted">{followUp.suggestion}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-blue-800" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="break-words text-xl font-semibold text-primary">Recent Referral Events</h2>
            <p className="mt-1 break-words text-sm leading-6 text-muted">
              Event history is attribution-only and never includes private deal status or visitor identity.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {dashboard.events.length === 0 ? (
            <p className="rounded-xl border border-border bg-white p-4 text-sm leading-6 text-muted">No referral events yet.</p>
          ) : (
            dashboard.events.map((event) => (
              <article key={event.id} className="min-w-0 rounded-xl border border-border bg-white p-4">
                <p className="break-words text-xs font-bold uppercase tracking-[0.12em] text-muted">{formatLabel(event.eventType)}</p>
                <h3 className="mt-2 break-words text-base font-semibold text-primary">{event.referralCode}</h3>
                <p className="mt-2 break-words text-sm leading-6 text-muted">
                  {formatLabel(event.status)} · {event.landingPage ?? "No landing page"}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
