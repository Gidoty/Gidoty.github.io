#!/usr/bin/env python3
"""
FlareChain — clean raw World Bank GGFR/GFMR flaring data into
data/processed_flaring_data.json, filtered to Nigeria.

Usage:
    python scripts/clean_flaring_data.py --inspect
        Print sheet names and column headers found in the raw file, then
        exit without writing anything. Run this FIRST on a new file.

    python scripts/clean_flaring_data.py [--file NAME]
        Clean the raw file and write data/processed_flaring_data.json.

Before a real run, check the output of --inspect against COLUMN_MAP below.
The exact column names in the World Bank's flaring spreadsheets were not
verified against a live download in the environment this script was
written in (see docs/data_sources.md for why) — this script finds columns
by name-matching against likely candidates and will tell you plainly if it
can't find what it needs, rather than guessing silently.

Output schema (one object per site/year, exactly as specified):
    site_name, country, year, flared_volume_bcm, data_source, source_url

MARGINAL FIELD STATUS — update: the real downloaded file (2012-2025
edition) does have "Field Type", "Field name", and "Operator" columns
that earlier drafts of this project didn't know existed. Whether "Field
Type" actually distinguishes NUPRC-designated marginal fields (rather
than e.g. onshore/offshore) is NOT yet confirmed — --inspect now prints
the real values found in that column for Nigeria rows so this can be
checked against real data instead of assumed either way. Until that's
confirmed, output records still don't carry a marginal-field label.
"""

import argparse
import json
import sys
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT / "data" / "raw"
OUTPUT_PATH = ROOT / "data" / "processed_flaring_data.json"

DATA_SOURCE = "World Bank Global Flaring and Methane Reduction (GFMR) Partnership — Global Gas Flaring Database"
SOURCE_URL = "https://www.worldbank.org/en/programs/gasflaringreduction/global-flaring-data"

RAW_FILENAME_DEFAULT = "flare_volume_by_location.xlsx"
SHEET_NAME = 0  # first sheet by default; set to a sheet name string if --inspect shows the data is elsewhere

# Candidate column names to search for, in priority order. Edit these if
# --inspect shows your file uses different headers.
COLUMN_MAP = {
    # Confirmed against the real 2012-2025 by-location file: "Field name" is
    # a human-readable name but can be blank for some flares; "Flare id" is
    # always present. site_name resolution below prefers the former and
    # falls back to the latter per row, rather than picking one column for
    # the whole file.
    "field_name": ["Field name", "Field Name", "field_name"],
    "flare_id": ["Flare id", "Flare ID", "Flare_ID", "Id_Flare"],
    "field_type": ["Field Type", "Field type", "field_type"],
    "operator": ["Operator", "operator"],
    "country": ["Country", "country", "COUNTRY"],
}
YEAR_COLUMN_CANDIDATES = ["Year", "year", "YEAR"]
VOLUME_COLUMN_CANDIDATES = ["Volume", "flared_volume_bcm", "BCM", "Gas Flared (bcm)", "Flare_Volume_bcm"]

COUNTRY_FILTER = "Nigeria"


def load_raw(path: Path, sheet):
    if path.suffix.lower() in (".xlsx", ".xls"):
        return pd.read_excel(path, sheet_name=sheet)
    if path.suffix.lower() == ".csv":
        return pd.read_csv(path)
    raise ValueError(f"Unsupported file type: {path.suffix}")


def inspect(path: Path):
    if path.suffix.lower() in (".xlsx", ".xls"):
        xl = pd.ExcelFile(path)
        print(f"Sheets in {path.name}: {xl.sheet_names}")
        for name in xl.sheet_names:
            df = xl.parse(name, nrows=5)
            print(f"\n--- Sheet '{name}' — columns ---")
            print(list(df.columns))
        # Full read (not just the 5-row preview above) so the marginal-field
        # question below is checked against every Nigeria row, not a sample.
        full_df = xl.parse(xl.sheet_names[0])
    else:
        full_df = pd.read_csv(path)
        print(f"Columns in {path.name}:")
        print(list(full_df.columns))

    country_col = find_column(full_df, COLUMN_MAP["country"])
    field_type_col = find_column(full_df, COLUMN_MAP["field_type"])
    field_name_col = find_column(full_df, COLUMN_MAP["field_name"])
    operator_col = find_column(full_df, COLUMN_MAP["operator"])

    if country_col and field_type_col:
        ng = full_df[full_df[country_col].astype(str).str.strip().str.lower() == COUNTRY_FILTER.lower()]
        print(f"\n--- Marginal-field check: {len(ng)} Nigeria rows found ---")
        print(f"Real values in '{field_type_col}' for Nigeria rows:")
        print(ng[field_type_col].value_counts(dropna=False).to_string())
        if field_name_col:
            n_named = ng[field_name_col].notna().sum()
            print(f"\n'{field_name_col}' is filled in for {n_named} of {len(ng)} Nigeria rows.")
        if operator_col:
            n_op = ng[operator_col].notna().sum()
            print(f"'{operator_col}' is filled in for {n_op} of {len(ng)} Nigeria rows.")
        print(
            "\nCompare the values above against NUPRC's own marginal-field "
            "terminology (see docs/data_sources.md) before assuming a match "
            "— e.g. 'Onshore'/'Offshore' would NOT mean marginal-field status."
        )


def find_column(df, candidates):
    if candidates is None:
        return None
    for c in candidates:
        if c in df.columns:
            return c
    lower_map = {str(col).strip().lower(): col for col in df.columns}
    for c in candidates:
        if c.lower() in lower_map:
            return lower_map[c.lower()]
    return None


def detect_year_columns(df):
    year_cols = []
    for col in df.columns:
        s = str(col).strip()
        if s.isdigit() and 1990 <= int(s) <= 2100:
            year_cols.append(col)
    return year_cols


def resolve_site_name(row, field_name_col, flare_id_col):
    if field_name_col and pd.notna(row[field_name_col]) and str(row[field_name_col]).strip():
        return str(row[field_name_col]).strip()
    if flare_id_col and pd.notna(row[flare_id_col]):
        return f"Flare {row[flare_id_col]}"
    return "UNKNOWN"


def clean(df: pd.DataFrame):
    field_name_col = find_column(df, COLUMN_MAP["field_name"])
    flare_id_col = find_column(df, COLUMN_MAP["flare_id"])
    country_col = find_column(df, COLUMN_MAP["country"])

    if country_col is None:
        print("ERROR: could not find a country column. Columns found:")
        print(list(df.columns))
        print("Add the real column name to COLUMN_MAP['country'] in this script and re-run.")
        sys.exit(1)

    if not field_name_col and not flare_id_col:
        print(
            "WARNING: could not find a field-name or flare-id column. Columns found:\n"
            f"{list(df.columns)}\n"
            "Proceeding with site_name='UNKNOWN' for all rows — add the real "
            "column name(s) to COLUMN_MAP and re-run for real site names."
        )

    df = df[df[country_col].astype(str).str.strip().str.lower() == COUNTRY_FILTER.lower()].copy()
    if df.empty:
        print(
            f"WARNING: no rows matched country == '{COUNTRY_FILTER}'. "
            f"Actual values in the country column include:"
        )
        print(sorted(set(df[country_col].astype(str)))[:20] if country_col in df else "N/A")
        return []

    year_cols = detect_year_columns(df)
    records = []

    if year_cols:
        # Wide format: one column per year, one row per site.
        for _, row in df.iterrows():
            site_name = resolve_site_name(row, field_name_col, flare_id_col)
            for yc in year_cols:
                value = row[yc]
                if pd.isna(value):
                    continue
                records.append(
                    {
                        "site_name": site_name,
                        "country": COUNTRY_FILTER,
                        "year": int(yc),
                        "flared_volume_bcm": float(value),
                        "data_source": DATA_SOURCE,
                        "source_url": SOURCE_URL,
                    }
                )
    else:
        # Long format: expects explicit Year + Volume columns.
        year_col = find_column(df, YEAR_COLUMN_CANDIDATES)
        volume_col = find_column(df, VOLUME_COLUMN_CANDIDATES)
        if not year_col or not volume_col:
            print(
                "ERROR: no per-year columns detected (wide format), and no "
                "explicit Year/Volume columns found either (long format). "
                f"Columns found: {list(df.columns)}"
            )
            print(
                "Edit YEAR_COLUMN_CANDIDATES / VOLUME_COLUMN_CANDIDATES at the "
                "top of this script to match your file, then re-run."
            )
            sys.exit(1)
        for _, row in df.iterrows():
            site_name = resolve_site_name(row, field_name_col, flare_id_col)
            value = row[volume_col]
            if pd.isna(value):
                continue
            records.append(
                {
                    "site_name": site_name,
                    "country": COUNTRY_FILTER,
                    "year": int(row[year_col]),
                    "flared_volume_bcm": float(value),
                    "data_source": DATA_SOURCE,
                    "source_url": SOURCE_URL,
                }
            )

    return records


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", default=RAW_FILENAME_DEFAULT, help="raw filename inside data/raw/")
    parser.add_argument("--inspect", action="store_true", help="print sheet/column names only, write nothing")
    args = parser.parse_args()

    path = RAW_DIR / args.file
    if not path.exists():
        print(f"Raw file not found: {path}")
        print("Run scripts/fetch_ggfr_data.py first, or see docs/data_sources.md for manual download steps.")
        sys.exit(1)

    if args.inspect:
        inspect(path)
        return

    df = load_raw(path, SHEET_NAME)
    records = clean(df)

    if not records:
        print("No records produced. Nothing written.")
        sys.exit(1)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(records, f, indent=2)

    print(f"Wrote {len(records)} records to {OUTPUT_PATH}")
    print(
        "\nLIMITATION: this dataset does not distinguish 'marginal fields' (a "
        "Nigerian regulatory designation for small/isolated leases) from other "
        "oil field types. Every Nigeria record above is included as-is, with "
        "no marginal-field label attached — see docs/data_sources.md."
    )


if __name__ == "__main__":
    main()
