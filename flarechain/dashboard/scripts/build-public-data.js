#!/usr/bin/env node
"use strict";

/**
 * Generates public/data.json — a size-optimized copy of
 * ../data/processed_flaring_data.json for the client-side data explorer.
 *
 * The canonical file repeats data_source/source_url/country on every one
 * of its 6,287 records (required — that's the documented output schema
 * from batch 1, and anchor_record.js hashes records in exactly that
 * shape). For shipping to the browser that's ~1.2MB of pure repetition,
 * so this factors those three fields out to the top level once and
 * stores each record as a compact [site_name, year, flared_volume_bcm]
 * tuple instead of an object — roughly an 8x size reduction.
 *
 * This does NOT touch the canonical data file. Run before building:
 * wired up as an npm "prebuild" step in package.json, so `npm run build`
 * always regenerates this from current data automatically.
 */

const fs = require("fs");
const path = require("path");

const SOURCE = path.resolve(__dirname, "..", "..", "data", "processed_flaring_data.json");
const DEST = path.resolve(__dirname, "..", "public", "data.json");

if (!fs.existsSync(SOURCE)) {
  console.error(
    `ERROR: ${SOURCE} does not exist.\n` +
      "The dashboard has nothing to display without it. Generate it first, from the flarechain/ directory:\n" +
      "  python scripts/clean_flaring_data.py\n" +
      "(see docs/data_sources.md if that script itself needs a raw download first)"
  );
  process.exit(1);
}

const records = JSON.parse(fs.readFileSync(SOURCE, "utf8"));

if (records.length === 0) {
  console.log("No records in processed_flaring_data.json — writing empty dataset.");
  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.writeFileSync(DEST, JSON.stringify({ country: null, data_source: null, source_url: null, records: [] }));
  process.exit(0);
}

const first = records[0];
const country = first.country;
const data_source = first.data_source;
const source_url = first.source_url;

const mismatched = records.filter(
  (r) => r.country !== country || r.data_source !== data_source || r.source_url !== source_url
);
if (mismatched.length > 0) {
  console.error(
    `ERROR: ${mismatched.length} record(s) have a different country/data_source/source_url than the ` +
      `first record. This script assumes those three fields are identical across the whole file ` +
      `(true for the current single-country pipeline) — fix the assumption before regenerating.`
  );
  process.exit(1);
}

const compact = records.map((r) => [r.site_name, r.year, r.flared_volume_bcm]);

const out = { country, data_source, source_url, records: compact };

fs.mkdirSync(path.dirname(DEST), { recursive: true });
fs.writeFileSync(DEST, JSON.stringify(out));

const srcSize = fs.statSync(SOURCE).size;
const destSize = fs.statSync(DEST).size;
console.log(
  `Wrote ${DEST}\n` +
    `${records.length} records — ${(srcSize / 1024).toFixed(0)}KB source -> ${(destSize / 1024).toFixed(0)}KB public`
);
