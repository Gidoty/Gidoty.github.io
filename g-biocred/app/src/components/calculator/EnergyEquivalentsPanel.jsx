import { calcEnergyEquivalents } from '../../utils/energyEquivalents.js'
import { formatInt, formatDecimal } from '../../utils/format.js'

export default function EnergyEquivalentsPanel({ result }) {
  const { ledHours, lpgCylinders, petrolLitres } = calcEnergyEquivalents({
    electricalKwh: result.electricalKwh,
    thermalKwh: result.thermalKwh,
    totalKwh: result.totalKwh,
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-medium text-text">This is equivalent to:</p>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        <li>🔌 {formatInt(ledHours)} hours of a 50W LED bulb</li>
        <li>🍳 {formatDecimal(lpgCylinders, 1)} LPG cylinders (14.5 kg × 12.8 kWh/kg)</li>
        <li>⛽ {formatInt(petrolLitres)} litres of petrol equivalent (34.2 MJ/L = 9.5 kWh/L)</li>
      </ul>
    </div>
  )
}
