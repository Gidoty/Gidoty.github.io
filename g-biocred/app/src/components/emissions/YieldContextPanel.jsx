import { Link } from 'react-router-dom'
import SubstrateGrid from '../shared/SubstrateGrid.jsx'
import { formatKg, formatM3 } from '../../utils/format.js'

export default function YieldContextPanel({
  usingStored,
  storedSubstrate,
  storedYield,
  onRecalculate,
  manualSubstrateId,
  onSelectManualSubstrate,
  manualWeightKg,
  onManualWeightChange,
  hasError,
}) {
  if (usingStored) {
    return (
      <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-text">
        <p>
          Using your yield calculation: Substrate: {storedSubstrate.name} | Input:{' '}
          {formatKg(storedYield.freshWeightKg)} fresh weight | VS: {formatKg(storedYield.results.vsKg)}{' '}
          | CH₄: {formatM3(storedYield.results.ch4M3)}
        </p>
        <button
          type="button"
          onClick={onRecalculate}
          className="mt-2 rounded-md border border-accent px-3 py-1.5 text-xs font-semibold text-text hover:bg-accent/10"
        >
          Recalculate from scratch
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
        No prior yield calculation found.{' '}
        <Link to="/calculator" className="text-accent hover:underline">
          Go to Yield Calculator first
        </Link>{' '}
        — recommended for the full calculation chain. Or enter a quick substrate and weight below.
      </div>
      <SubstrateGrid selectedId={manualSubstrateId} onSelect={(s) => onSelectManualSubstrate(s.id)} compact />
      <div>
        <label className="mb-1 block text-sm font-medium text-text" htmlFor="manual-weight">
          Fresh waste weight (kg)
        </label>
        <input
          id="manual-weight"
          type="number"
          min="0"
          value={manualWeightKg}
          onChange={(e) => onManualWeightChange(e.target.value)}
          className={`w-full rounded-lg border bg-input px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent ${
            hasError ? 'border-danger' : 'border-border'
          }`}
        />
        {hasError && (
          <p className="mt-1 text-sm text-danger">
            Please enter a valid waste weight greater than zero.
          </p>
        )}
      </div>
    </div>
  )
}
