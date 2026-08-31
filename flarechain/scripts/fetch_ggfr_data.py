#!/usr/bin/env python3
"""
FlareChain — GGFR/GFMR gas flaring data fetcher.

Attempts to pull the World Bank's Global Flaring and Methane Reduction
(GFMR — the successor program to GGFR) flaring dataset via the World Bank
Data Catalog API. If that fails for any reason, prints manual download
steps instead of silently giving up.

READ THIS BEFORE TRUSTING THE AUTOMATED PATH:
The World Bank does not publish a simple, stable, documented REST endpoint
for "give me Nigeria flaring volumes as JSON/CSV". The calls below target
the World Bank Data Catalog API (base https://datacatalogapi.worldbank.org
/ddhxext), built from that API's own documentation
(https://datahelpdesk.worldbank.org/knowledgebase/articles/1886698-data-catalog-api)
and a third-party endpoint reference
(https://gist.github.com/tgherzog/e6090f9b2ba74f49f75b228f5c7169b9), for
dataset_unique_id "0037743" ("Global Gas Flaring Database" in the catalog:
https://datacatalog.worldbank.org/search/dataset/0037743/global-gas-flaring-database).

This script was written in a sandboxed environment where all worldbank.org
domains were network-blocked, so these calls could NOT be executed or
verified end-to-end. Treat the automated path as best-effort: run it, read
its output carefully, and fall back to the manual steps (also printed
below and documented in ../docs/data_sources.md) if anything looks off —
e.g. an unexpected JSON shape, a 404, or a downloaded file that isn't
actually a valid spreadsheet.
"""

import json
import sys
from pathlib import Path

import requests

API_BASE = "https://datacatalogapi.worldbank.org/ddhxext"
DATASET_UNIQUE_ID = "0037743"  # "Global Gas Flaring Database" on the WB Data Catalog
RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"

# Keywords used to pick out the flaring-volume resource(s) from the
# dataset's resource list once we have DatasetView's response.
RESOURCE_NAME_KEYWORDS = ["flare", "flaring"]


def fetch_dataset_metadata():
    url = f"{API_BASE}/DatasetView"
    params = {"dataset_unique_id": DATASET_UNIQUE_ID}
    resp = requests.get(url, params=params, timeout=30)
    resp.raise_for_status()
    return resp.json()


def find_resources(metadata):
    """
    The exact JSON shape of DatasetView's response was not confirmed against
    a live call. Try a few plausible shapes defensively and return whatever
    list of resource dicts we can find, rather than assuming one structure.
    """
    if not isinstance(metadata, dict):
        return []
    for key in ("resources", "Resources", "value", "dataset_resources"):
        val = metadata.get(key)
        if isinstance(val, list):
            return val
        if isinstance(val, dict):
            for inner_key in ("resources", "Resources"):
                if isinstance(val.get(inner_key), list):
                    return val[inner_key]
    return []


def download_resource(resource_unique_id, dest_path):
    url = f"{API_BASE}/ResourceDownload"
    params = {"resource_unique_id": resource_unique_id, "version_id": ""}
    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    dest_path.write_bytes(resp.content)


def print_manual_instructions():
    print(
        """
============================================================
MANUAL DOWNLOAD STEPS (World Bank GGFR / GFMR flaring data)
============================================================

1. Go to:
   https://www.worldbank.org/en/programs/gasflaringreduction/global-flaring-data

   This is the World Bank's official Global Flaring and Methane Reduction
   (GFMR) Partnership data page. GGFR was folded into GFMR; the data is the
   same lineage (NOAA/Colorado School of Mines satellite-based estimates).

2. Download BOTH files if available (exact filenames carry a version year,
   e.g. "2012-2024-..."):
     - "Flare volume and intensity estimates" — country-year totals (bcm)
     - "Flare Volume Estimates by Individual Flare Location" — per-site
       data with latitude/longitude, country, and per-year volumes

   The by-location file is the one this project actually needs, since we
   want site-level granularity, not just a national total. The country
   file is useful as a sanity check (site-level sums should roughly match
   the country total).

3. Save the file(s) exactly as downloaded (don't edit them) into:
     flarechain/data/raw/

   Suggested filenames (clean_flaring_data.py looks for these by default):
     flarechain/data/raw/flare_volume_by_location.xlsx
     flarechain/data/raw/flare_volume_country_level.xlsx

4. Run:
     python scripts/clean_flaring_data.py --inspect

   This prints the actual sheet names and column headers in your file (not
   guessed) so you can confirm the column mapping in clean_flaring_data.py
   matches before doing a real run.
============================================================
"""
    )


def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    print(
        f"Attempting World Bank Data Catalog API: "
        f"{API_BASE}/DatasetView?dataset_unique_id={DATASET_UNIQUE_ID}"
    )
    try:
        metadata = fetch_dataset_metadata()
    except Exception as exc:
        print(f"API call failed: {exc}")
        print_manual_instructions()
        sys.exit(1)

    resources = find_resources(metadata)
    if not resources:
        print("Could not locate a resource list in the API response.")
        print("Raw response (first 3000 chars, for debugging):")
        print(json.dumps(metadata, indent=2)[:3000])
        print_manual_instructions()
        sys.exit(1)

    matched = [
        r for r in resources
        if any(k in json.dumps(r).lower() for k in RESOURCE_NAME_KEYWORDS)
    ]
    if not matched:
        print("No resources matched expected keywords ('flare'/'flaring'). Full resource list:")
        print(json.dumps(resources, indent=2)[:3000])
        print_manual_instructions()
        sys.exit(1)

    any_success = False
    for r in matched:
        resource_id = r.get("resource_unique_id") or r.get("id")
        name = r.get("resource_name") or r.get("name") or str(resource_id)
        if not resource_id:
            continue
        safe_name = str(name).replace(" ", "_").replace("/", "_")
        dest = RAW_DIR / safe_name
        print(f"Downloading resource {resource_id} -> {dest}")
        try:
            download_resource(resource_id, dest)
            print(f"Saved: {dest}")
            any_success = True
        except Exception as exc:
            print(f"Failed to download resource {resource_id}: {exc}")

    if not any_success:
        print_manual_instructions()
        sys.exit(1)

    print(
        "\nDone. Before trusting this, open the downloaded file(s) in data/raw/ "
        "and confirm they're actually valid spreadsheets (not an HTML error "
        "page saved with an .xlsx extension) before running clean_flaring_data.py."
    )


if __name__ == "__main__":
    main()
