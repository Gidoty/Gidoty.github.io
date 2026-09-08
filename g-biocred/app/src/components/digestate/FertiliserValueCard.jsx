import { formatDecimal, formatInt } from '../../utils/format.js'

export default function FertiliserValueCard({ npk, value, prices, currencyPrefix, digestateKg, isNgn, ngnPerUsd }) {
  return (
    <div className="rounded-xl border border-accent/40 bg-card p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-muted">
        Total Fertiliser Replacement Value
      </p>

      <p className="mt-3 text-sm text-muted">Total digestate produced: {formatDecimal(digestateKg, 1)} kg</p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4">Nutrient</th>
              <th className="py-2 pr-4">kg</th>
              <th className="py-2 pr-4">Price/kg</th>
              <th className="py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-border">
              <td className="py-2 pr-4 text-text">N</td>
              <td className="py-2 pr-4 text-muted">{formatDecimal(npk.nKg, 1)}</td>
              <td className="py-2 pr-4 text-muted">
                {currencyPrefix}
                {prices.N}
              </td>
              <td className="py-2 text-text">
                {currencyPrefix}
                {formatDecimal(value.nValue, isNgn ? 0 : 2)}
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 pr-4 text-text">P</td>
              <td className="py-2 pr-4 text-muted">{formatDecimal(npk.pKg, 1)}</td>
              <td className="py-2 pr-4 text-muted">
                {currencyPrefix}
                {prices.P}
              </td>
              <td className="py-2 text-text">
                {currencyPrefix}
                {formatDecimal(value.pValue, isNgn ? 0 : 2)}
              </td>
            </tr>
            <tr className="border-t border-border">
              <td className="py-2 pr-4 text-text">K</td>
              <td className="py-2 pr-4 text-muted">{formatDecimal(npk.kKg, 1)}</td>
              <td className="py-2 pr-4 text-muted">
                {currencyPrefix}
                {prices.K}
              </td>
              <td className="py-2 text-text">
                {currencyPrefix}
                {formatDecimal(value.kValue, isNgn ? 0 : 2)}
              </td>
            </tr>
            <tr className="border-t border-border font-semibold">
              <td className="py-2 pr-4 text-text" colSpan={3}>
                TOTAL
              </td>
              <td className="py-2 text-accent">
                {currencyPrefix}
                {formatDecimal(value.totalValue, isNgn ? 0 : 2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-3xl font-bold text-accent">
        {isNgn ? `₦${formatInt(value.totalValue)}` : `USD ${formatDecimal(value.totalValue, 2)}`}
      </p>
      <p className="text-sm text-muted">
        {isNgn
          ? `= USD ${formatDecimal(value.totalValue / ngnPerUsd, 2)}`
          : `= ₦${formatInt(value.totalValue * ngnPerUsd)}`}
      </p>
      <p className="mt-2 text-xs text-muted">
        This is the market value of synthetic fertiliser your digestate replaces.
      </p>
    </div>
  )
}
