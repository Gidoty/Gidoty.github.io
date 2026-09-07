import { formatDecimal, formatInt } from '../../utils/format.js'
import { calcEmissionsContext } from '../../utils/calcEngine.js'

function Card({ value, label, subtext, colorClass }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className={`text-2xl font-bold sm:text-3xl ${colorClass}`}>{value}</p>
      <p className="mt-1 text-sm font-medium text-text">{label}</p>
      <p className="mt-1 text-xs text-muted">{subtext}</p>
    </div>
  )
}

export default function EmissionsMetrics({ baseline, project, avoidedTonnes, reductionPct }) {
  const context = calcEmissionsContext(avoidedTonnes)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card
          value={baseline ? `${formatDecimal(baseline.tonnesCO2e, 2)} t` : '—'}
          label="Baseline Emissions"
          subtext="Without your biogas project"
          colorClass="text-danger"
        />
        <Card
          value={`${formatDecimal(project.tonnesCO2e, 2)} t`}
          label="Project Emissions"
          subtext="Digester fugitive leakage"
          colorClass="text-amber"
        />
        <Card
          value={avoidedTonnes !== null ? `${formatDecimal(avoidedTonnes, 2)} t` : '—'}
          label="Net Emissions Avoided"
          subtext="CO₂e prevented from atmosphere"
          colorClass="text-accent"
        />
        <Card
          value={reductionPct !== null ? `${formatDecimal(reductionPct, 1)}%` : '—'}
          label="Emissions Reduction Rate"
          subtext="Reduction vs. baseline"
          colorClass="text-cyan"
        />
      </div>

      {context && (
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-medium text-text">These avoided emissions are equivalent to:</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>🚗 {formatInt(context.carDays)} car-days driven (2.3 t CO₂/car/year = 0.0063 t/day)</li>
            <li>🌳 {formatInt(context.treeYears)} trees absorbing for 1 year (~20 kg CO₂/tree/year)</li>
            <li>🏭 {formatDecimal(context.coalPlantHours, 1)} hours of a 100 kW coal power plant avoided (4.7 kg CO₂/kWh)</li>
          </ul>
          <p className="mt-2 text-xs italic text-muted">Source: IEA 2023 reference values</p>
        </div>
      )}
    </div>
  )
}
