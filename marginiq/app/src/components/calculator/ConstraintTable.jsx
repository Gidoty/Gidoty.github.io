import StatusBadge from './StatusBadge.jsx'
import { formatNum0, formatUsd2 } from '../../lib/format.js'
import { formatPct } from '../../utils/formatters.js'

export default function ConstraintTable({ rows }) {
  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Constraint Status</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-armit-muted">
              <th className="py-2 pr-4 font-medium">Unit</th>
              <th className="py-2 pr-4 font-medium">Actual Load</th>
              <th className="py-2 pr-4 font-medium">Capacity</th>
              <th className="py-2 pr-4 font-medium">Utilisation</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-0 text-right font-medium">Shadow Price</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 pr-4">
                  <div className="font-medium text-armit-text">{row.unit}</div>
                  <div className="text-[11px] text-armit-muted">{row.fullName}</div>
                </td>
                <td className="py-2.5 pr-4 text-armit-muted">
                  {formatNum0(row.actual)} {row.measure}
                </td>
                <td className="py-2.5 pr-4 text-armit-muted">
                  {formatNum0(row.capacity)} {row.measure}
                </td>
                <td className="py-2.5 pr-4 text-armit-muted">{formatPct(row.util)}</td>
                <td className="py-2.5 pr-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-2.5 pr-0 text-right">
                  {row.shadowPrice > 0 ? (
                    <span className="font-semibold text-armit-teal">
                      {formatUsd2(row.shadowPrice)}
                      <span className="ml-1 text-[11px] font-normal text-armit-muted">
                        {row.shadowSuffix}
                      </span>
                    </span>
                  ) : (
                    <span className="text-armit-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
