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

// Active service area: every Albuquerque and Santa Fe ZIP on the five weekly
// day-routes (plus Corrales). Other New Mexico ZIPs fall to "expansion" and get
// a suggestion for the nearest route day.
export const LAUNCH_ZIPS = new Set([
  // Albuquerque — Mon/Tue/Wed/Thu/Fri day-routes
  "87102", "87104", "87105", "87106", "87107", "87108", "87109",
  "87110", "87111", "87112", "87113", "87114", "87116", "87117",
  "87120", "87121", "87122", "87123", "87131",
  "87048", // Corrales
  // Santa Fe — consolidated Monday
  "87501", "87505", "87506", "87507", "87508",
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
      label: "Now booking in Albuquerque & Santa Fe",
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
