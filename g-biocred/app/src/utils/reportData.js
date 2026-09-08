import { SUBSTRATES } from '../data/substrates.js'
import { DIGESTATE_NPK, GWP_OPTIONS, CARBON_MARKET, DIGESTER_TYPES, IPCC_MANURE } from '../data/constants.js'
import { DISPOSAL_SCENARIOS } from '../data/disposalScenarios.js'
import { METHODOLOGIES } from '../data/methodologies.js'
import { DIGESTATE_RECOVERY_RATES, FERTILIZER_PRICES, ELECTRICITY_PRICE_NGN_PER_KWH } from '../data/digestateEconomics.js'
import {
  calcEmissionsAvoided,
  classifyProjectScale,
  recommendMethodologies,
  calcCreditRevenue,
  calcNPV,
  calcDigestateNPK,
  calcFertiliserValue,
  calcSlurry,
  calcDigesterVolume,
  calcPoaBreakeven,
  OPERATING_DAYS_PER_YEAR,
} from './calcEngine.js'

const DEFAULT_DIGESTER_TYPE_KEY = 'fixedDome'

// Assembles every number the feasibility report (preview, PDF, CSV) needs
// from the session's stored results, recomputing anything (digester sizing,
// the full emissions chain, daily-basis digestate) that doesn't have its
// own store slot but is fully derivable from calcEngine + stored inputs.
export function buildReportData(state) {
  const storedYield = state.yieldResult
  const hasYield = Boolean(storedYield)
  const substrate = hasYield ? SUBSTRATES[storedYield.substrateId] : null
  const freshWeightKg = storedYield?.freshWeightKg ?? 0
  const dailyWasteKg = storedYield?.dailyWasteKg ?? freshWeightKg
  const yieldResults = storedYield?.results ?? null

  const emissionsInfo = state.emissionsResult
  const hasEmissions = Boolean(emissionsInfo) && hasYield

  let emissionsChain = null
  if (hasEmissions) {
    const scenario = DISPOSAL_SCENARIOS.find((s) => s.key === emissionsInfo.scenarioKey)
    const gwpOption = GWP_OPTIONS[emissionsInfo.gwpKey]
    const leakageFactor = emissionsInfo.leakageFactor ?? IPCC_MANURE.digesterLeakage.value
    const result = calcEmissionsAvoided({
      substrate,
      vsKg: yieldResults.vsKg,
      ch4ProducedM3: yieldResults.ch4M3,
      mcf: scenario?.value ?? null,
      gwp100: gwpOption.gwp100,
      leakageFactor,
    })
    emissionsChain = { scenario, gwpOption, leakageFactor, ...result, annualTonnes: emissionsInfo.annualTonnes }
  }

  const hasCarbon = hasEmissions && emissionsChain?.annualTonnes != null
  let carbon = null
  if (hasCarbon) {
    const annualTonnes = emissionsChain.annualTonnes
    const conservative = calcCreditRevenue({ annualTonnes, usdPerTonne: CARBON_MARKET.vcmConservative.usdPerTonne })
    const mid = calcCreditRevenue({ annualTonnes, usdPerTonne: CARBON_MARKET.vcmMid.usdPerTonne })
    const premium = calcCreditRevenue({ annualTonnes, usdPerTonne: CARBON_MARKET.vcmPremium.usdPerTonne })
    const classification = classifyProjectScale(annualTonnes)
    const recommended = recommendMethodologies(annualTonnes)
    const methodology = METHODOLOGIES[recommended[0]] ?? METHODOLOGIES.goldStandard
    const breakevenN = calcPoaBreakeven(annualTonnes, CARBON_MARKET.vcmMid.usdPerTonne)
    carbon = {
      annualTonnes,
      conservative: { ...conservative, npv: calcNPV({ annualUsd: conservative.annualUsd }) },
      mid: { ...mid, npv: calcNPV({ annualUsd: mid.annualUsd }) },
      premium: { ...premium, npv: calcNPV({ annualUsd: premium.annualUsd }) },
      classification,
      methodology,
      breakevenN,
    }
  }

  let digester = null
  if (hasYield) {
    const digesterType = DIGESTER_TYPES[DEFAULT_DIGESTER_TYPE_KEY]
    const slurry = calcSlurry(dailyWasteKg, substrate.id)
    const volumes = calcDigesterVolume({
      dailySlurryLitres: slurry.totalSlurryLitres,
      hrtDays: substrate.hrt,
      safetyFactor: digesterType.safetyFactor,
    })
    digester = {
      type: digesterType,
      slurry,
      hrtDays: substrate.hrt,
      ...volumes,
      costUsd: volumes.totalM3 * digesterType.cost_usd_per_m3,
    }
  }

  const hasDigestate = Boolean(state.digestateResult)
  let digestate = null
  if (hasDigestate) {
    const { digestateKg, npk, value } = state.digestateResult
    const recovery = DIGESTATE_RECOVERY_RATES.slurry.rate
    const annualDigestateKg = dailyWasteKg * recovery * OPERATING_DAYS_PER_YEAR
    const annualNpk = calcDigestateNPK({ digestateKg: annualDigestateKg, npkFractions: DIGESTATE_NPK[substrate.id] })
    const annualValue = calcFertiliserValue({ ...annualNpk, prices: FERTILIZER_PRICES.ngn })
    digestate = { digestateKg, npk, value, annualDigestateKg, annualNpk, annualValue }
  }

  const hasComparison = Boolean(state.comparisonResult) && state.comparisonResult.scenarios?.length > 0
  const hasAudit = state.auditLog.length > 0

  // Combined economics — daily (per stored batch) and annual (330 days)
  let combined = null
  if (hasYield) {
    const dailyElectricalKwh = yieldResults.electricalKwh
    const dailyEnergyNgn = dailyElectricalKwh * ELECTRICITY_PRICE_NGN_PER_KWH.value
    const dailyCarbonUsd = hasCarbon ? carbon.mid.annualUsd / OPERATING_DAYS_PER_YEAR : 0
    const dailyDigestateNgn = hasDigestate ? digestate.value.totalValue : 0
    const dailyTotalNgn = dailyEnergyNgn + dailyCarbonUsd * CARBON_MARKET.ngnPerUsd + dailyDigestateNgn

    const annualEnergyNgn = dailyEnergyNgn * OPERATING_DAYS_PER_YEAR
    const annualCarbonUsd = hasCarbon ? carbon.mid.annualUsd : 0
    const annualDigestateNgn = hasDigestate ? digestate.annualValue.totalValue : dailyDigestateNgn * OPERATING_DAYS_PER_YEAR
    const annualTotalNgn = annualEnergyNgn + annualCarbonUsd * CARBON_MARKET.ngnPerUsd + annualDigestateNgn

    combined = {
      dailyEnergyNgn,
      dailyCarbonUsd,
      dailyDigestateNgn,
      dailyTotalNgn,
      dailyTotalUsd: dailyTotalNgn / CARBON_MARKET.ngnPerUsd,
      annualEnergyNgn,
      annualCarbonUsd,
      annualDigestateNgn,
      annualTotalNgn,
      annualTotalUsd: annualTotalNgn / CARBON_MARKET.ngnPerUsd,
    }
  }

  return {
    hasYield,
    hasEmissions,
    hasCarbon,
    hasDigester: hasYield,
    hasDigestate,
    hasComparison,
    hasAudit,
    substrate,
    freshWeightKg,
    dailyWasteKg,
    yieldResults,
    emissionsChain,
    carbon,
    digester,
    digestate,
    combined,
    scenarios: hasComparison ? state.comparisonResult.scenarios : [],
    auditLog: state.auditLog,
  }
}
