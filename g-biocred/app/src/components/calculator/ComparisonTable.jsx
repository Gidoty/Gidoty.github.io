import { useMemo } from 'react'
import { SUBSTRATE_LIST } from '../../data/substrates.js'
import { fullYieldCalc } from '../../utils/calcEngine.js'
import { formatDecimal } from '../../utils/format.js'

export default function ComparisonTable({ freshWeightKg, selectedId }) {
  const rows = useMemo(() => {
    const computed = SUBSTRATE_LIST.map((substrate) => {
      const result = fullYieldCalc({ substrate, freshWeightKg })
      return { substrate, biogasM3: result.biogasM3 }
    })
    computed.sort((a, b) => b.biogasM3 - a.biogasM3)
    return computed.map((row, index) => ({ ...row, rank: index + 1 }))
  }, [freshWeightKg])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">
        How does your substrate compare? (same input weight)
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Substrate</th>
              <th className="py-2 pr-4">SBY</th>
              <th className="py-2 pr-4">CH₄%</th>
              <th className="py-2 pr-4">Biogas yield*</th>
              <th className="py-2">Rank</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.substrate.id}
                className={`border-t border-border ${
                  row.substrate.id === selectedId ? 'bg-accent/10' : ''
                }`}
              >
                <td className="py-2 pr-4 text-text">
                  {row.substrate.icon} {row.substrate.name}
                </td>
                <td className="py-2 pr-4 text-muted">
                  {row.substrate.specificBiogasYield.toFixed(2)} m³/kg VS
                </td>
                <td className="py-2 pr-4 text-muted">
                  {(row.substrate.ch4Content * 100).toFixed(0)}%
                </td>
                <td className="py-2 pr-4 text-text">{formatDecimal(row.biogasM3, 1)} m³</td>
                <td className="py-2 text-muted">#{row.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted">*Biogas yield for same input weight</p>
    </div>
  )
}
