import { Star, Recycle, Factory, Globe } from 'lucide-react'
import { METHODOLOGY_LIST } from '../../data/methodologies.js'

const ICONS = { Star, Recycle, Factory, Globe }

export default function MethodologyCards({ selectedId, onSelect, recommendedIds }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {METHODOLOGY_LIST.map((m) => {
        const Icon = ICONS[m.icon]
        const active = m.id === selectedId
        const recommended = recommendedIds.includes(m.id)
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onSelect(m.id)}
            className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
              active ? 'border-accent bg-accent/15' : 'border-border bg-card hover:border-accent/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <Icon className={`h-6 w-6 ${active ? 'text-accent' : 'text-amber'}`} />
              <div className="flex flex-col items-end gap-1">
                {recommended && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
                    RECOMMENDED FOR YOUR SCALE
                  </span>
                )}
                <span className="rounded-full bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {m.statusBadge}
                </span>
              </div>
            </div>
            <p className="mt-2 font-semibold text-text">{m.label}</p>
            <p className="mt-1 text-xs text-muted">Scale: {m.scale}</p>
            <p className="mt-2 text-xs text-muted">
              <span className="font-semibold text-text">Best for: </span>
              {m.bestFor}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-muted">
              {m.keyRequirements.map((req) => (
                <li key={req}>• {req}</li>
              ))}
            </ul>
            {m.nigerianNote && <p className="mt-2 text-xs text-cyan">{m.nigerianNote}</p>}
            {m.precedent && <p className="mt-2 text-xs text-cyan">{m.precedent}</p>}
            <p className="mt-2 text-[11px] text-muted">Source: {m.source}</p>
            <p className="mt-1 text-xs font-medium text-amber">{m.pricePremium}</p>
          </button>
        )
      })}
    </div>
  )
}
