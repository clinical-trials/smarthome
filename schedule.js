import { classifyZone } from "./estimate.js";

// Each route is a real neighborhood cluster the concierge drives on fixed
// weekdays. Booking a day your neighbors also book is what keeps the route
// dense enough to sustain the Senior Community Rate. Weekday numbers follow
// JavaScript's Date.getDay(): 0 = Sunday ... 6 = Saturday.
export const NEIGHBORHOOD_ROUTES = [
  {
    id: "monday-santa-fe",
    name: "Santa Fe",
    dayLabel: "Monday",
    neighborhoods: "Santa Fe & Eldorado",
    zips: ["87507", "87501", "87506", "87505", "87508"],
    serviceDays: [1], // Mondays
    blurb: "Santa Fe runs as one consolidated Monday — the single biggest fuel saver on the week, with light early-week I-25 traffic.",
  },
  {
    id: "tuesday-north-valley",
    name: "North Valley & Westside",
    dayLabel: "Tuesday",
    neighborhoods: "North Valley, Corrales & the Westside mesa",
    zips: ["87113", "87107", "87048", "87114", "87120"],
    serviceDays: [2], // Tuesdays
    blurb: "A Rio Grande loop through the North Valley and Westside.",
  },
  {
    id: "wednesday-ne-heights",
    name: "Northeast Heights",
    dayLabel: "Wednesday",
    neighborhoods: "Northeast Heights & the Sandia foothills",
    zips: ["87109", "87122", "87111", "87112", "87110"],
    serviceDays: [3], // Wednesdays
    blurb: "Dense, close-together Heights homes — short hops keep the day efficient.",
  },
  {
    id: "thursday-se-kirtland",
    name: "Southeast & Kirtland",
    dayLabel: "Thursday",
    neighborhoods: "Southeast Albuquerque & Kirtland-adjacent",
    zips: ["87108", "87123", "87116", "87117"],
    serviceDays: [4], // Thursdays
    blurb: "Southeast routes; Kirtland AFB addresses (87117) need base access arranged ahead of time.",
  },
  {
    id: "friday-central-south-valley",
    name: "Central & South Valley",
    dayLabel: "Friday",
    neighborhoods: "Downtown, UNM, Barelas & the South Valley",
    zips: ["87131", "87106", "87102", "87104", "87105", "87121"],
    serviceDays: [5], // Fridays
    blurb: "A central and South Valley loop to close out the week.",
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
