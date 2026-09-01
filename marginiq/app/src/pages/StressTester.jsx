import { useMemo, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import CRUDES from '../data/crudes.js'
import {
  computeScenarioMetrics,
  computeCrudeBreakeven,
  computeAgoBreakeven,
  computeTornadoData,
  carbonAdjustedMarginAtPrice,
  computeCarbonBreakevenPrice,
} from '../utils/calcEngine.js'
import { Field, inputClass } from '../components/calculator/FieldGroup.jsx'
import Slider from '../components/calculator/Slider.jsx'
import ScenarioPanel from '../components/stress-tester/ScenarioPanel.jsx'
import ScenarioSummaryCard from '../components/stress-tester/ScenarioSummaryCard.jsx'
import ScenarioComparisonTable from '../components/stress-tester/ScenarioComparisonTable.jsx'
import MarginWaterfallChart from '../components/stress-tester/MarginWaterfallChart.jsx'
import TornadoChart from '../components/stress-tester/TornadoChart.jsx'
import BreakevenBox from '../components/stress-tester/BreakevenBox.jsx'
import CarbonStressChart from '../components/stress-tester/CarbonStressChart.jsx'
import NigeriaCarbonContext from '../components/stress-tester/NigeriaCarbonContext.jsx'
import PageCta from '../components/shared/PageCta.jsx'

const HC_DIESEL_YIELD_PCT = 68

const DEFAULT_BASE = {
  crudeCost: 72.65,
  prices: { lpg: 85.0, motorSpirit: 95.0, kerosene: 98.0, diesel: 102.0, fuelOil: 55.0, lcoClo: 62.0 },
  carbonPrice: 75.0,
}
const DEFAULT_BEAR = {
  crudeCost: 82.0,
  prices: { lpg: 72.0, motorSpirit: 80.0, kerosene: 83.0, diesel: 87.0, fuelOil: 48.0, lcoClo: 52.0 },
  carbonPrice: 95.0,
}
const DEFAULT_BULL = {
  crudeCost: 68.0,
  prices: { lpg: 96.0, motorSpirit: 108.0, kerosene: 112.0, diesel: 118.0, fuelOil: 65.0, lcoClo: 74.0 },
  carbonPrice: 60.0,
}

function downloadScenarioCsv(scenarios) {
  const rows = [
    ['Metric', ...scenarios.map((s) => s.badge)],
    ['Crude Cost (USD/bbl)', ...scenarios.map((s) => (s.metrics.result.crudeCostPerDay / s.metrics.throughputBpd).toFixed(2))],
    ['Total Revenue (USD/day)', ...scenarios.map((s) => s.metrics.result.totalRevenue.toFixed(2))],
    ['Gross Margin (USD/day)', ...scenarios.map((s) => s.metrics.result.grossMarginPerDay.toFixed(2))],
    ['Carbon Cost (USD/day)', ...scenarios.map((s) => s.metrics.carbonCostPerDay.toFixed(2))],
    ['Carbon-Adjusted Margin (USD/day)', ...scenarios.map((s) => s.metrics.carbonAdjustedMarginPerDay.toFixed(2))],
    ['Net Margin (USD/bbl)', ...scenarios.map((s) => s.metrics.result.netMarginPerBbl.toFixed(2))],
    ['Carbon-Adjusted (USD/bbl)', ...scenarios.map((s) => s.metrics.carbonAdjustedPerBbl.toFixed(2))],
    ['CO2 Intensity (kg/bbl)', ...scenarios.map((s) => s.metrics.co2PerBblKg.toFixed(2))],
    ['3-2-1 Crack Spread (USD/bbl)', ...scenarios.map((s) => s.metrics.result.crack321.toFixed(2))],
  ]
  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'armit-stress-scenarios.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function StressTester() {
  const [crudeKey, setCrudeKey] = useState('bonnyLight')
  const [throughputBpd, setThroughputBpd] = useState(60000)
  const [opexPerBbl, setOpexPerBbl] = useState(10.2)
  const [vacuumPressure, setVacuumPressure] = useState(12)
  const [fccConversionPct, setFccConversionPct] = useState(55)
  const [fccSplitPct, setFccSplitPct] = useState(60)

  const [baseScenario, setBaseScenario] = useState(DEFAULT_BASE)
  const [bearScenario, setBearScenario] = useState(DEFAULT_BEAR)
  const [bullScenario, setBullScenario] = useState(DEFAULT_BULL)

  const crude = CRUDES[crudeKey]
  const shared = useMemo(
    () => ({ crude, throughputBpd, vacuumPressure, fccSplitPct, fccConversionPct, hcDieselYieldPct: HC_DIESEL_YIELD_PCT, opexPerBbl }),
    [crude, throughputBpd, vacuumPressure, fccSplitPct, fccConversionPct, opexPerBbl],
  )

  const baseMetrics = useMemo(() => computeScenarioMetrics({ ...shared, scenario: baseScenario }), [shared, baseScenario])
  const bearMetrics = useMemo(() => computeScenarioMetrics({ ...shared, scenario: bearScenario }), [shared, bearScenario])
  const bullMetrics = useMemo(() => computeScenarioMetrics({ ...shared, scenario: bullScenario }), [shared, bullScenario])

  const scenarios = [
    { badge: 'BASE', accent: 'teal', metrics: { ...baseMetrics, throughputBpd } },
    { badge: 'BEAR', accent: 'coral', metrics: { ...bearMetrics, throughputBpd } },
    { badge: 'BULL', accent: 'emerald', metrics: { ...bullMetrics, throughputBpd } },
  ]

  const crudeBreakeven = useMemo(
    () =>
      computeCrudeBreakeven({
        totalRevenue: baseMetrics.result.totalRevenue,
        carbonCostPerDay: baseMetrics.carbonCostPerDay,
        opexPerBbl,
        throughputBpd,
      }),
    [baseMetrics, opexPerBbl, throughputBpd],
  )

  const agoBreakeven = useMemo(
    () =>
      computeAgoBreakeven({
        crudeCost: baseScenario.crudeCost,
        opexPerBbl,
        throughputBpd,
        carbonCostPerDay: baseMetrics.carbonCostPerDay,
        totalRevenue: baseMetrics.result.totalRevenue,
        agoRevenue: baseMetrics.result.slate.diesel.revenuePerDay,
        agoBpd: baseMetrics.result.slate.diesel.bpd,
      }),
    [baseScenario.crudeCost, opexPerBbl, throughputBpd, baseMetrics],
  )

  const tornadoData = useMemo(
    () => computeTornadoData({ ...shared, baseScenario }),
    [shared, baseScenario],
  )

  const curveData = useMemo(() => {
    const points = []
    for (let cp = 0; cp <= 200; cp += 10) {
      points.push({
        carbonPrice: cp,
        BASE: carbonAdjustedMarginAtPrice(baseMetrics.result.grossMarginPerBbl, baseMetrics.co2PerBblKg, cp),
        BEAR: carbonAdjustedMarginAtPrice(bearMetrics.result.grossMarginPerBbl, bearMetrics.co2PerBblKg, cp),
        BULL: carbonAdjustedMarginAtPrice(bullMetrics.result.grossMarginPerBbl, bullMetrics.co2PerBblKg, cp),
      })
    }
    return points
  }, [baseMetrics, bearMetrics, bullMetrics])

  const breakevens = {
    BASE: computeCarbonBreakevenPrice(baseMetrics.result.grossMarginPerBbl, baseMetrics.co2PerBblKg),
    BEAR: computeCarbonBreakevenPrice(bearMetrics.result.grossMarginPerBbl, bearMetrics.co2PerBblKg),
    BULL: computeCarbonBreakevenPrice(bullMetrics.result.grossMarginPerBbl, bullMetrics.co2PerBblKg),
  }

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <style>{'@media print { header, footer { display: none !important; } }'}</style>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-armit-text sm:text-4xl">Margin Stress-Tester</h1>
          <p className="mt-2 max-w-3xl text-sm text-armit-muted print:hidden">
            Run three scenarios simultaneously — base, pessimistic, and optimistic — and see where
            your margin holds and where it breaks.
          </p>
        </div>

        {/* Section 1: base configuration */}
        <section className="rounded-xl border border-white/10 bg-armit-card p-5 print:hidden">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">
            Base Configuration (shared across all scenarios)
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Crude Type">
              <select className={inputClass} value={crudeKey} onChange={(e) => setCrudeKey(e.target.value)}>
                {Object.entries(CRUDES).map(([key, c]) => (
                  <option key={key} value={key}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
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
            <Slider label="VDU Vacuum" value={vacuumPressure} min={8} max={20} unit=" mmHg" onChange={setVacuumPressure} />
            <Slider label="FCC Conversion" value={fccConversionPct} min={45} max={70} unit="%" onChange={setFccConversionPct} />
            <Slider label="FCC / HC VGO Split" value={fccSplitPct} min={40} max={80} unit="% to FCC" onChange={setFccSplitPct} />
          </div>
        </section>

        {/* Section 2: three scenario panels */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 print:hidden">
          <ScenarioPanel label="Base Case" badge="BASE" accent="teal" scenario={baseScenario} onChange={setBaseScenario} onReset={() => setBaseScenario(DEFAULT_BASE)} />
          <ScenarioPanel label="Pessimistic" badge="BEAR" accent="coral" scenario={bearScenario} onChange={setBearScenario} onReset={() => setBearScenario(DEFAULT_BEAR)} />
          <ScenarioPanel label="Optimistic" badge="BULL" accent="emerald" scenario={bullScenario} onChange={setBullScenario} onReset={() => setBullScenario(DEFAULT_BULL)} />
        </div>

        {/* Section 3: results */}
        <div className="mt-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-armit-text sm:text-3xl">Results</h2>
            <div className="flex gap-3 print:hidden">
              <button
                type="button"
                onClick={() => downloadScenarioCsv(scenarios)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-armit-card px-3 py-2 text-xs font-medium text-armit-text transition hover:border-armit-teal/40 hover:text-armit-teal"
              >
                <Download size={14} />
                Download Scenario CSV
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-armit-teal px-3 py-2 text-xs font-semibold text-armit-bg transition hover:bg-armit-teal/90"
              >
                <Printer size={14} />
                Print Stress Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {scenarios.map((s) => (
              <ScenarioSummaryCard key={s.badge} badge={s.badge} accent={s.accent} metrics={s.metrics} />
            ))}
          </div>

          <ScenarioComparisonTable scenarios={scenarios} />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <MarginWaterfallChart scenarios={scenarios} />
            <TornadoChart data={tornadoData} />
          </div>

          <BreakevenBox
            crudeBreakeven={crudeBreakeven}
            currentCrude={baseScenario.crudeCost}
            agoBreakeven={agoBreakeven}
            currentAgo={baseScenario.prices.diesel}
          />

          <CarbonStressChart curveData={curveData} breakevens={breakevens} />
        </div>

        {/* Section 4: Nigeria context */}
        <div className="mt-10">
          <NigeriaCarbonContext />
        </div>

        <div className="mt-10 flex justify-center rounded-2xl border border-white/10 bg-armit-card p-8 print:hidden">
          <PageCta to="/calculator" variant="secondary">
            Back to Core Calculator
          </PageCta>
        </div>
      </div>
    </div>
  )
}
