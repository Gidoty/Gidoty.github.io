// ARMIT global formatting utilities. Single source of truth for how every
// number is displayed across the app — see src/lib/format.js, which wraps
// these for the pre-existing call sites rather than duplicating them.

const usd2 = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const num0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const num1 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })

/** "USD 1,234,567.89" */
export function formatUSD(value) {
  return `USD ${usd2.format(value)}`
}

/** "USD 12.34/bbl" */
export function formatUSDPerBbl(value) {
  return `USD ${usd2.format(value)}/bbl`
}

/** "60,000 bpd" */
export function formatBpd(value) {
  return `${num0.format(value)} bpd`
}

/** "12.3%" */
export function formatPct(value) {
  return `${num1.format(value)}%`
}

/** "25.3 Gcal/hr" */
export function formatGcal(value) {
  return `${num1.format(value)} Gcal/hr`
}

// Generic (non-currency, non-unit-suffixed) number helpers, for values that
// carry their own unit context in the surrounding UI (e.g. API gravity,
// EII index, octane points, MMscfd amounts).
export function formatNum0(value) {
  return num0.format(value)
}
export function formatNum1(value) {
  return num1.format(value)
}
