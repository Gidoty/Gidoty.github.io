import { Wind } from 'lucide-react'
import InterventionCard from './InterventionCard.jsx'
import InterventionResults from './InterventionResults.jsx'
import Slider from '../calculator/Slider.jsx'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'
import { formatBpd } from '../../utils/formatters.js'

const ACCENT = '#F4A261'

export default function H2Card({
  currentH2,
  targetH2,
  onTargetH2Change,
  interventionCost,
  onInterventionCostChange,
  additionalH2OpexDaily,
  onAdditionalH2OpexDailyChange,
  result,
  baselineDaily,
}) {
  return (
    <InterventionCard
      title="Hydrogen Supply Stabilisation"
      description="Restoring stable H2 delivery unlocks additional hydrocracker throughput, converting VGO to high-value diesel instead of low-value fuel oil."
      icon={Wind}
      accentColor={ACCENT}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Slider
            label="Target H2 Supply"
            value={targetH2}
            min={currentH2}
            max={45}
            unit=" MMscfd"
            onChange={onTargetH2Change}
          />
          <Field label="Intervention Cost (USD)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={500}
              value={interventionCost}
              onChange={(e) => onInterventionCostChange(Number(e.target.value))}
            />
          </Field>
          <Field label="Additional H2 Operating Cost (USD/day)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={100}
              value={additionalH2OpexDaily}
              onChange={(e) => onAdditionalH2OpexDailyChange(Number(e.target.value))}
            />
          </Field>
          <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-3 text-sm text-armit-muted">
            Additional HC feed unlocked:{' '}
            <span className="font-semibold text-armit-text">{formatBpd(result.additionalHcFeed)}</span>
          </div>
        </div>
        <InterventionResults
          accentColor={ACCENT}
          dailyGain={result.dailyMarginGain}
          annualGain={result.annualGain}
          cost={result.cost}
          paybackDays={result.paybackDays}
          roi={result.roi}
          baselineDaily={baselineDaily}
        />
      </div>
    </InterventionCard>
  )
}
