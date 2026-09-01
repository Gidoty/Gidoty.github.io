import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { formatUsd0, formatUsd2 } from '../../lib/format.js'

export default function BindingAlert({ primaryBottleneck, operatingDaysPerYear }) {
  if (!primaryBottleneck) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-armit-emerald/40 bg-armit-emerald/10 p-5">
        <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-armit-emerald" />
        <div>
          <h3 className="text-sm font-semibold text-armit-text">No Binding Constraints</h3>
          <p className="mt-1 text-sm text-armit-muted">
            No binding constraints detected at current operating conditions. Your refinery is
            operating below capacity limits across all units.
          </p>
        </div>
      </div>
    )
  }

  const annualCost = primaryBottleneck.shadowPrice * operatingDaysPerYear

  return (
    <div className="flex items-start gap-3 rounded-xl border border-armit-coral/50 bg-armit-coral/10 p-5">
      <AlertTriangle size={22} className="mt-0.5 shrink-0 text-armit-coral" />
      <div>
        <h3 className="text-sm font-semibold text-armit-text">Primary Bottleneck Identified</h3>
        <p className="mt-1 text-sm text-armit-muted">
          Your <span className="font-semibold text-armit-text">{primaryBottleneck.fullName}</span>{' '}
          ({primaryBottleneck.unit}) is the active constraint. Relaxing it by{' '}
          <span className="font-semibold text-armit-text">{primaryBottleneck.incrementLabel}</span>{' '}
          would add <span className="font-semibold text-armit-coral">
            {formatUsd2(primaryBottleneck.shadowPrice)}
          </span>{' '}
          per day to your margin. At current conditions, this constraint costs you{' '}
          <span className="font-semibold text-armit-coral">{formatUsd0(annualCost)}</span> per
          year in unrealised margin.
        </p>
      </div>
    </div>
  )
}
