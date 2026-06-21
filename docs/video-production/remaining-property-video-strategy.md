# Remaining Property Video Production Strategy

## Purpose

Create three 3-5 minute trust-first educational videos for J Capital Property Group:

- Vacant Property in Oklahoma
- Relocation Property Decisions
- Landlord Property Decisions

Funnel path:

Video -> Education Center -> Resource Guide -> Property Discussion Form

Each video should build authority, SEO value, website engagement, and trust. None should feel like an ad.

## Shared Brand Requirements

- Company: J Capital Property Group
- Logo: JC Shield Logo v1.0
- Style: trust-first, professional, modern, calm, educational
- Market: Oklahoma property-owner education
- Colors: deep navy blue, white, light gray, charcoal gray, subtle gold accent
- Fonts: Cinzel for titles and headings; clean sans-serif for body text

Logo rules:

- Use the official JC Shield Logo v1.0 on title and closing slides.
- Place the logo subtly in the footer or corner of content slides.
- Maintain consistent logo sizing throughout each presentation.
- Do not distort, stretch, recolor, crop, trace, or recreate the logo.
- Preserve clear spacing around the logo.
- Use the logo as a trust and brand recognition element, not as a dominant design feature.

## Reviewed Website Asset Names

- `public/videos/vacant-property-in-oklahoma.mp4`
- `public/videos/relocation-property-decisions.mp4`
- `public/videos/landlord-property-decisions.mp4`

Do not set `reviewStatus` to `ready` until the matching MP4 exists at the expected path and passes human logo/text review.

## Required CTA Rules

Spoken primary CTA:

Learn more at jcapitalpropertygroup.com/resources/education

Website-only secondary CTA:

If you'd like to discuss your specific situation, visit our property discussion form.

Do not speak the secondary CTA in the video narration.

## Avoid

- We Buy Houses
- cash offer
- guaranteed offer
- urgency language
- fake testimonials
- fake reviews
- fake ratings
- unverified property facts
- legal, tax, financial, title, valuation, or repair advice

## Slide 7 Neutral Wording Standard

Use this neutral wording pattern:

Possible paths may include keeping the property, renting it where applicable, repairing it, listing it, transferring responsibilities, or evaluating available ownership and disposition options. The right path depends on the situation.

## Publish Gate

For each video:

1. Complete Canva design.
2. Complete human logo/text/prohibited-language review.
3. Export MP4 with the exact expected filename.
4. Place MP4 in `public/videos`.
5. Change that page's `reviewStatus` from `pending_review` to `ready`.
6. Run `npm.cmd run build`.
7. Commit and push only after the build passes.
