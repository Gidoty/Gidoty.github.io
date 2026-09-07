import { formatDecimal } from '../../utils/format.js'
import CollapsibleSection from '../shared/CollapsibleSection.jsx'

export default function PoaSection({ isPoa, onToggle, cpaCount, onCpaCountChange, singleAnnualTonnes }) {
  const aggregatedAnnual = singleAnnualTonnes !== null ? singleAnnualTonnes * cpaCount : null

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-text">Programme of Activities (PoA)</h2>

      <div className="inline-flex rounded-lg border border-border bg-panel p-1">
        {[
          { id: false, label: 'Single Project' },
          { id: true, label: 'PoA Aggregation' },
        ].map((opt) => (
          <button
            key={String(opt.id)}
            type="button"
            onClick={() => onToggle(opt.id)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              isPoa === opt.id ? 'bg-accent text-white' : 'text-muted hover:text-text'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {isPoa && (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm text-text" htmlFor="cpa-slider">
              Number of CPAs (smallholder units): {cpaCount}
            </label>
            <input
              id="cpa-slider"
              type="range"
              min="1"
              max="1000"
              value={cpaCount}
              onChange={(e) => onCpaCountChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          {aggregatedAnnual !== null && (
            <p className="text-sm text-text">
              Aggregated annual avoided: {formatDecimal(aggregatedAnnual, 2)} tonnes CO₂e/year
            </p>
          )}
          <CollapsibleSection title="What is PoA aggregation?">
            <p className="text-sm text-muted">
              A Programme of Activities (PoA) aggregates many small biogas digesters under one
              registration, dramatically reducing per-unit transaction costs.
            </p>
            <p className="mt-2 text-sm text-muted">
              Precedents: Nepal Biogas Support Program, SNV African Biogas Partnership Programme
              (60,000+ household digesters in 6 countries), SimGas Kenya.
            </p>
            <p className="mt-2 text-xs italic text-muted">
              Source: CDM Executive Board PoA Framework (2007); UNFCCC
            </p>
          </CollapsibleSection>
        </div>
      )}
    </div>
  )
}
