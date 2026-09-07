import { IPCC_MANURE } from '../../data/constants.js'

const DEFAULT_FACTOR = IPCC_MANURE.digesterLeakage.value
const CONSERVATIVE_FACTOR = 0.15

export default function LeakagePanel({ leakageFactor, onChange }) {
  const useConservative = leakageFactor === CONSERVATIVE_FACTOR

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-text">
        Digester fugitive CH₄ leakage: <span className="font-semibold">{(leakageFactor * 100).toFixed(0)}%</span>
      </p>
      <p className="mt-2 text-xs text-muted">
        A {(DEFAULT_FACTOR * 100).toFixed(0)}% leakage factor is applied to your biogas system's
        methane production, representing fugitive emissions from the digester itself. This is
        deducted from your gross avoided emissions to give net emissions avoided.
      </p>
      <p className="mt-2 text-xs text-muted">Source: {IPCC_MANURE.digesterLeakage.source}</p>

      <label className="mt-3 flex items-center gap-2 text-sm text-text">
        <input
          type="checkbox"
          checked={useConservative}
          onChange={(e) => onChange(e.target.checked ? CONSERVATIVE_FACTOR : DEFAULT_FACTOR)}
          className="h-4 w-4 accent-accent"
        />
        Use 15% (AM0073 conservative)
      </label>
    </div>
  )
}
