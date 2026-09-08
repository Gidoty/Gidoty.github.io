import { CROP_N_K_RATES } from '../../data/digestateEconomics.js'
import { formatDecimal } from '../../utils/format.js'

export default function CropCoveragePanel({ coverage }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="font-medium text-text">Your digestate can fertilise approximately:</p>
      <ul className="mt-3 space-y-2 text-sm text-muted">
        <li>
          {CROP_N_K_RATES.maize.icon} {formatDecimal(coverage.maizeHa, 2)} ha of maize
        </li>
        <li>
          {CROP_N_K_RATES.rice.icon} {formatDecimal(coverage.riceHa, 2)} ha of rice
        </li>
        <li>
          {CROP_N_K_RATES.cassava.icon} {formatDecimal(coverage.cassavaHa, 2)} ha of cassava
        </li>
        <li>
          {CROP_N_K_RATES.vegetables.icon} {formatDecimal(coverage.vegetablesHa, 2)} ha of vegetables
        </li>
      </ul>
      <p className="mt-2 text-xs text-muted">
        Based on standard recommended N application rates for Nigerian conditions. Actual field
        rates vary by soil type and variety.
      </p>
    </div>
  )
}
