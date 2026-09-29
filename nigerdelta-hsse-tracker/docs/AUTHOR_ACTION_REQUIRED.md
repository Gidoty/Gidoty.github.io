# Author Action Required

Values, wording, and citations below could not be sourced or verified by this
audit and need the author's direct attention before submission. Nothing in
this list has been silently defaulted in the app — each item is either an
explicit user input with no default, or flagged inline where it appears.

## Phase 1 — Emission calculations

- **CH₄ fraction of Niger Delta associated gas (x_CH4).** The app defaults
  the input to 0.90 and labels it "assumed; not measured." Source a
  published Niger Delta (or Nigerian) associated-gas composition figure —
  NNPC/NUPRC data, an SPE paper, or similar — or confirm 0.90 is the best
  available figure and cite it.
- **"X average passenger cars" / "X average Nigerian households"
  comparison.** This was `calculateContext()` in the old `methaneCalc.js`,
  now deleted. It divided CO₂e by an unverified per-person/per-car annual
  emissions figure sourced only as "IEA (2023)" with no report or table
  cited. If you want this comparison back in the app, find and cite the
  specific IEA (or other) table it should use.

## Phase 5 — Legal wording

- **72-hour JIV threshold.** The old `TimelineCard.jsx` displayed "JIV not
  yet scheduled (72h+ elapsed)" as if this were a legal deadline. No
  provision citing a specific 72-hour JIV-scheduling duty was found in the
  NOSDRA Act 2006 or the Oil Spill Regulations 2011 during this audit. If
  such a provision exists, cite the section and the app can reinstate the
  threshold with that citation. Otherwise it stays removed.
- **FOI Act 2011 citations.** `FoiRequestDocumentPanel.jsx` and
  `trackerUtils.js` cite "Section 4" for the 7-day response duty and
  "Section 7" for stating grounds of denial. These were left unchanged per
  instruction, but were not independently re-verified against the Act's
  text during this audit — please confirm both section numbers before
  submission.

## Phase 6 — WHO air-quality panel sources

The following sources in `whoAqgData.js` were carried over from the
pre-existing app content and were not independently verified against the
original paper/report during this audit. Please confirm the DOI, the exact
figure cited, and that it says what the app claims it says:

- Nwosisi et al. 2021, *Scientific African* (PM2.5, SO₂ exceedance figures)
- Zabbey et al. 2021 (PM10 exceedance claim)
- HumAngle Media / Obrikom study, 2024 (NO₂, CO claims)
- Wami-Amadi & Chisom Faith (2025) (exceedance summary text)

## Phase 9 — Archival DOI

JEAS requires an archived version of the software with a DOI (e.g. via
Zenodo). This needs a dedicated GitHub repository (rather than a
subdirectory of a personal portfolio site) connected to Zenodo, which only
the author can create and authorize — an AI assistant cannot do this on
your behalf.
