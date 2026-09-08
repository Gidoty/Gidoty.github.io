import { useCallback, useEffect, useMemo, useState } from 'react'
import GWPSelector from '../components/GWPSelector.jsx'
import EmissionsContextPanel from '../components/carbon/EmissionsContextPanel.jsx'
import MethodologyCards from '../components/carbon/MethodologyCards.jsx'
import PriceScenarioCards from '../components/carbon/PriceScenarioCards.jsx'
import PoaSection from '../components/carbon/PoaSection.jsx'
import CarbonResultsPanel from '../components/carbon/CarbonResultsPanel.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import ProgressSteps from '../components/shared/ProgressSteps.jsx'
import { SUBSTRATES } from '../data/substrates.js'
import { GWP_OPTIONS, CARBON_MARKET } from '../data/constants.js'
import { METHODOLOGIES } from '../data/methodologies.js'
import { classifyProjectScale, recommendMethodologies, calcCreditRevenue } from '../utils/calcEngine.js'
import { sha256Hex, formatWATTimestamp } from '../utils/audit.js'
import { useBioCredStore } from '../store/BioCredStore.jsx'

export default function Carbon() {
  const { state, setGwpKey, addAuditEntry, markStepComplete } = useBioCredStore()

  const storedResult = state.emissionsResult
  const [manualOverride, setManualOverride] = useState(false)
  const [manualAnnualTonnes, setManualAnnualTonnes] = useState('10')
  const [methodologyId, setMethodologyId] = useState(null)
  const [priceKey, setPriceKey] = useState('vcmMid')
  const [isPoa, setIsPoa] = useState(false)
  const [cpaCount, setCpaCount] = useState(50)
  const [hasCalculated, setHasCalculated] = useState(false)
  const [auditEntry, setAuditEntry] = useState(null)

  const usingStored = Boolean(storedResult) && !manualOverride
  const storedSubstrate = storedResult ? SUBSTRATES[storedResult.substrateId] : null

  const gwpKey = state.gwpKey
  const storedGwpKey = usingStored ? storedResult.gwpKey : gwpKey
  const gwpRatio = GWP_OPTIONS[gwpKey].gwp100 / GWP_OPTIONS[storedGwpKey].gwp100

  const baseAnnualTonnes = usingStored
    ? (storedResult.annualTonnes ?? 0)
    : Number(manualAnnualTonnes) || 0
  const annualTonnes = baseAnnualTonnes * gwpRatio

  const avoidedTonnesByGwp = useMemo(() => {
    const base = GWP_OPTIONS[storedGwpKey].gwp100
    return Object.fromEntries(
      Object.entries(GWP_OPTIONS).map(([key, option]) => [key, baseAnnualTonnes * (option.gwp100 / base)]),
    )
  }, [baseAnnualTonnes, storedGwpKey])

  const classification = classifyProjectScale(annualTonnes)
  const recommendedIds = useMemo(() => recommendMethodologies(annualTonnes), [annualTonnes])
  const activeMethodologyId = methodologyId ?? recommendedIds[0] ?? 'goldStandard'
  const methodology = METHODOLOGIES[activeMethodologyId]

  const canCalculate = Number.isFinite(annualTonnes) && annualTonnes > 0

  useEffect(() => {
    if (!hasCalculated || !canCalculate) return undefined
    let cancelled = false
    const timer = setTimeout(async () => {
      const inputsSnapshot = {
        annualTonnes,
        methodologyId: activeMethodologyId,
        priceKey,
        gwpKey,
        isPoa,
        cpaCount,
      }
      const result = calcCreditRevenue({
        annualTonnes,
        usdPerTonne: CARBON_MARKET[priceKey].usdPerTonne,
      })
      const hash = await sha256Hex({ inputs: inputsSnapshot, result })
      if (cancelled) return
      const entry = {
        id: `${hash}-${Date.now()}`,
        type: 'carbon',
        hash,
        timestamp: formatWATTimestamp(),
        inputs: inputsSnapshot,
        result,
      }
      setAuditEntry(entry)
      addAuditEntry(entry)
      markStepComplete('carbon')
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCalculated, annualTonnes, activeMethodologyId, priceKey, gwpKey, isPoa, cpaCount])

  const handleRecalculate = useCallback(() => setManualOverride(true), [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <ProgressSteps currentStep="carbon" />
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          Gold Standard AWMS v2.0 · CDM AMS-III.D · CDM AMS-III.R · Paris Agreement Article 6.4 ·
          Ecosystem Marketplace SOVCM 2025
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">
          Carbon Credit Value Projector
        </h1>
        <p className="mt-2 text-muted">
          Map your emissions reductions to voluntary carbon market methodologies and estimate
          credit revenue
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <EmissionsContextPanel
              usingStored={usingStored}
              storedSubstrate={storedSubstrate}
              storedResult={storedResult}
              onRecalculate={handleRecalculate}
            />
            {!usingStored && (
              <div className="mt-3">
                <label className="mb-1 block text-sm font-medium text-text" htmlFor="manual-annual">
                  Annual avoided emissions (tonnes CO₂e/year)
                </label>
                <input
                  id="manual-annual"
                  type="number"
                  min="0"
                  value={manualAnnualTonnes}
                  onChange={(e) => setManualAnnualTonnes(e.target.value)}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">GWP Standard</h2>
            <GWPSelector selectedGWP={gwpKey} onChange={setGwpKey} />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">
              Step 1: Select Your Target Carbon Credit Methodology
            </h2>
            <MethodologyCards
              selectedId={activeMethodologyId}
              onSelect={setMethodologyId}
              recommendedIds={recommendedIds}
            />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-text">Step 2: Select Market Scenario</h2>
            <PriceScenarioCards selectedKey={priceKey} onSelect={setPriceKey} />
          </section>

          <section>
            <PoaSection
              isPoa={isPoa}
              onToggle={setIsPoa}
              cpaCount={cpaCount}
              onCpaCountChange={setCpaCount}
              singleAnnualTonnes={annualTonnes}
            />
          </section>

          <button
            type="button"
            onClick={() => setHasCalculated(true)}
            disabled={!canCalculate}
            className="h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate Carbon Credit Value
          </button>
        </div>

        <div className="lg:col-span-3">
          {hasCalculated && canCalculate ? (
            <CarbonResultsPanel
              annualTonnes={annualTonnes}
              selectedPriceKey={priceKey}
              methodology={methodology}
              classification={classification}
              avoidedTonnesByGwp={avoidedTonnesByGwp}
              gwpKey={gwpKey}
              isPoa={isPoa}
              cpaCount={cpaCount}
              auditEntry={auditEntry}
            />
          ) : (
            <EmptyState message="Calculate your emissions avoided first, or enter a figure, to project carbon credit value" />
          )}
        </div>
      </div>
    </div>
  )
}
