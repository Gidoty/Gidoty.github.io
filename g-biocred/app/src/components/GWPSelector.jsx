import { GWP_OPTIONS } from '../data/constants.js'
import CollapsibleSection from './shared/CollapsibleSection.jsx'

const CARD_META = {
  AR6_BIOGENIC: { borderClass: 'border-accent', badge: 'RECOMMENDED', badgeClass: 'bg-accent text-white' },
  AR6_FOSSIL: { borderClass: 'border-cyan', badge: null },
  AR5: { borderClass: 'border-amber', badge: null },
}

export default function GWPSelector({ selectedGWP, onChange }) {
  const selected = GWP_OPTIONS[selectedGWP]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.entries(GWP_OPTIONS).map(([key, option]) => {
          const meta = CARD_META[key]
          const active = key === selectedGWP
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                active ? `${meta.borderClass} bg-card` : 'border-border bg-card hover:border-accent/60'
              }`}
            >
              {meta.badge && (
                <span
                  className={`mb-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.badgeClass}`}
                >
                  {meta.badge}
                </span>
              )}
              <p className="font-semibold text-text">{option.label}</p>
              <dl className="mt-2 space-y-1 text-xs text-muted">
                <div className="flex justify-between">
                  <dt>GWP₁₀₀</dt>
                  <dd className="text-text">{option.gwp100.toFixed(1)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>GWP₂₀</dt>
                  <dd className="text-text">{option.gwp20.toFixed(1)}</dd>
                </div>
              </dl>
              <p className="mt-2 text-xs text-muted">{option.registries.join(' · ')}</p>
              <p className="mt-1 text-[11px] text-muted">{option.source}</p>
            </button>
          )
        })}
      </div>

      {selected && (
        <div className="rounded-lg border border-border bg-panel p-3 text-sm">
          <p className="text-text">
            Using GWP₁₀₀ = {selected.gwp100.toFixed(1)} for {selected.label}
          </p>
          <p className="text-muted">Registered under: {selected.registries.join(', ')}</p>
        </div>
      )}

      <CollapsibleSection title="Why does GWP selection matter?">
        <div className="space-y-3 text-sm text-muted">
          <p>
            Different carbon credit registries mandate different GWP vintages. Using the wrong
            GWP for your target registry can invalidate your credit calculation.
          </p>
          <p>
            For Nigerian smallholder projects targeting Gold Standard AWMS or Verra VCS, AR6
            Biogenic (GWP₁₀₀ = 27.0) is the correct choice.
          </p>
          <p>
            For legacy CDM projects (AMS-III.D, AMS-III.R), some methodologies still reference AR5
            values. Check your specific methodology version.
          </p>
          <p className="text-xs italic">Source: IPCC AR6 WGI (2021) Table 7.SM.7</p>
        </div>
      </CollapsibleSection>
    </div>
  )
}
