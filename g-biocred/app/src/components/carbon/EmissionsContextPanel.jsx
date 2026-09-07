import { Link } from 'react-router-dom'
import { formatDecimal } from '../../utils/format.js'

export default function EmissionsContextPanel({ usingStored, storedSubstrate, storedResult, onRecalculate }) {
  if (usingStored) {
    return (
      <div className="rounded-lg border border-cyan/40 bg-cyan/10 p-4 text-sm text-text">
        <p>
          Based on your emissions calculation: {formatDecimal(storedResult.avoidedTonnes, 2)} tonnes
          CO₂e avoided ({storedSubstrate.name} at {formatDecimal(storedResult.freshWeightKg, 1)} kg)
        </p>
        {storedResult.annualTonnes !== null && (
          <p className="mt-1">
            Annual projection (330 days): {formatDecimal(storedResult.annualTonnes, 2)} tonnes CO₂e/year
          </p>
        )}
        <button
          type="button"
          onClick={onRecalculate}
          className="mt-2 rounded-md border border-cyan px-3 py-1.5 text-xs font-semibold text-text hover:bg-cyan/10"
        >
          Recalculate
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
      No prior emissions calculation found.{' '}
      <Link to="/emissions" className="text-accent hover:underline">
        Go to the Emissions-Avoided Estimator first
      </Link>{' '}
      to project carbon credit value from a real result, or enter a quick figure below.
    </div>
  )
}
