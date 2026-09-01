import { useMemo, useState } from 'react'
import CRUDES from '../data/crudes.js'
import { computeArmitResult } from '../lib/calculations.js'
import { Field, inputClass } from '../components/calculator/FieldGroup.jsx'
import Slider from '../components/calculator/Slider.jsx'
import MetricCard from '../components/calculator/MetricCard.jsx'
import YieldTable from '../components/calculator/YieldTable.jsx'
import ProductPieChart from '../components/calculator/ProductPieChart.jsx'
import EiiGauge from '../components/calculator/EiiGauge.jsx'
import CrackSpreadCompare from '../components/calculator/CrackSpreadCompare.jsx'
import { formatUsd0, formatUsd2 } from '../lib/format.js'

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

export default function Calculator() {
  const [crudeKey, setCrudeKey] = useState('bonnyLight')
  const [throughputBpd, setThroughputBpd] = useState(60000)
  const [crudeCost, setCrudeCost] = useState(72.65)
  const [vacuumPressure, setVacuumPressure] = useState(12)
  const [fccSplitPct, setFccSplitPct] = useState(60)
  const [fccConversionPct, setFccConversionPct] = useState(55)
  const [hcDieselYieldPct, setHcDieselYieldPct] = useState(68)
  const [prices, setPrices] = useState(DEFAULT_PRICES)
  const [opexPerBbl, setOpexPerBbl] = useState(10.2)

  const crude = CRUDES[crudeKey]

  const result = useMemo(
    () =>
      computeArmitResult({
        crude,
        throughputBpd,
        crudeCost,
        vacuumPressure,
        fccSplitPct,
        fccConversionPct,
        hcDieselYieldPct,
        prices,
        opexPerBbl,
      }),
    [crude, throughputBpd, crudeCost, vacuumPressure, fccSplitPct, fccConversionPct, hcDieselYieldPct, prices, opexPerBbl],
  )

  const updatePrice = (key, value) => setPrices((prev) => ({ ...prev, [key]: value }))

  return (
    <div className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-armit-text sm:text-4xl">
            Core Margin Calculator
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-armit-muted">
            Assay-driven yields across CDU, VDU, FCC, and Hydrocracker, computed live from the
            inputs below — every figure on the right updates as you adjust the plant.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
          {/* Inputs panel */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <section className="space-y-4 rounded-xl border border-white/10 bg-armit-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">
                Feedstock &amp; Plant
              </h2>

              <Field label="Crude Type">
                <select
                  className={inputClass}
                  value={crudeKey}
                  onChange={(e) => setCrudeKey(e.target.value)}
                >
                  {Object.entries(CRUDES).map(([key, c]) => (
                    <option key={key} value={key}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <p className="-mt-2 text-[11px] text-armit-muted">
                API {crude.api}° &middot; Sulphur {crude.sulphur}% &middot; SG {crude.sg}
              </p>

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

              <Field label="Crude Cost (USD/bbl)">
                <input
                  type="number"
                  className={inputClass}
                  min={0}
                  step={0.01}
                  value={crudeCost}
                  onChange={(e) => setCrudeCost(Number(e.target.value))}
                />
              </Field>

              <Slider
                label="VDU Vacuum Pressure"
                value={vacuumPressure}
                min={8}
                max={20}
                unit=" mmHg"
                onChange={setVacuumPressure}
                hint="Lower pressure recovers more VGO from the atmospheric residue."
              />

              <Slider
                label="FCC / HC VGO Split"
                value={fccSplitPct}
                min={40}
                max={80}
                unit="% to FCC"
                onChange={setFccSplitPct}
                hint={`Remainder (${100 - fccSplitPct}%) routes to the Hydrocracker.`}
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
                label="HC Diesel Yield"
                value={hcDieselYieldPct}
                min={55}
                max={75}
                unit=" wt%"
                onChange={setHcDieselYieldPct}
              />
            </section>

            <section className="space-y-4 rounded-xl border border-white/10 bg-armit-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">
                Product Prices (USD/bbl)
              </h2>
              <div className="grid grid-cols-2 gap-3">
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
            </section>

            <section className="space-y-4 rounded-xl border border-white/10 bg-armit-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">
                Operating Cost
              </h2>
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
            </section>
          </div>

          {/* Results panel */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetricCard label="Total Revenue" value={formatUsd0(result.totalRevenue)} sub="USD/day" />
              <MetricCard
                label="Crude Cost"
                value={formatUsd0(result.crudeCostPerDay)}
                sub="USD/day"
                accent="amber"
              />
              <MetricCard
                label="Gross Margin"
                value={formatUsd0(result.grossMarginPerDay)}
                sub="USD/day"
                valueClassName={result.grossMarginPerDay >= 0 ? 'text-armit-emerald' : 'text-armit-coral'}
              />
              <MetricCard
                label="Gross Margin / bbl"
                value={formatUsd2(result.grossMarginPerBbl)}
                sub="USD/bbl"
                valueClassName={result.grossMarginPerBbl >= 0 ? 'text-armit-emerald' : 'text-armit-coral'}
              />
              <MetricCard
                label="Net Margin / bbl"
                value={formatUsd2(result.netMarginPerBbl)}
                sub="USD/bbl, after variable opex"
                valueClassName={result.netMarginPerBbl >= 0 ? 'text-armit-emerald' : 'text-armit-coral'}
              />
              <MetricCard
                label="Net Margin"
                value={formatUsd0(result.netMarginPerDay)}
                sub="USD/day, after variable opex"
                valueClassName={result.netMarginPerDay >= 0 ? 'text-armit-emerald' : 'text-armit-coral'}
              />
            </div>

            <CrackSpreadCompare crack321={result.crack321} armitMargin={result.grossMarginPerBbl} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <YieldTable slate={result.slate} throughputBpd={throughputBpd} />
              <ProductPieChart slate={result.slate} />
            </div>

            <EiiGauge eii={result.eiiProxy} firedDutyGcalPerHr={result.firedDutyGcalPerHr} />
          </div>
        </div>
      </div>
    </div>
  )
}
