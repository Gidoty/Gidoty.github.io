import { useMemo, useState } from 'react'
import { Leaf, Download } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import PanelHeader from './shared/PanelHeader.jsx'
import ResultCard from './shared/ResultCard.jsx'
import FormulaBlock from './shared/FormulaBlock.jsx'
import { useLiveReports } from '../../../hooks/useLiveReports.js'
import { calculateCarbonValue } from '../../../utils/methaneCalc.js'
import { fmt } from '../../../utils/formatters.js'

const PRICE_MARKERS = [15, 30, 50, 75]
const VALIDITY_OPTIONS = [5, 10, 20]

const MARKET_REFERENCE = [
  { market: 'Voluntary Carbon Market (average)', range: '$1 – $15 / tCO₂e' },
  { market: 'Gold Standard certified credits', range: '$10 – $30 / tCO₂e' },
  { market: 'Verra VCS certified credits', range: '$5 – $25 / tCO₂e' },
  { market: 'EU Emissions Trading System (compliance)', range: '$60 – $100 / tCO₂e' },
  { market: 'Nigeria indicative flare-out incentive', range: '$15 – $30 / tCO₂e' },
]

export default function CarbonCreditPotentialPanel() {
  const [allReports] = useLiveReports()
  const reports = useMemo(() => allReports.filter((r) => r.methane?.calculated), [allReports])
  const [source, setSource] = useState('manual')
  const [co2eInput, setCo2eInput] = useState(100)
  const [carbonPrice, setCarbonPrice] = useState(15)
  const [discountRate, setDiscountRate] = useState(10)
  const [validity, setValidity] = useState(10)

  const co2e = useMemo(() => {
    if (source === 'manual') return Number(co2eInput) || 0
    const report = reports.find((r) => r.id === source)
    return report?.methane?.results?.co2e_100yr_tonnes ?? 0
  }, [source, co2eInput, reports])

  const value = useMemo(() => calculateCarbonValue(co2e, Number(carbonPrice)), [co2e, carbonPrice])
  const annualRevenue = value.value_usd
  const totalUndiscounted = annualRevenue * validity
  const rate = Number(discountRate) / 100

  const npv = useMemo(() => {
    let sum = 0
    for (let year = 1; year <= validity; year += 1) {
      sum += annualRevenue / (1 + rate) ** year
    }
    return sum
  }, [annualRevenue, rate, validity])

  const chartData = useMemo(() => {
    const rows = []
    let cumulative = 0
    for (let year = 1; year <= validity; year += 1) {
      cumulative += annualRevenue
      rows.push({ year: `Year ${year}`, cumulative: Number(cumulative.toFixed(0)) })
    }
    return rows
  }, [annualRevenue, validity])

  return (
    <div className="mx-auto max-w-3xl">
      <PanelHeader
        icon={Leaf}
        color="#2DC653"
        title="Carbon Credit Potential Estimator"
        badges={['Paris Agreement Article 6.4', 'Indicative only']}
      />

      <div className="rounded-lg border border-amber/40 bg-amber/5 p-4 text-sm leading-normal text-text">
        <strong className="text-amber">Legal context:</strong> Carbon credits from flare reduction or
        elimination require independent third-party verification against a recognised methodology
        (e.g. Gold Standard, Verra VCS) and, for use toward Nationally Determined Contributions or
        international transfer, authorisation under Article 6.4 of the Paris Agreement. Figures produced
        here are indicative estimates for advocacy and negotiation purposes only — they are{' '}
        <strong>not</strong> issued, tradeable, or verified credits.
      </div>

      <div className="mt-6">
        <label className="mb-1.5 block text-xs font-medium text-text" htmlFor="ccp-source">
          CO₂e Basis
        </label>
        <select
          id="ccp-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-safe focus:outline-none"
        >
          <option value="manual">Manual entry</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              Load from {r.referenceNumber} ({fmt.co2e(r.methane.results.co2e_100yr_tonnes)}/yr)
            </option>
          ))}
        </select>
        {source === 'manual' && (
          <input
            type="number"
            min="0"
            step="1"
            value={co2eInput}
            onChange={(e) => setCo2eInput(e.target.value)}
            className="mt-3 min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-safe focus:outline-none"
            aria-label="CO2e tonnes per year"
          />
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text">Carbon Price ($/tCO₂e)</h3>
          <span className="text-sm font-bold text-safe">${carbonPrice}</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={carbonPrice}
          onChange={(e) => setCarbonPrice(Number(e.target.value))}
          className="mt-2 w-full accent-safe"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          {PRICE_MARKERS.map((marker) => (
            <button key={marker} type="button" onClick={() => setCarbonPrice(marker)} className="hover:text-safe">
              ${marker}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text">Discount Rate</h3>
          <span className="text-sm font-bold text-safe">{discountRate}%</span>
        </div>
        <input
          type="range"
          min="5"
          max="20"
          step="1"
          value={discountRate}
          onChange={(e) => setDiscountRate(Number(e.target.value))}
          className="mt-2 w-full accent-safe"
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-text">Credit Validity Period</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {VALIDITY_OPTIONS.map((yrs) => (
            <button
              key={yrs}
              type="button"
              onClick={() => setValidity(yrs)}
              className={`min-h-[44px] rounded-lg border text-sm font-bold transition-colors ${
                validity === yrs ? 'border-safe bg-safe/10 text-safe' : 'border-border bg-card text-muted'
              }`}
            >
              {yrs} years
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <ResultCard title="Annual Revenue" subtitle="At current CO₂e and price">
          <p className="text-2xl font-bold text-safe">{fmt.usd(annualRevenue)}</p>
          <FormulaBlock citation="Indicative Carbon Pricing" lines={[`Value = ${fmt.tonnes(co2e)} × $${carbonPrice} = ${fmt.usd(annualRevenue)}`]} />
        </ResultCard>
        <ResultCard title="Total Undiscounted" subtitle={`Over ${validity} years`}>
          <p className="text-2xl font-bold text-text">{fmt.usd(totalUndiscounted)}</p>
        </ResultCard>
      </div>

      <ResultCard title="Net Present Value (NPV)" subtitle={`Discounted at ${discountRate}% over ${validity} years`}>
        <p className="text-2xl font-bold text-teal">{fmt.usd(npv)}</p>
        <FormulaBlock
          citation="Discounted Cash Flow"
          lines={[
            'NPV = Σ (annualRevenue / (1 + r)^t) for t = 1..n',
            `NPV = Σ (${fmt.usd(annualRevenue)} / (1 + ${rate})^t) = ${fmt.usd(npv)}`,
          ]}
        />
      </ResultCard>

      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-text">Cumulative Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 10, right: 12, bottom: 10, left: 0 }}>
            <defs>
              <linearGradient id="ccp-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DC653" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#2DC653" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
            <XAxis dataKey="year" tick={{ fill: '#8B9EB7', fontSize: 10 }} />
            <YAxis tick={{ fill: '#8B9EB7', fontSize: 11 }} label={{ value: '$', fill: '#8B9EB7', fontSize: 11, angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={{ backgroundColor: '#162840', border: '1px solid #1E3A5F', borderRadius: 8, color: '#F0F4F8', fontSize: 12 }} />
            <Area type="monotone" dataKey="cumulative" stroke="#2DC653" fill="url(#ccp-fill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-text">Market Reference Prices</h3>
        <table className="mt-3 w-full text-left text-xs">
          <thead>
            <tr className="text-muted">
              <th className="pb-2 font-medium">Market</th>
              <th className="pb-2 font-medium">Typical Range</th>
            </tr>
          </thead>
          <tbody>
            {MARKET_REFERENCE.map((row) => (
              <tr key={row.market} className="border-t border-border">
                <td className="py-2 text-text">{row.market}</td>
                <td className="py-2 text-muted">{row.range}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted">
        Article 6.4 of the Paris Agreement establishes a UN-supervised mechanism for internationally
        transferred mitigation outcomes. Credits generated from flare reduction in Nigeria would need
        host-country authorisation and registration before any transfer or sale — this estimator does
        not constitute such authorisation.
      </p>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-6 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-safe text-sm font-bold text-safe hover:bg-safe/10 print:hidden"
      >
        <Download className="h-4 w-4" />
        Download Assessment (PDF)
      </button>
    </div>
  )
}
