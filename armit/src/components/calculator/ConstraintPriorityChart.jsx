import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatUsd2 } from '../../lib/format.js'

export default function ConstraintPriorityChart({ rows }) {
  const data = [...rows]
    .sort((a, b) => b.shadowPrice - a.shadowPrice)
    .map((r) => ({ name: r.unit, value: Number(r.shadowPrice.toFixed(2)), suffix: r.shadowSuffix }))

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">
        Where to invest first — ranked by daily margin impact
      </h3>
      <div className="mt-2 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
            <XAxis
              type="number"
              tickFormatter={(v) => `$${v}`}
              tick={{ fill: '#A8B2C1', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#FFFFFF', fontSize: 13 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              width={48}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: '#1B2E3C',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 12,
              }}
              formatter={(value, _name, item) => [
                `${formatUsd2(value)} ${item.payload.suffix}`,
                'Shadow price',
              ]}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.value > 0 ? '#00B4D8' : '#4b5f70'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
