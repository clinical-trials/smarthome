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

const SANTA_CLARA_ZIPS = new Set([
  "94022",
  "94024",
  "94035",
  "94040",
  "94041",
  "94043",
  "94085",
  "94086",
  "94087",
  "94089",
  "94301",
  "94303",
  "94304",
  "94305",
  "94306",
  "95002",
  "95008",
  "95013",
  "95014",
  "95020",
  "95030",
  "95032",
  "95033",
  "95035",
  "95037",
  "95046",
  "95050",
  "95051",
  "95053",
  "95054",
  "95070",
  "95110",
  "95111",
  "95112",
  "95113",
  "95116",
  "95117",
  "95118",
  "95119",
  "95120",
  "95121",
  "95122",
  "95123",
  "95124",
  "95125",
  "95126",
  "95127",
  "95128",
  "95129",
  "95130",
  "95131",
  "95132",
  "95133",
  "95134",
  "95135",
  "95136",
  "95138",
  "95139",
  "95140",
  "95148",
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

  if (SANTA_CLARA_ZIPS.has(normalizedZip)) {
    return {
      status: "booking",
      label: "Now booking in Santa Clara County",
    };
  }

  const prefix = Number(normalizedZip.slice(0, 3));
  if (prefix >= 940 && prefix <= 949) {
    return {
      status: "expansion",
      label: "Bay Area expansion list",
    };
  }

  return {
    status: "outside",
    label: "Outside our current Bay Area service plan",
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

