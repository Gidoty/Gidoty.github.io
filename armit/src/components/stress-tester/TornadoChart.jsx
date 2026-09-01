import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatUsd2 } from '../../lib/format.js'

export default function TornadoChart({ data }) {
  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Margin Sensitivity — Tornado Chart</h3>
      <p className="mt-1 text-xs text-armit-muted">
        Variables sorted by margin sensitivity — which price movement hurts or helps you most (±10%
        from BASE, carbon-adjusted USD/bbl).
      </p>
      <div className="mt-3 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#A8B2C1', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              tickFormatter={(v) => `$${v.toFixed(1)}`}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fill: '#FFFFFF', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              width={120}
            />
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ background: '#1B2E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFFFFF', fontSize: 12 }}
              formatter={(value, name) => [`${formatUsd2(value)}/bbl`, name === 'impactUp' ? '+10%' : '-10%']}
            />
            <Bar dataKey="impactUp" name="impactUp" fill="#00B4D8" radius={[0, 4, 4, 0]} />
            <Bar dataKey="impactDown" name="impactDown" fill="#E76F51" radius={[4, 0, 0, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-6 text-[11px] text-armit-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-armit-teal" /> +10% impact
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-armit-coral" /> -10% impact
        </span>
      </div>
    </div>
  )
}
