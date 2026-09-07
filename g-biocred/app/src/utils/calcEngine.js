import { ENERGY, IPCC_MANURE, CARBON_MARKET } from '../data/constants.js'

export function calcTotalSolids(freshWeightKg, totalSolidsFraction) {
  return freshWeightKg * totalSolidsFraction
}

export function calcVolatileSolids(totalSolidsKg, vsPctOfTS) {
  return totalSolidsKg * vsPctOfTS
}

export function calcBiogasVolume(volatileSolidsKg, specificBiogasYield) {
  return volatileSolidsKg * specificBiogasYield
}

export function calcMethaneVolume(biogasM3, ch4Content) {
  return biogasM3 * ch4Content
}

export function calcEnergyFromMethane(ch4M3) {
  const totalKwh = ch4M3 * ENERGY.CH4_LHV_KWH_PER_M3
  return {
    totalKwh,
    electricalKwh: totalKwh * ENERGY.ELECTRICAL_EFFICIENCY,
    thermalKwh: totalKwh * ENERGY.THERMAL_EFFICIENCY,
  }
}

// Condition and operating-temperature adjustments (Owhonda, 2024, MSc thesis
// findings on Nigerian cow dung) are applied as multipliers on the
// substrate's published specific biogas yield.
export const CONDITION_MULTIPLIERS = {
  fresh: 1.0,
  aged: 0.85,
  pretreated: 1.15,
}

export const TEMPERATURE_MULTIPLIERS = {
  ambient: 0.8,
  mesophilic: 1.0,
  above38: 0.85,
}

export function fullYieldCalc({
  substrate,
  freshWeightKg,
  totalSolidsFraction,
  conditionMultiplier = 1,
  temperatureMultiplier = 1,
}) {
  const tsFraction = totalSolidsFraction ?? substrate.totalSolids
  const tsKg = calcTotalSolids(freshWeightKg, tsFraction)
  const vsKg = calcVolatileSolids(tsKg, substrate.vsPctOfTS)
  const effectiveSBY = substrate.specificBiogasYield * conditionMultiplier * temperatureMultiplier
  const biogasM3 = calcBiogasVolume(vsKg, effectiveSBY)
  const ch4M3 = calcMethaneVolume(biogasM3, substrate.ch4Content)
  const ch4Kg = ch4M3 * IPCC_MANURE.ch4DensityKgPerM3.value
  const energy = calcEnergyFromMethane(ch4M3)

  return {
    freshWeightKg,
    tsFraction,
    tsKg,
    vsKg,
    baseSBY: substrate.specificBiogasYield,
    effectiveSBY,
    conditionMultiplier,
    temperatureMultiplier,
    biogasM3,
    ch4Content: substrate.ch4Content,
    ch4M3,
    ch4Kg,
    ...energy,
  }
}

// Recommended slurry dilution ratios (water:waste) — not part of the
// Prompt 1 substrate coefficients, so kept alongside the digester sizing
// logic that consumes them.
export const WATER_DILUTION_RATIOS = {
  cowDung: { water: 1, waste: 1, label: '1:1 (water:waste)' },
  poultryLitter: { water: 2, waste: 1, label: '2:1 (water:waste) — dilutes ammonia' },
  cassavaPeels: { water: 1, waste: 2, label: '1:2 (water:waste) — already moist' },
  pome: { water: 0, waste: 1, label: 'No additional water needed' },
}

export const DEFAULT_WATER_RATIO = { water: 1, waste: 1, label: '1:1 (water:waste) — default' }

export function getWaterRatio(substrateId) {
  return WATER_DILUTION_RATIOS[substrateId] ?? DEFAULT_WATER_RATIO
}

export function calcSlurry(dailyWasteKg, substrateId) {
  const ratio = getWaterRatio(substrateId)
  const waterLitres = ratio.waste === 0 ? 0 : dailyWasteKg * (ratio.water / ratio.waste)
  const totalSlurryLitres = dailyWasteKg + waterLitres
  return { ratio, waterLitres, totalSlurryLitres }
}

// Volume = (Daily Input x HRT) x Safety Factor
export function calcDigesterVolume({ dailySlurryLitres, hrtDays, safetyFactor }) {
  const dailySlurryM3 = dailySlurryLitres / 1000
  const baseVolumeM3 = dailySlurryM3 * hrtDays
  const chamberM3 = baseVolumeM3 * safetyFactor
  const gasStorageM3 = chamberM3 * 0.3
  const totalM3 = chamberM3 + gasStorageM3
  return { dailySlurryM3, baseVolumeM3, chamberM3, gasStorageM3, totalM3 }
}

export function sizingCategory(chamberM3) {
  if (chamberM3 < 4) {
    return { label: 'Household scale', description: 'Serves one family’s cooking needs' }
  }
  if (chamberM3 < 10) {
    return {
      label: 'Small farm scale',
      description: 'Serves multiple families or small commercial cooking',
    }
  }
  if (chamberM3 < 50) {
    return {
      label: 'Community/cooperative scale',
      description: 'Suitable for electricity generation',
    }
  }
  return {
    label: 'Commercial scale',
    description: 'Consider professional engineering assessment',
  }
}

// --- Emissions-avoided estimator (IPCC 2006/2019 Tier 1) ---

// The IPCC 2006 Vol.4 Ch.10 manure-management methodology only publishes an
// official maximum methane producing capacity (Bo) for cattle and poultry.
// For every other substrate we fall back to that substrate's own
// peer-reviewed specific biogas yield x CH4 content (Prompt 1 data) as its
// maximum CH4 generation potential — the same physical quantity Bo
// represents, just sourced from the substrate library instead of the IPCC
// manure table.
export function getMaxCH4Potential(substrate, vsKg) {
  if (substrate.id === 'cowDung') {
    const { value, label, source } = IPCC_MANURE.cattleBoAfrica
    return { ch4M3: vsKg * value, bo: value, boLabel: label, boSource: source }
  }
  if (substrate.id === 'poultryLitter') {
    const { value, label, source } = IPCC_MANURE.poultryBo
    return { ch4M3: vsKg * value, bo: value, boLabel: label, boSource: source }
  }
  const bo = substrate.specificBiogasYield * substrate.ch4Content
  return {
    ch4M3: vsKg * bo,
    bo,
    boLabel: `${substrate.name} SBY × CH₄ content`,
    boSource: substrate.source,
  }
}

// E_baseline = CH4_kg x MCF x GWP100 (kg CO2e), returned in tonnes.
// Returns null when the scenario has no MCF (e.g. open burning, which uses
// a combustion-factor formula this tool does not have emission factors for).
export function calcBaselineEmissions({ ch4PotentialM3, mcf, gwp100 }) {
  if (mcf === null || mcf === undefined) return null
  const ch4PotentialKg = ch4PotentialM3 * IPCC_MANURE.ch4DensityKgPerM3.value
  const tonnesCO2e = (ch4PotentialKg * mcf * gwp100) / 1000
  return { ch4PotentialKg, mcf, tonnesCO2e }
}

// Fugitive digester leakage (CDM Tool 14): a fraction of the CH4 actually
// produced by the project's own digester escapes uncombusted.
export function calcProjectEmissions({ ch4ProducedM3, leakageFactor, gwp100 }) {
  const fugitiveM3 = ch4ProducedM3 * leakageFactor
  const fugitiveKg = fugitiveM3 * IPCC_MANURE.ch4DensityKgPerM3.value
  const tonnesCO2e = (fugitiveKg * gwp100) / 1000
  return { fugitiveM3, fugitiveKg, tonnesCO2e }
}

export function calcEmissionsAvoided({ substrate, vsKg, ch4ProducedM3, mcf, gwp100, leakageFactor }) {
  const potential = getMaxCH4Potential(substrate, vsKg)
  const baseline = calcBaselineEmissions({ ch4PotentialM3: potential.ch4M3, mcf, gwp100 })
  const project = calcProjectEmissions({ ch4ProducedM3, leakageFactor, gwp100 })
  const avoidedTonnes = baseline ? baseline.tonnesCO2e - project.tonnesCO2e : null
  const reductionPct =
    baseline && baseline.tonnesCO2e > 0 ? (avoidedTonnes / baseline.tonnesCO2e) * 100 : null
  return { potential, baseline, project, avoidedTonnes, reductionPct }
}

// Standard assumed annual operating-day count for a smallholder biogas
// project (accounts for downtime, feeding gaps, and maintenance).
export const OPERATING_DAYS_PER_YEAR = 330

export function classifyProjectScale(annualTonnes) {
  if (annualTonnes == null) return null
  if (annualTonnes <= 5) {
    return {
      code: 'AMS-III.R',
      label: 'AMS-III.R (household/small farm scale, ≤5 t CO₂e/system/year)',
    }
  }
  if (annualTonnes <= 60000) {
    return {
      code: 'AMS-III.D',
      label: 'AMS-III.D or Gold Standard AWMS (farm/cooperative scale)',
    }
  }
  return {
    code: 'large-scale',
    label: 'Large-scale — Gold Standard combined with Article 6.4 aggregation',
  }
}

// Everyday-life comparison factors for avoided-emissions context, derived
// from the IEA 2023 reference figures the prompt cites (annualised /
// per-unit rates converted to the per-day or per-hour units used here).
export const EMISSIONS_CONTEXT_FACTORS = {
  tonnesPerCarDay: 2.3 / 365, // 2.3 t CO2/car/year
  tonnesPerTreeYear: 0.02, // ~20 kg CO2/tree/year
  tonnesPerCoalPlantHour: (4.7 * 100) / 1000, // 4.7 kg CO2/kWh x 100 kW plant, per hour
}

export function calcEmissionsContext(avoidedTonnes) {
  if (avoidedTonnes == null || avoidedTonnes <= 0) return null
  return {
    carDays: avoidedTonnes / EMISSIONS_CONTEXT_FACTORS.tonnesPerCarDay,
    treeYears: avoidedTonnes / EMISSIONS_CONTEXT_FACTORS.tonnesPerTreeYear,
    coalPlantHours: avoidedTonnes / EMISSIONS_CONTEXT_FACTORS.tonnesPerCoalPlantHour,
  }
}

// --- Carbon credit value projector ---

export function calcCreditRevenue({ annualTonnes, usdPerTonne, ngnPerUsd = CARBON_MARKET.ngnPerUsd }) {
  const annualUsd = annualTonnes * usdPerTonne
  return {
    annualUsd,
    annualNgn: annualUsd * ngnPerUsd,
    year5Usd: annualUsd * 5,
    year10Usd: annualUsd * 10,
    year20Usd: annualUsd * 20,
  }
}

export function calcNPV({ annualUsd, years = 10, discountRate = 0.1 }) {
  return (annualUsd * (1 - Math.pow(1 + discountRate, -years))) / discountRate
}

export function recommendMethodologies(annualTonnes) {
  if (annualTonnes == null) return []
  if (annualTonnes < 5) return ['amsIIIR']
  if (annualTonnes <= 1000) return ['amsIIID', 'goldStandard']
  return ['goldStandard', 'article64']
}

// Assumed annual verification cost (USD) used only for the PoA breakeven
// illustration — the figure the prompt itself specifies for this estimate.
export const POA_ANNUAL_VERIFICATION_COST_USD = 8000

export function calcPoaBreakeven(singleAnnualTonnes, usdPerTonne) {
  if (!singleAnnualTonnes || singleAnnualTonnes <= 0) return null
  return POA_ANNUAL_VERIFICATION_COST_USD / (singleAnnualTonnes * usdPerTonne)
}
