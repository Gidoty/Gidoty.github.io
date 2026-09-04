# FlareChain dashboard

A Next.js + Tailwind CSS dashboard over the full Nigeria flaring dataset
(6,287 real World Bank records), with live on-chain re-verification for
whichever of those records has actually been anchored.

**Prototype, not production.** Runs on the Polygon Amoy *testnet*, not
mainnet, and only one record has been anchored so far — see
`../docs/methodology.md` for the full scope and limitations.

**Live at:** https://gidoty.github.io/flarechain/site/ — published as a
static export directly from this repo via GitHub Pages, no separate
hosting account needed. See `../site/README.md` for how that's kept in
sync with this source.

## What it shows

- **Summary stats** — total records, unique sites, year range, total
  reported flared volume across the whole dataset
- **A year-by-year bar chart** of total flared volume (hover a bar for
  the exact figure)
- **A searchable, filterable browser** over all 6,287 records — search by
  site name, filter by year, click any row to select it
- For the **selected record**: its full detail (site, country, year,
  volume, source), and — only if that specific record has actually been
  anchored on-chain — the anchored hash, timestamp, a PolygonScan link,
  and a **Verify** button that re-hashes it live and checks it against
  the real transaction. Records that haven't been anchored say so
  plainly instead of showing a Verify button that has nothing to check.

## Prerequisites

This dashboard reads (but does not write) two files from the parent
`flarechain/` project:

- `../data/processed_flaring_data.json` — the full dataset, read at
  **build time** by `scripts/build-public-data.js` (an npm `prebuild`
  step) to generate `public/data.json`, which the browser then fetches
  client-side to power the search/browse/chart features
- `../data/anchors.json` — written by `../scripts/anchor_record.js`, read
  at build time by a Server Component to know which record (if any) has
  actually been anchored

**If you haven't run the data-acquisition script yet**, there's nothing
to browse — `npm run build`/`npm run dev` will fail loudly rather than
ship an empty dashboard silently, telling you to run
`python scripts/clean_flaring_data.py` (from `flarechain/`) first.

**If you've got the data but haven't anchored anything yet**, the
dashboard still builds and runs fine — every record shows an honest "not
yet anchored on-chain" state instead of a Verify button with nothing to
check. See `../docs/data_sources.md` and `../docs/blockchain_verification.md`
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
