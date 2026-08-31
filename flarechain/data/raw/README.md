# data/raw/

Untouched downloads go here. This folder is gitignored (except this file)
so raw World Bank spreadsheets aren't committed to the repo — regenerate
them with `scripts/fetch_ggfr_data.py` or the manual steps in
`../../docs/data_sources.md`.

Expected file(s), by default filenames the scripts look for:

- `flare_volume_by_location.xlsx` — per-flare-site data (lat/long, country,
  yearly volumes). This is the one `clean_flaring_data.py` reads by default.
- `flare_volume_country_level.xlsx` — country-year aggregate totals
  (optional, useful for sanity-checking the site-level sums).

If your downloaded file has a different name, either rename it to match
the above or pass `--file <your_filename>` to `clean_flaring_data.py`.
