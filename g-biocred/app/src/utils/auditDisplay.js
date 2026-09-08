import { SUBSTRATES } from '../data/substrates.js'
import { formatDecimal, formatInt } from './format.js'
import { sha256Hex } from './audit.js'

const TYPE_META = {
  yield: { label: 'Yield Calculation', badgeClass: 'bg-accent text-white' },
  emissions: { label: 'Emissions Calculation', badgeClass: 'bg-cyan text-black' },
  carbon: { label: 'Carbon Credit Calculation', badgeClass: 'bg-amber text-black' },
  digestate: { label: 'Digestate Calculation', badgeClass: 'bg-accent text-white' },
  comparison: { label: 'Comparison', badgeClass: 'bg-warning text-black' },
}

export function normalizeAuditEntry(entry) {
  const meta = TYPE_META[entry.type] ?? { label: entry.type, badgeClass: 'bg-border text-text' }
  let substrateName = '—'
  let inputKg = null
  let keyResult = '—'

  switch (entry.type) {
    case 'yield': {
      const substrate = SUBSTRATES[entry.inputs.substrateId]
      substrateName = substrate?.name ?? '—'
      inputKg = entry.inputs.freshWeightKg
      keyResult = `${formatDecimal(entry.results.biogasM3, 2)} m³ biogas`
      break
    }
    case 'emissions': {
      const substrate = SUBSTRATES[entry.inputs.substrateId]
      substrateName = substrate?.name ?? '—'
      inputKg = entry.inputs.freshWeightKg
      keyResult =
        entry.result.avoidedTonnes != null
          ? `${formatDecimal(entry.result.avoidedTonnes, 2)} t CO₂e avoided`
          : 'N/A (no MCF)'
      break
    }
    case 'carbon': {
      keyResult = `USD ${formatInt(entry.result.annualUsd)}/year`
      break
    }
    case 'digestate': {
      const substrate = SUBSTRATES[entry.inputs.substrateId]
      substrateName = substrate?.name ?? '—'
      inputKg = entry.inputs.freshWeightKg
      keyResult = `₦${formatInt(entry.result.value.totalValue)} fertiliser value`
      break
    }
    case 'comparison': {
      substrateName = 'Multiple'
      keyResult = `${entry.inputs.length} scenarios`
      break
    }
    default:
      break
  }

  return { ...meta, substrateName, inputKg, keyResult }
}

export async function verifyAuditEntry(entry) {
  const payload =
    entry.type === 'yield' ? { inputs: entry.inputs, results: entry.results } : { inputs: entry.inputs, result: entry.result }
  const hash = await sha256Hex(payload)
  return hash === entry.hash
}
