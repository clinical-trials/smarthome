import test from "node:test";
import assert from "node:assert/strict";

import {
  NEIGHBORHOOD_ROUTES,
  TIME_WINDOWS,
  buildBookingRequest,
  routeForZip,
  upcomingRouteDates,
} from "../schedule.js";

test("maps booking ZIP codes to their neighborhood route", () => {
  assert.equal(routeForZip("95120").route.id, "almaden-saratoga-los-gatos");
  assert.equal(routeForZip("95148").route.id, "evergreen-berryessa");
  assert.equal(routeForZip("95125").route.id, "cambrian-willow-glen");
});

test("falls back to a general Santa Clara route for unmapped booking ZIPs", () => {
  const resolved = routeForZip("95111"); // valid Santa Clara ZIP, not in a named cluster
  assert.equal(resolved.status, "booking");
  assert.equal(resolved.route.id, "santa-clara");
});

test("returns no route outside the current booking area", () => {
  assert.equal(routeForZip("94110").status, "expansion");
  assert.equal(routeForZip("94110").route, null);
  assert.equal(routeForZip("123").status, "invalid");
});

test("lists upcoming dates only on the route's service weekdays", () => {
  const route = NEIGHBORHOOD_ROUTES[0]; // Mondays (1) & Thursdays (4)
  const fromThursday = new Date(2026, 5, 25); // Thu Jun 25 2026
  const dates = upcomingRouteDates(route, fromThursday, 4);

  assert.equal(dates.length, 4);
  for (const date of dates) {
    assert.ok(route.serviceDays.includes(date.getDay()));
  }
  // strictly ascending and all after the reference day
  assert.ok(dates[0] > fromThursday);
  assert.ok(dates[0] < dates[1]);
  assert.ok(dates[1] < dates[2]);
});

test("builds an honest, request-shaped booking message", () => {
  const route = NEIGHBORHOOD_ROUTES[0];
  const date = upcomingRouteDates(route, new Date(2026, 5, 25), 1)[0];
  const request = buildBookingRequest({
    zip: "95120",
    route,
    date,
    windowId: "morning",
    packageType: "senior",
  });

  assert.match(request.subject, /Installation day request/);
  assert.match(request.body, /Senior Community Rate/);
  assert.match(request.body, /95120/);
  assert.match(request.body, /No payment now/);
  assert.equal(request.windowLabel, "Morning");
  assert.equal(TIME_WINDOWS[0].id, "morning");
});
