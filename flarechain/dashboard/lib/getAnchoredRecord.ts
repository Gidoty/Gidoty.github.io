import fs from "fs";
import path from "path";
import type { AnchorEntry } from "./types";

// The dashboard is a sub-project of flarechain/ — the anchor ledger written
// by scripts/anchor_record.js lives one level up, at flarechain/data/anchors.json.
const ANCHORS_PATH = path.join(process.cwd(), "..", "data", "anchors.json");

/**
 * Returns the most recently anchored record, or null if
 * scripts/anchor_record.js hasn't been run yet. The dashboard shows an
 * honest empty state in that case rather than placeholder data.
 */
export function getLatestAnchor(): AnchorEntry | null {
  if (!fs.existsSync(ANCHORS_PATH)) return null;
  try {
    const raw = fs.readFileSync(ANCHORS_PATH, "utf8");
    const ledger: AnchorEntry[] = JSON.parse(raw);
    if (!Array.isArray(ledger) || ledger.length === 0) return null;
    return ledger[ledger.length - 1];
  } catch {
    return null;
  }
}
