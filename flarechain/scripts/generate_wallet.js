#!/usr/bin/env node
"use strict";

/**
 * Generates a fresh throwaway wallet for testnet use. Pure local
 * cryptography — no network call, so this works even without RPC access.
 *
 * This is NOT meant to hold anything of value. It exists so you don't
 * have to install MetaMask just to get a keypair for a demo: generate
 * one, fund it with free Amoy test POL from a faucet, paste the private
 * key into .env, done.
 */

const { ethers } = require("ethers");

const wallet = ethers.Wallet.createRandom();

console.log("Generated a new throwaway testnet wallet.\n");
console.log(`Address:     ${wallet.address}`);
console.log(`Private key: ${wallet.privateKey}`);
console.log(`Mnemonic:    ${wallet.mnemonic.phrase}`);
console.log(
  "\nNext steps:\n" +
    "1. Copy the private key above into .env as PRIVATE_KEY=...\n" +
    "2. Fund this address with free Amoy test POL from a faucet, e.g.\n" +
    "   https://faucet.polygon.technology/ (select 'Amoy') or\n" +
    "   https://www.alchemy.com/faucets/polygon-amoy\n" +
    "3. Never send real funds to this address, and never reuse this key\n" +
    "   for anything beyond this demo — it was printed to a terminal in\n" +
    "   plaintext, which is fine for throwaway testnet funds only.\n"
);
