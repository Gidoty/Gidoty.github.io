import crypto from "crypto";

/**
 * Must stay byte-for-byte identical to scripts/lib/canonicalHash.js in the
 * parent project — this is what lets a hash produced by anchor_record.js
 * be reproduced here for verification. Recursively sorts object keys so
 * the hash doesn't depend on field order.
 */
export function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(canonicalize).join(",") + "]";
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  const parts = keys.map((k) => JSON.stringify(k) + ":" + canonicalize(obj[k]));
  return "{" + parts.join(",") + "}";
}

export function hashRecord(record: unknown): { canonical: string; hash: string } {
  const canonical = canonicalize(record);
  const hash = "0x" + crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
  return { canonical, hash };
}
