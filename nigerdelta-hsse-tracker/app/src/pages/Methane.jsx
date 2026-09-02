import { useMemo, useState } from 'react'
import { CheckCircle2, Printer } from 'lucide-react'
import MethodologyPanel from '../components/methane/MethodologyPanel.jsx'
import CalculatorInputs from '../components/methane/CalculatorInputs.jsx'
import ResultsPanel from '../components/methane/ResultsPanel.jsx'
import { loadRealReports, updateReportInStorage } from '../utils/dashboardUtils.js'
import {
  STACK_HEIGHT_OPTIONS,
  PRESSURE_OPTIONS,
  DEFAULT_CH4_FRACTION,
  DEFAULT_CARBON_PRICE,
  runFullCalculation,
} from '../utils/methaneCalc.js'

export default function Methane() {
  const [mode, setMode] = useState('report')
  const [reports] = useState(() => loadRealReports())
  const gasFlareReports = useMemo(() => reports.filter((r) => r.incident.type === 'gas_flare'), [reports])

  const [selectedReportId, setSelectedReportId] = useState('')
  const [locationName, setLocationName] = useState('')
  const [flareType, setFlareType] = useState('Routine')

  const [durationHours, setDurationHours] = useState(24)
  const [stackHeightId, setStackHeightId] = useState('medium')
  const [pressureId, setPressureId] = useState('medium')
  const [ch4Fraction, setCh4Fraction] = useState(DEFAULT_CH4_FRACTION)
  const [carbonPrice, setCarbonPrice] = useState(DEFAULT_CARBON_PRICE)

  const [saveMessage, setSaveMessage] = useState('')

  const selectedReport = gasFlareReports.find((r) => r.id === selectedReportId)

  const stackMultiplier = STACK_HEIGHT_OPTIONS.find((o) => o.id === stackHeightId)?.multiplier ?? 1
  const baseFlowRate = PRESSURE_OPTIONS.find((o) => o.id === pressureId)?.flowRate ?? 2000

  const results = useMemo(
    () =>
      runFullCalculation({
        baseFlowRate,
        stackMultiplier,
        durationHours: Number(durationHours) || 0,
        ch4Fraction,
        carbonPrice,
      }),
    [baseFlowRate, stackMultiplier, durationHours, ch4Fraction, carbonPrice],
  )

  const handleSaveToReport = () => {
    if (!selectedReport) return
    updateReportInStorage(selectedReport.id, (report) => ({
      ...report,
      methane: {
        calculated: true,
        calculatedAt: new Date().toISOString(),
        methodology: 'IPCC 2006 Tier 1',
        inputs: { baseFlowRate, stackMultiplier, durationHours: Number(durationHours), ch4Fraction },
        results: {
          V_flared_m3: results.V_flared_m3,
          ch4_primary_tonnes: results.ch4_primary_tonnes,
          co2e_20yr: results.co2e_20yr,
          co2e_100yr: results.co2e_100yr,
          co2_combustion_kg: results.co2_combustion_kg,
        },
      },
    }))
    setSaveMessage(`Emission estimate saved to report ${selectedReport.referenceNumber}`)
  }

  const calculationDate = new Date().toLocaleString()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="print:hidden">
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Methane Emission Estimator</h1>
        <p className="mt-2 text-sm text-muted">
          IPCC 2006 Tier 1 Methodology · Nigerian Associated Gas Composition · API Compendium Flare
          Efficiency Standard
        </p>

        <div className="mt-6">
          <MethodologyPanel />
        </div>

        <div className="mt-8 inline-flex rounded-lg border border-border bg-panel p-1">
          {[
            { id: 'report', label: 'From Report' },
            { id: 'manual', label: 'Manual Entry' },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              className={`min-h-[44px] rounded-md px-4 text-sm font-bold transition-colors ${
                mode === option.id ? 'bg-teal text-white' : 'text-muted hover:text-text'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-2">
          <h2 className="text-lg font-bold text-text">
            {mode === 'report' ? 'Calculate from a Flare Report' : 'Manual Entry'}
          </h2>
          <p className="text-sm text-muted">
            {mode === 'report'
              ? 'Link to a submitted gas flare report and estimate its methane emissions'
              : 'Enter flare details manually to estimate methane emissions'}
          </p>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <CalculatorInputs
            mode={mode}
            gasFlareReports={gasFlareReports}
            selectedReportId={selectedReportId}
            onSelectedReportChange={setSelectedReportId}
            locationName={locationName}
            onLocationNameChange={setLocationName}
            flareType={flareType}
            onFlareTypeChange={setFlareType}
            durationHours={durationHours}
            onDurationChange={setDurationHours}
            stackHeightId={stackHeightId}
            onStackHeightChange={setStackHeightId}
            pressureId={pressureId}
            onPressureChange={setPressureId}
            ch4Fraction={ch4Fraction}
            onCh4FractionChange={setCh4Fraction}
          />

          <div>
            <ResultsPanel results={results} carbonPrice={carbonPrice} onCarbonPriceChange={setCarbonPrice} />

            {mode === 'report' ? (
              selectedReport && (
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={handleSaveToReport}
                    className="flex min-h-[52px] w-full items-center justify-center rounded-lg bg-teal text-sm font-bold text-white hover:bg-teal/90"
                  >
                    Save Emission Estimate to Report
                  </button>
                  {saveMessage && (
                    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-safe">
                      <CheckCircle2 className="h-4 w-4" /> {saveMessage}
                    </p>
                  )}
                </div>
              )
            ) : (
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg border border-teal text-sm font-bold text-teal hover:bg-teal/10"
              >
                <Printer className="h-4 w-4" />
                Download Calculation as PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Print-only summary */}
      <div className="hidden print:block">
        <h1 className="text-xl font-bold">NigerDelta HSSE Tracker — Methane Emission Calculation</h1>
        <p className="mt-1 text-sm">
          {mode === 'report' && selectedReport
            ? `Report: ${selectedReport.referenceNumber}`
            : `Location: ${locationName || 'Not specified'} · Flare type: ${flareType}`}
        </p>

        <h2 className="mt-4 font-bold">Inputs</h2>
        <table className="mt-1 w-full text-sm">
          <tbody>
            <tr>
              <td className="py-0.5">Base flow rate</td>
              <td className="py-0.5">{baseFlowRate} m³/hr</td>
            </tr>
            <tr>
              <td className="py-0.5">Stack multiplier</td>
              <td className="py-0.5">×{stackMultiplier}</td>
            </tr>
            <tr>
              <td className="py-0.5">Duration</td>
              <td className="py-0.5">{durationHours} hours</td>
            </tr>
            <tr>
              <td className="py-0.5">CH₄ fraction</td>
              <td className="py-0.5">{Math.round(ch4Fraction * 100)}%</td>
            </tr>
          </tbody>
        </table>

        <h2 className="mt-4 font-bold">Results</h2>
        <table className="mt-1 w-full text-sm">
          <tbody>
            <tr>
              <td className="py-0.5">Gas volume flared</td>
              <td className="py-0.5">{results.V_flared_m3.toLocaleString()} m³</td>
            </tr>
            <tr>
              <td className="py-0.5">CH₄ emissions (IPCC Tier 1, primary)</td>
              <td className="py-0.5">{results.ch4_primary_tonnes.toFixed(2)} tonnes</td>
            </tr>
            <tr>
              <td className="py-0.5">CH₄ emissions (combustion efficiency cross-check)</td>
              <td className="py-0.5">{(results.ch4_unburned_kg / 1000).toFixed(2)} tonnes</td>
            </tr>
            <tr>
              <td className="py-0.5">CO₂e (GWP₂₀)</td>
              <td className="py-0.5">{results.co2e_20yr.toFixed(0)} tonnes</td>
            </tr>
            <tr>
              <td className="py-0.5">CO₂e (GWP₁₀₀)</td>
              <td className="py-0.5">{results.co2e_100yr.toFixed(0)} tonnes</td>
            </tr>
            <tr>
              <td className="py-0.5">CO₂ from combustion</td>
              <td className="py-0.5">{(results.co2_combustion_kg / 1000).toFixed(2)} tonnes</td>
            </tr>
            <tr>
              <td className="py-0.5">Indicative carbon credit value (${carbonPrice}/tonne)</td>
              <td className="py-0.5">USD {results.carbonCreditValue.toFixed(0)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-4 text-xs">
          Methodology: IPCC 2006 Guidelines for National Greenhouse Gas Inventories, Vol. 2, Ch. 4,
          Tier 1. Flare combustion efficiency 98% (API Compendium, 2009). GWP values per IPCC AR6
          WGI (2021), Table 7.SM.7. This estimate is indicative and requires independent
          third-party verification before any carbon credits can be issued or traded.
        </p>

        <p className="mt-4 text-xs">
          Calculated using NigerDelta HSSE Tracker Methane Estimator · IPCC 2006 Tier 1 ·
          gidoty.github.io/nigerdelta-hsse-tracker · {calculationDate}
        </p>
      </div>
    </div>
  )
}
