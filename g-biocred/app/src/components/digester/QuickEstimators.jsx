import { useState } from 'react'
import CollapsibleSection from '../shared/CollapsibleSection.jsx'
import { SUBSTRATES } from '../../data/substrates.js'
import { formatDecimal } from '../../utils/format.js'

const CATTLE_RATE = SUBSTRATES.cowDung.wasteGenRate_kg_per_head_per_day
const POULTRY_RATE = SUBSTRATES.poultryLitter.wasteGenRate_kg_per_head_per_day
const CASSAVA_PEEL_PER_TONNE = SUBSTRATES.cassavaPeels.wasteGenRate_pctOfFreshTuber * 1000

export default function QuickEstimators({ onUseEstimate }) {
  const [cattle, setCattle] = useState('')
  const [poultry, setPoultry] = useState('')
  const [cassavaTonnes, setCassavaTonnes] = useState('')

  const cattleTotal = (Number(cattle) || 0) * CATTLE_RATE
  const poultryTotal = (Number(poultry) || 0) * POULTRY_RATE
  const cassavaTotal = (Number(cassavaTonnes) || 0) * CASSAVA_PEEL_PER_TONNE

  return (
    <CollapsibleSection title="Estimate from herd/flock size">
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text">Cattle:</span>
          <input
            type="number"
            min="0"
            value={cattle}
            onChange={(e) => setCattle(e.target.value)}
            className="w-24 rounded-lg border border-border bg-input px-2 py-1 text-text"
          />
          <span className="text-muted">
            head × {CATTLE_RATE} kg/day = {formatDecimal(cattleTotal, 1)} kg/day
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text">Poultry:</span>
          <input
            type="number"
            min="0"
            value={poultry}
            onChange={(e) => setPoultry(e.target.value)}
            className="w-24 rounded-lg border border-border bg-input px-2 py-1 text-text"
          />
          <span className="text-muted">
            birds × {POULTRY_RATE} kg/day = {formatDecimal(poultryTotal, 1)} kg/day
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text">Cassava processing:</span>
          <input
            type="number"
            min="0"
            value={cassavaTonnes}
            onChange={(e) => setCassavaTonnes(e.target.value)}
            className="w-24 rounded-lg border border-border bg-input px-2 py-1 text-text"
          />
          <span className="text-muted">
            tonnes/day × {CASSAVA_PEEL_PER_TONNE} kg peel/tonne = {formatDecimal(cassavaTotal, 1)}{' '}
            kg/day
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => onUseEstimate(cattleTotal)}
            disabled={!cattleTotal}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use cattle estimate
          </button>
          <button
            type="button"
            onClick={() => onUseEstimate(poultryTotal)}
            disabled={!poultryTotal}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use poultry estimate
          </button>
          <button
            type="button"
            onClick={() => onUseEstimate(cassavaTotal)}
            disabled={!cassavaTotal}
            className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use cassava estimate
          </button>
        </div>
      </div>
    </CollapsibleSection>
  )
}
