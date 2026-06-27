import { calculateEstimate } from "./estimate.js";
import {
  TIME_WINDOWS,
  buildBookingRequest,
  formatRouteDate,
  packageName,
  routeForZip,
  upcomingRouteDates,
} from "./schedule.js";

const BOOKING_EMAIL = "hello@theclimateconcierge.com";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

function mailto(subject, body) {
  return `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#primary-navigation");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
});

navigation?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

/* ------------------------------------------------------------------ */
/* Hero dial — settles to a comfortable temperature on load            */
/* ------------------------------------------------------------------ */
function runNest() {
  const nest = document.querySelector("[data-nest]");
  if (!nest) return;

  const dial = nest.querySelector("[data-dial]");
  const tempEl = nest.querySelector("[data-dial-temp]");
  const modeEl = nest.querySelector("[data-dial-mode]");
  const subEl = nest.querySelector("[data-dial-sub]");
  const leafEl = nest.querySelector("[data-dial-leaf]");
  const segButtons = nest.querySelectorAll("[data-mode]");
  const hours = nest.querySelector("[data-hours]");
  const hoursOut = nest.querySelector("[data-hours-out]");
  const saveMonth = nest.querySelector("[data-save-month]");
  const saveYear = nest.querySelector("[data-save-year]");
  const journeyYear = nest.querySelector("[data-journey-year]");
  const journeyTotal = nest.querySelector("[data-journey-total]");
  const journeyFill = nest.querySelector("[data-journey-fill]");
  const journeyReward = nest.querySelector("[data-journey-reward]");
  const arcEl = nest.querySelector("[data-dial-arc]");
  const markerEl = nest.querySelector("[data-dial-marker]");

  // Illustrative model: Auto-Away holds Eco temperatures while the house is
  // empty. ~12% off a typical monthly bill at 8 hours away, capped at 20%.
  const BASELINE_MONTHLY = 150;
  const STATES = {
    home: { temp: 72, mode: "HEATING", sub: "Comfort", away: false },
    away: { temp: 62, mode: "ECO · AWAY", sub: "Saving while you're out", away: true },
  };

  // Map a temperature to a point on the dial ring (270° sweep, gap at bottom).
  function polar(r, deg) {
    const a = (deg * Math.PI) / 180;
    return [200 + r * Math.sin(a), 200 - r * Math.cos(a)];
  }

  function tempToDeg(t) {
    const min = 50;
    const max = 85;
    const clamped = Math.max(min, Math.min(max, t));
    return -135 + ((clamped - min) / (max - min)) * 270;
  }

  function renderDial(temp) {
    const end = tempToDeg(temp);
    const r = 151;
    const [sx, sy] = polar(r, -135);
    const [ex, ey] = polar(r, end);
    const large = end - -135 > 180 ? 1 : 0;
    if (arcEl) {
      arcEl.setAttribute(
        "d",
        `M ${sx.toFixed(1)} ${sy.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${ex.toFixed(1)} ${ey.toFixed(1)}`,
      );
    }
    if (markerEl) {
      markerEl.setAttribute("transform", `rotate(${end.toFixed(1)} 200 200)`);
    }
  }

  let displayed = reduceMotion.matches ? 72 : 64;
  if (tempEl) tempEl.textContent = `${displayed}°`;
  renderDial(displayed);

  function animateTemp(to) {
    if (reduceMotion.matches) {
      displayed = to;
      if (tempEl) tempEl.textContent = `${to}°`;
      renderDial(to);
      return;
    }
    const from = displayed;
    const duration = 700;
    let startTime = null;
    const step = (now) => {
      if (startTime === null) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(from + (to - from) * eased);
      if (tempEl) tempEl.textContent = `${value}°`;
      renderDial(value);
      if (progress < 1) requestAnimationFrame(step);
      else displayed = to;
    };
    requestAnimationFrame(step);
  }

  function setOccupancy(next) {
    const state = STATES[next] || STATES.home;
    nest.classList.toggle("is-away", state.away);
    if (modeEl) modeEl.textContent = state.mode;
    if (subEl) subEl.textContent = state.sub;
    if (leafEl) leafEl.setAttribute("opacity", state.away ? "1" : "0");
    if (dial) {
      dial.setAttribute(
        "aria-label",
        state.away
          ? `Nest thermostat in Eco mode at ${state.temp} degrees, saving energy while away`
          : `Nest thermostat set to ${state.temp} degrees, comfortable`,
      );
    }
    segButtons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.mode === next)),
    );
    animateTemp(state.temp);
  }

  const HORIZON_YEARS = 10;
  let annualSavings = 0;

  function rewardFor(total) {
    if (total >= 3000) return "≈ a trip to Europe for two ✈";
    if (total >= 2000) return "≈ a long weekend away, flights in";
    if (total >= 1200) return "≈ that room you've meant to redo";
    if (total >= 600) return "≈ a weekend away";
    if (total >= 250) return "≈ dinner out, on the house";
    return "≈ a year of smaller bills";
  }

  function setJourney(progress) {
    const year = Math.max(1, Math.ceil(progress * HORIZON_YEARS));
    const total = annualSavings * HORIZON_YEARS * progress;
    if (journeyYear) journeyYear.textContent = `Year ${year}`;
    if (journeyTotal) journeyTotal.textContent = currency.format(Math.round(total));
    if (journeyFill) journeyFill.style.width = `${progress * 100}%`;
    if (journeyReward) journeyReward.textContent = rewardFor(total);
  }

  function updateSavings() {
    const hrs = Number(hours?.value ?? 8);
    const pct = Math.min(0.2, (hrs / 8) * 0.12);
    const month = Math.round(BASELINE_MONTHLY * pct);
    annualSavings = month * 12;
    if (hoursOut) hoursOut.textContent = `${hrs} hr${hrs === 1 ? "" : "s"}`;
    if (saveMonth) saveMonth.textContent = currency.format(month);
    if (saveYear) saveYear.textContent = currency.format(annualSavings);
    if (reduceMotion.matches) setJourney(1);
  }

  segButtons.forEach((button) =>
    button.addEventListener("click", () => setOccupancy(button.dataset.mode)),
  );
  hours?.addEventListener("input", updateSavings);

  updateSavings();

  if (reduceMotion.matches) {
    setOccupancy("home");
    setJourney(1);
  } else {
    window.setTimeout(() => setOccupancy("home"), 350);

    // Loop the savings story: sweep year 1 -> 10, hold, repeat.
    const SWEEP = 5200;
    const HOLD = 1400;
    let startTime = null;
    const loop = (now) => {
      if (startTime === null) startTime = now;
      const elapsed = (now - startTime) % (SWEEP + HOLD);
      const progress = Math.min(elapsed / SWEEP, 1);
      const eased = 1 - Math.pow(1 - progress, 2);
      setJourney(Math.max(0.0001, eased));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

/* ------------------------------------------------------------------ */
/* Estimator                                                           */
/* ------------------------------------------------------------------ */
const estimateForm = document.querySelector("#estimate-form");
const estimateResult = document.querySelector("#estimate-result");
const estimateError = document.querySelector("#estimate-error");
const quoteCapture = document.querySelector("#quote-capture");
const quoteStatus = document.querySelector("#quote-status");
let lastEstimate = null;

function renderEstimate(estimate) {
  lastEstimate = estimate;
  document.querySelector("#result-zone").textContent = estimate.zone.label;
  document.querySelector("#result-zone").dataset.status = estimate.zone.status;
  document.querySelector("#result-package").textContent = estimate.packageName;
  document.querySelector("#result-price").textContent = currency.format(estimate.total);

  document.querySelector("#result-description").textContent =
    estimate.thermostatCount === 1
      ? "One thermostat and one HVAC zone are included."
      : `${estimate.thermostatCount} thermostats or zones are included in this working estimate, with ${currency.format(estimate.additionalFee)} in estimated add-on service.`;

  estimateResult.hidden = false;
  estimateResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

estimateForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  estimateError.textContent = "";
  const data = new FormData(estimateForm);

  try {
    const estimate = calculateEstimate({
      packageType: data.get("package"),
      thermostatCount: data.get("thermostatCount"),
      zip: data.get("zip"),
    });
    renderEstimate(estimate);

    // Hand the estimate straight into the scheduler so booking is one step away.
    schedule.packageType = data.get("package") || schedule.packageType;
    const zip = String(data.get("zip")).trim();
    if (scheduleZipInput) scheduleZipInput.value = zip;
    if (estimate.zone.status === "booking") runScheduleLookup(zip);
  } catch (error) {
    estimateResult.hidden = true;
    estimateError.textContent = error.message;
    document.querySelector("#zip")?.focus();
  }
});

// Keep the package choice in sync between the estimator and the scheduler.
estimateForm?.addEventListener("change", (event) => {
  if (event.target instanceof HTMLInputElement && event.target.name === "package") {
    schedule.packageType = event.target.value;
    if (!schedulePanel.hidden) {
      renderPackages();
      renderTicket();
    }
  }
});

// Quick quote: collect an email, then hand off a prefilled detailed-quote
// request. The lead is stored locally for now; wire it to a CRM before launch.
quoteCapture?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#quote-email");
  const email = (input?.value || "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (quoteStatus) {
      quoteStatus.textContent = "Enter a valid email so we can send your written quote.";
    }
    input?.focus();
    return;
  }

  try {
    const leads = JSON.parse(localStorage.getItem("cc_quote_leads") || "[]");
    leads.push({ email, estimate: lastEstimate, at: new Date().toISOString() });
    localStorage.setItem("cc_quote_leads", JSON.stringify(leads));
  } catch (error) {
    /* storage unavailable — the email hand-off below still works */
  }

  const total = lastEstimate ? currency.format(lastEstimate.total) : "";
  const subject = `Detailed quote request${lastEstimate ? ` — ${lastEstimate.packageName}` : ""}`;
  const body = [
    "Hello,",
    "",
    "Please send my detailed, written quote.",
    `Working estimate: ${total}`,
    `Package: ${lastEstimate ? lastEstimate.packageName : ""}`,
    `Service-area status: ${lastEstimate ? lastEstimate.zone.label : ""}`,
    `Thermostats / zones: ${lastEstimate ? lastEstimate.thermostatCount : ""}`,
    `Reply to: ${email}`,
  ].join("\n");

  if (quoteStatus) {
    quoteStatus.textContent =
      "Opening your email to send — we'll reply with your written quote and hold your neighborhood day.";
  }
  window.location.href = mailto(subject, body);
});

/* ------------------------------------------------------------------ */
/* Neighborhood scheduler (signature)                                  */
/* ------------------------------------------------------------------ */
const scheduleForm = document.querySelector("#schedule-form");
const scheduleZipInput = document.querySelector("#schedule-zip");
const scheduleError = document.querySelector("#schedule-error");
const schedulePanel = document.querySelector("#schedule-panel");
const routeEl = document.querySelector("#sched-route");
const daysEl = document.querySelector("#sched-days");
const windowsEl = document.querySelector("#sched-windows");
const packagesEl = document.querySelector("#sched-packages");
const ticketEl = document.querySelector("#sched-ticket");

const SCHEDULE_PACKAGES = [
  { type: "priority", label: "Priority Concierge", price: "$2,000" },
  { type: "senior", label: "Senior Community", price: "$1,500" },
];

const schedule = {
  zip: "",
  resolution: null,
  dates: [],
  selectedDateIndex: null,
  windowId: null,
  packageType:
    document.querySelector('input[name="package"]:checked')?.value || "priority",
};

function runScheduleLookup(rawZip) {
  const zip = String(rawZip).trim();
  const resolution = routeForZip(zip);

  if (resolution.status === "invalid") {
    schedulePanel.hidden = true;
    scheduleError.textContent = "Enter a valid five-digit ZIP code.";
    return;
  }

  scheduleError.textContent = "";
  schedule.zip = zip;
  schedule.resolution = resolution;
  schedule.selectedDateIndex = null;
  schedule.windowId = null;

  if (resolution.status === "booking") {
    schedule.dates = upcomingRouteDates(resolution.route, new Date(), 5);
  } else {
    schedule.dates = [];
  }

  renderPanel();
  schedulePanel.hidden = false;
}

function renderPanel() {
  renderRoute();

  const isBooking = schedule.resolution?.status === "booking";
  for (const pick of schedulePanel.querySelectorAll(".sched-pick")) {
    pick.hidden = !isBooking;
  }

  if (isBooking) {
    renderDays();
    renderWindows();
    renderPackages();
  }
  renderTicket();
}

function renderRoute() {
  routeEl.replaceChildren();
  const status = schedule.resolution?.status;

  if (status === "booking") {
    const route = schedule.resolution.route;
    routeEl.classList.remove("is-waitlist");
    routeEl.append(
      el("span", "route-tag", `Your route · ${schedule.zip}`),
      el("h3", null, route.name),
      el("p", null, route.blurb),
    );
    return;
  }

  routeEl.classList.add("is-waitlist");
  const heading =
    status === "expansion"
      ? "We're routing to your area soon"
      : "Just outside our current routes";
  const note =
    status === "expansion"
      ? "You're on the Bay Area expansion list. Add your details and we'll reach out as routes open near you."
      : "We're not in your area yet — but tell us where you are and we'll let you know when a route reaches you.";

  routeEl.append(
    el("span", "route-tag", `ZIP ${schedule.zip}`),
    el("h3", null, heading),
    el("p", null, note),
  );
}

function renderDays() {
  daysEl.replaceChildren();

  schedule.dates.forEach((date, index) => {
    const button = el("button", "sched-day");
    button.type = "button";
    button.setAttribute(
      "aria-pressed",
      String(schedule.selectedDateIndex === index),
    );
    button.append(
      el("span", "day-week", date.toLocaleDateString("en-US", { weekday: "short" })),
      el("span", "day-date", String(date.getDate())),
      el("span", "day-month", date.toLocaleDateString("en-US", { month: "short" })),
    );
    button.addEventListener("click", () => {
      schedule.selectedDateIndex = index;
      renderDays();
      renderTicket();
    });
    daysEl.append(button);
  });
}

function renderWindows() {
  windowsEl.replaceChildren();

  for (const window of TIME_WINDOWS) {
    const button = el("button", "sched-window");
    button.type = "button";
    button.setAttribute("aria-pressed", String(schedule.windowId === window.id));
    button.append(
      el("span", "win-label", window.label),
      el("span", "win-range", window.range),
    );
    button.addEventListener("click", () => {
      schedule.windowId = window.id;
      renderWindows();
      renderTicket();
    });
    windowsEl.append(button);
  }
}

function renderPackages() {
  packagesEl.replaceChildren();

  for (const option of SCHEDULE_PACKAGES) {
    const button = el("button", "sched-package");
    button.type = "button";
    button.setAttribute(
      "aria-pressed",
      String(schedule.packageType === option.type),
    );
    button.append(
      el("span", "pkg-label", option.label),
      el("span", "pkg-price", option.price),
    );
    button.addEventListener("click", () => {
      schedule.packageType = option.type;
      const radio = document.querySelector(
        `input[name="package"][value="${option.type}"]`,
      );
      if (radio) radio.checked = true;
      renderPackages();
      renderTicket();
    });
    packagesEl.append(button);
  }
}

function renderTicket() {
  ticketEl.replaceChildren();
  const status = schedule.resolution?.status;

  // Waitlist branches: a single "join the list" action.
  if (status === "expansion" || status === "outside") {
    const action = el("a", "button button-dark", "Add me to the list");
    action.href = mailto(
      `Service interest — ${schedule.zip}`,
      `Hello,\n\nI'd like to be notified when The Climate Concierge routes reach my area.\n\nZIP: ${schedule.zip}\n`,
    );
    ticketEl.append(
      el("p", "ticket-note", "No payment, no obligation — just a heads-up when we're nearby."),
      action,
    );
    return;
  }

  const head = el("div", "ticket-head");
  head.append(el("span", null, "Installation request"), el("span", null, "No payment now"));
  ticketEl.append(head);

  const date =
    schedule.selectedDateIndex != null
      ? schedule.dates[schedule.selectedDateIndex]
      : null;
  const window = TIME_WINDOWS.find((item) => item.id === schedule.windowId);

  const dl = document.createElement("dl");
  const rows = [
    ["Day", date ? formatRouteDate(date) : "Pick a day above"],
    ["Window", window ? `${window.label} · ${window.range}` : "Pick a window above"],
    ["Service", packageName(schedule.packageType)],
  ];
  for (const [term, value] of rows) {
    dl.append(el("dt", null, term), el("dd", null, value));
  }
  ticketEl.append(dl);

  ticketEl.append(
    el(
      "p",
      "ticket-note",
      "Send your request and we'll confirm by text within one business day. Compatibility is checked before anything is charged.",
    ),
  );

  const ready = Boolean(date && window);
  if (ready) {
    const request = buildBookingRequest({
      zip: schedule.zip,
      route: schedule.resolution.route,
      date,
      windowId: schedule.windowId,
      packageType: schedule.packageType,
    });
    const action = el("a", "button button-accent", "Request this installation day");
    action.href = mailto(request.subject, request.body);
    ticketEl.append(action);
  } else {
    const action = el("span", "button button-accent", "Pick a day and window");
    action.setAttribute("aria-disabled", "true");
    ticketEl.append(action);
  }
}

scheduleForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  runScheduleLookup(scheduleZipInput.value);
});

/* ------------------------------------------------------------------ */
/* Mobile booking bar — appears once the hero is scrolled past         */
/* ------------------------------------------------------------------ */
function runBookBar() {
  const bar = document.querySelector("[data-book-bar]");
  const hero = document.querySelector(".hero");
  if (!bar || !hero || !("IntersectionObserver" in window)) return;

  bar.hidden = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      bar.classList.toggle("is-visible", !entry.isIntersecting);
    },
    { rootMargin: "-40% 0px 0px 0px" },
  );
  observer.observe(hero);
}

/* ------------------------------------------------------------------ */
/* Route map — draws itself in when scrolled into view                 */
/* ------------------------------------------------------------------ */
function runRouteMap() {
  const map = document.querySelector("[data-routemap]");
  if (!map) return;

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    map.classList.add("is-drawn");
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          map.classList.add("is-drawn");
          obs.disconnect();
        }
      }
    },
    { threshold: 0.3 },
  );
  observer.observe(map);
}

runNest();
runRouteMap();
runBookBar();
