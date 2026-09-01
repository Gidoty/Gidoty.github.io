import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNum0 } from '../../lib/format.js'
import { formatBpd } from '../../utils/formatters.js'

export default function YieldComparisonChart({ optionA, optionB }) {
  const data = [
    { name: 'LPG', A: optionA.result.slate.lpg.bpd, B: optionB.result.slate.lpg.bpd },
    { name: 'Motor Spirit', A: optionA.result.slate.motorSpirit.bpd, B: optionB.result.slate.motorSpirit.bpd },
    { name: 'Kerosene', A: optionA.result.slate.kerosene.bpd, B: optionB.result.slate.kerosene.bpd },
    { name: 'Diesel', A: optionA.result.slate.diesel.bpd, B: optionB.result.slate.diesel.bpd },
    { name: 'Fuel Oil', A: optionA.result.slate.fuelOil.bpd, B: optionB.result.slate.fuelOil.bpd },
  ]

  return (
    <div className="rounded-xl border border-white/10 bg-armit-card p-5">
      <h3 className="text-sm font-semibold text-armit-text">Yield Comparison (bpd)</h3>
      <div className="mt-2 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#A8B2C1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
            <YAxis tick={{ fill: '#A8B2C1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} tickFormatter={(v) => formatNum0(v)} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{ background: '#1B2E3C', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#FFFFFF', fontSize: 12 }}
              formatter={(value) => formatBpd(value)}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: '#A8B2C1' }} formatter={(value) => (value === 'A' ? 'Option A' : 'Option B')} />
            <Bar dataKey="A" name="A" fill="#00B4D8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="B" name="B" fill="#F4A261" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
