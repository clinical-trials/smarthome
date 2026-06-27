# The Climate Concierge — v2 Confidence Rework (Design Spec)

Branch: `v2-confidence-rework`

## Goal

Rework the Climate Concierge site to do two jobs better than the v1 draft:

1. **Drive business** — make booking the obvious, frictionless next action.
2. **Make people feel confident about installation** — answer the real fear of
   letting a stranger into your home to alter your heating, honestly.

Pre-launch constraint: **nothing on the page is fabricated.** No invented
reviews, ratings, or install counts. Credentials appear as clearly-marked
`[fill in before launch]` placeholders. Confidence comes from process
transparency, a workmanship guarantee, flat pricing, and
compatibility-confirmed-before-you-pay — all true commitments.

## Design direction (distinct from the v1 default look)

The v1 site leaned on two generic "AI editorial" defaults (warm-cream + serif +
terracotta; broadsheet hairline rules). v2 keeps brand warmth but spends
creativity on a subject-grounded system:

- **Signature — Neighborhood Route Scheduler.** Enter ZIP → see the days the
  concierge already routes through your neighborhood → pick a day + time window →
  request it. Ties scheduling, locality, and the senior-rate story together. It
  is the conversion centerpiece and the most innovative interactive moment.
- **Type.** Keep Newsreader (display) + IBM Plex Sans (body); **add IBM Plex
  Mono** as an instrument-readout voice for data (temperatures, times, ZIPs,
  dates, route numbers).
- **Color as temperature.** A deliberate cool↔warm axis (pine green ↔ ember
  orange) used meaningfully on the live thermostat dial and the scheduler, not as
  decoration.
- **Mobile-first.** Sticky thumb-zone booking bar, scroll-snap day chips, 44px+
  tap targets, single-column reflow.

## Page order (confidence first, then conversion)

1. Launch ribbon → header (sticky estimate CTA)
2. Hero — live thermostat dial + micro-trust readout
3. Trust bar (licensed/insured placeholder, background-checked, guarantee, flat price)
4. Instant estimator (kept, "no payment now")
5. **Neighborhood Route Scheduler (signature)**
6. **"Feel confident" — fears answered** (parallel concern cards, not numbered)
7. The one-hour visit (kept — a real sequence, so time-coded markers stay)
8. Packages ($2,000 Priority / $1,500 Senior)
9. Printed field guide + official Nest links
10. Why neighborhood days fund the senior rate (consumer-honest social model)
11. Workmanship guarantee callout
12. FAQ (expanded with fear questions) → final CTA → footer

## Architecture

Static HTML/CSS/JS, ES modules, no build step (GitHub Pages friendly).

- `estimate.js` — unchanged public API (`validateZip`, `classifyZone`,
  `calculateEstimate`, `ADDITIONAL_THERMOSTAT_FEE`). Keeps existing tests green.
- `schedule.js` — **new**, pure + testable: `routeForZip`, `upcomingRouteDates`,
  `TIME_WINDOWS`, `buildBookingRequest`, `NEIGHBORHOOD_ROUTES`. Date generation
  takes a reference date for deterministic tests.
- `script.js` — wires estimator (kept), nav, hero dial settle animation, sticky
  mobile bar, and the scheduler UI to `schedule.js`.
- Scheduler submission is a **request** (mailto handoff), not a confirmed
  reservation — honest for pre-launch. Real scheduling backend is a launch TODO.

## Testing

- `tests/estimate.test.js` — unchanged, stays green.
- `tests/schedule.test.js` — **new**: route lookup, deterministic upcoming dates,
  booking-request assembly.
- `tests/content.test.js` — updated to the new content while keeping the
  invariants (brand name, `$1,500`/`$2,000`, `id="estimate-form"`, "about one
  hour", both official Nest support URLs).

## Out of scope (YAGNI)

Real booking/calendar backend, payments, CMS, analytics, multi-page. The
scheduler is front-end-real with a clearly-marked integration point.

## Before launch

- Fill licensing / insurance / warranty specifics (placeholders in trust bar + footer).
- Wire the scheduler to a real availability + booking system.
- Replace the mailto handoff with CRM/scheduling integration.
- Confirm Senior Community Rate eligibility wording.
