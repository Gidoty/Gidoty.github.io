import { Cylinder, Drum, Container } from 'lucide-react'
import { DIGESTER_TYPES } from '../../data/constants.js'
import { formatUSD } from '../../utils/format.js'

const ICONS = {
  fixedDome: Cylinder,
  floatingDrum: Drum,
  tubularBag: Container,
}

export default function DigesterTypeCards({ selectedType, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Object.entries(DIGESTER_TYPES).map(([key, type]) => {
        const Icon = ICONS[key]
        const active = key === selectedType
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
              active ? 'border-accent bg-accent/15' : 'border-border bg-card hover:border-accent/60'
            }`}
          >
            <Icon
              className={`h-8 w-8 ${key === 'tubularBag' ? '-rotate-90' : ''} ${active ? 'text-accent' : 'text-muted'}`}
            />
            <p className="mt-2 font-semibold text-text">{type.label}</p>
            <dl className="mt-2 space-y-1 text-xs text-muted">
              <div className="flex justify-between">
                <dt>Safety factor</dt>
                <dd className="text-text">{type.safetyFactor.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Cost</dt>
                <dd className="text-text">~{formatUSD(type.cost_usd_per_m3)}/m³</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted">{type.description}</p>
          </button>
        )
      })}
    </div>
  )
}
