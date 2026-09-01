#!/usr/bin/env node
"use strict";

/**
 * Tamper-detection check: re-hashes a flaring-data record and compares it
 * against what's actually stored in a Polygon Amoy transaction's data
 * field. This is the whole point of anchoring — proving whether a record
 * you have NOW matches what was anchored THEN, byte for byte.
 *
 * Usage:
 *   node scripts/verify_record.js --record '{"site_name": ..., ...}' --tx 0xabc...
 *   node scripts/verify_record.js --file data/processed_flaring_data.json --index 0 --tx 0xabc...
 *
 * --tx can be omitted if the record's hash is found in the local
 * data/anchors.json ledger (written by anchor_record.js) — but that
 * lookup is only a convenience for finding which tx to check. The actual
 * verification always re-fetches the transaction from the chain itself
 * and compares against a hash computed fresh from the record you pass in
 * now, never against the local ledger's stored copy.
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const { hashRecord } = require("./lib/canonicalHash");
const { parseArgs, loadRecord } = require("./lib/loadRecord");

const ANCHORS_LEDGER_PATH = path.resolve(__dirname, "..", "data", "anchors.json");

function explorerTxUrl(txHash) {
  return `https://amoy.polygonscan.com/tx/${txHash}`;
}

function findTxHashInLocalLedger(hash) {
  if (!fs.existsSync(ANCHORS_LEDGER_PATH)) return null;
  try {
    const ledger = JSON.parse(fs.readFileSync(ANCHORS_LEDGER_PATH, "utf8"));
    const match = [...ledger].reverse().find((e) => e.hash === hash);
    return match ? match.txHash : null;
  } catch {
    return null;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const record = loadRecord(args);
  const { canonical, hash: computedHash } = hashRecord(record);

  console.log("Record being checked:");
  console.log(JSON.stringify(record, null, 2));
  console.log(`\nCanonical form:        ${canonical}`);
  console.log(`Freshly computed hash: ${computedHash}`);

  let txHash = typeof args.tx === "string" ? args.tx : null;
  if (!txHash) {
    txHash = findTxHashInLocalLedger(computedHash);
    if (txHash) {
      console.log(
        `\nNo --tx given; found a matching hash in the local ledger -> using tx ${txHash}`
      );
    }
  }
  if (!txHash) {
    console.error(
      "\nNo --tx provided and no matching entry in data/anchors.json. " +
        "Pass the transaction hash to check with --tx 0x..."
    );
    process.exit(1);
  }

  const rpcUrl = process.env.RPC_URL;
  if (!rpcUrl) {
    console.error("\nMissing RPC_URL. Copy .env.example to .env and fill it in.");
    process.exit(1);
  }
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  console.log(`\nFetching transaction ${txHash} from Polygon Amoy...`);
  const tx = await provider.getTransaction(txHash);
  if (!tx) {
    console.error("Transaction not found on-chain (wrong hash, wrong network, or not yet confirmed).");
    process.exit(1);
  }

  const onChainHash = tx.data; // 0x-prefixed hex, exactly what anchor_record.js sent
  const receipt = await provider.getTransactionReceipt(txHash);
  const block = await provider.getBlock(receipt.blockNumber);

  console.log(`On-chain data field:   ${onChainHash}`);
  console.log(`Anchored at block:     ${receipt.blockNumber} (${new Date(block.timestamp * 1000).toISOString()})`);
  console.log(`PolygonScan:           ${explorerTxUrl(txHash)}`);

  const isMatch = onChainHash.toLowerCase() === computedHash.toLowerCase();

  console.log("\n" + "=".repeat(60));
  if (isMatch) {
    console.log("RESULT: MATCH — this record is identical to what was anchored.");
    console.log("The data has not been tampered with since anchoring.");
  } else {
    console.log("RESULT: MISMATCH — this record does NOT match the anchored hash.");
    console.log("Either the record has been altered since anchoring, or this is");
    console.log("the wrong transaction/record pair. Do not trust this record.");
  }
  console.log("=".repeat(60));

  process.exit(isMatch ? 0 : 1);
}

main().catch((err) => {
  console.error("\nVerification failed to run:", err.message || err);
  process.exit(1);
});
