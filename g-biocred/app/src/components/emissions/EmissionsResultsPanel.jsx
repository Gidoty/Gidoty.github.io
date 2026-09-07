import { Link } from 'react-router-dom'
import EmissionsChain from './EmissionsChain.jsx'
import EmissionsMetrics from './EmissionsMetrics.jsx'
import AnnualProjection from './AnnualProjection.jsx'
import EmissionsChart from './EmissionsChart.jsx'
import GwpSensitivityTable from './GwpSensitivityTable.jsx'
import AuditSnapshot from '../calculator/AuditSnapshot.jsx'

export default function EmissionsResultsPanel({
  substrate,
  tsKg,
  vsKg,
  ch4ProducedM3,
  scenario,
  gwpOption,
  gwpKey,
  leakageFactor,
  result,
  annualTonnes,
  classification,
  auditEntry,
  onAddToComparison,
}) {
  return (
    <div className="panel-enter space-y-8">
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text">Methodology Chain</h2>
        <EmissionsChain
          substrate={substrate}
          tsKg={tsKg}
          vsKg={vsKg}
          ch4ProducedM3={ch4ProducedM3}
          scenario={scenario}
          gwpOption={gwpOption}
          leakageFactor={leakageFactor}
          result={result}
        />
      </div>

      <EmissionsMetrics
        baseline={result.baseline}
        project={result.project}
        avoidedTonnes={result.avoidedTonnes}
        reductionPct={result.reductionPct}
      />

      <AnnualProjection annualTonnes={annualTonnes} classification={classification} />

      <EmissionsChart project={result.project} avoidedTonnes={result.avoidedTonnes} />

      <GwpSensitivityTable
        substrate={substrate}
        vsKg={vsKg}
        ch4ProducedM3={ch4ProducedM3}
        mcf={scenario.value}
        leakageFactor={leakageFactor}
        baseGwpKey={gwpKey}
      />

      <AuditSnapshot entry={auditEntry} />

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Link
          to="/carbon"
          className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
        >
          Calculate Carbon Credit Value →
        </Link>
        <Link
          to="/calculator"
          className="rounded-lg border border-accent px-5 py-3 text-center text-sm font-semibold text-text hover:bg-accent/10"
        >
          Back to Yield Calculator →
        </Link>
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
