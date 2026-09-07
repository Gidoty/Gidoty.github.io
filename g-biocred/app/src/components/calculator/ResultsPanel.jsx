import { Link } from 'react-router-dom'
import CalculationPipeline from './CalculationPipeline.jsx'
import MetricCards from './MetricCards.jsx'
import EnergyEquivalentsPanel from './EnergyEquivalentsPanel.jsx'
import EnergyChart from './EnergyChart.jsx'
import ComparisonTable from './ComparisonTable.jsx'
import AuditSnapshot from './AuditSnapshot.jsx'

export default function ResultsPanel({
  substrate,
  result,
  auditEntry,
  onSizeDigester,
  onAddToComparison,
}) {
  return (
    <div className="panel-enter space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text">Calculation Chain</h2>
        <CalculationPipeline substrate={substrate} result={result} />
      </div>

      <MetricCards result={result} />

      <EnergyEquivalentsPanel result={result} />

      <EnergyChart result={result} />

      <ComparisonTable freshWeightKg={result.freshWeightKg} selectedId={substrate.id} />

      <AuditSnapshot entry={auditEntry} />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          to="/emissions"
          className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
        >
          Calculate Emissions Avoided →
        </Link>
        <button
          type="button"
          onClick={onSizeDigester}
          className="rounded-lg border border-accent px-5 py-3 text-center text-sm font-semibold text-text hover:bg-accent/10"
        >
          Size My Digester →
        </button>
        <button
          type="button"
          onClick={onAddToComparison}
          className="rounded-lg border border-border px-5 py-3 text-center text-sm font-semibold text-text hover:bg-card"
        >
          Add to Comparison →
        </button>
      </div>
    </div>
  )
}
