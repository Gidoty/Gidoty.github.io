import { useState } from 'react'
import { FileBarChart, Download } from 'lucide-react'
import PanelHeader from './shared/PanelHeader.jsx'
import ResultCard from './shared/ResultCard.jsx'
import FormulaBlock from './shared/FormulaBlock.jsx'
import { loadRealReports } from '../../../utils/dashboardUtils.js'
import { calculateContext } from '../../../utils/methaneCalc.js'
import { t } from '../../../data/translations.js'

const FLAME_PRESSURE_LABELS = { low: 'Low pressure', medium: 'Medium pressure', high: 'High pressure', unknown: 'Unknown / not sure' }
const STACK_LABELS = { small: 'Small (< 10 m)', medium: 'Medium (10–30 m)', large: 'Large (30–60 m)', very_large: 'Very large (> 60 m)' }

function n(value, digits = 2) {
  return Number(value ?? 0).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

export default function MethaneEmissionReportPanel() {
  const [reports] = useState(() => loadRealReports().filter((r) => r.methane?.calculated))
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? '')
  const report = reports.find((r) => r.id === selectedId)

  if (reports.length === 0) {
    return (
      <div className="mx-auto max-w-3xl">
        <PanelHeader icon={FileBarChart} color="#06B6D4" title="Methane Emission Report" badges={['IPCC 2006 Tier 1']} />
        <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-border bg-card px-4 text-center text-sm text-muted">
          No saved methane calculations yet. Run the Methane Emissions calculator under Calculate and save
          a result to a report to generate a printable summary here.
        </div>
      </div>
    )
  }

  const { inputs, results } = report.methane
  const context = calculateContext(results.co2e_100yr_tonnes)
  const typeLabel = t('en', 'incidentTypes')[report.incident.type] ?? report.incident.type

  return (
    <div className="mx-auto max-w-3xl">
      <PanelHeader icon={FileBarChart} color="#06B6D4" title="Methane Emission Report" badges={['IPCC 2006 Tier 1', 'Full Record Summary']} />

      <label className="mb-1.5 block text-xs font-medium text-text" htmlFor="mer-select">Select Report</label>
      <select
        id="mer-select"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-cyan-400 focus:outline-none print:hidden"
      >
        {reports.map((r) => (
          <option key={r.id} value={r.id}>
            {r.referenceNumber} · {new Date(r.methane.calculatedAt).toLocaleDateString()}
          </option>
        ))}
      </select>

      <div className="mt-6 rounded-xl border border-border bg-card p-5 print:border-0">
        <h2 className="text-lg font-bold text-text">Report {report.referenceNumber}</h2>
        <p className="mt-1 text-sm text-muted">
          {typeLabel} · {report.location.state ?? 'Unknown state'}
          {report.location.lga ? `, ${report.location.lga}` : ''} · Calculated{' '}
          {new Date(report.methane.calculatedAt).toLocaleString()}
        </p>

        <h3 className="mt-5 text-sm font-bold text-text">Inputs</h3>
        <table className="mt-2 w-full text-left text-xs">
          <tbody>
            <tr className="border-t border-border">
              <td className="py-2 text-muted">Flame Pressure</td>
              <td className="py-2 text-text">{FLAME_PRESSURE_LABELS[inputs.flarePressure] ?? inputs.flarePressure} ({inputs.baseFlowRate.toLocaleString()} m³/hr base)</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 text-muted">Stack Height</td>
              <td className="py-2 text-text">{STACK_LABELS[inputs.stackHeight] ?? inputs.stackHeight} (×{inputs.stackMultiplier})</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 text-muted">Duration</td>
              <td className="py-2 text-text">{inputs.durationHours} hours</td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 text-muted">CH₄ Fraction</td>
              <td className="py-2 text-text">{Math.round(inputs.ch4Fraction * 100)}%</td>
            </tr>
          </tbody>
        </table>

        <h3 className="mt-5 text-sm font-bold text-text">Results</h3>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <ResultCard title="Flared Volume">
            <p className="text-lg font-bold text-text">{n(results.flaredVolume_m3, 0)} m³</p>
          </ResultCard>
          <ResultCard title="CH₄ Emitted (IPCC Tier 1)">
            <p className="text-lg font-bold text-text">{n(results.ch4_primary_tonnes, 3)} t</p>
          </ResultCard>
          <ResultCard title="CH₄ Emitted (Cross-check)">
            <p className="text-lg font-bold text-text">{n(results.ch4_crosscheck_tonnes, 3)} t</p>
          </ResultCard>
          <ResultCard title="CO₂ from Combustion">
            <p className="text-lg font-bold text-text">{n(results.co2_combustion_tonnes, 1)} t</p>
          </ResultCard>
          <ResultCard title="CO₂e (20-year)">
            <p className="text-lg font-bold text-amber">{n(results.co2e_20yr_tonnes, 1)} t</p>
          </ResultCard>
          <ResultCard title="CO₂e (100-year)">
            <p className="text-lg font-bold text-safe">{n(results.co2e_100yr_tonnes, 1)} t</p>
          </ResultCard>
        </div>

        <h3 className="mt-5 text-sm font-bold text-text">Formulas Applied</h3>
        <FormulaBlock
          lines={[
            'V_flared = baseFlowRate × stackMultiplier × durationHours',
            'CH4_ipcc = V_flared × 2,000 / 1,000,000',
            'CH4_crosscheck = V_flared × ch4Fraction × 0.02 × 0.67 / 1000',
            'CO2_combustion = V_flared × 2,000 / 1,000,000',
            'CO2e_20yr = CH4_ipcc × 84',
            'CO2e_100yr = CH4_ipcc × 29.8',
          ]}
        />

        <div className="mt-4 rounded-lg border border-teal/40 bg-teal/5 p-3 text-sm text-text">
          Equivalent to roughly <strong>{context.car_years} cars'</strong> annual emissions, or the annual
          footprint of <strong>{context.nigerian_households} average Nigerian households</strong>.
        </div>

        <p className="mt-5 text-[11px] text-muted">
          Methodology: IPCC (2006) Guidelines for National Greenhouse Gas Inventories, Vol. 2, Ch. 4 · API
          Compendium of GHG Emissions Estimation Methodologies for the Oil and Gas Industry (2009) · IPCC
          AR6 WGI (2021), Table 7.SM.7. Generated by the NigerDelta HSSE Tracker on{' '}
          {new Date().toLocaleString()}. Indicative estimate for community documentation, not a substitute
          for operator-measured emissions data.
        </p>
      </div>

      <button
        type="button"
        onClick={() => window.print()}
        className="mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-cyan-400 text-sm font-bold text-cyan-400 hover:bg-cyan-400/10 print:hidden"
      >
        <Download className="h-4 w-4" />
        Download Full Report (PDF)
      </button>
    </div>
  )
}
