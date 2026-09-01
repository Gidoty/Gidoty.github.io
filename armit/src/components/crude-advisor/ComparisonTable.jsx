import { formatNum0, formatNum1, formatUsd0, formatUsd2 } from '../../lib/format.js'

// direction: 'higher' = bigger number wins, 'lower' = smaller number wins, null = informational only
const ROWS = [
  { key: 'name', label: 'Crude Name', direction: null, get: (o) => o.crude.name, format: (v) => v },
  { key: 'api', label: 'API Gravity', direction: 'higher', get: (o) => o.crude.api, format: (v) => `${formatNum1(v)}°` },
  { key: 'sulphur', label: 'Sulphur (wt%)', direction: 'lower', get: (o) => o.crude.sulphur, format: (v) => `${v}%` },
  { key: 'deliveredCost', label: 'Delivered Cost (USD/bbl)', direction: 'lower', get: (o) => o.deliveredCost, format: formatUsd2 },
  { key: 'totalRevenue', label: 'Total Revenue (USD/day)', direction: 'higher', get: (o) => o.result.totalRevenue, format: formatUsd0 },
  { key: 'grossMargin', label: 'Gross Margin (USD/day)', direction: 'higher', get: (o) => o.result.grossMarginPerDay, format: formatUsd0 },
  { key: 'netMarginPerBbl', label: 'Net Margin per barrel (USD/bbl)', direction: 'higher', get: (o) => o.result.netMarginPerBbl, format: formatUsd2 },
  { key: 'lpg', label: 'LPG yield (bpd)', direction: 'higher', get: (o) => o.result.slate.lpg.bpd, format: formatNum0 },
  { key: 'motorSpirit', label: 'Motor Spirit yield (bpd)', direction: 'higher', get: (o) => o.result.slate.motorSpirit.bpd, format: formatNum0 },
  { key: 'kerosene', label: 'Kerosene yield (bpd)', direction: 'higher', get: (o) => o.result.slate.kerosene.bpd, format: formatNum0 },
  { key: 'diesel', label: 'Diesel/AGO yield (bpd)', direction: 'higher', get: (o) => o.result.slate.diesel.bpd, format: formatNum0 },
  { key: 'fuelOil', label: 'Fuel Oil yield (bpd)', direction: 'higher', get: (o) => o.result.slate.fuelOil.bpd, format: formatNum0 },
  { key: 'eii', label: 'EII-proxy index', direction: 'lower', get: (o) => o.result.eiiProxy, format: formatNum1 },
]

function cellClass(direction, valueA, valueB, isA) {
  if (direction === null || valueA === valueB) return ''
  const isBetter = direction === 'higher' ? (isA ? valueA > valueB : valueB > valueA) : (isA ? valueA < valueB : valueB < valueA)
  return isBetter ? 'bg-armit-emerald/15 text-armit-emerald' : 'bg-armit-coral/10 text-armit-coral'
}

export default function ComparisonTable({ optionA, optionB }) {
  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Side-by-Side Comparison</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-armit-muted">
              <th className="py-2 pr-4 font-medium">Metric</th>
              <th className="py-2 pr-4 font-medium text-armit-teal">Option A</th>
              <th className="py-2 pr-0 font-medium text-armit-amber">Option B</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const valueA = row.get(optionA)
              const valueB = row.get(optionB)
              return (
                <tr key={row.key} className="border-b border-white/5 last:border-0">
                  <td className="py-2.5 pr-4 text-armit-muted">{row.label}</td>
                  <td className={`px-2 py-2.5 font-medium ${cellClass(row.direction, valueA, valueB, true) || 'text-armit-text'}`}>
                    {row.format(valueA)}
                  </td>
                  <td className={`px-2 py-2.5 font-medium ${cellClass(row.direction, valueA, valueB, false) || 'text-armit-text'}`}>
                    {row.format(valueB)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
