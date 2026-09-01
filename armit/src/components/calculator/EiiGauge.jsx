import { formatNum1, formatNum2 } from '../../lib/format.js'

const MIN = 70
const MAX = 140

function zoneFor(eii) {
  if (eii < 95) return { name: 'Best practice', color: '#2EC4B6' }
  if (eii <= 110) return { name: 'Average', color: '#F4A261' }
  return { name: 'Energy-inefficient', color: '#E76F51' }
}

export default function EiiGauge({ eii, firedDutyGcalPerHr }) {
  const zone = zoneFor(eii)
  const pct = Math.min(100, Math.max(0, ((eii - MIN) / (MAX - MIN)) * 100))

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-sm font-semibold text-armit-text">EII-Style Energy Intensity Index</h3>
        <span className="text-xs font-medium" style={{ color: zone.color }}>
          {zone.name}
        </span>
      </div>

      <div className="mt-4 flex items-end gap-3">
        <span className="text-3xl font-bold" style={{ color: zone.color }}>
          {formatNum1(eii)}
        </span>
        <span className="pb-1 text-xs text-armit-muted">EII proxy (100 = design benchmark)</span>
      </div>

      <div className="relative mt-4 h-3 w-full overflow-hidden rounded-full bg-white/10">
        <div className="absolute inset-y-0 left-0 w-[35.7%] bg-armit-emerald/50" />
        <div className="absolute inset-y-0 left-[35.7%] w-[21.4%] bg-armit-amber/50" />
        <div className="absolute inset-y-0 left-[57.1%] right-0 bg-armit-coral/50" />
        <div
          className="absolute top-0 h-full w-1 -translate-x-1/2 bg-armit-text"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-armit-muted">
        <span>&lt; 95 green</span>
        <span>95–110 yellow</span>
        <span>&gt; 110 red</span>
      </div>

      <div className="mt-4 border-t border-white/5 pt-3 text-sm text-armit-muted">
        Fired duty:{' '}
        <span className="font-semibold text-armit-text">{formatNum2(firedDutyGcalPerHr)}</span>{' '}
        Gcal/hr
      </div>
    </div>
  )
}
