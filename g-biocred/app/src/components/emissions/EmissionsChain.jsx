import { formatDecimal, formatKg, formatM3 } from '../../utils/format.js'
import { IPCC_MANURE } from '../../data/constants.js'
import FormulaBlock from '../shared/FormulaBlock.jsx'

function Step({ title, children }) {
  return <FormulaBlock title={title}>{children}</FormulaBlock>
}

export default function EmissionsChain({ substrate, tsKg, vsKg, ch4ProducedM3, scenario, gwpOption, leakageFactor, result }) {
  const { potential, baseline, project, avoidedTonnes } = result
  const ch4Density = IPCC_MANURE.ch4DensityKgPerM3.value

  return (
    <div className="space-y-3">
      <Step title="Step 1 · Volatile Solids Available">
        <p>
          VS = {formatKg(tsKg)} TS × {substrate.vsPctOfTS.toFixed(2)} = {formatKg(vsKg)}
        </p>
        <p className="text-xs text-muted">(from yield calculation)</p>
      </Step>

      <Step title="Step 2 · Maximum CH₄ Generation Potential">
        <p>
          {potential.boLabel} = {potential.bo.toFixed(2)} m³ CH₄/kg VS
        </p>
        <p>
          CH₄_potential = {formatDecimal(vsKg, 1)} × {potential.bo.toFixed(2)} ={' '}
          {formatM3(potential.ch4M3)}
        </p>
        {baseline && (
          <p>
            CH₄ mass = {formatDecimal(potential.ch4M3, 1)} × {ch4Density} kg/m³ ={' '}
            {formatKg(baseline.ch4PotentialKg)}
          </p>
        )}
        <p className="text-xs text-muted">Source: {potential.boSource}</p>
      </Step>

      <Step title="Step 3 · Baseline Emissions (without your project)">
        {baseline ? (
          <>
            <p>
              E_baseline = {formatKg(baseline.ch4PotentialKg)} × {scenario.value} × {gwpOption.gwp100.toFixed(1)} ÷ 1000
            </p>
            <p className="text-base font-semibold">
              = {formatDecimal(baseline.tonnesCO2e, 2)} tonnes CO₂e
            </p>
            <p className="text-xs text-muted">
              MCF = {scenario.value} ({scenario.label}, {scenario.source})
            </p>
            <p className="text-xs text-muted">
              GWP₁₀₀ = {gwpOption.gwp100.toFixed(1)} ({gwpOption.label})
            </p>
          </>
        ) : (
          <p className="text-xs text-warning">
            Not applicable — this baseline scenario has no MCF-based formula. See the note on the
            selected scenario card.
          </p>
        )}
      </Step>

      <Step title="Step 4 · Project Emissions (fugitive leakage)">
        <p>
          CH₄_fugitive = {formatM3(ch4ProducedM3)} × {(leakageFactor * 100).toFixed(0)}% ={' '}
          {formatM3(project.fugitiveM3)} = {formatKg(project.fugitiveKg)}
        </p>
        <p>
          E_project = {formatKg(project.fugitiveKg)} × {gwpOption.gwp100.toFixed(1)} ÷ 1000 ={' '}
          {formatDecimal(project.tonnesCO2e, 2)} tonnes CO₂e
        </p>
        <p className="text-xs text-muted">Source: CDM Tool 14</p>
      </Step>

      <Step title="Step 5 · Net Emissions Avoided">
        {avoidedTonnes !== null ? (
          <>
            <p>
              ER = {formatDecimal(baseline.tonnesCO2e, 2)} − {formatDecimal(project.tonnesCO2e, 2)}
            </p>
            <p className="text-2xl font-bold text-accent">
              {formatDecimal(avoidedTonnes, 2)} tonnes CO₂e avoided
            </p>
            <p className="text-xs font-sans text-muted">Net Emissions Avoided</p>
          </>
        ) : (
          <p className="text-xs text-warning">Select a scenario with a defined MCF to see a result.</p>
        )}
      </Step>
    </div>
  )
}
