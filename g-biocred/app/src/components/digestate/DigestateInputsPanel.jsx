import { Link } from 'react-router-dom'
import SubstrateGrid from '../shared/SubstrateGrid.jsx'
import { DIGESTATE_RECOVERY_RATES } from '../../data/digestateEconomics.js'
import { formatDecimal, formatKg } from '../../utils/format.js'

export default function DigestateInputsPanel({
  usingStored,
  storedSubstrate,
  storedFreshWeightKg,
  onChangeInputs,
  manualSubstrateId,
  onSelectManualSubstrate,
  manualWeightKg,
  onManualWeightChange,
  hasError,
  recoveryMode,
  onRecoveryModeChange,
}) {
  const recovery = DIGESTATE_RECOVERY_RATES[recoveryMode]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-text">Substrate and Input Weight</h2>
        {usingStored ? (
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-text">
            <p>
              Using your calculation: {storedSubstrate.name} at {formatKg(storedFreshWeightKg)} fresh
              input
            </p>
            <p className="mt-1">
              Estimated digestate: {formatDecimal(storedFreshWeightKg * recovery.rate, 1)} kg
            </p>
            <button
              type="button"
              onClick={onChangeInputs}
              className="mt-2 rounded-md border border-accent px-3 py-1.5 text-xs font-semibold text-text hover:bg-accent/10"
            >
              Change inputs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
              No prior yield calculation found.{' '}
              <Link to="/calculator" className="text-accent hover:underline">
                Go to the Yield Calculator
              </Link>{' '}
              or enter a quick substrate and weight below.
            </div>
            <SubstrateGrid
              selectedId={manualSubstrateId}
              onSelect={(s) => onSelectManualSubstrate(s.id)}
              compact
            />
            <div>
              <label className="mb-1 block text-sm font-medium text-text" htmlFor="digestate-weight">
                Fresh waste input (kg)
              </label>
              <input
                id="digestate-weight"
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
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-text">Digestate Recovery Rate</h2>
        <div className="inline-flex rounded-lg border border-border bg-panel p-1">
          {Object.entries(DIGESTATE_RECOVERY_RATES).map(([key, mode]) => (
            <button
              key={key}
              type="button"
              onClick={() => onRecoveryModeChange(key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                recoveryMode === key ? 'bg-accent text-white' : 'text-muted hover:text-text'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">{recovery.note}</p>
      </section>
    </div>
  )
}
