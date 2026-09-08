import { FERTILIZER_PRICES } from '../../data/digestateEconomics.js'

export default function PriceBasisPanel({
  priceBasis,
  onPriceBasisChange,
  useCustomPrices,
  onUseCustomPricesChange,
  customPrices,
  onCustomPriceChange,
}) {
  const basis = FERTILIZER_PRICES[priceBasis]
  const currencyPrefix = priceBasis === 'ngn' ? '₦' : 'USD '

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text">Fertiliser Price Basis</h2>
      <div className="space-y-2">
        {Object.entries(FERTILIZER_PRICES).map(([key, option]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-text">
            <input
              type="radio"
              name="price-basis"
              checked={priceBasis === key}
              onChange={() => onPriceBasisChange(key)}
              className="h-4 w-4 accent-accent"
            />
            {option.label}
          </label>
        ))}
      </div>

      {!useCustomPrices && (
        <div className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
          <p>
            N: {currencyPrefix}
            {basis.N} /kg · P: {currencyPrefix}
            {basis.P} /kg · K: {currencyPrefix}
            {basis.K} /kg
          </p>
          <p className="mt-1 text-xs italic">Source: {basis.source}</p>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={useCustomPrices}
          onChange={(e) => onUseCustomPricesChange(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Enter custom prices
      </label>

      {useCustomPrices && (
        <div className="grid grid-cols-3 gap-2">
          {['N', 'P', 'K'].map((nutrient) => (
            <div key={nutrient}>
              <label className="mb-1 block text-xs text-muted" htmlFor={`custom-price-${nutrient}`}>
                {nutrient} price
              </label>
              <input
                id={`custom-price-${nutrient}`}
                type="number"
                min="0"
                value={customPrices[nutrient]}
                onChange={(e) => onCustomPriceChange(nutrient, e.target.value)}
                className="w-full rounded-lg border border-border bg-input px-2 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
