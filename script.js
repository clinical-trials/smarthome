import { calculateEstimate } from "./estimate.js";

const form = document.querySelector("#estimate-form");
const result = document.querySelector("#estimate-result");
const error = document.querySelector("#estimate-error");
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("#primary-navigation");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function renderEstimate(estimate) {
  const zoneElement = document.querySelector("#result-zone");
  const packageElement = document.querySelector("#result-package");
  const priceElement = document.querySelector("#result-price");
  const descriptionElement = document.querySelector("#result-description");
  const reserveLink = document.querySelector("#reserve-estimate");

  zoneElement.textContent = estimate.zone.label;
  zoneElement.dataset.status = estimate.zone.status;
  packageElement.textContent = estimate.packageName;
  priceElement.textContent = currency.format(estimate.total);

  const extraDescription =
    estimate.thermostatCount === 1
      ? "One thermostat and one HVAC zone are included."
      : `${estimate.thermostatCount} thermostats or zones are included in this working estimate, with ${currency.format(estimate.additionalFee)} in estimated add-on service.`;

  descriptionElement.textContent = extraDescription;

  const subject = encodeURIComponent(
    `${estimate.packageName} appointment request`,
  );
  const body = encodeURIComponent(
    `Hello,\n\nI received an online estimate of ${currency.format(estimate.total)} for ${estimate.thermostatCount} thermostat(s). My service-area status is: ${estimate.zone.label}.\n\nPlease contact me about an appointment.`,
  );
  reserveLink.href = `mailto:hello@theclimateconcierge.com?subject=${subject}&body=${body}`;

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  error.textContent = "";

  const data = new FormData(form);

  try {
    const estimate = calculateEstimate({
      packageType: data.get("package"),
      thermostatCount: data.get("thermostatCount"),
      zip: data.get("zip"),
    });
    renderEstimate(estimate);
  } catch (estimateError) {
    result.hidden = true;
    error.textContent = estimateError.message;
    document.querySelector("#zip")?.focus();
  }
});

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navigation?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

