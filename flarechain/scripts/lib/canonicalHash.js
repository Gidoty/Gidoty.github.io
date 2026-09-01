"use strict";

/**
 * Deterministic JSON serialization: recursively sorts object keys so the
 * same record always hashes the same way regardless of key insertion
 * order (JSON.stringify alone does NOT guarantee this — it preserves
 * insertion order, which differs depending on how the object was built).
 * This matters because a record loaded from a file and a record typed by
 * hand on the CLI could otherwise produce different, non-matching hashes
 * for identical data.
 */
function canonicalize(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(canonicalize).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map((k) => JSON.stringify(k) + ":" + canonicalize(value[k]));
  return "{" + parts.join(",") + "}";
}

const crypto = require("crypto");

/**
 * Hash a flaring-data record with SHA-256 over its canonical JSON form.
 * Returns both the canonical string (useful for debugging mismatches) and
 * the resulting 32-byte hash as a 0x-prefixed hex string, since that's
 * exactly what fits in an Ethereum-style tx `data` field.
 */
function hashRecord(record) {
  const canonical = canonicalize(record);
  const hash = "0x" + crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
  return { canonical, hash };
}

module.exports = { canonicalize, hashRecord };
