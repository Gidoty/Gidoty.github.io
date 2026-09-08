import { useCallback, useEffect, useMemo, useState } from 'react'
import DigestateInputsPanel from '../components/digestate/DigestateInputsPanel.jsx'
import PriceBasisPanel from '../components/digestate/PriceBasisPanel.jsx'
import ChemicalFertiliserPanel from '../components/digestate/ChemicalFertiliserPanel.jsx'
import DigestateResultsPanel from '../components/digestate/DigestateResultsPanel.jsx'
import EmptyState from '../components/shared/EmptyState.jsx'
import { SUBSTRATES } from '../data/substrates.js'
import { DIGESTATE_NPK } from '../data/constants.js'
import { DIGESTATE_RECOVERY_RATES, FERTILIZER_PRICES } from '../data/digestateEconomics.js'
import { calcDigestateNPK, calcFertiliserValue } from '../utils/calcEngine.js'
import { sha256Hex, formatWATTimestamp } from '../utils/audit.js'
import { useBioCredStore } from '../store/BioCredStore.jsx'

export default function Digestate() {
  const { state, setDigestateResult, addAuditEntry } = useBioCredStore()

  const storedYield = state.yieldResult
  const [manualOverride, setManualOverride] = useState(false)
  const [manualSubstrateId, setManualSubstrateId] = useState(null)
  const [manualWeightKg, setManualWeightKg] = useState('100')
  const [recoveryMode, setRecoveryMode] = useState('slurry')
  const [priceBasis, setPriceBasis] = useState('ngn')
  const [useCustomPrices, setUseCustomPrices] = useState(false)
  const [customPrices, setCustomPrices] = useState({ N: '2500', P: '3200', K: '2800' })
  const [hasCalculated, setHasCalculated] = useState(false)
  const [auditEntry, setAuditEntry] = useState(null)

  const usingStored = Boolean(storedYield) && !manualOverride
  const storedSubstrate = storedYield ? SUBSTRATES[storedYield.substrateId] : null
  const substrate = usingStored ? storedSubstrate : manualSubstrateId ? SUBSTRATES[manualSubstrateId] : null
  const freshWeightKg = usingStored ? storedYield.freshWeightKg : Number(manualWeightKg) || 0
  const hasError = !usingStored && manualWeightKg !== '' && Number(manualWeightKg) <= 0

  const recovery = DIGESTATE_RECOVERY_RATES[recoveryMode]
  const digestateKg = freshWeightKg * recovery.rate

  const prices = useMemo(
    () =>
      useCustomPrices
        ? {
            N: Number(customPrices.N) || 0,
            P: Number(customPrices.P) || 0,
            K: Number(customPrices.K) || 0,
          }
        : FERTILIZER_PRICES[priceBasis],
    [useCustomPrices, customPrices, priceBasis],
  )

  const npk = useMemo(() => {
    if (!substrate || digestateKg <= 0) return null
    return calcDigestateNPK({ digestateKg, npkFractions: DIGESTATE_NPK[substrate.id] })
  }, [substrate, digestateKg])

  const value = useMemo(() => {
    if (!npk) return null
    return calcFertiliserValue({ ...npk, prices })
  }, [npk, prices])

  const dailyTotalValueNgn = useMemo(() => {
    if (!usingStored || !substrate) return 0
    const dailyDigestateKg = storedYield.dailyWasteKg * recovery.rate
    const dailyNpk = calcDigestateNPK({ digestateKg: dailyDigestateKg, npkFractions: DIGESTATE_NPK[substrate.id] })
    return calcFertiliserValue({ ...dailyNpk, prices: FERTILIZER_PRICES.ngn }).totalValue
  }, [usingStored, storedYield, substrate, recovery])

  const showCombinedEconomics = usingStored && Boolean(state.emissionsResult) && value !== null
  const digestateValueNgnForCombined = priceBasis === 'ngn' || useCustomPrices ? value?.totalValue ?? 0 : (value?.totalValue ?? 0) * 1600

  const canCalculate = Boolean(substrate) && freshWeightKg > 0

  useEffect(() => {
    if (!hasCalculated || !npk || !value || !substrate) return undefined
    let cancelled = false
    const timer = setTimeout(async () => {
      const inputsSnapshot = {
        substrateId: substrate.id,
        freshWeightKg,
        recoveryMode,
        priceBasis,
        useCustomPrices,
        customPrices,
      }
      const result = { npk, value }
      const hash = await sha256Hex({ inputs: inputsSnapshot, result })
      if (cancelled) return
      const entry = {
        id: `${hash}-${Date.now()}`,
        type: 'digestate',
        hash,
        timestamp: formatWATTimestamp(),
        inputs: inputsSnapshot,
        result,
      }
      setAuditEntry(entry)
      addAuditEntry(entry)
      setDigestateResult({
        substrateId: substrate.id,
        freshWeightKg,
        digestateKg,
        npk,
        value,
        priceBasis,
      })
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCalculated, npk, value])

  const handleCustomPriceChange = useCallback((nutrient, val) => {
    setCustomPrices((prev) => ({ ...prev, [nutrient]: val }))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-block rounded-full border border-border bg-panel px-4 py-1.5 text-xs text-muted">
          NPK fractions: Tambone et al. (2010); Nkoa (2014) · Nigerian fertiliser market prices
          2025 · World Bank commodity reference
        </span>
        <h1 className="mt-4 text-3xl font-bold text-text sm:text-4xl">Digestate Nutrient Estimator</h1>
        <p className="mt-2 text-muted">
          Quantify the fertiliser value of your biogas digestate — the often overlooked economic
          benefit of anaerobic digestion
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-8 lg:col-span-2">
          <DigestateInputsPanel
            usingStored={usingStored}
            storedSubstrate={storedSubstrate}
            storedFreshWeightKg={storedYield?.freshWeightKg}
            onChangeInputs={() => setManualOverride(true)}
            manualSubstrateId={manualSubstrateId}
            onSelectManualSubstrate={setManualSubstrateId}
            manualWeightKg={manualWeightKg}
            onManualWeightChange={setManualWeightKg}
            hasError={hasError}
            recoveryMode={recoveryMode}
            onRecoveryModeChange={setRecoveryMode}
          />

          <PriceBasisPanel
            priceBasis={priceBasis}
            onPriceBasisChange={setPriceBasis}
            useCustomPrices={useCustomPrices}
            onUseCustomPricesChange={setUseCustomPrices}
            customPrices={customPrices}
            onCustomPriceChange={handleCustomPriceChange}
          />

          <ChemicalFertiliserPanel />

          <button
            type="button"
            onClick={() => setHasCalculated(true)}
            disabled={!canCalculate}
            className="h-14 w-full rounded-lg bg-accent text-lg font-semibold text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Calculate Digestate Value
          </button>
        </div>

        <div className="lg:col-span-3">
          {hasCalculated && npk && value && substrate ? (
            <DigestateResultsPanel
              substrate={substrate}
              freshWeightKg={freshWeightKg}
              digestateKg={digestateKg}
              npk={npk}
              value={value}
              prices={prices}
              priceBasis={useCustomPrices ? priceBasis : priceBasis}
              showAnnual={usingStored}
              dailyTotalValueNgn={dailyTotalValueNgn}
              showCombinedEconomics={showCombinedEconomics}
              electricalKwh={storedYield?.results?.electricalKwh ?? 0}
              annualCarbonTonnes={state.emissionsResult?.annualTonnes ?? 0}
              digestateValueNgnForCombined={digestateValueNgnForCombined}
              auditEntry={auditEntry}
            />
          ) : (
            <EmptyState message="Select a substrate and enter your waste weight to see digestate value" />
          )}
        </div>
      </div>
    </div>
  )
}
