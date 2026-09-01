import { Gauge } from 'lucide-react'
import InterventionCard from './InterventionCard.jsx'
import InterventionResults from './InterventionResults.jsx'
import Slider from '../calculator/Slider.jsx'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'
import { formatBpd } from '../../utils/formatters.js'

const ACCENT = '#00B4D8'

export default function VduCard({ currentVacuum, targetVacuum, onTargetVacuumChange, maintenanceCost, onMaintenanceCostChange, result, baselineDaily }) {
  return (
    <InterventionCard
      title="VDU Vacuum System Restoration"
      description={`Restoring vacuum from ${currentVacuum} to ${targetVacuum} mmHg recovers additional VGO from atmospheric residue, routing it to higher-value FCC or HC processing.`}
      icon={Gauge}
      accentColor={ACCENT}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Slider
            label="Target Vacuum"
            value={targetVacuum}
            min={8}
            max={currentVacuum}
            unit=" mmHg"
            onChange={onTargetVacuumChange}
            hint="Achievable with ejector / steam system maintenance."
          />
          <Field label="Estimated Maintenance Cost (USD)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={1000}
              value={maintenanceCost}
              onChange={(e) => onMaintenanceCostChange(Number(e.target.value))}
            />
          </Field>
          <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-3 text-sm text-armit-muted">
            Additional VGO recovered:{' '}
            <span className="font-semibold text-armit-text">{formatBpd(result.additionalVgo)}</span>
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
