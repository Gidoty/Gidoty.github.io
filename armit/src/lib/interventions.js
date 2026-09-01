// ARMIT Constraint Relief Simulator — "what-if" intervention engine.
// Pure functions only. Builds on the same rigorous unit models used by the
// calculator (computeFcc / computeHydrocracker from calculations.js) where
// possible, and otherwise follows the simplified shadow-price-style proxy
// formulas established in constraints.js (same 0.159 m3/bbl rounding).
//
// A few formulas here were corrected from a naive first pass — see the
// comments marked FIX for what was wrong and why, verified against standard
// references (IPCC emission factors, dimensional analysis of the mass/heat
// balance, and internal consistency with calculations.js/constraints.js).

import { computeFcc, computeHydrocracker } from './calculations.js'

const OPERATING_DAYS_PER_YEAR = 330
const M3_PER_BBL_APPROX = 0.159
const HC_DENSITY = 0.84
const FCC_NAPHTHA_DENSITY = 0.74

function safeDivide(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : null
}

function paybackAndRoi(dailyGain, interventionCost) {
  const annualGain = dailyGain * OPERATING_DAYS_PER_YEAR
  if (interventionCost <= 0) {
    return { annualGain, paybackDays: 0, roi: null }
  }
  const paybackDays = safeDivide(interventionCost, dailyGain)
  const roi = ((annualGain - interventionCost) / interventionCost) * 100
  return { annualGain, paybackDays, roi }
}

/**
 * Card 1 — VDU Vacuum System Restoration.
 *
 * FIX: the given "Additional_revenue" formula multiplied the raw
 * VGO-times-wt-fraction figure directly by the price spread, skipping the
 * wt%->vol% density conversion that the very same spec's "Additional FCC
 * naphtha" line (and every other yield calc in this app) applies. That
 * silently overstated revenue by ~1/(0.74*0.159) ~= 8.5x for the FCC leg
 * alone, and used no conversion at all for the HC leg. Revenue here is
 * computed on the same converted bpd volumes used for display.
 */
export function computeVduRestoration({ arBpd, currentVacuum, targetVacuum, prices, maintenanceCost }) {
  const vgoCurrentPct = 72.5 - 0.71 * currentVacuum
  const vgoTargetPct = 72.5 - 0.71 * Math.min(targetVacuum, currentVacuum)
  const vgoCurrent = (arBpd * vgoCurrentPct) / 100
  const vgoTarget = (arBpd * vgoTargetPct) / 100
  const additionalVgo = Math.max(0, vgoTarget - vgoCurrent)

  // Assumed 60/40 FCC/HC routing of the recovered VGO (the calculator and
  // crude advisor default split), independent of whatever split the user is
  // exploring in Card 5 — this card is self-contained.
  const additionalNaphthaBpd = (additionalVgo * 0.6 * 0.46 * (1 / FCC_NAPHTHA_DENSITY) * M3_PER_BBL_APPROX)
  const additionalDieselBpd = (additionalVgo * 0.4 * 0.68 * (1 / HC_DENSITY) * M3_PER_BBL_APPROX)

  const dailyMarginGain =
    additionalNaphthaBpd * (prices.motorSpirit - prices.fuelOil) +
    additionalDieselBpd * (prices.diesel - prices.fuelOil)

  const { annualGain, paybackDays, roi } = paybackAndRoi(dailyMarginGain, maintenanceCost)

  return {
    additionalVgo,
    additionalNaphthaBpd,
    additionalDieselBpd,
    dailyMarginGain,
    annualGain,
    paybackDays,
    roi,
    cost: maintenanceCost,
  }
}

/**
 * Card 2 — Hydrogen Supply Stabilisation.
 * Formulas given here were already dimensionally consistent (the revenue
 * line applies the same density conversion as the displayed diesel volume),
 * so no fix was needed — implemented as specified.
 */
export function computeH2Restoration({
  currentH2,
  targetH2,
  hcCapacity,
  currentHc,
  prices,
  interventionCost,
  additionalH2OpexDaily,
}) {
  const additionalH2 = Math.max(0, targetH2 - currentH2)
  const additionalHcFeedUncapped = additionalH2 / 0.00097
  const headroom = Math.max(0, hcCapacity - currentHc)
  const cappedAdditionalHc = Math.min(additionalHcFeedUncapped, headroom)

  const additionalDieselBpd = cappedAdditionalHc * 0.68 * (1 / HC_DENSITY) * M3_PER_BBL_APPROX
  const revenueGain = additionalDieselBpd * (prices.diesel - prices.fuelOil)
  const dailyMarginGain = revenueGain - additionalH2OpexDaily

  const { annualGain, paybackDays, roi } = paybackAndRoi(dailyMarginGain, interventionCost)

  return {
    additionalHcFeed: cappedAdditionalHc,
    additionalDieselBpd,
    dailyMarginGain,
    annualGain,
    paybackDays,
    roi,
    cost: interventionCost,
  }
}

/**
 * Card 3 — CDU Furnace Efficiency Improvement.
 *
 * FIX 1 (mass flow units): "mass_flow = throughput * 0.15899 * sg * 1000 / 24"
 * is exactly calculations.js's kg/day feed-mass formula divided by 24 — i.e.
 * it yields kg/hr, not t/hr as originally labelled. Sanity check: at 60,000
 * bpd and sg~0.86 that's ~341,829 kg/hr = 341.8 t/hr, which is the right
 * order of magnitude for a 60 kbpd CDU's crude mass rate. Treating that
 * 341,829 figure as if it were already in t/hr (as the unfixed formula
 * would) inflates furnace duty ~1000x to ~21,000 Gcal/hr — not a real
 * furnace. Fixed by converting kg/hr -> Gcal/hr in one step (/1e6 instead
 * of /1000), which is arithmetically identical to correctly converting
 * mass_flow to t/hr first and then applying the given "/1000" step.
 *
 * FIX 2 (CO2 factor): "56.1 kg CO2/Gcal" is the IPCC default natural-gas
 * CO2 emission factor, but that figure (IPCC 2006 Guidelines Vol.2 Table
 * 1.4) is denominated per GJ, not per Gcal (56,100 kg/TJ = 56.1 kg/GJ).
 * 1 Gcal = 4.184 GJ, so the correct per-Gcal factor is 56.1 x 4.184 ~= 234.7
 * kg CO2/Gcal — independently corroborated by typical natural-gas emission
 * intensity figures (~200-235 kg CO2/Gcal thermal). Using 56.1 directly
 * against Gcal would understate CO2 savings by roughly 4.2x.
 */
export function computeFurnaceEfficiency({
  throughputBpd,
  crudeSg,
  currentEfficiencyPct,
  targetEfficiencyPct,
  fuelGasCostPerGcal,
  interventionCost,
}) {
  const CP_BLEND = 0.52 // kcal/kg.C
  const DELTA_T = 118 // C
  const KCAL_PER_GCAL = 1_000_000
  const KG_CO2_PER_GCAL = 56.1 * 4.184 // corrected from the raw per-GJ IPCC factor

  const massFlowKgPerHr = (throughputBpd * 0.15899 * crudeSg * 1000) / 24
  const qNetGcalPerHr = (massFlowKgPerHr * CP_BLEND * DELTA_T) / KCAL_PER_GCAL

  const qCurrent = qNetGcalPerHr / (currentEfficiencyPct / 100)
  const qTarget = qNetGcalPerHr / (Math.max(targetEfficiencyPct, currentEfficiencyPct) / 100)
  const qSaved = Math.max(0, qCurrent - qTarget)

  const fuelSavedPerDay = qSaved * 24
  const dailySaving = fuelSavedPerDay * fuelGasCostPerGcal
  const co2ReductionKgPerDay = fuelSavedPerDay * KG_CO2_PER_GCAL
  const co2ReductionTonnesPerYear = (co2ReductionKgPerDay * OPERATING_DAYS_PER_YEAR) / 1000

  const { annualGain, paybackDays, roi } = paybackAndRoi(dailySaving, interventionCost)

  return {
    qNetGcalPerHr,
    fuelSavedPerDay,
    dailyMarginGain: dailySaving,
    annualGain,
    paybackDays,
    roi,
    co2ReductionKgPerDay,
    co2ReductionTonnesPerYear,
    cost: interventionCost,
  }
}

/**
 * Card 4 — FCC Catalyst Activity Improvement.
 *
 * FIX: the feed-mass conversion used a hardcoded SG of 0.87 for the FCC
 * feed, disconnected from the actual selected crude used everywhere else
 * in the app for this exact calculation (calculations.js always uses the
 * real crude's SG). Replaced with the baseline crude's SG for consistency
 * with the established feed-mass convention used by the calculator,
 * constraint simulator, and crude advisor.
 */
export function computeFccCatalyst({
  fccFeedBpd,
  crudeSg,
  currentConversionPct,
  targetConversionPct,
  msPrice,
  additionalCatalystCostDaily,
  interventionCost,
}) {
  const convImprovement = Math.max(0, targetConversionPct - currentConversionPct)
  const additionalNaphthaWtPct = convImprovement * 0.85
  const ronImprovement = convImprovement * 0.4

  const feedMassKgPerDay = fccFeedBpd * 0.15899 * crudeSg * 1000
  const additionalNaphthaBpd =
    (additionalNaphthaWtPct / 100) * feedMassKgPerDay / (FCC_NAPHTHA_DENSITY * 158.987)

  const revenueGain = additionalNaphthaBpd * msPrice
  const dailyMarginGain = revenueGain - additionalCatalystCostDaily

  const { annualGain, paybackDays, roi } = paybackAndRoi(dailyMarginGain, interventionCost)

  return {
    additionalNaphthaBpd,
    ronImprovement,
    dailyMarginGain,
    annualGain,
    paybackDays,
    roi,
    cost: interventionCost,
  }
}

/**
 * Card 5 — VGO Routing Optimisation (FCC/HC feed rebalancing).
 * Per the spec's own instruction ("run full yield calculation for both
 * splits"), this reuses the exact computeFcc/computeHydrocracker engine
 * from the calculator rather than a separate simplified proxy, so it can't
 * drift from the rest of the app's yield model.
 */
export function computeVguRouting({
  vgoBpd,
  crudeSg,
  fccConversionPct,
  hcDieselYieldPct,
  currentPctFcc,
  targetPctFcc,
  prices,
}) {
  function unitRevenuePerDay(pctFcc) {
    const fccFeed = (vgoBpd * pctFcc) / 100
    const hcFeed = vgoBpd * (1 - pctFcc / 100)
    const fcc = computeFcc(fccFeed, crudeSg, fccConversionPct)
    const hc = computeHydrocracker(hcFeed, crudeSg, hcDieselYieldPct)
    return {
      fccFeed,
      hcFeed,
      fcc,
      hc,
      revenue:
        fcc.lpgBpd * prices.lpg +
        fcc.naphthaBpd * prices.motorSpirit +
        fcc.lcoBpd * prices.lcoClo +
        fcc.cloBpd * prices.lcoClo +
        hc.naphthaBpd * prices.motorSpirit +
        hc.dieselBpd * prices.diesel,
    }
  }

  const current = unitRevenuePerDay(currentPctFcc)
  const target = unitRevenuePerDay(targetPctFcc)

  const dailyMarginGain = target.revenue - current.revenue

  let recommendation
  if (prices.diesel > prices.motorSpirit + 5) {
    recommendation = 'Shift more VGO to HC for diesel premium.'
  } else if (prices.motorSpirit > prices.diesel + 5) {
    recommendation = 'Shift more VGO to FCC for gasoline premium.'
  } else {
    recommendation = 'Current split is near optimal for the current price environment.'
  }

  return {
    current,
    target,
    dailyMarginGain,
    annualGain: dailyMarginGain * OPERATING_DAYS_PER_YEAR,
    recommendation,
    naphthaDelta: target.fcc.naphthaBpd + target.hc.naphthaBpd - (current.fcc.naphthaBpd + current.hc.naphthaBpd),
    dieselDelta: target.hc.dieselBpd - current.hc.dieselBpd,
    lpgDelta: target.fcc.lpgBpd - current.fcc.lpgBpd,
  }
}

export { OPERATING_DAYS_PER_YEAR }
