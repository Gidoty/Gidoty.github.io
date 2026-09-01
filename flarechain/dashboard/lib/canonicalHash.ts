/**
 * Must produce byte-for-byte identical hashes to scripts/lib/canonicalHash.js
 * in the parent project — this is what lets a hash produced by
 * anchor_record.js be reproduced here for verification. Recursively sorts
 * object keys so the hash doesn't depend on field order.
 *
 * Uses the Web Crypto API (crypto.subtle) rather than Node's `crypto`
 * module so the exact same code runs both at build time (Node) and in the
 * visitor's browser for the static export — SHA-256 of the same UTF-8
 * bytes is identical either way.
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

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashRecord(record: unknown): Promise<{ canonical: string; hash: string }> {
  const canonical = canonicalize(record);
  const data = new TextEncoder().encode(canonical);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const hash = "0x" + bufferToHex(digest);
  return { canonical, hash };
}
