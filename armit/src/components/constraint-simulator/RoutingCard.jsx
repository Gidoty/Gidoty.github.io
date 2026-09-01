import { ArrowLeftRight, Lightbulb } from 'lucide-react'
import InterventionCard from './InterventionCard.jsx'
import InterventionResults from './InterventionResults.jsx'
import Slider from '../calculator/Slider.jsx'
import { formatNum0 } from '../../lib/format.js'

const ACCENT = '#00B8D9'

function DeltaStat({ label, value }) {
  const positive = value >= 0
  return (
    <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-3">
      <div className="text-[11px] uppercase tracking-wide text-armit-muted">{label}</div>
      <div className={`mt-0.5 text-sm font-semibold ${positive ? 'text-armit-emerald' : 'text-armit-coral'}`}>
        {positive ? '+' : ''}
        {formatNum0(value)} bpd
      </div>
    </div>
  )
}

export default function RoutingCard({ currentPctFcc, onCurrentPctFccChange, targetPctFcc, onTargetPctFccChange, result, baselineDaily }) {
  return (
    <InterventionCard
      title="VGO Routing Optimisation"
      description="Shifting VGO between FCC and the Hydrocracker changes the product slate. More HC feed produces more high-value diesel. More FCC feed produces more gasoline and LPG."
      icon={ArrowLeftRight}
      accentColor={ACCENT}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Slider
            label="Current % VGO to FCC"
            value={currentPctFcc}
            min={40}
            max={80}
            unit="% to FCC"
            onChange={onCurrentPctFccChange}
          />
          <Slider
            label="Target % VGO to FCC"
            value={targetPctFcc}
            min={40}
            max={80}
            unit="% to FCC"
            onChange={onTargetPctFccChange}
          />
          <div className="grid grid-cols-3 gap-2">
            <DeltaStat label="LPG" value={result.lpgDelta} />
            <DeltaStat label="Naphtha" value={result.naphthaDelta} />
            <DeltaStat label="Diesel" value={result.dieselDelta} />
          </div>
          <div className="flex items-start gap-2 rounded-lg border border-armit-teal/30 bg-armit-teal/5 p-3 text-sm text-armit-text">
            <Lightbulb size={16} className="mt-0.5 shrink-0 text-armit-teal" />
            {result.recommendation}
          </div>
        </div>
        <InterventionResults
          accentColor={ACCENT}
          dailyGain={result.dailyMarginGain}
          annualGain={result.annualGain}
          cost={0}
          paybackDays={0}
          roi={null}
          baselineDaily={baselineDaily}
        />
      </div>
    </InterventionCard>
  )
}
