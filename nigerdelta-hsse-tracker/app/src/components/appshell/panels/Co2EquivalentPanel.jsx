import { useMemo, useState } from 'react'
import { Globe2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts'
import PanelHeader from './shared/PanelHeader.jsx'
import ResultCard from './shared/ResultCard.jsx'
import FormulaBlock from './shared/FormulaBlock.jsx'
import { useLiveReports } from '../../../hooks/useLiveReports.js'
import { CONSTANTS, calculateCO2Equivalent } from '../../../utils/methaneCalc.js'
import { fmt } from '../../../utils/formatters.js'

export default function Co2EquivalentPanel() {
  const [allReports] = useLiveReports()
  const reports = useMemo(() => allReports.filter((r) => r.methane?.calculated), [allReports])
  const [source, setSource] = useState('manual')
  const [ch4Mass, setCh4Mass] = useState(1)

  const effectiveMass = useMemo(() => {
    if (source === 'manual') return Number(ch4Mass) || 0
    const report = reports.find((r) => r.id === source)
    return report?.methane?.results?.ch4_primary_tonnes ?? 0
  }, [source, ch4Mass, reports])

  const result = useMemo(() => calculateCO2Equivalent(effectiveMass), [effectiveMass])
  const difference = result.co2e_20yr - result.co2e_100yr
  const ratio = result.co2e_100yr > 0 ? result.co2e_20yr / result.co2e_100yr : 0

  const chartData = [
    { name: '20-year (GWP₂₀ = 84)', value: Number(result.co2e_20yr.toFixed(1)), fill: '#F4A261' },
    { name: '100-year (GWP₁₀₀ = 29.8)', value: Number(result.co2e_100yr.toFixed(1)), fill: '#2DC653' },
  ]

  return (
    <div className="mx-auto max-w-3xl">
      <PanelHeader
        icon={Globe2}
        color="#2DC653"
        title="CO₂ Equivalent Calculator"
        badges={[`GWP₂₀ = ${CONSTANTS.GWP20}`, `GWP₁₀₀ = ${CONSTANTS.GWP100}`, 'IPCC AR6 WGI 2021']}
      />

      <p className="rounded-lg border border-border bg-card p-4 text-sm leading-normal text-muted">
        Global Warming Potential (GWP) expresses the warming impact of a mass of methane relative to the
        same mass of CO₂ over a given time horizon. Methane traps far more heat than CO₂ in the short
        term but breaks down in the atmosphere within roughly a decade, so the 20-year horizon captures
        its outsized near-term climate impact, while the 100-year horizon is the conventional basis for
        long-term national inventories and carbon markets.
      </p>

      <div className="mt-6">
        <label className="mb-1.5 block text-xs font-medium text-text" htmlFor="co2e-source">
          CH₄ Mass Source
        </label>
        <select
          id="co2e-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-safe focus:outline-none"
        >
          <option value="manual">Manual entry</option>
          {reports.map((r) => (
            <option key={r.id} value={r.id}>
              Load from {r.referenceNumber} ({fmt.tonnes(r.methane.results.ch4_primary_tonnes)} CH₄)
            </option>
          ))}
        </select>

        {source === 'manual' && (
          <div className="mt-3">
            <label className="mb-1.5 block text-xs font-medium text-text" htmlFor="co2e-mass">
              CH₄ Mass (tonnes)
            </label>
            <input
              id="co2e-mass"
              type="number"
              min="0"
              step="0.001"
              value={ch4Mass}
              onChange={(e) => setCh4Mass(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-safe focus:outline-none"
            />
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ResultCard title="20-Year CO₂e" subtitle={`GWP₂₀ = ${CONSTANTS.GWP20}`}>
          <p className="text-2xl font-bold text-amber">{fmt.co2e(result.co2e_20yr)}</p>
          <FormulaBlock citation="IPCC AR6 WGI 2021" lines={[`CO2e = ${fmt.tonnes(effectiveMass)} × ${CONSTANTS.GWP20} = ${fmt.co2e(result.co2e_20yr)}`]} />
        </ResultCard>
        <ResultCard title="100-Year CO₂e" subtitle={`GWP₁₀₀ = ${CONSTANTS.GWP100}`}>
          <p className="text-2xl font-bold text-safe">{fmt.co2e(result.co2e_100yr)}</p>
          <FormulaBlock citation="IPCC AR6 WGI 2021" lines={[`CO2e = ${fmt.tonnes(effectiveMass)} × ${CONSTANTS.GWP100} = ${fmt.co2e(result.co2e_100yr)}`]} />
        </ResultCard>
      </div>

      <ResultCard title="Difference Between Horizons" subtitle="Why the time frame you choose matters">
        <p className="text-lg font-bold text-text">
          {fmt.co2e(difference)} higher over 20 years ({ratio.toFixed(2)}× the 100-year figure)
        </p>
      </ResultCard>

      <div className="mt-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-bold text-text">20-Year vs 100-Year Comparison</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 20, right: 12, bottom: 10, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
            <XAxis dataKey="name" tick={{ fill: '#8B9EB7', fontSize: 11 }} />
            <YAxis tick={{ fill: '#8B9EB7', fontSize: 11 }} label={{ value: 't CO₂e', fill: '#8B9EB7', fontSize: 11, angle: -90, position: 'insideLeft' }} />
            <Tooltip contentStyle={{ backgroundColor: '#162840', border: '1px solid #1E3A5F', borderRadius: 8, color: '#F0F4F8', fontSize: 12 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              <LabelList dataKey="value" position="top" fill="#F0F4F8" fontSize={12} />
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
