import { Download } from 'lucide-react'
import { formatNum0, formatUsd0 } from '../../lib/format.js'
import { formatPct } from '../../utils/formatters.js'

function downloadCsv(slate, throughputBpd) {
  const header = ['Product', 'Volume (bpd)', 'Volume (% of crude)', 'Revenue (USD/day)']
  const rows = Object.values(slate).map((p) => [
    p.label,
    p.bpd.toFixed(1),
    p.pctOfCrude.toFixed(2),
    p.revenuePerDay.toFixed(2),
  ])
  const totalBpd = Object.values(slate).reduce((sum, p) => sum + p.bpd, 0)
  const totalRevenue = Object.values(slate).reduce((sum, p) => sum + p.revenuePerDay, 0)
  rows.push([
    'Total',
    totalBpd.toFixed(1),
    ((totalBpd / throughputBpd) * 100).toFixed(2),
    totalRevenue.toFixed(2),
  ])

  const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'armit-yield-slate.csv'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function YieldTable({ slate, throughputBpd }) {
  const products = Object.values(slate)
  const totalBpd = products.reduce((sum, p) => sum + p.bpd, 0)
  const totalRevenue = products.reduce((sum, p) => sum + p.revenuePerDay, 0)

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-armit-text">Product Yield &amp; Revenue Slate</h3>
        <button
          type="button"
          onClick={() => downloadCsv(slate, throughputBpd)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-armit-bg px-3 py-1.5 text-xs font-medium text-armit-text transition hover:border-armit-teal/40 hover:text-armit-teal"
        >
          <Download size={14} />
          Download CSV
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-armit-muted">
              <th className="py-2 pr-4 font-medium">Product</th>
              <th className="py-2 pr-4 font-medium">Volume (bpd)</th>
              <th className="py-2 pr-4 font-medium">Vol % of crude</th>
              <th className="py-2 pr-0 text-right font-medium">Revenue (USD/day)</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.label} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 pr-4 text-armit-text">{p.label}</td>
                <td className="py-2.5 pr-4 text-armit-muted">{formatNum0(p.bpd)}</td>
                <td className="py-2.5 pr-4 text-armit-muted">{formatPct(p.pctOfCrude)}</td>
                <td className="py-2.5 pr-0 text-right text-armit-text">
                  {formatUsd0(p.revenuePerDay)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-white/10 font-semibold">
              <td className="py-2.5 pr-4 text-armit-text">Total</td>
              <td className="py-2.5 pr-4 text-armit-teal">{formatNum0(totalBpd)}</td>
              <td className="py-2.5 pr-4 text-armit-teal">
                {formatPct((totalBpd / throughputBpd) * 100)}
              </td>
              <td className="py-2.5 pr-0 text-right text-armit-teal">
                {formatUsd0(totalRevenue)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
