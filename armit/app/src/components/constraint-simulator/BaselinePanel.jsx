import CRUDES from '../../data/crudes.js'
import { Field, inputClass } from '../calculator/FieldGroup.jsx'
import Slider from '../calculator/Slider.jsx'
import { formatUsd0, formatUsd2 } from '../../lib/format.js'
import { Target } from 'lucide-react'

const PRICE_FIELDS = [
  { key: 'lpg', label: 'LPG' },
  { key: 'motorSpirit', label: 'Motor Spirit' },
  { key: 'kerosene', label: 'Kerosene' },
  { key: 'diesel', label: 'Diesel / AGO' },
  { key: 'fuelOil', label: 'Fuel Oil' },
  { key: 'lcoClo', label: 'LCO / CLO' },
]

export default function BaselinePanel({ state, setState, baseline }) {
  const update = (key, value) => setState((prev) => ({ ...prev, [key]: value }))
  const updatePrice = (key, value) =>
    setState((prev) => ({ ...prev, prices: { ...prev.prices, [key]: value } }))

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-white/10 bg-armit-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-armit-amber">
          Current Operating Baseline
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <Field label="Crude Type">
            <select
              className={inputClass}
              value={state.crudeKey}
              onChange={(e) => update('crudeKey', e.target.value)}
            >
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
              value={state.throughputBpd}
              onChange={(e) => update('throughputBpd', Number(e.target.value))}
            />
          </Field>
          <Field label="Crude Delivered Cost (USD/bbl)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={0.01}
              value={state.deliveredCost}
              onChange={(e) => update('deliveredCost', Number(e.target.value))}
            />
          </Field>
          <Field label="Variable Opex (USD/bbl)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={0.01}
              value={state.opexPerBbl}
              onChange={(e) => update('opexPerBbl', Number(e.target.value))}
            />
          </Field>
          <Slider
            label="Current VDU Vacuum"
            value={state.currentVacuum}
            min={8}
            max={20}
            unit=" mmHg"
            onChange={(v) => update('currentVacuum', v)}
          />
          <Slider
            label="Current FCC Conversion"
            value={state.currentFccConversion}
            min={45}
            max={70}
            unit="%"
            onChange={(v) => update('currentFccConversion', v)}
          />
          <Slider
            label="Current H2 Supply"
            value={state.currentH2Supply}
            min={10}
            max={45}
            unit=" MMscfd"
            onChange={(v) => update('currentH2Supply', v)}
          />
          <Field label="Current HC Throughput (bpd)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={100}
              value={state.currentHcThroughput}
              onChange={(e) => update('currentHcThroughput', Number(e.target.value))}
            />
          </Field>
          <Field label="HC Design Capacity (bpd)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={100}
              value={state.hcDesignCapacity}
              onChange={(e) => update('hcDesignCapacity', Number(e.target.value))}
            />
          </Field>
          <Field label="FCC Feed (bpd)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={100}
              value={state.fccFeedBpd}
              onChange={(e) => update('fccFeedBpd', Number(e.target.value))}
            />
          </Field>
          <Field label="FCC Design Capacity (bpd)">
            <input
              type="number"
              className={inputClass}
              min={0}
              step={100}
              value={state.fccDesignCapacity}
              onChange={(e) => update('fccDesignCapacity', Number(e.target.value))}
            />
          </Field>
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
                value={state.prices[field.key]}
                onChange={(e) => updatePrice(field.key, Number(e.target.value))}
              />
            </Field>
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 rounded-2xl border border-armit-teal/30 bg-armit-teal/5 px-8 py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-armit-teal/10 text-armit-teal">
          <Target size={24} />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wide text-armit-muted">
          Your Current Position
        </div>
        <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-8">
          <div>
            <div className="text-3xl font-bold text-armit-text sm:text-4xl">
              {formatUsd0(baseline.grossMarginPerDay)}
            </div>
            <div className="text-xs text-armit-muted">Baseline gross margin, USD/day</div>
          </div>
          <div className="hidden h-10 w-px bg-white/10 sm:block" />
          <div>
            <div className="text-3xl font-bold text-armit-teal sm:text-4xl">
              {formatUsd2(baseline.netMarginPerBbl)}
            </div>
            <div className="text-xs text-armit-muted">Baseline net margin, USD/bbl</div>
          </div>
        </div>
      </section>
    </div>
  )
}
