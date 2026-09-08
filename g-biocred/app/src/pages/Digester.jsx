import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SubstrateGrid from '../components/shared/SubstrateGrid.jsx'
import QuickEstimators from '../components/digester/QuickEstimators.jsx'
import DigesterTypeCards from '../components/digester/DigesterTypeCards.jsx'
import RetentionAndWaterSection from '../components/digester/RetentionAndWaterSection.jsx'
import VolumeSummary from '../components/digester/VolumeSummary.jsx'
import VolumeBreakdown from '../components/digester/VolumeBreakdown.jsx'
import DigesterChart from '../components/digester/DigesterChart.jsx'
import DigesterComparisonTable from '../components/digester/DigesterComparisonTable.jsx'
import DailyGasOutput from '../components/digester/DailyGasOutput.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import ProgressSteps from '../components/shared/ProgressSteps.jsx'
import { SUBSTRATES } from '../data/substrates.js'
import { DIGESTER_TYPES } from '../data/constants.js'
import { calcSlurry, calcDigesterVolume } from '../utils/calcEngine.js'
import { useBioCredStore } from '../store/BioCredStore.jsx'

export default function Digester() {
  const { state, markStepComplete } = useBioCredStore()
  const prefill = state.digesterPrefill

  const [manualOverride, setManualOverride] = useState(false)
  const [manualSubstrateId, setManualSubstrateId] = useState(null)
  const [manualDailyKg, setManualDailyKg] = useState('100')

  const usingPrefill = Boolean(prefill) && !manualOverride
  const substrate = usingPrefill
    ? SUBSTRATES[prefill.substrateId]
    : manualSubstrateId
      ? SUBSTRATES[manualSubstrateId]
      : null
  const dailyWasteKg = usingPrefill ? prefill.dailyWasteKg : Number(manualDailyKg) || 0
  const hasError = !usingPrefill && manualDailyKg !== '' && Number(manualDailyKg) <= 0

  const [digesterTypeKey, setDigesterTypeKey] = useState('fixedDome')
  const digesterType = DIGESTER_TYPES[digesterTypeKey]

  const [useDefaultHrt, setUseDefaultHrt] = useState(true)
  const [hrtDays, setHrtDays] = useState(30)
  const effectiveHrt = useDefaultHrt && substrate ? substrate.hrt : hrtDays

  const [hasCalculated, setHasCalculated] = useState(false)

  const slurry = useMemo(() => calcSlurry(dailyWasteKg, substrate?.id), [dailyWasteKg, substrate])

  const volumes = useMemo(
    () =>
      calcDigesterVolume({
        dailySlurryLitres: slurry.totalSlurryLitres,
        hrtDays: effectiveHrt,
        safetyFactor: digesterType.safetyFactor,
      }),
    [slurry, effectiveHrt, digesterType],
  )

  const handleUseDefaultHrtChange = useCallback(
    (value) => {
      setUseDefaultHrt(value)
      if (!value) setHrtDays(substrate?.hrt ?? 30)
    },
    [substrate],
  )

  const handleUseEstimate = useCallback((value) => {
    setManualDailyKg(String(Math.round(value * 10) / 10))
  }, [])

  const canCalculate = Boolean(substrate) && dailyWasteKg > 0

  const handleCalculate = useCallback(() => {
    setHasCalculated(true)
    markStepComplete('digester')
  }, [markStepComplete])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <ProgressSteps currentStep="digester" />
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          Formula: Volume = (Daily Input × HRT) × Safety Factor · Fixed dome, floating drum, and
          tubular bag configurations
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
          Digester Sizing Calculator
        </h1>
        <p className="mt-2 text-muted">
          Find the optimal digester volume for your waste stream and farm context
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">Waste Input</h2>
            {usingPrefill ? (
              <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-text">
                <p>
                  Using results from your yield calculation. Substrate: {substrate?.name}, Daily
                  input: {dailyWasteKg.toLocaleString('en-NG', { maximumFractionDigits: 1 })} kg/day
                </p>
                <button
                  type="button"
                  onClick={() => setManualOverride(true)}
                  className="mt-2 rounded-md border border-accent px-3 py-1.5 text-xs font-semibold text-text hover:bg-accent/10"
                >
                  Change values
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <SubstrateGrid
                  selectedId={substrate?.id}
                  onSelect={(s) => setManualSubstrateId(s.id)}
                  compact
                />
                <div>
                  <label className="mb-1 block text-sm font-medium text-text" htmlFor="daily-input">
                    Daily fresh waste input (kg/day)
                  </label>
                  <input
                    id="daily-input"
                    type="number"
                    min="0"
                    value={manualDailyKg}
                    onChange={(e) => setManualDailyKg(e.target.value)}
                    className={`w-full rounded-lg border bg-input px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent ${
                      hasError ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {hasError && (
                    <p className="mt-1 text-sm text-danger">
                      Please enter a valid waste weight greater than zero.
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted">
                    Enter total fresh waste per day from your farm/operation.
                  </p>
                </div>
                <QuickEstimators onUseEstimate={handleUseEstimate} />
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">Select Digester Type</h2>
            <DigesterTypeCards selectedType={digesterTypeKey} onSelect={setDigesterTypeKey} />
          </section>

          <section>
            <RetentionAndWaterSection
              substrate={substrate}
              useDefaultHrt={useDefaultHrt}
              onUseDefaultHrtChange={handleUseDefaultHrtChange}
              hrtDays={hrtDays}
              onHrtDaysChange={setHrtDays}
              dailyWasteKg={dailyWasteKg}
            />
          </section>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={!canCalculate}
            className="h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate
          </button>
        </div>

        <div className="lg:col-span-3">
          {hasCalculated && canCalculate ? (
            <div className="panel-enter space-y-6">
              <VolumeSummary volumes={volumes} digesterType={digesterType} />
              <VolumeBreakdown
                slurry={slurry}
                volumes={volumes}
                digesterType={digesterType}
                dailyWasteKg={dailyWasteKg}
                hrtDays={effectiveHrt}
              />
              <DailyGasOutput substrate={substrate} dailyWasteKg={dailyWasteKg} />
              <DigesterChart volumes={volumes} />
              <DigesterComparisonTable
                dailySlurryLitres={slurry.totalSlurryLitres}
                hrtDays={effectiveHrt}
                selectedType={digesterTypeKey}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/emissions"
                  className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:scale-[1.02]"
                >
                  Calculate Emissions Avoided →
                </Link>
                <Link
                  to="/calculator"
                  className="rounded-lg border border-accent px-5 py-3 text-center text-sm font-semibold text-text hover:bg-accent/10"
                >
                  Back to Yield Calculator →
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState message="Select a substrate/digester type and enter your daily waste input to see results" />
          )}
        </div>
      </div>
    </div>
  )
}
