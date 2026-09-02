import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import {
  STACK_HEIGHT_OPTIONS,
  PRESSURE_OPTIONS,
  DURATION_QUICK_OPTIONS,
} from '../../utils/methaneCalc.js'

const FLARE_TYPES = ['Routine', 'Emergency', 'Production', 'Gathering', 'Processing', 'Unknown']

export default function CalculatorInputs({
  mode,
  gasFlareReports,
  selectedReportId,
  onSelectedReportChange,
  locationName,
  onLocationNameChange,
  flareType,
  onFlareTypeChange,
  durationHours,
  onDurationChange,
  stackHeightId,
  onStackHeightChange,
  pressureId,
  onPressureChange,
  ch4Fraction,
  onCh4FractionChange,
}) {
  const [advancedOpen, setAdvancedOpen] = useState(false)

  return (
    <div className="space-y-6">
      {mode === 'report' ? (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-text" htmlFor="report-select">
            Select Report
          </label>
          {gasFlareReports.length === 0 ? (
            <p className="rounded-lg border border-border bg-panel px-4 py-3 text-sm text-muted">
              No gas flare reports yet.{' '}
              <Link to="/report" className="font-bold text-teal underline underline-offset-2">
                Submit a report first.
              </Link>
            </p>
          ) : (
            <select
              id="report-select"
              value={selectedReportId}
              onChange={(e) => onSelectedReportChange(e.target.value)}
              className="min-h-[48px] w-full rounded-lg border border-border bg-card px-4 text-sm text-text focus:border-teal focus:outline-none"
            >
              <option value="">Select a gas flare report...</option>
              {gasFlareReports.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.referenceNumber} ·{' '}
                  {[report.location.state, report.location.lga].filter(Boolean).join(', ')} ·{' '}
                  {new Date(report.submittedAt).toLocaleDateString()}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text" htmlFor="location-name">
              Location name
            </label>
            <input
              id="location-name"
              type="text"
              value={locationName}
              onChange={(e) => onLocationNameChange(e.target.value)}
              placeholder="e.g. Obrikom flow station"
              className="min-h-[48px] w-full rounded-lg border border-border bg-card px-4 text-sm text-text placeholder:text-muted focus:border-teal focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text" htmlFor="flare-type">
              Flare type
            </label>
            <select
              id="flare-type"
              value={flareType}
              onChange={(e) => onFlareTypeChange(e.target.value)}
              className="min-h-[48px] w-full rounded-lg border border-border bg-card px-4 text-sm text-text focus:border-teal focus:outline-none"
            >
              {FLARE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text" htmlFor="duration">
          Flare Duration (hours)
        </label>
        <input
          id="duration"
          type="number"
          min={0.1}
          max={8760}
          step={0.1}
          value={durationHours}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="min-h-[48px] w-full rounded-lg border border-border bg-card px-4 text-sm text-text focus:border-teal focus:outline-none"
        />
        <p className="mt-1 text-xs text-muted">How long has this flare been burning?</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {DURATION_QUICK_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onDurationChange(option.hours)}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-muted hover:border-teal/40 hover:text-text"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text" htmlFor="stack-height">
          Estimated Flare Stack Height
        </label>
        <select
          id="stack-height"
          value={stackHeightId}
          onChange={(e) => onStackHeightChange(e.target.value)}
          className="min-h-[48px] w-full rounded-lg border border-border bg-card px-4 text-sm text-text focus:border-teal focus:outline-none"
        >
          {STACK_HEIGHT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-muted">
          Stack height helps estimate gas volume. If unknown, select Medium.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-text">Gas Pressure Observation</p>
        <div className="space-y-2">
          {PRESSURE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-4 text-sm text-text has-[:checked]:border-teal has-[:checked]:bg-teal/10"
            >
              <input
                type="radio"
                name="pressure"
                value={option.id}
                checked={pressureId === option.id}
                onChange={(e) => onPressureChange(e.target.value)}
                className="h-4 w-4 accent-teal"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-panel">
        <button
          type="button"
          onClick={() => setAdvancedOpen((prev) => !prev)}
          className="flex min-h-[44px] w-full items-center justify-between px-4 text-sm font-medium text-text"
        >
          Advanced: CH₄ Fraction
          {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {advancedOpen && (
          <div className="border-t border-border px-4 py-4">
            <label className="mb-1.5 block text-sm text-text" htmlFor="ch4-fraction">
              Methane fraction of gas composition: <span className="font-bold">{Math.round(ch4Fraction * 100)}%</span>
            </label>
            <input
              id="ch4-fraction"
              type="range"
              min={0.7}
              max={0.99}
              step={0.01}
              value={ch4Fraction}
              onChange={(e) => onCh4FractionChange(Number(e.target.value))}
              className="w-full accent-teal"
            />
            <p className="mt-2 text-xs text-muted">
              Default 90% is based on published Nigerian associated gas composition data
              (NNPC/DPR). Adjust only if you have specific assay data.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
