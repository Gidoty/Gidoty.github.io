import { X } from 'lucide-react'
import { SUBSTRATE_LIST } from '../../data/substrates.js'
import { GWP_OPTIONS, CARBON_MARKET, DIGESTER_TYPES } from '../../data/constants.js'
import { DISPOSAL_SCENARIOS } from '../../data/disposalScenarios.js'

const COLOR_CLASSES = {
  accent: 'border-accent text-accent',
  amber: 'border-amber text-amber',
  cyan: 'border-cyan text-cyan',
}

const CONDITIONS = [
  { id: 'fresh', label: 'Fresh' },
  { id: 'aged', label: 'Aged' },
  { id: 'pretreated', label: 'Pre-treated' },
]

const TEMPERATURES = [
  { id: 'ambient', label: 'Ambient <30°C' },
  { id: 'mesophilic', label: 'Mesophilic 30-38°C' },
  { id: 'above38', label: 'Above 38°C' },
]

const PRICE_KEYS = ['vcmConservative', 'vcmMid', 'vcmPremium']

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  )
}

const selectClass =
  'w-full rounded-lg border border-border bg-input px-2 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent'

export default function ScenarioColumn({ colorKey, inputs, onChange, onClear, onCalculate, isCalculated }) {
  const colorClass = COLOR_CLASSES[colorKey]

  return (
    <div className={`rounded-xl border-t-4 bg-card p-4 ${colorClass.split(' ')[0]}`}>
      <div className="mb-3 flex items-center justify-between">
        <input
          type="text"
          value={inputs.name}
          onChange={(e) => onChange('name', e.target.value)}
          className={`w-2/3 border-b border-transparent bg-transparent font-semibold ${colorClass.split(' ')[1]} focus:border-current focus:outline-none`}
        />
        <button type="button" onClick={onClear} className="rounded p-1 text-muted hover:text-danger" aria-label="Clear scenario">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Field label="Substrate">
          <select
            value={inputs.substrateId ?? ''}
            onChange={(e) => onChange('substrateId', e.target.value || null)}
            className={selectClass}
          >
            <option value="">Select substrate…</option>
            {SUBSTRATE_LIST.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Fresh waste input (kg/day)">
          <input
            type="number"
            min="0"
            value={inputs.dailyWasteKg}
            onChange={(e) => onChange('dailyWasteKg', e.target.value)}
            className="w-full rounded-lg border border-border bg-input px-2 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="mt-1 text-[11px] text-muted">kg per day</p>
        </Field>

        <Field label={`Operating days per year: ${inputs.operatingDays}`}>
          <input
            type="range"
            min="180"
            max="365"
            value={inputs.operatingDays}
            onChange={(e) => onChange('operatingDays', Number(e.target.value))}
            className="w-full accent-accent"
          />
        </Field>

        <Field label="Substrate condition">
          <select value={inputs.condition} onChange={(e) => onChange('condition', e.target.value)} className={selectClass}>
            {CONDITIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Operating temperature">
          <select value={inputs.temperature} onChange={(e) => onChange('temperature', e.target.value)} className={selectClass}>
            {TEMPERATURES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Baseline disposal">
          <select value={inputs.baselineKey} onChange={(e) => onChange('baselineKey', e.target.value)} className={selectClass}>
            {DISPOSAL_SCENARIOS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="GWP option">
          <select value={inputs.gwpKey} onChange={(e) => onChange('gwpKey', e.target.value)} className={selectClass}>
            {Object.entries(GWP_OPTIONS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Carbon price">
          <select
            value={inputs.carbonPriceKey}
            onChange={(e) => onChange('carbonPriceKey', e.target.value)}
            className={selectClass}
          >
            {PRICE_KEYS.map((key) => (
              <option key={key} value={key}>
                {CARBON_MARKET[key].label} (USD {CARBON_MARKET[key].usdPerTonne}/t)
              </option>
            ))}
          </select>
        </Field>

        <Field label="Digester type">
          <select
            value={inputs.digesterTypeKey}
            onChange={(e) => onChange('digesterTypeKey', e.target.value)}
            className={selectClass}
          >
            {Object.entries(DIGESTER_TYPES).map(([key, type]) => (
              <option key={key} value={key}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button
        type="button"
        onClick={onCalculate}
        disabled={!inputs.substrateId || Number(inputs.dailyWasteKg) <= 0}
        className="mt-4 w-full rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isCalculated ? 'Recalculate Scenario' : 'Calculate Scenario'}
      </button>
    </div>
  )
}
