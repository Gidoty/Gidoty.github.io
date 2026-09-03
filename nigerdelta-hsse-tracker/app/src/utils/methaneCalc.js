// ─── CONSTANTS ───────────────────────────────
export const CONSTANTS = {
  COMBUSTION_EFFICIENCY: 0.98,
  UNBURNED_FRACTION: 0.02,
  CH4_DENSITY_KG_M3: 0.67,
  GWP20: 84,
  GWP100: 29.8,
  IPCC_CH4_FACTOR_TONNES_PER_M3: 2000 / 1_000_000,
  IPCC_CO2_FACTOR_TONNES_PER_M3: 2000 / 1_000_000,
  BASE_FLOW_RATES: {
    low: 500,
    medium: 2000,
    high: 8000,
    unknown: 2000,
  },
  STACK_MULTIPLIERS: {
    small: 0.5,
    medium: 1.0,
    large: 2.5,
    very_large: 5.0,
  },
}

// ─── FORMULA 1: Gas volume flared ────────────
// V_flared (m³) = baseFlowRate × stackMultiplier × durationHours
export function estimateFlaredVolume(baseFlowRate, stackMultiplier, durationHours) {
  return baseFlowRate * stackMultiplier * durationHours
}

// ─── FORMULA 2: CH₄ emissions ────────────────
// Method A — IPCC Tier 1 (PRIMARY):
//   CH4_ipcc = V_flared × IPCC_CH4_FACTOR_TONNES_PER_M3
// Method B — Combustion efficiency (cross-check):
//   CH4_unburned = V_flared × ch4Fraction × UNBURNED_FRACTION × CH4_DENSITY_KG_M3 / 1000
export function calculateCH4(V_flared_m3, ch4Fraction = 0.9) {
  const ch4_ipcc_tonnes = V_flared_m3 * CONSTANTS.IPCC_CH4_FACTOR_TONNES_PER_M3

  const ch4_unburned_tonnes =
    (V_flared_m3 * ch4Fraction * CONSTANTS.UNBURNED_FRACTION * CONSTANTS.CH4_DENSITY_KG_M3) / 1000

  return {
    primary_tonnes: ch4_ipcc_tonnes,
    crosscheck_tonnes: ch4_unburned_tonnes,
    method: 'IPCC 2006 Tier 1',
    source: 'IPCC 2006 Guidelines Vol.2 Ch.4',
  }
}

// ─── FORMULA 3: CO₂ equivalent ───────────────
// CO2e_20yr  = CH4_tonnes × GWP20  (= × 84)
// CO2e_100yr = CH4_tonnes × GWP100 (= × 29.8)
export function calculateCO2Equivalent(ch4_tonnes) {
  return {
    co2e_20yr: ch4_tonnes * CONSTANTS.GWP20,
    co2e_100yr: ch4_tonnes * CONSTANTS.GWP100,
    gwp20_used: CONSTANTS.GWP20,
    gwp100_used: CONSTANTS.GWP100,
    source: 'IPCC AR6 WGI Table 7.SM.7 (2021)',
  }
}

// ─── FORMULA 4: CO₂ from combustion ──────────
// CO2_combustion = V_flared × IPCC_CO2_FACTOR_TONNES_PER_M3
export function calculateCO2Combustion(V_flared_m3) {
  return {
    co2_tonnes: V_flared_m3 * CONSTANTS.IPCC_CO2_FACTOR_TONNES_PER_M3,
    source: 'IPCC 2006 Guidelines Vol.2 Ch.4',
  }
}

// ─── FORMULA 5: Carbon credit value ──────────
// Value = CO2e_100yr × carbon_price_per_tonne
export function calculateCarbonValue(co2e_100yr_tonnes, carbonPriceUSD = 15) {
  return {
    value_usd: co2e_100yr_tonnes * carbonPriceUSD,
    carbon_price_used: carbonPriceUSD,
    co2e_basis: co2e_100yr_tonnes,
    disclaimer:
      'Indicative only. Requires independent third-party verification before credits can be issued. Paris Agreement Article 6.4.',
  }
}

// ─── FORMULA 6: Context comparisons ──────────
export function calculateContext(co2e_100yr) {
  return {
    car_years: (co2e_100yr / 2.3).toFixed(1),
    nigerian_households: (co2e_100yr / 0.89).toFixed(0),
    source_cars: 'IEA (2023): avg car 2.3 tCO₂/year',
    source_households: 'IEA (2023): avg Nigerian 0.89 tCO₂/year',
  }
}
