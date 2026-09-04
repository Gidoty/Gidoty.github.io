"use client";

import { useEffect, useMemo, useState } from "react";
import { loadDataset, type Dataset, type DatasetRecord } from "@/lib/dataset";
import type { AnchorEntry } from "@/lib/types";
import VerifyPanel from "@/components/VerifyPanel";

function recordsEqual(a: DatasetRecord, b: DatasetRecord) {
  return a.site_name === b.site_name && a.year === b.year;
}

export default function DataExplorer({ anchor }: { anchor: AnchorEntry | null }) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [selected, setSelected] = useState<DatasetRecord | null>(
    anchor
      ? { site_name: anchor.record.site_name, year: anchor.record.year, flared_volume_bcm: anchor.record.flared_volume_bcm }
      : null
  );

  useEffect(() => {
    let cancelled = false;
    loadDataset()
      .then((d) => {
        if (!cancelled) setDataset(d);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const years = useMemo(() => {
    if (!dataset) return [];
    return Array.from(new Set(dataset.records.map((r) => r.year))).sort((a, b) => a - b);
  }, [dataset]);

  const yearTotals = useMemo(() => {
    if (!dataset) return [];
    const totals = new Map<number, number>();
    for (const r of dataset.records) totals.set(r.year, (totals.get(r.year) ?? 0) + r.flared_volume_bcm);
    return years.map((y) => ({ year: y, total: totals.get(y) ?? 0 }));
  }, [dataset, years]);

  const filtered = useMemo(() => {
    if (!dataset) return [];
    const q = query.trim().toLowerCase();
    return dataset.records.filter((r) => {
      if (yearFilter !== "all" && r.year !== yearFilter) return false;
      if (q && !r.site_name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [dataset, query, yearFilter]);

  const stats = useMemo(() => {
    if (!dataset) return null;
    const sites = new Set(dataset.records.map((r) => r.site_name));
    const total = dataset.records.reduce((sum, r) => sum + r.flared_volume_bcm, 0);
    return {
      recordCount: dataset.records.length,
      siteCount: sites.size,
      yearRange: years.length ? `${years[0]}–${years[years.length - 1]}` : "—",
      totalVolume: total,
    };
  }, [dataset, years]);

  const DISPLAY_LIMIT = 60;
  const visible = filtered.slice(0, DISPLAY_LIMIT);
  const hiddenCount = filtered.length - visible.length;

  const isAnchored = (r: DatasetRecord) => anchor != null && recordsEqual(r, { site_name: anchor.record.site_name, year: anchor.record.year, flared_volume_bcm: anchor.record.flared_volume_bcm });

  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        Could not load the dataset: {loadError}
      </div>
    );
  }

  if (!dataset || !stats) {
    return <div className="py-12 text-center text-sm text-stone-400">Loading 6,287 records…</div>;
  }

  return (
    <div className="space-y-10">
      <StatTiles stats={stats} />
      <YearChart data={yearTotals} />
      <SearchAndBrowse
        query={query}
        onQuery={setQuery}
        yearFilter={yearFilter}
        onYearFilter={setYearFilter}
        years={years}
        results={visible}
        totalMatches={filtered.length}
        hiddenCount={hiddenCount}
        selected={selected}
        onSelect={setSelected}
        isAnchored={isAnchored}
      />
      {selected && (
        <SelectedRecordDetail
          record={selected}
          dataset={dataset}
          anchor={isAnchored(selected) ? anchor : null}
          hasAnyAnchor={anchor != null}
          onJumpToAnchor={
            anchor
              ? () => setSelected({ site_name: anchor.record.site_name, year: anchor.record.year, flared_volume_bcm: anchor.record.flared_volume_bcm })
              : undefined
          }
        />
      )}
    </div>
  );
}

function StatTiles({ stats }: { stats: { recordCount: number; siteCount: number; yearRange: string; totalVolume: number } }) {
  const tiles = [
    { label: "Records", value: stats.recordCount.toLocaleString() },
    { label: "Sites", value: stats.siteCount.toLocaleString() },
    { label: "Years covered", value: stats.yearRange },
    { label: "Total reported flared volume", value: `${stats.totalVolume.toFixed(1)} bcm` },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-lg border border-stone-200 bg-white px-4 py-3">
          <div className="font-serif text-2xl font-semibold text-ink tabular-nums">{t.value}</div>
          <div className="mt-0.5 text-xs uppercase tracking-wide text-stone-400">{t.label}</div>
        </div>
      ))}
    </div>
  );
}

function YearChart({ data }: { data: { year: number; total: number }[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.total));
  const width = 900;
  const height = 160;
  const barGap = 6;
  const barWidth = width / data.length - barGap;

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="font-serif text-lg font-semibold text-ink">Total flared volume by year</h2>
      <p className="mt-1 text-xs text-stone-400">All Nigeria sites, summed per year. Hover a bar for the exact figure.</p>
      <svg viewBox={`0 0 ${width} ${height + 24}`} className="mt-4 h-40 w-full" role="img" aria-label="Bar chart of total flared volume by year">
        {data.map((d, i) => {
          const h = max > 0 ? (d.total / max) * height : 0;
          const x = i * (barWidth + barGap);
          return (
            <g key={d.year}>
              <rect
                x={x}
                y={height - h}
                width={barWidth}
                height={h}
                rx="2"
                fill="#2C6B3B"
                className="transition-opacity hover:opacity-70"
              >
                <title>{`${d.year}: ${d.total.toFixed(2)} bcm`}</title>
              </rect>
              <text x={x + barWidth / 2} y={height + 16} textAnchor="middle" fontSize="11" fill="#78716C">
                {String(d.year).slice(2)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SearchAndBrowse({
  query,
  onQuery,
  yearFilter,
  onYearFilter,
  years,
  results,
  totalMatches,
  hiddenCount,
  selected,
  onSelect,
  isAnchored,
}: {
  query: string;
  onQuery: (v: string) => void;
  yearFilter: number | "all";
  onYearFilter: (v: number | "all") => void;
  years: number[];
  results: DatasetRecord[];
  totalMatches: number;
  hiddenCount: number;
  selected: DatasetRecord | null;
  onSelect: (r: DatasetRecord) => void;
  isAnchored: (r: DatasetRecord) => boolean;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="font-serif text-lg font-semibold text-ink">Browse the dataset</h2>
      <p className="mt-1 text-xs text-stone-400">
        Search by site name, optionally filter by year, then select a record to see its full
        detail and check whether it&apos;s been anchored on-chain.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search by site name (e.g. Yoho, Bonny, Forcados)…"
          className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-ink placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <select
          value={yearFilter}
          onChange={(e) => onYearFilter(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="rounded-md border border-stone-300 px-3 py-2 text-sm text-ink focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-xs text-stone-400">
        {totalMatches.toLocaleString()} matching record{totalMatches === 1 ? "" : "s"}
        {hiddenCount > 0 ? ` — showing the first ${results.length}, refine your search to narrow it down` : ""}
      </p>

      <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-stone-100">
        {results.length === 0 ? (
          <p className="p-4 text-sm text-stone-400">No records match that search.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-stone-50 text-xs uppercase tracking-wide text-stone-400">
              <tr>
                <th className="px-3 py-2 font-medium">Site</th>
                <th className="px-3 py-2 font-medium">Year</th>
                <th className="px-3 py-2 font-medium">Volume (bcm)</th>
                <th className="px-3 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => {
                const isSelected = selected && recordsEqual(selected, r);
                return (
                  <tr
                    key={`${r.site_name}-${r.year}-${i}`}
                    onClick={() => onSelect(r)}
                    className={`cursor-pointer border-t border-stone-100 hover:bg-brand-50 ${isSelected ? "bg-brand-50" : ""}`}
                  >
                    <td className="px-3 py-2 text-ink">{r.site_name}</td>
                    <td className="px-3 py-2 tabular-nums text-stone-600">{r.year}</td>
                    <td className="px-3 py-2 tabular-nums text-stone-600">{r.flared_volume_bcm.toFixed(4)}</td>
                    <td className="px-3 py-2 text-right">
                      {isAnchored(r) && (
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-700">
                          Anchored
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SelectedRecordDetail({
  record,
  dataset,
  anchor,
  hasAnyAnchor,
  onJumpToAnchor,
}: {
  record: DatasetRecord;
  dataset: Dataset;
  anchor: AnchorEntry | null;
  hasAnyAnchor: boolean;
  onJumpToAnchor?: () => void;
}) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(19,32,26,0.04),0_8px_24px_-16px_rgba(19,32,26,0.25)]">
        <div className="h-1 bg-brand-500" />
        <div className="p-6 sm:p-7">
          <h2 className="font-serif text-lg font-semibold text-ink">Selected record</h2>
          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="Site name" value={record.site_name} />
            <Field label="Country" value={dataset.country} />
            <Field label="Year" value={String(record.year)} />
            <Field label="Reported flared volume" value={`${record.flared_volume_bcm} bcm`} />
            <Field label="Data source" value={dataset.data_source} />
            <Field
              label="Source"
              value={
                <a
                  href={dataset.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline decoration-brand-100 underline-offset-2 hover:text-brand-700"
                >
                  {dataset.source_url}
                </a>
              }
            />
          </dl>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(19,32,26,0.04),0_8px_24px_-16px_rgba(19,32,26,0.25)]">
        <div className={`h-1 ${anchor ? "bg-gold-500" : "bg-stone-200"}`} />
        <div className="p-6 sm:p-7">
          <h2 className="font-serif text-lg font-semibold text-ink">On-chain verification</h2>

          {anchor ? (
            <>
              <dl className="mt-5 space-y-5">
                <Field label="Anchored hash" value={<span className="break-all font-mono text-xs">{anchor.hash}</span>} />
                <Field label="Anchored at (block time)" value={anchor.blockTimestampIso} />
                <Field
                  label="Transaction"
                  value={
                    <a
                      href={anchor.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 underline decoration-brand-100 underline-offset-2 hover:text-brand-700"
                    >
                      View on PolygonScan ↗
                    </a>
                  }
                />
              </dl>
              <div className="mt-7 border-t border-stone-100 pt-6">
                <p className="mb-3 text-sm text-stone-600">Re-check this record against the blockchain right now:</p>
                <VerifyPanel anchor={anchor} />
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-600">
              <p className="font-medium text-stone-700">Not yet anchored on-chain.</p>
              <p className="mt-1 text-xs leading-relaxed">
                {hasAnyAnchor
                  ? "Only one record has been anchored so far, as a working demonstration of the mechanism — anchoring the full dataset is documented future work, not automatic yet. This record is real World Bank data, just not yet on-chain."
                  : "No record has been anchored on-chain yet in this deployment. This is real World Bank data, browsable here, but the anchoring step hasn't been run."}
              </p>
              {onJumpToAnchor && (
                <button
                  onClick={onJumpToAnchor}
                  className="mt-3 text-xs font-medium text-brand-600 underline decoration-brand-100 underline-offset-2 hover:text-brand-700"
                >
                  Jump to the anchored example record →
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">{label}</dt>
      <dd className="mt-1 text-sm text-ink">{value}</dd>
    </div>
  );
}
