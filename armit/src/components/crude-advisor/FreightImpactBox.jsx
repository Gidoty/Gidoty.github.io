import { formatNum0, formatUsd2 } from '../../lib/format.js'

function OptionBreakdown({ label, accent, option }) {
  const freightHandling = option.freight + option.port
  const freightPctOfMargin =
    option.result.grossMarginPerDay !== 0
      ? (freightHandling / option.result.grossMarginPerBbl) * 100
      : 0

  return (
    <div className={`rounded-lg border p-4 ${accent === 'teal' ? 'border-armit-teal/30' : 'border-armit-amber/30'}`}>
      <div className={`text-xs font-bold uppercase tracking-wide ${accent === 'teal' ? 'text-armit-teal' : 'text-armit-amber'}`}>
        {label}
      </div>
      <dl className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-armit-muted">FOB cost</dt>
          <dd className="text-armit-text">{formatUsd2(option.fob)}/bbl</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-armit-muted">Freight + handling</dt>
          <dd className="text-armit-text">{formatUsd2(freightHandling)}/bbl</dd>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2 font-semibold">
          <dt className="text-armit-text">Total delivered</dt>
          <dd className="text-armit-text">{formatUsd2(option.deliveredCost)}/bbl</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-armit-muted">Freight as % of gross margin</dt>
          <dd className="text-armit-text">{freightPctOfMargin.toFixed(1)}%</dd>
        </div>
      </dl>
    </div>
  )
}

export default function FreightImpactBox({ optionA, optionB, throughputBpd }) {
  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Freight and Logistics Impact</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <OptionBreakdown label="Option A" accent="teal" option={optionA} />
        <OptionBreakdown label="Option B" accent="amber" option={optionB} />
      </div>
      <p className="mt-4 text-xs text-armit-muted">
        Every USD 1.00/bbl difference in freight equals{' '}
        <span className="font-semibold text-armit-text">USD {formatNum0(throughputBpd)}</span>/day
        in margin impact at your current throughput.
      </p>
    </div>
  )
}
