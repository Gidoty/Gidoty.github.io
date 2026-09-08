export function formatInt(value) {
  return Math.round(Number(value) || 0).toLocaleString('en-NG')
}

export function formatDecimal(value, digits = 2) {
  return Number(value || 0).toLocaleString('en-NG', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatM3(value) {
  return `${formatDecimal(value, 2)} m³`
}

export function formatKwh(value) {
  return `${formatDecimal(value, 1)} kWh`
}

export function formatKg(value) {
  return `${formatDecimal(value, 1)} kg`
}

export function formatPercent(fraction, digits = 0) {
  return `${(Number(fraction) * 100).toFixed(digits)}%`
}

export function formatNGN(value) {
  return `₦${formatInt(value)}`
}

export function formatUSD(value) {
  return `USD ${formatDecimal(value, 2)}`
}

export function formatCO2e(value) {
  return `${formatDecimal(value, 3)} t CO₂e`
}
