import { ELECTRICITY_PRICE_NGN_PER_KWH } from '../../data/digestateEconomics.js'
import { CARBON_MARKET } from '../../data/constants.js'
import { formatDecimal, formatNGN, formatUSD } from '../../utils/format.js'

export default function CombinedEconomicsSummary({ freshWeightKg, electricalKwh, annualCarbonTonnes, digestateValueNgn }) {
  const energyValueNgn = electricalKwh * ELECTRICITY_PRICE_NGN_PER_KWH.value
  const annualCarbonUsd = annualCarbonTonnes * CARBON_MARKET.vcmMid.usdPerTonne
  const carbonValueNgn = annualCarbonUsd * CARBON_MARKET.ngnPerUsd
  const combinedNgn = energyValueNgn + carbonValueNgn + digestateValueNgn

  return (
    <div className="rounded-xl border border-amber/40 bg-card p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        Total Project Value (per {formatDecimal(freshWeightKg, 0)} kg input)
      </p>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-text">
            Biogas energy value: {formatDecimal(electricalKwh, 1)} kWh × {formatNGN(ELECTRICITY_PRICE_NGN_PER_KWH.value)}/kWh = {formatNGN(energyValueNgn)}
          </p>
          <p className="text-xs text-muted">{ELECTRICITY_PRICE_NGN_PER_KWH.source}</p>
        </div>
        <p className="text-text">
          Annual carbon credit value (mid): {formatUSD(annualCarbonUsd)} × {CARBON_MARKET.ngnPerUsd} = {formatNGN(carbonValueNgn)}
        </p>
        <p className="text-text">Digestate fertiliser value: {formatNGN(digestateValueNgn)}</p>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-2xl font-bold text-amber">Combined annual value: {formatNGN(combinedNgn)}</p>
        <p className="text-sm text-muted">= {formatUSD(combinedNgn / CARBON_MARKET.ngnPerUsd)}</p>
      </div>

      <p className="mt-3 text-xs text-muted">
        Energy value assumes self-consumption or grid sale. Carbon credit assumes annual
        generation at daily input rate. All figures are indicative planning estimates.
      </p>
    </div>
  )
}
