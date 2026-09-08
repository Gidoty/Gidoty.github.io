import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SubstrateGrid from '../components/shared/SubstrateGrid.jsx'
import SubstrateDetails from '../components/calculator/SubstrateDetails.jsx'
import WasteInputSection from '../components/calculator/WasteInputSection.jsx'
import AdvancedOptions from '../components/calculator/AdvancedOptions.jsx'
import ResultsPanel from '../components/calculator/ResultsPanel.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import ProgressSteps from '../components/shared/ProgressSteps.jsx'
import { fullYieldCalc, CONDITION_MULTIPLIERS, TEMPERATURE_MULTIPLIERS } from '../utils/calcEngine.js'
import { sha256Hex, formatWATTimestamp } from '../utils/audit.js'
import { useBioCredStore } from '../store/BioCredStore.jsx'

const UNIT_TO_KG = { kg: 1, tonnes: 1000, bags: 50 }

export default function Calculator() {
  const navigate = useNavigate()
  const { setYieldResult, setDigesterPrefill, addScenario, addAuditEntry, markStepComplete } = useBioCredStore()

  const [substrate, setSubstrate] = useState(null)
  const [mode, setMode] = useState('single')
  const [amount, setAmount] = useState('100')
  const [unit, setUnit] = useState('kg')
  const [days, setDays] = useState(30)

  const [useDefaultMoisture, setUseDefaultMoisture] = useState(true)
  const [moisturePct, setMoisturePct] = useState(20)
  const [condition, setCondition] = useState('fresh')
  const [temperature, setTemperature] = useState('mesophilic')

  const [hasCalculated, setHasCalculated] = useState(false)
  const [auditEntry, setAuditEntry] = useState(null)

  const rawAmountKg = useMemo(() => (Number(amount) || 0) * UNIT_TO_KG[unit], [amount, unit])
  const freshWeightKg = useMemo(
    () => (mode === 'daily' ? rawAmountKg * days : rawAmountKg),
    [mode, rawAmountKg, days],
  )
  const dailyWasteKg = mode === 'daily' ? rawAmountKg : freshWeightKg

  const hasError = amount !== '' && Number(amount) <= 0

  const totalSolidsFraction = useDefaultMoisture ? undefined : 1 - moisturePct / 100
  const conditionMultiplier = CONDITION_MULTIPLIERS[condition]
  const temperatureMultiplier = TEMPERATURE_MULTIPLIERS[temperature]

  const yieldResult = useMemo(() => {
    if (!substrate || freshWeightKg <= 0) return null
    return fullYieldCalc({
      substrate,
      freshWeightKg,
      totalSolidsFraction,
      conditionMultiplier,
      temperatureMultiplier,
    })
  }, [substrate, freshWeightKg, totalSolidsFraction, conditionMultiplier, temperatureMultiplier])

  const handleSelectSubstrate = useCallback((s) => {
    setSubstrate(s)
    setMoisturePct(Math.round(s.moistureContent * 100))
  }, [])

  const handleUseRegionalDefault = useCallback((dailyKg) => {
    setMode('daily')
    setUnit('kg')
    setAmount(String(dailyKg))
  }, [])

  const handleCalculate = useCallback(() => {
    if (!yieldResult) return
    setHasCalculated(true)
  }, [yieldResult])

  const handleSizeDigester = useCallback(() => {
    if (substrate) {
      setDigesterPrefill({ substrateId: substrate.id, dailyWasteKg })
    }
    navigate('/digester')
  }, [substrate, dailyWasteKg, setDigesterPrefill, navigate])

  const handleAddToComparison = useCallback(() => {
    if (!substrate || !yieldResult) return
    addScenario({
      id: `${substrate.id}-${Date.now()}`,
      label: substrate.name,
      substrateId: substrate.id,
      freshWeightKg,
      results: yieldResult,
      timestamp: formatWATTimestamp(),
    })
  }, [substrate, yieldResult, freshWeightKg, addScenario])

  // Generate a fresh SHA-256 audit hash whenever the live result changes,
  // once the user has calculated at least once — debounced so a run of
  // keystrokes doesn't flood the log with intermediate states.
  useEffect(() => {
    if (!hasCalculated || !yieldResult || !substrate) return undefined
    let cancelled = false
    const timer = setTimeout(async () => {
      const inputsSnapshot = {
        substrateId: substrate.id,
        freshWeightKg,
        mode,
        unit,
        days,
        condition,
        temperature,
        useDefaultMoisture,
        moisturePct,
      }
      const hash = await sha256Hex({ inputs: inputsSnapshot, results: yieldResult })
      if (cancelled) return
      const entry = {
        id: `${hash}-${Date.now()}`,
        type: 'yield',
        hash,
        timestamp: formatWATTimestamp(),
        inputs: inputsSnapshot,
        results: yieldResult,
      }
      setAuditEntry(entry)
      addAuditEntry(entry)
      setYieldResult({ substrateId: substrate.id, freshWeightKg, dailyWasteKg, results: yieldResult })
      markStepComplete('calculator')
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCalculated, yieldResult])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <ProgressSteps currentStep="calculator" />
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          Methodology: 5-Step Anaerobic Digestion Chain · Peer-reviewed SBY coefficients · 1 m³
          CH₄ = 9.97 kWh LHV (Clarke Energy / TU Delft)
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">Biogas Yield Calculator</h1>
        <p className="mt-2 text-muted">
          Convert your agro-waste volume into biogas, methane, and energy output
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-text">Step 1: Select Your Waste Type</h2>
            <SubstrateGrid selectedId={substrate?.id} onSelect={handleSelectSubstrate} />
            {substrate && (
              <SubstrateDetails substrate={substrate} onUseDefault={handleUseRegionalDefault} />
            )}
          </section>

          <section>
            <WasteInputSection
              mode={mode}
              onModeChange={setMode}
              amount={amount}
              onAmountChange={setAmount}
              unit={unit}
              onUnitChange={setUnit}
              days={days}
              onDaysChange={setDays}
              totalKg={freshWeightKg}
              hasError={hasError}
            />
          </section>

          <section>
            <AdvancedOptions
              useDefaultMoisture={useDefaultMoisture}
              onUseDefaultMoistureChange={setUseDefaultMoisture}
              moisturePct={moisturePct}
              onMoisturePctChange={setMoisturePct}
              condition={condition}
              onConditionChange={setCondition}
              temperature={temperature}
              onTemperatureChange={setTemperature}
            />
          </section>

          <button
            type="button"
            onClick={handleCalculate}
            disabled={!substrate || freshWeightKg <= 0}
            className="h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate Yield
          </button>
        </div>

        <div className="lg:col-span-3">
          {hasCalculated && yieldResult && substrate ? (
            <ResultsPanel
              substrate={substrate}
              result={yieldResult}
              auditEntry={auditEntry}
              onSizeDigester={handleSizeDigester}
              onAddToComparison={handleAddToComparison}
            />
          ) : (
            <EmptyState message="Select a substrate and enter your waste volume to see results" />
          )}
        </div>
      </div>
    </div>
  )
}
