import { Shield, CheckCircle, Star } from 'lucide-react'
import { CARBON_MARKET } from '../../data/constants.js'
import { formatUSD } from '../../utils/format.js'

const SCENARIOS = [
  { key: 'vcmConservative', icon: Shield, color: 'text-amber' },
  { key: 'vcmMid', icon: CheckCircle, color: 'text-accent' },
  { key: 'vcmPremium', icon: Star, color: 'text-amber', badge: 'HIGHEST INTEGRITY' },
]

export default function PriceScenarioCards({ selectedKey, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {SCENARIOS.map(({ key, icon: Icon, color, badge }) => {
        const scenario = CARBON_MARKET[key]
        const active = key === selectedKey
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect(key)}
            className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
              active ? 'border-accent bg-accent/15' : 'border-border bg-card hover:border-accent/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <Icon className={`h-6 w-6 ${color}`} />
              {badge && (
                <span className="rounded-full bg-panel px-2 py-0.5 text-[10px] font-semibold text-muted">
                  {badge}
                </span>
              )}
            </div>
            <p className="mt-2 font-semibold text-text">{scenario.label}</p>
            <p className="mt-1 text-xl font-bold text-accent">{formatUSD(scenario.usdPerTonne)}/tonne</p>
            <p className="mt-2 text-xs text-muted">{scenario.source}</p>
          </button>
        )
      })}
    </div>
  )
}
