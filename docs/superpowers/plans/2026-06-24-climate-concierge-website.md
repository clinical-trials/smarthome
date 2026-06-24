# The Climate Concierge Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a distinctive responsive website with a working online smart-thermostat estimate.

**Architecture:** The site is a static page composed of semantic HTML and a mobile-first stylesheet. Pure pricing and ZIP-zone logic lives in `estimate.js`; `script.js` binds that logic to the estimator form and page interactions.

**Tech Stack:** HTML5, CSS, browser JavaScript modules, Node.js built-in test runner.

---

### Task 1: Test Pricing and Zone Logic

**Files:**
- Create: `tests/estimate.test.js`
- Create: `package.json`

- [ ] Write tests asserting the $1,500 senior package, $2,000 priority package, $750 additional-zone fee, ZIP validation, and Santa Clara launch classification.
- [ ] Run `npm test` and verify failure because `estimate.js` does not exist.
- [ ] Create `estimate.js` with `validateZip`, `classifyZone`, and `calculateEstimate`.
- [ ] Run `npm test` and verify all pricing tests pass.

### Task 2: Test Required Page Content

**Files:**
- Create: `tests/content.test.js`
- Create: `index.html`

- [ ] Write tests requiring the business name, one-hour promise, both package prices, estimator form, and official Google Nest support links.
- [ ] Run `npm test` and verify the content test fails because `index.html` does not exist.
- [ ] Build semantic page markup in `index.html`.
- [ ] Run `npm test` and verify the content tests pass.

### Task 3: Build the Editorial Interface

**Files:**
- Create: `styles.css`

- [ ] Implement the mobile-first paper-and-ink visual system, expressive type, thermostat dial, package layout, service-zone treatment, FAQ, and final CTA.
- [ ] Add responsive enhancements at 768px and 1024px.
- [ ] Include keyboard focus, reduced-motion behavior, readable line lengths, and 44px controls.

### Task 4: Connect the Estimator

**Files:**
- Create: `script.js`
- Modify: `index.html`

- [ ] Bind the estimate form to `calculateEstimate`.
- [ ] Render validation errors, service-zone status, price, package inclusions, and extra-zone disclosure.
- [ ] Add a compact mobile navigation toggle and estimator scroll actions.
- [ ] Run `npm test`.

### Task 5: Document and Verify

**Files:**
- Create: `README.md`
- Create: `docs/business-plan.md`

- [ ] Document local preview, tests, positioning, pricing, operating model, and rollout.
- [ ] Validate HTML structure and JavaScript syntax.
- [ ] Inspect the page at 375px, 768px, 1024px, and 1440px.
- [ ] Confirm external Google links respond successfully.
- [ ] Review the final diff against the design specification.

### Task 6: Publish

- [ ] Commit the verified files.
- [ ] Push `main` to `git@github.com:clinical-trials/smarthome.git`.

