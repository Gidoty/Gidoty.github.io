import { CARBON_MARKET } from '../../data/constants.js'
import { calcCreditRevenue } from '../../utils/calcEngine.js'
import { formatDecimal, formatNGN, formatUSD } from '../../utils/format.js'

const SCENARIO_KEYS = ['vcmConservative', 'vcmMid', 'vcmPremium']

export default function CreditProjectionCards({ annualTonnes, selectedKey }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {SCENARIO_KEYS.map((key) => {
        const scenario = CARBON_MARKET[key]
        const revenue = calcCreditRevenue({
          annualTonnes,
          usdPerTonne: scenario.usdPerTonne,
          ngnPerUsd: CARBON_MARKET.ngnPerUsd,
        })
        const active = key === selectedKey
        return (
          <div
            key={key}
            className={`rounded-xl border p-5 ${active ? 'border-accent bg-accent/10' : 'border-border bg-card'}`}
          >
            <p className="font-semibold text-text">{scenario.label}</p>
            <p className="text-sm text-muted">{formatUSD(scenario.usdPerTonne)}/tonne</p>

            <div className="mt-3 space-y-1 text-sm">
              <p className="text-text">Annual credit volume: {formatDecimal(annualTonnes, 2)} t</p>
              <p className="text-accent">
                Annual revenue: {formatUSD(revenue.annualUsd)} = {formatNGN(revenue.annualNgn)}
              </p>
            </div>

            <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted">
              <p>5-year revenue: {formatUSD(revenue.year5Usd)}</p>
              <p>10-year revenue: {formatUSD(revenue.year10Usd)}</p>
              <p>20-year revenue: {formatUSD(revenue.year20Usd)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
