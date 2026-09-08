import { formatDecimal, formatNGN, formatUSD } from '../../utils/format.js'
import { CARBON_MARKET } from '../../data/constants.js'

function pickBest(scenarios, getValue, wantMax = true) {
  let best = null
  scenarios.forEach((s) => {
    const value = getValue(s)
    if (value == null || !Number.isFinite(value)) return
    if (!best || (wantMax ? value > best.value : value < best.value)) {
      best = { scenario: s, value }
    }
  })
  return best
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="mt-1 text-sm text-muted">{children}</p>
    </div>
  )
}

export default function WinnerSummary({ scenarios }) {
  const bestEnergy = pickBest(scenarios, (s) => s.result.yield.ch4M3PerDay)
  const bestEmissions = pickBest(scenarios, (s) => s.result.emissions.avoidedTonnesPerYear)
  const bestRevenue = pickBest(scenarios, (s) => s.result.carbon.annualMidUsd)
  const bestOverall = pickBest(scenarios, (s) => s.result.combined.totalNgn)
  const bestCostEfficiency = pickBest(
    scenarios,
    (s) => (s.result.digester.costUsd * CARBON_MARKET.ngnPerUsd) / s.result.digester.recommendedVolumeM3,
    false,
  )

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bestEnergy && (
        <Card title="Best for Energy Yield">
          {bestEnergy.scenario.name} — {bestEnergy.scenario.result.substrate.name}{' '}
          {formatDecimal(bestEnergy.value, 2)} m³ CH₄/day
        </Card>
      )}
      {bestEmissions && (
        <Card title="Best for Emissions Reduction">
          {bestEmissions.scenario.name} — {formatDecimal(bestEmissions.value, 2)} t CO₂e/year avoided
        </Card>
      )}
      {bestRevenue && (
        <Card title="Best for Carbon Revenue">
          {bestRevenue.scenario.name} — {formatUSD(bestRevenue.value)}/year at mid price
        </Card>
      )}
      {bestOverall && (
        <Card title="Best Overall (combined value)">
          {bestOverall.scenario.name} — {formatNGN(bestOverall.value)}/year
        </Card>
      )}
      {bestCostEfficiency && (
        <Card title="Best Cost-Efficiency">
          {bestCostEfficiency.scenario.name} — {formatNGN(bestCostEfficiency.value)} per m³ digester volume
        </Card>
      )}
    </div>
  )
}
