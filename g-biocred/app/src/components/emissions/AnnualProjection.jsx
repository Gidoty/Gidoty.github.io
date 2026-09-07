import { formatDecimal } from '../../utils/format.js'
import { OPERATING_DAYS_PER_YEAR } from '../../utils/calcEngine.js'

export default function AnnualProjection({ annualTonnes, classification }) {
  if (annualTonnes === null) return null

  return (
    <div className="rounded-xl border border-cyan/40 bg-cyan/10 p-5">
      <p className="text-text">
        Annual avoided emissions ({OPERATING_DAYS_PER_YEAR} operating days):{' '}
        <span className="font-semibold">{formatDecimal(annualTonnes, 2)} tonnes CO₂e/year</span>
      </p>
      {classification && (
        <p className="mt-2 text-sm text-muted">
          This qualifies as:{' '}
          <span className="rounded-full bg-panel px-2 py-0.5 text-xs font-semibold text-text">
            {classification.label}
          </span>
        </p>
      )}
    </div>
  )
}
