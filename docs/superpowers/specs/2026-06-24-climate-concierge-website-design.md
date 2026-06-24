# The Climate Concierge Website Design

## Purpose

Create a memorable, editorial-style service website for a Bay Area smart thermostat installation business. The site must make the offer understandable in seconds, serve both busy households and seniors, and convert visitors through an immediate online estimate.

## Audience

- Busy homeowners who value speed, sourcing, priority scheduling, and after-hours availability.
- Seniors and caregivers who value patience, a fully configured thermostat, a large-print guide, and follow-up support.

## Positioning

The Climate Concierge sells a finished comfort setup rather than a piece of hardware. A typical compatible single-zone installation is completed in about one hour after arrival.

## Offers

### Senior Community Rate — $1,500

Includes one premium thermostat such as a current Google Nest model, compatibility review, sourcing, professional installation, Google Home app setup, personalized comfort schedule, large-print guide, and follow-up call.

### Priority Climate Concierge — $2,000

Includes the same core service plus priority scheduling, thermostat sourcing, caregiver or household coordination, and after-hours appointment availability.

Each package covers one thermostat and one HVAC zone. The estimator uses a draft $750 add-on per additional thermostat or zone. Final add-on pricing is confirmed after the wiring and system compatibility review.

## Page Structure

1. Editorial hero with the one-hour promise and immediate estimate CTA.
2. Trust strip describing the complete service.
3. Interactive estimator for ZIP code, service package, and thermostat count.
4. Two service package explanations.
5. One-hour visit timeline.
6. Large-print guide and post-installation support feature.
7. Santa Clara County launch zones and nine-county expansion story.
8. Official Google Nest instruction links.
9. FAQ and final booking CTA.

## Visual Direction

The page should feel like a carefully art-directed Bay Area weekend magazine, not a generic SaaS template. Use warm paper tones, near-black type, eucalyptus green, and a bright utility-orange accent. Combine expressive serif headlines with clean sans-serif body copy. Use asymmetry, oversized type, editorial rules, a thermostat-inspired dial, and restrained motion.

## Estimator Behavior

- Validate a five-digit ZIP code.
- Classify Santa Clara County launch ZIPs as currently booking.
- Accept other Bay Area ZIPs as expansion/waitlist areas.
- Calculate $1,500 for the Senior Community package or $2,000 for Priority service.
- Add $750 for each thermostat beyond the first.
- Display what is included and disclose that complex or incompatible HVAC systems require confirmation.

## Accessibility and Responsive Requirements

- Mobile-first layout from 320px upward.
- Minimum 44px touch targets and 16px body text.
- Visible keyboard focus, semantic labels, strong contrast, and reduced-motion support.
- No horizontal overflow at 375px, 768px, 1024px, or 1440px.

## Technical Approach

Use static HTML, CSS, and small JavaScript modules so the site can deploy directly through GitHub Pages. Keep pricing logic in a testable module and use Node's built-in test runner. No framework or build step is required.

## External Documentation

Link only to official Google support:

- Get started with Nest Thermostat and Nest Learning Thermostat (4th gen).
- Install your Nest thermostat.

