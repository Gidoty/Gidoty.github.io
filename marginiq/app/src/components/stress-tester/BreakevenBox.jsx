import { Scale } from 'lucide-react'
import { formatUSDPerBbl } from '../../utils/formatters.js'

function cushionTone(cushion) {
  if (cushion < 0) return { text: 'text-armit-coral', label: 'Currently in loss position' }
  if (cushion < 5) return { text: 'text-armit-amber', label: 'Thin cushion — watch closely' }
  if (cushion > 10) return { text: 'text-armit-emerald', label: 'Strong cushion' }
  return { text: 'text-armit-text', label: 'Adequate cushion' }
}

export default function BreakevenBox({ crudeBreakeven, currentCrude, agoBreakeven, currentAgo }) {
  const cushion = crudeBreakeven - currentCrude
  const tone = cushionTone(cushion)

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-armit-text">
        <Scale size={16} className="text-armit-teal" />
        Margin Breakeven Analysis
      </h3>

      <div className="mt-4 space-y-4 text-sm">
        <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-4">
          <p className="text-armit-muted">
            Your margin breaks even when crude reaches{' '}
            <span className="font-semibold text-armit-text">{formatUSDPerBbl(crudeBreakeven)}</span>.
          </p>
          <p className="mt-1 text-armit-muted">
            Current crude is <span className="font-semibold text-armit-text">{formatUSDPerBbl(currentCrude)}</span>{' '}
            — you have <span className={`font-semibold ${tone.text}`}>{formatUSDPerBbl(Math.abs(cushion))}</span>{' '}
            of {cushion >= 0 ? 'cushion' : 'shortfall'}.
          </p>
          <p className={`mt-2 text-xs font-semibold ${tone.text}`}>{tone.label}</p>
        </div>

        <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-4">
          <p className="text-armit-muted">
            Diesel/AGO must be at least{' '}
            <span className="font-semibold text-armit-text">{formatUSDPerBbl(agoBreakeven)}</span> to break even at
            the BASE crude cost of {formatUSDPerBbl(currentCrude)}.
          </p>
          <p className="mt-1 text-xs text-armit-muted">
            Currently priced at {formatUSDPerBbl(currentAgo)}.
          </p>
        </div>
      </div>
    </div>
  )
}
