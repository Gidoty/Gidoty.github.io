import { formatDecimal, formatKg } from '../../utils/format.js'
import { ENERGY } from '../../data/constants.js'

function Card({ value, label, subtext, color }) {
  const colorClass = color === 'amber' ? 'text-amber' : 'text-accent'
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className={`text-2xl font-bold sm:text-3xl ${colorClass}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-text">{label}</p>
      <p className="mt-1 text-xs text-muted">{subtext}</p>
    </div>
  )
}

export default function MetricCards({ result }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card
        value={`${formatDecimal(result.biogasM3, 1)} m³`}
        label="biogas produced"
        subtext={`at ${(result.ch4Content * 100).toFixed(0)}% methane content`}
        color="green"
      />
      <Card
        value={`${formatDecimal(result.ch4M3, 1)} m³ CH₄`}
        label="methane recovered"
        subtext={`equivalent to ${formatKg(result.ch4Kg)}`}
        color="green"
      />
      <Card
        value={`${formatDecimal(result.electricalKwh, 1)} kWh`}
        label="electricity potential"
        subtext={`at ${(ENERGY.ELECTRICAL_EFFICIENCY * 100).toFixed(0)}% generator efficiency`}
        color="amber"
      />
      <Card
        value={`${formatDecimal(result.thermalKwh, 1)} kWh`}
        label="cooking/heating energy"
        subtext={`at ${(ENERGY.THERMAL_EFFICIENCY * 100).toFixed(0)}% thermal efficiency`}
        color="amber"
      />
    </div>
  )
}
