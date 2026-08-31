# FlareChain dashboard

A small Next.js + Tailwind CSS dashboard that displays one anchored flaring
record and lets you re-verify it against Polygon Amoy live, on demand.

**Prototype, not production.** Runs on the Polygon Amoy *testnet*, not
mainnet, and shows exactly one demo record — see `../docs/methodology.md`
for the full scope and limitations.

## What it shows

- The reported flaring record (site, country, year, volume, source)
- The hash that was anchored on-chain and when it was anchored
- A link to the transaction on PolygonScan (Amoy testnet explorer)
- A **Verify** button that re-hashes the record right now and checks it
  against the live on-chain transaction — reporting a clear
  verified/mismatch result, distinct from "couldn't reach the network"

## Prerequisites

This dashboard reads (but does not write) two files from the parent
`flarechain/` project:

- `../data/anchors.json` — written by `../scripts/anchor_record.js`
- (indirectly, via the anchor entry) the record that was anchored

**If you haven't run the data-acquisition and anchoring steps yet**, the
dashboard still runs — it just shows an honest "No anchored record yet"
empty state with the exact command to run, instead of fake data. See
`../docs/data_sources.md` and `../docs/blockchain_verification.md` for
those steps.

## Setup

```
cd flarechain/dashboard
npm install
cp .env.example .env.local
```

Edit `.env.local` and set `RPC_URL` (a Polygon Amoy RPC endpoint — the
public default in `.env.example` works but can be rate-limited; an
Alchemy/Infura Amoy endpoint is more reliable). No private key is needed
here — the dashboard only reads transactions to verify them, it never
sends any.

## Run it

```
npm run dev
```

Open http://localhost:3000. To build for production:

```
npm run build
npm start
```

## Design notes

- App Router (Next.js 16), Tailwind CSS 3, TypeScript, no UI/icon library
  — deliberately minimal dependencies for a demo that needs to build
  reliably.
- The hashing logic in `lib/canonicalHash.ts` is a direct TypeScript port
  of `../scripts/lib/canonicalHash.js`, so a hash computed here always
  matches one computed by the CLI anchoring script for the same record.
- `app/api/verify/route.ts` is the only place that talks to the
  blockchain (via `ethers`, read-only). It's a plain Next.js Route
  Handler, not a Server Action, so it's easy to test directly with
  `curl -X POST http://localhost:3000/api/verify`.
