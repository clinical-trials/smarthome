import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("homepage contains the core offer and official Nest guides", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /The Climate Concierge/);
  assert.match(html, /about one hour/i);
  assert.match(html, /\$1,500/);
  assert.match(html, /\$2,000/);
  assert.match(html, /id="estimate-form"/);
  assert.match(
    html,
    /https:\/\/support\.google\.com\/googlenest\/answer\/10125150/,
  );
  assert.match(
    html,
    /https:\/\/support\.google\.com\/googlenest\/answer\/9274936/,
  );
});

test("homepage leads with commercial launch zones and the social enterprise model", async () => {
  const html = await readFile(new URL("../index.html", import.meta.url), "utf8");

  assert.match(html, /commercial launch zones/i);
  assert.match(html, /social entrepreneurship/i);
  assert.match(html, /Almaden, Saratoga &amp; Los Gatos/);
  assert.match(html, /Evergreen, Berryessa &amp; East Foothills/);
  assert.match(html, /Cambrian, Willow Glen, Cupertino &amp; west Sunnyvale/);
});
