import { formatInt, formatNGN, formatUSD } from '../../utils/format.js'
import { OPERATING_DAYS_PER_YEAR } from '../../utils/calcEngine.js'
import { CHEMICAL_FERTILIZERS } from '../../data/digestateEconomics.js'

export default function AnnualDigestateValue({ dailyTotalValueNgn, ngnPerUsd }) {
  const annualNgn = dailyTotalValueNgn * OPERATING_DAYS_PER_YEAR
  const ureaPrice = CHEMICAL_FERTILIZERS[0].pricePerKgNgn

  return (
    <div className="rounded-xl border border-cyan/40 bg-cyan/10 p-5 text-sm text-text">
      <p>
        Annual digestate value ({OPERATING_DAYS_PER_YEAR} operating days):{' '}
        <span className="font-semibold">
          {formatNGN(annualNgn)} = {formatUSD(annualNgn / ngnPerUsd)}
        </span>
      </p>
      <p className="mt-1 text-muted">
        This is equivalent to {formatInt(annualNgn / ureaPrice)} kg of Urea fertiliser per year
      </p>
    </div>
  )
}
