import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { getLatestAnchor } from "@/lib/getAnchoredRecord";
import { hashRecord } from "@/lib/canonicalHash";

export const dynamic = "force-dynamic";

/**
 * Live tamper check: re-hashes the anchored record right now and compares
 * it against what's actually stored on-chain for its anchoring
 * transaction. Read-only — no private key is ever used here, since
 * verifying never needs to send a transaction.
 *
 * Deliberately distinguishes "verification ran and found a mismatch"
 * (status: mismatch) from "verification couldn't run at all" (config_error
 * / network_error / not_found) — conflating those would let a network
 * hiccup masquerade as a tamper finding, or vice versa.
 */
export async function POST() {
  const anchor = getLatestAnchor();
  if (!anchor) {
    return NextResponse.json(
      {
        status: "no_anchor",
        message: "No anchored record found (data/anchors.json is missing or empty). Run scripts/anchor_record.js first.",
      },
      { status: 404 }
    );
  }

  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    return NextResponse.json(
      {
        status: "config_error",
        message: "RPC_URL is not set. Copy .env.example to .env.local and fill it in.",
      },
      { status: 500 }
    );
  }

  const { hash: computedHash } = hashRecord(anchor.record);

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  let tx;
  try {
    tx = await provider.getTransaction(anchor.txHash);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { status: "network_error", message: `Could not reach the blockchain network: ${message}` },
      { status: 502 }
    );
  }

  if (!tx) {
    return NextResponse.json(
      { status: "not_found", message: `Transaction ${anchor.txHash} was not found on-chain.` },
      { status: 404 }
    );
  }

  const onChainHash = tx.data;
  const match = onChainHash.toLowerCase() === computedHash.toLowerCase();

  let blockTimestampIso: string | null = null;
  if (tx.blockNumber != null) {
    try {
      const block = await provider.getBlock(tx.blockNumber);
      if (block) blockTimestampIso = new Date(block.timestamp * 1000).toISOString();
    } catch {
      // Non-fatal: the match verdict doesn't depend on the timestamp.
    }
  }

  return NextResponse.json({
    status: match ? "verified" : "mismatch",
    match,
    computedHash,
    onChainHash,
    txHash: anchor.txHash,
    blockTimestampIso,
    explorerUrl: anchor.explorerUrl,
  });
}
