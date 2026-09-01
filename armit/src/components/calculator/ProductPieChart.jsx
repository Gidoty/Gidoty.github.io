import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatNum0, formatNum1 } from '../../lib/format.js'

const COLORS = ['#00B4D8', '#F4A261', '#2EC4B6', '#E76F51', '#8ecae6', '#748cab']

export default function ProductPieChart({ slate }) {
  const data = Object.values(slate).map((p) => ({ name: p.label, value: p.bpd }))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Product Slate Breakdown</h3>
      <div className="mt-2 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="80%"
              paddingAngle={2}
              stroke="#1E3A4C"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#1B2E3C',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#FFFFFF',
                fontSize: 12,
              }}
              formatter={(value) => [
                `${formatNum0(value)} bpd (${formatNum1((value / total) * 100)}%)`,
                undefined,
              ]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              wrapperStyle={{ fontSize: 12, color: '#A8B2C1' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
