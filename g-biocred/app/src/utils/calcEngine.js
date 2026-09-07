import { ENERGY, IPCC_MANURE } from '../data/constants.js'

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
