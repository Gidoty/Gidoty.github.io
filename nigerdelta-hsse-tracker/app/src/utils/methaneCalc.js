// ─── CONSTANTS ─────────────────────────────
export const COMBUSTION_EFFICIENCY = 0.98 // API standard
export const UNBURNED_FRACTION = 1 - COMBUSTION_EFFICIENCY // 0.02
export const CH4_DENSITY_KG_M3 = 0.67 // at 20°C, 1 atm
export const GWP20 = 84 // IPCC AR6 2021
export const GWP100 = 29.8 // IPCC AR6 2021
export const IPCC_CH4_FACTOR = 2000 // tonnes per 10^6 m3
export const IPCC_CO2_FACTOR = 2000 // tonnes per 10^6 m3

export const DEFAULT_CH4_FRACTION = 0.9
export const DEFAULT_CARBON_PRICE = 15

export const STACK_HEIGHT_OPTIONS = [
  { id: 'small', label: 'Small (< 5m)', multiplier: 0.5 },
  { id: 'medium', label: 'Medium (5–15m)', multiplier: 1.0 },
  { id: 'large', label: 'Large (15–30m)', multiplier: 2.5 },
  { id: 'very_large', label: 'Very Large (>30m)', multiplier: 5.0 },
]

export const PRESSURE_OPTIONS = [
  { id: 'low', label: 'Low pressure — small intermittent flame', flowRate: 500 },
  { id: 'medium', label: 'Medium pressure — steady continuous flame', flowRate: 2000 },
  { id: 'high', label: 'High pressure — large roaring flame', flowRate: 8000 },
  { id: 'unknown', label: 'Unknown', flowRate: 2000 },
]

export const DURATION_QUICK_OPTIONS = [
  { label: '1 hr', hours: 1 },
  { label: '8 hrs', hours: 8 },
  { label: '24 hrs', hours: 24 },
  { label: '7 days', hours: 24 * 7 },
  { label: '30 days', hours: 24 * 30 },
  { label: '1 year', hours: 8760 },
]

// ─── FORMULA 1: Estimate gas volume flared ──
// V_flared (m3) = base_flow_rate * stack_multiplier * duration_hours
export function estimateFlaredVolume(baseFlowRate, stackMultiplier, durationHours) {
  return baseFlowRate * stackMultiplier * durationHours
}

// ─── FORMULA 2: CH4 mass emitted ────────────
export function calculateCH4Emissions(V_flared_m3, ch4Fraction) {
  const ch4_unburned_kg = V_flared_m3 * ch4Fraction * UNBURNED_FRACTION * CH4_DENSITY_KG_M3

  const ch4_ipcc_kg = (V_flared_m3 / 1_000_000) * IPCC_CH4_FACTOR * 1000

  return {
    ch4_unburned_kg,
    ch4_ipcc_kg,
    ch4_primary_kg: ch4_ipcc_kg,
    ch4_primary_tonnes: ch4_ipcc_kg / 1000,
  }
}

// ─── FORMULA 3: CO2 equivalent ──────────────
export function calculateCO2Equivalent(ch4_tonnes) {
  return {
    co2e_20yr: ch4_tonnes * GWP20,
    co2e_100yr: ch4_tonnes * GWP100,
  }
}

// ─── FORMULA 4: CO2 from combustion ─────────
export function calculateCO2Combustion(V_flared_m3) {
  return (V_flared_m3 / 1_000_000) * IPCC_CO2_FACTOR * 1000 // kg
}

// ─── FORMULA 5: Carbon credit potential ─────
export function calculateCarbonCreditValue(co2e_100yr_tonnes, carbonPriceUSD = DEFAULT_CARBON_PRICE) {
  return co2e_100yr_tonnes * carbonPriceUSD
}

export function runFullCalculation({ baseFlowRate, stackMultiplier, durationHours, ch4Fraction, carbonPrice }) {
  const V_flared_m3 = estimateFlaredVolume(baseFlowRate, stackMultiplier, durationHours)
  const ch4 = calculateCH4Emissions(V_flared_m3, ch4Fraction)
  const co2e = calculateCO2Equivalent(ch4.ch4_primary_tonnes)
  const co2_combustion_kg = calculateCO2Combustion(V_flared_m3)
  const carbonCreditValue = calculateCarbonCreditValue(co2e.co2e_100yr, carbonPrice)

  return {
    V_flared_m3,
    ...ch4,
    ...co2e,
    co2_combustion_kg,
    carbonCreditValue,
  }
}
