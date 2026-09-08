import { formatInt } from '../../utils/format.js'

// Hand-rolled SVG donut (stroke-dasharray technique) rather than Recharts'
// <Pie>: that component's angle math renders visibly wrong (a partial arc
// instead of a full circle) in this project's build even with Recharts' own
// textbook example data — a library/bundling issue independent of this
// chart's inputs. Recharts' Bar/Line charts elsewhere in the app are
// unaffected and still used normally.
const SEGMENTS = [
  { key: 'nValue', label: 'N', color: '#4caf50' },
  { key: 'pValue', label: 'P', color: '#f4a261' },
  { key: 'kValue', label: 'K', color: '#00bcd4' },
]

const RADIUS = 60
const STROKE = 28
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function NpkPieChart({ value, currencyPrefix }) {
  const total = value.totalValue || 1
  const shares = SEGMENTS.map((segment) => value[segment.key] / total)
  const offsets = shares.reduce((acc, share) => {
    const prev = acc.length ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0
    acc.push({ offset: prev, dash: share * CIRCUMFERENCE })
    return acc
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-4 font-medium text-text">
        Fertiliser Value by Nutrient ({currencyPrefix.trim()})
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <svg viewBox="0 0 160 160" className="h-40 w-40 -rotate-90">
          <circle cx="80" cy="80" r={RADIUS} fill="none" stroke="#2e5931" strokeWidth={STROKE} />
          {SEGMENTS.map((segment, i) => (
            <circle
              key={segment.key}
              cx="80"
              cy="80"
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={STROKE}
              strokeDasharray={`${offsets[i].dash} ${CIRCUMFERENCE - offsets[i].dash}`}
              strokeDashoffset={-offsets[i].offset}
            />
          ))}
        </svg>
        <ul className="space-y-2 text-sm">
          {SEGMENTS.map((segment) => (
            <li key={segment.key} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="text-text">{segment.label}:</span>
              <span className="text-muted">
                {currencyPrefix}
                {formatInt(value[segment.key])}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
