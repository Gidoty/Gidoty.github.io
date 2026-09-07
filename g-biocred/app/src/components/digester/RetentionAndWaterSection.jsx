import { getWaterRatio, calcSlurry } from '../../utils/calcEngine.js'
import { formatDecimal } from '../../utils/format.js'

export default function RetentionAndWaterSection({
  substrate,
  useDefaultHrt,
  onUseDefaultHrtChange,
  hrtDays,
  onHrtDaysChange,
  dailyWasteKg,
}) {
  const ratio = getWaterRatio(substrate?.id)
  const { waterLitres, totalSlurryLitres } = calcSlurry(dailyWasteKg, substrate?.id)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-lg font-semibold text-text">Hydraulic Retention Time (HRT)</h2>
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div>
            <p className="text-sm text-text">
              {substrate
                ? `HRT for ${substrate.name}: ${substrate.hrt} days (recommended)`
                : 'Select a substrate to see its recommended HRT'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={useDefaultHrt}
            onClick={() => onUseDefaultHrtChange(!useDefaultHrt)}
            disabled={!substrate}
            className={`h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-40 ${
              useDefaultHrt ? 'bg-accent' : 'bg-border'
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                useDefaultHrt ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {!useDefaultHrt && (
          <div className="mt-3">
            <label className="mb-1 block text-sm text-text" htmlFor="hrt-slider">
              Custom HRT: {hrtDays} days
            </label>
            <input
              id="hrt-slider"
              type="range"
              min="15"
              max="60"
              value={hrtDays}
              onChange={(e) => onHrtDaysChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <p className="mt-1 text-xs text-muted">
              Longer HRT = larger digester but more complete digestion. Nigerian ambient
              temperature (25-35°C) typically requires 20-40 days for mesophilic digestion.
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold text-text">Slurry Dilution</h2>
        <p className="text-xs text-muted">
          Most substrates require water addition to achieve optimal slurry concentration (8-12%
          TS for fixed dome).
        </p>
        <div className="mt-2 rounded-lg border border-border bg-card p-3 text-sm">
          <p className="text-text">
            {substrate ? substrate.name : 'Default'} — recommended ratio: {ratio.label}
          </p>
          <p className="mt-1 text-muted">
            Waste {formatDecimal(dailyWasteKg, 1)} L + water {formatDecimal(waterLitres, 1)} L
          </p>
        </div>
      </div>

      <p className="text-sm text-muted">
        Total daily slurry input:{' '}
        <span className="font-medium text-text">{formatDecimal(totalSlurryLitres, 1)} litres/day</span>
      </p>
    </div>
  )
}
