# FlareChain

FlareChain is a **prototype** built for a global innovation competition
submission. It is a demo of a blockchain-verified system for reporting gas
flaring data from Nigerian marginal oil fields — **not** a production
system, and not affiliated with the World Bank, Nigeria's NUPRC, or any
oil operator.

This project lives in its own top-level folder (`/flarechain`) inside this
GitHub Pages repository, separate from the portfolio site at the repo root,
so it can be browsed independently.

## Status

Being built in batches. Current status: **Batch 2 — blockchain verification layer.**

- [x] Batch 1: Data acquisition (World Bank GGFR/GFMR flaring data → Nigeria,
      cleaned into structured JSON) — scripts written, not yet run against
      real data (see `docs/data_sources.md`)
- [x] Batch 2: Blockchain verification layer — hash-anchor a record on
      Polygon Amoy testnet, detect tampering by re-verifying (see
      `docs/blockchain_verification.md`). Code is complete and locally
      tested; a **live on-chain run hasn't happened yet** — see that doc
      for exactly why and what's needed to do one.
- [ ] Dashboard (dashboard/)
- [ ] Full methodology write-up (docs/)

## Structure

```
flarechain/
├── data/          # raw and processed datasets, + anchors.json (local anchor index)
│   ├── raw/       # untouched downloads (gitignored — see data/raw/README.md)
│   └── processed_flaring_data.json   # cleaned output (generated, not hand-written)
├── scripts/       # data processing (Python) and blockchain (Node.js) scripts
│   └── lib/       # shared hashing + CLI-parsing helpers for the Node scripts
├── contracts/     # smart contract code (not used — see docs/blockchain_verification.md for why)
├── dashboard/     # frontend (later batch)
├── package.json   # Node deps for the blockchain scripts (npm install)
├── .env.example   # copy to .env — RPC_URL + PRIVATE_KEY, never committed
└── docs/          # methodology, data sources, and limitations
```

## Data honesty policy

Every number in this project traces back to a named public source and URL.
Nothing here is estimated, interpolated, or invented to fill a gap — where
the underlying data can't answer a question (e.g. "is this specific site a
legally designated marginal field?"), that's documented as a limitation in
`docs/data_sources.md` instead of guessed at.

## Getting started (current batch)

```
cd flarechain
pip install -r requirements.txt
python scripts/fetch_ggfr_data.py       # attempts automated fetch, prints
                                         # manual steps if it can't
python scripts/clean_flaring_data.py --inspect   # check column names first
python scripts/clean_flaring_data.py             # produces data/processed_flaring_data.json
```

See `docs/data_sources.md` for the full data source, methodology, and
known limitations (including why "marginal field" status can't currently
be determined from this dataset alone).

## Blockchain verification (current batch)

```
npm install
cp .env.example .env
npm run generate-wallet         # prints a throwaway testnet address + key
# fund the address at https://faucet.polygon.technology/ (select Amoy)
node scripts/anchor_record.js --file data/processed_flaring_data.json --index 0
node scripts/verify_record.js --file data/processed_flaring_data.json --index 0 --tx <TX_HASH_FROM_ABOVE>
```

See `docs/blockchain_verification.md` for the design (plain transaction,
not a smart contract — and why), and for exactly what's been tested so
far versus what still needs a live run with real network access.
