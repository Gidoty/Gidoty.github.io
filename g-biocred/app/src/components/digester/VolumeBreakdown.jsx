import { formatDecimal, formatM3, formatNGN, formatUSD } from '../../utils/format.js'
import { CARBON_MARKET } from '../../data/constants.js'

export default function VolumeBreakdown({ slurry, volumes, digesterType, dailyWasteKg, hrtDays }) {
  const costUsd = volumes.totalM3 * digesterType.cost_usd_per_m3
  const costNgn = costUsd * CARBON_MARKET.ngnPerUsd

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="mb-3 font-medium text-text">Calculation Breakdown</p>
      <div className="space-y-1.5 font-mono text-sm text-muted">
        <p>Daily fresh waste: {formatDecimal(dailyWasteKg, 1)} kg/day</p>
        <p>Water addition: {formatDecimal(slurry.waterLitres, 1)} litres/day</p>
        <p>Total daily slurry: {formatDecimal(slurry.totalSlurryLitres, 1)} litres/day</p>
        <p>= {formatM3(volumes.dailySlurryM3)}/day</p>
        <p className="pt-2 text-text">HRT: {hrtDays} days</p>
        <p>
          Base volume = {formatM3(volumes.dailySlurryM3)}/day × {hrtDays} days ={' '}
          {formatM3(volumes.baseVolumeM3)}
        </p>
        <p>
          Safety factor ({digesterType.label}): × {digesterType.safetyFactor.toFixed(2)}
        </p>
        <p className="text-text">Digestion chamber = {formatM3(volumes.chamberM3)}</p>
        <p>Gas storage (30% of chamber): {formatM3(volumes.gasStorageM3)}</p>
        <p className="pt-2 text-text">Total plant volume: {formatM3(volumes.totalM3)}</p>
      </div>

      <div className="mt-4 border-t border-border pt-4 text-sm">
        <p className="text-text">
          Estimated construction cost: {formatM3(volumes.totalM3)} × {formatUSD(digesterType.cost_usd_per_m3)}/m³ = {formatUSD(costUsd)} ≈ {formatNGN(costNgn)}
        </p>
        <p className="mt-1 text-xs text-muted">
          Construction cost estimate only. Excludes piping, gas appliances, site preparation, and
          labour.
        </p>
      </div>
    </div>
  )
}
