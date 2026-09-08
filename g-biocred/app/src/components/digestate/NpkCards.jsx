import { NUTRIENT_EQUIVALENCE } from '../../data/digestateEconomics.js'
import { formatDecimal, formatPercent } from '../../utils/format.js'

function Card({ colorClass, title, valueKg, sharePct, equivalentKg, equivalentLabel }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className={`text-2xl font-bold sm:text-3xl ${colorClass}`}>{formatDecimal(valueKg, 1)} kg</p>
      <p className="mt-1 text-sm font-medium text-text">{title}</p>
      <p className="mt-1 text-xs text-muted">{formatPercent(sharePct, 1)} of digestate weight</p>
      <p className="mt-2 text-xs text-muted">
        Equivalent to {formatDecimal(equivalentKg, 1)} kg {equivalentLabel}
      </p>
    </div>
  )
}

export default function NpkCards({ npk, digestateKg }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        colorClass="text-accent"
        title="Nitrogen (N)"
        valueKg={npk.nKg}
        sharePct={npk.nKg / digestateKg}
        equivalentKg={npk.nKg / NUTRIENT_EQUIVALENCE.ureaNFraction}
        equivalentLabel="urea"
      />
      <Card
        colorClass="text-amber"
        title="Phosphorus (P)"
        valueKg={npk.pKg}
        sharePct={npk.pKg / digestateKg}
        equivalentKg={npk.pKg / NUTRIENT_EQUIVALENCE.dapPFraction}
        equivalentLabel="DAP (DAP is 20.5% P)"
      />
      <Card
        colorClass="text-cyan"
        title="Potassium (K)"
        valueKg={npk.kKg}
        sharePct={npk.kKg / digestateKg}
        equivalentKg={npk.kKg / NUTRIENT_EQUIVALENCE.mopKFraction}
        equivalentLabel="MOP (MOP is 49.8% elemental K, from 60% K₂O × 0.83)"
      />
    </div>
  )
}
