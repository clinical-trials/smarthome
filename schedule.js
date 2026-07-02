import { classifyZone } from "./estimate.js";

// Each route is a real neighborhood cluster the concierge drives on fixed
// weekdays. Booking a day your neighbors also book is what keeps the route
// dense enough to sustain the Senior Community Rate. Weekday numbers follow
// JavaScript's Date.getDay(): 0 = Sunday ... 6 = Saturday.
export const NEIGHBORHOOD_ROUTES = [
  {
    id: "albuquerque-foothills",
    name: "Albuquerque foothills",
    neighborhoods: "Far Northeast Heights, Corrales & Placitas",
    zips: ["87122", "87111", "87048", "87043"],
    serviceDays: [1, 4], // Mondays & Thursdays
    blurb: "Established foothill and village homes — short hops between appointments keep the day efficient.",
  },
  {
    id: "santa-fe-los-alamos",
    name: "Santa Fe & Los Alamos",
    neighborhoods: "Santa Fe, Eldorado, Tesuque & Los Alamos",
    zips: ["87544", "87506", "87505", "87508"],
    serviceDays: [2, 5], // Tuesdays & Fridays
    blurb: "High-altitude homes up north — we cluster the long drive into one efficient day.",
  },
  {
    id: "las-cruces",
    name: "Las Cruces",
    neighborhoods: "East Mesa & the Las Cruces foothills",
    zips: ["88011"],
    serviceDays: [3], // Wednesdays
    blurb: "A focused southern route — we batch Las Cruces visits to make the distance worth it.",
  },
];

// Any New Mexico booking ZIP we haven't mapped to a named cluster still gets
// real route days so no in-area visitor hits a dead end.
export const GENERAL_ROUTE = {
  id: "new-mexico",
  name: "New Mexico route",
  neighborhoods: "Across New Mexico",
  zips: [],
  serviceDays: [1, 3, 5], // Mondays, Wednesdays & Fridays
  blurb: "We group your visit into the nearest active neighborhood day.",
};

export const TIME_WINDOWS = [
  { id: "morning", label: "Morning", range: "8:00–11:00 AM" },
  { id: "midday", label: "Midday", range: "11:00 AM–2:00 PM" },
  { id: "afternoon", label: "Afternoon", range: "2:00–5:00 PM" },
];

const PACKAGE_NAMES = {
  senior: "Senior Community Rate",
  priority: "Priority Climate Concierge",
};

// Resolve a ZIP to its service status and (when we're booking there) its route.
export function routeForZip(zip) {
  const zone = classifyZone(zip);

  if (zone.status !== "booking") {
    return { status: zone.status, zone, route: null };
  }

  const normalized = String(zip).trim();
  const route =
    NEIGHBORHOOD_ROUTES.find((candidate) => candidate.zips.includes(normalized)) ||
    GENERAL_ROUTE;

  return { status: "booking", zone, route };
}

// Next `count` calendar dates (starting tomorrow) that fall on the route's
// service weekdays. Pure: pass `fromDate` for deterministic tests.
export function upcomingRouteDates(route, fromDate = new Date(), count = 4) {
  if (!route || !Array.isArray(route.serviceDays) || route.serviceDays.length === 0) {
    return [];
  }

  const dates = [];
  const cursor = new Date(
    fromDate.getFullYear(),
    fromDate.getMonth(),
    fromDate.getDate(),
  );
  cursor.setDate(cursor.getDate() + 1); // earliest request is the next day

  let guard = 0;
  while (dates.length < count && guard < 120) {
    if (route.serviceDays.includes(cursor.getDay())) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
    guard += 1;
  }

  return dates;
}

export function formatRouteDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function packageName(packageType) {
  return PACKAGE_NAMES[packageType] || PACKAGE_NAMES.priority;
}

// Assemble the plain-language request a visitor sends to lock in a day.
// Pre-launch this is a request (mailto handoff), not a confirmed reservation.
export function buildBookingRequest({ zip, route, date, windowId, packageType }) {
  const window = TIME_WINDOWS.find((candidate) => candidate.id === windowId);
  const name = packageName(packageType);
  const dateLabel = date ? formatRouteDate(date) : "Flexible";
  const windowLabel = window ? `${window.label} (${window.range})` : "Flexible";

  const subject = `Installation day request — ${route ? route.name : "New Mexico"}`;

  const body = [
    "Hello,",
    "",
    "I'd like to request a neighborhood installation day:",
    `• Neighborhood route: ${route ? route.name : "New Mexico"}`,
    `• Preferred day: ${dateLabel}`,
    `• Time window: ${windowLabel}`,
    `• Service: ${name}`,
    `• ZIP: ${zip}`,
    "",
    "I understand this is a request and that you'll confirm by text within one business day. No payment now.",
  ].join("\n");

  return {
    subject,
    body,
    packageName: name,
    dateLabel,
    windowLabel: window ? window.label : "Flexible",
  };
}
