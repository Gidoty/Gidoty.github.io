// MarginIQ Margin Stress-Tester — scenario + carbon-cost engine.
// Pure functions only, built on the same computeArmitResult pipeline used
// by the calculator, crude advisor, and constraint simulator.

import { computeArmitResult } from './calculations.js'

const OPERATING_DAYS_PER_YEAR = 330

// Corrected from the IPCC natural-gas default CO2 factor, which is
// denominated per GJ (56.1 kg CO2/GJ), not per Gcal. 1 Gcal = 4.184 GJ, so
// the correct per-Gcal figure is ~234.7 kg CO2/Gcal — the same correction
// and reasoning already applied to the furnace card in the constraint
// simulator (src/lib/interventions.js), kept consistent here.
const KG_CO2_PER_GCAL = 56.1 * 4.184

/**
 * CO2 emitted per day from fired heaters, using the same base energy
 * factor as the calculator's EII proxy (throughput * 0.00102 Gcal/bbl).
 * That factor is already a Gcal/DAY figure (bpd * Gcal/bbl = Gcal/day) —
 * an earlier draft of this formula multiplied by 24 again on top of that,
 * which would have inflated CO2 (and every carbon-cost figure downstream)
 * by exactly 24x.
 */
export function computeCo2TonnePerDay(throughputBpd) {
  const qFiredGcalPerDay = throughputBpd * 0.00102
  return (qFiredGcalPerDay * KG_CO2_PER_GCAL) / 1000
}

/** Full margin + carbon bundle for one scenario. */
export function computeScenarioMetrics({
  crude,
  throughputBpd,
  vacuumPressure,
  fccSplitPct,
  fccConversionPct,
  hcDieselYieldPct,
  opexPerBbl,
  scenario,
}) {
  const result = computeArmitResult({
    crude,
    throughputBpd,
    crudeCost: scenario.crudeCost,
    vacuumPressure,
    fccSplitPct,
    fccConversionPct,
    hcDieselYieldPct,
    prices: scenario.prices,
    opexPerBbl,
  })

  const co2TonnePerDay = computeCo2TonnePerDay(throughputBpd)
  const co2TonnePerYear = co2TonnePerDay * OPERATING_DAYS_PER_YEAR
  const co2PerBblKg = (co2TonnePerDay * 1000) / throughputBpd

  const carbonCostPerDay = co2TonnePerDay * scenario.carbonPrice
  const carbonCostPerYear = carbonCostPerDay * OPERATING_DAYS_PER_YEAR
  const carbonCostPctOfGrossMargin =
    result.grossMarginPerDay !== 0 ? (carbonCostPerDay / result.grossMarginPerDay) * 100 : 0

  const carbonAdjustedMarginPerDay = result.grossMarginPerDay - carbonCostPerDay
  const carbonAdjustedPerBbl = carbonAdjustedMarginPerDay / throughputBpd

  return {
    result,
    co2TonnePerDay,
    co2TonnePerYear,
    co2PerBblKg,
    carbonCostPerDay,
    carbonCostPerYear,
    carbonCostPctOfGrossMargin,
    carbonAdjustedMarginPerDay,
    carbonAdjustedPerBbl,
  }
}

/** Crude price at which net margin (post-opex, post-carbon) hits zero. */
export function computeCrudeBreakeven({ totalRevenue, carbonCostPerDay, opexPerBbl, throughputBpd }) {
  return (totalRevenue - carbonCostPerDay - opexPerBbl * throughputBpd) / throughputBpd
}

/** Diesel/AGO price at which net margin (post-opex, post-carbon) hits zero. */
export function computeAgoBreakeven({ crudeCost, opexPerBbl, throughputBpd, carbonCostPerDay, totalRevenue, agoRevenue, agoBpd }) {
  const revenueExclAgo = totalRevenue - agoRevenue
  return (crudeCost * throughputBpd + opexPerBbl * throughputBpd + carbonCostPerDay - revenueExclAgo) / agoBpd
}

const TORNADO_VARIABLES = [
  { key: 'crudeCost', label: 'Crude Cost', get: (s) => s.crudeCost, set: (s, v) => ({ ...s, crudeCost: v }) },
  { key: 'diesel', label: 'Diesel Price', get: (s) => s.prices.diesel, set: (s, v) => ({ ...s, prices: { ...s.prices, diesel: v } }) },
  { key: 'motorSpirit', label: 'Motor Spirit Price', get: (s) => s.prices.motorSpirit, set: (s, v) => ({ ...s, prices: { ...s.prices, motorSpirit: v } }) },
  { key: 'carbonPrice', label: 'Carbon Price', get: (s) => s.carbonPrice, set: (s, v) => ({ ...s, carbonPrice: v }) },
  { key: 'kerosene', label: 'Kerosene Price', get: (s) => s.prices.kerosene, set: (s, v) => ({ ...s, prices: { ...s.prices, kerosene: v } }) },
  { key: 'fuelOil', label: 'Fuel Oil Price', get: (s) => s.prices.fuelOil, set: (s, v) => ({ ...s, prices: { ...s.prices, fuelOil: v } }) },
  { key: 'lpg', label: 'LPG Price', get: (s) => s.prices.lpg, set: (s, v) => ({ ...s, prices: { ...s.prices, lpg: v } }) },
]

/**
 * Margin sensitivity of the base scenario to a +/-10% move in each of 7
 * price variables, sorted by magnitude of impact (largest first).
 */
export function computeTornadoData({ crude, throughputBpd, vacuumPressure, fccSplitPct, fccConversionPct, hcDieselYieldPct, opexPerBbl, baseScenario }) {
  const shared = { crude, throughputBpd, vacuumPressure, fccSplitPct, fccConversionPct, hcDieselYieldPct, opexPerBbl }
  const baseMargin = computeScenarioMetrics({ ...shared, scenario: baseScenario }).carbonAdjustedPerBbl

  const rows = TORNADO_VARIABLES.map((v) => {
    const baseValue = v.get(baseScenario)
    const upScenario = v.set(baseScenario, baseValue * 1.1)
    const downScenario = v.set(baseScenario, baseValue * 0.9)
    const upMargin = computeScenarioMetrics({ ...shared, scenario: upScenario }).carbonAdjustedPerBbl
    const downMargin = computeScenarioMetrics({ ...shared, scenario: downScenario }).carbonAdjustedPerBbl
    return {
      label: v.label,
      impactUp: upMargin - baseMargin,
      impactDown: downMargin - baseMargin,
    }
  })

  return rows.sort(
    (a, b) =>
      Math.max(Math.abs(b.impactUp), Math.abs(b.impactDown)) -
      Math.max(Math.abs(a.impactUp), Math.abs(a.impactDown)),
  )
}

/**
 * Carbon-adjusted margin (USD/bbl) as a function of carbon price, for a
 * given scenario's (carbon-price-independent) gross margin per bbl and the
 * shared CO2 intensity per bbl. Linear in carbon price.
 */
export function carbonAdjustedMarginAtPrice(grossMarginPerBbl, co2PerBblKg, carbonPrice) {
  return grossMarginPerBbl - (co2PerBblKg / 1000) * carbonPrice
}

/** Carbon price at which a scenario's margin hits exactly zero (may be negative or huge). */
export function computeCarbonBreakevenPrice(grossMarginPerBbl, co2PerBblKg) {
  if (co2PerBblKg <= 0) return null
  return grossMarginPerBbl / (co2PerBblKg / 1000)
}

export { OPERATING_DAYS_PER_YEAR }
