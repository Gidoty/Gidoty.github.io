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

Being built in batches. Current status: **Batch 1 — data acquisition only.**

- [x] Batch 1: Data acquisition (World Bank GGFR/GFMR flaring data → Nigeria,
      cleaned into structured JSON)
- [ ] Blockchain verification layer (contracts/)
- [ ] Dashboard (dashboard/)
- [ ] Full methodology write-up (docs/)

## Structure

```
flarechain/
├── data/          # raw and processed datasets
│   ├── raw/       # untouched downloads (gitignored — see data/raw/README.md)
│   └── processed_flaring_data.json   # cleaned output (generated, not hand-written)
├── scripts/       # data processing and (later) blockchain scripts
├── contracts/     # smart contract code (later batch)
├── dashboard/     # frontend (later batch)
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
