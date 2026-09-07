import { useMemo } from 'react'
import { fullYieldCalc } from '../../utils/calcEngine.js'
import { formatDecimal, formatKwh, formatM3 } from '../../utils/format.js'

export default function DailyGasOutput({ substrate, dailyWasteKg }) {
  const result = useMemo(() => {
    if (!substrate || dailyWasteKg <= 0) return null
    return fullYieldCalc({ substrate, freshWeightKg: dailyWasteKg })
  }, [substrate, dailyWasteKg])

  if (!result) return null

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">Daily Gas Output (linked from yield)</p>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted">Expected daily biogas</dt>
          <dd className="text-text">{formatDecimal(result.biogasM3, 1)} m³/day</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Expected daily CH₄</dt>
          <dd className="text-text">{formatDecimal(result.ch4M3, 1)} m³/day</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Expected daily electricity</dt>
          <dd className="text-text">{formatKwh(result.electricalKwh)}/day</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Expected daily cooking energy</dt>
          <dd className="text-text">{formatKwh(result.thermalKwh)}/day</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">
        Based on {formatM3(result.biogasM3)} biogas from {formatDecimal(dailyWasteKg, 1)} kg/day of{' '}
        {substrate.name.toLowerCase()}.
      </p>
    </div>
  )
}
