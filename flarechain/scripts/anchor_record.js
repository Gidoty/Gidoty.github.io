#!/usr/bin/env node
"use strict";

/**
 * Anchors one flaring-data record on the Polygon Amoy testnet.
 *
 * APPROACH: plain transaction, not a smart contract.
 *
 * The record is hashed (SHA-256 over its canonical JSON form — see
 * lib/canonicalHash.js), and that 32-byte hash is sent as the raw `data`
 * field of a zero-value transaction from the wallet to itself. The
 * blockchain's own consensus timestamp on the block that includes this
 * transaction IS the anchor timestamp — nothing else is needed to prove
 * "this exact hash existed at this exact time."
 *
 * Why not a smart contract (e.g. a hash => timestamp mapping)?
 *   - A contract needs its own deployment step, ABI, and Solidity/Hardhat
 *     toolchain — more that can break in a sandboxed/offline demo
 *     environment, and more surface area to audit for a competition demo
 *     that's judged on the concept, not contract engineering.
 *   - A plain tx gets you the identical guarantee for this use case:
 *     immutable, timestamped, publicly verifiable data anchored on-chain.
 *     PolygonScan already renders the tx's input data and block timestamp
 *     for free — you don't need a contract's view function to "look up"
 *     anything a block explorer doesn't already show you.
 *   - The trade-off: a contract could enforce structure (e.g. reject a
 *     duplicate hash, emit a queryable event, support batch anchoring)
 *     and would be the better choice if this grows past a demo. That's
 *     future work, not needed to prove the concept here.
 *
 * Usage:
 *   node scripts/anchor_record.js --record '{"site_name": "...", ...}'
 *   node scripts/anchor_record.js --file data/processed_flaring_data.json --index 0
 */

require("dotenv").config();
const path = require("path");
const fs = require("fs");
const { ethers } = require("ethers");
const { hashRecord } = require("./lib/canonicalHash");
const { parseArgs, loadRecord } = require("./lib/loadRecord");

const ANCHORS_LEDGER_PATH = path.resolve(__dirname, "..", "data", "anchors.json");

function explorerTxUrl(txHash) {
  return `https://amoy.polygonscan.com/tx/${txHash}`;
}

function appendToLocalLedger(entry) {
  let ledger = [];
  if (fs.existsSync(ANCHORS_LEDGER_PATH)) {
    try {
      ledger = JSON.parse(fs.readFileSync(ANCHORS_LEDGER_PATH, "utf8"));
    } catch {
      ledger = [];
    }
  }
  ledger.push(entry);
  fs.writeFileSync(ANCHORS_LEDGER_PATH, JSON.stringify(ledger, null, 2));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const record = loadRecord(args);
  const { canonical, hash } = hashRecord(record);

  console.log("Record to anchor:");
  console.log(JSON.stringify(record, null, 2));
  console.log(`\nCanonical form:  ${canonical}`);
  console.log(`SHA-256 hash:    ${hash}`);

  const rpcUrl = process.env.RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;
  if (!rpcUrl || !privateKey) {
    console.error(
      "\nMissing RPC_URL or PRIVATE_KEY. Copy .env.example to .env and fill both in.\n" +
        "No wallet? Run: npm run generate-wallet"
    );
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`\nWallet address:  ${wallet.address}`);

  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance:         ${ethers.formatEther(balance)} POL (testnet)`);
  if (balance === 0n) {
    console.error(
      "\nWallet has zero balance — the transaction will fail. Fund this " +
        "address with free Amoy test POL first: https://faucet.polygon.technology/ " +
        "(select 'Amoy')."
    );
    process.exit(1);
  }

  console.log("\nSending anchoring transaction (0 value, hash in data field)...");
  const tx = await wallet.sendTransaction({
    to: wallet.address,
    value: 0n,
    data: hash,
  });
  console.log(`Submitted. Tx hash: ${tx.hash}`);
  console.log("Waiting for confirmation...");

  const receipt = await tx.wait();
  const block = await provider.getBlock(receipt.blockNumber);

  const result = {
    record_site_name: record.site_name,
    record_year: record.year,
    hash,
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    blockTimestamp: block.timestamp,
    blockTimestampIso: new Date(block.timestamp * 1000).toISOString(),
    explorerUrl: explorerTxUrl(receipt.hash),
    anchoredAt: new Date().toISOString(),
  };

  console.log("\nAnchored on-chain:");
  console.log(JSON.stringify(result, null, 2));
  console.log(`\nView on PolygonScan (Amoy): ${result.explorerUrl}`);

  appendToLocalLedger({ ...result, canonical, record });
  console.log(`\nAlso recorded locally in ${path.relative(process.cwd(), ANCHORS_LEDGER_PATH)}`);
  console.log(
    "(This local ledger is just a convenience index for the demo — it is " +
      "NOT the source of truth. verify_record.js re-derives everything by " +
      "re-hashing the record and reading the transaction directly from-chain.)"
  );
}

main().catch((err) => {
  console.error("\nAnchoring failed:", err.message || err);
  process.exit(1);
});
