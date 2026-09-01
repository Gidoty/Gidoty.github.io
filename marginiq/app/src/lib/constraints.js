// MarginIQ Constraint Intelligence — simplified LP shadow price engine.
// Pure functions only, derived entirely from the margin pipeline result
// (src/lib/calculations.js) plus unit capacities the user sets.
//
// A shadow price here is always the textbook LP definition: the change in
// margin per ONE additional unit of a binding constraint's capacity (per
// bpd, per mmHg, per MMscfd) — never per an arbitrary batch size. CDU, FCC,
// and HC all derive theirs the same way (compute the $ impact of a 1,000
// unit increment, then divide by 1,000 to normalise back to a per-unit
// rate), so all three are reported and labelled on that same per-unit basis.

const OPERATING_DAYS_PER_YEAR = 330
const H2_DEMAND_HT_MMSCFD = 4.2 // fixed hydrotreater H2 demand
const H2_FACTOR_MMSCFD_PER_BPD = 0.00097
const M3_PER_BBL_APPROX = 0.159 // rounded m3/bbl factor used in the shadow-price deltas below

function utilisationStatus(utilPct) {
  if (utilPct >= 95) return 'BINDING'
  if (utilPct >= 85) return 'NEAR_LIMIT'
  return 'AVAILABLE'
}

function h2Status(demand, supply) {
  if (demand > supply) return 'H2_DEFICIT'
  if (demand > supply * 0.85) return 'H2_TIGHT'
  return 'H2_SUFFICIENT'
}

export const STATUS_META = {
  BINDING: { label: 'BINDING', tone: 'red' },
  NEAR_LIMIT: { label: 'NEAR LIMIT', tone: 'amber' },
  AVAILABLE: { label: 'AVAILABLE', tone: 'green' },
  H2_DEFICIT: { label: 'H2 DEFICIT', tone: 'red' },
  H2_TIGHT: { label: 'H2 TIGHT', tone: 'amber' },
  H2_SUFFICIENT: { label: 'H2 SUFFICIENT', tone: 'green' },
}

/**
 * Runs the constraint/shadow-price analysis for the current plant state.
 * `result` is the output of computeArmitResult(); `capacities` and the
 * remaining fields mirror the calculator's own input state.
 */
export function computeConstraintAnalysis({
  result,
  throughputBpd,
  vacuumPressure,
  capacities,
  prices,
}) {
  const arBpd = result.cdu.atmResidue
  const vgoBpd = result.vdu.vgoBpd
  const fccFeedBpd = result.fcc.feedBpd
  const hcFeedBpd = result.hc.feedBpd
  const netMarginPerBbl = result.netMarginPerBbl

  const utilCdu = (throughputBpd / capacities.cdu) * 100
  const utilVdu = (vgoBpd / capacities.vdu) * 100
  const utilFcc = (fccFeedBpd / capacities.fcc) * 100
  const utilHc = (hcFeedBpd / capacities.hc) * 100

  const h2DemandHc = hcFeedBpd * H2_FACTOR_MMSCFD_PER_BPD
  const h2TotalDemand = h2DemandHc + H2_DEMAND_HT_MMSCFD
  const h2UtilPct = (h2TotalDemand / capacities.h2Supply) * 100

  const statusCdu = utilisationStatus(utilCdu)
  const statusVdu = utilisationStatus(utilVdu)
  const statusFcc = utilisationStatus(utilFcc)
  const statusHc = utilisationStatus(utilHc)
  const statusH2 = h2Status(h2TotalDemand, capacities.h2Supply)

  // CDU: value of one more bpd of crude capacity, at the current net margin.
  const shadowCdu = statusCdu === 'BINDING' ? netMarginPerBbl : 0

  // VDU: value of recovering more VGO by improving (lowering) vacuum pressure.
  const shadowVdu =
    vacuumPressure > 12
      ? arBpd * 0.0071 * (prices.diesel - prices.fuelOil) * 0.46
      : 0

  // FCC: value of one more bpd of FCC feed capacity (naphtha uplift vs. fuel oil).
  const shadowFcc =
    utilFcc >= 85
      ? ((1000 * 0.46 * (1 / 0.74) * M3_PER_BBL_APPROX) * (prices.motorSpirit - prices.fuelOil)) / 1000
      : 0

  // HC: value of one more bpd of Hydrocracker feed capacity (diesel uplift vs. fuel oil).
  const shadowHc =
    utilHc >= 85
      ? ((1000 * 0.68 * (1 / 0.84) * M3_PER_BBL_APPROX) * (prices.diesel - prices.fuelOil)) / 1000
      : 0

  // H2: value of one more MMscfd of hydrogen supply, routed to extra HC feed.
  const shadowH2 =
    statusH2 === 'H2_DEFICIT' || statusH2 === 'H2_TIGHT'
      ? ((1 / H2_FACTOR_MMSCFD_PER_BPD) * 0.68 * (1 / 0.84) * M3_PER_BBL_APPROX) *
        (prices.diesel - prices.fuelOil)
      : 0

  const rows = [
    {
      key: 'cdu',
      unit: 'CDU',
      fullName: 'Crude Distillation Unit',
      actual: throughputBpd,
      capacity: capacities.cdu,
      measure: 'bpd',
      util: utilCdu,
      status: statusCdu,
      shadowPrice: shadowCdu,
      shadowSuffix: '/bpd relaxed',
      incrementLabel: '1 bpd of CDU capacity',
    },
    {
      key: 'vdu',
      unit: 'VDU',
      fullName: 'Vacuum Distillation Unit',
      actual: vgoBpd,
      capacity: capacities.vdu,
      measure: 'bpd',
      util: utilVdu,
      status: statusVdu,
      shadowPrice: shadowVdu,
      shadowSuffix: '/mmHg improved',
      incrementLabel: '1 mmHg of vacuum pressure',
    },
    {
      key: 'fcc',
      unit: 'FCC',
      fullName: 'Fluid Catalytic Cracker',
      actual: fccFeedBpd,
      capacity: capacities.fcc,
      measure: 'bpd',
      util: utilFcc,
      status: statusFcc,
      shadowPrice: shadowFcc,
      shadowSuffix: '/bpd feed relaxed',
      incrementLabel: '1 bpd of FCC feed capacity',
    },
    {
      key: 'hc',
      unit: 'HC',
      fullName: 'Hydrocracker',
      actual: hcFeedBpd,
      capacity: capacities.hc,
      measure: 'bpd',
      util: utilHc,
      status: statusHc,
      shadowPrice: shadowHc,
      shadowSuffix: '/bpd feed relaxed',
      incrementLabel: '1 bpd of Hydrocracker feed capacity',
    },
    {
      key: 'h2',
      unit: 'H2',
      fullName: 'Hydrogen Supply',
      actual: h2TotalDemand,
      capacity: capacities.h2Supply,
      measure: 'MMscfd',
      util: h2UtilPct,
      status: statusH2,
      shadowPrice: shadowH2,
      shadowSuffix: '/MMscfd',
      incrementLabel: '1 MMscfd of H2 supply',
    },
  ]

  const bindingRows = rows.filter((r) => r.status === 'BINDING' || r.status === 'H2_DEFICIT')
  const primaryBottleneck = bindingRows.length
    ? bindingRows.reduce((best, r) => (r.shadowPrice > best.shadowPrice ? r : best))
    : null

  const totalDailyShadowValue = rows.reduce((sum, r) => sum + r.shadowPrice, 0)
  const annualOpportunity = totalDailyShadowValue * OPERATING_DAYS_PER_YEAR

  return {
    rows,
    primaryBottleneck,
    hasBindingConstraint: bindingRows.length > 0,
    annualOpportunity,
    operatingDaysPerYear: OPERATING_DAYS_PER_YEAR,
  }
}
