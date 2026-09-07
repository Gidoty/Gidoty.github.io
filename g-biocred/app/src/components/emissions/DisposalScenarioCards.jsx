import { Trash2, Trash, Droplets, Flame, Sun } from 'lucide-react'
import { DISPOSAL_SCENARIOS } from '../../data/disposalScenarios.js'

const ICONS = { Trash2, Trash, Droplets, Flame, Sun }

const COLOR_CLASSES = {
  danger: 'text-danger',
  warning: 'text-warning',
  accent: 'text-accent',
}

export default function DisposalScenarioCards({ selectedKey, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {DISPOSAL_SCENARIOS.map((scenario) => {
        const Icon = ICONS[scenario.icon]
        const active = scenario.key === selectedKey
        return (
          <button
            key={scenario.key}
            type="button"
            onClick={() => onSelect(scenario.key)}
            className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
              active ? 'border-accent bg-accent/15' : 'border-border bg-card hover:border-accent/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <Icon className={`h-6 w-6 ${COLOR_CLASSES[scenario.color]}`} />
              {scenario.badge && (
                <span className="rounded-full bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {scenario.badge}
                </span>
              )}
            </div>
            <p className="mt-2 font-semibold text-text">{scenario.label}</p>
            <p className="mt-1 text-xs text-muted">{scenario.description}</p>
            <p className="mt-2 text-xs text-text">
              {scenario.value === null ? 'MCF: not applicable' : `MCF: ${scenario.value}`}
            </p>
            <p className="mt-1 text-[11px] text-muted">{scenario.source}</p>
            {active && scenario.calcNote && (
              <p className="mt-2 rounded-md border border-warning/40 bg-warning/10 p-2 text-xs text-text">
                {scenario.calcNote}
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}
