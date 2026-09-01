import { Scale, Trophy } from 'lucide-react'
import { formatUsd0, formatUsd2 } from '../../lib/format.js'

const COMPARABLE_THRESHOLD_USD = 0.5

export default function WinnerCard({ optionA, optionB, throughputBpd }) {
  const marginA = optionA.result.netMarginPerBbl
  const marginB = optionB.result.netMarginPerBbl
  const diffPerBbl = Math.abs(marginA - marginB)

  if (diffPerBbl <= COMPARABLE_THRESHOLD_USD) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-armit-amber/50 bg-armit-amber/10 px-8 py-8 text-center">
        <Scale size={28} className="text-armit-amber" />
        <h2 className="text-xl font-bold text-armit-text">
          Margins are comparable — within {formatUsd2(COMPARABLE_THRESHOLD_USD)}/bbl
        </h2>
        <p className="max-w-2xl text-sm text-armit-muted">
          Consider sulphur content, freight reliability, and supply security in your final
          decision.
        </p>
      </div>
    )
  }

  const winnerIsA = marginA > marginB
  const winner = winnerIsA ? optionA : optionB
  const winnerLabel = winnerIsA ? 'Option A' : 'Option B'
  const diffPerDay = diffPerBbl * throughputBpd
  const annualDiff = diffPerDay * 330

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-armit-emerald/50 bg-armit-emerald/10 px-8 py-8 text-center">
      <Trophy size={28} className="text-armit-emerald" />
      <h2 className="text-xl font-bold text-armit-text">
        {winnerLabel} ({winner.crude.name}) is the better choice
      </h2>
      <p className="text-lg font-semibold text-armit-emerald">
        Advantage: {formatUsd2(diffPerBbl)}/bbl &nbsp;|&nbsp; {formatUsd0(diffPerDay)}/day
      </p>
      <p className="text-sm text-armit-muted">
        Annual advantage at {throughputBpd.toLocaleString('en-US')} bpd:{' '}
        <span className="font-semibold text-armit-text">{formatUsd0(annualDiff)}</span>/year
      </p>
    </div>
  )
}
