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

*(Further entries will be added as Phases 3–8 are completed.)*
