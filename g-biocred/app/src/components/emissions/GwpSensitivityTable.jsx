import { useMemo } from 'react'
import { GWP_OPTIONS } from '../../data/constants.js'
import { calcEmissionsAvoided } from '../../utils/calcEngine.js'
import { formatDecimal } from '../../utils/format.js'

export default function GwpSensitivityTable({ substrate, vsKg, ch4ProducedM3, mcf, leakageFactor, baseGwpKey }) {
  const rows = useMemo(() => {
    return Object.entries(GWP_OPTIONS).map(([key, option]) => {
      const result = calcEmissionsAvoided({
        substrate,
        vsKg,
        ch4ProducedM3,
        mcf,
        gwp100: option.gwp100,
        leakageFactor,
      })
      return { key, option, avoidedTonnes: result.avoidedTonnes }
    })
  }, [substrate, vsKg, ch4ProducedM3, mcf, leakageFactor])

  const baseline = rows.find((r) => r.key === baseGwpKey)?.avoidedTonnes

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">
        GWP Sensitivity Analysis — how registry choice affects your result
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">GWP Option</th>
              <th className="py-2 pr-4">GWP₁₀₀</th>
              <th className="py-2 pr-4">Avoided CO₂e</th>
              <th className="py-2">Δ vs {GWP_OPTIONS[baseGwpKey].label}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const delta =
                row.avoidedTonnes !== null && baseline
                  ? ((row.avoidedTonnes - baseline) / baseline) * 100
                  : null
              return (
                <tr
                  key={row.key}
                  className={`border-t border-border ${row.key === baseGwpKey ? 'bg-accent/10' : ''}`}
                >
                  <td className="py-2 pr-4 text-text">{row.option.label}</td>
                  <td className="py-2 pr-4 text-muted">{row.option.gwp100.toFixed(1)}</td>
                  <td className="py-2 pr-4 text-text">
                    {row.avoidedTonnes !== null ? `${formatDecimal(row.avoidedTonnes, 2)} t` : '—'}
                  </td>
                  <td className="py-2 text-muted">
                    {row.key === baseGwpKey
                      ? 'baseline'
                      : delta !== null
                        ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`
                        : '—'}
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
