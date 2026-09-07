import { SUBSTRATE_LIST } from '../../data/substrates.js'

export default function SubstrateGrid({ selectedId, onSelect, compact = false }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {SUBSTRATE_LIST.map((substrate) => {
        const active = substrate.id === selectedId
        return (
          <button
            key={substrate.id}
            type="button"
            onClick={() => onSelect(substrate)}
            className={`rounded-xl border p-3 text-left transition-all hover:-translate-y-0.5 ${
              active
                ? 'border-accent bg-accent/15'
                : 'border-border bg-card hover:border-accent/60'
            }`}
          >
            <span className="text-2xl">{substrate.icon}</span>
            <p className="mt-1 text-sm font-semibold text-text">{substrate.name}</p>
            <p className="text-xs text-muted">{substrate.nameLocal}</p>
            {!compact && (
              <div className="mt-2 space-y-0.5 text-xs text-muted">
                <p>{substrate.specificBiogasYield.toFixed(2)} m³ biogas/kg VS</p>
                <p>{Math.round(substrate.ch4Content * 100)}% methane</p>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
