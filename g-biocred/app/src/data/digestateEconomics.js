// Fertiliser-market and agronomic reference data for the Digestate Nutrient
// Estimator. This is new domain data Prompt 1's constants.js did not carry
// (it covers biogas yield and carbon accounting, not fertiliser economics),
// so it lives alongside the digestate calculation logic that consumes it —
// same pattern as WATER_DILUTION_RATIOS and DISPOSAL_SCENARIOS.

export const DIGESTATE_RECOVERY_RATES = {
  slurry: {
    label: 'Slurry digestate (92%)',
    rate: 0.92,
    note: 'Digestate volume is estimated at 92% of fresh input weight (water balance; liquid digestate). This accounts for biogas removed as gas and minor dry matter loss.',
  },
  solid: {
    label: 'Separated solid digestate (40%)',
    rate: 0.4,
    note: 'After liquid-solid separation, solid digestate retains ~40% of input weight with higher N and P concentration per kg, but lower total volume. Use slurry unless you have a separation system.',
  },
}

export const FERTILIZER_PRICES = {
  ngn: {
    label: 'Nigerian market prices (NGN)',
    N: 2500,
    P: 3200,
    K: 2800,
    source: 'Nigerian fertiliser market reference 2025 (indicative)',
  },
  usd: {
    label: 'World Bank commodity prices (USD)',
    N: 1.5,
    P: 2.0,
    K: 1.75,
    source: 'World Bank commodity price reference 2025 (indicative)',
  },
}

export const CHEMICAL_FERTILIZERS = [
  { name: 'Urea (46% N)', pricePerKgNgn: 750 },
  { name: 'DAP (18% N, 46% P₂O₅)', pricePerKgNgn: 900 },
  { name: 'NPK 20-10-10', pricePerKgNgn: 650 },
  { name: 'Muriate of Potash (60% K₂O)', pricePerKgNgn: 850 },
]

// Fraction of elemental nutrient in each reference chemical fertiliser
// product, used to express digestate NPK as an equivalent product mass.
export const NUTRIENT_EQUIVALENCE = {
  ureaNFraction: 0.46, // Urea is 46% N
  dapPFraction: 0.205, // DAP is 46% P2O5 ~= 20.5% elemental P
  mopKFraction: 0.498, // MOP is 60% K2O; K = K2O x 0.83 conversion factor = 49.8% elemental K
}

export const CROP_N_K_RATES = {
  maize: { label: 'Maize', nutrient: 'N', rateKgPerHa: 90, icon: '🌽' },
  rice: { label: 'Rice', nutrient: 'N', rateKgPerHa: 80, icon: '🌾' },
  cassava: { label: 'Cassava', nutrient: 'K', rateKgPerHa: 100, icon: '🌿' },
  vegetables: { label: 'Vegetables', nutrient: 'N', rateKgPerHa: 150, icon: '🥬' },
}

export const ELECTRICITY_PRICE_NGN_PER_KWH = {
  value: 80,
  source: '₦80/kWh = indicative Nigerian grid buy-in rate 2025',
}
