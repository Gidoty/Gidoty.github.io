import { formatUsd0, formatUsd2 } from '../../lib/format.js'

const ACCENT = {
  teal: { border: 'border-armit-teal/40', text: 'text-armit-teal' },
  coral: { border: 'border-armit-coral/40', text: 'text-armit-coral' },
  emerald: { border: 'border-armit-emerald/40', text: 'text-armit-emerald' },
}

function statusFor(carbonAdjustedPerBbl) {
  if (carbonAdjustedPerBbl < 0) return { label: 'LOSS POSITION', classes: 'bg-armit-coral text-white' }
  if (carbonAdjustedPerBbl <= 2) return { label: 'MARGINAL', classes: 'bg-armit-amber text-armit-bg' }
  return { label: 'PROFITABLE', classes: 'bg-armit-emerald text-white' }
}

export default function ScenarioSummaryCard({ badge, accent, metrics }) {
  const tone = ACCENT[accent]
  const status = statusFor(metrics.carbonAdjustedPerBbl)

  return (
    <div className={`rounded-xl border-2 bg-armit-card p-5 ${tone.border}`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold uppercase tracking-wide ${tone.text}`}>{badge}</span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${status.classes}`}>{status.label}</span>
      </div>

      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-wide text-armit-muted">Gross Margin</div>
        <div className="text-2xl font-bold text-armit-text">{formatUsd0(metrics.result.grossMarginPerDay)}</div>
        <div className="text-[11px] text-armit-muted">USD/day</div>
      </div>

      <dl className="mt-4 space-y-2 border-t border-white/10 pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-armit-muted">Net margin/bbl</dt>
          <dd className="font-semibold text-armit-text">{formatUsd2(metrics.result.netMarginPerBbl)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-armit-muted">Carbon-adjusted/bbl</dt>
          <dd className={`font-semibold ${metrics.carbonAdjustedPerBbl >= 0 ? 'text-armit-text' : 'text-armit-coral'}`}>
            {formatUsd2(metrics.carbonAdjustedPerBbl)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-armit-muted">3-2-1 crack spread</dt>
          <dd className="font-semibold text-armit-text">{formatUsd2(metrics.result.crack321)}</dd>
        </div>
      </dl>
    </div>
  )
}
