import { FlaskConical } from 'lucide-react'
import InterventionCard from './InterventionCard.jsx'
import InterventionResults from './InterventionResults.jsx'
import Slider from '../calculator/Slider.jsx'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'
import { formatNum1 } from '../../lib/format.js'

const ACCENT = '#7B61FF'

export default function CatalystCard({
  currentConversion,
  targetConversion,
  onTargetConversionChange,
  additionalCatalystCost,
  onAdditionalCatalystCostChange,
  interventionCost,
  onInterventionCostChange,
  result,
  baselineDaily,
}) {
  return (
    <InterventionCard
      title="FCC Catalyst Activity Improvement"
      description="Increasing fresh catalyst addition restores conversion and octane, reducing the reformate blending requirement and improving gasoline pool value."
      icon={FlaskConical}
      accentColor={ACCENT}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-armit-bg/60 p-3 text-sm">
            <span className="text-armit-muted">Current FCC Conversion (baseline): </span>
            <span className="font-semibold text-armit-text">{currentConversion}%</span>
          </div>
          <Slider
            label="Target FCC Conversion"
            value={targetConversion}
            min={currentConversion}
            max={65}
            unit="%"
            onChange={onTargetConversionChange}
          />
          <Field label="Additional Catalyst Cost (USD/day)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={50}
              value={additionalCatalystCost}
              onChange={(e) => onAdditionalCatalystCostChange(Number(e.target.value))}
            />
          </Field>
          <Field label="Intervention Cost (USD)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={1000}
              value={interventionCost}
              onChange={(e) => onInterventionCostChange(Number(e.target.value))}
            />
          </Field>
        </div>
        <InterventionResults
          accentColor={ACCENT}
          dailyGain={result.dailyMarginGain}
          annualGain={result.annualGain}
          cost={result.cost}
          paybackDays={result.paybackDays}
          roi={result.roi}
          baselineDaily={baselineDaily}
          extraStats={[{ label: 'RON improvement', value: `+${formatNum1(result.ronImprovement)} octane` }]}
        />
      </div>
    </InterventionCard>
  )
}
