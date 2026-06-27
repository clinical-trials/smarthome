# The Climate Concierge

Website for a Bay Area smart thermostat installation concierge serving busy
households, seniors, and caregivers.

The v2 rework (branch `version-2-claude`) is built to drive bookings and make
people feel confident about installation — without fabricated proof. Its
signature is the **Neighborhood Route Scheduler**: enter a ZIP, see the days the
concierge already routes past that street, pick a day and arrival window, and
send a request. Pre-launch, that request is an honest hand-off (it opens a
prefilled email; no payment, confirmed by text) rather than a live reservation.

## Preview

Run a local static server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Test

```bash
npm test
```

The site uses static HTML, CSS, and JavaScript and can be hosted directly with GitHub Pages.

## Before Launch

- Replace `hello@theclimateconcierge.com` if a different booking address will be used.
- Confirm final additional-zone pricing and service eligibility language.
- Add a scheduling or CRM integration.
- Add business licensing, privacy, warranty, and cancellation terms.
- Replace draft service claims if operating procedures change.

