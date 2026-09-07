import { CARBON_MARKET, GWP_OPTIONS } from '../../data/constants.js'
import { calcCreditRevenue, calcNPV } from '../../utils/calcEngine.js'
import { formatDecimal, formatUSD } from '../../utils/format.js'

const PRICE_KEYS = ['vcmConservative', 'vcmMid', 'vcmPremium']

export default function NpvAndGwpTables({ annualTonnes, avoidedTonnesByGwp, baseGwpKey }) {
  const baseMidRevenue = avoidedTonnesByGwp[baseGwpKey] * CARBON_MARKET.vcmMid.usdPerTonne

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="mb-3 font-medium text-text">Net Present Value at 10% Discount Rate</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">Scenario</th>
                <th className="py-2 pr-4">Annual</th>
                <th className="py-2">NPV (10yr, 10%)</th>
              </tr>
            </thead>
            <tbody>
              {PRICE_KEYS.map((key) => {
                const scenario = CARBON_MARKET[key]
                const revenue = calcCreditRevenue({ annualTonnes, usdPerTonne: scenario.usdPerTonne })
                const npv = calcNPV({ annualUsd: revenue.annualUsd })
                return (
                  <tr key={key} className="border-t border-border">
                    <td className="py-2 pr-4 text-text">{scenario.label}</td>
                    <td className="py-2 pr-4 text-muted">{formatUSD(revenue.annualUsd)}</td>
                    <td className="py-2 text-text">{formatUSD(npv)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="mb-3 font-medium text-text">GWP Impact on Credit Value</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-muted">
                <th className="py-2 pr-4">GWP</th>
                <th className="py-2 pr-4">CO₂e avoided</th>
                <th className="py-2 pr-4">Mid revenue/yr</th>
                <th className="py-2">Difference</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(GWP_OPTIONS).map(([key, option]) => {
                const tonnes = avoidedTonnesByGwp[key]
                const revenue = tonnes * CARBON_MARKET.vcmMid.usdPerTonne
                const diffPct = key === baseGwpKey ? null : ((revenue - baseMidRevenue) / baseMidRevenue) * 100
                return (
                  <tr key={key} className={`border-t border-border ${key === baseGwpKey ? 'bg-accent/10' : ''}`}>
                    <td className="py-2 pr-4 text-text">
                      {option.label} ({option.gwp100.toFixed(1)})
                    </td>
                    <td className="py-2 pr-4 text-muted">{formatDecimal(tonnes, 2)} t</td>
                    <td className="py-2 pr-4 text-text">{formatUSD(revenue)}</td>
                    <td className="py-2 text-muted">
                      {key === baseGwpKey ? '—' : `${diffPct > 0 ? '+' : ''}${diffPct.toFixed(1)}%`}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
