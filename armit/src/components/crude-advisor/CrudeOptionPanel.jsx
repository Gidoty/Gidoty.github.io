import CRUDES from '../../data/crudes.js'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'
import { formatUsd2 } from '../../lib/format.js'

const ACCENT = {
  teal: { border: 'border-armit-teal/40', text: 'text-armit-teal', chip: 'bg-armit-teal/10' },
  amber: { border: 'border-armit-amber/40', text: 'text-armit-amber', chip: 'bg-armit-amber/10' },
}

export default function CrudeOptionPanel({ label, accent, option, onChange }) {
  const tone = ACCENT[accent]
  const crude = CRUDES[option.crudeKey]
  const deliveredCost = option.fob + option.freight + option.port

  const update = (key, value) => onChange({ ...option, [key]: value })

  return (
    <section className={`rounded-xl border-2 bg-armit-card p-5 ${tone.border}`}>
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tone.chip} ${tone.text}`}
      >
        {label}
      </span>

      <div className="mt-4 space-y-4">
        <Field label="Crude Type">
          <select
            className={inputClass}
            value={option.crudeKey}
            onChange={(e) => update('crudeKey', e.target.value)}
          >
            {Object.entries(CRUDES).map(([key, c]) => (
              <option key={key} value={key}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <p className="-mt-2 text-[11px] text-armit-muted">
          API {crude.api}&deg; &middot; Sulphur {crude.sulphur}% &middot; SG {crude.sg}
        </p>

        <Field label="FOB Price (USD/bbl)">
          <input
            type="number"
            className={inputClass}
            min={0}
            step={0.01}
            value={option.fob}
            onChange={(e) => update('fob', Number(e.target.value))}
          />
        </Field>

        <Field label="Freight Cost (USD/bbl)">
          <input
            type="number"
            className={inputClass}
            min={0}
            step={0.01}
            value={option.freight}
            onChange={(e) => update('freight', Number(e.target.value))}
          />
        </Field>

        <Field label="Port / Handling Charges (USD/bbl)">
          <input
            type="number"
            className={inputClass}
            min={0}
            step={0.01}
            value={option.port}
            onChange={(e) => update('port', Number(e.target.value))}
          />
        </Field>
      </div>

      <div className={`mt-5 rounded-lg border ${tone.border} bg-armit-bg/60 p-4`}>
        <div className="text-xs font-medium uppercase tracking-wide text-armit-muted">
          Delivered Cost
        </div>
        <div className={`mt-1 text-2xl font-bold ${tone.text}`}>{formatUsd2(deliveredCost)}</div>
        <div className="text-[11px] text-armit-muted">USD/bbl &middot; FOB + freight + port</div>
      </div>
    </section>
  )
}
