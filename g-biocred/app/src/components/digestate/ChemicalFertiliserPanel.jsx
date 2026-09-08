import { CHEMICAL_FERTILIZERS } from '../../data/digestateEconomics.js'

export default function ChemicalFertiliserPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium text-text">Common Nigerian fertiliser products for comparison:</p>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {CHEMICAL_FERTILIZERS.map((f) => (
          <li key={f.name}>
            {f.name}: ~₦{f.pricePerKgNgn}/kg retail
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        Digestate N is organically bound — release is slower than synthetic fertiliser but
        improves soil structure and microbial activity.
      </p>
      <p className="mt-2 text-xs italic text-muted">
        Source: Nigerian fertiliser market reference 2025 (indicative)
      </p>
    </div>
  )
}
