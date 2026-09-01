import { Printer } from 'lucide-react'
import { formatNum0, formatUsd0 } from '../../lib/format.js'

export default function CombinedSummary({ interventions }) {
  const totalDaily = interventions.reduce((sum, i) => sum + i.dailyGain, 0)
  const totalAnnual = interventions.reduce((sum, i) => sum + i.annualGain, 0)
  const totalCost = interventions.reduce((sum, i) => sum + i.cost, 0)
  const blendedPayback = totalDaily > 0 ? totalCost / totalDaily : null
  const firstYearNet = totalAnnual - totalCost

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold text-armit-text sm:text-3xl">
          Combined Intervention Impact
        </h2>
        <button
          type="button"
          onClick={() => window.print()}
          className="print:hidden inline-flex items-center gap-1.5 rounded-lg bg-armit-teal px-4 py-2 text-sm font-semibold text-armit-bg transition hover:bg-armit-teal/90"
        >
          <Printer size={16} />
          Generate Intervention Report
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-armit-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-armit-muted">
                <th className="py-2 pr-4 font-medium">Intervention</th>
                <th className="py-2 pr-4 font-medium">Daily Gain (USD)</th>
                <th className="py-2 pr-4 font-medium">Annual Gain (USD)</th>
                <th className="py-2 pr-4 font-medium">Cost (USD)</th>
                <th className="py-2 pr-4 font-medium">Payback (days)</th>
                <th className="py-2 pr-0 font-medium">ROI (%)</th>
              </tr>
            </thead>
            <tbody>
              {interventions.map((item) => (
                <tr key={item.name} className="border-b border-white/5 last:border-0">
                  <td className="py-2.5 pr-4 text-armit-text">{item.name}</td>
                  <td className="py-2.5 pr-4 text-armit-muted">{formatUsd0(item.dailyGain)}</td>
                  <td className="py-2.5 pr-4 text-armit-muted">{formatUsd0(item.annualGain)}</td>
                  <td className="py-2.5 pr-4 text-armit-muted">{formatUsd0(item.cost)}</td>
                  <td className="py-2.5 pr-4 text-armit-muted">
                    {item.cost > 0 && item.paybackDays !== null ? formatNum0(item.paybackDays) : '—'}
                  </td>
                  <td className="py-2.5 pr-0 text-armit-muted">
                    {item.roi === null ? 'N/A' : `${formatNum0(item.roi)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10 font-semibold">
                <td className="py-2.5 pr-4 text-armit-text">Total</td>
                <td className="py-2.5 pr-4 text-armit-teal">{formatUsd0(totalDaily)}</td>
                <td className="py-2.5 pr-4 text-armit-teal">{formatUsd0(totalAnnual)}</td>
                <td className="py-2.5 pr-4 text-armit-teal">{formatUsd0(totalCost)}</td>
                <td className="py-2.5 pr-4 text-armit-teal">
                  {blendedPayback !== null ? formatNum0(blendedPayback) : '—'}
                </td>
                <td className="py-2.5 pr-0 text-armit-teal">
                  {totalCost > 0 ? `${formatNum0(((totalAnnual - totalCost) / totalCost) * 100)}%` : 'N/A'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-armit-teal/40 bg-armit-teal/5 p-8">
        <h3 className="text-center text-lg font-bold text-armit-text">
          If all interventions are implemented:
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="text-2xl font-bold text-armit-teal">{formatUsd0(totalDaily)}</div>
            <div className="mt-1 text-xs text-armit-muted">Total daily margin improvement</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-armit-teal">{formatUsd0(totalAnnual)}</div>
            <div className="mt-1 text-xs text-armit-muted">Total annual gain</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-armit-text">{formatUsd0(totalCost)}</div>
            <div className="mt-1 text-xs text-armit-muted">Total investment required</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-armit-text">
              {blendedPayback !== null ? `${formatNum0(blendedPayback)} days` : '—'}
            </div>
            <div className="mt-1 text-xs text-armit-muted">Blended payback</div>
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${firstYearNet >= 0 ? 'text-armit-emerald' : 'text-armit-coral'}`}
            >
              {formatUsd0(firstYearNet)}
            </div>
            <div className="mt-1 text-xs text-armit-muted">First-year net return</div>
          </div>
        </div>
      </div>
    </div>
  )
}
