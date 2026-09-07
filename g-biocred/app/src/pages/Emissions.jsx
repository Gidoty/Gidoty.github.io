import { useCallback, useEffect, useMemo, useState } from 'react'
import GWPSelector from '../components/GWPSelector.jsx'
import YieldContextPanel from '../components/emissions/YieldContextPanel.jsx'
import DisposalScenarioCards from '../components/emissions/DisposalScenarioCards.jsx'
import LeakagePanel from '../components/emissions/LeakagePanel.jsx'
import EmissionsResultsPanel from '../components/emissions/EmissionsResultsPanel.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import { SUBSTRATES } from '../data/substrates.js'
import { GWP_OPTIONS, IPCC_MANURE } from '../data/constants.js'
import { DISPOSAL_SCENARIOS } from '../data/disposalScenarios.js'
import {
  fullYieldCalc,
  calcEmissionsAvoided,
  classifyProjectScale,
  OPERATING_DAYS_PER_YEAR,
} from '../utils/calcEngine.js'
import { sha256Hex, formatWATTimestamp } from '../utils/audit.js'
import { useBioCredStore } from '../store/BioCredStore.jsx'

export default function Emissions() {
  const { state, setGwpKey, setLeakageFactor, setEmissionsResult, addAuditEntry, addScenario } =
    useBioCredStore()

  const storedYield = state.yieldResult
  const [manualOverride, setManualOverride] = useState(false)
  const [manualSubstrateId, setManualSubstrateId] = useState(null)
  const [manualWeightKg, setManualWeightKg] = useState('100')
  const [scenarioKey, setScenarioKey] = useState(null)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [auditEntry, setAuditEntry] = useState(null)

  const usingStored = Boolean(storedYield) && !manualOverride
  const storedSubstrate = storedYield ? SUBSTRATES[storedYield.substrateId] : null
  const substrate = usingStored ? storedSubstrate : manualSubstrateId ? SUBSTRATES[manualSubstrateId] : null
  const freshWeightKg = usingStored ? storedYield.freshWeightKg : Number(manualWeightKg) || 0
  const hasError = !usingStored && manualWeightKg !== '' && Number(manualWeightKg) <= 0
  const dailyWasteKg = usingStored ? storedYield.dailyWasteKg : freshWeightKg

  const gwpKey = state.gwpKey
  const leakageFactor = state.leakageFactor ?? IPCC_MANURE.digesterLeakage.value

  const baseYield = useMemo(() => {
    if (usingStored) return storedYield.results
    if (!substrate || freshWeightKg <= 0) return null
    return fullYieldCalc({ substrate, freshWeightKg })
  }, [usingStored, storedYield, substrate, freshWeightKg])

  const dailyYield = useMemo(() => {
    if (!substrate || dailyWasteKg <= 0) return null
    return fullYieldCalc({ substrate, freshWeightKg: dailyWasteKg })
  }, [substrate, dailyWasteKg])

  const scenario = scenarioKey ? DISPOSAL_SCENARIOS.find((s) => s.key === scenarioKey) : null
  const gwpOption = GWP_OPTIONS[gwpKey]

  const result = useMemo(() => {
    if (!substrate || !baseYield || !scenario) return null
    return calcEmissionsAvoided({
      substrate,
      vsKg: baseYield.vsKg,
      ch4ProducedM3: baseYield.ch4M3,
      mcf: scenario.value,
      gwp100: gwpOption.gwp100,
      leakageFactor,
    })
  }, [substrate, baseYield, scenario, gwpOption, leakageFactor])

  const dailyResult = useMemo(() => {
    if (!substrate || !dailyYield || !scenario) return null
    return calcEmissionsAvoided({
      substrate,
      vsKg: dailyYield.vsKg,
      ch4ProducedM3: dailyYield.ch4M3,
      mcf: scenario.value,
      gwp100: gwpOption.gwp100,
      leakageFactor,
    })
  }, [substrate, dailyYield, scenario, gwpOption, leakageFactor])

  const annualTonnes =
    dailyResult && dailyResult.avoidedTonnes !== null
      ? dailyResult.avoidedTonnes * OPERATING_DAYS_PER_YEAR
      : null
  const classification = classifyProjectScale(annualTonnes)

  const canCalculate = Boolean(substrate) && freshWeightKg > 0 && Boolean(scenario)

  const handleAddToComparison = useCallback(() => {
    if (!substrate || !result) return
    addScenario({
      id: `${substrate.id}-emissions-${Date.now()}`,
      label: `${substrate.name} (emissions)`,
      substrateId: substrate.id,
      freshWeightKg,
      results: baseYield,
      emissions: result,
      timestamp: formatWATTimestamp(),
    })
  }, [substrate, result, freshWeightKg, baseYield, addScenario])

  useEffect(() => {
    if (!hasCalculated || !result || !substrate || !scenario) return undefined
    let cancelled = false
    const timer = setTimeout(async () => {
      const inputsSnapshot = {
        substrateId: substrate.id,
        freshWeightKg,
        scenarioKey: scenario.key,
        gwpKey,
        leakageFactor,
      }
      const hash = await sha256Hex({ inputs: inputsSnapshot, result })
      if (cancelled) return
      const entry = {
        id: `${hash}-${Date.now()}`,
        type: 'emissions',
        hash,
        timestamp: formatWATTimestamp(),
        inputs: inputsSnapshot,
        result,
      }
      setAuditEntry(entry)
      addAuditEntry(entry)
      setEmissionsResult({
        substrateId: substrate.id,
        freshWeightKg,
        avoidedTonnes: result.avoidedTonnes,
        annualTonnes,
        scenarioKey: scenario.key,
        gwpKey,
        leakageFactor,
      })
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCalculated, result])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          IPCC 2006 Guidelines Vol.4 Ch.10 (Manure Management) · Vol.5 Ch.3 (Waste Disposal) · AR6
          GWP values · CDM Tool 14 (Digester Leakage)
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
          Emissions-Avoided Estimator
        </h1>
        <p className="mt-2 text-muted">
          Quantify the methane emissions your biogas project prevents relative to uncontrolled
          waste disposal
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <YieldContextPanel
              usingStored={usingStored}
              storedSubstrate={storedSubstrate}
              storedYield={storedYield}
              onRecalculate={() => setManualOverride(true)}
              manualSubstrateId={manualSubstrateId}
              onSelectManualSubstrate={setManualSubstrateId}
              manualWeightKg={manualWeightKg}
              onManualWeightChange={setManualWeightKg}
              hasError={hasError}
            />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">Step 1: Select GWP Standard</h2>
            <GWPSelector selectedGWP={gwpKey} onChange={setGwpKey} />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text">
              Step 2: How is this waste currently disposed of?
            </h2>
            <p className="mb-3 mt-1 text-sm text-muted">
              This defines your baseline emissions — the methane that would be released without
              your biogas project.
            </p>
            <DisposalScenarioCards selectedKey={scenarioKey} onSelect={setScenarioKey} />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">Step 3: Project Leakage</h2>
            <LeakagePanel leakageFactor={leakageFactor} onChange={setLeakageFactor} />
          </section>

          <button
            type="button"
            onClick={() => setHasCalculated(true)}
            disabled={!canCalculate}
            className="h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate Emissions Avoided
          </button>
        </div>

        <div className="lg:col-span-3">
          {hasCalculated && result && substrate && scenario ? (
            <EmissionsResultsPanel
              substrate={substrate}
              tsKg={baseYield.tsKg}
              vsKg={baseYield.vsKg}
              ch4ProducedM3={baseYield.ch4M3}
              scenario={scenario}
              gwpOption={gwpOption}
              gwpKey={gwpKey}
              leakageFactor={leakageFactor}
              result={result}
              annualTonnes={annualTonnes}
              classification={classification}
              auditEntry={auditEntry}
              onAddToComparison={handleAddToComparison}
            />
          ) : (
            <EmptyState message="Select a substrate, a disposal scenario, and enter your waste volume to see results" />
          )}
        </div>
      </div>
    </div>
  )
}
