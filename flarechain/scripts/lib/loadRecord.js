"use strict";

const fs = require("fs");
const path = require("path");

/**
 * Parse the shared --record / --file / --index CLI flags and return a
 * single flaring-data record object. Supports three ways of pointing at
 * a record so both anchor_record.js and verify_record.js can share it:
 *
 *   --record '{"site_name": ..., ...}'   inline JSON, one object
 *   --file some.json                     a file containing a single record object
 *   --file some.json --index 3           a file containing an array of records
 */
function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        args[key] = next;
        i++;
      } else {
        args[key] = true;
      }
    }
  }
  return args;
}

function loadRecord(args) {
  if (args.record) {
    try {
      return JSON.parse(args.record);
    } catch (err) {
      throw new Error(`--record is not valid JSON: ${err.message}`);
    }
  }

  if (args.file) {
    const filePath = path.resolve(args.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(
        `File not found: ${filePath}\n` +
          "If this is data/processed_flaring_data.json, it hasn't been generated yet — " +
          "run the Python data-acquisition scripts first (see docs/data_sources.md)."
      );
    }
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (Array.isArray(parsed)) {
      if (args.index === undefined) {
        throw new Error(
          `${filePath} contains an array of ${parsed.length} records — pass --index N to pick one.`
        );
      }
      const idx = Number(args.index);
      if (!Number.isInteger(idx) || idx < 0 || idx >= parsed.length) {
        throw new Error(`--index ${args.index} is out of range (file has ${parsed.length} records).`);
      }
      return parsed[idx];
    }

    return parsed;
  }

  throw new Error("Provide a record with --record '<json>' or --file <path> [--index N].");
}

module.exports = { parseArgs, loadRecord };
