// ARMIT Calculation Engine — single point of import for every page's shared
// math. This module does NOT duplicate the calculation logic: it re-exports
// and lightly wraps the already-built, already-verified engine in
// src/lib/calculations.js, src/lib/constraints.js, src/lib/interventions.js,
// and src/lib/stressScenarios.js, so every page provably runs the same
// formulas rather than five near-copies of them.
//
// A note on the "formula standards" this module was asked to verify: three
// of the reference formulas restated for this final pass reproduce bugs
// that were already found, hand-verified, and fixed in earlier prompts —
// keeping them here would reintroduce regressions into calculations this
// build already ships with corrected, tested numbers:
//
//  - Q_net / mass flow: "mass_tph = bpd * 0.15899 * SG * 1000 / 24" computes
//    kg/hr, not t/hr (bpd * m3/bbl * SG * 1000 = kg/day; /24 = kg/hr). Using
//    that figure as if it were tonnes/hr inflates furnace duty ~1000x (see
//    src/lib/interventions.js, computeFurnaceEfficiency, "FIX 1").
//  - CO2 factor: 56.1 is the IPCC natural-gas default in kg CO2/GJ, not
//    kg CO2/Gcal (1 Gcal = 4.184 GJ) — corrected to ~234.7 kg CO2/Gcal in
//    both interventions.js and stressScenarios.js.
//  - 3-2-1 crack spread: "[2*(msPrice*42)+1*(agoPrice*42)-3*crudeCost]/3"
//    only applies the x42 gal->bbl conversion when prices are quoted in
//    $/gal (NYMEX RBOB/heating-oil convention). ARMIT's product prices are
//    already $/bbl, so the x42 double-converts (see src/lib/calculations.js).
//
// "GRM" here is also kept to its standard industry meaning — revenue minus
// crude cost only, with opex netted out separately as "net margin" — rather
// than the restated formula's version, which folds opex into "GRM" (that is
// actually the net/operating margin definition).
//
// yieldCalculation / marginCalculation are one composed call because the
// underlying model computes them together (product yields feed directly
// into revenue and margin); splitting them into two independent functions
// would mean re-deriving the yield slate twice for one page render.

import {
  computeCduCuts,
  computeVdu,
  computeFcc,
  computeHydrocracker,
  computeArmitResult,
} from '../lib/calculations.js'
import { computeConstraintAnalysis } from '../lib/constraints.js'
import {
  computeVduRestoration,
  computeH2Restoration,
  computeFurnaceEfficiency,
  computeFccCatalyst,
  computeVguRouting,
} from '../lib/interventions.js'
import {
  computeScenarioMetrics,
  computeCo2TonnePerDay,
  computeCrudeBreakeven,
  computeAgoBreakeven,
  computeTornadoData,
  carbonAdjustedMarginAtPrice,
  computeCarbonBreakevenPrice,
} from '../lib/stressScenarios.js'

/** API gravity -> specific gravity, standard petroleum industry correlation. */
export function apiToSg(api) {
  return 141.5 / (131.5 + api)
}

/**
 * Unit-by-unit yields (CDU -> VDU -> FCC/HC) for one crude/plant
 * configuration, without the revenue/margin layer — use marginCalculation
 * (or computeArmitResult directly) when margin figures are also needed, so
 * the yield slate isn't derived twice in one render.
 */
export function yieldCalculation({ crude, throughputBpd, vacuumPressure, fccConversionPct, fccSplitPct, hcDieselYieldPct }) {
  const cdu = computeCduCuts(crude, throughputBpd)
  const vdu = computeVdu(cdu.atmResidue, vacuumPressure)
  const fcc = computeFcc((vdu.vgoBpd * fccSplitPct) / 100, crude.sg, fccConversionPct)
  const hc = computeHydrocracker((vdu.vgoBpd * (100 - fccSplitPct)) / 100, crude.sg, hcDieselYieldPct)
  return { cdu, vdu, fcc, hc }
}

/** Revenue, gross/net margin, crack spread, and EII for a full configuration. */
export function marginCalculation(inputs) {
  return computeArmitResult(inputs)
}

/** EII-style energy intensity proxy — see computeArmitResult for the derivation. */
export function eiiCalculation(result) {
  return { eiiProxy: result.eiiProxy, firedDutyGcalPerHr: result.firedDutyGcalPerHr }
}

/** CO2 emissions and carbon cost for a given throughput and carbon price. */
export function carbonCalculation(throughputBpd, carbonPrice) {
  const co2TonnePerDay = computeCo2TonnePerDay(throughputBpd)
  return {
    co2TonnePerDay,
    co2TonnePerYear: co2TonnePerDay * 330,
    co2PerBblKg: (co2TonnePerDay * 1000) / throughputBpd,
    carbonCostPerDay: co2TonnePerDay * carbonPrice,
  }
}

/** 3-2-1 crack spread (simplified benchmark), all inputs in USD/bbl. */
export function crackSpread321(crudeCost, msPrice, agoPrice) {
  return (2 * msPrice + 1 * agoPrice - 3 * crudeCost) / 3
}

export {
  // Full yield + margin pipeline, direct name (equivalent to marginCalculation)
  computeArmitResult,
  // Constraint / shadow-price analysis (calculator page)
  computeConstraintAnalysis,
  // Intervention simulators (constraint simulator page)
  computeVduRestoration,
  computeH2Restoration,
  computeFurnaceEfficiency,
  computeFccCatalyst,
  computeVguRouting,
  // Scenario + carbon stress analysis (stress tester page)
  computeScenarioMetrics,
  computeCrudeBreakeven,
  computeAgoBreakeven,
  computeTornadoData,
  carbonAdjustedMarginAtPrice,
  computeCarbonBreakevenPrice,
}
