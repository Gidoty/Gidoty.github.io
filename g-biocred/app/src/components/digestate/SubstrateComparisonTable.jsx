import { useMemo } from 'react'
import { SUBSTRATE_LIST } from '../../data/substrates.js'
import { DIGESTATE_NPK } from '../../data/constants.js'
import { calcDigestateNPK, calcFertiliserValue } from '../../utils/calcEngine.js'
import { formatDecimal, formatInt } from '../../utils/format.js'

export default function SubstrateComparisonTable({ freshWeightKg, recoveryRate, prices, selectedId }) {
  const rows = useMemo(() => {
    const digestateKg = freshWeightKg * recoveryRate
    const computed = SUBSTRATE_LIST.map((substrate) => {
      const npk = calcDigestateNPK({ digestateKg, npkFractions: DIGESTATE_NPK[substrate.id] })
      const value = calcFertiliserValue({ ...npk, prices })
      return { substrate, npk, value }
    })
    computed.sort((a, b) => b.value.totalValue - a.value.totalValue)
    return computed
  }, [freshWeightKg, recoveryRate, prices])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">
        How does your substrate compare? (same {formatDecimal(freshWeightKg, 0)} kg input)
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Substrate</th>
              <th className="py-2 pr-4">N (kg)</th>
              <th className="py-2 pr-4">P (kg)</th>
              <th className="py-2 pr-4">K (kg)</th>
              <th className="py-2">Total Value (₦)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.substrate.id}
                className={`border-t border-border ${row.substrate.id === selectedId ? 'bg-accent/10' : ''}`}
              >
                <td className="py-2 pr-4 text-text">
                  {row.substrate.icon} {row.substrate.name}
                </td>
                <td className="py-2 pr-4 text-muted">{formatDecimal(row.npk.nKg, 1)}</td>
                <td className="py-2 pr-4 text-muted">{formatDecimal(row.npk.pKg, 1)}</td>
                <td className="py-2 pr-4 text-muted">{formatDecimal(row.npk.kKg, 1)}</td>
                <td className="py-2 text-text">₦{formatInt(row.value.totalValue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
