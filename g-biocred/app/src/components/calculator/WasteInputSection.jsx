const UNITS = [
  { id: 'kg', label: 'kg' },
  { id: 'tonnes', label: 'tonnes' },
  { id: 'bags', label: 'bags (50 kg)' },
]

export default function WasteInputSection({
  mode,
  onModeChange,
  amount,
  onAmountChange,
  unit,
  onUnitChange,
  days,
  onDaysChange,
  totalKg,
  hasError,
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text">Step 2: Enter Your Waste Volume</h2>

      <div className="inline-flex rounded-lg border border-border bg-panel p-1">
        {['single', 'daily'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onModeChange(m)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m ? 'bg-accent text-white' : 'text-muted hover:text-text'
            }`}
          >
            {m === 'single' ? 'Single Batch' : 'Daily Input'}
          </button>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text" htmlFor="waste-weight">
          {mode === 'single' ? 'Fresh waste weight' : 'Fresh waste weight per day'}
        </label>
        <div className="flex gap-2">
          <input
            id="waste-weight"
            type="number"
            min="0"
            step="0.1"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            className={`w-full rounded-lg border bg-input px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent ${
              hasError ? 'border-danger' : 'border-border'
            }`}
          />
          <select
            value={unit}
            onChange={(e) => onUnitChange(e.target.value)}
            className="rounded-lg border border-border bg-input px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {UNITS.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
        {hasError && (
          <p className="mt-1 text-sm text-danger">
            Please enter a valid waste weight greater than zero.
          </p>
        )}
        <p className="mt-2 text-xs text-muted">
          Tip: For cow dung, one Zebu cattle produces approximately 15 kg/day. For poultry, one
          bird produces approximately 0.12 kg/day.
        </p>
      </div>

      {mode === 'daily' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-text" htmlFor="days-slider">
            Number of days: {days}
          </label>
          <input
            id="days-slider"
            type="range"
            min="1"
            max="365"
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <p className="mt-1 text-sm text-muted">
            Total: {totalKg.toLocaleString('en-NG', { maximumFractionDigits: 1 })} kg
          </p>
        </div>
      )}
    </div>
  )
}
