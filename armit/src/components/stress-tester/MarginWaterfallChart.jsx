import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatUsd2 } from '../../lib/format.js'

const COLORS = { BASE: '#00B4D8', BEAR: '#E76F51', BULL: '#2EC4B6' }

export default function MarginWaterfallChart({ scenarios }) {
  const data = scenarios.map((s) => ({ name: s.badge, value: s.metrics.carbonAdjustedPerBbl }))

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">
        Margin Waterfall — Carbon-Adjusted Net Margin
      </h3>
      <div className="mt-2 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 16, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#A8B2C1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
            <YAxis tick={{ fill: '#A8B2C1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ background: '#1B2E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFFFFF', fontSize: 12 }}
              formatter={(value) => [formatUsd2(value), 'Carbon-adjusted margin']}
            />
            <ReferenceLine y={0} stroke="#A8B2C1" strokeDasharray="4 4" label={{ value: 'Breakeven', fill: '#A8B2C1', fontSize: 11, position: 'insideBottomLeft' }} />
            <ReferenceLine y={2} stroke="#F4A261" strokeDasharray="4 4" label={{ value: 'Min. viable ($2.00)', fill: '#F4A261', fontSize: 11, position: 'insideTopLeft' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={COLORS[entry.name]} />
              ))}
              <LabelList
                dataKey="value"
                content={({ x, y, width, height, value }) =>
                  value < 0 ? (
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 4}
                      fill="#FFFFFF"
                      fontSize={12}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      LOSS
                    </text>
                  ) : null
                }
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
