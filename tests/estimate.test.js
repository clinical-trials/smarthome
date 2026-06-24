import test from "node:test";
import assert from "node:assert/strict";

import {
  ADDITIONAL_THERMOSTAT_FEE,
  calculateEstimate,
  classifyZone,
  validateZip,
} from "../estimate.js";

test("validates five-digit ZIP codes", () => {
  assert.equal(validateZip("95120"), true);
  assert.equal(validateZip("9512"), false);
  assert.equal(validateZip("Bay Area"), false);
});

test("classifies Santa Clara launch ZIP codes as currently booking", () => {
  assert.equal(classifyZone("95120").status, "booking");
  assert.equal(classifyZone("95070").status, "booking");
});

test("classifies other Bay Area ZIP codes as expansion areas", () => {
  assert.equal(classifyZone("94110").status, "expansion");
});

test("calculates the senior community rate for one thermostat", () => {
  const estimate = calculateEstimate({
    packageType: "senior",
    thermostatCount: 1,
    zip: "95125",
  });

  assert.equal(estimate.total, 1500);
  assert.equal(estimate.basePrice, 1500);
  assert.equal(estimate.additionalFee, 0);
});

test("calculates priority service and additional thermostat fees", () => {
  const estimate = calculateEstimate({
    packageType: "priority",
    thermostatCount: 2,
    zip: "95148",
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

