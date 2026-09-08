import { ArrowRight, ArrowDown } from 'lucide-react'
import { formatDecimal, formatKg, formatM3, formatKwh } from '../../utils/format.js'
import { ENERGY } from '../../data/constants.js'
import FormulaBlock from '../shared/FormulaBlock.jsx'

function StepBox({ title, from, to, formula, note }) {
  return (
    <FormulaBlock title={title} note={note} className="flex-1">
      <p className="font-sans text-sm text-text">
        {from} <span className="text-muted">→</span> <span className="font-semibold">{to}</span>
      </p>
      <p className="break-words">{formula}</p>
    </FormulaBlock>
  )
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-accent">
      <ArrowRight className="hidden h-5 w-5 lg:block" />
      <ArrowDown className="h-5 w-5 lg:hidden" />
    </div>
  )
}

export default function CalculationPipeline({ substrate, result }) {
  const multiplierNote =
    result.effectiveSBY !== result.baseSBY
      ? `Adjusted SBY: ${result.baseSBY.toFixed(2)} × ${(result.conditionMultiplier * result.temperatureMultiplier).toFixed(2)} = ${result.effectiveSBY.toFixed(2)} m³/kg VS`
      : null

  const steps = [
    {
      title: 'Step 1 · Fresh Weight → Total Solids',
      from: `${formatKg(result.freshWeightKg)} fresh`,
      to: formatKg(result.tsKg),
      formula: `${formatDecimal(result.freshWeightKg, 1)} × ${result.tsFraction.toFixed(2)} = ${formatDecimal(result.tsKg, 1)} kg TS`,
    },
    {
      title: 'Step 2 · Total Solids → Volatile Solids',
      from: formatKg(result.tsKg),
      to: formatKg(result.vsKg),
      formula: `${formatDecimal(result.tsKg, 1)} × ${substrate.vsPctOfTS.toFixed(2)} = ${formatDecimal(result.vsKg, 1)} kg VS`,
    },
    {
      title: 'Step 3 · Volatile Solids → Biogas Volume',
      from: formatKg(result.vsKg),
      to: formatM3(result.biogasM3),
      formula: `${formatDecimal(result.vsKg, 1)} × ${result.effectiveSBY.toFixed(2)} = ${formatDecimal(result.biogasM3, 1)} m³`,
      note: `SBY = ${result.effectiveSBY.toFixed(2)} m³/kg VS from ${substrate.name}${multiplierNote ? ` (${multiplierNote})` : ''}`,
    },
    {
      title: 'Step 4 · Biogas → Methane Volume',
      from: formatM3(result.biogasM3),
      to: `${formatDecimal(result.ch4M3, 1)} m³ CH₄`,
      formula: `${formatDecimal(result.biogasM3, 1)} × ${result.ch4Content.toFixed(2)} = ${formatDecimal(result.ch4M3, 1)} m³ CH₄`,
      note: `CH₄ content = ${(result.ch4Content * 100).toFixed(0)}%`,
    },
    {
      title: 'Step 5 · Methane → Energy Output',
      from: `${formatDecimal(result.ch4M3, 1)} m³ CH₄`,
      to: formatKwh(result.totalKwh),
      formula: `${formatDecimal(result.ch4M3, 1)} × ${ENERGY.CH4_LHV_KWH_PER_M3} kWh/m³ = ${formatDecimal(result.totalKwh, 1)} kWh total`,
      note: `Electrical (30%): ${formatKwh(result.electricalKwh)} · Thermal (60%): ${formatKwh(result.thermalKwh)}`,
    },
  ]

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-2">
      {steps.map((step, i) => (
        <div key={step.title} className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          <StepBox {...step} />
          {i < steps.length - 1 && <Arrow />}
        </div>
      ))}
    </div>
  )
}
