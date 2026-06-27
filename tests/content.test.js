import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readHome() {
  return readFile(new URL("../index.html", import.meta.url), "utf8");
}

test("homepage contains the core offer and official Nest guides", async () => {
  const html = await readHome();

  assert.match(html, /The Climate Concierge/);
  assert.match(html, /about one hour/i);
  assert.match(html, /\$1,500/);
  assert.match(html, /\$2,000/);
  assert.match(html, /id="estimate-form"/);
  assert.match(html, /https:\/\/support\.google\.com\/googlenest\/answer\/10125150/);
  assert.match(html, /https:\/\/support\.google\.com\/googlenest\/answer\/9274936/);
});

test("homepage pairs the scheduler with the representative route map", async () => {
  const html = await readHome();

  assert.match(html, /id="schedule"/);
  assert.match(html, /id="schedule-form"/);
  assert.match(html, /neighborhood installation days/i);

  // Representative road-mile route map and its three clusters
  assert.match(html, /Levi's Stadium hub/);
  assert.match(html, /Miles saved/);
  assert.match(html, /Almaden/);
  assert.match(html, /Alum Rock/);
  assert.match(html, /Cambrian/);
  assert.match(html, /95127/);
});

test("homepage builds confidence honestly, without fabricated proof", async () => {
  const html = await readHome();

  assert.match(html, /Workmanship guarantee/i);
  assert.match(html, /no payment now/i);
  assert.match(html, /compatibility/i);
  // Credentials are honest placeholders, not invented numbers.
  assert.match(html, /fill in before launch/i);
});

test("homepage offers an email-captured quick quote", async () => {
  const html = await readHome();

  assert.match(html, /id="quote-capture"/);
  assert.match(html, /id="quote-email"/);
  assert.match(html, /quote by email/i);
});
