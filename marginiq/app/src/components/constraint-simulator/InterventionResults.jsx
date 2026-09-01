import { formatNum0, formatUsd0 } from '../../lib/format.js'
import { formatPct } from '../../utils/formatters.js'
import BeforeAfterBar from './BeforeAfterBar.jsx'

function PaybackLabel({ paybackDays, cost }) {
  if (cost <= 0) {
    return <span className="text-armit-emerald">Immediate — no capital cost</span>
  }
  if (paybackDays === null) {
    return <span className="text-armit-muted">N/A — no positive gain</span>
  }
  if (paybackDays < 30) {
    return <span className="text-armit-emerald">Fast payback</span>
  }
  if (paybackDays <= 180) {
    return <span className="text-armit-amber">Good payback</span>
  }
  return <span className="text-armit-text">Slow payback</span>
}

export default function InterventionResults({
  accentColor,
  dailyGain,
  annualGain,
  cost,
  paybackDays,
  roi,
  baselineDaily,
  extraStats = [],
}) {
  const highRoi = roi !== null && roi > 500

  return (
    <div className="space-y-4">
      {extraStats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {extraStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-white/10 bg-armit-bg/60 p-3">
              <div className="text-[11px] uppercase tracking-wide text-armit-muted">{stat.label}</div>
              <div className="mt-0.5 text-sm font-semibold text-armit-text">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      <div>
        <div className="text-xs font-medium uppercase tracking-wide text-armit-muted">
          Daily margin gain
        </div>
        <div className="text-3xl font-bold sm:text-4xl" style={{ color: accentColor }}>
          {formatUsd0(dailyGain)}
          <span className="ml-1 text-base font-medium text-armit-muted">/day</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-armit-muted">Annual gain</div>
          <div className="text-sm font-semibold text-armit-text">{formatUsd0(annualGain)}/yr</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-armit-muted">Payback</div>
          <div className="text-sm font-semibold">
            {cost > 0 && paybackDays !== null ? `${formatNum0(paybackDays)} days` : '—'}
          </div>
          <div className="text-[11px]">
            <PaybackLabel paybackDays={paybackDays} cost={cost} />
          </div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wide text-armit-muted">1-Year ROI</div>
          <div className="text-sm font-semibold text-armit-text">
            {roi === null ? 'N/A' : formatPct(roi)}
            {highRoi && (
              <span className="ml-1.5 rounded-full bg-armit-amber/15 px-1.5 py-0.5 text-[10px] font-bold text-armit-amber">
                ⭐ High ROI
              </span>
            )}
          </div>
        </div>
      </div>

      <BeforeAfterBar
        baseline={baselineDaily}
        improved={baselineDaily + dailyGain}
        accentColor={accentColor}
      />
    </div>
  )
}
