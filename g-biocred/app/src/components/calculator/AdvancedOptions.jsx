import CollapsibleSection from '../shared/CollapsibleSection.jsx'

const CONDITIONS = [
  { id: 'fresh', label: 'Fresh' },
  { id: 'aged', label: 'Aged (>3 days)' },
  { id: 'pretreated', label: 'Pre-treated' },
]

const TEMPERATURES = [
  { id: 'ambient', label: 'Ambient <30°C' },
  { id: 'mesophilic', label: 'Mesophilic 30-38°C' },
  { id: 'above38', label: 'Above 38°C' },
]

export default function AdvancedOptions({
  useDefaultMoisture,
  onUseDefaultMoistureChange,
  moisturePct,
  onMoisturePctChange,
  condition,
  onConditionChange,
  temperature,
  onTemperatureChange,
}) {
  return (
    <CollapsibleSection title="Advanced Options">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text">Moisture content override</span>
            <button
              type="button"
              role="switch"
              aria-checked={useDefaultMoisture}
              onClick={() => onUseDefaultMoistureChange(!useDefaultMoisture)}
              className={`h-6 w-11 rounded-full transition-colors ${
                useDefaultMoisture ? 'bg-accent' : 'bg-border'
              }`}
            >
              <span
                className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform ${
                  useDefaultMoisture ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted">
            {useDefaultMoisture ? 'Using substrate default moisture content.' : 'Custom moisture content:'}
          </p>
          {!useDefaultMoisture && (
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="95"
                value={moisturePct}
                onChange={(e) => onMoisturePctChange(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <p className="text-sm text-text">{moisturePct}% moisture</p>
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-text">Substrate condition</p>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onConditionChange(c.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  condition === c.id
                    ? 'border-accent bg-accent/15 text-text'
                    : 'border-border text-muted hover:text-text'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Aged or degraded feedstock reduces yield by ~15-20%.
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-text">Operating temperature</p>
          <div className="flex flex-wrap gap-2">
            {TEMPERATURES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onTemperatureChange(t.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  temperature === t.id
                    ? 'border-accent bg-accent/15 text-text'
                    : 'border-border text-muted hover:text-text'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Per Owhonda MSc (2024): peak CH₄ production at 35°C for Nigerian cow dung. Above 38°C,
            yield decreases.
          </p>
        </div>
      </div>
    </CollapsibleSection>
  )
}
