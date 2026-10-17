# Aurelia Grove Custom Homes — concept website

A premium, conversion-focused website for **Aurelia Grove Custom Homes**, a **fictional** custom home builder in Sacramento, CA.
It is a demonstration of editorial design, UX, CRO and production-grade front-end engineering.

> **Concept website · Fictional company.** The phone number (+1 916 555-0142) is in a reserved fictional range, the
> domain `aureliagrove.example` uses the reserved `.example` TLD and the license `DEMO-NOT-VALID` is a placeholder.
> The site contains no testimonials, ratings, awards, certifications, team members or license claims. Home designs are
> concept designs illustrated with **original procedural renderings** (see `scripts/renders/`), not photos of built homes.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — defaults are demo-safe
npm run dev                  # http://localhost:3000
```

Production build:

```bash
npm run build && npm start
```

Quality checks:

```bash
npm run typecheck   # TypeScript
npm run lint        # ESLint (next/core-web-vitals + TypeScript + React Compiler rules)
npm run build       # production build, prerenders every page
npm run check       # all three
```

Requires Node.js ≥ 20.9.

## Stack

- **Next.js 16** (App Router, static prerendering, `proxy.ts`), **React 19**, **TypeScript**
- **Tailwind CSS 4** with design tokens in `src/app/globals.css`
- **React Hook Form** + **Zod 4** (one schema shared by client and server validation)
- `next/font` (Cormorant Garamond + Manrope, self-hosted at build time), `next/image` (AVIF/WebP)
- No UI kit or animation library: accordions, tabs, dialogs, menus and scroll reveals are small accessible components
  using native browser features (`<dialog>`, IntersectionObserver, CSS transitions) to keep JavaScript light.

## Project structure

```
src/
  app/                       routes (one folder per page), API route, sitemap, robots, icon
    api/leads/route.ts       lead endpoint: validation, spam checks, rate limit, scoring, delivery
  components/
    analytics/               tracking root, A/B provider, tracked links
    brand/Logo.tsx           original SVG logo (light + dark)
    forms/                   fields, two-stage consultation form
    layout/                  header, footer, demo bar, mobile CTA bar, legal layout
    planner/                 8-step Home Planner + printable summary
    sections/                page sections (hero, projects, process timeline, FAQ, CTA…)
    seo/JsonLd.tsx           structured data helpers
    ui/                      buttons, section headings, accordion, reveal observer
  config/                    ← all company content lives here
    site.ts                  company, contacts, navigation, CTAs, demo flag
    projects.ts              concept homes
    content.ts               services, principles, process, FAQ
    areas.ts                 service areas + city pages
    planner.ts               planner options
    experiments.ts           A/B test definitions and copy
  lib/
    analytics.ts             track() event layer (dataLayer, GA4, Ads)
    attribution.ts           first/last-touch UTM capture
    consent.ts               analytics consent + Global Privacy Control
    experiments.ts           server-side sticky variant reader
    leads/                   shared schema, client submit, server delivery adapters, lead scoring
    rate-limit.ts            sliding-window rate limiter
  proxy.ts                   assigns sticky A/B variants (when enabled)
scripts/renders/             Blender scripts that generate the concept renderings
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, introduction, featured concepts, services, principles, interactive process, planner entry, FAQ, final CTA |
| `/about` | Positioning, principles and working commitments; honest note about the concept |
| `/custom-home-building` | Service page: what custom means, how common worries are addressed, scope, luxury residences |
| `/design-build` | Service page: design-build vs. design-bid-build, architectural coordination, planning consultations |
| `/home-designs` | Concept home index and style vocabulary |
| `/home-designs/[slug]` | Three concept project pages with gallery + lightbox, specs, features, plan notes, CTAs |
| `/process` | Interactive timeline and detailed phase breakdown, timing factors |
| `/service-areas` | Region overview with all ten communities |
| `/service-areas/sacramento`, `/folsom`, `/elk-grove` | Local guides with unique content (lot types, local considerations) |
| `/planner` | 8-step Home Planner |
| `/contact` | Phone, email and two-stage consultation form |
| `/privacy`, `/terms` | Demo-aware legal pages (with the full demo notice at `/terms#demo`) |

## Conversion system

- **Intent-based CTAs** (`config/site.ts`): *Plan My Custom Home* (primary, → planner), *Explore Home Designs*
  (inspiration), *Request a Project Consultation* (high intent, → contact), *Understand the Building Process* (education).
- **Home Planner** (`/planner`): 6 one-tap questions + contact + personalized confirmation. Pointer selections auto-advance;
  keyboard users move with arrow keys and confirm with Enter/Continue. Progress bar, clickable step list, “Edit” on every
  answer, answers persisted in `sessionStorage`, focus moved to each new step heading, personalised next steps and a
  printable summary.
- **Planner teaser** on the home page: answering question 1 there opens the planner pre-filled at step 2.
- **Two-stage consultation form**: stage 1 asks only name, email, message (phone optional). Once the lead is captured,
  stage 2 offers *optional* qualification (land, timeline, budget, ZIP, contact method) — qualification never blocks contact.
- **Lead-fit scoring** (`lib/leads/scoring.ts`): `priority` / `qualified` / `nurture`, from region, land, budget and timing,
  sent to the CRM for routing. Nobody is rejected; out-of-area ZIPs get a friendly hint.
- **Trust through transparency**: process timeline with “what you provide / what you receive”, budget disclaimers,
  honest FAQ (no invented prices or timelines), concept labels on every rendering, mobile call/CTA bar, sticky header CTA.
- No countdown timers, fake scarcity, invented guarantees or social proof.

## Leads, spam protection and integrations

`POST /api/leads` accepts three kinds of payload (`planner`, `consultation`, `qualification`), validated with the same Zod
schemas as the forms. It applies:

- JSON-only, size limit, same-origin check
- honeypot field, minimum fill time (time trap) and link-spam heuristic (bots receive a silent fake success)
- sliding-window rate limit per IP (5/min, 20/hour) — in-memory; swap the store for Redis/Upstash on serverless
- lead scoring, then delivery through adapters in `lib/leads/delivery.ts`

**Demo mode** (`NEXT_PUBLIC_DEMO_MODE`, default `true`): the server validates but never forwards; the browser keeps a
copy in `localStorage` (`ag_demo_leads`) and the UI says **“Demo submission saved locally”**. Emails ending in test domains
(`example.com`, `.example`, `.test`) are also never forwarded, even outside demo mode.

Production adapters (enabled only when demo mode is off **and** env vars exist):

| Adapter | Env vars | Notes |
| --- | --- | --- |
| CRM webhook | `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` | JSON POST with HMAC-SHA256 `x-signature`. Works with HubSpot workflows, Zapier, Make, Pipedrive or a custom endpoint |
| Email | `RESEND_API_KEY`, `LEADS_NOTIFY_TO`, `LEADS_NOTIFY_FROM` | Team notification via a Resend-compatible API |

Add more adapters by implementing `LeadAdapter` (`name`, `enabled()`, `send()`).

## Analytics

All events go through `track()` in `lib/analytics.ts` and are pushed to `window.dataLayer` (GTM-compatible). Events:
`page_view`, `primary_cta_click`, `consultation_form_start`, `consultation_form_submit`, `consultation_form_error`,
`qualification_submit`, `planner_start`, `planner_step_complete`, `planner_error`, `planner_abandon`, `planner_submit`,
`phone_click`, `email_click`, `project_view`, `faq_expand`, `experiment_exposure`.

- GA4 (`NEXT_PUBLIC_GA4_ID`) and Google Ads (`NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL`) load
  **only after consent**, never in demo mode, and never when the browser sends Global Privacy Control.
- Demo events carry `is_test: true`; in development they are logged to the console. `window.__agEvents` keeps the last
  200 events for QA.
- Attribution: first-touch and last-touch UTM/click IDs/referrer/landing page are stored in `localStorage` for 90 days
  and attached only to leads the visitor submits.

## A/B testing

Defined in `src/config/experiments.ts`:

- `cta` — A: “Plan My Custom Home” (→ planner) vs. B: “Request a Consultation” (→ contact)
- `hero` — A: emotional value of a custom home vs. B: concrete help with the building process

Set `EXPERIMENTS_ENABLED=true` to turn them on. `src/proxy.ts` assigns each visitor a variant once and stores it in a
60-day first-party cookie, so the same visitor always sees the same variant (no flicker, no switching mid-session). The
variant is attached to analytics (`experiment_exposure`, `primary_cta_click`) and to submitted leads. QA overrides:
`?exp_cta=B`, `?exp_hero=B`. Note: enabling experiments reads cookies on the server, so pages render dynamically instead
of being prerendered.

## SEO

Unique titles and descriptions per page, canonical URLs, Open Graph image, semantic headings (one `h1` per page),
`sitemap.xml`, `robots.txt`, and conservative structured data (`HomeAndConstructionBusiness` without street address,
ratings or license; `Service`, `BreadcrumbList`, `FAQPage`). While demo mode is on, pages carry `noindex` so a fictional
company can't compete in real search results — flip `NEXT_PUBLIC_DEMO_MODE=false` for a real company.

## Accessibility & performance

Skip link, landmarks, keyboard-operable menus/tabs/accordions/dialogs, visible focus styles, `aria-live` progress,
focus management in the planner, text-safe accent colors for WCAG AA contrast, `prefers-reduced-motion` honored for every
animation, content visible without JavaScript. All pages are statically prerendered; the hero image is prioritized;
images are served as AVIF/WebP at responsive sizes; fonts are self-hosted with `display: swap`.

## Launching for a real builder — what you need

1. Legal company name, **valid CSLB license number** (and classification), bonding/insurance details if displayed.
2. Real phone, email, business address (or service-area-only setup) and business hours.
3. Real **project photography** with usage rights, or clearly labeled renderings; real completed projects only.
4. Verified testimonials/reviews with permission (then add review markup only for genuine, first-party reviews).
5. Team bios and photos, if desired, with consent.
6. Accurate service areas, services and any pricing guidance they're comfortable publishing.
7. Privacy policy and terms reviewed by counsel (CCPA/CPRA), cookie/consent configuration.
8. CRM/email credentials (`LEADS_*`, `RESEND_*`), GA4/Ads IDs, a production rate-limit store (Redis).
9. Domain, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DEMO_MODE=false`, Google Search Console + Business Profile.

## Images

All imagery in `public/images/` is original, generated procedurally with Blender (`scripts/renders/`), so there are no
licensing concerns. Replace them with real photography by keeping the same filenames, or update paths in `src/config/`.
