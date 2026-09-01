import { formatUsd2 } from '../../lib/format.js'

export default function CrackSpreadCompare({ crack321, armitMargin }) {
  const delta = armitMargin - crack321

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">
        Simplified Benchmark vs. Assay-Based True Margin
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-armit-muted">
            3-2-1 Crack Spread (simplified)
          </div>
          <div className="mt-2 text-xl font-bold text-armit-text">{formatUsd2(crack321)}</div>
          <div className="mt-1 text-[11px] text-armit-muted">
            Generic futures-style benchmark — ignores actual yields and unit configuration.
          </div>
        </div>
        <div className="rounded-lg border border-armit-teal/30 bg-armit-teal/5 p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-armit-muted">
            ARMIT True Margin (assay-based)
          </div>
          <div className="mt-2 text-xl font-bold text-armit-teal">{formatUsd2(armitMargin)}</div>
          <div className="mt-1 text-[11px] text-armit-muted">
            Gross margin per barrel, derived from real assay yields and unit routing.
          </div>
        </div>
      </div>
      <p className="mt-4 text-xs text-armit-muted">
        Difference:{' '}
        <span className={`font-semibold ${delta >= 0 ? 'text-armit-emerald' : 'text-armit-coral'}`}>
          {delta >= 0 ? '+' : ''}
          {formatUsd2(delta)}/bbl
        </span>{' '}
        — the generic spread {delta >= 0 ? 'understates' : 'overstates'} what this configuration
        actually earns.
      </p>
    </div>
  )
}
