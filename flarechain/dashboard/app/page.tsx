import { getLatestAnchor } from "@/lib/getAnchoredRecord";
import type { AnchorEntry } from "@/lib/types";
import VerifyPanel from "@/components/VerifyPanel";

export default function Home() {
  const anchor = getLatestAnchor();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">FlareChain</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">
          Verified gas flaring reports
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-600">
          FlareChain verifies gas flaring emissions data so it can&apos;t be
          silently altered after it&apos;s reported. Every record is hashed
          and permanently anchored on a public blockchain the moment it&apos;s
          submitted — anyone can later re-check a record against that
          on-chain fingerprint to confirm nothing has changed.
        </p>
      </header>

      {anchor ? <AnchoredRecord anchor={anchor} /> : <EmptyState />}

      <footer className="mt-16 border-t border-stone-200 pt-6 text-xs text-stone-400">
        Prototype — runs on the Polygon Amoy test network, not mainnet. Not a
        production system.
      </footer>
    </main>
  );
}

function AnchoredRecord({ anchor }: { anchor: AnchorEntry }) {
  const { record } = anchor;

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-stone-200 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Reported flaring data
        </h2>
        <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
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
                className="text-brand-500 underline decoration-brand-100 underline-offset-2 hover:text-brand-600"
              >
                {record.source_url}
              </a>
            }
          />
        </dl>
      </section>

      <section className="rounded-lg border border-stone-200 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          On-chain verification
        </h2>
        <dl className="mt-4 space-y-4">
          <Field label="Anchored hash" value={<span className="break-all font-mono text-xs">{anchor.hash}</span>} />
          <Field label="Anchored at (block time)" value={anchor.blockTimestampIso} />
          <Field
            label="Transaction"
            value={
              <a
                href={anchor.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-500 underline decoration-brand-100 underline-offset-2 hover:text-brand-600"
              >
                View on PolygonScan ↗
              </a>
            }
          />
        </dl>

        <div className="mt-6 border-t border-stone-100 pt-6">
          <p className="mb-3 text-sm text-stone-600">
            Re-check this record against the blockchain right now:
          </p>
          <VerifyPanel anchor={anchor} />
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-stone-400">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 p-8 text-center">
      <h2 className="text-sm font-semibold text-stone-700">No anchored record yet</h2>
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
