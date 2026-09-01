import { formatNum1, formatUsd0, formatUsd2 } from '../../lib/format.js'

const ROWS = [
  { label: 'Crude Cost (USD/bbl)', direction: 'lower', get: (m) => m.result.crudeCostPerDay / m.throughputBpd, format: formatUsd2 },
  { label: 'Total Revenue (USD/day)', direction: 'higher', get: (m) => m.result.totalRevenue, format: formatUsd0 },
  { label: 'Gross Margin (USD/day)', direction: 'higher', get: (m) => m.result.grossMarginPerDay, format: formatUsd0 },
  { label: 'Carbon Cost (USD/day)', direction: 'lower', get: (m) => m.carbonCostPerDay, format: formatUsd0 },
  { label: 'Carbon-Adjusted Margin (USD/day)', direction: 'higher', get: (m) => m.carbonAdjustedMarginPerDay, format: formatUsd0 },
  { label: 'Net Margin (USD/bbl)', direction: 'higher', get: (m) => m.result.netMarginPerBbl, format: formatUsd2 },
  { label: 'Carbon-Adjusted (USD/bbl)', direction: 'higher', get: (m) => m.carbonAdjustedPerBbl, format: formatUsd2 },
  { label: 'CO2 Intensity (kg/bbl)', direction: 'lower', get: (m) => m.co2PerBblKg, format: (v) => formatNum1(v) },
  { label: '3-2-1 Crack Spread (USD/bbl)', direction: 'higher', get: (m) => m.result.crack321, format: formatUsd2 },
]

function cellClass(direction, values, index) {
  if (direction === null) return ''
  const distinct = new Set(values.map((v) => Math.round(v * 1000)))
  if (distinct.size === 1) return ''
  const best = direction === 'higher' ? Math.max(...values) : Math.min(...values)
  const worst = direction === 'higher' ? Math.min(...values) : Math.max(...values)
  if (values[index] === best) return 'bg-armit-emerald/15 text-armit-emerald'
  if (values[index] === worst) return 'bg-armit-coral/10 text-armit-coral'
  return ''
}

export default function ScenarioComparisonTable({ scenarios }) {
  // scenarios: [{ badge, metrics }] in BASE, BEAR, BULL order
  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Scenario Comparison</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-armit-muted">
              <th className="py-2 pr-4 font-medium">Metric</th>
              {scenarios.map((s) => (
                <th key={s.badge} className="py-2 pr-4 font-medium">
                  {s.badge}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const values = scenarios.map((s) => row.get(s.metrics))
              return (
                <tr key={row.label} className="border-b border-white/5 last:border-0">
                  <td className="py-2.5 pr-4 text-armit-muted">{row.label}</td>
                  {scenarios.map((s, i) => (
                    <td
                      key={s.badge}
                      className={`px-2 py-2.5 font-medium ${cellClass(row.direction, values, i) || 'text-armit-text'}`}
                    >
                      {row.format(values[i])}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
