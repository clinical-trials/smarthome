export const ADDITIONAL_THERMOSTAT_FEE = 750;

const PACKAGE_DETAILS = {
  senior: {
    name: "Senior Community Rate",
    price: 1500,
  },
  priority: {
    name: "Priority Climate Concierge",
    price: 2000,
  },
};

// Statewide launch focuses on New Mexico's highest-income ZIP codes:
// Albuquerque foothills + Corrales/Placitas, Santa Fe & Los Alamos, Las Cruces.
export const LAUNCH_ZIPS = new Set([
  "87122",
  "87111",
  "87048",
  "87043",
  "87544",
  "87506",
  "87505",
  "87508",
  "88011",
]);

export function validateZip(zip) {
  return /^\d{5}$/.test(String(zip).trim());
}

export function classifyZone(zip) {
  const normalizedZip = String(zip).trim();

  if (!validateZip(normalizedZip)) {
    return {
      status: "invalid",
      label: "Enter a valid five-digit ZIP code.",
    };
  }

  if (LAUNCH_ZIPS.has(normalizedZip)) {
    return {
      status: "booking",
      label: "Now booking in a priority launch ZIP",
    };
  }

  const prefix = Number(normalizedZip.slice(0, 3));
  if (prefix >= 870 && prefix <= 884) {
    return {
      status: "expansion",
      label: "New Mexico expansion list",
    };
  }

  return {
    status: "outside",
    label: "Outside our current New Mexico service plan",
  };
}

export function calculateEstimate({ packageType, thermostatCount, zip }) {
  if (!validateZip(zip)) {
    throw new Error("Please enter a valid five-digit ZIP code.");
  }

  const selectedPackage = PACKAGE_DETAILS[packageType];
  if (!selectedPackage) {
    throw new Error("Please select a service package.");
  }

  const count = Number(thermostatCount);
  if (!Number.isInteger(count) || count < 1 || count > 3) {
    throw new Error("Thermostat count must be between one and three.");
  }

  const additionalFee = Math.max(0, count - 1) * ADDITIONAL_THERMOSTAT_FEE;

  return {
    packageName: selectedPackage.name,
    basePrice: selectedPackage.price,
    additionalFee,
    total: selectedPackage.price + additionalFee,
    thermostatCount: count,
    zone: classifyZone(zip),
  };
}
