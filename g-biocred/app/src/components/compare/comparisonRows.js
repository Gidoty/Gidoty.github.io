import { formatDecimal, formatNGN, formatUSD } from '../../utils/format.js'

const t = (v) => (v == null ? '—' : `${formatDecimal(v, 3)} t CO₂e`)
const kg = (v) => (v == null ? '—' : `${formatDecimal(v, 1)} kg`)
const m3 = (v) => (v == null ? '—' : `${formatDecimal(v, 2)} m³`)
const kwh = (v) => (v == null ? '—' : `${formatDecimal(v, 1)} kWh`)
const pct = (v) => (v == null ? '—' : `${formatDecimal(v, 1)}%`)
const usd = (v) => (v == null ? '—' : formatUSD(v))
const ngn = (v) => (v == null ? '—' : formatNGN(v))

export const COMPARISON_ROWS = [
  { group: 'Yield Metrics', label: 'Fresh weight (kg/day)', get: (r) => r.yield.freshWeightKgPerDay, format: kg, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Total solids (kg/day)', get: (r) => r.yield.tsKgPerDay, format: kg, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Volatile solids (kg/day)', get: (r) => r.yield.vsKgPerDay, format: kg, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Daily biogas (m³/day)', get: (r) => r.yield.biogasM3PerDay, format: m3, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Daily CH₄ (m³/day)', get: (r) => r.yield.ch4M3PerDay, format: m3, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Daily electricity (kWh/day)', get: (r) => r.yield.electricalKwhPerDay, format: kwh, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Daily thermal energy (kWh/day)', get: (r) => r.yield.thermalKwhPerDay, format: kwh, higherIsBetter: true },
  { group: 'Yield Metrics', label: 'Annual biogas (m³/year)', get: (r) => r.yield.annualBiogasM3, format: m3, higherIsBetter: true },

  { group: 'Emissions Metrics', label: 'Baseline emissions (t CO₂e/year)', get: (r) => r.emissions.baselineTonnesPerYear, format: t, higherIsBetter: null },
  { group: 'Emissions Metrics', label: 'Project leakage (t CO₂e/year)', get: (r) => r.emissions.projectTonnesPerYear, format: t, higherIsBetter: false },
  { group: 'Emissions Metrics', label: 'Net avoided (t CO₂e/year)', get: (r) => r.emissions.avoidedTonnesPerYear, format: t, higherIsBetter: true },
  { group: 'Emissions Metrics', label: 'Reduction vs baseline (%)', get: (r) => r.emissions.reductionPct, format: pct, higherIsBetter: true },
  {
    group: 'Emissions Metrics',
    label: 'Applicable methodology',
    get: (r) => r.emissions.classification?.label ?? null,
    format: (v) => v ?? '—',
    higherIsBetter: null,
    isText: true,
  },

  { group: 'Carbon Credit Metrics', label: 'Annual credits (t CO₂e)', get: (r) => r.emissions.avoidedTonnesPerYear, format: t, higherIsBetter: true },
  { group: 'Carbon Credit Metrics', label: 'Annual value — conservative (USD)', get: (r) => r.carbon.annualConservativeUsd, format: usd, higherIsBetter: true },
  { group: 'Carbon Credit Metrics', label: 'Annual value — mid (USD)', get: (r) => r.carbon.annualMidUsd, format: usd, higherIsBetter: true },
  { group: 'Carbon Credit Metrics', label: 'Annual value — premium (USD)', get: (r) => r.carbon.annualPremiumUsd, format: usd, higherIsBetter: true },
  { group: 'Carbon Credit Metrics', label: '10yr NPV — mid scenario (USD)', get: (r) => r.carbon.npvMidUsd, format: usd, higherIsBetter: true },

  { group: 'Digestate Metrics', label: 'N content (kg/year)', get: (r) => r.digestate.nKgPerYear, format: kg, higherIsBetter: true },
  { group: 'Digestate Metrics', label: 'P content (kg/year)', get: (r) => r.digestate.pKgPerYear, format: kg, higherIsBetter: true },
  { group: 'Digestate Metrics', label: 'K content (kg/year)', get: (r) => r.digestate.kKgPerYear, format: kg, higherIsBetter: true },
  { group: 'Digestate Metrics', label: 'Digestate fertiliser value (₦/year)', get: (r) => r.digestate.valueNgnPerYear, format: ngn, higherIsBetter: true },

  { group: 'Digester Sizing', label: 'Recommended digester size (m³)', get: (r) => r.digester.recommendedVolumeM3, format: m3, higherIsBetter: null },
  { group: 'Digester Sizing', label: 'Estimated construction cost (USD)', get: (r) => r.digester.costUsd, format: usd, higherIsBetter: false },

  { group: 'Combined Economics', label: 'Annual energy value (₦)', get: (r) => r.combined.energyValueNgn, format: ngn, higherIsBetter: true },
  { group: 'Combined Economics', label: 'Annual carbon value NGN (₦)', get: (r) => r.combined.carbonValueNgn, format: ngn, higherIsBetter: true },
  { group: 'Combined Economics', label: 'Annual digestate value (₦)', get: (r) => r.combined.digestateValueNgn, format: ngn, higherIsBetter: true },
  { group: 'Combined Economics', label: 'Total combined annual value (₦)', get: (r) => r.combined.totalNgn, format: ngn, higherIsBetter: true },
  { group: 'Combined Economics', label: 'Total combined annual value (USD)', get: (r) => r.combined.totalUsd, format: usd, higherIsBetter: true },
]
