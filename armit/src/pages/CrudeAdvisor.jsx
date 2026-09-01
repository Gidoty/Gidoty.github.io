import { useMemo, useState } from 'react'
import CRUDES from '../data/crudes.js'
import { computeArmitResult } from '../lib/calculations.js'
import { Field, inputClass } from '../components/calculator/FieldGroup.jsx'
import Slider from '../components/calculator/Slider.jsx'
import CrudeOptionPanel from '../components/crude-advisor/CrudeOptionPanel.jsx'
import WinnerCard from '../components/crude-advisor/WinnerCard.jsx'
import ComparisonTable from '../components/crude-advisor/ComparisonTable.jsx'
import YieldComparisonChart from '../components/crude-advisor/YieldComparisonChart.jsx'
import FreightImpactBox from '../components/crude-advisor/FreightImpactBox.jsx'
import QualityDifferentialBox from '../components/crude-advisor/QualityDifferentialBox.jsx'
import NigeriaContextBox from '../components/crude-advisor/NigeriaContextBox.jsx'
import { formatUsd2 } from '../lib/format.js'
import { Copy, RotateCcw } from 'lucide-react'

// Hydrocracker diesel yield isn't exposed as an input on this page (the
// Crude Advisor varies crude + delivered cost + shared unit conditions, not
// every HC tuning knob) — held at the calculator's own default.
const HC_DIESEL_YIELD_PCT = 68

const DEFAULT_OPTION_A = { crudeKey: 'bonnyLight', fob: 72.65, freight: 1.5, port: 0.35 }
const DEFAULT_OPTION_B = { crudeKey: 'forcados', fob: 71.2, freight: 1.5, port: 0.35 }

const DEFAULT_PRICES = {
  lpg: 85.0,
  motorSpirit: 95.0,
  kerosene: 98.0,
  diesel: 102.0,
  fuelOil: 55.0,
  lcoClo: 62.0,
}

const PRICE_FIELDS = [
  { key: 'lpg', label: 'LPG' },
  { key: 'motorSpirit', label: 'Motor Spirit' },
  { key: 'kerosene', label: 'Kerosene' },
  { key: 'diesel', label: 'Diesel / AGO' },
  { key: 'fuelOil', label: 'Fuel Oil' },
  { key: 'lcoClo', label: 'LCO / CLO' },
]

const DEFAULT_THROUGHPUT = 60000
const DEFAULT_OPEX = 10.2
const DEFAULT_VACUUM = 12
const DEFAULT_FCC_CONVERSION = 55
const DEFAULT_FCC_SPLIT = 60

function runOption(option, shared) {
  const deliveredCost = option.fob + option.freight + option.port
  const crude = CRUDES[option.crudeKey]
  const result = computeArmitResult({
    crude,
    throughputBpd: shared.throughputBpd,
    crudeCost: deliveredCost,
    vacuumPressure: shared.vacuumPressure,
    fccSplitPct: shared.fccSplitPct,
    fccConversionPct: shared.fccConversionPct,
    hcDieselYieldPct: HC_DIESEL_YIELD_PCT,
    prices: shared.prices,
    opexPerBbl: shared.opexPerBbl,
  })
  return { ...option, crude, deliveredCost, result }
}

export default function CrudeAdvisor() {
  const [optionA, setOptionA] = useState(DEFAULT_OPTION_A)
  const [optionB, setOptionB] = useState(DEFAULT_OPTION_B)
  const [throughputBpd, setThroughputBpd] = useState(DEFAULT_THROUGHPUT)
  const [prices, setPrices] = useState(DEFAULT_PRICES)
  const [opexPerBbl, setOpexPerBbl] = useState(DEFAULT_OPEX)
  const [vacuumPressure, setVacuumPressure] = useState(DEFAULT_VACUUM)
  const [fccConversionPct, setFccConversionPct] = useState(DEFAULT_FCC_CONVERSION)
  const [fccSplitPct, setFccSplitPct] = useState(DEFAULT_FCC_SPLIT)
  const [copied, setCopied] = useState(false)

  const shared = useMemo(
    () => ({ throughputBpd, prices, opexPerBbl, vacuumPressure, fccConversionPct, fccSplitPct }),
    [throughputBpd, prices, opexPerBbl, vacuumPressure, fccConversionPct, fccSplitPct],
  )

  const derivedA = useMemo(() => runOption(optionA, shared), [optionA, shared])
  const derivedB = useMemo(() => runOption(optionB, shared), [optionB, shared])

  const updatePrice = (key, value) => setPrices((prev) => ({ ...prev, [key]: value }))

  const resetToDefaults = () => {
    setOptionA(DEFAULT_OPTION_A)
    setOptionB(DEFAULT_OPTION_B)
    setThroughputBpd(DEFAULT_THROUGHPUT)
    setPrices(DEFAULT_PRICES)
    setOpexPerBbl(DEFAULT_OPEX)
    setVacuumPressure(DEFAULT_VACUUM)
    setFccConversionPct(DEFAULT_FCC_CONVERSION)
    setFccSplitPct(DEFAULT_FCC_SPLIT)
  }

  const copySummary = async () => {
    const marginA = derivedA.result.netMarginPerBbl
    const marginB = derivedB.result.netMarginPerBbl
    const diff = Math.abs(marginA - marginB)
    const winnerLine =
      diff <= 0.5
        ? `Margins are comparable — within $0.50/bbl.`
        : `${marginA > marginB ? `Option A (${derivedA.crude.name})` : `Option B (${derivedB.crude.name})`} is the better choice by ${formatUsd2(diff)}/bbl (${formatUsd2(diff * throughputBpd)}/day).`

    const summary = `ARMIT Crude Switching Advisor — Comparison Summary
Throughput: ${throughputBpd.toLocaleString('en-US')} bpd

Option A: ${derivedA.crude.name}
  Delivered cost: ${formatUsd2(derivedA.deliveredCost)}/bbl
  Net margin: ${formatUsd2(marginA)}/bbl

Option B: ${derivedB.crude.name}
  Delivered cost: ${formatUsd2(derivedB.deliveredCost)}/bbl
  Net margin: ${formatUsd2(marginB)}/bbl

${winnerLine}`

    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently, no crash.
    }
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-armit-text sm:text-4xl">
              Crude Switching Advisor
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-armit-muted">
              Compare two crude options and find the better margin — instantly.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-armit-card px-3 py-2 text-xs font-medium text-armit-text transition hover:border-armit-teal/40 hover:text-armit-teal"
            >
              <RotateCcw size={14} />
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={copySummary}
              className="inline-flex items-center gap-1.5 rounded-lg bg-armit-teal px-3 py-2 text-xs font-semibold text-armit-bg transition hover:bg-armit-teal/90"
            >
              <Copy size={14} />
              {copied ? 'Copied!' : 'Copy Comparison Summary'}
            </button>
          </div>
        </div>

        {/* Option A / B inputs */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CrudeOptionPanel label="Option A" accent="teal" option={optionA} onChange={setOptionA} />
          <CrudeOptionPanel label="Option B" accent="amber" option={optionB} onChange={setOptionB} />
        </div>

        {/* Shared inputs */}
        <div className="mt-6 rounded-xl border border-white/10 bg-armit-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">
            Shared Operating Conditions
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Throughput (bpd)">
              <input
                type="number"
                className={inputClass}
                min={10000}
                max={700000}
                step={1000}
                value={throughputBpd}
                onChange={(e) => setThroughputBpd(Number(e.target.value))}
              />
            </Field>
            <Field label="Variable Opex (USD/bbl)">
              <input
                type="number"
                className={inputClass}
                min={0}
                step={0.01}
                value={opexPerBbl}
                onChange={(e) => setOpexPerBbl(Number(e.target.value))}
              />
            </Field>
            <Slider
              label="VDU Vacuum Pressure"
              value={vacuumPressure}
              min={8}
              max={20}
              unit=" mmHg"
              onChange={setVacuumPressure}
            />
            <Slider
              label="FCC Conversion"
              value={fccConversionPct}
              min={45}
              max={70}
              unit="%"
              onChange={setFccConversionPct}
            />
            <Slider
              label="FCC / HC VGO Split"
              value={fccSplitPct}
              min={40}
              max={80}
              unit="% to FCC"
              onChange={setFccSplitPct}
            />
          </div>

          <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-armit-amber">
            Product Prices (USD/bbl)
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PRICE_FIELDS.map((field) => (
              <Field key={field.key} label={field.label}>
                <input
                  type="number"
                  className={inputClass}
                  min={0}
                  step={0.01}
                  value={prices[field.key]}
                  onChange={(e) => updatePrice(field.key, Number(e.target.value))}
                />
              </Field>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-10 space-y-6">
          <WinnerCard optionA={derivedA} optionB={derivedB} throughputBpd={throughputBpd} />
          <ComparisonTable optionA={derivedA} optionB={derivedB} />
          <YieldComparisonChart optionA={derivedA} optionB={derivedB} />
          <FreightImpactBox optionA={derivedA} optionB={derivedB} throughputBpd={throughputBpd} />
          <QualityDifferentialBox optionA={derivedA} optionB={derivedB} />
          <NigeriaContextBox />
        </div>
      </div>
    </div>
  )
}
