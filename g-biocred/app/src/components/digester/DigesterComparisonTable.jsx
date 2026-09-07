import { DIGESTER_TYPES } from '../../data/constants.js'
import { calcDigesterVolume } from '../../utils/calcEngine.js'
import { formatM3, formatNGN, formatUSD } from '../../utils/format.js'
import { CARBON_MARKET } from '../../data/constants.js'

export default function DigesterComparisonTable({ dailySlurryLitres, hrtDays, selectedType }) {
  const rows = Object.entries(DIGESTER_TYPES).map(([key, type]) => {
    const volumes = calcDigesterVolume({
      dailySlurryLitres,
      hrtDays,
      safetyFactor: type.safetyFactor,
    })
    const costUsd = volumes.totalM3 * type.cost_usd_per_m3
    return { key, type, volumes, costUsd }
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">Digester Type Comparison</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Volume</th>
              <th className="py-2 pr-4">Cost USD</th>
              <th className="py-2 pr-4">Cost NGN</th>
              <th className="py-2 pr-4">Safety Factor</th>
              <th className="py-2">Best For</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.key}
                className={`border-t border-border align-top ${
                  row.key === selectedType ? 'bg-accent/10' : ''
                }`}
              >
                <td className="py-2 pr-4 text-text">{row.type.label}</td>
                <td className="py-2 pr-4 text-text">{formatM3(row.volumes.totalM3)}</td>
                <td className="py-2 pr-4 text-muted">{formatUSD(row.costUsd)}</td>
                <td className="py-2 pr-4 text-muted">{formatNGN(row.costUsd * CARBON_MARKET.ngnPerUsd)}</td>
                <td className="py-2 pr-4 text-muted">{row.type.safetyFactor.toFixed(2)}</td>
                <td className="py-2 text-muted">{row.type.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
