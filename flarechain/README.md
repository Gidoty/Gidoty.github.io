# FlareChain

**A working prototype for tamper-evident verification of gas flaring
emissions data, built as a competition submission.**

FlareChain hashes a reported flaring record and anchors that hash on a
public blockchain, so anyone can later re-check the record against the
chain and know instantly whether it's been altered since it was reported.

**Live demo (no setup required):** https://gidoty.github.io/flarechain/site/

> **This is a prototype, not a production system.** It runs entirely on a
> public *test* blockchain (Polygon Amoy), uses one publicly available
> dataset, and has not been deployed, adopted, or reviewed by any real
> operator, regulator, or registry — including the World Bank, whose
> public data it uses, and Nigeria's NUPRC, which is referenced only as a
> future data-integration target. See `docs/methodology.md` for the full,
> honest scope and limitations.

This project lives in its own top-level folder (`/flarechain`) inside this
GitHub Pages repository, separate from the portfolio site at the repo
root, so it can be browsed and run independently.

## Read this first

**[`docs/methodology.md`](docs/methodology.md)** — the problem, the
approach, and an explicit statement of what this prototype does and
doesn't demonstrate. Start there.

## Overview

The pipeline has three parts, each runnable independently:

1. **Data** (`scripts/`, Python) — pulls Nigeria gas flaring volume data
   from the World Bank's Global Flaring and Methane Reduction (GFMR)
   Partnership and cleans it into `data/processed_flaring_data.json`.
2. **Blockchain verification** (`scripts/`, Node.js) — hashes one record
   (SHA-256, over a canonical/order-independent JSON form) and anchors
   that hash on the Polygon Amoy testnet as a plain transaction; a second
   script re-checks any record against that anchor for tamper detection.
3. **Dashboard** (`dashboard/`, Next.js) — shows the anchored record and
   lets you re-verify it against the live chain with one click. Published
   as a static site directly from this repo — no separate hosting account
   needed. Live at: **https://gidoty.github.io/flarechain/site/**

## Quick start

### 1. Get the data

```
cd flarechain
pip install -r requirements.txt
python scripts/fetch_ggfr_data.py                 # attempts an automated pull; prints manual
                                                    # download steps if that doesn't work
python scripts/clean_flaring_data.py --inspect     # check the real column names first
python scripts/clean_flaring_data.py               # writes data/processed_flaring_data.json
```

Full source, method, and limitations (including why "marginal field"
status can't currently be determined from this dataset): `docs/data_sources.md`.

### 2. Anchor and verify a record on-chain

```
npm install
cp .env.example .env
npm run generate-wallet            # prints a throwaway testnet address + private key
# fund that address for free at https://faucet.polygon.technology/ (select "Amoy")
node scripts/anchor_record.js --file data/processed_flaring_data.json --index 0
node scripts/verify_record.js --file data/processed_flaring_data.json --index 0 --tx <TX_HASH_FROM_ABOVE>
```

`anchor_record.js` prints the transaction hash and a PolygonScan (Amoy)
link. `verify_record.js` re-hashes the record and reports MATCH or
MISMATCH against what's actually on-chain — edit any field in the record
and re-run it to see tamper detection in action.

Design rationale (plain transaction vs. a smart contract) and exactly
what has and hasn't been tested end-to-end: `docs/blockchain_verification.md`.

### 3. Run the dashboard

**Already live, no setup required:** https://gidoty.github.io/flarechain/site/

To run it locally instead (e.g. while making changes):

```
cd dashboard
npm install
npm run dev
```

Open http://localhost:3000. Details, including how the static publish
works: `dashboard/README.md`.

## Project structure

```
flarechain/
├── data/                    # raw and processed datasets, + anchors.json (local anchor index)
│   ├── raw/                 # untouched downloads (gitignored)
│   └── processed_flaring_data.json
├── scripts/                 # data processing (Python) and blockchain (Node.js) scripts
│   └── lib/                 # shared hashing + CLI-parsing helpers
├── contracts/                # smart contract code — not used; see docs/blockchain_verification.md
├── dashboard/                # Next.js + Tailwind frontend (source)
├── site/                     # dashboard/, built as a static export — this is what GitHub Pages serves
└── docs/
    ├── methodology.md              # problem, approach, prototype scope — start here
    ├── data_sources.md             # data source, access method, limitations
    ├── blockchain_verification.md  # anchoring design and what's been tested
    └── project_summary.txt         # plain-text summary for grant/competition forms
```

## Data honesty policy

Every number in this project traces back to a named public source and
URL. Nothing here is estimated, interpolated, or invented to fill a gap —
where the underlying data can't answer a question (e.g. "is this specific
site a legally designated marginal field?"), that's documented as a
limitation in `docs/data_sources.md` instead of guessed at. The same
standard applies to this README and every doc in `docs/`: no claim of
deployment, production readiness, or real-world adoption appears anywhere
in this project, because none of that has happened.
