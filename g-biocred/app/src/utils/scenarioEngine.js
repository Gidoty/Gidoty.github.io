import { SUBSTRATES } from '../data/substrates.js'
import { DIGESTATE_NPK, GWP_OPTIONS, CARBON_MARKET, DIGESTER_TYPES } from '../data/constants.js'
import { DISPOSAL_SCENARIOS } from '../data/disposalScenarios.js'
import { FERTILIZER_PRICES } from '../data/digestateEconomics.js'
import {
  fullYieldCalc,
  CONDITION_MULTIPLIERS,
  TEMPERATURE_MULTIPLIERS,
  calcEmissionsAvoided,
  classifyProjectScale,
  calcCreditRevenue,
  calcNPV,
  calcDigestateNPK,
  calcFertiliserValue,
  calcSlurry,
  calcDigesterVolume,
} from './calcEngine.js'

export const DEFAULT_SCENARIO_INPUTS = {
  name: '',
  substrateId: null,
  dailyWasteKg: '50',
  operatingDays: 330,
  condition: 'fresh',
  temperature: 'mesophilic',
  baselineKey: 'uncoveredLagoonWarm',
  gwpKey: 'AR6_BIOGENIC',
  carbonPriceKey: 'vcmMid',
  digesterTypeKey: 'fixedDome',
}

export function isScenarioReady(inputs) {
  return Boolean(inputs.substrateId) && Number(inputs.dailyWasteKg) > 0
}

export function calcScenarioResult(inputs) {
  const substrate = SUBSTRATES[inputs.substrateId]
  const dailyWasteKg = Number(inputs.dailyWasteKg) || 0
  const operatingDays = Number(inputs.operatingDays) || 330
  const conditionMultiplier = CONDITION_MULTIPLIERS[inputs.condition]
  const temperatureMultiplier = TEMPERATURE_MULTIPLIERS[inputs.temperature]
  const scenario = DISPOSAL_SCENARIOS.find((s) => s.key === inputs.baselineKey)
  const gwpOption = GWP_OPTIONS[inputs.gwpKey]
  const priceOption = CARBON_MARKET[inputs.carbonPriceKey]
  const digesterType = DIGESTER_TYPES[inputs.digesterTypeKey]

  const daily = fullYieldCalc({
    substrate,
    freshWeightKg: dailyWasteKg,
    conditionMultiplier,
    temperatureMultiplier,
  })

  const emissions = calcEmissionsAvoided({
    substrate,
    vsKg: daily.vsKg,
    ch4ProducedM3: daily.ch4M3,
    mcf: scenario.value,
    gwp100: gwpOption.gwp100,
    leakageFactor: 0.1,
  })
  const baselineTonnesPerYear = emissions.baseline ? emissions.baseline.tonnesCO2e * operatingDays : null
  const projectTonnesPerYear = emissions.project.tonnesCO2e * operatingDays
  const avoidedTonnesPerYear = emissions.avoidedTonnes !== null ? emissions.avoidedTonnes * operatingDays : null
  const classification = classifyProjectScale(avoidedTonnesPerYear)

  const annualTonnes = avoidedTonnesPerYear ?? 0
  const revenueConservative = calcCreditRevenue({ annualTonnes, usdPerTonne: CARBON_MARKET.vcmConservative.usdPerTonne })
  const revenueMid = calcCreditRevenue({ annualTonnes, usdPerTonne: CARBON_MARKET.vcmMid.usdPerTonne })
  const revenuePremium = calcCreditRevenue({ annualTonnes, usdPerTonne: CARBON_MARKET.vcmPremium.usdPerTonne })
  const npvMid = calcNPV({ annualUsd: revenueMid.annualUsd })
  const selectedRevenue = { vcmConservative: revenueConservative, vcmMid: revenueMid, vcmPremium: revenuePremium }[
    inputs.carbonPriceKey
  ]

  const annualWasteKg = dailyWasteKg * operatingDays
  const annualDigestateKg = annualWasteKg * 0.92
  const npk = calcDigestateNPK({ digestateKg: annualDigestateKg, npkFractions: DIGESTATE_NPK[substrate.id] })
  const digestateValue = calcFertiliserValue({ ...npk, prices: FERTILIZER_PRICES.ngn })

  const slurry = calcSlurry(dailyWasteKg, substrate.id)
  const volumes = calcDigesterVolume({
    dailySlurryLitres: slurry.totalSlurryLitres,
    hrtDays: substrate.hrt,
    safetyFactor: digesterType.safetyFactor,
  })
  const digesterCostUsd = volumes.totalM3 * digesterType.cost_usd_per_m3

  const annualElectricalKwh = daily.electricalKwh * operatingDays
  const energyValueNgn = annualElectricalKwh * 80
  const carbonValueNgn = revenueMid.annualUsd * CARBON_MARKET.ngnPerUsd
  const digestateValueNgn = digestateValue.totalValue
  const combinedNgn = energyValueNgn + carbonValueNgn + digestateValueNgn

  return {
    substrate,
    inputs,
    yield: {
      freshWeightKgPerDay: dailyWasteKg,
      tsKgPerDay: daily.tsKg,
      vsKgPerDay: daily.vsKg,
      biogasM3PerDay: daily.biogasM3,
      ch4M3PerDay: daily.ch4M3,
      electricalKwhPerDay: daily.electricalKwh,
      thermalKwhPerDay: daily.thermalKwh,
      annualBiogasM3: daily.biogasM3 * operatingDays,
    },
    emissions: {
      baselineTonnesPerYear,
      projectTonnesPerYear,
      avoidedTonnesPerYear,
      reductionPct: emissions.reductionPct,
      classification,
    },
    carbon: {
      annualConservativeUsd: revenueConservative.annualUsd,
      annualMidUsd: revenueMid.annualUsd,
      annualPremiumUsd: revenuePremium.annualUsd,
      npvMidUsd: npvMid,
      selectedAnnualUsd: selectedRevenue.annualUsd,
      priceLabel: priceOption.label,
    },
    digestate: {
      annualDigestateKg,
      nKgPerYear: npk.nKg,
      pKgPerYear: npk.pKg,
      kKgPerYear: npk.kKg,
      valueNgnPerYear: digestateValueNgn,
    },
    digester: {
      recommendedVolumeM3: volumes.totalM3,
      costUsd: digesterCostUsd,
      label: digesterType.label,
    },
    combined: {
      energyValueNgn,
      carbonValueNgn,
      digestateValueNgn,
      totalNgn: combinedNgn,
      totalUsd: combinedNgn / CARBON_MARKET.ngnPerUsd,
    },
  }
}
