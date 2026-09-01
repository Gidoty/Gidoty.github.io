# FlareChain dashboard

A small Next.js + Tailwind CSS dashboard that displays one anchored flaring
record and lets you re-verify it against Polygon Amoy live, on demand.

**Prototype, not production.** Runs on the Polygon Amoy *testnet*, not
mainnet, and shows exactly one demo record — see `../docs/methodology.md`
for the full scope and limitations.

**Live at:** https://gidoty.github.io/flarechain/site/ — published as a
static export directly from this repo via GitHub Pages, no separate
hosting account needed. See `../site/README.md` for how that's kept in
sync with this source.

## What it shows

- The reported flaring record (site, country, year, volume, source)
- The hash that was anchored on-chain and when it was anchored
- A link to the transaction on PolygonScan (Amoy testnet explorer)
- A **Verify** button that re-hashes the record right now and checks it
  against the live on-chain transaction — reporting a clear
  verified/mismatch result, distinct from "couldn't reach the network"

## Prerequisites

This dashboard reads (but does not write) two files from the parent
`flarechain/` project **at build time**:

- `../data/anchors.json` — written by `../scripts/anchor_record.js`
- (indirectly, via the anchor entry) the record that was anchored

**If you haven't run the data-acquisition and anchoring steps yet**, the
dashboard still builds and runs — it just shows an honest "No anchored
record yet" empty state with the exact command to run, instead of fake
data. See `../docs/data_sources.md` and `../docs/blockchain_verification.md`
for those steps.

## Setup

```
cd flarechain/dashboard
npm install
```

No `.env` file is needed to develop or build this dashboard. It's a fully
static site — see "Architecture" below for why.

## Run it locally

```
npm run dev
```

Open http://localhost:3000.

## Build (what actually gets published)

```
npm run build
```

This produces a static `out/` folder — no server involved. Publishing it
means copying that folder's contents into `../site/` and committing them;
see `../site/README.md` for the exact commands.

## Architecture: fully static, no server

This dashboard is published as plain files via GitHub Pages, which can
only serve static content — it cannot run server-side code. So unlike a
typical Next.js app, there is **no API route and no server-only
environment variable**:

- `next.config.mjs` sets `output: "export"` (produces static HTML/JS/CSS)
  and `basePath: "/flarechain/site"` (where it's actually served from).
- The **Verify** button's blockchain check runs entirely in the visitor's
  browser (`components/VerifyPanel.tsx`), using `ethers.js` client-side
  against a public Polygon Amoy RPC endpoint — a plain constant in that
  file, not a secret (a read-only RPC URL isn't sensitive; no private key
  is ever used in this dashboard).
- `lib/canonicalHash.ts` uses the Web Crypto API (`crypto.subtle`) instead
  of Node's `crypto` module specifically so the identical code runs both
  at build time (Server Component, reading `../data/anchors.json`) and in
  the browser (the Verify button) — producing byte-identical SHA-256
  hashes to `../scripts/lib/canonicalHash.js` either way.
