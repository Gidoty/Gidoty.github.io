import { useMemo, useState } from 'react'
import { Wind } from 'lucide-react'
import PanelHeader from './shared/PanelHeader.jsx'
import ResultCard from './shared/ResultCard.jsx'
import FormulaBlock from './shared/FormulaBlock.jsx'
import { CONSTANTS, calculateCO2Combustion, calculateCH4 } from '../../../utils/methaneCalc.js'
import { fmt } from '../../../utils/formatters.js'

export default function Co2CombustionPanel() {
  const [volume, setVolume] = useState(50000)
  const [ch4Fraction, setCh4Fraction] = useState(0.9)

  const co2 = useMemo(() => calculateCO2Combustion(Number(volume) || 0), [volume])
  const ch4 = useMemo(() => calculateCH4(Number(volume) || 0, ch4Fraction), [volume, ch4Fraction])
  const co2Kg = co2.co2_tonnes * 1000
  const totalGhgCo2e = co2.co2_tonnes + ch4.primary_tonnes * CONSTANTS.GWP100

  return (
    <div className="mx-auto max-w-3xl">
      <PanelHeader
        icon={Wind}
        color="#3A86FF"
        title="CO₂ from Gas Flare Combustion"
        badges={['IPCC 2006 Tier 1', `${CONSTANTS.COMBUSTION_EFFICIENCY * 100}% combustion efficiency`]}
      />

      <p className="rounded-lg border border-border bg-card p-4 text-sm leading-normal text-muted">
        When flared gas combusts, most of its carbon converts to carbon dioxide (CO₂) rather than
        escaping as raw methane. This calculator estimates that CO₂ output directly from a volume of
        gas flared, independent of any specific report — useful for standalone volume estimates from
        satellite data, operator disclosures, or third-party flare surveys.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-text" htmlFor="combustion-volume">
            Gas Volume Flared (m³)
          </label>
          <input
            id="combustion-volume"
            type="number"
            min="0"
            step="100"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-teal focus:outline-none"
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-text" htmlFor="combustion-ch4">
              CH₄ Fraction
            </label>
            <span className="text-xs font-bold text-teal">{Math.round(ch4Fraction * 100)}%</span>
          </div>
          <input
            id="combustion-ch4"
            type="range"
            min="0.7"
            max="0.98"
            step="0.01"
            value={ch4Fraction}
            onChange={(e) => setCh4Fraction(Number(e.target.value))}
            className="mt-3 w-full accent-teal"
          />
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-teal/40 bg-teal/5 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-teal">Formula</p>
        <FormulaBlock
          citation="IPCC 2006 Tier 1"
          lines={[
            'CO2_combustion (tonnes) = V_flared (m³) × 2,000 / 1,000,000',
            `CO2_combustion = ${fmt.volume(Number(volume) || 0)} × 0.002 = ${fmt.tonnes(co2.co2_tonnes)}`,
          ]}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <ResultCard title="CO₂ Produced" subtitle="Tonnes">
          <p className="text-2xl font-bold text-text">{fmt.tonnes(co2.co2_tonnes)}</p>
        </ResultCard>
        <ResultCard title="CO₂ Produced" subtitle="Kilograms">
          <p className="text-2xl font-bold text-text">{fmt.number(co2Kg)} kg</p>
        </ResultCard>
      </div>

      <div className="mt-4 rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm text-text">
        <strong className="text-amber">CO₂ is not the same as CH₄.</strong> This figure is the carbon
        dioxide released by <em>combusted</em> gas — a fast-decaying but lower-potency gas. It is
        separate from unburned methane, which escapes combustion and carries a much higher warming
        potential per tonne (see the Methane Emissions and CO₂ Equivalent calculators).
      </div>

      <ResultCard title="Combined Total GHG Impact" subtitle="CO₂ from combustion + methane's CO₂-equivalent (100-yr)">
        <p className="text-2xl font-bold text-danger">{fmt.co2e(totalGhgCo2e)}</p>
        <FormulaBlock
          citation="IPCC 2006 Tier 1 + AR6 WGI 2021"
          lines={[
            'Total = CO2_combustion + (CH4_tonnes × GWP100)',
            `Total = ${fmt.tonnes(co2.co2_tonnes)} + (${fmt.tonnes(ch4.primary_tonnes)} × ${CONSTANTS.GWP100}) = ${fmt.co2e(totalGhgCo2e)}`,
          ]}
        />
      </ResultCard>
    </div>
  )
}
