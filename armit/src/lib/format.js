const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const usd2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const num0 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const num1 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 })
const num2 = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export const formatUsd0 = (value) => usd0.format(value)
export const formatUsd2 = (value) => usd2.format(value)
export const formatNum0 = (value) => num0.format(value)
export const formatNum1 = (value) => num1.format(value)
export const formatNum2 = (value) => num2.format(value)
