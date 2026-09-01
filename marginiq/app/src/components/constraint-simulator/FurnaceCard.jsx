import { Flame } from 'lucide-react'
import InterventionCard from './InterventionCard.jsx'
import InterventionResults from './InterventionResults.jsx'
import Slider from '../calculator/Slider.jsx'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'
import { formatNum0, formatNum1 } from '../../lib/format.js'

const ACCENT = '#2EC4B6'

export default function FurnaceCard({
  currentEfficiency,
  onCurrentEfficiencyChange,
  targetEfficiency,
  onTargetEfficiencyChange,
  fuelGasCost,
  onFuelGasCostChange,
  interventionCost,
  onInterventionCostChange,
  result,
  baselineDaily,
}) {
  return (
    <InterventionCard
      title="CDU Furnace Efficiency Improvement"
      description="Reducing excess air and cleaning convection tubes restores furnace efficiency, cutting fuel gas consumption and reducing CO2 emissions."
      icon={Flame}
      accentColor={ACCENT}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <Slider
            label="Current Furnace Efficiency"
            value={currentEfficiency}
            min={75}
            max={92}
            unit="%"
            onChange={onCurrentEfficiencyChange}
          />
          <Slider
            label="Target Furnace Efficiency"
            value={targetEfficiency}
            min={currentEfficiency}
            max={92}
            unit="%"
            onChange={onTargetEfficiencyChange}
          />
          <Field label="Fuel Gas Cost (USD/Gcal)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={0.1}
              value={fuelGasCost}
              onChange={(e) => onFuelGasCostChange(Number(e.target.value))}
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
          extraStats={[
            { label: 'CO2 reduction', value: `${formatNum0(result.co2ReductionKgPerDay)} kg/day` },
            { label: 'CO2 reduction / yr', value: `${formatNum1(result.co2ReductionTonnesPerYear)} t/yr` },
          ]}
        />
      </div>
    </InterventionCard>
  )
}
