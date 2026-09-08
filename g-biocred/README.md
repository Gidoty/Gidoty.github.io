# G-BioCred

**Agro-Waste-to-Energy Yield and Carbon Verification Calculator**

The first free, browser-based tool combining validated biogas yield modeling for Nigerian and
West African agricultural waste streams with IPCC-compliant emissions-avoided estimation and
voluntary carbon credit valuation — all in a single, auditable, exportable tool.

## Live Application

https://gidoty.github.io/g-biocred

## Built by

Gideon Owhonda
PhD Candidate · NLNG Centre for Gas, Refining and Petrochemical Engineering
University of Port Harcourt
MSc: Production and Analysis of Biogas from Cow Dung, UNIPORT 2024
gideon.owhonda@cgrpng.org

## Features

- 9-substrate biogas yield calculator (5-step anaerobic digestion chain)
- Digester sizing calculator (fixed dome, floating drum, tubular bag)
- IPCC Tier 1 emissions-avoided estimator (5 baseline disposal scenarios)
- GWP registry alignment selector (AR6 Biogenic, AR6 Fossil, AR5 Legacy)
- Gold Standard / CDM AMS-III / Article 6.4 carbon credit value projector
- Digestate NPK and fertiliser replacement value estimator
- 3-scenario feasibility comparison mode
- SHA-256 tamper-evident verification audit trail
- Exportable PDF and CSV feasibility report

## Scientific Foundation

- IPCC 2006 Guidelines Vol.4 Ch.10 (Manure Management), Vol.5 Ch.3 (Waste Disposal)
- IPCC AR6 WGI (2021) Table 7.SM.7 (GWP values)
- Gold Standard AWMS v2.0
- CDM AMS-III.D / AMS-III.R
- Paris Agreement Article 6.4 (PACM)
- Peer-reviewed Nigerian substrate yield data (Aisien & Aisien; Adelekan & Bamgboye; Owhonda, 2024
  MSc thesis)
- Nigerian Evidence Act 2011 ss.84–87 (audit trail legal basis)

## Structure

```
app/           editable Vite + React source
assets/        built output (committed, served directly by GitHub Pages)
index.html     built entry point
```

This project lives as a subdirectory of the `gidoty.github.io` user site, which serves whatever
is on its default branch with no build step of its own. `app/` is the editable source; running
`npm run build` inside `app/` compiles straight into this directory (the parent of `app/`), and
that compiled output is what ships. There is no separate deploy step — merging to the site's
default branch is the deployment.

Built with React 18, Vite, Tailwind CSS v4, and React Router v6.

## Disclaimer

G-BioCred produces planning-level estimates only. It does not replace formal third-party
verification by an accredited body (Gold Standard, Verra VCS, CDM) before carbon credits can be
issued or traded. All calculations are traceable to a published source — see `/about` and the
in-app audit trail at `/audit`.

MIT Licence · © 2026 Gideon Owhonda
