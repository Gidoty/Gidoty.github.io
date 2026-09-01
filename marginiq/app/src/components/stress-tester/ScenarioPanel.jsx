import { RotateCcw } from 'lucide-react'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'

const PRICE_FIELDS = [
  { key: 'lpg', label: 'LPG Price' },
  { key: 'motorSpirit', label: 'Motor Spirit Price' },
  { key: 'kerosene', label: 'Kerosene Price' },
  { key: 'diesel', label: 'Diesel / AGO Price' },
  { key: 'fuelOil', label: 'Fuel Oil Price' },
  { key: 'lcoClo', label: 'LCO / CLO Price' },
]

const ACCENT = {
  teal: { border: 'border-armit-teal/40', text: 'text-armit-teal', chip: 'bg-armit-teal/10' },
  coral: { border: 'border-armit-coral/40', text: 'text-armit-coral', chip: 'bg-armit-coral/10' },
  emerald: { border: 'border-armit-emerald/40', text: 'text-armit-emerald', chip: 'bg-armit-emerald/10' },
}

export default function ScenarioPanel({ label, badge, accent, scenario, onChange, onReset }) {
  const tone = ACCENT[accent]
  const update = (key, value) => onChange({ ...scenario, [key]: value })
  const updatePrice = (key, value) => onChange({ ...scenario, prices: { ...scenario.prices, [key]: value } })

  return (
    <section className={`rounded-xl border-2 bg-armit-card p-5 ${tone.border}`}>
      <div className="flex items-center justify-between">
        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tone.chip} ${tone.text}`}>
          {badge}
        </span>
        <span className="text-xs font-medium text-armit-muted">{label}</span>
      </div>

      <div className="mt-4 space-y-4">
        <Field label="Crude Cost (USD/bbl)">
          <input
            type="number"
            className={inputClass}
            min={0}
            step={0.01}
            value={scenario.crudeCost}
            onChange={(e) => update('crudeCost', Number(e.target.value))}
          />
        </Field>
        {PRICE_FIELDS.map((field) => (
          <Field key={field.key} label={field.label}>
            <input
              type="number"
              className={inputClass}
              min={0}
              step={0.01}
              value={scenario.prices[field.key]}
              onChange={(e) => updatePrice(field.key, Number(e.target.value))}
            />
          </Field>
        ))}
        <Field label="Carbon Cost (USD/tonne CO2)">
          <input
            type="number"
            className={inputClass}
            min={0}
            step={1}
            value={scenario.carbonPrice}
            onChange={(e) => update('carbonPrice', Number(e.target.value))}
          />
        </Field>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-armit-bg/60 px-3 py-2 text-xs font-medium text-armit-muted transition hover:border-white/20 hover:text-armit-text"
      >
        <RotateCcw size={13} />
        Reset to Default {badge.charAt(0) + badge.slice(1).toLowerCase()}
      </button>
    </section>
  )
}
