import { formatM3 } from '../../utils/format.js'
import { sizingCategory } from '../../utils/calcEngine.js'

export default function VolumeSummary({ volumes, digesterType }) {
  const category = sizingCategory(volumes.chamberM3)

  return (
    <div className="rounded-xl border border-accent/40 bg-card p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Recommended Digester Size
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-sm text-muted">Digestion Chamber</p>
          <p className="text-4xl font-bold text-accent">{formatM3(volumes.chamberM3)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Gas Storage Volume</p>
          <p className="text-2xl font-semibold text-cyan">{formatM3(volumes.gasStorageM3)}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Total Plant Volume</p>
          <p className="text-2xl font-semibold text-text">{formatM3(volumes.totalM3)}</p>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4 text-sm text-muted">
        <p>For {digesterType.label}</p>
        <p>Safety factor: {digesterType.safetyFactor.toFixed(2)}</p>
      </div>

      <div className="mt-4 rounded-lg border border-amber/40 bg-amber/10 p-3 text-sm text-text">
        <p className="font-semibold">{category.label}</p>
        <p className="text-muted">{category.description}</p>
      </div>
    </div>
  )
}
