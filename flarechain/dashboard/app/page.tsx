import { getLatestAnchor } from "@/lib/getAnchoredRecord";
import type { AnchorEntry } from "@/lib/types";
import VerifyPanel from "@/components/VerifyPanel";
import FlareHero from "@/components/FlareHero";

export default function Home() {
  const anchor = getLatestAnchor();

  return (
    <main>
      <FlareHero />

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-stone-200 py-5 text-xs uppercase tracking-wide text-stone-500">
          <span className="font-semibold text-brand-600">FlareChain</span>
          <span>Data: World Bank GFMR Partnership</span>
          <span>Chain: Polygon Amoy</span>
          <span>Nigeria gas flaring records</span>
        </div>

        <div className="pt-10">
          {anchor ? <AnchoredRecord anchor={anchor} /> : <EmptyState />}
        </div>

        <footer className="mt-16 border-t border-stone-200 pt-6 text-xs text-stone-400">
          Prototype — runs on the Polygon Amoy test network, not mainnet. Not a
          production system.
        </footer>
      </div>
    </main>
  );
}

function AnchoredRecord({ anchor }: { anchor: AnchorEntry }) {
  const { record } = anchor;

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(19,32,26,0.04),0_8px_24px_-16px_rgba(19,32,26,0.25)]">
        <div className="h-1 bg-brand-500" />
        <div className="p-6 sm:p-7">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Reported flaring data
          </h2>
          <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
            <Field label="Site name" value={record.site_name} />
            <Field label="Country" value={record.country} />
            <Field label="Year" value={String(record.year)} />
            <Field label="Reported flared volume" value={`${record.flared_volume_bcm} bcm`} />
            <Field label="Data source" value={record.data_source} />
            <Field
              label="Source"
              value={
                <a
                  href={record.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 underline decoration-brand-100 underline-offset-2 hover:text-brand-700"
                >
                  {record.source_url}
                </a>
              }
            />
          </dl>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(19,32,26,0.04),0_8px_24px_-16px_rgba(19,32,26,0.25)]">
        <div className="h-1 bg-gold-500" />
        <div className="p-6 sm:p-7">
          <h2 className="font-serif text-lg font-semibold text-ink">
            On-chain verification
          </h2>
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
            <p className="mb-3 text-sm text-stone-600">
              Re-check this record against the blockchain right now:
            </p>
            <VerifyPanel anchor={anchor} />
          </div>
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

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
      <h2 className="font-serif text-lg font-semibold text-stone-700">No anchored record yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
        This dashboard reads <code className="rounded bg-stone-100 px-1 py-0.5">../data/anchors.json</code>,
        which is written by <code className="rounded bg-stone-100 px-1 py-0.5">scripts/anchor_record.js</code>.
        Run the data-acquisition and anchoring scripts first, then reload this
        page.
      </p>
      <pre className="mx-auto mt-4 max-w-md overflow-x-auto rounded-md bg-stone-900 p-4 text-left text-xs text-stone-100">
{`node scripts/anchor_record.js \\
  --file data/processed_flaring_data.json --index 0`}
      </pre>
    </div>
  );
}
