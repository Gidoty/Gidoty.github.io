export type FlaringRecord = {
  site_name: string;
  country: string;
  year: number;
  flared_volume_bcm: number;
  data_source: string;
  source_url: string;
};

export type AnchorEntry = {
  record_site_name: string;
  record_year: number;
  hash: string;
  txHash: string;
  blockNumber: number;
  blockTimestamp: number;
  blockTimestampIso: string;
  explorerUrl: string;
  anchoredAt: string;
  canonical: string;
  record: FlaringRecord;
};

type VerifyMatchResult = {
  match: boolean;
  computedHash: string;
  onChainHash: string;
  txHash: string;
  blockTimestampIso: string | null;
  explorerUrl: string;
};

// Each variant carries a single literal `status` (rather than e.g.
// `"verified" | "mismatch"` on one variant) so TypeScript can reliably
// narrow the union via `result.status === "verified"` checks.
export type VerifyResult =
  | ({ status: "verified" } & VerifyMatchResult)
  | ({ status: "mismatch" } & VerifyMatchResult)
  | { status: "no_anchor"; message: string }
  | { status: "config_error"; message: string }
  | { status: "network_error"; message: string }
  | { status: "not_found"; message: string };
