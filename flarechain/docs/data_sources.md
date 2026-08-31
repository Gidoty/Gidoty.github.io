# Data sources and limitations

## Primary source

**World Bank Global Flaring and Methane Reduction (GFMR) Partnership —
Global Gas Flaring Database**
https://www.worldbank.org/en/programs/gasflaringreduction/global-flaring-data

GFMR is the current name of what was the Global Gas Flaring Reduction
(GGFR) Partnership. The flaring volume estimates are produced jointly by
the World Bank, NOAA, and the Colorado School of Mines Payne Institute,
using satellite (VIIRS Nightfire) infrared detection of flares, calibrated
against known flare temperatures — not metered/reported volumes from
operators. That's worth remembering: these are **remote-sensing
estimates**, not audited production records.

Two files are published under this program:
- Country-year aggregate flare volumes (bcm)
- Per-flare-site volumes with latitude/longitude, country, and per-year
  values ("Flare Volume Estimates by Individual Flare Location")

Catalog entry: https://datacatalog.worldbank.org/search/dataset/0037743/global-gas-flaring-database

## How to get the data

### Option A — automated (best-effort)

`scripts/fetch_ggfr_data.py` calls the World Bank Data Catalog API
(`https://datacatalogapi.worldbank.org/ddhxext`) to try to resolve and
download the flaring-volume resource(s) automatically.

**This has not been verified end-to-end.** The script was written in a
sandboxed environment where outbound access to every `worldbank.org`
domain (including `datacatalogapi.worldbank.org`) was blocked by the
sandbox's network policy, so the API calls could not actually be executed
or checked against a real response while writing this. The endpoint paths
and parameters come from the API's own help-desk documentation
(https://datahelpdesk.worldbank.org/knowledgebase/articles/1886698-data-catalog-api)
and a third-party reference
(https://gist.github.com/tgherzog/e6090f9b2ba74f49f75b228f5c7169b9), not
from a working call I ran myself. Run the script on your own machine and
read its output — if it fails or the downloaded file doesn't open as a
valid spreadsheet, use Option B.

### Option B — manual (reliable fallback)

1. Go to https://www.worldbank.org/en/programs/gasflaringreduction/global-flaring-data
2. Download the **"Flare Volume Estimates by Individual Flare Location"**
   spreadsheet (site-level; this is the one the cleaning script expects).
   Optionally also grab the country-level file as a sanity check.
3. Save it into `data/raw/flare_volume_by_location.xlsx` (exact filename
   the cleaning script looks for by default; see `data/raw/README.md`).
4. Run `python scripts/clean_flaring_data.py --inspect` to confirm the
   real column headers, then `python scripts/clean_flaring_data.py` to
   produce `data/processed_flaring_data.json`.

## Limitation: "marginal fields" cannot be identified from this dataset

This project is specifically about **Nigerian marginal oil fields** — a
legal/licensing designation under Nigerian petroleum regulation (currently
administered by the NUPRC) for small, often previously-abandoned or
isolated leases, historically awarded to indigenous operators (notably the
2003 and 2020/2021 marginal field bid rounds).

The World Bank/GFMR flaring dataset has **no field for operator, license
block, or marginal-field status** — it only gives geographic coordinates,
country, and a satellite-estimated flare volume per site per year. There
is no direct join key between "a flare detected at lat/long X" and "lease
block Y, which NUPRC has designated a marginal field."

**We are not guessing at this mapping.** `clean_flaring_data.py` filters
records to `country == "Nigeria"` only — that distinction the data
supports directly. It does **not** attempt to label any subset of those
as marginal fields. Determining which flared sites sit within
marginal-field license blocks would require a separate geographic
cross-reference against NUPRC's published marginal field register/license
block boundaries (a real but non-trivial GIS matching exercise) — flagged
here as future work, not attempted in this batch.

### Candidate NUPRC sources for that future cross-reference

Found via web search (real, citable government sources), but **not yet
read or verified** — `www.nuprc.gov.ng` was also network-blocked from the
sandbox this was written in, so these are pointers to go fetch yourself,
not data that's been extracted or cross-checked:

- NUPRC Marginal Field Bid Round page (program overview, likely links to
  the current field/award list):
  https://www.nuprc.gov.ng/marginal-field-bid-round/
- **"Guidelines for the Award and Operations of Marginal Fields in
  Nigeria"** (official NUPRC guidelines PDF — defines what qualifies as a
  marginal field and the award process; this is the closest thing to an
  authoritative definition/source, but confirm it actually contains a
  named field list, since I couldn't open it to check):
  https://www.nuprc.gov.ng/wp-content/uploads/2020/08/Guidelines-for-the-Award-and-Operations-of-Marginal-Fields-in-Nigeria.pdf
- NUPRC Concession Situation report (periodically updated; may list
  license/lease blocks including marginal fields by operator):
  https://www.nuprc.gov.ng/wp-content/uploads/2026/03/NUPRC-Concession-Situation-Final-Merged-@-1st-March-2026-v.1.pdf
- NUPRC Annual Report (2024): may contain a marginal field status table —
  https://www.nuprc.gov.ng/wp-content/uploads/2025/04/UPDATED-NUPRC-2024-ANNUAL-REPORT-1.pdf

None of these have been opened and parsed. If you want the marginal-field
cross-reference actually built, the next step is: open these (or have
someone with access fetch them), confirm which one has a field-name +
location/license-block list, and only then design the join against the
World Bank site coordinates. Until that happens, no record in this
project is labeled as a marginal field — that would be a guess, not a
finding.

## Other limitations to keep in mind

- **Estimates, not metered data.** Satellite-derived volumes carry
  measurement uncertainty and can miss or misattribute small/intermittent
  flares.
- **Site identity across years.** Flare "sites" in the by-location file
  are satellite-detected hot spots, not stable operator-assigned site IDs
  — a site's identity/name across years should be treated as approximate,
  not authoritative.
- **No production or emissions data.** This dataset is flared gas volume
  only; it says nothing about associated CO2/methane emissions, production
  volumes, or company attribution. Any of those claims elsewhere in this
  project must cite a separate, explicitly named source.
