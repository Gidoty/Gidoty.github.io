import { formatUsd0 } from '../../lib/format.js'

export default function BeforeAfterBar({ baseline, improved, accentColor }) {
  const max = Math.max(baseline, improved, 1)
  const baselinePct = Math.max(2, (Math.max(baseline, 0) / max) * 100)
  const improvedPct = Math.max(2, (Math.max(improved, 0) / max) * 100)

  return (
    <div className="space-y-2">
      <div>
        <div className="mb-1 flex justify-between text-[11px] text-armit-muted">
          <span>Current gross margin</span>
          <span>{formatUsd0(baseline)}/day</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-white/30" style={{ width: `${baselinePct}%` }} />
        </div>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-[11px] text-armit-muted">
          <span>With this fix</span>
          <span>{formatUsd0(improved)}/day</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ width: `${improvedPct}%`, backgroundColor: accentColor }}
          />
        </div>
      </div>
    </div>
  )
}
