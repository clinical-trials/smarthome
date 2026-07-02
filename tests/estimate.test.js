import test from "node:test";
import assert from "node:assert/strict";

import {
  ADDITIONAL_THERMOSTAT_FEE,
  calculateEstimate,
  classifyZone,
  validateZip,
} from "../estimate.js";

test("validates five-digit ZIP codes", () => {
  assert.equal(validateZip("87122"), true);
  assert.equal(validateZip("8712"), false);
  assert.equal(validateZip("Albuquerque"), false);
});

test("classifies high-SES launch ZIP codes as currently booking", () => {
  assert.equal(classifyZone("87122").status, "booking");
  assert.equal(classifyZone("88011").status, "booking");
});

test("classifies other New Mexico ZIP codes as expansion areas", () => {
  assert.equal(classifyZone("87501").status, "expansion");
  assert.equal(classifyZone("88001").status, "expansion");
});

test("calculates the senior community rate for one thermostat", () => {
  const estimate = calculateEstimate({
    packageType: "senior",
    thermostatCount: 1,
    zip: "87122",
  });

  assert.equal(estimate.total, 1500);
  assert.equal(estimate.basePrice, 1500);
  assert.equal(estimate.additionalFee, 0);
});

test("calculates priority service and additional thermostat fees", () => {
  const estimate = calculateEstimate({
    packageType: "priority",
    thermostatCount: 2,
    zip: "87111",
  });

  assert.equal(ADDITIONAL_THERMOSTAT_FEE, 750);
  assert.equal(estimate.basePrice, 2000);
  assert.equal(estimate.additionalFee, 750);
  assert.equal(estimate.total, 2750);
});

test("rejects invalid estimate inputs", () => {
  assert.throws(
    () =>
      calculateEstimate({
        packageType: "priority",
        thermostatCount: 0,
        zip: "9512",
      }),
    /valid five-digit ZIP/,
  );
});
