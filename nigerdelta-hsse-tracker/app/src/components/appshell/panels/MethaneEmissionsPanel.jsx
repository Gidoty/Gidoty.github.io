import { useMemo, useState } from 'react'
import { Flame, BookOpen, CheckCircle2, Download } from 'lucide-react'
import PanelHeader from './shared/PanelHeader.jsx'
import CollapsibleSection from './shared/CollapsibleSection.jsx'
import ResultCard from './shared/ResultCard.jsx'
import FormulaBlock from './shared/FormulaBlock.jsx'
import { t } from '../../../data/translations.js'
import { loadRealReports, updateReportInStorage } from '../../../utils/dashboardUtils.js'
import {
  CONSTANTS,
  estimateFlaredVolume,
  calculateCH4,
  calculateCO2Equivalent,
  calculateCO2Combustion,
  calculateContext,
} from '../../../utils/methaneCalc.js'

const FLAME_PRESSURE_OPTIONS = [
  { id: 'low', label: 'Low pressure flare', hint: `~${CONSTANTS.BASE_FLOW_RATES.low.toLocaleString()} m³/hr` },
  { id: 'medium', label: 'Medium pressure flare', hint: `~${CONSTANTS.BASE_FLOW_RATES.medium.toLocaleString()} m³/hr` },
  { id: 'high', label: 'High pressure flare', hint: `~${CONSTANTS.BASE_FLOW_RATES.high.toLocaleString()} m³/hr` },
  { id: 'unknown', label: 'Unknown / not sure', hint: `default ~${CONSTANTS.BASE_FLOW_RATES.unknown.toLocaleString()} m³/hr` },
]

const STACK_OPTIONS = [
  { id: 'small', label: 'Small stack', hint: '< 10 m' },
  { id: 'medium', label: 'Medium stack', hint: '10–30 m' },
  { id: 'large', label: 'Large stack', hint: '30–60 m' },
  { id: 'very_large', label: 'Very large stack', hint: '> 60 m' },
]

const DURATION_PRESETS = [
  { label: '1 hour', hours: 1 },
  { label: '1 day', hours: 24 },
  { label: '1 week', hours: 168 },
  { label: '30 days', hours: 720 },
]

function n(value, digits = 2) {
  return Number(value).toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: 0 })
}

export default function MethaneEmissionsPanel() {
  const [tab, setTab] = useState('report')
  const [reports] = useState(() => loadRealReports().filter((r) => r.incident.type === 'gas_flare'))
  const [selectedReportId, setSelectedReportId] = useState(reports[0]?.id ?? '')
  const [flarePressure, setFlarePressure] = useState('medium')
  const [stackHeight, setStackHeight] = useState('medium')
  const [durationHours, setDurationHours] = useState(24)
  const [customDuration, setCustomDuration] = useState('')
  const [ch4Fraction, setCh4Fraction] = useState(0.9)
  const [saved, setSaved] = useState(false)

  const baseFlowRate = CONSTANTS.BASE_FLOW_RATES[flarePressure]
  const stackMultiplier = CONSTANTS.STACK_MULTIPLIERS[stackHeight]

  const results = useMemo(() => {
    const V_flared = estimateFlaredVolume(baseFlowRate, stackMultiplier, durationHours)
    const ch4 = calculateCH4(V_flared, ch4Fraction)
    const co2e = calculateCO2Equivalent(ch4.primary_tonnes)
    const co2Combustion = calculateCO2Combustion(V_flared)
    const context = calculateContext(co2e.co2e_100yr)
    return { V_flared, ch4, co2e, co2Combustion, context }
  }, [baseFlowRate, stackMultiplier, durationHours, ch4Fraction])

  const handleDurationPreset = (hours) => {
    setDurationHours(hours)
    setCustomDuration('')
  }

  const handleCustomDuration = (value) => {
    setCustomDuration(value)
    const parsed = Number(value)
    if (value !== '' && !Number.isNaN(parsed) && parsed > 0) setDurationHours(parsed)
  }

  const handleSaveToReport = () => {
    if (!selectedReportId) return
    updateReportInStorage(selectedReportId, (report) => ({
      ...report,
      methane: {
        calculated: true,
        calculatedAt: new Date().toISOString(),
        method: 'IPCC 2006 Tier 1',
        inputs: {
          flarePressure,
          baseFlowRate,
          stackHeight,
          stackMultiplier,
          durationHours,
          ch4Fraction,
        },
        results: {
          flaredVolume_m3: results.V_flared,
          ch4_primary_tonnes: results.ch4.primary_tonnes,
          ch4_crosscheck_tonnes: results.ch4.crosscheck_tonnes,
          co2e_20yr_tonnes: results.co2e.co2e_20yr,
          co2e_100yr_tonnes: results.co2e.co2e_100yr,
          co2_combustion_tonnes: results.co2Combustion.co2_tonnes,
        },
      },
    }))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  const selectedReport = reports.find((r) => r.id === selectedReportId)

  return (
    <div className="mx-auto max-w-4xl">
      <PanelHeader
        icon={Flame}
        color="#F4A261"
        title="Methane Emission Estimator"
        badges={['IPCC 2006 Tier 1', 'API Compendium 2009', 'Nigerian Associated Gas: 90% CH₄']}
      />

      <CollapsibleSection title="Scientific Methodology" icon={BookOpen}>
        <p>
          This calculator estimates methane (CH₄) released by a gas flare using the{' '}
          <strong className="text-text">IPCC 2006 Guidelines for National Greenhouse Gas Inventories</strong>{' '}
          (Volume 2, Chapter 4: Fugitive Emissions), Tier 1 default methodology. Tier 1 applies a default
          emission factor to the estimated volume of gas flared, in the absence of operator-measured flow
          data — appropriate for community-observed incidents where exact metering is unavailable.
        </p>
        <p>
          <strong className="text-text">Flared volume</strong> is estimated from a base flow rate for the
          observed flame pressure, scaled by a stack-height multiplier (taller stacks generally indicate
          higher-throughput installations) and the observed duration, following flare-volume estimation
          conventions in the <strong className="text-text">API Compendium of Greenhouse Gas Emissions
          Estimation Methodologies for the Oil and Gas Industry (2009)</strong>.
        </p>
        <p>
          <strong className="text-text">CH₄ emissions</strong> are calculated two ways: the primary IPCC
          Tier 1 emission factor (2,000 tonnes CO₂-equivalent precursor gas per 10⁶ m³ flared), and a
          cross-check based on typical flare combustion efficiency of {CONSTANTS.COMBUSTION_EFFICIENCY * 100}%,
          meaning roughly {CONSTANTS.UNBURNED_FRACTION * 100}% of the gas passes through unburned as raw
          methane. Nigerian associated gas is documented at approximately 90% CH₄ by volume, used as the
          default fraction here.
        </p>
        <p>
          <strong className="text-text">CO₂-equivalent</strong> conversion uses IPCC AR6 (2021) global
          warming potentials: GWP₂₀ = 84 and GWP₁₀₀ = 29.8 — methane's outsized short-term warming effect
          makes the 20-year horizon especially relevant for near-term climate impact from flaring.
        </p>
        <p className="text-xs text-muted">
          Sources: IPCC (2006) Guidelines for National Greenhouse Gas Inventories, Vol. 2, Ch. 4 · API
          Compendium of GHG Emissions Estimation Methodologies for the Oil and Gas Industry (2009) · IPCC
          AR6 WGI (2021), Table 7.SM.7. All estimates are indicative and intended to support community
          documentation, not to substitute for operator-measured emissions data.
        </p>
      </CollapsibleSection>

      <div className="mt-6 flex gap-2 rounded-lg border border-border bg-panel p-1">
        <button
          type="button"
          onClick={() => setTab('report')}
          className={`min-h-[40px] flex-1 rounded-md text-sm font-bold transition-colors ${
            tab === 'report' ? 'bg-amber text-bg' : 'text-muted hover:text-text'
          }`}
        >
          From a Gas Flare Report
        </button>
        <button
          type="button"
          onClick={() => setTab('manual')}
          className={`min-h-[40px] flex-1 rounded-md text-sm font-bold transition-colors ${
            tab === 'manual' ? 'bg-amber text-bg' : 'text-muted hover:text-text'
          }`}
        >
          Manual Entry
        </button>
      </div>

      {tab === 'report' && (
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-text" htmlFor="methane-report-select">
            Select Gas Flare Report
          </label>
          {reports.length === 0 ? (
            <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
              No gas flare reports found yet. Submit one from the Report tab, or switch to Manual Entry.
            </p>
          ) : (
            <select
              id="methane-report-select"
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value)}
              className="min-h-[44px] w-full rounded-lg border border-border bg-panel px-3 text-sm text-text focus:border-amber focus:outline-none"
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.referenceNumber} · {r.location.state ?? 'Unknown state'} ·{' '}
                  {new Date(r.submittedAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
          {selectedReport && (
            <p className="mt-2 text-xs text-muted">
              {t('en', 'severityLevels')[selectedReport.incident.severity]?.label} severity ·{' '}
              {selectedReport.location.display
                ? `${selectedReport.location.display.lat}°N, ${selectedReport.location.display.lng}°E`
                : 'location not captured'}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-text">Flame Pressure</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {FLAME_PRESSURE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFlarePressure(opt.id)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  flarePressure === opt.id ? 'border-amber bg-amber/10' : 'border-border bg-card'
                }`}
              >
                <p className="text-xs font-bold text-text">{opt.label}</p>
                <p className="mt-0.5 text-[11px] text-muted">{opt.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text">Stack Height</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {STACK_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setStackHeight(opt.id)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  stackHeight === opt.id ? 'border-amber bg-amber/10' : 'border-border bg-card'
                }`}
              >
                <p className="text-xs font-bold text-text">{opt.label}</p>
                <p className="mt-0.5 text-[11px] text-muted">{opt.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold text-text">Duration Flaring Was Observed</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleDurationPreset(preset.hours)}
                className={`min-h-[40px] rounded-lg border px-4 text-xs font-bold transition-colors ${
                  durationHours === preset.hours && customDuration === ''
                    ? 'border-amber bg-amber/10 text-amber'
                    : 'border-border bg-card text-muted hover:text-text'
                }`}
              >
                {preset.label}
              </button>
            ))}
            <input
              type="number"
              min="0"
              step="0.5"
              placeholder="Custom hours"
              value={customDuration}
              onChange={(e) => handleCustomDuration(e.target.value)}
              className="min-h-[40px] w-32 rounded-lg border border-border bg-card px-3 text-xs text-text focus:border-amber focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text">CH₄ Fraction of Associated Gas</h3>
            <span className="text-sm font-bold text-amber">{Math.round(ch4Fraction * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.7"
            max="0.98"
            step="0.01"
            value={ch4Fraction}
            onChange={(e) => setCh4Fraction(Number(e.target.value))}
            className="mt-2 w-full accent-amber"
          />
          <p className="mt-1 text-[11px] text-muted">Nigerian associated gas default: 90%</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-bold text-text">Results</h2>

        <ResultCard title="Flared Volume" subtitle="Estimated gas volume flared over the observed duration">
          <p className="text-2xl font-bold text-text">{n(results.V_flared, 0)} m³</p>
          <div className="mt-3">
            <FormulaBlock
              lines={[
                'V = baseFlowRate × stackMultiplier × durationHours',
                `V = ${baseFlowRate.toLocaleString()} × ${stackMultiplier} × ${durationHours} = ${n(results.V_flared, 0)} m³`,
              ]}
            />
          </div>
        </ResultCard>

        <ResultCard title="CH₄ Emitted" subtitle="Two independent estimation methods">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-amber/40 bg-bg p-3">
              <p className="text-xs font-bold text-amber">Primary — IPCC Tier 1</p>
              <p className="mt-1 text-xl font-bold text-text">{n(results.ch4.primary_tonnes, 3)} t CH₄</p>
              <FormulaBlock
                lines={[
                  'CH4 = V_flared × 2000 / 1,000,000',
                  `CH4 = ${n(results.V_flared, 0)} × 0.002 = ${n(results.ch4.primary_tonnes, 3)} t`,
                ]}
              />
            </div>
            <div className="rounded-lg border border-border bg-bg p-3">
              <p className="text-xs font-bold text-muted">Cross-check — Combustion efficiency</p>
              <p className="mt-1 text-xl font-bold text-text">{n(results.ch4.crosscheck_tonnes, 3)} t CH₄</p>
              <FormulaBlock
                lines={[
                  'CH4 = V × ch4Fraction × 2% unburned × 0.67 kg/m³ / 1000',
                  `CH4 = ${n(results.V_flared, 0)} × ${ch4Fraction} × 0.02 × 0.67 / 1000 = ${n(results.ch4.crosscheck_tonnes, 3)} t`,
                ]}
              />
            </div>
          </div>
        </ResultCard>

        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard title="CO₂ Equivalent (20-yr)" subtitle="GWP₂₀ = 84">
            <p className="text-2xl font-bold text-teal">{n(results.co2e.co2e_20yr, 1)} t CO₂e</p>
            <FormulaBlock lines={[`CO2e = ${n(results.ch4.primary_tonnes, 3)} × 84 = ${n(results.co2e.co2e_20yr, 1)} t`]} />
          </ResultCard>
          <ResultCard title="CO₂ Equivalent (100-yr)" subtitle="GWP₁₀₀ = 29.8">
            <p className="text-2xl font-bold text-teal">{n(results.co2e.co2e_100yr, 1)} t CO₂e</p>
            <FormulaBlock lines={[`CO2e = ${n(results.ch4.primary_tonnes, 3)} × 29.8 = ${n(results.co2e.co2e_100yr, 1)} t`]} />
          </ResultCard>
        </div>

        <div className="rounded-lg border border-teal/40 bg-teal/5 p-4 text-sm text-text">
          This 100-year CO₂-equivalent impact is roughly comparable to{' '}
          <strong>{results.context.car_years} average passenger cars'</strong> annual emissions, or the
          annual carbon footprint of <strong>{results.context.nigerian_households} average Nigerian
          households</strong>.
          <p className="mt-1 text-[11px] text-muted">
            {results.context.source_cars} · {results.context.source_households}
          </p>
        </div>

        <ResultCard title="CO₂ from Combustion" subtitle="Separate from methane — the carbon dioxide produced when the flare burns">
          <p className="text-2xl font-bold text-text">{n(results.co2Combustion.co2_tonnes, 1)} t CO₂</p>
          <FormulaBlock lines={[`CO2 = ${n(results.V_flared, 0)} × 0.002 = ${n(results.co2Combustion.co2_tonnes, 1)} t`]} />
        </ResultCard>
      </div>

      <div className="mt-6 print:hidden">
        {tab === 'report' ? (
          <button
            type="button"
            onClick={handleSaveToReport}
            disabled={!selectedReportId}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-amber text-sm font-bold text-bg hover:bg-amber/90 disabled:opacity-50"
          >
            <CheckCircle2 className="h-4 w-4" />
            Save to Report
          </button>
        ) : (
          <button
            type="button"
            onClick={() => window.print()}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-amber text-sm font-bold text-amber hover:bg-amber/10"
          >
            <Download className="h-4 w-4" />
            Download Calculation (PDF)
          </button>
        )}
        {saved && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-safe">
            <CheckCircle2 className="h-3.5 w-3.5" /> Saved to report {selectedReport?.referenceNumber}
          </p>
        )}
      </div>
    </div>
  )
}
