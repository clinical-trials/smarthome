# Commercial Launch and Social Enterprise Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition the website around targeted commercial launch zones while explaining senior service as the social entrepreneurship mission.

**Architecture:** Preserve the static site and existing estimator logic. Change the content hierarchy and add one responsive social-enterprise section, with content tests protecting the new positioning.

**Tech Stack:** HTML5, CSS, Node.js built-in test runner.

---

### Task 1: Protect the New Positioning

**Files:**
- Modify: `tests/content.test.js`

- [ ] Add a content test requiring “commercial launch zones,” “social entrepreneurship,” and the three initial commercial clusters.
- [ ] Run `npm test` and verify the new test fails because the phrases are absent.

### Task 2: Reorder the Commercial Offer

**Files:**
- Modify: `index.html`

- [ ] Present Priority Climate Concierge before Senior Community in the estimator and service cards.
- [ ] Make Priority Climate Concierge the estimator's default selection.
- [ ] Describe Priority appointments as the business's commercial engine without changing package prices or inclusions.

### Task 3: Replace the Rollout Story

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Rename the rollout area “Commercial launch zones.”
- [ ] Present three route-dense commercial clusters and one later south-county extension.
- [ ] Add a responsive “Premium convenience powers community comfort” social-enterprise section.
- [ ] Explain that commercial revenue helps sustain senior service without making a fixed subsidy promise.

### Task 4: Update the Business Model

**Files:**
- Modify: `docs/business-plan.md`

- [ ] Define the commercial engine, launch-cluster criteria, and social entrepreneurship model.
- [ ] Separate commercial customer acquisition from senior and caregiver partnerships.

### Task 5: Verify and Publish

- [ ] Run `npm test`, JavaScript syntax checks, and `git diff --check`.
- [ ] Inspect 375px, 768px, 1024px, and 1440px layouts for overflow.
- [ ] Commit the repositioning and push `main` to `origin`.

