# Manuscript Changes Required

This lists what the JEAS manuscript must say differently because of fixes
made to the app. It does not rewrite the manuscript — that is the author's
work.

## Scope (decided before this audit)

- The paper must present this as an engineering verification study using
  **synthetic test records only**. Drop the ">50 users" and ">10 incidents"
  figures, the informal user feedback, hypothesis H1 (structured vs.
  free-text comparison), and the usability evaluation section — none of that
  work exists in the app or was ever collected under a research protocol.
- The paper must state: **"Ethics approval and consent to participate: Not
  applicable (no human participants or human data; synthetic test records
  only)."**

## Architecture (decided before this audit)

- The app is device-local with no server, database, analytics, or network
  transmission of report data. The paper must not claim sync, aggregate
  incident counts across users, or cross-user/cross-device corroboration —
  none of that is possible in this architecture, and Phase 4 below removes
  the one feature that implied it.

## Phase 1 — Emission calculations

- The manuscript's methane-emission methodology section must be rewritten
  to describe the **mass-balance method**
  (`m_CH4_slip = V_g × x_CH4 × ρ_CH4(T_ref,P_ref) × (1 − η_f)`), not "IPCC
  2006 Tier 1." The app no longer implements a Tier 1 volumetric emission
  factor.
- Any worked example in the manuscript using the old factor (e.g. "48,000 m³
  → 96 t CH₄") must be replaced with a mass-balance example. On 48,000 m³ at
  x_CH4 = 0.90, η_f = 0.98, 15°C/101.325 kPa reference conditions, the app
  now computes approximately 0.586 t CH₄ slip — recompute and cite whatever
  worked example you use directly from the running app or its test vectors
  (`validation/test_vectors.json`), not by hand.
- Report GWP₂₀ = 82.5 (not 84) if the manuscript states a value — this was
  an AR5/AR6 mixing error in the app, now corrected to AR6 throughout.
- Any manuscript figure or table that used the deleted `estimateFlaredVolume`
  heuristic (base flow rate × stack multiplier × duration) must be removed
  or replaced — flared volume is now a required, sourced user input, not a
  derived estimate.
- Drop any manuscript claim describing a "cars"/"households" CO₂e context
  comparison feature — it has been removed pending a sourced comparison
  figure (see `AUTHOR_ACTION_REQUIRED.md`).

## Phase 2 — Carbon-credit features removed

- The manuscript must not describe carbon-credit estimation, Gold Standard,
  Verra/VCS, or Article 6.4 baseline-data export as implemented features.
  Both panels (`carbon-credit-potential`, `carbon-credit-data-package`) have
  been removed from the live app — community observation of a third-party
  flare cannot form a credit baseline, and the feature is out of scope for
  a device-local, no-corroboration tool. The panel source is preserved on
  the `archive/carbon-credit` branch if you want to describe it as future
  work rather than a delivered feature.
- Feature-count claims must drop from 27 to 25 tools across 7 categories,
  and the Home page's feature grid from 11 to 10 items.

## Phase 3 — Integrity hashing reworked

- The manuscript must not claim the app's SHA-256 fingerprint "meets
  Nigerian Evidence Act 2011 Sections 84–87 requirements for admissibility."
  This claim has been removed from every UI surface. The correct framing,
  used everywhere in the app now: it is a **tamper-evident fingerprint**
  that detects later changes to a saved record; it does not establish
  truth, authorship, or legal admissibility. Describe it this way in the
  manuscript too.
- The hashing method changed: the app now hashes a canonically-serialised
  (sorted keys, fixed formatting) **immutable evidence payload** —
  incident fields, location, timestamps, description, per-photo SHA-256
  hashes, health fields, language, consent version, and app version —
  explicitly excluding the reporter's contact details, browser user agent,
  and the regulatory/corroboration fields (which change after submission).
  Regulatory and corroboration mutations (NOSDRA notification, cleanup
  status changes) are now recorded in a separate, append-only,
  hash-chained events log per report, independently verifiable without
  touching the original evidence hash. If the manuscript describes the
  hashing method, it must describe this scheme, not a single whole-object
  `JSON.stringify` hash.
- Reports saved before this change are tagged
  `integrity.canonicalization: "legacy-v0-noncanonical"` and are not
  re-verifiable — if the manuscript discusses any pre-existing test data,
  say so.
- A "Verify Integrity" action now exists in the report detail view,
  independently re-deriving the payload hash and event-chain hashes. An
  independent Python re-implementation (`validation/verify_export.py`,
  Phase 8) exists for verifying exported records outside the app.

## Phase 4 — Corroboration replaced with an evidence-status enum

- The manuscript must not describe "community corroboration" as multiple
  independent community members confirming the same incident. With no
  server, a second confirmation can only come from the same browser as the
  original report, so it cannot demonstrate independent agreement. The
  self-corroboration feature (and its UI, `CorroborationModal.jsx`) has
  been **removed entirely** — not reworked, removed.
- In its place: every report starts at evidence status **Community
  Observed**. It can be raised to **Externally Referenced** only by linking
  a specific external record (a NOSDRA Oil Spill Monitor incident ID, or a
  Gas Flare Tracker site) with a URL and access date, or to **Independently
  Verified** only by citing a specific verification source (e.g. a JIV
  report reference). The app never sets either upgraded level
  automatically. This is shown on every report — map popups, cards, the
  submitted-reports list, CSV exports, and generated NOSDRA letters.
- Drop hypothesis H1 (structured vs. free-text corroboration comparison) —
  already noted under Scope above, restated here because it is this
  feature specifically that made H1 impossible to test as originally
  conceived.
- The map's "Live Heatmap" is relabelled "Reporting Hotspot Map" with an
  on-map note that density reflects where people reported, not measured
  pollution levels. If the manuscript describes the heatmap as measuring
  pollution intensity, correct that.

## Phase 5 — Legal and timer wording

- The operator-response timer is labelled "Time since you recorded
  notifying NOSDRA" everywhere it appears, not "time since the spill" — it
  measures the reporter's own notification action, which NOSDRA Act 2006
  s.6(2) does not directly govern (the Act's 24-hour duty runs from spill
  occurrence and falls on the operator, not the reporter). A separate,
  optional "estimated time the spill occurred" field was added to the
  NOSDRA notification flow so the two timestamps are never conflated.
- The unsourced "JIV not yet scheduled (72h+ elapsed)" warning has been
  removed pending a citable provision (see `AUTHOR_ACTION_REQUIRED.md`).
- An unverified "₦500,000 daily fine" figure was also removed from the
  notification-timer warning text pending a citable provision — do not use
  that figure in the manuscript unless it is independently sourced.
- Every generated NOSDRA notification letter and FOI request now ends with
  "Prepared by the reporter using NigerDelta HSSE Tracker. This is not an
  official NOSDRA document." If the manuscript implies these documents are
  authoritative NOSDRA correspondence, correct that.

## Phase 6 — WHO air-quality panel

- Added ozone (O₃) to the WHO AQG reference panel, completing all six WHO
  2021 AQG criteria pollutants (PM2.5, PM10, O₃, NO₂, SO₂, CO). If the
  manuscript lists only five pollutants, add ozone.
- Moved benzene out of the WHO AQG panel into a separate "Other
  Petroleum-Related Substances" section, since the UNEP Ogoniland figure
  cited is a **drinking-water** concentration, not an air concentration —
  it was previously presented alongside air-quality guideline values,
  which conflates the two. If the manuscript describes benzene as part of
  the app's WHO AQG comparison, correct that.
- Added the disclaimer "This app does not measure pollutant concentrations.
  Reported symptoms are not diagnoses or exposure measurements" to the
  panel. The four Niger Delta context sources remain unverified pending
  DOI checks — see `AUTHOR_ACTION_REQUIRED.md`.

*(Further entries will be added as Phases 7–8 are completed.)*
