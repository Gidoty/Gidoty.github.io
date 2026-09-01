import { Droplet } from 'lucide-react'
import { formatUSDPerBbl } from '../../utils/formatters.js'

const SULPHUR_THRESHOLD = 0.3
const API_THRESHOLD = 3
const HT_COST_FACTOR = 0.8 // USD/bbl of extra hydrotreating cost per wt% sulphur
const YIELD_PREMIUM_FACTOR = 0.15 // % more distillate per degree API difference

export default function QualityDifferentialBox({ optionA, optionB }) {
  const sulphurDiff = Math.abs(optionA.crude.sulphur - optionB.crude.sulphur)
  const apiDiff = Math.abs(optionA.crude.api - optionB.crude.api)

  const higherSulphur = optionA.crude.sulphur > optionB.crude.sulphur ? optionA : optionB
  const lighterApi = optionA.crude.api > optionB.crude.api ? optionA : optionB

  const showSulphur = sulphurDiff > SULPHUR_THRESHOLD
  const showApi = apiDiff > API_THRESHOLD

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-armit-text">
        <Droplet size={16} className="text-armit-teal" />
        Quality Differential
      </h3>

      <div className="mt-4 space-y-3 text-sm text-armit-muted">
        {showSulphur && (
          <p>
            The higher-sulphur crude ({higherSulphur.crude.name}) will incur additional
            hydrotreating costs estimated at{' '}
            <span className="font-semibold text-armit-text">
              {formatUSDPerBbl(sulphurDiff * HT_COST_FACTOR)}
            </span>
            . This is reflected in the opex assumption. Consider increasing your variable opex
            input if your HT unit is capacity-constrained.
          </p>
        )}
        {showApi && (
          <p>
            The lighter crude ({lighterApi.crude.name}, {lighterApi.crude.api}&deg; API) will
            yield approximately{' '}
            <span className="font-semibold text-armit-text">
              {(apiDiff * YIELD_PREMIUM_FACTOR).toFixed(2)}%
            </span>{' '}
            more distillate fractions. This quality premium is captured in the yield model above.
          </p>
        )}
        {!showSulphur && !showApi && (
          <p>Crude qualities are broadly comparable — no material sulphur or API differential.</p>
        )}
      </div>
    </div>
  )
}
