# Referral & Partnership Growth Engine

## Purpose

The Referral & Partnership Growth Engine gives J Capital AI OS a safe, first-party attribution foundation for referral partners, social media referral links, past-client referrals, professional relationships, and community campaigns.

Version 1 is tracking and review only. It does not send outreach, publish content, trigger provider calls, activate connectors, scrape sources, or calculate payouts.

## Approved Referral Use Cases

- Track referral links shared manually on social media.
- Track links shared by friends, family, past clients, attorneys, CPAs, contractors, agents, and community partners.
- Attribute public website leads to a referral code when the visitor submits a form.
- Review referral-to-lead conversion inside internal dashboards.
- Prepare manual relationship follow-up suggestions for operator review.
- Support future QR-code campaigns by using the same referral URL format.

## Partner Types

Supported partner types are:

- `friend`
- `family`
- `past_client`
- `attorney`
- `cpa`
- `contractor`
- `agent`
- `community`
- `social_media`
- `other`

Partner type is used for internal segmentation only. It must not trigger automated outreach, compensation, public access, or special deal visibility.

## Privacy Rules

- Public referral tracking may store referral code, campaign, source, landing page, event type, and duplicate key.
- Public referral tracking must not store raw IP address, user agent, cookies, visitor identity, phone number, email address, or property details.
- Personal data may be stored only after a visitor submits a lead form.
- Referral events must not expose private lead status, deal status, offer status, closing status, financial details, or seller information publicly.
- No third-party tracking pixels are added by this engine.
- No external provider calls are made by this engine.

## Attribution Flow

1. An operator creates an internal referral partner.
2. An operator creates a referral link with a referral code, landing page, and optional campaign.
3. A person visits a J Capital public page using `?ref=CODE`, with optional `?campaign=...` and `?source=...`.
4. The public site records a first-party referral click event.
5. If the visitor submits a lead form, the lead payload includes referral metadata.
6. The referral engine attaches attribution to the lead if the code is known and active.
7. The Revenue Spine receives a referral `RevenueLeadSource` record.
8. Internal dashboards summarize referral clicks, leads, qualified leads, closed-deal counts, conversion, and relationship follow-up suggestions.

## Social Media Usage

Referral links may be included in manually approved social media copy, Canva briefs, Google Business Profile drafts, newsletters, and community event materials.

Marketing AI may suggest referral-ready copy, but all publishing remains manual approval only. The system must not post, schedule, message, reply, or spend ad budget from referral activity.

## QR Code Future Option

Future QR-code campaigns may encode the same first-party referral URL pattern:

`/sell-your-house?ref=CODE&campaign=event-name&source=qr`

QR generation is not part of V1. If added later, it must remain first-party, auditable, and approval-gated.

## No Automated Payout Handling In V1

The engine tracks attribution only. It does not calculate commissions, referral fees, rev-share, gift cards, bonuses, invoices, tax forms, or partner payouts.

Any future payout workflow must be implemented as a separate finance-governed feature with approvals, legal review, tax review, audit logs, and human authorization.

## Safety Rules

- No SMS.
- No email.
- No social posting.
- No automatic partner payouts.
- No private deal status shown publicly.
- No scraping.
- No external provider calls.
- No connector activation.
- No secrets access.
- No `.env.local` access.
- No public partner portal in V1.

## Implementation Notes

- `ReferralPartner` stores internal partner records.
- `ReferralLink` stores trackable first-party links and aggregate counts.
- `ReferralAttributionEvent` stores safe attribution events with hard-false execution flags.
- Unknown referral codes create safe `unknown_code` events and do not attach attribution.
- Duplicate event keys prevent repeated click or lead events from corrupting counts.
- Referral attribution integrates with `RevenueLeadSource` instead of replacing existing lead source logic.
