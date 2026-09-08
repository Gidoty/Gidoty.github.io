import { Fragment } from 'react'
import { COMPARISON_ROWS } from './comparisonRows.js'

const BADGE_CLASSES = {
  accent: 'bg-accent text-white',
  amber: 'bg-amber text-black',
  cyan: 'bg-cyan text-black',
}

const BEST_TEXT_CLASSES = {
  accent: 'font-bold text-accent',
  amber: 'font-bold text-amber',
  cyan: 'font-bold text-cyan',
}

const BEST_BG_STYLE = {
  accent: { backgroundColor: 'rgba(76, 175, 80, 0.2)' },
  amber: { backgroundColor: 'rgba(244, 162, 97, 0.2)' },
  cyan: { backgroundColor: 'rgba(0, 188, 212, 0.2)' },
}

export default function ComparisonTable({ scenarios }) {
  // scenarios: [{ key, name, colorKey, result }]
  const groupStarts = COMPARISON_ROWS.map((row, i) => i === 0 || row.group !== COMPARISON_ROWS[i - 1].group)

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
            <th className="sticky left-0 z-10 bg-card py-3 pl-4 pr-4">Metric</th>
            {scenarios.map((s) => (
              <th key={s.key} className="py-3 px-4">
                {s.name}
              </th>
            ))}
            <th className="py-3 px-4">Best</th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row, rowIndex) => {
            const values = scenarios.map((s) => (s.result ? row.get(s.result) : null))
            const numericValues = row.isText ? [] : values.filter((v) => typeof v === 'number' && Number.isFinite(v))
            const best = row.higherIsBetter === true && numericValues.length ? Math.max(...numericValues) : null
            const worst = row.higherIsBetter === true && numericValues.length > 1 ? Math.min(...numericValues) : null
            const bestLow = row.higherIsBetter === false && numericValues.length ? Math.min(...numericValues) : null
            const worstLow = row.higherIsBetter === false && numericValues.length > 1 ? Math.max(...numericValues) : null

            const bestIndex = values.findIndex(
              (v) => typeof v === 'number' && (v === best || v === bestLow) && (best !== null || bestLow !== null),
            )

            return (
              <Fragment key={row.label}>
                {groupStarts[rowIndex] && (
                  <tr className="bg-panel">
                    <td colSpan={scenarios.length + 2} className="py-2 pl-4 text-xs font-semibold uppercase tracking-wide text-muted">
                      {row.group}
                    </td>
                  </tr>
                )}
                <tr className="border-t border-border">
                  <td className="sticky left-0 z-10 bg-card py-2 pl-4 pr-4 text-text">{row.label}</td>
                  {values.map((v, i) => {
                    const isBest = i === bestIndex && v != null
                    const isWorst = v != null && ((v === worst && worst !== null) || (v === worstLow && worstLow !== null)) && numericValues.length > 1 && !isBest
                    const colorKey = scenarios[i].colorKey
                    return (
                      <td
                        key={scenarios[i].key}
                        className={`py-2 px-4 ${isBest ? BEST_TEXT_CLASSES[colorKey] : ''} ${isWorst ? 'bg-danger/10 text-danger' : ''}`}
                        style={isBest ? BEST_BG_STYLE[colorKey] : undefined}
                      >
                        {row.format(v)}
                      </td>
                    )
                  })}
                  <td className="py-2 px-4">
                    {bestIndex >= 0 && !row.isText ? (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${BADGE_CLASSES[scenarios[bestIndex].colorKey]}`}>
                        {scenarios[bestIndex].name}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
