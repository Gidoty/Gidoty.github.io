import { CARBON_MARKET } from '../../data/constants.js'
import { calcPoaBreakeven } from '../../utils/calcEngine.js'
import { formatDecimal, formatNGN, formatUSD } from '../../utils/format.js'

export default function PoaResultsCard({ singleAnnualTonnes, cpaCount }) {
  const totalAnnual = singleAnnualTonnes * cpaCount
  const midPrice = CARBON_MARKET.vcmMid.usdPerTonne
  const annualRevenueUsd = totalAnnual * midPrice
  const annualRevenueNgn = annualRevenueUsd * CARBON_MARKET.ngnPerUsd
  const tenYearUsd = annualRevenueUsd * 10
  const breakevenN = calcPoaBreakeven(singleAnnualTonnes, midPrice)

  return (
    <div className="rounded-xl border border-accent/40 bg-card p-6">
      <p className="text-lg font-semibold text-text">PoA with {cpaCount} smallholder units</p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-muted">Total annual avoided</p>
          <p className="text-2xl font-bold text-accent">{formatDecimal(totalAnnual, 2)} t CO₂e/year</p>
        </div>
        <div>
          <p className="text-sm text-muted">Annual revenue at mid price</p>
          <p className="text-2xl font-bold text-amber">{formatUSD(annualRevenueUsd)}</p>
          <p className="text-sm text-muted">{formatNGN(annualRevenueNgn)}</p>
        </div>
      </div>

      <p className="mt-4 text-sm text-text">10-year cumulative (mid): {formatUSD(tenYearUsd)}</p>

      <div className="mt-4 rounded-lg border border-border bg-panel p-3 text-sm text-muted">
        <p>
          Transaction costs for PoA registration are shared across all CPAs, making each unit
          economically viable. Break-even at ~{breakevenN ? formatDecimal(breakevenN, 1) : '—'} units
          assuming $8,000 annual verification.
        </p>
        {breakevenN && (
          <p className="mt-1 text-text">
            You need at least {Math.ceil(breakevenN)} participating farms for PoA to be
            cost-effective.
          </p>
        )}
      </div>
    </div>
  )
}
