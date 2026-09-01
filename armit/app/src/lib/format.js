// Back-compat wrapper: every page already imports these names. Rather than
// touching every call site, this delegates to the canonical formatters in
// src/utils/formatters.js so the whole app renders "USD 1,234,567.89"
// consistently (commas, 2 decimals, USD prefix) from one place.
import { formatUSD, formatNum0 as num0, formatNum1 as num1 } from '../utils/formatters.js'

const num2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatUsd0 = (value) => formatUSD(value)
export const formatUsd2 = (value) => formatUSD(value)
export const formatNum0 = (value) => num0(value)
export const formatNum1 = (value) => num1(value)
export const formatNum2 = (value) => num2.format(value)
